import {
  AddItemEffect,
  Effect,
  GameState,
  ModifyStatEffect,
  Player,
  RemoveItemEffect,
  Scene,
} from '@text-game/shared';
import { Room, Client } from 'colyseus';

import itemData from '../../data/items.json';
import sceneData from '../../data/test-scene-data.json';
import { createChoiceFromJson } from '../factories/choice-factory';
import { createEffectFromJson } from '../factories/effect-factory';
import { createItemFromJson } from '../factories/item-factory';

interface JoinMessage {
  name: string;
}

interface ChoiceMessage {
  choice: string; // label of the choice in the current scene
}

const scenes: Record<string, Scene> = Object.fromEntries(
  Object.entries(sceneData as Record<string, any>).map(([id, scene]) => [
    id,
    {
      ...scene,
      choices: (scene.choices ?? []).map(createChoiceFromJson),
      effects: (scene.effects ?? []).map(createEffectFromJson),
    },
  ])
);
enum FixedSceneKeys {
  Start = 'start',
  Death = 'death',
}

export class GameRoom extends Room<GameState> {
  onCreate(options: any) {
    // Initialize state
    this.state = new GameState();
    console.log('GameRoom created with options:', options);

    // Handle player joining
    this.onMessage<JoinMessage>('join', (client: Client, message) => {
      this.state.createPlayer(client.sessionId, message.name);

      const player = this.state.players.get(client.sessionId);
      if (!player) return;

      player.currentScene = FixedSceneKeys.Start;

      // Send the first scene (prepared per-player copy)
      client.send('scene', prepareSceneForPlayer(player, FixedSceneKeys.Start));
    });

    // Handle player making a choice
    this.onMessage<ChoiceMessage>('choice', (client: Client, message) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      const currentScene = { ...scenes[player.currentScene] };
      // Find the choice in the current scene
      const chosen = currentScene.choices.find(_ => _.label === message.choice);
      if (chosen) {
        // Apply any effects based on the chosen choice
        if (chosen.effects) {
          chosen.effects.forEach(effect => applyEffect(player, effect));
        }

        // Evaluate player health (after applying choice effects)
        const playerHealth = player.stats.get('HP');
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

  onJoin(client: Client, _options: any) {
    console.log(client.sessionId, 'joined!');
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
