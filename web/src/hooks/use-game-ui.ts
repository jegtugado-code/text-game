import { useMachine } from '@xstate/react';
import { gameUiMachine } from '../xstate/game-ui-machine';
import { useGameRoom } from './use-game-room';
import { usePlayer } from './use-player';
import { useEffect } from 'react';

export function useGameUI() {
  const [state, send] = useMachine(gameUiMachine);
  const { joinGame, makeChoice, resetGame, room, scene, error, isConnected } =
    useGameRoom();
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

  function startGame(name: string) {
    send({ type: 'START', name });
    joinGame(name);
  }

  function restartGame() {
    send({ type: 'RESET' });
    resetGame();
  }

  return {
    state,
    send,
    scene,
    player,
    makeChoice,
    startGame,
    restartGame,
    isConnected,
    error,
  };
}
