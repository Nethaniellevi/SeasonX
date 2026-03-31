import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Ticket } from "lucide-react";

export async function Navbar() {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Ticket className="h-6 w-6 text-blue-600" />
          <span>Season<span className="text-blue-600">X</span></span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
            Browse Tickets
          </Link>
          <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </Link>
          <Link href="/seller/verify" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            Become a Seller
          </Link>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
