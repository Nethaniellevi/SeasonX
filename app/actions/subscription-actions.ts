"use server";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, SUBSCRIPTION_PRICE_ID } from "@/lib/stripe";
import { revalidatePath } from "next/cache";

export async function startSubscription() {
  try {
    const user = await requireAuth();

    // Get or create Stripe customer
    let stripeCustomerId = user.subscription?.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: { userId: user.id, clerkId: user.clerkId },
      });
      stripeCustomerId = customer.id;

      await prisma.subscription.create({
        data: {
          userId: user.id,
          stripeCustomerId,
          status: "INCOMPLETE",
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [{ price: SUBSCRIPTION_PRICE_ID, quantity: 1 }],
      subscription_data: {
        trial_period_days: 14,
        metadata: { userId: user.id },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/seller/subscription?subscribed=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/seller/subscription`,
      metadata: { userId: user.id },
    });

    return { url: session.url ?? undefined };
  } catch (err) {
    console.error("startSubscription error:", err);
    return { error: "Failed to start subscription. Please try again." };
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const user = await requireAuth();
    if (!user.subscription || user.subscription.stripeSubscriptionId !== subscriptionId) {
      return { error: "Subscription not found." };
    }

    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    await prisma.subscription.update({
      where: { userId: user.id },
      data: { cancelAtPeriodEnd: true },
    });

    revalidatePath("/seller/subscription");
    return { success: true };
  } catch (err) {
    console.error("cancelSubscription error:", err);
    return { error: "Failed to cancel subscription." };
  }
}

export async function reactivateSubscription(subscriptionId: string) {
  try {
    const user = await requireAuth();
    if (!user.subscription || user.subscription.stripeSubscriptionId !== subscriptionId) {
      return { error: "Subscription not found." };
    }

    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });

    await prisma.subscription.update({
      where: { userId: user.id },
      data: { cancelAtPeriodEnd: false },
    });

    revalidatePath("/seller/subscription");
    return { success: true };
  } catch (err) {
    console.error("reactivateSubscription error:", err);
    return { error: "Failed to reactivate subscription." };
  }
}
