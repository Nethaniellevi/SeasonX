"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
    <div className="flex flex-col gap-3 md:w-56 flex-shrink-0">
      {error && <p className="text-xs text-red-600">{error}</p>}

      {!rejecting ? (
        <>
          <Button
            variant="success"
            loading={loading}
            className="w-full"
            onClick={handleApprove}
          >
            Approve
          </Button>
          <Button
            variant="destructive"
            disabled={loading}
            className="w-full"
            onClick={() => setRejecting(true)}
          >
            Reject
          </Button>
        </>
      ) : (
        <>
          <Textarea
            placeholder="Reason for rejection (optional, emailed to seller)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="text-sm"
          />
          <Button
            variant="destructive"
            loading={loading}
            className="w-full"
            onClick={handleReject}
          >
            Confirm Rejection
          </Button>
          <Button
            variant="ghost"
            disabled={loading}
            className="w-full"
            onClick={() => { setRejecting(false); setReason(""); }}
          >
            Cancel
          </Button>
        </>
      )}
    </div>
  );
}
