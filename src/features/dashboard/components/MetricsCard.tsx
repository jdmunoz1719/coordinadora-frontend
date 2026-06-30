import { Card } from "@shared/components/Card";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { memo } from "react";

interface MetricsCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  color?: "red" | "orange" | "green" | "blue";
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const COLOR = {
  red: {
    chip: "bg-red-50 text-red-600",
    bar: "bg-red-500",
    val: "text-red-600",
  },
  orange: {
    chip: "bg-amber-50 text-amber-600",
    bar: "bg-amber-500",
    val: "text-amber-600",
  },
  green: {
    chip: "bg-emerald-50 text-emerald-600",
    bar: "bg-emerald-500",
    val: "text-emerald-600",
  },
  blue: {
    chip: "bg-blue-50 text-blue-600",
    bar: "bg-blue-500",
    val: "text-blue-600",
  },
} as const;

export const MetricsCard = memo(function MetricsCard({
  label,
  value,
  icon,
  color = "blue",
  trend,
  trendValue,
}: MetricsCardProps) {
  const c = COLOR[color];
  return (
    <Card
      variant="elevated"
      padding="none"
      hoverable
      className="overflow-hidden animate-slide-up"
    >
      <div className="flex">
        <div className={`w-1.5 shrink-0 rounded-l-2xl ${c.bar}`} />
        <div className="flex flex-1 items-start justify-between p-5">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {label}
            </p>
            <p
              className={`mt-1.5 text-4xl font-extrabold tracking-tight ${c.val}`}
            >
              {value}
            </p>
            {trendValue && (
              <div className="mt-1.5 flex items-center gap-1">
                {trend === "up" ? (
                  <TrendingUp size={14} className="text-red-500" />
                ) : trend === "down" ? (
                  <TrendingDown size={14} className="text-emerald-500" />
                ) : (
                  <Minus size={14} className="text-slate-400" />
                )}
                <span className="text-xs font-semibold text-slate-500">
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${c.chip}`}
          >
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
});
