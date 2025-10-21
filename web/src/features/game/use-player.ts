import { GameState, playerToJSON, type PlayerJSON } from '@text-game/shared';
import * as Colyseus from 'colyseus.js';
import { useEffect, useState } from 'react';

export function usePlayer(room: Colyseus.Room<GameState> | null) {
  const [player, setPlayer] = useState<PlayerJSON | null>(null);

  useEffect(() => {
    if (!room) return;

    const $ = Colyseus.getStateCallbacks(room);

    $(room.state).listen('player', (v, _pv) => {
      setPlayer(playerToJSON(v));
      $(room.state.player).onChange(() => {
        setPlayer(playerToJSON(room.state.player));
      });
    });
  }, [room]);

  return { player };
}
