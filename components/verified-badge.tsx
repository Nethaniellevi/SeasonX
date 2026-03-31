import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function VerifiedBadge({ size = "md", showText = true, className }: VerifiedBadgeProps) {
  const sizes = {
    sm: { icon: "h-3 w-3", text: "text-[10px]", gap: "gap-1", px: "px-2 py-0.5" },
    md: { icon: "h-3.5 w-3.5", text: "text-xs", gap: "gap-1", px: "px-2.5 py-1" },
    lg: { icon: "h-4 w-4", text: "text-xs", gap: "gap-1.5", px: "px-3 py-1.5" },
  };
  const s = sizes[size];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        s.gap, s.px, s.text, className
      )}
      style={{
        backgroundColor: "var(--team-primary-subtle)",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "var(--team-primary-border)",
        color: "var(--team-primary)",
      }}
    >
      <ShieldCheck className={s.icon} />
      {showText && "Verified"}
    </span>
  );
}
