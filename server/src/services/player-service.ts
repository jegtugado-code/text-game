import { Player, PrismaClient } from '@prisma/client';
import { Stats } from '@text-game/shared';

export interface IPlayerService {
  loadOrCreatePlayerForUser(userId: string): Promise<Player>;
  savePlayerState(
    userId: string,
    statePatch: {
      name?: string;
      currentChapter: string;
      currentScene?: string;
      visitedScenes?: string[];
      choicesMade?: string[];
      inventory?: any[];
      stats?: Stats;
      level?: number;
      xp?: number;
    }
  ): Promise<Player>;
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

  async savePlayerState(
    userId: string,
    statePatch: {
      name?: string;
      currentChapter: string;
      currentScene?: string;
      visitedScenes?: string[];
      choicesMade?: string[];
      inventory?: any[];
      stats?: Stats;
      level?: number;
      xp?: number;
    }
  ) {
    // Upsert or update directly. Here we update by userId.
    return this.prisma.player.upsert({
      where: { userId },
      update: {
        ...statePatch,
      },
      create: {
        user: { connect: { id: userId } },
        currentChapter: statePatch.currentChapter,
        currentScene: statePatch.currentScene ?? 'start',
        visitedScenes: statePatch.visitedScenes ?? [],
        choicesMade: statePatch.choicesMade ?? [],
        inventory: statePatch.inventory ?? [],
        stats: statePatch.stats ?? {},
        level: statePatch.level ?? 1,
        xp: statePatch.xp ?? 0,
        name: statePatch.name ?? null,
      },
    });
  }
}
