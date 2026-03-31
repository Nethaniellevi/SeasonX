"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendVerificationApprovedEmail, sendVerificationRejectedEmail } from "@/lib/resend";

export async function approveVerification(profileId: string) {
  try {
    await requireAdmin();

    const profile = await prisma.sellerProfile.findUnique({
      where: { id: profileId },
      include: { user: { select: { name: true, email: true } } },
    });

    if (!profile) return { error: "Profile not found." };

    await prisma.sellerProfile.update({
      where: { id: profileId },
      data: {
        verificationStatus: "APPROVED",
        verifiedAt: new Date(),
        revokedAt: null,
        revokeReason: null,
      },
    });

    // Send approval email
    try {
      await sendVerificationApprovedEmail(
        profile.user.email,
        profile.user.name ?? "Seller"
      );
    } catch (emailErr) {
      console.error("Failed to send approval email:", emailErr);
    }

    revalidatePath("/admin/verifications");
    return { success: true };
  } catch (err) {
    if ((err as Error).message === "Forbidden") return { error: "Not authorized." };
    return { error: "Failed to approve verification." };
  }
}

export async function rejectVerification(profileId: string, reason?: string) {
  try {
    await requireAdmin();

    const profile = await prisma.sellerProfile.findUnique({
      where: { id: profileId },
      include: { user: { select: { name: true, email: true } } },
    });

    if (!profile) return { error: "Profile not found." };

    await prisma.sellerProfile.update({
      where: { id: profileId },
      data: { verificationStatus: "REJECTED" },
    });

    try {
      await sendVerificationRejectedEmail(
        profile.user.email,
        profile.user.name ?? "Seller",
        reason
      );
    } catch (emailErr) {
      console.error("Failed to send rejection email:", emailErr);
    }

    revalidatePath("/admin/verifications");
    return { success: true };
  } catch (err) {
    if ((err as Error).message === "Forbidden") return { error: "Not authorized." };
    return { error: "Failed to reject verification." };
  }
}

export async function revokeVerification(profileId: string, reason?: string) {
  try {
    await requireAdmin();

    const profile = await prisma.sellerProfile.findUnique({
      where: { id: profileId },
      include: { user: true },
    });

    if (!profile) return { error: "Profile not found." };

    await prisma.sellerProfile.update({
      where: { id: profileId },
      data: {
        verificationStatus: "REVOKED",
        revokedAt: new Date(),
        revokeReason: reason,
      },
    });

    // Hide all their listings
    await prisma.listing.updateMany({
      where: { sellerId: profile.userId, status: "ACTIVE" },
      data: { status: "HIDDEN" },
    });

    revalidatePath("/admin/verifications");
    return { success: true };
  } catch (err) {
    if ((err as Error).message === "Forbidden") return { error: "Not authorized." };
    return { error: "Failed to revoke verification." };
  }
}
