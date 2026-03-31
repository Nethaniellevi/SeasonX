"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Ticket, ArrowRight } from "lucide-react";
import Link from "next/link";

export function OnboardingForm() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="hover:border-blue-400 transition-colors cursor-pointer group">
        <CardContent className="p-8 flex flex-col items-center text-center gap-4">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-4 group-hover:bg-blue-200 transition-colors">
            <Ticket className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Buy Tickets</h2>
            <p className="text-sm text-muted-foreground">
              Browse verified listings, pay just 3% fee, and get tickets from season ticket holders you can trust.
            </p>
          </div>
          <Button asChild className="w-full mt-2">
            <Link href="/marketplace">
              Start Browsing <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:border-blue-400 transition-colors cursor-pointer group">
        <CardContent className="p-8 flex flex-col items-center text-center gap-4">
          <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-4 group-hover:bg-emerald-200 transition-colors">
            <ShieldCheck className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Sell Tickets</h2>
            <p className="text-sm text-muted-foreground">
              Get verified as a season ticket holder, pay $50/month, keep 100% of your sale price. No per-ticket fees.
            </p>
          </div>
          <Button variant="success" asChild className="w-full mt-2">
            <Link href="/seller/verify">
              Get Verified <ShieldCheck className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
