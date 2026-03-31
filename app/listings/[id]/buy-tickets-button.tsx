"use client";

import { useState } from "react";
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
    <div className="space-y-4">
      {quantity > 1 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#717171] uppercase tracking-wider">Quantity</p>
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: quantity }, (_, i) => i + 1).map((q) => (
              <button
                key={q}
                onClick={() => setSelectedQty(q)}
                className={`w-10 h-10 rounded-xl text-sm font-semibold border transition-all ${
                  selectedQty === q
                    ? "bg-[#222222] text-white border-[#222222]"
                    : "border-[#DDDDDD] text-[#717171] hover:border-[#222222] hover:text-[#222222] bg-white"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}

      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full bg-team-primary hover:bg-team-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-4 rounded-xl transition-colors"
      >
        {loading
          ? "Processing..."
          : `Reserve ${selectedQty} ticket${selectedQty > 1 ? "s" : ""} · ${formatCurrency(total)}`
        }
      </button>
    </div>
  );
}
