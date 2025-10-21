import { Player, PrismaClient, Prisma } from '@prisma/client';
import { PlayerJSON } from '@text-game/shared';

export interface IPlayerService {
  loadOrCreatePlayerForUser(userId: string): Promise<Player>;
  savePlayerState(userId: string, statePatch: PlayerJSON): Promise<Player>;
}

export default class PlayerService implements IPlayerService {
  private readonly prisma: PrismaClient;

  constructor({ prisma }: { prisma: PrismaClient }) {
    this.prisma = prisma;
  }

  async loadOrCreatePlayerForUser(userId: string) {
    const existing = await this.prisma.player.findUnique({
      where: { userId },
      include: {
        /* optionally include achievements */
      },
    });

    if (existing) return existing;

    // create default initial player
    const created = await this.prisma.player.create({
      data: {
        user: { connect: { id: userId } },
        name: null,
        currentChapter: 'intro',
        currentScene: 'start',
        visitedScenes: [],
        choicesMade: [],
        inventory: [],
        stats: {
          health: 100,
          strength: 5,
          intelligence: 5,
          dexterity: 5,
          agility: 5,
        },
        level: 1,
        xp: 0,
      },
    });

    return created;
  }

  async savePlayerState(userId: string, statePatch: PlayerJSON) {
    // Upsert or update directly. Here we update by userId.
    return this.prisma.player.upsert({
      where: { userId },
      update: {
        currentChapter: String(statePatch.currentChapter),
        currentScene: statePatch.currentScene ?? '',
        visitedScenes: statePatch.visitedScenes ?? [],
        choicesMade: statePatch.choicesMade ?? [],
        inventory: (statePatch.inventory ??
          []) as unknown as Prisma.InputJsonArray,
        stats: statePatch.stats ?? {},
        level: statePatch.level ?? 1,
        xp: statePatch.xp ?? 0,
        name: statePatch.name ?? null,
      },
      create: {
        user: { connect: { id: userId } },
        currentChapter: String(statePatch.currentChapter),
        currentScene: statePatch.currentScene ?? '',
        visitedScenes: statePatch.visitedScenes ?? [],
        choicesMade: statePatch.choicesMade ?? [],
        inventory: (statePatch.inventory ??
          []) as unknown as Prisma.InputJsonArray,
        stats: statePatch.stats ?? {},
        level: statePatch.level ?? 1,
        xp: statePatch.xp ?? 0,
        name: statePatch.name ?? null,
      },
    });
  }
}
