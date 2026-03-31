import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateShort } from "@/lib/utils";
import { AdminVerificationActions } from "./admin-verification-actions";
import { ShieldCheck } from "lucide-react";

export const metadata = { title: "Admin — Verifications" };

export default async function AdminVerificationsPage() {
  const admin = await requireAdmin().catch(() => null);
  if (!admin) redirect("/dashboard");

  const pendingProfiles = await prisma.sellerProfile.findMany({
    where: { verificationStatus: "PENDING" },
    include: {
      user: { select: { name: true, email: true, createdAt: true } },
      verificationDocuments: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const recentlyReviewed = await prisma.sellerProfile.findMany({
    where: { verificationStatus: { in: ["APPROVED", "REJECTED", "REVOKED"] } },
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  const statusStyle: Record<string, string> = {
    APPROVED: "text-team-primary bg-team-subtle border-team-subtle",
    REJECTED: "text-[#717171] bg-[#F7F7F7] border-[#DDDDDD]",
    REVOKED: "text-red-600 bg-red-50 border-red-200",
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-[#DDDDDD]">
          <ShieldCheck className="h-6 w-6 text-team-primary" />
          <h1 className="text-2xl font-semibold text-[#222222]">Seller verifications</h1>
        </div>

        {/* Pending */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-semibold text-[#222222]">Pending review</h2>
            {pendingProfiles.length > 0 && (
              <span className="rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-xs font-semibold px-2.5 py-1">
                {pendingProfiles.length}
              </span>
            )}
          </div>

          {pendingProfiles.length === 0 ? (
            <div className="rounded-2xl border border-[#DDDDDD] p-12 text-center">
              <p className="text-3xl mb-3">✅</p>
              <p className="text-[#717171] text-sm">No pending applications.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingProfiles.map((profile) => (
                <div key={profile.id} className="rounded-2xl border border-[#DDDDDD] bg-white p-7">
                  <div className="flex flex-col md:flex-row gap-7">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-[#222222]">{profile.user.name ?? "Unknown"}</p>
                        <span className="text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-200 rounded-full px-2.5 py-1">
                          Pending
                        </span>
                      </div>
                      <p className="text-sm text-[#717171] mb-1">{profile.user.email}</p>
                      <p className="text-xs text-[#717171]">Applied: {formatDateShort(profile.createdAt)}</p>

                      {profile.bio && (
                        <div className="mt-5 p-4 rounded-xl bg-[#F7F7F7] text-sm">
                          <p className="font-semibold text-xs text-[#717171] uppercase tracking-wider mb-2">Description</p>
                          <p className="text-[#222222] leading-relaxed">{profile.bio}</p>
                        </div>
                      )}

                      <div className="mt-5">
                        <p className="font-semibold text-xs text-[#717171] uppercase tracking-wider mb-3">
                          Documents ({profile.verificationDocuments.length})
                        </p>
                        <div className="space-y-2">
                          {profile.verificationDocuments.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between text-sm p-3 rounded-xl bg-[#F7F7F7] border border-[#DDDDDD]">
                              <span className="truncate text-[#222222] font-medium">{doc.fileName}</span>
                              <span className="text-xs text-[#717171] ml-2 flex-shrink-0">{doc.fileType}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <AdminVerificationActions profileId={profile.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently reviewed */}
        <div>
          <h2 className="font-semibold text-[#222222] mb-6">Recently reviewed</h2>
          <div className="rounded-2xl border border-[#DDDDDD] bg-white overflow-hidden">
            <div className="divide-y divide-[#DDDDDD]">
              {recentlyReviewed.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-semibold text-sm text-[#222222]">{profile.user.name}</p>
                    <p className="text-xs text-[#717171]">{profile.user.email}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${statusStyle[profile.verificationStatus] ?? "text-[#717171] bg-[#F7F7F7] border-[#DDDDDD]"}`}>
                    {profile.verificationStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
