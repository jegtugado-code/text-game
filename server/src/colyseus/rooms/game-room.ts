import {
  AddItemEffect,
  Effect,
  GameState,
  ModifyStatEffect,
  Player,
  RemoveItemEffect,
  Scene,
} from '@text-game/shared';
import { Room, Client, ServerError } from 'colyseus';

import sceneData from '../../data/intro-scene-data.json';
import itemData from '../../data/items.json';
// import sceneData from '../../data/test-scene-data.json';
import type { ITokenService, JwtPayload } from '../../services/token-service';
import { createChoiceFromJson } from '../factories/choice-factory';
import { createEffectFromJson } from '../factories/effect-factory';
import { createItemFromJson } from '../factories/item-factory';

interface ChoiceMessage {
  choice: string; // label of the choice in the current scene
}

interface InputMessage {
  value: string;
}

// Lightweight JSON typing for scenes to reduce `any` usage
interface SceneJSON {
  title?: string;
  text?: string;
  choices?: unknown[];
  effects?: unknown[];
  isEnding?: boolean;
  conditions?: unknown[];
}

const scenes: Record<string, Scene> = Object.fromEntries(
  Object.entries(sceneData as Record<string, SceneJSON>).map(([id, scene]) => [
    id,
    {
      ...scene,
      choices: (scene.choices ?? []).map(createChoiceFromJson),
      effects: (scene.effects ?? []).map(createEffectFromJson),
    } as Scene,
  ])
);

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
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      const currentScene = { ...scenes[player.currentScene] };
      // Basic validation
      const incoming =
        typeof message?.choice === 'string' ? message.choice.trim() : '';
      if (!incoming) {
        client.send('error', { message: 'Invalid choice' });
        return;
      }

      // Find the choice by stable id first, fallback to label for
      // backwards-compatibility with older clients that send labels.
      let chosen = currentScene.choices.find(c => c.id === incoming);
      chosen ??= currentScene.choices.find(_ => _.label === incoming);
      if (chosen) {
        // Apply any effects based on the chosen choice
        if (chosen.effects) {
          chosen.effects.forEach(effect => applyEffect(player, effect));
        }

        // Evaluate player health (after applying choice effects)
        const playerHealth = player.stats.get('health');
        if (playerHealth && playerHealth <= 0) {
          // send death scene
          client.send(
            'scene',
            prepareSceneForPlayer(player, FixedSceneKeys.Death)
          );
          return;
        }

        const targetSceneId = chosen.nextScene;

        // Send a prepared (filtered) copy of the scene to the client
        client.send('scene', prepareSceneForPlayer(player, targetSceneId));
      } else {
        client.send('error', { message: 'Invalid choice!' });
      }
    });

    // Handle text input from player for scenes that request input
    this.onMessage<InputMessage>('input', (client: Client, message) => {
      const player = this.state.players.get(client.sessionId);
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
      const next = String(currentScene.inputNextScene);
      player.currentScene = next;
      client.send('scene', prepareSceneForPlayer(player, next));
    });

    this.onMessage('reset', (client: Client) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;

      // Reset player state
      player.currentScene = FixedSceneKeys.Start;
      player.choices.clear();
      player.inventory.clear();
      player.stats.clear();

      // Send the first scene
      client.send('scene', prepareSceneForPlayer(player, FixedSceneKeys.Start));
    });
  }

  onJoin(client: Client, options: GameRoomOptions, user: JwtPayload) {
    console.log(client.sessionId, '-', user.email, 'joined!');

    this.state.createPlayer(client.sessionId, user.email as string);

    const player = this.state.players.get(client.sessionId);
    if (!player) return;

    player.currentScene = FixedSceneKeys.Start;

    // Send the first scene (prepared per-player copy)
    client.send('scene', prepareSceneForPlayer(player, FixedSceneKeys.Start));
  }

  onLeave(client: Client, _consented: boolean) {
    console.log(client.sessionId, 'left!');
    this.state.removePlayer(client.sessionId);
  }

  onDispose() {
    console.log('GameRoom disposed');
  }
}

function applyEffect(player: Player, effect: Effect) {
  if (effect instanceof AddItemEffect) {
    const itemJson = itemData.find(i => i.id === effect.itemId);
    if (!itemJson) return;
    const item = createItemFromJson(itemJson);
    player.inventory.push(item);
  } else if (effect instanceof RemoveItemEffect) {
    const itemJson = itemData.find(i => i.id === effect.itemId);
    const item = createItemFromJson(itemJson);
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
function prepareSceneForPlayer(player: Player, sceneId: string) {
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
          return player.choices.includes(_.value);
        case 'noChoiceMade':
          return !player.choices.includes(_.value);
        default:
          return false;
      }
    });
  });

  // apply scene effects immediately
  if (copy.effects) {
    copy.effects.forEach(effect => applyEffect(player, effect));
  }

  player.choices.push(sceneId);
  player.currentScene = sceneId;

  return copy;
}
