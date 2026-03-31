import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/auth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VerifiedBadge } from "@/components/verified-badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import {
  ShieldCheck, Ticket, ShoppingBag, Plus, ArrowRight, Clock
} from "lucide-react";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  // Recent purchases as buyer
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

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            Hello, {user.name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <div className="flex items-center gap-2">
            {isVerifiedSeller && <VerifiedBadge size="sm" />}
            <span className="text-muted-foreground text-sm">{user.email}</span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Card className="hover:border-blue-300 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
              <Ticket className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Browse Tickets</p>
              <p className="text-xs text-muted-foreground">Find verified listings</p>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/marketplace"><ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        {isVerifiedSeller ? (
          <>
            <Card className="hover:border-blue-300 transition-colors">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-3">
                  <Plus className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">New Listing</p>
                  <p className="text-xs text-muted-foreground">Sell your tickets</p>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/seller/listings/new"><ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-blue-300 transition-colors">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3">
                  <ShoppingBag className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">Seller Dashboard</p>
                  <p className="text-xs text-muted-foreground">Manage your listings</p>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/seller/dashboard"><ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          </>
        ) : isPendingVerification ? (
          <Card className="sm:col-span-2 border-amber-200 bg-amber-50 dark:bg-amber-900/10">
            <CardContent className="p-5 flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-amber-800 dark:text-amber-200">
                  Verification Under Review
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  We're reviewing your documents (1–2 business days)
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="sm:col-span-2 hover:border-blue-300 transition-colors">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Become a Verified Seller</p>
                <p className="text-xs text-muted-foreground">0% fees · $50/month · 14-day trial</p>
              </div>
              <Button size="sm" asChild>
                <Link href="/seller/verify">Get Verified</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent purchases */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg">Recent Purchases</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/purchases">View All <ArrowRight className="h-3.5 w-3.5" /></Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recentPurchases.length === 0 ? (
            <div className="px-6 pb-6 text-center text-muted-foreground text-sm">
              No purchases yet.{" "}
              <Link href="/marketplace" className="text-blue-600 hover:underline">
                Browse tickets
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentPurchases.map((purchase) => (
                <Link
                  key={purchase.id}
                  href={`/purchases/${purchase.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {purchase.listing.homeTeam} vs {purchase.listing.awayTeam}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateShort(purchase.listing.eventDate)} · {purchase.quantity} ticket{purchase.quantity > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{formatCurrency(purchase.total)}</p>
                    <Badge
                      variant={
                        purchase.status === "COMPLETED" ? "success" :
                        purchase.status === "DISPUTED" ? "destructive" :
                        purchase.status === "TRANSFERRED" ? "default" :
                        "warning"
                      }
                      className="text-xs"
                    >
                      {purchase.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
