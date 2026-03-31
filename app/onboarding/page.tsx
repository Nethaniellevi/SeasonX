import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/auth";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  // If already has seller profile, go to seller dashboard
  if (user.sellerProfile) redirect("/seller/dashboard");

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Welcome to SeasonX!</h1>
        <p className="text-muted-foreground">
          How would you like to use SeasonX?
        </p>
      </div>
      <OnboardingForm />
    </div>
  );
}
