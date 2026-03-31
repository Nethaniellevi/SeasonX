import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function VerifiedBadge({ size = "md", showText = true, className }: VerifiedBadgeProps) {
  const sizes = {
    sm: { icon: "h-3 w-3", text: "text-xs", gap: "gap-1", px: "px-2 py-0.5" },
    md: { icon: "h-4 w-4", text: "text-xs", gap: "gap-1.5", px: "px-2.5 py-1" },
    lg: { icon: "h-5 w-5", text: "text-sm", gap: "gap-2", px: "px-3 py-1.5" },
  };
  const s = sizes[size];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-blue-600 font-semibold text-white",
        s.gap, s.px, s.text,
        className
      )}
    >
      <ShieldCheck className={s.icon} />
      {showText && "Verified STH"}
    </span>
  );
}
