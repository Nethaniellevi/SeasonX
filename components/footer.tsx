import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#DDDDDD] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <p className="font-semibold text-xl text-[#222222] mb-3 tracking-tight">
              Season<span style={{ color: "var(--team-primary)" }}>X</span>
            </p>
            <p className="text-sm text-[#717171] leading-relaxed max-w-xs">
              The only ticket marketplace exclusively for verified season ticket holders.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#717171] mb-4">Buy</p>
            <ul className="space-y-3 text-sm text-[#717171]">
              {[["Browse All", "/marketplace"], ["NFL", "/marketplace?sport=NFL"], ["NBA", "/marketplace?sport=NBA"], ["MLB", "/marketplace?sport=MLB"], ["NHL", "/marketplace?sport=NHL"]].map(([l, h]) => (
                <li key={l}><Link href={h} className="hover:text-[#222222] transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#717171] mb-4">Sell</p>
            <ul className="space-y-3 text-sm text-[#717171]">
              {[["Get Verified", "/seller/verify"], ["Seller Dashboard", "/seller/dashboard"], ["Pricing", "/pricing"]].map(([l, h]) => (
                <li key={l}><Link href={h} className="hover:text-[#222222] transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#717171] mb-4">Company</p>
            <ul className="space-y-3 text-sm text-[#717171]">
              {[["About", "/about"], ["How It Works", "/how-it-works"], ["Terms", "/terms"], ["Privacy", "/privacy"]].map(([l, h]) => (
                <li key={l}><Link href={h} className="hover:text-[#222222] transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-[#DDDDDD] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#717171]">
          <p>© {new Date().getFullYear()} SeasonX. All rights reserved.</p>
          <p>SeasonX is a resale platform. Not affiliated with any team, venue, or league. All sales final.</p>
        </div>
      </div>
    </footer>
  );
}
