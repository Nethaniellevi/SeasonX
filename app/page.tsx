import Link from "next/link";
import { ShieldCheck, Check, ArrowRight, Star } from "lucide-react";
import { HeroGradient } from "@/components/hero-gradient";
import { HeroFloatingTickets } from "@/components/hero-floating-tickets";
import { TicketCard } from "@/components/ticket-card";
import { WaitlistForm } from "@/components/waitlist-form";
import { getWaitlistCount } from "@/app/actions/waitlist-actions";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDateShort, SPORTS_LABELS } from "@/lib/utils";
import { VerifiedBadge } from "@/components/verified-badge";

async function getRecentListings() {
  try {
    return await prisma.listing.findMany({
      where: { status: "ACTIVE", sellerProfile: { verificationStatus: "APPROVED" } },
      include: {
        sellerProfile: { select: { verificationStatus: true, totalSales: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
  } catch {
    return [];
  }
}

const SPORTS = [
  { label: "NFL", value: "NFL", emoji: "🏈" },
  { label: "NBA", value: "NBA", emoji: "🏀" },
  { label: "MLB", value: "MLB", emoji: "⚾" },
  { label: "NHL", value: "NHL", emoji: "🏒" },
  { label: "MLS", value: "MLS", emoji: "⚽" },
  { label: "College", value: "COLLEGE_FOOTBALL", emoji: "🎓" },
];

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

const TRENDING = [
  { team: "Los Angeles Lakers", game: "vs Golden State Warriors", price: 280, change: "+12%", sport: "NBA" },
  { team: "Kansas City Chiefs", game: "vs Dallas Cowboys", price: 420, change: "+8%", sport: "NFL" },
  { team: "New York Yankees", game: "vs Boston Red Sox", price: 95, change: "-3%", sport: "MLB" },
  { team: "Boston Celtics", game: "vs Miami Heat", price: 185, change: "+22%", sport: "NBA" },
];

export default async function HomePage() {
  const [listings, waitlistCount] = await Promise.all([
    getRecentListings(),
    getWaitlistCount(),
  ]);

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="relative bg-white px-6 pt-16 pb-12 text-center overflow-hidden">
        <HeroGradient />
        <HeroFloatingTickets />
        <div className="relative z-10 mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-semibold leading-[1.1] text-[#222222] mb-5 tracking-tight">
            Find verified tickets<br />
            <span className="text-team-primary">from real fans.</span>
          </h1>

          <p className="text-[#717171] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Every seller is a manually verified season ticket holder.
            Pay just 3% — not 25%.
          </p>

          {/* Airbnb-style pill search bar */}
          <div className="flex items-center bg-white rounded-full border border-[#DDDDDD] shadow-md hover:shadow-lg transition-shadow max-w-2xl mx-auto mb-12 overflow-hidden">
            <div className="flex-1 flex items-center gap-0 min-w-0">
              <div className="flex-1 px-6 py-4 text-left">
                <p className="text-xs font-semibold text-[#222222] mb-0.5">Sport</p>
                <p className="text-sm text-[#717171]">Any sport</p>
              </div>
              <div className="w-px h-10 bg-[#DDDDDD] flex-shrink-0" />
              <div className="flex-1 px-6 py-4 text-left">
                <p className="text-xs font-semibold text-[#222222] mb-0.5">Date</p>
                <p className="text-sm text-[#717171]">Any time</p>
              </div>
              <div className="w-px h-10 bg-[#DDDDDD] flex-shrink-0" />
              <div className="flex-1 px-6 py-4 text-left">
                <p className="text-xs font-semibold text-[#222222] mb-0.5">Team</p>
                <p className="text-sm text-[#717171]">Search...</p>
              </div>
            </div>
            <Link
              href="/marketplace"
              className="bg-team-primary hover:bg-team-primary-hover text-white font-semibold text-sm rounded-full px-6 py-4 flex-shrink-0 mx-2 transition-colors"
            >
              Search
            </Link>
          </div>

          {/* Sport category pills */}
          <div className="flex flex-wrap gap-3 justify-center">
            {SPORTS.map(({ label, value, emoji }) => (
              <Link
                key={value}
                href={`/marketplace?sport=${value}`}
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-[#DDDDDD] bg-white px-5 py-3 text-center hover:border-[#222222] transition-colors group"
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs font-semibold text-[#717171] group-hover:text-[#222222] transition-colors">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-[#DDDDDD] px-6 py-5 bg-white">
        <div className="mx-auto max-w-4xl flex flex-wrap gap-6 justify-center items-center text-sm text-[#717171]">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-team-primary" />
            100% verified sellers
          </span>
          <span className="flex items-center gap-2">
            <Star className="h-4 w-4 text-team-primary" fill="currentColor" />
            Only 3% buyer fee
          </span>
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4 text-team-primary" />
            $0 seller fees
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-team-primary" />
            Secure Stripe checkout
          </span>
        </div>
      </section>

      {/* Trending */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-[#222222]">Trending now</h2>
            <Link href="/marketplace" className="text-sm text-[#222222] underline font-semibold hover:no-underline flex items-center gap-1">
              Show all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRENDING.map((item) => (
              <TicketCard
                key={item.team}
                href="/marketplace"
                gradient={SPORT_GRADIENTS[item.sport] ?? SPORT_GRADIENTS.OTHER}
                sport={item.sport}
                homeTeam={item.team}
                awayTeam={item.game}
                price={`$${item.price}`}
                priceSubtext="per ticket"
                badge={{ text: item.change, positive: item.change.startsWith("+") }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Live listings — Airbnb image-first card grid */}
      {listings.length > 0 && (
        <section className="px-6 pb-14">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-[#222222]">Live listings</h2>
              <Link href="/marketplace" className="text-sm text-[#222222] underline font-semibold hover:no-underline flex items-center gap-1">
                Show all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {listings.map((listing) => (
                <TicketCard
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  gradient={SPORT_GRADIENTS[listing.sport] ?? SPORT_GRADIENTS.OTHER}
                  sport={SPORTS_LABELS[listing.sport]}
                  homeTeam={listing.homeTeam}
                  awayTeam={`vs ${listing.awayTeam}`}
                  price={formatCurrency(listing.pricePerTicket)}
                  priceSubtext="per ticket + 3% fee"
                  meta={`${formatDateShort(listing.eventDate)} · Sec ${listing.section}`}
                  verified
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="border-t border-[#DDDDDD] bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-semibold text-[#222222] mb-12 text-center">How SeasonX works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { num: "01", title: "Sellers get verified", desc: "Season ticket holders submit proof. Our team manually reviews and approves each seller. No exceptions." },
              { num: "02", title: "Browse & buy", desc: "Browse from verified STHs only. Pay a flat 3% buyer fee. Checkout securely via Stripe." },
              { num: "03", title: "Get your tickets", desc: "Seller transfers tickets after purchase. Secure delivery with dispute protection." },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex gap-5">
                <span className="text-4xl font-semibold text-[#DDDDDD] flex-shrink-0 leading-none">{num}</span>
                <div>
                  <h3 className="font-semibold text-[#222222] mb-2">{title}</h3>
                  <p className="text-sm text-[#717171] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller CTA */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-2xl">
          <div className="bg-[#222222] rounded-3xl p-12 text-center text-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-team-primary mb-4">For season ticket holders</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Sell for $50/month.<br />Keep everything.
            </h2>
            <p className="text-[#717171] mb-8 leading-relaxed">
              StubHub takes 10–15% per ticket. We take $0 per ticket — just $50/month flat.
              14-day free trial included.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center mb-8">
              {["0% seller fees", "Unlimited listings", "14-day free trial", "Cancel anytime"].map((f) => (
                <span key={f} className="flex items-center gap-1.5 text-sm text-[#AAAAAA]">
                  <Check className="h-4 w-4 text-team-primary" />{f}
                </span>
              ))}
            </div>
            <Link
              href="/seller/verify"
              className="inline-flex items-center gap-2 bg-team-primary hover:bg-team-primary-hover text-white font-semibold rounded-full px-8 py-3.5 transition-colors"
            >
              Start free trial <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section className="border-t border-[#DDDDDD] bg-[#F7F7F7] px-6 py-20">
        <div className="mx-auto max-w-xl text-center">
          {waitlistCount > 0 && (
            <div className="inline-flex items-center gap-2 bg-white border border-[#DDDDDD] rounded-full px-4 py-2 text-xs font-semibold text-[#717171] mb-6">
              <span className="w-2 h-2 rounded-full bg-team-primary animate-pulse" />
              {waitlistCount.toLocaleString()} {waitlistCount === 1 ? "person" : "people"} already joined
            </div>
          )}
          <h2 className="text-3xl font-semibold text-[#222222] mb-3 tracking-tight">
            Be first when we launch
          </h2>
          <p className="text-[#717171] mb-10 leading-relaxed">
            Join the waitlist and get early access to verified tickets from real season ticket holders.
          </p>
          <WaitlistForm />
        </div>
      </section>
    </div>
  );
}
