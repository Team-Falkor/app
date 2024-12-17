import { AchievementWatcher } from "./watcher";

class AchievementItem {
  game_name: string;
  achievement_files: string[] = [];
  watcher: AchievementWatcher | null = null;

  constructor(game_name: string) {
    this.game_name = game_name;
  }
}

export { AchievementItem };
