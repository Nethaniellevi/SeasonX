"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button
          loading={loading}
          className="w-full"
          size="lg"
          onClick={() => handleAction(startSubscription)}
        >
          Start 14-Day Free Trial
        </Button>
      </div>
    );
  }

  if (cancelAtPeriodEnd) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Your subscription will be canceled at period end.</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button
          variant="outline"
          loading={loading}
          className="w-full"
          onClick={() => handleAction(() => reactivateSubscription(subscriptionId))}
        >
          Reactivate Subscription
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button
        variant="outline"
        loading={loading}
        className="w-full text-red-600 border-red-200 hover:bg-red-50"
        onClick={() => handleAction(() => cancelSubscription(subscriptionId))}
      >
        Cancel Subscription
      </Button>
    </div>
  );
}
