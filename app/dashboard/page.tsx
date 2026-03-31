import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/auth";
import Link from "next/link";
import { VerifiedBadge } from "@/components/verified-badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { ShieldCheck, Ticket, ShoppingBag, Plus, ArrowRight, Clock } from "lucide-react";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const recentPurchases = await prisma.purchase.findMany({
    where: { buyerId: user.id },
    include: {
      listing: { select: { homeTeam: true, awayTeam: true, eventDate: true, sport: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const isVerifiedSeller = user.sellerProfile?.verificationStatus === "APPROVED";
  const isPendingVerification = user.sellerProfile?.verificationStatus === "PENDING";

  const statusColor: Record<string, string> = {
    COMPLETED: "text-team-primary bg-team-subtle",
    TRANSFERRED: "text-blue-600 bg-blue-50",
    DISPUTED: "text-red-600 bg-red-50",
    AWAITING_TRANSFER: "text-amber-600 bg-amber-50",
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-[#DDDDDD]">
          <h1 className="text-3xl font-semibold text-[#222222] mb-1">
            Welcome back, {user.name?.split(" ")[0] ?? "there"}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            {isVerifiedSeller && <VerifiedBadge size="sm" />}
            <span className="text-[#717171] text-sm">{user.email}</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Link href="/marketplace">
            <div className="rounded-2xl border border-[#DDDDDD] p-5 bg-white hover:shadow-lg transition-shadow flex items-center gap-4 group cursor-pointer">
              <div className="rounded-xl bg-[#F7F7F7] p-3 flex-shrink-0">
                <Ticket className="h-5 w-5 text-[#222222]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#222222]">Browse tickets</p>
                <p className="text-xs text-[#717171]">Find verified listings</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#DDDDDD] group-hover:text-[#222222] transition-colors" />
            </div>
          </Link>

          {isVerifiedSeller ? (
            <>
              <Link href="/seller/listings/new">
                <div className="rounded-2xl border border-[#DDDDDD] p-5 bg-white hover:shadow-lg transition-shadow flex items-center gap-4 group cursor-pointer">
                  <div className="rounded-xl bg-[#F7F7F7] p-3 flex-shrink-0">
                    <Plus className="h-5 w-5 text-[#222222]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#222222]">New listing</p>
                    <p className="text-xs text-[#717171]">Sell your tickets</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#DDDDDD] group-hover:text-[#222222] transition-colors" />
                </div>
              </Link>

              <Link href="/seller/dashboard">
                <div className="rounded-2xl border border-[#DDDDDD] p-5 bg-white hover:shadow-lg transition-shadow flex items-center gap-4 group cursor-pointer">
                  <div className="rounded-xl bg-[#F7F7F7] p-3 flex-shrink-0">
                    <ShoppingBag className="h-5 w-5 text-[#222222]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#222222]">Seller dashboard</p>
                    <p className="text-xs text-[#717171]">Manage listings</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#DDDDDD] group-hover:text-[#222222] transition-colors" />
                </div>
              </Link>
            </>
          ) : isPendingVerification ? (
            <div className="sm:col-span-2 rounded-2xl border border-amber-200 p-5 bg-amber-50 flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-amber-800">Verification under review</p>
                <p className="text-xs text-amber-600">We&apos;re reviewing your documents (1–2 business days)</p>
              </div>
            </div>
          ) : (
            <div className="sm:col-span-2 rounded-2xl border border-[#DDDDDD] p-5 bg-white flex items-center gap-4">
              <div className="rounded-xl bg-[#F7F7F7] p-3 flex-shrink-0">
                <ShieldCheck className="h-5 w-5 text-team-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-[#222222]">Become a verified seller</p>
                <p className="text-xs text-[#717171]">0% fees · $50/month · 14-day free trial</p>
              </div>
              <Link
                href="/seller/verify"
                className="bg-team-primary hover:bg-team-primary-hover text-white font-semibold text-xs px-4 py-2.5 rounded-full transition-colors flex-shrink-0"
              >
                Get verified
              </Link>
            </div>
          )}
        </div>

        {/* Recent purchases */}
        <div className="rounded-2xl border border-[#DDDDDD] bg-white overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#DDDDDD]">
            <h2 className="font-semibold text-[#222222]">Recent purchases</h2>
            <Link href="/purchases" className="text-sm text-[#717171] hover:text-[#222222] underline flex items-center gap-1 transition-colors">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentPurchases.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-2xl mb-3">🎟️</p>
              <p className="text-[#717171] text-sm mb-3">No purchases yet.</p>
              <Link href="/marketplace" className="text-sm font-semibold text-[#222222] underline hover:no-underline">
                Browse tickets
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#DDDDDD]">
              {recentPurchases.map((purchase) => (
                <Link
                  key={purchase.id}
                  href={`/purchases/${purchase.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#F7F7F7] transition-colors"
                >
                  <div>
                    <p className="font-semibold text-sm text-[#222222]">
                      {purchase.listing.homeTeam} vs {purchase.listing.awayTeam}
                    </p>
                    <p className="text-xs text-[#717171]">
                      {formatDateShort(purchase.listing.eventDate)} · {purchase.quantity} ticket{purchase.quantity > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-[#222222]">{formatCurrency(purchase.total)}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[purchase.status] ?? "text-[#717171] bg-[#F7F7F7]"}`}>
                      {purchase.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
