export * from "./launcher";
export * from "./logs";
export * from "./themes";
export * from "./types";

export type ProtonDBTier =
  | "borked"
  | "platinum"
  | "gold"
  | "silver"
  | "bronze"
  | "pending";

export enum ProtonDBTierColor {
  borked = "#ff0000", // Red
  platinum = "#e5e4e2", // Platinum
  gold = "#ffd700", // Gold
  silver = "#c0c0c0", // Silver
  bronze = "#cd7f32", // Bronze
  pending = "#808080", // Gray
}

export interface ProtonDBSummary {
  bestReportedTier: ProtonDBTier;
  confidence: string;
  score: number;
  tier: ProtonDBTier;
  total: number;
  trendingTier: ProtonDBTier;
}
