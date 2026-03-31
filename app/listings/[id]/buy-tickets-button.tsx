"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/app/actions/purchase-actions";
import { formatCurrency, calculateTotal } from "@/lib/utils";

interface Props {
  listingId: string;
  quantity: number;
  pricePerTicket: number;
}

export function BuyTicketsButton({ listingId, quantity, pricePerTicket }: Props) {
  const [selectedQty, setSelectedQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = pricePerTicket * selectedQty;
  const total = calculateTotal(subtotal);

  async function handleBuy() {
    setLoading(true);
    setError(null);
    const result = await createCheckoutSession(listingId, selectedQty);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.url) {
      window.location.href = result.url;
    }
  }

  return (
    <div className="space-y-3">
      {quantity > 1 && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Quantity</label>
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: quantity }, (_, i) => i + 1).map((q) => (
              <button
                key={q}
                onClick={() => setSelectedQty(q)}
                className={`w-10 h-10 rounded-lg text-sm font-semibold border transition-colors ${
                  selectedQty === q
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-border hover:border-blue-400"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <Button
        onClick={handleBuy}
        loading={loading}
        className="w-full"
        size="lg"
      >
        Buy {selectedQty} Ticket{selectedQty > 1 ? "s" : ""} — {formatCurrency(total)}
      </Button>
    </div>
  );
}
