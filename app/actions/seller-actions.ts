"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth, requireVerifiedSeller } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function submitVerificationApplication(formData: FormData) {
  try {
    const user = await requireAuth();
    const description = formData.get("description") as string;
    const ticketAccountId = formData.get("ticketAccountId") as string;
    const filesJson = formData.get("filesJson") as string;
    const existingProfileId = formData.get("existingProfileId") as string | null;

    if (!description || !ticketAccountId) {
      return { error: "Missing required fields." };
    }

    const files: Array<{ name: string; type: string; dataUrl: string; docType: string }> =
      filesJson ? JSON.parse(filesJson) : [];

    if (files.length === 0) {
      return { error: "Please upload at least one document." };
    }

    // Upsert seller profile
    const sellerProfile = await prisma.sellerProfile.upsert({
      where: { userId: user.id },
      update: {
        verificationStatus: "PENDING",
        bio: description,
        revokedAt: null,
        revokeReason: null,
      },
      create: {
        userId: user.id,
        verificationStatus: "PENDING",
        bio: description,
      },
    });

    // Update user role to SELLER if not already
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "SELLER" },
    });

    // Store documents (dataUrls as file references — in production, upload to Vercel Blob first)
    for (const file of files) {
      await prisma.verificationDocument.create({
        data: {
          sellerProfileId: sellerProfile.id,
          fileUrl: file.dataUrl, // In production: upload to blob storage, store URL
          fileName: file.name,
          fileType: file.docType,
          description: `Account ID: ${ticketAccountId}`,
        },
      });
    }

    revalidatePath("/seller/verify");
    return { success: true };
  } catch (err) {
    console.error("submitVerificationApplication error:", err);
    return { error: "Something went wrong. Please try again." };
  }
}

const listingSchema = z.object({
  sport: z.enum(["NFL", "NBA", "MLB", "NHL", "MLS", "COLLEGE_FOOTBALL", "COLLEGE_BASKETBALL", "OTHER"]),
  homeTeam: z.string().min(2),
  awayTeam: z.string().min(2),
  venue: z.string().optional(),
  eventDate: z.string().min(1),
  section: z.string().min(1),
  row: z.string().optional(),
  seats: z.string().min(1), // comma-separated
  quantity: z.coerce.number().int().min(1).max(50),
  pricePerTicket: z.coerce.number().min(1).max(50000),
  transferMethod: z.enum(["UPLOAD", "MOBILE_TRANSFER", "WILL_CALL", "FLASH_SEATS", "OTHER"]).default("UPLOAD"),
  notes: z.string().optional(),
});

export async function createListing(formData: FormData) {
  try {
    const user = await requireVerifiedSeller();

    // Verify active subscription
    if (
      !user.subscription ||
      !["TRIALING", "ACTIVE"].includes(user.subscription.status)
    ) {
      return { error: "An active subscription is required to create listings." };
    }

    const rawData = Object.fromEntries(formData.entries());
    const parsed = listingSchema.safeParse(rawData);

    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const data = parsed.data;
    const seats = data.seats.split(",").map((s) => s.trim()).filter(Boolean);

    const listing = await prisma.listing.create({
      data: {
        sellerId: user.id,
        sellerProfileId: user.sellerProfile!.id,
        sport: data.sport,
        homeTeam: data.homeTeam,
        awayTeam: data.awayTeam,
        venue: data.venue,
        eventDate: new Date(data.eventDate),
        eventName: `${data.homeTeam} vs ${data.awayTeam}`,
        section: data.section,
        row: data.row,
        seats,
        quantity: data.quantity,
        pricePerTicket: data.pricePerTicket,
        transferMethod: data.transferMethod,
        notes: data.notes,
        status: "ACTIVE",
      },
    });

    revalidatePath("/seller/listings");
    revalidatePath("/marketplace");
    return { success: true, listingId: listing.id };
  } catch (err) {
    console.error("createListing error:", err);
    if ((err as Error).message === "Must be a verified seller") {
      return { error: "You must be a verified seller to create listings." };
    }
    return { error: "Failed to create listing. Please try again." };
  }
}

export async function deleteListing(listingId: string) {
  try {
    const user = await requireAuth();
    const listing = await prisma.listing.findFirst({
      where: { id: listingId, sellerId: user.id },
    });
    if (!listing) return { error: "Listing not found." };

    await prisma.listing.update({
      where: { id: listingId },
      data: { status: "HIDDEN" },
    });

    revalidatePath("/seller/listings");
    revalidatePath("/marketplace");
    return { success: true };
  } catch {
    return { error: "Failed to delete listing." };
  }
}
