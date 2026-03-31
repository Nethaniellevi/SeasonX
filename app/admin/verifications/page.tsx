import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck className="h-7 w-7 text-blue-600" />
        <h1 className="text-3xl font-bold">Seller Verifications</h1>
      </div>

      {/* Pending */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-4">
          Pending Review
          {pendingProfiles.length > 0 && (
            <span className="ml-2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 text-xs px-2 py-0.5">
              {pendingProfiles.length}
            </span>
          )}
        </h2>

        {pendingProfiles.length === 0 ? (
          <p className="text-muted-foreground text-sm">No pending applications. 🎉</p>
        ) : (
          <div className="space-y-4">
            {pendingProfiles.map((profile) => (
              <Card key={profile.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-bold">{profile.user.name ?? "Unknown"}</p>
                        <Badge variant="warning">Pending</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{profile.user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Applied: {formatDateShort(profile.createdAt)}
                      </p>

                      {profile.bio && (
                        <div className="mt-3 p-3 rounded-lg bg-muted/50 text-sm">
                          <p className="font-medium text-xs text-muted-foreground mb-1">Description</p>
                          <p>{profile.bio}</p>
                        </div>
                      )}

                      {/* Documents */}
                      <div className="mt-4">
                        <p className="font-medium text-xs text-muted-foreground mb-2">
                          Documents ({profile.verificationDocuments.length})
                        </p>
                        <div className="space-y-1">
                          {profile.verificationDocuments.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between text-sm p-2 rounded bg-muted/50">
                              <span className="truncate">{doc.fileName}</span>
                              <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{doc.fileType}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <AdminVerificationActions profileId={profile.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recently reviewed */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recently Reviewed</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentlyReviewed.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="font-medium text-sm">{profile.user.name}</p>
                    <p className="text-xs text-muted-foreground">{profile.user.email}</p>
                  </div>
                  <Badge
                    variant={
                      profile.verificationStatus === "APPROVED" ? "success" :
                      profile.verificationStatus === "REVOKED" ? "destructive" : "secondary"
                    }
                  >
                    {profile.verificationStatus}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
