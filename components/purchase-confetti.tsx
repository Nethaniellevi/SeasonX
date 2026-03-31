"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export function PurchaseConfetti() {
  useEffect(() => {
    // Read team color from localStorage for team-colored confetti
    let colors = ["#09B43A", "#ffffff", "#222222"];
    try {
      const saved = localStorage.getItem("seasonx_team");
      if (saved) {
        const team = JSON.parse(saved);
        if (team?.primary && team?.onPrimary) {
          colors = [team.primary, team.onPrimary, "#ffffff"];
        }
      }
    } catch {
      // fall back to defaults
    }

    // First burst — center
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors,
      scalar: 1.1,
    });

    // Left cannon
    const leftTimer = setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
      });
    }, 200);

    // Right cannon
    const rightTimer = setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
      });
    }, 400);

    return () => {
      clearTimeout(leftTimer);
      clearTimeout(rightTimer);
    };
  }, []);

  return null;
}
