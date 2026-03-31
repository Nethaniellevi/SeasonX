"use client";

import { useTeamTheme } from "./team-theme-provider";

export function HeroGradient() {
  const { currentTeam } = useTeamTheme();

  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse 140% 80% at 50% -10%, var(--team-primary-subtle) 0%, transparent 65%)",
        opacity: currentTeam ? 1 : 0,
        transition: "opacity 900ms ease",
      }}
    />
  );
}
