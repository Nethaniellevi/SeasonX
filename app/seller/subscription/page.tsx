import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/auth";
import { formatDateShort } from "@/lib/utils";
import { SubscriptionActions } from "./subscription-actions";
import { Check } from "lucide-react";

export const metadata = { title: "Subscription" };

export default async function SubscriptionPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  if (user.sellerProfile?.verificationStatus !== "APPROVED") {
    redirect("/seller/verify");
  }

  const subscription = user.subscription;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-lg px-6 py-14">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-[#222222] mb-2 tracking-tight">Seller subscription</h1>
          <p className="text-[#717171] text-sm">Manage your $50/month plan</p>
        </div>

        <div className="rounded-2xl border border-[#DDDDDD] bg-white overflow-hidden shadow-sm">
          <div className="p-7 space-y-6">
            {subscription && ["TRIALING", "ACTIVE"].includes(subscription.status) ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg text-[#222222]">SeasonX Seller Plan</p>
                    <p className="text-sm text-[#717171]">$50 / month</p>
                  </div>
                  <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    subscription.status === "TRIALING"
                      ? "bg-amber-100 text-amber-700 border border-amber-200"
                      : "bg-team-subtle text-team-primary border border-team-subtle"
                  }`}>
                    {subscription.status === "TRIALING" ? "Free trial" : "Active"}
                  </span>
                </div>

                {subscription.trialEnd && subscription.status === "TRIALING" && (
                  <p className="text-sm text-[#717171]">
                    Trial ends: <strong className="text-[#222222]">{formatDateShort(subscription.trialEnd)}</strong>
                  </p>
                )}

                {subscription.currentPeriodEnd && subscription.status === "ACTIVE" && (
                  <p className="text-sm text-[#717171]">
                    {subscription.cancelAtPeriodEnd ? "Cancels on: " : "Renews on: "}
                    <strong className="text-[#222222]">{formatDateShort(subscription.currentPeriodEnd)}</strong>
                  </p>
                )}

                <div className="border-t border-[#DDDDDD] pt-5 space-y-3">
                  {["0% seller fees", "Unlimited listings", "Verified seller badge", "$50/month flat rate"].map((f) => (
                    <p key={f} className="flex items-center gap-2.5 text-sm text-[#717171]">
                      <Check className="h-4 w-4 text-team-primary flex-shrink-0" />
                      {f}
                    </p>
                  ))}
                </div>

                <SubscriptionActions
                  subscriptionId={subscription.stripeSubscriptionId ?? ""}
                  cancelAtPeriodEnd={subscription.cancelAtPeriodEnd}
                  customerId={subscription.stripeCustomerId}
                />
              </>
            ) : (
              <>
                {subscription?.status && !["TRIALING", "ACTIVE"].includes(subscription.status) && (
                  <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700 font-semibold">
                    Your subscription is {subscription.status.toLowerCase().replace(/_/g, " ")}.
                    Your listings are hidden. Subscribe to reactivate.
                  </div>
                )}

                <div className="text-center py-6">
                  <p className="text-6xl font-semibold text-[#222222]">$50</p>
                  <p className="text-[#717171] text-sm mt-1">per month</p>
                  <p className="text-team-primary text-xs font-semibold mt-2">14-day free trial · Cancel anytime</p>
                </div>

                <div className="space-y-3">
                  {[
                    "0% seller fees — keep 100% of your sale price",
                    "Unlimited listings",
                    "Verified Season Ticket Holder badge",
                    "Compare: StubHub charges 10–15% per ticket",
                  ].map((f) => (
                    <p key={f} className="flex items-center gap-2.5 text-sm text-[#717171]">
                      <Check className="h-4 w-4 text-team-primary flex-shrink-0" />
                      {f}
                    </p>
                  ))}
                </div>

                <SubscriptionActions
                  subscriptionId={null}
                  cancelAtPeriodEnd={false}
                  customerId={subscription?.stripeCustomerId ?? null}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
