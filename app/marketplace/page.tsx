import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/app/generated/prisma/client";
import { formatCurrency, formatDateShort, SPORTS_LABELS } from "@/lib/utils";
import { VerifiedBadge } from "@/components/verified-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MarketplaceFilters } from "./marketplace-filters";
import { ShieldCheck } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    sport?: string;
    team?: string;
    minPrice?: string;
    maxPrice?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

export const metadata = { title: "Browse Tickets" };

export default async function MarketplacePage({ searchParams }: PageProps) {
  const params = await searchParams;

  const where: Prisma.ListingWhereInput = {
    status: "ACTIVE",
    sellerProfile: { verificationStatus: "APPROVED" },
  };

  if (params.sport && params.sport !== "ALL") {
    where.sport = params.sport as Prisma.EnumSportFilter;
  }
  if (params.team) {
    where.OR = [
      { homeTeam: { contains: params.team, mode: "insensitive" } },
      { awayTeam: { contains: params.team, mode: "insensitive" } },
    ];
  }
  if (params.minPrice || params.maxPrice) {
    where.pricePerTicket = {
      ...(params.minPrice ? { gte: parseFloat(params.minPrice) } : {}),
      ...(params.maxPrice ? { lte: parseFloat(params.maxPrice) } : {}),
    };
  }
  if (params.dateFrom || params.dateTo) {
    where.eventDate = {
      ...(params.dateFrom ? { gte: new Date(params.dateFrom) } : {}),
      ...(params.dateTo ? { lte: new Date(params.dateTo) } : {}),
    };
  }

  const listings = await prisma.listing.findMany({
    where,
    include: {
      seller: { select: { name: true } },
      sellerProfile: { select: { verificationStatus: true, totalSales: true } },
    },
    orderBy: { eventDate: "asc" },
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Browse Tickets</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            All listings are from verified season ticket holders
          </div>
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          {listings.length} listing{listings.length !== 1 ? "s" : ""} found
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <MarketplaceFilters />
        </aside>

        {/* Listings grid */}
        <div className="flex-1">
          {listings.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg font-medium mb-2">No listings found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <Link key={listing.id} href={`/listings/${listing.id}`}>
                  <Card className="h-full hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer">
                    <CardContent className="p-5 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {SPORTS_LABELS[listing.sport]}
                        </Badge>
                        <VerifiedBadge size="sm" />
                      </div>

                      <h3 className="font-bold text-base mb-1 flex-1">
                        {listing.homeTeam} vs {listing.awayTeam}
                      </h3>

                      <div className="space-y-1 text-sm text-muted-foreground mb-4">
                        <p>{formatDateShort(listing.eventDate)}</p>
                        {listing.venue && <p>{listing.venue}</p>}
                        <p>Section {listing.section}{listing.row ? `, Row ${listing.row}` : ""}</p>
                      </div>

                      <div className="flex items-end justify-between mt-auto pt-3 border-t border-border">
                        <div className="text-xs text-muted-foreground">
                          {listing.quantity} ticket{listing.quantity > 1 ? "s" : ""}
                          <br />
                          {listing.sellerProfile.totalSales > 0 && (
                            <span>{listing.sellerProfile.totalSales} sales</span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-xl text-blue-600">
                            {formatCurrency(listing.pricePerTicket)}
                          </div>
                          <div className="text-xs text-muted-foreground">per ticket + 3% fee</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
