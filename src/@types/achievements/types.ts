import { Cracker } from "../types";

export interface UnlockedAchievement {
  name: string;
  unlockTime: number;
}

export interface AchievementFile {
  cracker: Cracker;
  path: string;
}

export interface AchivementStat {
  displayName: string;
  hidden: number;
  description?: string;
  icon: string;
}
