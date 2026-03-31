"use server";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { calculateBuyerFee, calculateTotal } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createCheckoutSession(listingId: string, quantity: number) {
  try {
    const user = await requireAuth();

    const listing = await prisma.listing.findFirst({
      where: { id: listingId, status: "ACTIVE" },
      include: {
        seller: { select: { name: true } },
        sellerProfile: { select: { verificationStatus: true } },
      },
    });

    if (!listing) return { error: "Listing not found or no longer available." };
    if (listing.sellerProfile.verificationStatus !== "APPROVED") {
      return { error: "This listing is from an unverified seller." };
    }
    if (quantity > listing.quantity) {
      return { error: `Only ${listing.quantity} tickets available.` };
    }
    if (listing.sellerId === user.id) {
      return { error: "You cannot buy your own listing." };
    }

    const subtotal = listing.pricePerTicket * quantity;
    const buyerFee = calculateBuyerFee(subtotal);
    const total = calculateTotal(subtotal);

    // Create pending purchase
    const purchase = await prisma.purchase.create({
      data: {
        listingId,
        buyerId: user.id,
        quantity,
        pricePerTicket: listing.pricePerTicket,
        subtotal,
        buyerFee,
        total,
        status: "PENDING_PAYMENT",
      },
    });

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(total * 100),
            product_data: {
              name: `${listing.eventName} — ${quantity} ticket${quantity > 1 ? "s" : ""}`,
              description: `Section ${listing.section}${listing.row ? `, Row ${listing.row}` : ""} · Verified Season Ticket Holder`,
            },
          },
        },
      ],
      metadata: {
        purchaseId: purchase.id,
        listingId,
        buyerId: user.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/purchases/${purchase.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/listings/${listingId}?canceled=1`,
      customer_email: user.email,
    });

    // Save session ID
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: { stripeSessionId: session.id },
    });

    return { url: session.url };
  } catch (err) {
    console.error("createCheckoutSession error:", err);
    return { error: "Failed to create checkout session." };
  }
}

export async function confirmTicketTransfer(purchaseId: string, transferNotes?: string) {
  try {
    const user = await requireAuth();

    const purchase = await prisma.purchase.findFirst({
      where: { id: purchaseId },
      include: { listing: { select: { sellerId: true } } },
    });

    if (!purchase) return { error: "Purchase not found." };
    if (purchase.listing.sellerId !== user.id) return { error: "Not authorized." };
    if (purchase.status !== "PAID" && purchase.status !== "AWAITING_TRANSFER") {
      return { error: "Cannot mark this purchase as transferred." };
    }

    await prisma.purchase.update({
      where: { id: purchaseId },
      data: {
        status: "TRANSFERRED",
        transferredAt: new Date(),
        transferNotes,
      },
    });

    revalidatePath(`/purchases/${purchaseId}`);
    revalidatePath("/seller/orders");
    return { success: true };
  } catch {
    return { error: "Failed to confirm transfer." };
  }
}

export async function buyerConfirmReceipt(purchaseId: string) {
  try {
    const user = await requireAuth();

    const purchase = await prisma.purchase.findFirst({
      where: { id: purchaseId, buyerId: user.id },
    });

    if (!purchase) return { error: "Purchase not found." };
    if (purchase.status !== "TRANSFERRED") {
      return { error: "Tickets haven't been marked as transferred yet." };
    }

    await prisma.purchase.update({
      where: { id: purchaseId },
      data: {
        status: "COMPLETED",
        buyerConfirmedAt: new Date(),
      },
    });

    // Increment seller total sales
    await prisma.sellerProfile.update({
      where: { userId: purchase.buyerId },
      data: { totalSales: { increment: 1 } },
    });

    revalidatePath(`/purchases/${purchaseId}`);
    return { success: true };
  } catch {
    return { error: "Failed to confirm receipt." };
  }
}

export async function submitDispute(purchaseId: string, reason: string, description?: string) {
  try {
    const user = await requireAuth();

    const purchase = await prisma.purchase.findFirst({
      where: { id: purchaseId, buyerId: user.id },
    });

    if (!purchase) return { error: "Purchase not found." };

    await prisma.dispute.create({
      data: {
        purchaseId,
        reason,
        description,
      },
    });

    await prisma.purchase.update({
      where: { id: purchaseId },
      data: { status: "DISPUTED" },
    });

    revalidatePath(`/purchases/${purchaseId}`);
    return { success: true };
  } catch {
    return { error: "Failed to submit dispute." };
  }
}
