import { Player as DbPlayer } from '@prisma/client';
import { ItemModel, PlayerModel, Stats } from '@text-game/shared';

export function dbPlayerToModel(dbPlayer: DbPlayer): PlayerModel {
  return {
    name: dbPlayer.name ?? undefined,
    level: dbPlayer.level,
    xp: dbPlayer.xp,
    currentChapter: dbPlayer.currentChapter ?? undefined,
    currentScene: dbPlayer.currentScene ?? undefined,
    visitedScenes: dbPlayer.visitedScenes as string[],
    choicesMade: dbPlayer.choicesMade as string[],
    inventory: dbPlayer.inventory as unknown as ItemModel[],
    stats: dbPlayer.stats as Stats,
  };
}
