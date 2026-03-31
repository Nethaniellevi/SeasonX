import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/auth";
import { VerificationUploadForm } from "./verification-upload-form";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Clock, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function VerifyPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const profile = user.sellerProfile;

  // Already approved — go to seller dashboard
  if (profile?.verificationStatus === "APPROVED") {
    redirect("/seller/dashboard");
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 text-sm font-medium mb-4">
          <ShieldCheck className="h-4 w-4" />
          Season Ticket Holder Verification
        </div>
        <h1 className="text-4xl font-extrabold mb-3">Become a Verified Seller</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Sell at 0% seller fees for $50/month. To protect buyers and uphold our standards,
          every seller must verify their season ticket ownership.
        </p>
      </div>

      {/* Status banners */}
      {profile?.verificationStatus === "PENDING" && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/10 mb-8">
          <CardContent className="p-5 flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-200">Application Under Review</p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                We're reviewing your documents. This typically takes 1–2 business days.
                You'll receive an email once a decision is made.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {profile?.verificationStatus === "REJECTED" && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 mb-8">
          <CardContent className="p-5 flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800 dark:text-red-200">Previous Application Rejected</p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                You can re-apply by submitting updated documentation below.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {profile?.verificationStatus === "REVOKED" && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 mb-8">
          <CardContent className="p-5 flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800 dark:text-red-200">Verification Revoked</p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {profile.revokeReason
                  ? `Reason: ${profile.revokeReason}`
                  : "Your verification has been revoked. Contact support for more information."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* What you need */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="font-bold text-lg mb-4">What You'll Need</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: "📄",
                title: "Invoice / Receipt",
                desc: "Your season ticket invoice or renewal receipt from the team",
              },
              {
                icon: "📸",
                title: "Account Screenshot",
                desc: "Screenshot of your team ticket account showing your name and seats",
              },
              {
                icon: "🪪",
                title: "Ticket Account ID",
                desc: "Your account ID or member number from the team's ticketing system",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex flex-col gap-2 p-4 rounded-lg bg-muted/50">
                <span className="text-2xl">{icon}</span>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload form — only show if not pending */}
      {profile?.verificationStatus !== "PENDING" && (
        <VerificationUploadForm existingProfileId={profile?.id} />
      )}

      {/* Pricing reminder */}
      <Card className="mt-8 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="p-5 text-sm">
          <p className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
            After verification: $50/month subscription
          </p>
          <p className="text-blue-700 dark:text-blue-300">
            14-day free trial included. Cancel anytime. 0% seller fees — keep everything you earn.
            Compare: StubHub and Ticketmaster charge 10–15% per ticket.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
