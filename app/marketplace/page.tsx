import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/app/generated/prisma/client";
import { formatCurrency, formatDateShort, SPORTS_LABELS } from "@/lib/utils";
import { VerifiedBadge } from "@/components/verified-badge";
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

const SPORT_GRADIENTS: Record<string, string> = {
  NFL: "bg-gradient-to-br from-[#1a4731] to-[#2d7a4f]",
  NBA: "bg-gradient-to-br from-[#C9082A] to-[#17408B]",
  MLB: "bg-gradient-to-br from-[#002D72] to-[#D50032]",
  NHL: "bg-gradient-to-br from-[#0033A0] to-[#1e3a5f]",
  MLS: "bg-gradient-to-br from-[#002F6C] to-[#009B77]",
  COLLEGE_FOOTBALL: "bg-gradient-to-br from-[#8B1A1A] to-[#D4A017]",
  COLLEGE_BASKETBALL: "bg-gradient-to-br from-[#1B4F8A] to-[#4A90D9]",
  OTHER: "bg-gradient-to-br from-[#374151] to-[#6B7280]",
};

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
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-white border-b border-[#DDDDDD] px-6 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#222222]">Browse tickets</h1>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-[#717171]">
                <ShieldCheck className="h-3.5 w-3.5 text-team-primary" />
                All from verified season ticket holders
              </div>
            </div>
            <span className="text-sm text-[#717171]">
              {listings.length} listing{listings.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Filters row — horizontal Airbnb category pills + filter button */}
        <div className="mb-8">
          <MarketplaceFilters />
        </div>

        {/* Grid */}
        {listings.length === 0 ? (
          <div className="text-center py-28 text-[#717171]">
            <p className="text-5xl mb-4">🎟️</p>
            <p className="text-lg font-semibold text-[#222222] mb-2">No listings found</p>
            <p className="text-sm">Try adjusting your filters or search for a different sport.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => {
              const gradient = SPORT_GRADIENTS[listing.sport] ?? SPORT_GRADIENTS.OTHER;
              return (
                <Link key={listing.id} href={`/listings/${listing.id}`}>
                  <div className="group cursor-pointer">
                    {/* Gradient banner — Airbnb image replacement */}
                    <div className={`aspect-[4/3] ${gradient} rounded-2xl flex flex-col items-center justify-center p-5 mb-3 hover:shadow-lg transition-shadow`}>
                      <p className="text-white font-semibold text-sm text-center leading-snug">{listing.homeTeam}</p>
                      <p className="text-white/60 text-xs text-center mt-1">vs {listing.awayTeam}</p>
                      <div className="mt-3 bg-white/20 rounded-full px-3 py-1 text-xs text-white font-medium">
                        {SPORTS_LABELS[listing.sport]}
                      </div>
                    </div>
                    {/* Card details below banner */}
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-[#222222] truncate">{listing.homeTeam} vs {listing.awayTeam}</p>
                          <p className="text-xs text-[#717171] mt-0.5 truncate">
                            {formatDateShort(listing.eventDate)}
                            {listing.venue ? ` · ${listing.venue}` : ""}
                          </p>
                          <p className="text-xs text-[#717171]">
                            Sec {listing.section}{listing.row ? ` · Row ${listing.row}` : ""} · {listing.quantity} tickets
                          </p>
                        </div>
                        <VerifiedBadge size="sm" showText={false} className="flex-shrink-0 ml-1 mt-0.5" />
                      </div>
                      <p className="text-sm text-[#222222] mt-2">
                        <span className="font-semibold">{formatCurrency(listing.pricePerTicket)}</span>
                        <span className="text-[#717171]"> / ticket + 3% fee</span>
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
