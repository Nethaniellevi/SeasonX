import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/auth";
import { VerificationUploadForm } from "./verification-upload-form";
import { ShieldCheck, Clock, XCircle, Check } from "lucide-react";

export default async function VerifyPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const profile = user.sellerProfile;

  if (profile?.verificationStatus === "APPROVED") {
    redirect("/seller/dashboard");
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-14">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-team-subtle border border-team-subtle px-4 py-2 text-xs font-semibold text-team-primary mb-6">
            <ShieldCheck className="h-3.5 w-3.5" />
            Season ticket holder verification
          </div>
          <h1 className="text-4xl font-semibold text-[#222222] mb-4 tracking-tight">
            Become a verified seller
          </h1>
          <p className="text-[#717171] max-w-lg mx-auto leading-relaxed">
            Sell at 0% seller fees for $50/month. To protect buyers and uphold our standards,
            every seller must verify their season ticket ownership.
          </p>
        </div>

        {/* Status banners */}
        {profile?.verificationStatus === "PENDING" && (
          <div className="rounded-2xl border border-amber-200 p-5 bg-amber-50 flex items-start gap-3 mb-8">
            <Clock className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-800 mb-1">Application under review</p>
              <p className="text-sm text-amber-600">
                We&apos;re reviewing your documents. This typically takes 1–2 business days.
                You&apos;ll receive an email once a decision is made.
              </p>
            </div>
          </div>
        )}

        {(profile?.verificationStatus === "REJECTED" || profile?.verificationStatus === "REVOKED") && (
          <div className="rounded-2xl border border-red-200 p-5 bg-red-50 flex items-start gap-3 mb-8">
            <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800 mb-1">
                {profile.verificationStatus === "REVOKED" ? "Verification revoked" : "Previous application rejected"}
              </p>
              <p className="text-sm text-red-600">
                {profile.verificationStatus === "REVOKED" && profile.revokeReason
                  ? `Reason: ${profile.revokeReason}`
                  : profile.verificationStatus === "REVOKED"
                  ? "Your verification has been revoked. Contact support for more information."
                  : "You can re-apply by submitting updated documentation below."}
              </p>
            </div>
          </div>
        )}

        {/* What you need */}
        <div className="rounded-2xl border border-[#DDDDDD] p-7 bg-white mb-6">
          <h2 className="font-semibold text-[#222222] mb-6">What you&apos;ll need</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "📄", title: "Invoice / receipt", desc: "Your season ticket invoice or renewal receipt from the team" },
              { icon: "📸", title: "Account screenshot", desc: "Screenshot of your team ticket account showing your name and seats" },
              { icon: "🪪", title: "Ticket account ID", desc: "Your account ID or member number from the team's ticketing system" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex flex-col gap-2 p-4 rounded-xl bg-[#F7F7F7]">
                <span className="text-2xl">{icon}</span>
                <p className="font-semibold text-sm text-[#222222]">{title}</p>
                <p className="text-xs text-[#717171] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upload form */}
        {profile?.verificationStatus !== "PENDING" && (
          <VerificationUploadForm existingProfileId={profile?.id} />
        )}

        {/* Pricing */}
        <div className="mt-6 rounded-2xl border border-[#DDDDDD] p-6 bg-white">
          <p className="font-semibold text-[#222222] mb-4">After verification: $50/month</p>
          <div className="space-y-3">
            {[
              "14-day free trial included",
              "Cancel anytime",
              "0% seller fees — keep everything you earn",
              "Compare: StubHub and Ticketmaster charge 10–15% per ticket",
            ].map((item) => (
              <p key={item} className="flex items-center gap-2.5 text-sm text-[#717171]">
                <Check className="h-4 w-4 text-team-primary flex-shrink-0" />
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
