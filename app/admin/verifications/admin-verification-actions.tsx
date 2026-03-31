"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveVerification, rejectVerification } from "@/app/actions/admin-actions";

interface Props {
  profileId: string;
}

export function AdminVerificationActions({ profileId }: Props) {
  const router = useRouter();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    setLoading(true);
    const result = await approveVerification(profileId);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.refresh();
    }
  }

  async function handleReject() {
    setLoading(true);
    const result = await rejectVerification(profileId, reason);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col gap-3 md:w-52 flex-shrink-0">
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      {!rejecting ? (
        <>
          <button
            disabled={loading}
            onClick={handleApprove}
            className="w-full bg-team-primary hover:bg-team-primary-hover disabled:opacity-50 text-white font-semibold text-sm py-3 rounded-full transition-colors"
          >
            {loading ? "Processing..." : "Approve"}
          </button>
          <button
            disabled={loading}
            onClick={() => setRejecting(true)}
            className="w-full border border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 disabled:opacity-50 font-semibold text-sm py-3 rounded-full transition-all bg-white"
          >
            Reject
          </button>
        </>
      ) : (
        <>
          <textarea
            placeholder="Reason for rejection (optional, emailed to seller)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full bg-white border border-[#DDDDDD] rounded-xl px-3 py-2.5 text-sm text-[#222222] placeholder-[#BBBBBB] outline-none focus:border-[#222222] resize-none transition-colors"
          />
          <button
            disabled={loading}
            onClick={handleReject}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold text-sm py-3 rounded-full transition-colors"
          >
            {loading ? "Processing..." : "Confirm rejection"}
          </button>
          <button
            disabled={loading}
            onClick={() => { setRejecting(false); setReason(""); }}
            className="w-full text-[#717171] hover:text-[#222222] font-semibold text-sm py-2 transition-colors"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
}
