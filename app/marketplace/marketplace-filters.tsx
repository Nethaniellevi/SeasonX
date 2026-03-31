"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { SPORTS_LABELS } from "@/lib/utils";
import { SlidersHorizontal, X } from "lucide-react";

const SPORTS_WITH_EMOJI: Array<{ value: string; label: string; emoji: string }> = [
  { value: "ALL", label: "All", emoji: "🎟️" },
  { value: "NFL", label: "NFL", emoji: "🏈" },
  { value: "NBA", label: "NBA", emoji: "🏀" },
  { value: "MLB", label: "MLB", emoji: "⚾" },
  { value: "NHL", label: "NHL", emoji: "🏒" },
  { value: "MLS", label: "MLS", emoji: "⚽" },
  { value: "COLLEGE_FOOTBALL", label: "College Football", emoji: "🎓" },
  { value: "COLLEGE_BASKETBALL", label: "College Basketball", emoji: "🏀" },
  { value: "OTHER", label: "Other", emoji: "🏟️" },
];

export function MarketplaceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const currentSport = searchParams.get("sport") ?? "ALL";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "ALL") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/marketplace?${params.toString()}`);
    },
    [router, searchParams]
  );

  function clearFilters() {
    router.push("/marketplace");
    setShowFilters(false);
  }

  const hasActiveFilters = !!(
    searchParams.get("team") ||
    searchParams.get("minPrice") ||
    searchParams.get("maxPrice") ||
    searchParams.get("dateFrom") ||
    searchParams.get("dateTo")
  );

  const inputClass =
    "w-full bg-white border border-[#DDDDDD] rounded-xl px-3 py-2.5 text-sm text-[#222222] placeholder-[#BBBBBB] outline-none focus:border-[#222222] transition-colors";

  return (
    <div className="space-y-4">
      {/* Horizontal scrolling sport category pills — Airbnb style */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
        {SPORTS_WITH_EMOJI.map(({ value, label, emoji }) => {
          const isActive = currentSport === value || (value === "ALL" && currentSport === "ALL");
          return (
            <button
              key={value}
              onClick={() => updateParam("sport", value)}
              className={`flex flex-col items-center gap-1.5 flex-shrink-0 px-4 py-3 rounded-xl border transition-all ${
                isActive
                  ? "border-[#222222] text-[#222222]"
                  : "border-transparent text-[#717171] hover:border-[#DDDDDD] hover:text-[#222222]"
              }`}
            >
              <span className="text-xl">{emoji}</span>
              <span className="text-xs font-semibold whitespace-nowrap">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold transition-all ${
            showFilters || hasActiveFilters
              ? "border-[#222222] bg-[#222222] text-white"
              : "border-[#DDDDDD] text-[#222222] hover:border-[#222222] bg-white"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-white text-[#222222] rounded-full w-4 h-4 text-[10px] font-bold flex items-center justify-center">
              •
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-[#717171] hover:text-[#222222] transition-colors underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Inline filter panel */}
      {showFilters && (
        <div className="rounded-2xl border border-[#DDDDDD] bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-1">
            <p className="font-semibold text-sm text-[#222222]">Filters</p>
            <button onClick={() => setShowFilters(false)}>
              <X className="h-4 w-4 text-[#717171] hover:text-[#222222] transition-colors" />
            </button>
          </div>

          {/* Team */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[#717171] uppercase tracking-wider">Team</p>
            <input
              type="text"
              placeholder="Search team..."
              className={inputClass}
              defaultValue={searchParams.get("team") ?? ""}
              onBlur={(e) => updateParam("team", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateParam("team", (e.target as HTMLInputElement).value);
              }}
            />
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[#717171] uppercase tracking-wider">Price per ticket</p>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Min $"
                className={inputClass}
                defaultValue={searchParams.get("minPrice") ?? ""}
                onBlur={(e) => updateParam("minPrice", e.target.value)}
              />
              <input
                type="number"
                placeholder="Max $"
                className={inputClass}
                defaultValue={searchParams.get("maxPrice") ?? ""}
                onBlur={(e) => updateParam("maxPrice", e.target.value)}
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[#717171] uppercase tracking-wider">Date range</p>
            <input
              type="date"
              className={inputClass}
              defaultValue={searchParams.get("dateFrom") ?? ""}
              onChange={(e) => updateParam("dateFrom", e.target.value)}
            />
            <input
              type="date"
              className={inputClass}
              defaultValue={searchParams.get("dateTo") ?? ""}
              onChange={(e) => updateParam("dateTo", e.target.value)}
            />
          </div>

          <button
            onClick={clearFilters}
            className="text-sm font-semibold text-[#222222] underline hover:no-underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
