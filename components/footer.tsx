import Link from "next/link";
import { Ticket, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40 mt-20">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-3">
              <Ticket className="h-5 w-5 text-blue-600" />
              <span>Season<span className="text-blue-600">X</span></span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              The only ticket marketplace exclusively for verified season ticket holders.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-blue-600">
              <ShieldCheck className="h-4 w-4" />
              Verified Sellers Only
            </div>
          </div>

          {/* Buy */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Buy Tickets</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/marketplace" className="hover:text-foreground transition-colors">Browse All</Link></li>
              <li><Link href="/marketplace?sport=NFL" className="hover:text-foreground transition-colors">NFL</Link></li>
              <li><Link href="/marketplace?sport=NBA" className="hover:text-foreground transition-colors">NBA</Link></li>
              <li><Link href="/marketplace?sport=MLB" className="hover:text-foreground transition-colors">MLB</Link></li>
              <li><Link href="/marketplace?sport=NHL" className="hover:text-foreground transition-colors">NHL</Link></li>
            </ul>
          </div>

          {/* Sell */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Sell Tickets</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/seller/verify" className="hover:text-foreground transition-colors">Get Verified</Link></li>
              <li><Link href="/seller/dashboard" className="hover:text-foreground transition-colors">Seller Dashboard</Link></li>
              <li><Link href="/seller/listings/new" className="hover:text-foreground transition-colors">Create Listing</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal" className="hover:text-foreground transition-colors">Ticket Resale Disclosure</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} SeasonX. All rights reserved.</p>
          <p className="text-center">
            SeasonX is a ticket resale platform. We are not affiliated with any sports team, venue, or league.
            Tickets are sold by verified season ticket holders. All sales are final.
          </p>
        </div>
      </div>
    </footer>
  );
}
