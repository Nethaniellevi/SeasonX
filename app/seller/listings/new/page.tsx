import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/auth";
import { NewListingForm } from "./new-listing-form";
import { ShieldCheck } from "lucide-react";

export const metadata = { title: "Create Listing" };

export default async function NewListingPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  if (user.sellerProfile?.verificationStatus !== "APPROVED") {
    redirect("/seller/verify");
  }

  if (
    !user.subscription ||
    !["TRIALING", "ACTIVE"].includes(user.subscription.status)
  ) {
    redirect("/seller/subscription");
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-[#222222] mb-3 tracking-tight">Create a listing</h1>
          <p className="text-[#717171] text-sm flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-team-primary" />
            You&apos;re a verified season ticket holder — your listings will show the verified badge.
          </p>
        </div>
        <NewListingForm />
      </div>
    </div>
  );
}
