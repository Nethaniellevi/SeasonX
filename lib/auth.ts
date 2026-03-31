import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getOrCreateUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email =
    clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const name =
    `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim();
  const avatarUrl = clerkUser.imageUrl;

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email, name, avatarUrl },
    create: { clerkId: userId, email, name, avatarUrl },
    include: {
      sellerProfile: {
        include: { verificationDocuments: true },
      },
      subscription: true,
    },
  });

  return user;
}

export async function requireAuth() {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") throw new Error("Forbidden");
  return user;
}

export async function requireVerifiedSeller() {
  const user = await requireAuth();
  if (
    !user.sellerProfile ||
    user.sellerProfile.verificationStatus !== "APPROVED"
  ) {
    throw new Error("Must be a verified seller");
  }
  return user;
}
