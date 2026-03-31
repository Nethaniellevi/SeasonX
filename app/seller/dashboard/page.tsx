import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { VerifiedBadge } from "@/components/verified-badge";
import { formatCurrency, formatDateShort, SPORTS_LABELS } from "@/lib/utils";
import { Plus, Settings } from "lucide-react";

export const metadata = { title: "Seller Dashboard" };

export default async function SellerDashboardPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  if (!user.sellerProfile || user.sellerProfile.verificationStatus !== "APPROVED") {
    redirect("/seller/verify");
  }

  const [listings, recentOrders] = await Promise.all([
    prisma.listing.findMany({
      where: { sellerId: user.id, status: { not: "HIDDEN" } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.purchase.findMany({
      where: { listing: { sellerId: user.id } },
      include: {
        buyer: { select: { name: true, email: true } },
        listing: { select: { homeTeam: true, awayTeam: true, eventDate: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const activeListings = listings.filter((l) => l.status === "ACTIVE");
  const soldListings = listings.filter((l) => l.status === "SOLD");
  const totalRevenue = recentOrders
    .filter((o) => ["TRANSFERRED", "COMPLETED"].includes(o.status))
    .reduce((sum, o) => sum + o.subtotal, 0);

  const subscription = user.subscription;
  const subStatus = subscription?.status;

  const orderStatusStyle: Record<string, string> = {
    COMPLETED: "text-team-primary bg-team-subtle",
    TRANSFERRED: "text-blue-600 bg-blue-50",
    DISPUTED: "text-red-600 bg-red-50",
    AWAITING_TRANSFER: "text-amber-600 bg-amber-50",
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-[#DDDDDD]">
          <div>
            <h1 className="text-3xl font-semibold text-[#222222] mb-2">Seller dashboard</h1>
            <VerifiedBadge size="md" />
          </div>
          <div className="flex gap-3">
            <Link
              href="/seller/subscription"
              className="flex items-center gap-2 border border-[#DDDDDD] bg-white rounded-full px-4 py-2.5 text-sm font-semibold text-[#717171] hover:text-[#222222] hover:border-[#222222] transition-all"
            >
              <Settings className="h-4 w-4" /> Subscription
            </Link>
            <Link
              href="/seller/listings/new"
              className="flex items-center gap-2 bg-team-primary hover:bg-team-primary-hover text-white font-semibold text-sm px-4 py-2.5 rounded-full transition-colors"
            >
              <Plus className="h-4 w-4" /> New listing
            </Link>
          </div>
        </div>

        {/* Subscription alert */}
        {subStatus && !["TRIALING", "ACTIVE"].includes(subStatus) && (
          <div className="mb-8 p-4 rounded-2xl border border-red-200 bg-red-50 text-red-700 text-sm font-semibold">
            Your subscription is {subStatus.toLowerCase().replace(/_/g, " ")}. Your listings are hidden.{" "}
            <Link href="/seller/subscription" className="underline">Update billing</Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Active listings", value: activeListings.length },
            { label: "Total sales", value: user.sellerProfile.totalSales },
            { label: "Tickets sold", value: soldListings.length },
            { label: "Revenue", value: formatCurrency(totalRevenue) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl border border-[#DDDDDD] p-5 bg-white text-center">
              <p className="text-3xl font-semibold text-[#222222] mb-1">{value}</p>
              <p className="text-xs text-[#717171]">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Listings */}
          <div className="rounded-2xl border border-[#DDDDDD] bg-white overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#DDDDDD]">
              <h2 className="font-semibold text-[#222222]">My listings</h2>
              <Link href="/seller/listings" className="text-sm text-[#717171] hover:text-[#222222] underline transition-colors">
                View all
              </Link>
            </div>

            {listings.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-2xl mb-3">🎟️</p>
                <p className="text-sm text-[#717171] mb-4">No listings yet</p>
                <Link
                  href="/seller/listings/new"
                  className="inline-flex items-center gap-2 bg-team-primary hover:bg-team-primary-hover text-white font-semibold text-sm px-4 py-2.5 rounded-full transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Create listing
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#DDDDDD]">
                {listings.slice(0, 5).map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between px-6 py-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[#222222] truncate">
                        {listing.homeTeam} vs {listing.awayTeam}
                      </p>
                      <p className="text-xs text-[#717171]">
                        {formatDateShort(listing.eventDate)} · {SPORTS_LABELS[listing.sport]}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <span className="font-semibold text-sm text-[#222222]">{formatCurrency(listing.pricePerTicket)}</span>
                      <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full ${
                        listing.status === "ACTIVE" ? "text-team-primary bg-team-subtle" :
                        listing.status === "SOLD" ? "text-blue-600 bg-blue-50" :
                        "text-[#717171] bg-[#F7F7F7]"
                      }`}>
                        {listing.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent orders */}
          <div className="rounded-2xl border border-[#DDDDDD] bg-white overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#DDDDDD]">
              <h2 className="font-semibold text-[#222222]">Recent orders</h2>
              <Link href="/seller/orders" className="text-sm text-[#717171] hover:text-[#222222] underline transition-colors">
                View all
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-2xl mb-3">📦</p>
                <p className="text-sm text-[#717171]">No orders yet</p>
              </div>
            ) : (
              <div className="divide-y divide-[#DDDDDD]">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/seller/orders/${order.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-[#F7F7F7] transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[#222222] truncate">
                        {order.listing.homeTeam} vs {order.listing.awayTeam}
                      </p>
                      <p className="text-xs text-[#717171]">
                        {order.buyer.name} · {order.quantity} ticket{order.quantity > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <span className="font-semibold text-sm text-[#222222]">{formatCurrency(order.subtotal)}</span>
                      <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full ${orderStatusStyle[order.status] ?? "text-[#717171] bg-[#F7F7F7]"}`}>
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
