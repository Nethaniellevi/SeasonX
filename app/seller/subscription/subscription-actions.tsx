"use client";

import { useState } from "react";
import { startSubscription, cancelSubscription, reactivateSubscription } from "@/app/actions/subscription-actions";

interface Props {
  subscriptionId: string | null;
  cancelAtPeriodEnd: boolean;
  customerId: string | null;
}

export function SubscriptionActions({ subscriptionId, cancelAtPeriodEnd, customerId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(action: () => Promise<{ error?: string; url?: string; success?: boolean }>) {
    setLoading(true);
    setError(null);
    const result = await action();
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.url) {
      window.location.href = result.url;
    } else {
      setLoading(false);
    }
  }

  if (!subscriptionId) {
    return (
      <div className="space-y-3">
        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        <button
          disabled={loading}
          className="w-full bg-team-primary hover:bg-team-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-4 rounded-full transition-colors"
          onClick={() => handleAction(startSubscription)}
        >
          {loading ? "Processing..." : "Start 14-day free trial"}
        </button>
      </div>
    );
  }

  if (cancelAtPeriodEnd) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-[#717171]">Your subscription will be canceled at period end.</p>
        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        <button
          disabled={loading}
          className="w-full border border-[#DDDDDD] hover:border-[#222222] hover:text-[#222222] text-[#717171] disabled:opacity-50 font-semibold text-sm py-3.5 rounded-full transition-all bg-white"
          onClick={() => handleAction(() => reactivateSubscription(subscriptionId))}
        >
          {loading ? "Processing..." : "Reactivate subscription"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
      <button
        disabled={loading}
        className="w-full border border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 disabled:opacity-50 font-semibold text-sm py-3.5 rounded-full transition-all bg-white"
        onClick={() => handleAction(() => cancelSubscription(subscriptionId))}
      >
        {loading ? "Processing..." : "Cancel subscription"}
      </button>
    </div>
  );
}
