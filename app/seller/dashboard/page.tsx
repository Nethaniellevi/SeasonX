import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VerifiedBadge } from "@/components/verified-badge";
import { formatCurrency, formatDateShort, SPORTS_LABELS } from "@/lib/utils";
import { Plus, Settings, TrendingUp, ShieldCheck } from "lucide-react";

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

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Seller Dashboard</h1>
          <VerifiedBadge size="md" />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/seller/subscription"><Settings className="h-4 w-4" /> Subscription</Link>
          </Button>
          <Button asChild>
            <Link href="/seller/listings/new"><Plus className="h-4 w-4" /> New Listing</Link>
          </Button>
        </div>
      </div>

      {/* Subscription status alert */}
      {subStatus && !["TRIALING", "ACTIVE"].includes(subStatus) && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 text-red-800 dark:text-red-200 text-sm">
          ⚠️ Your subscription is {subStatus.toLowerCase().replace(/_/g, " ")}.
          Your listings are hidden.{" "}
          <Link href="/seller/subscription" className="font-semibold underline">
            Update billing
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Listings", value: activeListings.length, icon: ShieldCheck, color: "text-blue-600" },
          { label: "Total Sales", value: user.sellerProfile.totalSales, icon: TrendingUp, color: "text-emerald-600" },
          { label: "Tickets Sold", value: soldListings.length, icon: ShieldCheck, color: "text-purple-600" },
          { label: "Revenue (approx)", value: formatCurrency(totalRevenue), icon: TrendingUp, color: "text-amber-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <Icon className={`h-5 w-5 ${color} mb-2`} />
              <p className="text-2xl font-black">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Listings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">My Listings</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/seller/listings">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {listings.length === 0 ? (
              <div className="px-6 pb-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">No listings yet</p>
                <Button size="sm" asChild>
                  <Link href="/seller/listings/new"><Plus className="h-4 w-4" /> Create Listing</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {listings.slice(0, 5).map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between px-6 py-3">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {listing.homeTeam} vs {listing.awayTeam}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateShort(listing.eventDate)} · {SPORTS_LABELS[listing.sport]}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-sm font-bold">{formatCurrency(listing.pricePerTicket)}</span>
                      <Badge
                        variant={listing.status === "ACTIVE" ? "success" : listing.status === "SOLD" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {listing.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/seller/orders">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentOrders.length === 0 ? (
              <p className="px-6 pb-6 text-sm text-muted-foreground text-center">No orders yet</p>
            ) : (
              <div className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/seller/orders/${order.id}`}
                    className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {order.listing.homeTeam} vs {order.listing.awayTeam}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.buyer.name} · {order.quantity} ticket{order.quantity > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-sm font-bold">{formatCurrency(order.subtotal)}</span>
                      <Badge
                        variant={
                          order.status === "COMPLETED" ? "success" :
                          order.status === "DISPUTED" ? "destructive" :
                          order.status === "AWAITING_TRANSFER" ? "warning" : "secondary"
                        }
                        className="text-xs"
                      >
                        {order.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
