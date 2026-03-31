"use client";

import { useState } from "react";
import { TEAM_THEMES, TEAMS_BY_SPORT, type TeamTheme } from "@/lib/team-themes";

const SPORTS = ["NFL", "NBA", "MLB", "NHL", "MLS"] as const;

function applyTeam(team: TeamTheme) {
  const root = document.documentElement;
  root.style.setProperty("--team-primary", team.primary);
  root.style.setProperty("--team-primary-hover", team.primaryHover);
  const hex = team.primary.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  root.style.setProperty("--team-primary-subtle", `rgba(${r}, ${g}, ${b}, 0.1)`);
  root.style.setProperty("--team-primary-border", `rgba(${r}, ${g}, ${b}, 0.2)`);
  root.style.setProperty("--team-on-primary", team.onPrimary);
  root.style.setProperty("--team-name", team.name);
}

interface Props {
  onClose: () => void;
}

export function TeamPickerModal({ onClose }: Props) {
  const [activeSport, setActiveSport] = useState<string>("NFL");
  const [selectedTeam, setSelectedTeam] = useState<TeamTheme | null>(null);

  const teams = TEAMS_BY_SPORT[activeSport] ?? [];

  function handleSelectTeam(team: TeamTheme) {
    setSelectedTeam(team);
    applyTeam(team);
    localStorage.setItem("seasonx_team", JSON.stringify(team));
    setTimeout(() => {
      onClose();
    }, 300);
  }

  function handleSkip() {
    localStorage.setItem("seasonx_team_skipped", "true");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleSkip(); }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="text-5xl mb-4">🏟️</div>
          <h2 className="text-2xl font-semibold text-[#222222] mb-2">Pick your team</h2>
          <p className="text-[#717171] text-sm">
            We&apos;ll personalize SeasonX with your team&apos;s colors
          </p>
        </div>

        {/* Sport tabs */}
        <div className="flex gap-2 px-8 pb-4 overflow-x-auto scrollbar-hide">
          {SPORTS.map((sport) => (
            <button
              key={sport}
              onClick={() => setActiveSport(sport)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={
                activeSport === sport
                  ? { backgroundColor: "#222222", color: "#ffffff" }
                  : { backgroundColor: "#F7F7F7", color: "#717171" }
              }
            >
              {sport}
            </button>
          ))}
        </div>

        {/* Team grid */}
        <div className="px-8 pb-4 max-h-72 overflow-y-auto">
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {teams.map((team) => {
              const isSelected = selectedTeam?.id === team.id;
              return (
                <button
                  key={team.id}
                  onClick={() => handleSelectTeam(team)}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all hover:scale-105 hover:shadow-md"
                  style={{
                    borderColor: isSelected ? team.primary : "transparent",
                    backgroundColor: isSelected ? `${team.primary}10` : "#F7F7F7",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      backgroundColor: team.primary,
                      color: team.onPrimary,
                    }}
                  >
                    {team.name.charAt(0)}
                  </div>
                  <span className="text-[10px] font-semibold text-[#222222] text-center leading-tight">
                    {team.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 text-center border-t border-[#DDDDDD]">
          <button
            onClick={handleSkip}
            className="text-sm text-[#717171] hover:text-[#222222] transition-colors underline"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
