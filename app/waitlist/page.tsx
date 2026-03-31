import { getWaitlistCount } from "@/app/actions/waitlist-actions";
import { WaitlistForm } from "@/components/waitlist-form";
import { ShieldCheck, Zap, DollarSign } from "lucide-react";

export default async function WaitlistPage() {
  const count = await getWaitlistCount();

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">

        {/* Badge */}
        {count > 0 && (
          <div className="inline-flex items-center gap-2 bg-[#F7F7F7] border border-[#DDDDDD] rounded-full px-4 py-2 text-xs font-semibold text-[#717171] mb-8">
            <span className="w-2 h-2 rounded-full bg-team-primary animate-pulse" />
            {count.toLocaleString()} {count === 1 ? "person" : "people"} already joined
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-semibold text-[#222222] leading-tight mb-5 tracking-tight">
          The ticket marketplace<br />
          <span className="text-team-primary">built for real fans.</span>
        </h1>

        <p className="text-[#717171] text-lg mb-12 max-w-lg mx-auto leading-relaxed">
          SeasonX is launching soon. Get early access to verified tickets
          directly from season ticket holders — at just 3% buyer fee.
        </p>

        <WaitlistForm />

        {/* Why join */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {[
            {
              icon: ShieldCheck,
              title: "100% verified sellers",
              desc: "Every seller manually verified as a season ticket holder.",
            },
            {
              icon: DollarSign,
              title: "Only 3% buyer fee",
              desc: "StubHub charges 25%+. We think that's wrong.",
            },
            {
              icon: Zap,
              title: "Early access perks",
              desc: "Waitlist members get first access when we launch.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-team-subtle flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-team-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-[#222222] mb-1">{title}</p>
                <p className="text-xs text-[#717171] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
