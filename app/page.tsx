import Link from "next/link";
import { ShieldCheck, TrendingDown, Zap, Star, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VerifiedBadge } from "@/components/verified-badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDateShort, SPORTS_LABELS } from "@/lib/utils";

async function getRecentListings() {
  try {
    return await prisma.listing.findMany({
      where: { status: "ACTIVE" },
      include: {
        seller: { select: { name: true, avatarUrl: true } },
        sellerProfile: { select: { verificationStatus: true, totalSales: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  } catch {
    return [];
  }
}

const SPORTS = ["NFL", "NBA", "MLB", "NHL", "MLS", "College"];

export default async function HomePage() {
  const listings = await getRecentListings();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
        <div className="relative container mx-auto max-w-7xl px-4 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/20 border border-blue-500/30 px-4 py-1.5 text-sm font-medium text-blue-300 mb-6">
            <ShieldCheck className="h-4 w-4" />
            Only Verified Season Ticket Holders Can Sell
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Tickets From People
            <br />
            <span className="text-blue-400">Held To A Higher Standard</span>
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Every seller on SeasonX is a verified season ticket holder — the same people with skin in the game.
            Pay just <strong className="text-white">3% buyer fee</strong>, 3–5× less than competitors.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="xl" asChild className="bg-blue-600 hover:bg-blue-500 text-white">
              <Link href="/marketplace">
                Browse Tickets <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10">
              <Link href="/seller/verify">
                <ShieldCheck className="h-5 w-5" />
                Become a Verified Seller
              </Link>
            </Button>
          </div>

          {/* Sport tags */}
          <div className="flex flex-wrap gap-2 justify-center">
            {SPORTS.map((sport) => (
              <Link
                key={sport}
                href={`/marketplace?sport=${sport.toUpperCase().replace(" ", "_")}`}
                className="rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm font-medium text-white/80 hover:bg-white/20 transition-colors"
              >
                {sport}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "100%", label: "Verified Sellers", icon: ShieldCheck },
              { value: "3%", label: "Buyer Fee (vs 15–25%)", icon: TrendingDown },
              { value: "$0", label: "Seller Fees", icon: Zap },
              { value: "5★", label: "Trust Rating", icon: Star },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon className="h-6 w-6 text-blue-600" />
                <div className="text-3xl font-black text-blue-600">{value}</div>
                <div className="text-sm text-muted-foreground font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      {listings.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-1">Latest Listings</h2>
              <p className="text-muted-foreground">Fresh tickets from verified season ticket holders</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/marketplace">View All <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <Link key={listing.id} href={`/listings/${listing.id}`}>
                <Card className="h-full hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {SPORTS_LABELS[listing.sport]}
                      </Badge>
                      <VerifiedBadge size="sm" />
                    </div>
                    <h3 className="font-bold text-base mb-1">
                      {listing.homeTeam} vs {listing.awayTeam}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {formatDateShort(listing.eventDate)}
                      {listing.venue && ` · ${listing.venue}`}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">Section {listing.section}{listing.row ? `, Row ${listing.row}` : ""}</div>
                        <div className="text-xs text-muted-foreground">{listing.quantity} ticket{listing.quantity > 1 ? "s" : ""}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-blue-600">
                          {formatCurrency(listing.pricePerTicket)}
                        </div>
                        <div className="text-xs text-muted-foreground">per ticket</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How SeasonX Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Simple, transparent, and built on trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Sellers Get Verified",
                description:
                  "Season ticket holders submit proof of ownership (invoices, account screenshots). Our team manually reviews and approves each seller.",
                icon: ShieldCheck,
                color: "text-blue-600",
                bg: "bg-blue-100 dark:bg-blue-900/30",
              },
              {
                step: "2",
                title: "Browse & Buy",
                description:
                  "Browse listings from verified STHs only. Pay a flat 3% buyer fee — no hidden charges. Checkout securely via Stripe.",
                icon: TrendingDown,
                color: "text-emerald-600",
                bg: "bg-emerald-100 dark:bg-emerald-900/30",
              },
              {
                step: "3",
                title: "Get Your Tickets",
                description:
                  "Seller transfers tickets after purchase. You get a secure download or mobile transfer. Simple dispute resolution if anything goes wrong.",
                icon: Zap,
                color: "text-purple-600",
                bg: "bg-purple-100 dark:bg-purple-900/30",
              },
            ].map(({ step, title, description, icon: Icon, color, bg }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className={`rounded-full ${bg} p-4 mb-4`}>
                  <Icon className={`h-8 w-8 ${color}`} />
                </div>
                <div className="text-4xl font-black text-muted-foreground/30 mb-2">{step}</div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller CTA */}
      <section className="container mx-auto max-w-7xl px-4 py-16">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-0 overflow-hidden">
          <CardContent className="p-10 md:p-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium mb-4">
                  <ShieldCheck className="h-4 w-4" />
                  For Season Ticket Holders
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                  Sell for $50/mo.<br />Keep everything else.
                </h2>
                <ul className="space-y-2 mb-6">
                  {[
                    "0% seller fees — flat $50/month subscription",
                    "Compared to 10–15% per ticket on StubHub",
                    "14-day free trial",
                    "Unlimited listings",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-white/90">
                      <Check className="h-4 w-4 text-white flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-shrink-0">
                <Button size="xl" variant="secondary" asChild className="text-blue-700 font-bold">
                  <Link href="/seller/verify">
                    Start Selling Today <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
