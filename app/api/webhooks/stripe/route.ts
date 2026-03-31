import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type { SubscriptionStatus } from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Stripe webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // ── Subscription events ──────────────────────────────────────────────
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        // Compute billing period from subscription start_date + billing_cycle_anchor
        const periodStart = new Date(sub.start_date * 1000);
        // For display purposes, use cancel_at or a reasonable future date
        const periodEnd = sub.cancel_at
          ? new Date(sub.cancel_at * 1000)
          : new Date((sub.start_date + 30 * 24 * 60 * 60) * 1000);

        await prisma.subscription.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            stripeSubscriptionId: sub.id,
            stripePriceId: sub.items.data[0]?.price.id,
            status: mapStripeSubStatus(sub.status) as SubscriptionStatus,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            trialEnd: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
        });

        // If subscription becomes active or trialing, ensure listings are visible
        if (["active", "trialing"].includes(sub.status)) {
          const dbSub = await prisma.subscription.findFirst({
            where: { stripeCustomerId: customerId },
          });
          if (dbSub) {
            await prisma.listing.updateMany({
              where: { sellerId: dbSub.userId, status: "HIDDEN" },
              data: { status: "ACTIVE" },
            });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        const dbSub = await prisma.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (dbSub) {
          await prisma.subscription.update({
            where: { id: dbSub.id },
            data: { status: "CANCELED" as SubscriptionStatus },
          });

          // Hide all active listings
          await prisma.listing.updateMany({
            where: { sellerId: dbSub.userId, status: "ACTIVE" },
            data: { status: "HIDDEN" },
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const dbSub = await prisma.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (dbSub) {
          await prisma.subscription.update({
            where: { id: dbSub.id },
            data: { status: "PAST_DUE" as SubscriptionStatus },
          });

          await prisma.listing.updateMany({
            where: { sellerId: dbSub.userId, status: "ACTIVE" },
            data: { status: "HIDDEN" },
          });
        }
        break;
      }

      // ── Payment / purchase events ─────────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === "payment") {
          const purchaseId = session.metadata?.purchaseId;
          if (!purchaseId) break;

          await prisma.purchase.update({
            where: { id: purchaseId },
            data: {
              status: "AWAITING_TRANSFER",
              stripeSessionId: session.id,
              stripePaymentIntentId: session.payment_intent as string,
            },
          });

          // Reduce listing quantity (or mark as sold if fully purchased)
          const purchase = await prisma.purchase.findUnique({
            where: { id: purchaseId },
            include: { listing: true },
          });

          if (purchase && purchase.listing.quantity <= purchase.quantity) {
            await prisma.listing.update({
              where: { id: purchase.listingId },
              data: { status: "SOLD" },
            });
          }
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }
}

function mapStripeSubStatus(status: string) {
  const map: Record<string, string> = {
    trialing: "TRIALING",
    active: "ACTIVE",
    past_due: "PAST_DUE",
    canceled: "CANCELED",
    incomplete: "INCOMPLETE",
    incomplete_expired: "CANCELED",
    unpaid: "PAST_DUE",
  };
  return map[status] ?? "INCOMPLETE";
}
