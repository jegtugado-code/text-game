import { GameState, type PlayerModel } from '@text-game/shared';
import { playerSchemaToModel } from '@text-game/shared/mappers';
import * as Colyseus from 'colyseus.js';
import { useEffect, useState } from 'react';

export function usePlayer(room: Colyseus.Room<GameState> | null) {
  const [player, setPlayer] = useState<PlayerModel | null>(null);

  useEffect(() => {
    if (!room) return;

    const $ = Colyseus.getStateCallbacks(room);

    $(room.state).listen('player', (v, _pv) => {
      setPlayer(playerSchemaToModel(v));
      $(room.state.player).onChange(() => {
        setPlayer(playerSchemaToModel(room.state.player));
      });
    });
  }, [room]);

  return { player };
}
