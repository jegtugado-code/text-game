import {
  EffectModel,
  GameState,
  PlayerModel,
  SceneModel,
  ItemModel,
} from '@text-game/shared';
import {
  modelToPlayerSchema,
  playerSchemaToModel,
} from '@text-game/shared/mappers';
import { Room, Client, ServerError } from 'colyseus';

import sceneData from '../../data/intro-scene-data.json';
import itemData from '../../data/items.json';
import { IPlayerService } from '../../services/player-service';
import type { ITokenService, JwtPayload } from '../../services/token-service';
import { dbPlayerToModel } from '../mappers/db-player-mapper';

interface ChoiceMessage {
  choiceId: string; // id of the choice selected
}

interface InputMessage {
  value: string;
}

const scenes = sceneData as Record<string, SceneModel>;
const items = itemData as ItemModel[];

enum FixedSceneKeys {
  Start = 'start',
  Death = 'death',
  EnterName = 'enter_name',
}

// Passed from the client when joining the room
export interface GameRoomOptions {
  token?: string;
}

export interface GameRoomMetadata {
  userId: string;
  email: string;
}

export class GameRoom extends Room<GameState, GameRoomMetadata> {
  public tokenService!: ITokenService;
  public playerService!: IPlayerService;

  async onAuth(client: Client, options: GameRoomOptions) {
    if (!options.token) {
      throw new ServerError(400, 'Authentication token missing.');
    }

    try {
      // Verify the token using the secret key
      const user = this.tokenService.verifyToken(options.token);

      console.log(
        `Client ${client.sessionId} authenticated with user: ${user.email}`
      );

      // Store user info in room metadata
      await this.setMetadata({
        userId: user.sub,
        email: user.email as string,
      });

      // Return the decoded data, which will be passed to onJoin()
      return user;
    } catch (err) {
      console.error('JWT verification failed:', err);
      throw new ServerError(401, 'Invalid or expired token.');
    }
  }

  onCreate(options: GameRoomOptions) {
    this.maxClients = 1; // Only one client allowed
    this.autoDispose = true; // Destroy when the player leaves
    // Initialize state
    this.state = new GameState();
    console.log('GameRoom created with options:', options);

    // Handle player making a choice
    this.onMessage<ChoiceMessage>('choice', (client: Client, message) => {
      const player = this.state.player;
      if (!player) return;
      const model = playerSchemaToModel(player);
      const currentScene = { ...scenes[model.currentScene] };
      // Basic validation
      const choiceId = message.choiceId;
      if (!choiceId) {
        client.send('error', { message: 'Invalid choice' });
        return;
      }

      // Find the choice by stable id first, fallback to label for
      // backwards-compatibility with older clients that send labels.
      const chosen = currentScene.choices.find(c => c.id === choiceId);

      if (!chosen) {
        client.send('error', { message: 'Invalid choice!' });
        return;
      }

      // Apply any effects based on the chosen choice
      if (chosen.effects) {
        chosen.effects.forEach(effect => applyEffect(model, effect));
      }

      // Evaluate player health (after applying choice effects)
      const playerHealth = model.stats.health;
      if (playerHealth && playerHealth <= 0) {
        const model = playerSchemaToModel(player);
        // send death scene
        const next = prepareSceneForPlayer(
          model,
          FixedSceneKeys.Death,
          chosen.id
        );
        client.send('scene', next);
        void this.playerService.savePlayerState(this.metadata.userId, model);
        return;
      }

      // Advance to the configured next scene
      const targetSceneId = chosen.nextScene;

      const next = prepareSceneForPlayer(model, targetSceneId, chosen.id);
      this.state.player = modelToPlayerSchema(model);
      client.send('scene', next);
      void this.playerService.savePlayerState(this.metadata.userId, model);
    });

    // Handle text input from player for scenes that request input
    this.onMessage<InputMessage>('input', (client: Client, message) => {
      const player = this.state.player;
      if (!player) return;

      const model = playerSchemaToModel(player);
      const currentScene = scenes[model.currentScene];
      if (!currentScene?.inputNextScene) {
        client.send('error', { message: 'No input expected at this time.' });
        return;
      }

      const value =
        typeof message?.value === 'string' ? message.value.trim() : '';
      if (!value) {
        client.send('error', { message: 'Invalid input' });
        return;
      }

      // Example handling: if the current scene is the name input scene, set player name
      // You can expand handling logic based on scene id or effects in the scene.
      if (model.currentScene === String(FixedSceneKeys.EnterName)) {
        model.name = value;
      }

      // Advance to the configured next scene
      const targetSceneId = String(currentScene.inputNextScene);

      const next = prepareSceneForPlayer(model, targetSceneId);
      this.state.player = modelToPlayerSchema(model);
      client.send('scene', next);
      void this.playerService.savePlayerState(this.metadata.userId, model);
    });
  }

