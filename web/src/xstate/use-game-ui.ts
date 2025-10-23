import { useMachine } from '@xstate/react';
import { useEffect, useCallback } from 'react';

import { useGameRoom, usePlayer } from '../features/game';

import { gameUiMachine } from './game-ui-machine';

export function useGameUI() {
  const [state, send] = useMachine(gameUiMachine);
  const {
    makeChoice,
    room,
    scene,
    error,
    isConnected,
    sendInput,
    joinGame,
    continuePlaying,
  } = useGameRoom();
  const { player } = usePlayer(room);

  // 🔹 When connected successfully
  useEffect(() => {
    if (isConnected && state.matches('joining')) {
      send({ type: 'JOIN_SUCCESS' });
    }
  }, [isConnected, state, send]);

  // 🔹 When there’s an error
  useEffect(() => {
    if (error && !state.matches('error')) {
      send({ type: 'JOIN_FAIL', error });
    }
  }, [error, state, send]);

  // 🔹 When scene updates while playing
  useEffect(() => {
    if (scene && state.matches('playing')) {
      send({ type: 'SCENE_UPDATE' });
    }
  }, [scene, state, send]);

  const startGame = useCallback(() => {
    send({ type: 'START' });
    // trigger the actual Colyseus join flow
    void joinGame();
  }, [send, joinGame]);

  return {
    state,
    send,
    scene,
    player,
    makeChoice,
    sendInput,
    startGame,
    isConnected,
    error,
    continuePlaying,
  };
}
