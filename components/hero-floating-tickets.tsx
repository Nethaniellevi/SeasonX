const MINI_TICKETS = [
  {
    side: "left",
    gradient: "from-[#E31837] to-[#C41230]",
    sport: "NFL",
    team: "Chiefs",
    game: "vs Cowboys",
    price: "$420",
    rotate: "-8deg",
    top: "22%",
    delay: "0s",
    offset: "left-4 xl:left-10",
  },
  {
    side: "left",
    gradient: "from-[#552583] to-[#1D428A]",
    sport: "NBA",
    team: "Lakers",
    game: "vs Warriors",
    price: "$280",
    rotate: "-3deg",
    top: "52%",
    delay: "1.2s",
    offset: "left-16 xl:left-24",
  },
  {
    side: "right",
    gradient: "from-[#003087] to-[#003087]",
    sport: "MLB",
    team: "Yankees",
    game: "vs Red Sox",
    price: "$95",
    rotate: "4deg",
    top: "20%",
    delay: "0.6s",
    offset: "right-4 xl:right-10",
  },
  {
    side: "right",
    gradient: "from-[#007A33] to-[#005a26]",
    sport: "NBA",
    team: "Celtics",
    game: "vs Heat",
    price: "$185",
    rotate: "9deg",
    top: "50%",
    delay: "1.8s",
    offset: "right-16 xl:right-24",
  },
];

function MiniTicket({
  gradient,
  sport,
  team,
  game,
  price,
  rotate,
  top,
  delay,
  offset,
}: (typeof MINI_TICKETS)[0]) {
  return (
    <div
      className={`absolute hidden xl:block w-40 rounded-xl border border-[#DDDDDD] shadow-xl overflow-hidden select-none pointer-events-none ${offset}`}
      style={{
        top,
        ["--float-base" as string]: `rotate(${rotate})`,
        animation: `heroFloat 4s ease-in-out infinite`,
        animationDelay: delay,
        transform: `rotate(${rotate})`,
        opacity: 0.92,
      }}
    >
      {/* Gradient header */}
      <div className={`bg-gradient-to-br ${gradient} px-3 py-2.5`}>
        <p className="text-[8px] font-bold uppercase tracking-widest text-white/60 mb-1">{sport}</p>
        <p className="text-white font-bold text-xs leading-tight">{team}</p>
        <p className="text-white/60 text-[10px] mt-0.5">{game}</p>
      </div>

      {/* Perforation */}
      <div className="relative h-4 bg-white overflow-hidden">
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#F7F7F7] border border-[#DDDDDD]" />
        <div className="w-full border-t border-dashed border-[#EEEEEE] mx-2.5" />
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#F7F7F7] border border-[#DDDDDD]" />
      </div>

      {/* Price */}
      <div className="bg-white px-3 py-2">
        <p className="text-[8px] text-[#AAAAAA] font-medium">From</p>
        <p className="text-sm font-bold text-[#222222]">{price}</p>
      </div>
    </div>
  );
}

export function HeroFloatingTickets() {
  return (
    <>
      {MINI_TICKETS.map((t) => (
        <MiniTicket key={`${t.team}-${t.side}`} {...t} />
      ))}
    </>
  );
}
