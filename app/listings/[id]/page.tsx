import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, SPORTS_LABELS, TRANSFER_METHOD_LABELS, calculateBuyerFee, calculateTotal } from "@/lib/utils";
import { VerifiedBadge } from "@/components/verified-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Calendar, MapPin, Ticket, User } from "lucide-react";
import { BuyTicketsButton } from "./buy-tickets-button";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; canceled?: string }>;
}

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

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      {sp.success && (
        <div className="mb-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm font-medium">
          ✓ Purchase complete! Check your email for ticket delivery details.
        </div>
      )}
      {sp.canceled && (
        <div className="mb-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm">
          Purchase was canceled. You have not been charged.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — main info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="secondary">{SPORTS_LABELS[listing.sport]}</Badge>
              <VerifiedBadge size="sm" />
            </div>
            <h1 className="text-3xl font-extrabold mb-2">
              {listing.homeTeam} vs {listing.awayTeam}
            </h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
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

          <Separator />

          {/* Seat details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Section", value: listing.section },
              { label: "Row", value: listing.row ?? "—" },
              { label: "Seats", value: listing.seats.join(", ") || "—" },
              { label: "Quantity", value: `${listing.quantity} ticket${listing.quantity > 1 ? "s" : ""}` },
            ].map(({ label, value }) => (
              <div key={label} className="p-4 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
                <p className="font-bold">{value}</p>
              </div>
            ))}
          </div>

          {/* Transfer method */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Ticket className="h-4 w-4 text-blue-600" />
                Ticket Transfer Method
              </h3>
              <p className="text-sm">{TRANSFER_METHOD_LABELS[listing.transferMethod]}</p>
              {listing.notes && (
                <p className="text-sm text-muted-foreground mt-2">{listing.notes}</p>
              )}
            </CardContent>
          </Card>

          {/* Seller info */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                About the Seller
              </h3>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-700">
                  {listing.seller.name?.charAt(0) ?? "?"}
                </div>
                <div>
                  <p className="font-medium">{listing.seller.name ?? "Anonymous"}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <VerifiedBadge size="sm" />
                    {listing.sellerProfile.totalSales > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {listing.sellerProfile.totalSales} completed sale{listing.sellerProfile.totalSales > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-xs text-blue-800 dark:text-blue-200">
                <ShieldCheck className="h-4 w-4 inline mr-1" />
                This seller has been verified as a season ticket holder by the SeasonX team.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right — pricing & buy */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-blue-600">
                    {formatCurrency(listing.pricePerTicket)}
                  </div>
                  <p className="text-sm text-muted-foreground">per ticket</p>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {listing.quantity} × {formatCurrency(listing.pricePerTicket)}
                    </span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Buyer fee (3%)</span>
                    <span>{formatCurrency(buyerFee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>{formatCurrency(calculateTotal(subtotal))}</span>
                  </div>
                </div>

                <BuyTicketsButton
                  listingId={listing.id}
                  quantity={listing.quantity}
                  pricePerTicket={listing.pricePerTicket}
                />

                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                    Verified season ticket holder
                  </p>
                  <p>Secure checkout via Stripe</p>
                  <p>All sales are final. See our Terms.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
