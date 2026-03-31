"use client";

import { useTeamTheme } from "./team-theme-provider";

export function NavbarTeamButton() {
  const { openTeamPicker, currentTeam } = useTeamTheme();

  return (
    <button
      onClick={openTeamPicker}
      className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#222222] hover:bg-[#F7F7F7] px-3 py-2 rounded-full transition-colors"
      title={currentTeam ? `Your team: ${currentTeam.name}` : "Pick your team"}
    >
      <span
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: currentTeam ? currentTeam.primary : "#DDDDDD" }}
      />
      <span>{currentTeam ? currentTeam.name : "My team"}</span>
    </button>
  );
}
