"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

const SPORTS = [
  { label: "Any sport", value: "" },
  { label: "NFL", value: "NFL" },
  { label: "NBA", value: "NBA" },
  { label: "MLB", value: "MLB" },
  { label: "NHL", value: "NHL" },
  { label: "MLS", value: "MLS" },
  { label: "College Football", value: "COLLEGE_FOOTBALL" },
];

export function HeroSearch() {
  const router = useRouter();
  const [sport, setSport] = useState("");
  const [team, setTeam] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (sport) params.set("sport", sport);
    if (team.trim()) params.set("team", team.trim());
    router.push(`/marketplace${params.toString() ? `?${params}` : ""}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className="flex items-center bg-white rounded-full border border-[#DDDDDD] shadow-md hover:shadow-lg transition-shadow max-w-2xl mx-auto mb-12 overflow-hidden">
      <div className="flex-1 flex items-center min-w-0">
        {/* Sport */}
        <div className="flex-1 px-6 py-4 text-left">
          <p className="text-xs font-semibold text-[#222222] mb-0.5">Sport</p>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="text-sm text-[#717171] bg-transparent outline-none cursor-pointer w-full"
          >
            {SPORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="w-px h-10 bg-[#DDDDDD] flex-shrink-0" />

        {/* Team */}
        <div className="flex-1 px-6 py-4 text-left">
          <p className="text-xs font-semibold text-[#222222] mb-0.5">Team</p>
          <input
            type="text"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search teams..."
            className="text-sm text-[#717171] bg-transparent outline-none w-full placeholder-[#BBBBBB]"
          />
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="bg-team-primary hover:bg-team-primary-hover text-white font-semibold text-sm rounded-full px-6 py-4 flex-shrink-0 mx-2 transition-colors flex items-center gap-2"
      >
        <Search className="h-4 w-4" />
        Search
      </button>
    </div>
  );
}
