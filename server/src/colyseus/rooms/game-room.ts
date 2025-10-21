import {
  AddItemEffect,
  Effect,
  GameState,
  ModifyStatEffect,
  Player,
  RemoveItemEffect,
  Scene,
  ItemJSON,
  jsonToItem,
  jsonToPlayer,
  playerToJSON,
  jsonToEffect,
} from '@text-game/shared';
import { Room, Client, ServerError } from 'colyseus';

import sceneData from '../../data/intro-scene-data.json';
import itemData from '../../data/items.json';
// import sceneData from '../../data/test-scene-data.json';
import { IPlayerService } from '../../services/player-service';
import type { ITokenService, JwtPayload } from '../../services/token-service';
import { dbPlayerToJSON } from '../mappers/db-player-mapper';

interface ChoiceMessage {
  choiceId: string; // id of the choice selected
}

interface InputMessage {
  value: string;
}

const scenes = sceneData as Record<string, Scene>;

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
      const currentScene = { ...scenes[player.currentScene] };
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
        chosen.effects.forEach(effect =>
          applyEffect(player, jsonToEffect(effect))
        );
      }

      // Evaluate player health (after applying choice effects)
      const playerHealth = player.stats.get('health');
      if (playerHealth && playerHealth <= 0) {
        // send death scene
        const next = prepareSceneForPlayer(
          player,
          FixedSceneKeys.Death,
          chosen.id
        );
        client.send('scene', next);
        const json = playerToJSON(player);
        void this.playerService.savePlayerState(this.metadata.userId, json);
        return;
      }

      // Advance to the configured next scene
      const targetSceneId = chosen.nextScene;

      const next = prepareSceneForPlayer(player, targetSceneId, chosen.id);
      client.send('scene', next);
      const json = playerToJSON(player);
      void this.playerService.savePlayerState(this.metadata.userId, json);
    });

    // Handle text input from player for scenes that request input
    this.onMessage<InputMessage>('input', (client: Client, message) => {
      const player = this.state.player;
      if (!player) return;

      const currentScene = scenes[player.currentScene];
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
      if (player.currentScene === String(FixedSceneKeys.EnterName)) {
        player.name = value;
      }

      // Advance to the configured next scene
      const targetSceneId = String(currentScene.inputNextScene);

      const next = prepareSceneForPlayer(player, targetSceneId);
      client.send('scene', next);
      const json = playerToJSON(player);
      void this.playerService.savePlayerState(this.metadata.userId, json);
    });
  }

  async onJoin(client: Client, _options: GameRoomOptions, user: JwtPayload) {
    console.log(client.sessionId, '-', user.email, 'joined!');

    // Load or create player for this user
    const dbPlayer = await this.playerService.loadOrCreatePlayerForUser(
      user.sub!
    );
    const json = dbPlayerToJSON(dbPlayer);
    const player = jsonToPlayer(json);

    console.log(`Loaded player for user ${user.email}:`, player.name);

    const next = prepareSceneForPlayer(player, player.currentScene);
    this.state.player = player;
    client.send('scene', next);
  }

  async onLeave(_client: Client, consented: boolean) {
    const userId = this.metadata.userId;

    if (!consented || !userId) {
      return;
    }

    const player = this.state.player;
    const json = playerToJSON(player);
    await this.playerService.savePlayerState(userId, json);
  }

  onDispose() {
    console.log('GameRoom disposed');
  }
}

function applyEffect(player: Player, effect: Effect) {
  if (effect instanceof AddItemEffect) {
    const itemJson = itemData.find(i => i.id === effect.itemId);
    if (!itemJson) return;
    const item = jsonToItem(itemJson as ItemJSON);
    player.inventory.push(item);
  } else if (effect instanceof RemoveItemEffect) {
    const itemJson = itemData.find(i => i.id === effect.itemId);
    if (!itemJson) return;
    const item = jsonToItem(itemJson as ItemJSON);
    const index = player.inventory.findIndex(i => i.id === item.id);
    if (index !== -1) {
      player.inventory.splice(index, 1);
    }
  } else if (effect instanceof ModifyStatEffect) {
    player.stats.set(
      effect.stat,
      (player.stats.get(effect.stat) ?? 0) + effect.amount
    );
  }
}

/**
 * Return a shallow copy of a scene prepared for a specific player.
 * This prevents mutation of the global `scenes` object and filters
 * choices according to the player's inventory and previous choices.
 */
function prepareSceneForPlayer(
  player: Player,
  sceneId: string,
  choiceId?: string
) {
  const original = scenes[sceneId];
  if (!original) return undefined;

  // shallow copy of scene (we don't deep-copy text/effects here)
  const copy: Scene = {
    ...original,
    choices: (original.choices ?? []).slice(),
    effects: (original.effects ?? []).slice(),
  } as Scene;

  // filter choices based on conditions
  copy.choices = copy.choices.filter(c => {
    if (!c.conditions) return true;
    return c.conditions.every(_ => {
      switch (_.type) {
        case 'hasItem':
          return player.inventory.some(item => item.id === _.value);
        case 'noItem':
          return player.inventory.findIndex(item => item.id === _.value) === -1;
        case 'choiceMade':
          return player.choicesMade.includes(_.value);
        case 'noChoiceMade':
          return !player.choicesMade.includes(_.value);
        default:
          return false;
      }
    });
  });

  // apply scene effects immediately
  if (copy.effects) {
    copy.effects.forEach(effect => applyEffect(player, jsonToEffect(effect)));
  }

  if (choiceId) {
    player.choicesMade.push(choiceId);
  }
  if (
    player.visitedScenes[player.visitedScenes.length - 1] !==
    player.currentScene
  ) {
    player.visitedScenes.push(player.currentScene);
  }
  player.currentScene = sceneId;

  return copy;
}
