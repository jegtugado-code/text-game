import { GameState, type SceneModel } from '@text-game/shared'; // your scene type interface
import * as Colyseus from 'colyseus.js';
import { useEffect, useState } from 'react';

import { useAuth } from '../../contexts/use-auth';

const client = new Colyseus.Client(import.meta.env.VITE_GAME_WS_URL as string); // adjust if you’re deploying remotely

export function useGameRoom() {
  const { token } = useAuth();
  const [room, setRoom] = useState<Colyseus.Room<GameState> | null>(null);
  const [scene, setScene] = useState<SceneModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  async function joinGame() {
    // avoid duplicate join attempts
    if (isConnected || isJoining || room || !token) return;

    setIsJoining(true);
    try {
      // pass JWT token in the join options so the server can verify/identify the user
      const gameRoom = await client.joinOrCreate<GameState>('game_room', {
        token,
      });

      setRoom(gameRoom);
      setIsConnected(true);

      // Listen for scene updates
      gameRoom.onMessage('scene', (sceneData: SceneModel) => {
        setScene(sceneData);
        setError(null);
      });

      // Listen for errors
      gameRoom.onMessage('error', (err: { message: string }) => {
        setError(err.message);
      });
    } catch (e) {
      console.error('Failed to join room:', e);
      setError('Could not connect to game server.');
    } finally {
      setIsJoining(false);
    }
  }

  function makeChoice(choiceId: string) {
    if (!room) return;
    // send the stable choice id (server will fallback to label matching
    // if an older scene JSON/client doesn't include ids yet)
    room.send('choice', { choiceId });
  }

  function sendInput(value: string) {
    if (!room) return;
    room.send('input', { value });
  }

  useEffect(() => {
    return () => {
      room?.leave().catch(e => console.log(e));
    };
  }, [room]);

  return {
    joinGame,
    makeChoice,
    sendInput,
    room,
    scene,
    error,
    isConnected,
  };
}
