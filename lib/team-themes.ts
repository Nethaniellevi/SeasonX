export interface TeamTheme {
  id: string;
  name: string;
  sport: "NFL" | "NBA" | "MLB" | "NHL" | "MLS";
  primary: string;
  primaryHover: string;
  onPrimary: string;
  emoji: string;
}

export const TEAM_THEMES: TeamTheme[] = [
  // NFL
  { id: "chiefs", name: "Chiefs", sport: "NFL", primary: "#E31837", primaryHover: "#C41230", onPrimary: "#ffffff", emoji: "🏈" },
  { id: "cowboys", name: "Cowboys", sport: "NFL", primary: "#003594", primaryHover: "#002B7A", onPrimary: "#ffffff", emoji: "⭐" },
  { id: "packers", name: "Packers", sport: "NFL", primary: "#203731", primaryHover: "#162820", onPrimary: "#ffffff", emoji: "🧀" },
  { id: "49ers", name: "49ers", sport: "NFL", primary: "#AA0000", primaryHover: "#8B0000", onPrimary: "#ffffff", emoji: "🏈" },
  { id: "eagles", name: "Eagles", sport: "NFL", primary: "#004C54", primaryHover: "#003840", onPrimary: "#ffffff", emoji: "🦅" },
  { id: "patriots", name: "Patriots", sport: "NFL", primary: "#002244", primaryHover: "#001830", onPrimary: "#ffffff", emoji: "🏈" },
  { id: "seahawks", name: "Seahawks", sport: "NFL", primary: "#002244", primaryHover: "#001830", onPrimary: "#ffffff", emoji: "🦅" },
  { id: "steelers", name: "Steelers", sport: "NFL", primary: "#FFB612", primaryHover: "#E5A310", onPrimary: "#000000", emoji: "🏈" },
  { id: "raiders", name: "Raiders", sport: "NFL", primary: "#000000", primaryHover: "#1a1a1a", onPrimary: "#ffffff", emoji: "☠️" },
  { id: "bills", name: "Bills", sport: "NFL", primary: "#00338D", primaryHover: "#002570", onPrimary: "#ffffff", emoji: "🏈" },
  { id: "bears", name: "Bears", sport: "NFL", primary: "#0B162A", primaryHover: "#060e1c", onPrimary: "#ffffff", emoji: "🐻" },
  { id: "giants", name: "Giants", sport: "NFL", primary: "#0B2265", primaryHover: "#061650", onPrimary: "#ffffff", emoji: "🏈" },
  { id: "bengals", name: "Bengals", sport: "NFL", primary: "#FB4F14", primaryHover: "#e04410", onPrimary: "#ffffff", emoji: "🐯" },
  { id: "ravens", name: "Ravens", sport: "NFL", primary: "#241773", primaryHover: "#180e52", onPrimary: "#ffffff", emoji: "🦅" },
  { id: "broncos", name: "Broncos", sport: "NFL", primary: "#FB4F14", primaryHover: "#e04410", onPrimary: "#ffffff", emoji: "🐴" },
  { id: "saints", name: "Saints", sport: "NFL", primary: "#D3BC8D", primaryHover: "#b8a070", onPrimary: "#000000", emoji: "⚜️" },
  // NBA
  { id: "lakers", name: "Lakers", sport: "NBA", primary: "#552583", primaryHover: "#3d1a60", onPrimary: "#ffffff", emoji: "🏀" },
  { id: "celtics", name: "Celtics", sport: "NBA", primary: "#007A33", primaryHover: "#005a26", onPrimary: "#ffffff", emoji: "☘️" },
  { id: "warriors", name: "Warriors", sport: "NBA", primary: "#1D428A", primaryHover: "#152f65", onPrimary: "#ffffff", emoji: "🏀" },
  { id: "heat", name: "Heat", sport: "NBA", primary: "#98002E", primaryHover: "#750023", onPrimary: "#ffffff", emoji: "🔥" },
  { id: "bulls", name: "Bulls", sport: "NBA", primary: "#CE1141", primaryHover: "#a80e34", onPrimary: "#ffffff", emoji: "🐂" },
  { id: "knicks", name: "Knicks", sport: "NBA", primary: "#006BB6", primaryHover: "#005490", onPrimary: "#ffffff", emoji: "🏀" },
  { id: "bucks", name: "Bucks", sport: "NBA", primary: "#00471B", primaryHover: "#003314", onPrimary: "#ffffff", emoji: "🦌" },
  { id: "nets", name: "Nets", sport: "NBA", primary: "#000000", primaryHover: "#1a1a1a", onPrimary: "#ffffff", emoji: "🏀" },
  { id: "suns", name: "Suns", sport: "NBA", primary: "#1D1160", primaryHover: "#14094a", onPrimary: "#ffffff", emoji: "☀️" },
  { id: "nuggets", name: "Nuggets", sport: "NBA", primary: "#0E2240", primaryHover: "#09182e", onPrimary: "#ffffff", emoji: "⛏️" },
  { id: "mavericks", name: "Mavericks", sport: "NBA", primary: "#00538C", primaryHover: "#003d68", onPrimary: "#ffffff", emoji: "🏀" },
  { id: "spurs", name: "Spurs", sport: "NBA", primary: "#C4CED4", primaryHover: "#a8b3ba", onPrimary: "#000000", emoji: "🤠" },
  { id: "clippers", name: "Clippers", sport: "NBA", primary: "#C8102E", primaryHover: "#a50d25", onPrimary: "#ffffff", emoji: "🏀" },
  // MLB
  { id: "yankees", name: "Yankees", sport: "MLB", primary: "#003087", primaryHover: "#002368", onPrimary: "#ffffff", emoji: "⚾" },
  { id: "red-sox", name: "Red Sox", sport: "MLB", primary: "#BD3039", primaryHover: "#9a252e", onPrimary: "#ffffff", emoji: "⚾" },
  { id: "dodgers", name: "Dodgers", sport: "MLB", primary: "#005A9C", primaryHover: "#004478", onPrimary: "#ffffff", emoji: "⚾" },
  { id: "cubs", name: "Cubs", sport: "MLB", primary: "#0E3386", primaryHover: "#0a266a", onPrimary: "#ffffff", emoji: "🐻" },
  { id: "cardinals", name: "Cardinals", sport: "MLB", primary: "#C41E3A", primaryHover: "#a0182f", onPrimary: "#ffffff", emoji: "🐦" },
  { id: "astros", name: "Astros", sport: "MLB", primary: "#002D62", primaryHover: "#001f47", onPrimary: "#ffffff", emoji: "🚀" },
  { id: "braves", name: "Braves", sport: "MLB", primary: "#CE1141", primaryHover: "#a80e34", onPrimary: "#ffffff", emoji: "⚾" },
  { id: "giants-mlb", name: "Giants", sport: "MLB", primary: "#FD5A1E", primaryHover: "#e04a10", onPrimary: "#000000", emoji: "⚾" },
  // NHL
  { id: "blackhawks", name: "Blackhawks", sport: "NHL", primary: "#CF0A2C", primaryHover: "#aa0824", onPrimary: "#ffffff", emoji: "🏒" },
  { id: "bruins", name: "Bruins", sport: "NHL", primary: "#FFB81C", primaryHover: "#e5a410", onPrimary: "#000000", emoji: "🐻" },
  { id: "rangers", name: "Rangers", sport: "NHL", primary: "#0038A8", primaryHover: "#002b85", onPrimary: "#ffffff", emoji: "🏒" },
  { id: "penguins", name: "Penguins", sport: "NHL", primary: "#FCB514", primaryHover: "#e5a310", onPrimary: "#000000", emoji: "🐧" },
  { id: "capitals", name: "Capitals", sport: "NHL", primary: "#C8102E", primaryHover: "#a50d25", onPrimary: "#ffffff", emoji: "🏒" },
  { id: "lightning", name: "Lightning", sport: "NHL", primary: "#002868", primaryHover: "#001c50", onPrimary: "#ffffff", emoji: "⚡" },
  { id: "golden-knights", name: "Golden Knights", sport: "NHL", primary: "#B4975A", primaryHover: "#9a7e48", onPrimary: "#000000", emoji: "⚔️" },
  { id: "maple-leafs", name: "Maple Leafs", sport: "NHL", primary: "#00205B", primaryHover: "#001644", onPrimary: "#ffffff", emoji: "🍁" },
  // MLS
  { id: "lafc", name: "LAFC", sport: "MLS", primary: "#C39E6E", primaryHover: "#a8845a", onPrimary: "#000000", emoji: "⚽" },
  { id: "atlanta-united", name: "Atlanta United", sport: "MLS", primary: "#80000A", primaryHover: "#5e0007", onPrimary: "#ffffff", emoji: "⚽" },
  { id: "inter-miami", name: "Inter Miami", sport: "MLS", primary: "#F7B5CD", primaryHover: "#e59db8", onPrimary: "#000000", emoji: "🦩" },
  { id: "sounders", name: "Sounders", sport: "MLS", primary: "#5D9732", primaryHover: "#4a7928", onPrimary: "#ffffff", emoji: "⚽" },
];

export const TEAMS_BY_SPORT = TEAM_THEMES.reduce<Record<string, TeamTheme[]>>((acc, team) => {
  if (!acc[team.sport]) acc[team.sport] = [];
  acc[team.sport].push(team);
  return acc;
}, {});
