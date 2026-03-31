"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { SPORTS_LABELS } from "@/lib/utils";

export function MarketplaceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
  }

  return (
    <Card className="sticky top-20">
      <CardContent className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Filters</h3>
          <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">
            Clear all
          </button>
        </div>

        {/* Sport */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">Sport</Label>
          <Select
            value={searchParams.get("sport") ?? "ALL"}
            onValueChange={(v) => updateParam("sport", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Sports" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Sports</SelectItem>
              {Object.entries(SPORTS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Team search */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">Team</Label>
          <Input
            placeholder="Search team..."
            defaultValue={searchParams.get("team") ?? ""}
            onBlur={(e) => updateParam("team", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateParam("team", (e.target as HTMLInputElement).value);
              }
            }}
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">Price per Ticket</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              className="w-1/2"
              defaultValue={searchParams.get("minPrice") ?? ""}
              onBlur={(e) => updateParam("minPrice", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max"
              className="w-1/2"
              defaultValue={searchParams.get("maxPrice") ?? ""}
              onBlur={(e) => updateParam("maxPrice", e.target.value)}
            />
          </div>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">Event Date</Label>
          <Input
            type="date"
            defaultValue={searchParams.get("dateFrom") ?? ""}
            onChange={(e) => updateParam("dateFrom", e.target.value)}
          />
          <Input
            type="date"
            defaultValue={searchParams.get("dateTo") ?? ""}
            onChange={(e) => updateParam("dateTo", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
