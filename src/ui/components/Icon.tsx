// Inline stand-ins for the icon set (EXPERIENCE → Content Assets → Icons:
// 24 × 24 grid, single colour, `currentColor`, `aria-hidden`) until
// `assets/icons/*.svg` exists. The control that holds an icon carries the name.
import type { TransportMode } from "../../rules/types";

const PATHS = {
  plane: "M2 13l8-2 4-8h2l-2 8 6 1 2-2h2l-1 4 1 4h-2l-2-2-6 1 2 8h-2l-4-8-8-2z",
  train:
    "M7 3h10a3 3 0 013 3v9a3 3 0 01-3 3H7a3 3 0 01-3-3V6a3 3 0 013-3zm0 3v5h10V6zM8 14a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2zM7 18l-2 3m12-3l2 3",
  bus: "M6 3h12a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zm0 3v5h12V6zM8 14a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2zM7 18v3m10-3v3",
  block: "M12 3a9 9 0 110 18 9 9 0 010-18zM5.6 5.6l12.8 12.8",
  warning: "M12 3l10 18H2zM12 10v5m0 3v.5",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v5m8-5v5",
  coin: "M12 3a9 9 0 110 18 9 9 0 010-18zM9 9h5a2 2 0 010 4h-4a2 2 0 000 4h5M12 6v2m0 9v1",
  close: "M6 6l12 12M18 6L6 18",
} as const;

export type IconName = keyof typeof PATHS | TransportMode;

export function Icon({
  name,
  size = 20,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const filled = name === "plane";
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={PATHS[name]}
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
