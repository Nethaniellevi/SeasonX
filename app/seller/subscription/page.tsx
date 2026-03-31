import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/auth";
import { stripe, SUBSCRIPTION_PRICE_ID } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { SubscriptionActions } from "./subscription-actions";
import { ShieldCheck, Check } from "lucide-react";

export const metadata = { title: "Subscription" };

export default async function SubscriptionPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  if (user.sellerProfile?.verificationStatus !== "APPROVED") {
    redirect("/seller/verify");
  }

  const subscription = user.subscription;

  return (
    <div className="container mx-auto max-w-xl px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Seller Subscription</h1>
        <p className="text-muted-foreground">Manage your $50/month plan</p>
      </div>

      {subscription && ["TRIALING", "ACTIVE"].includes(subscription.status) ? (
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">SeasonX Seller Plan</p>
                <p className="text-sm text-muted-foreground">$50 / month</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                subscription.status === "TRIALING"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
              }`}>
                {subscription.status === "TRIALING" ? "Free Trial" : "Active"}
              </span>
            </div>

            {subscription.trialEnd && subscription.status === "TRIALING" && (
              <p className="text-sm text-muted-foreground">
                Trial ends: <strong>{formatDateShort(subscription.trialEnd)}</strong>
              </p>
            )}

            {subscription.currentPeriodEnd && subscription.status === "ACTIVE" && (
              <p className="text-sm text-muted-foreground">
                {subscription.cancelAtPeriodEnd
                  ? `Cancels on: ${formatDateShort(subscription.currentPeriodEnd)}`
                  : `Renews on: ${formatDateShort(subscription.currentPeriodEnd)}`
                }
              </p>
            )}

            <ul className="space-y-2 text-sm">
              {["0% seller fees", "Unlimited listings", "Verified seller badge", "$50/month flat rate"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  {f}
                </li>
              ))}
            </ul>

            <SubscriptionActions
              subscriptionId={subscription.stripeSubscriptionId ?? ""}
              cancelAtPeriodEnd={subscription.cancelAtPeriodEnd}
              customerId={subscription.stripeCustomerId}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 space-y-5">
            {subscription?.status && !["TRIALING", "ACTIVE"].includes(subscription.status) && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 text-sm text-red-700 dark:text-red-300 border border-red-200">
                Your subscription is {subscription.status.toLowerCase().replace(/_/g, " ")}.
                Your listings are currently hidden. Subscribe to reactivate.
              </div>
            )}

            <div className="text-center">
              <p className="text-4xl font-black mb-1">$50<span className="text-xl font-normal text-muted-foreground">/mo</span></p>
              <p className="text-sm text-muted-foreground">14-day free trial · Cancel anytime</p>
            </div>

            <ul className="space-y-2 text-sm">
              {[
                "0% seller fees — keep 100% of your sale price",
                "Unlimited listings",
                "Verified Season Ticket Holder badge",
                "Compare: StubHub charges 10–15% per ticket",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  {f}
                </li>
              ))}
            </ul>

            <SubscriptionActions
              subscriptionId={null}
              cancelAtPeriodEnd={false}
              customerId={subscription?.stripeCustomerId ?? null}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
