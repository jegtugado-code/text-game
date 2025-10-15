// web/src/hooks/useGameRoom.ts
import { GameState, type Scene } from '@text-game/shared'; // your scene type interface
import * as Colyseus from 'colyseus.js';
import { useEffect, useState } from 'react';

const client = new Colyseus.Client(import.meta.env.VITE_GAME_WS_URL as string); // adjust if you’re deploying remotely

export function useGameRoom() {
  const [room, setRoom] = useState<Colyseus.Room<GameState> | null>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  async function joinGame(name: string) {
    try {
      const newRoom = await client.joinOrCreate<GameState>('game_room');

      setRoom(newRoom);
      setIsConnected(true);

      // Tell server we joined
      newRoom.send('join', { name });

      // Listen for scene updates
      newRoom.onMessage('scene', (sceneData: Scene) => {
        setScene(sceneData);
        setError(null);
      });

      // Listen for errors
      newRoom.onMessage('error', (err: { message: string }) => {
        setError(err.message);
      });
    } catch (e) {
      console.error('Failed to join room:', e);
      setError('Could not connect to game server.');
    }
  }

  function makeChoice(choiceLabel: string) {
    if (!room) return;
    room.send('choice', { choice: choiceLabel });
  }

  function resetGame() {
    if (!room) return;
    room.send('reset');
    setScene(null);
    setError(null);
  }

  useEffect(() => {
    return () => {
      room?.leave().catch(e => console.log(e));
    };
  }, [room]);

  return { joinGame, makeChoice, resetGame, room, scene, error, isConnected };
}
