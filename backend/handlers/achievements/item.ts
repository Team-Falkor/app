class AchievementItem {
  game_name: string;
  achievement_files: string[] = [];

  constructor(game_name: string) {
    this.game_name = game_name;
  }
}
