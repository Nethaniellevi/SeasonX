import Link from "next/link";
import { ShieldCheck } from "lucide-react";

interface TicketCardProps {
  href: string;
  gradient: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  price: string;
  priceSubtext?: string;
  meta?: string;
  badge?: { text: string; positive: boolean };
  verified?: boolean;
}

export function TicketCard({
  href,
  gradient,
  sport,
  homeTeam,
  awayTeam,
  price,
  priceSubtext,
  meta,
  badge,
  verified,
}: TicketCardProps) {
  return (
    <Link href={href} className="block group">
      <div className="rounded-2xl border border-[#DDDDDD] bg-white group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-200">

        {/* Gradient header */}
        <div className={`${gradient} rounded-t-2xl p-5`}>
          <div className="flex items-start justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
              {sport}
            </span>
            {badge && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${
                  badge.positive ? "bg-white/25" : "bg-black/25"
                }`}
              >
                {badge.text}
              </span>
            )}
          </div>
          <p className="text-white font-bold text-sm leading-tight">{homeTeam}</p>
          <p className="text-white/65 text-xs mt-0.5">{awayTeam}</p>
        </div>

        {/* Perforated separator */}
        <div className="relative flex items-center h-6 bg-white overflow-hidden">
          {/* Left notch */}
          <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#F7F7F7] border border-[#DDDDDD]" />
          {/* Dashed line */}
          <div className="w-full border-t-2 border-dashed border-[#EEEEEE] mx-3" />
          {/* Right notch */}
          <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#F7F7F7] border border-[#DDDDDD]" />
        </div>

        {/* Ticket details */}
        <div className="px-5 pb-5 pt-2">
          {meta && (
            <p className="text-[10px] text-[#AAAAAA] font-semibold uppercase tracking-wide mb-2">
              {meta}
            </p>
          )}
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-[10px] text-[#AAAAAA] font-medium mb-0.5">Starting from</p>
              <p className="text-lg font-bold text-[#222222] leading-tight">{price}</p>
              {priceSubtext && (
                <p className="text-[10px] text-[#717171] mt-0.5">{priceSubtext}</p>
              )}
            </div>
            {verified && (
              <div className="w-7 h-7 rounded-full bg-team-subtle flex items-center justify-center flex-shrink-0 mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-team-primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
