import { Player as DbPlayer } from '@prisma/client';
import { ItemJSON, PlayerJSON, Stats } from '@text-game/shared';

export function dbPlayerToJSON(dbPlayer: DbPlayer): PlayerJSON {
  return {
    name: dbPlayer.name ?? undefined,
    level: dbPlayer.level,
    xp: dbPlayer.xp,
    currentChapter: dbPlayer.currentChapter ?? undefined,
    currentScene: dbPlayer.currentScene ?? undefined,
    visitedScenes: dbPlayer.visitedScenes as string[],
    choicesMade: dbPlayer.choicesMade as string[],
    inventory: dbPlayer.inventory as unknown as ItemJSON[],
    stats: dbPlayer.stats as Stats,
  };
}
