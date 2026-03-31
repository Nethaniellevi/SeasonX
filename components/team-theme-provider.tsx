"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type TeamTheme } from "@/lib/team-themes";
import { TeamPickerModal } from "./team-picker-modal";

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

interface TeamThemeContextValue {
  openTeamPicker: () => void;
  currentTeam: TeamTheme | null;
}

export const TeamThemeContext = createContext<TeamThemeContextValue>({
  openTeamPicker: () => {},
  currentTeam: null,
});

export function useTeamTheme() {
  return useContext(TeamThemeContext);
}

export function TeamThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTeam, setCurrentTeam] = useState<TeamTheme | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("seasonx_team");
    const skipped = localStorage.getItem("seasonx_team_skipped");

    if (saved) {
      try {
        const team = JSON.parse(saved) as TeamTheme;
        setCurrentTeam(team);
      } catch {
        // ignore malformed data
      }
    } else if (!skipped) {
      // Show modal after a brief delay so the page renders first
      const t = setTimeout(() => setShowModal(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  // Sync CSS variables whenever currentTeam changes
  useEffect(() => {
    if (currentTeam) {
      applyTeam(currentTeam);
    }
  }, [currentTeam]);

  function openTeamPicker() {
    setShowModal(true);
  }

  function handleClose() {
    setShowModal(false);
    // Re-read from localStorage in case they selected a team
    const saved = localStorage.getItem("seasonx_team");
    if (saved) {
      try {
        const team = JSON.parse(saved) as TeamTheme;
        setCurrentTeam(team); // triggers the useEffect to applyTeam
      } catch {
        // ignore
      }
    }
  }

  return (
    <TeamThemeContext.Provider value={{ openTeamPicker, currentTeam }}>
      {children}
      {mounted && showModal && <TeamPickerModal onClose={handleClose} />}
    </TeamThemeContext.Provider>
  );
}
