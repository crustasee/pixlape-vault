import React from "react";

export type BadgeVariant = "free" | "paid" | "premium";

export type CategoryBadgeVariant =
  | "APPS"
  | "TOOLS"
  | "BRUSH"
  | "TEMPLATE"
  | "ICON"
  | "ART FOR SELL"
  | "ARTWORK"
  | "FONT"
  | "OTHERS"
  | "app"
  | "tools"
  | "brush"
  | "template"
  | "icon"
  | "artwork"
  | "font"
  | "art for sell"
  | "others";

interface BadgeProps {
  label?: string;
  variant?: BadgeVariant;
  category?: CategoryBadgeVariant | string;
}

interface CategoryBadgeProps {
  category: CategoryBadgeVariant | string;
  label?: string;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  free: "bg-green-200 text-xs text-black-secondary border-black rounded-xl",
  paid: "bg-pink-300 text-xs text-text-primary border-border rounded-xl",
  premium: "bg-yellow-300 text-xs text-black-secondary border-border rounded-xl",
};

const categoryStyles: Record<string, string> = {
  apps: "bg-blue-100 text-blue-900 border-blue-400",
  app: "bg-blue-100 text-blue-900 border-blue-400",
  tools: "bg-purple-100 text-purple-900 border-purple-400",
  brush: "bg-amber-100 text-amber-900 border-amber-400",
  template: "bg-emerald-100 text-emerald-900 border-emerald-400",
  icon: "bg-pink-100 text-pink-900 border-pink-400",
  artwork: "bg-indigo-100 text-indigo-900 border-indigo-400",
  "art for sell": "bg-indigo-100 text-indigo-900 border-indigo-400",
  font: "bg-teal-100 text-teal-900 border-teal-400",
  others: "bg-border text-black-secondary border-black-primary",
};

/** Category Badge Component */
export function CategoryBadge({ category, label, className = "" }: CategoryBadgeProps) {
  const normalizedKey = category.toLowerCase().trim();
  const style = categoryStyles[normalizedKey] || "bg-surface text-black-secondary border-black-primary";
  const displayLabel = label || category.toUpperCase();

  return (
    <span
      className={`
        inline-flex items-center justify-center
        px-2 h-5.5 rounded-lg border
        text-[10px] font-black uppercase tracking-wide
        ${style}
        ${className}
      `}
    >
      {displayLabel}
    </span>
  );
}

/** Standard Tier/Variant Badge Component (Supports category prop as well) */
export default function Badge({ label, variant = "free", category }: BadgeProps) {
  if (category) {
    return <CategoryBadge category={category} label={label} />;
  }

  const displayLabel = label || variant.toUpperCase();
  return (
    <span
      className={`
        inline-flex items-center justify-center
        px-2 h-6 rounded-lg border
        text-[10px] font-black uppercase tracking-wide
        ${variantStyles[variant]}
      `}
    >
      {displayLabel}
    </span>
  );
}