  async onJoin(client: Client, _options: GameRoomOptions, user: JwtPayload) {
    console.log(client.sessionId, '-', user.email, 'joined!');

    // Load or create player for this user
    const dbPlayer = await this.playerService.loadOrCreatePlayerForUser(
      user.sub!
    );
    const model = dbPlayerToModel(dbPlayer);

    console.log(`Loaded player for user ${user.email}:`, model.name);

    const next = prepareSceneForPlayer(model, model.currentScene);
    const player = modelToPlayerSchema(model);
    this.state.player = player;
    client.send('scene', next);
  }

  async onLeave(_client: Client, consented: boolean) {
    const userId = this.metadata.userId;

    if (!consented || !userId) {
      return;
    }

    const player = this.state.player;
    const model = playerSchemaToModel(player);
    await this.playerService.savePlayerState(userId, model);
  }

  onDispose() {
    console.log('GameRoom disposed');
  }
}

function applyEffect(model: PlayerModel, effect: EffectModel) {
  if (effect.type === 'addItem') {
    const item = items.find(i => i.id === effect.itemId);
    if (!item) return;
    model.inventory.push(item);
  } else if (effect.type === 'removeItem') {
    const index = model.inventory.findIndex(i => i.id === effect.itemId);
    if (index !== -1) {
      model.inventory.splice(index, 1);
    }
  } else if (effect.type === 'modifyStat') {
    model.stats[effect.stat] = (model.stats[effect.stat] || 0) + effect.amount;
  }
}

/**
 * Return a shallow copy of a scene prepared for a specific player.
 * This prevents mutation of the global `scenes` object and filters
 * choices according to the player's inventory and previous choices.
 */
function prepareSceneForPlayer(
  playerModel: PlayerModel,
  sceneId: string,
  choiceId?: string
) {
  const original = scenes[sceneId];
  if (!original) return undefined;

  // shallow copy of scene (we don't deep-copy text/effects here)
  const copy: SceneModel = {
    ...original,
    choices: (original.choices ?? []).slice(),
    effects: (original.effects ?? []).slice(),
  } as SceneModel;

  // filter choices based on conditions
  copy.choices = copy.choices.filter(c => {
    if (!c.conditions) return true;
    return c.conditions.every(_ => {
      switch (_.type) {
        case 'hasItem':
          return playerModel.inventory.some(item => item.id === _.value);
        case 'noItem':
          return (
            playerModel.inventory.findIndex(item => item.id === _.value) === -1
          );
        case 'choiceMade':
          return playerModel.choicesMade.includes(_.value);
        case 'noChoiceMade':
          return !playerModel.choicesMade.includes(_.value);
        default:
          return false;
      }
    });
  });

  // apply scene effects immediately
  copy.effects?.forEach(effect => applyEffect(playerModel, effect));

  if (choiceId) {
    playerModel.choicesMade.push(choiceId);
  }
  if (
    playerModel.visitedScenes[playerModel.visitedScenes.length - 1] !==
    playerModel.currentScene
  ) {
    playerModel.visitedScenes.push(playerModel.currentScene);
  }
  playerModel.currentScene = sceneId;

  return copy;
}
