import { GameState, Player, type Stats } from '@text-game/shared';
import * as Colyseus from 'colyseus.js';
import { useEffect, useState } from 'react';

import type { PlayerInterface } from '../interfaces/player-interface';

export function usePlayer(room: Colyseus.Room<GameState> | null) {
  const [player, setPlayer] = useState<PlayerInterface | null>(null);

  useEffect(() => {
    if (!room) return;

    const $ = Colyseus.getStateCallbacks(room);

    $(room.state).players.onAdd((item, key) => {
      if (key !== room.sessionId) return;

      $(item).onChange(() => setPlayer(mapPlayerToInterface(item)));
      $(item.choices).onChange(() => setPlayer(mapPlayerToInterface(item)));
      $(item.inventory).onChange(() => setPlayer(mapPlayerToInterface(item)));
      $(item.stats).onChange(() => setPlayer(mapPlayerToInterface(item)));
    });

    $(room.state).players.onRemove((_item, key) => {
      if (key !== room.sessionId) return;
      setPlayer(null);
    });
  }, [room]);

  return { player };
}

function mapPlayerToInterface(player: Player): PlayerInterface {
  return {
    name: player.name,
    currentScene: player.currentScene,
    choices: Array.from(player.choices.values()),
    inventory: Array.from(player.inventory.values()),
    stats: Object.fromEntries(player.stats.entries()) as Stats,
  };
}
