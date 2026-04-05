"use client";

import { useState } from "react";
import { joinWaitlist } from "@/app/actions/waitlist-actions";
import { Check } from "lucide-react";

export function WaitlistForm() {
  const [type, setType] = useState<"BUYER" | "SELLER">("SELLER");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("type", type);
    const result = await joinWaitlist(fd);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="w-14 h-14 rounded-full bg-team-subtle flex items-center justify-center">
          <Check className="w-7 h-7 text-team-primary" strokeWidth={2.5} />
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-[#222222]">You&apos;re on the list!</p>
          <p className="text-[#717171] text-sm mt-1">We&apos;ll email you the moment we launch.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto flex flex-col gap-4">
      {/* Buyer / Seller toggle */}
      <div className="flex rounded-full border border-[#DDDDDD] p-1 bg-[#F7F7F7]">
        {(["BUYER", "SELLER"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className="flex-1 py-2 rounded-full text-sm font-semibold transition-all"
            style={
              type === t
                ? { backgroundColor: "var(--team-primary)", color: "var(--team-on-primary)" }
                : { color: "#717171" }
            }
          >
            {t === "BUYER" ? "I want to buy" : "I want to sell"}
          </button>
        ))}
      </div>

      {/* Name */}
      <input
        name="name"
        type="text"
        placeholder="Your name (optional)"
        className="w-full border border-[#DDDDDD] rounded-2xl px-4 py-3.5 text-sm text-[#222222] placeholder-[#BBBBBB] outline-none focus:border-[#222222] transition-colors bg-white"
      />

      {/* Email */}
      <input
        name="email"
        type="email"
        required
        placeholder="Your email address"
        className="w-full border border-[#DDDDDD] rounded-2xl px-4 py-3.5 text-sm text-[#222222] placeholder-[#BBBBBB] outline-none focus:border-[#222222] transition-colors bg-white"
      />

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-team-primary hover:bg-team-primary-hover disabled:opacity-50 text-white font-semibold text-sm py-4 rounded-full transition-colors"
      >
        {loading ? "Joining..." : "Join the waitlist"}
      </button>

      <p className="text-xs text-[#AAAAAA] text-center">No spam. We&apos;ll only email you when we launch.</p>
    </form>
  );
}
