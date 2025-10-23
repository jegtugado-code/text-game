import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  ChapterModel,
  EffectModel,
  ItemModel,
  PlayerModel,
  QuestModel,
  SceneModel,
} from '@text-game/shared';

import chapterData from '../data/chapters.json';
import itemData from '../data/items.json';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

enum FixedSceneKeys {
  Start = 'start',
  Death = 'death',
  EnterName = 'enter_name',
}

const defaultNarrative = {
  chapter: 'default',
  quest: 'default',
  scene: FixedSceneKeys.Start,
};

export interface INarrativeSystem {
  loadChapter(chapterId: string): void;
  loadQuest(player: PlayerModel): Promise<void>;
  getCurrentScene(player: PlayerModel): SceneModel | null;
  choiceMade(player: PlayerModel, choiceId: string): void;
  inputMade(player: PlayerModel, input: string): void;
  checkForEndingScene(player: PlayerModel): Promise<boolean>;
}

export default class NarrativeSystem implements INarrativeSystem {
  private readonly chapters: Record<string, ChapterModel> = {};
  private readonly items: ItemModel[] = [];
  private chapter: ChapterModel | null = null;
  private quest: QuestModel | null = null;

  constructor() {
    this.chapters = chapterData as Record<string, ChapterModel>;
    this.items = itemData as ItemModel[];
  }

  public loadChapter(chapterId: string) {
    this.chapter = this.chapters[chapterId];
  }

  public async loadQuest(player: PlayerModel) {
    if (
      !this.chapter ||
      player.currentChapter !== this.chapter.id ||
      this.chapter.quests.findIndex(q => q === player.currentQuest) === -1
    ) {
      return;
    }
    const filePath = path.resolve(
      __dirname,
      `../data/quests/${player.currentQuest}.json`
    );
    const json = await this.loadJsonFile(filePath);
    this.quest = JSON.parse(json) as QuestModel;
  }

  public getCurrentScene(player: PlayerModel) {
    if (
      !this.quest ||
      player.currentQuest !== this.quest.id ||
      this.quest.scenes[player.currentScene] === undefined
    ) {
      return null;
    }
    return !!this.quest.scenes[player.currentScene]
      ? { ...this.quest.scenes[player.currentScene] }
      : null;
  }

  public choiceMade(player: PlayerModel, choiceId: string) {
    const currentScene = this.getCurrentScene(player);
    if (!currentScene) {
      throw new Error('Current scene not found.');
    }
    const choice = currentScene.choices.find(c => c.id === choiceId);
    if (!choice) {
      throw new Error('Choice not found.');
    }

    // Apply choice effects
    choice.effects?.forEach(effect => this.applyEffect(player, effect));

    const scene = this.getScene(choice.nextScene);

    if (scene) {
      this.applyScene(player, scene);
    }

    player.choicesMade.push(choiceId);
  }

  public inputMade(player: PlayerModel, input: string) {
    const currentScene = this.getCurrentScene(player);
    if (!currentScene) {
      throw new Error('Current scene not found.');
    }
    if (!currentScene.inputPrompt) {
      throw new Error('No input prompt in the current scene.');
    }
    const value = input.trim();
    if (!value) {
      throw new Error('Invalid input.');
    }
    if (player.currentScene === String(FixedSceneKeys.EnterName)) {
      player.name = value;
    }
    if (!currentScene.inputNextScene) {
      return;
    }
    const scene = this.getScene(currentScene.inputNextScene);

    if (scene) {
      this.applyScene(player, scene);
    }

    player.choicesMade.push('input');
  }

  public async checkForEndingScene(player: PlayerModel) {
    const currentScene = this.getCurrentScene(player);
    if (currentScene?.isEnding) {
      console.log('Current scene is ending.');
      player.currentChapter = defaultNarrative.chapter;
      player.currentQuest = defaultNarrative.quest;
      player.currentScene = defaultNarrative.scene;
      player.choicesMade = [];
      player.visitedScenes = [];

      this.loadChapter(player.currentChapter);
      await this.loadQuest(player);

      return true;
    }
    return false;
  }

  private getScene(sceneId: string) {
    return !!this.quest?.scenes[sceneId]
      ? { ...this.quest?.scenes[sceneId] }
      : null;
  }

  private applyScene(player: PlayerModel, scene: SceneModel) {
    // filter choices based on conditions
    scene.choices = scene.choices.filter(c => {
      if (!c.conditions) return true;
      return c.conditions.every(con => {
        switch (con.type) {
          case 'hasItem':
            return player.inventory.some(item => item.id === con.value);
          case 'noItem':
            return (
              player.inventory.findIndex(item => item.id === con.value) === -1
            );
          case 'choiceMade':
            return player.choicesMade.includes(con.value);
          case 'noChoiceMade':
            return !player.choicesMade.includes(con.value);
          default:
            return false;
        }
      });
    });

    // apply scene effects
    scene.effects?.forEach(effect => this.applyEffect(player, effect));

    if (
      player.visitedScenes[player.visitedScenes.length - 1] !==
      player.currentScene
    ) {
      player.visitedScenes.push(player.currentScene);
    }
    player.currentScene = scene.id;
  }

  private applyEffect(player: PlayerModel, effect: EffectModel) {
    if (effect.type === 'addItem') {
      const item = this.items.find(i => i.id === effect.itemId);
      if (!item) return;
      player.inventory.push(item);
    } else if (effect.type === 'removeItem') {
      const index = player.inventory.findIndex(i => i.id === effect.itemId);
      if (index !== -1) {
        player.inventory.splice(index, 1);
      }
    } else if (effect.type === 'modifyStat') {
      player.stats[effect.stat] = player.stats[effect.stat] + effect.amount;
    }
  }

  private async loadJsonFile(path: string) {
    const data = await readFile(path, 'utf8');
    return data;
  }
}
