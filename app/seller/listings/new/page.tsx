import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/auth";
import { NewListingForm } from "./new-listing-form";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create a Listing</h1>
        <p className="text-muted-foreground text-sm flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          You're a verified season ticket holder — your listings will show the verified badge.
        </p>
      </div>
      <NewListingForm />
    </div>
  );
}
