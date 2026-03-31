"use server";

import { prisma } from "@/lib/prisma";

export async function joinWaitlist(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const name = (formData.get("name") as string)?.trim() || null;
  const type = (formData.get("type") as string) || "GENERAL";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  try {
    await prisma.waitlistEntry.create({ data: { email, name, type } });
    return { success: true };
  } catch (err: unknown) {
    const isDupe =
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002";
    if (isDupe) return { error: "You're already on the waitlist!" };
    return { error: "Something went wrong. Please try again." };
  }
}

export async function getWaitlistCount() {
  try {
    return await prisma.waitlistEntry.count();
  } catch {
    return 0;
  }
}
