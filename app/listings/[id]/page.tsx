import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, SPORTS_LABELS, TRANSFER_METHOD_LABELS, calculateBuyerFee, calculateTotal } from "@/lib/utils";
import { VerifiedBadge } from "@/components/verified-badge";
import { ShieldCheck, Calendar, MapPin, Ticket, User, Star, Lock } from "lucide-react";
import { BuyTicketsButton } from "./buy-tickets-button";
import { PurchaseConfetti } from "@/components/purchase-confetti";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; canceled?: string }>;
}

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

export default async function ListingDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;

  const listing = await prisma.listing.findFirst({
    where: { id, status: "ACTIVE" },
    include: {
      seller: { select: { name: true, avatarUrl: true, createdAt: true } },
      sellerProfile: { select: { verificationStatus: true, totalSales: true, verifiedAt: true } },
    },
  });

  if (!listing || listing.sellerProfile.verificationStatus !== "APPROVED") {
    notFound();
  }

  const subtotal = listing.pricePerTicket * listing.quantity;
  const buyerFee = calculateBuyerFee(subtotal);
  const gradient = SPORT_GRADIENTS[listing.sport] ?? SPORT_GRADIENTS.OTHER;

  return (
    <div className="min-h-screen bg-white">
      {/* Full-width gradient banner */}
      <div className={`w-full ${gradient} py-16 px-6`}>
        <div className="mx-auto max-w-6xl flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm text-white font-semibold mb-5">
            {SPORTS_LABELS[listing.sport]}
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold text-white leading-tight mb-2">
            {listing.homeTeam}
          </h1>
          <p className="text-white/70 text-xl mb-6">vs {listing.awayTeam}</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm text-white/80">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(listing.eventDate)}
            </span>
            {listing.venue && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {listing.venue}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {sp.success && (
          <>
            <PurchaseConfetti />
            <div className="mb-6 p-4 rounded-2xl border border-team-subtle bg-team-subtle text-team-primary text-sm font-semibold">
              ✓ Purchase complete! Check your email for ticket delivery details.
            </div>
          </>
        )}
        {sp.canceled && (
          <div className="mb-6 p-4 rounded-2xl border border-[#DDDDDD] bg-[#F7F7F7] text-[#717171] text-sm">
            Purchase was canceled. You have not been charged.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event title area (below banner) */}
            <div className="pb-6 border-b border-[#DDDDDD]">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <VerifiedBadge size="md" />
                <span className="text-sm text-[#717171]">
                  {listing.sellerProfile.totalSales > 0
                    ? `${listing.sellerProfile.totalSales} successful sale${listing.sellerProfile.totalSales > 1 ? "s" : ""}`
                    : "Verified seller"}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-[#222222]">
                {listing.quantity} ticket{listing.quantity > 1 ? "s" : ""} · Section {listing.section}
                {listing.row ? ` · Row ${listing.row}` : ""}
              </h2>
            </div>

            {/* Seat details grid */}
            <div className="pb-6 border-b border-[#DDDDDD]">
              <h3 className="font-semibold text-[#222222] mb-4">Seat details</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Section", value: listing.section },
                  { label: "Row", value: listing.row ?? "—" },
                  { label: "Seats", value: listing.seats.join(", ") || "—" },
                  { label: "Quantity", value: `${listing.quantity} ticket${listing.quantity > 1 ? "s" : ""}` },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center p-4 rounded-2xl bg-[#F7F7F7]">
                    <p className="text-xs text-[#717171] mb-1">{label}</p>
                    <p className="font-semibold text-[#222222]">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Transfer method */}
            <div className="pb-6 border-b border-[#DDDDDD]">
              <h3 className="font-semibold text-[#222222] flex items-center gap-2 mb-3">
                <Ticket className="h-5 w-5 text-[#717171]" />
                Transfer method
              </h3>
              <p className="text-[#717171]">{TRANSFER_METHOD_LABELS[listing.transferMethod]}</p>
              {listing.notes && (
                <p className="text-sm text-[#717171] mt-2">{listing.notes}</p>
              )}
            </div>

            {/* Seller card */}
            <div className="pb-6 border-b border-[#DDDDDD]">
              <h3 className="font-semibold text-[#222222] flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-[#717171]" />
                About the seller
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-full bg-[#F7F7F7] border border-[#DDDDDD] flex items-center justify-center font-semibold text-team-primary text-xl flex-shrink-0">
                  {listing.seller.name?.charAt(0) ?? "?"}
                </div>
                <div>
                  <p className="font-semibold text-[#222222] text-lg">{listing.seller.name ?? "Anonymous"}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <VerifiedBadge size="sm" />
                    {listing.sellerProfile.totalSales > 0 && (
                      <span className="text-xs text-[#717171]">
                        {listing.sellerProfile.totalSales} sale{listing.sellerProfile.totalSales > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F7F7F7]">
                <ShieldCheck className="h-5 w-5 text-team-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#717171]">
                  Manually verified as a season ticket holder by the SeasonX team.
                  Identity and documents confirmed.
                </p>
              </div>
            </div>

            {/* Trust section */}
            <div>
              <h3 className="font-semibold text-[#222222] mb-4">SeasonX protects you</h3>
              <div className="space-y-4">
                {[
                  { icon: ShieldCheck, title: "Verified seller", desc: "Every seller is manually verified — no anonymous accounts." },
                  { icon: Lock, title: "Secure checkout", desc: "Payments processed securely through Stripe." },
                  { icon: Star, title: "Buyer guarantee", desc: "Dispute protection included on every purchase." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <Icon className="h-5 w-5 text-[#222222] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-[#222222]">{title}</p>
                      <p className="text-sm text-[#717171]">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Airbnb booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-[#DDDDDD] bg-white shadow-lg p-6 space-y-5">
              {/* Price */}
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-2xl font-semibold text-[#222222]">{formatCurrency(listing.pricePerTicket)}</span>
                  <span className="text-[#717171] text-sm"> / ticket</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#222222]">
                  <Star className="h-3.5 w-3.5" fill="currentColor" />
                  <span className="font-semibold">Verified</span>
                </div>
              </div>

              {/* Seat summary box */}
              <div className="rounded-xl border border-[#DDDDDD] overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-[#DDDDDD]">
                  <div className="p-3">
                    <p className="text-[10px] font-semibold text-[#222222] uppercase tracking-wider mb-0.5">Section</p>
                    <p className="text-sm text-[#717171]">{listing.section}{listing.row ? ` · Row ${listing.row}` : ""}</p>
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] font-semibold text-[#222222] uppercase tracking-wider mb-0.5">Quantity</p>
                    <p className="text-sm text-[#717171]">{listing.quantity} ticket{listing.quantity > 1 ? "s" : ""}</p>
                  </div>
                </div>
              </div>

              <BuyTicketsButton
                listingId={listing.id}
                quantity={listing.quantity}
                pricePerTicket={listing.pricePerTicket}
              />

              {/* Fee breakdown */}
              <div className="border-t border-[#DDDDDD] pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#717171]">
                  <span className="underline decoration-dotted">{listing.quantity} × {formatCurrency(listing.pricePerTicket)}</span>
                  <span className="text-[#222222]">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#717171]">
                  <span className="underline decoration-dotted">Buyer fee (3%)</span>
                  <span className="text-[#222222]">{formatCurrency(buyerFee)}</span>
                </div>
                <div className="flex justify-between font-semibold text-[#222222] border-t border-[#DDDDDD] pt-3">
                  <span>Total</span>
                  <span>{formatCurrency(calculateTotal(subtotal))}</span>
                </div>
              </div>

              {/* Trust signals */}
              <div className="space-y-2 text-xs text-[#717171]">
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-team-primary flex-shrink-0" />
                  Verified season ticket holder
                </p>
                <p className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-team-primary flex-shrink-0" />
                  Secure checkout via Stripe
                </p>
                <p className="text-center text-[#BBBBBB] pt-1">All sales are final.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
