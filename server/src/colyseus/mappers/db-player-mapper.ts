import { Player as DbPlayer } from '@prisma/client';
import { ItemModel, PlayerModel, Stats } from '@text-game/shared';

export function dbPlayerToModel(dbPlayer: DbPlayer): PlayerModel {
  return {
    name: dbPlayer.name ?? undefined,
    level: dbPlayer.level,
    xp: dbPlayer.xp,
    currentChapter: dbPlayer.currentChapter,
    currentQuest: dbPlayer.currentQuest,
    currentScene: dbPlayer.currentScene,
    visitedScenes: dbPlayer.visitedScenes as string[],
    choicesMade: dbPlayer.choicesMade as string[],
    inventory: dbPlayer.inventory as unknown as ItemModel[],
    stats: dbPlayer.stats as Stats,
  };
}
