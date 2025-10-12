import { useState } from 'react';
import { useGameUI } from '../../hooks/use-game-ui';
// Using plain DaisyUI/Tailwind classes instead of react-daisyui components
import { StartCard } from './components/StartCard';
import { ScenePanel } from './components/ScenePanel';
import { PlayerInfoCard } from './components/PlayerInfoCard';
import { StatsCard } from './components/StatsCard';
import { InventoryCard } from './components/InventoryCard';

export const Game = () => {
  const { state, scene, player, startGame, makeChoice, restartGame } =
    useGameUI();

  const [playerName, setPlayerName] = useState<string>('');

  if (state.matches('idle')) {
    return (
      <div className="max-w-xl mx-auto">
        <StartCard
          playerName={playerName}
          setPlayerName={setPlayerName}
          onStart={startGame}
        />
      </div>
    );
  }

  if (state.matches('joining')) {
    return (
      <div className="flex items-center">
        <span className="loading loading-spinner mr-2" />
        <span>Connecting...</span>
      </div>
    );
  }

  if (state.matches('error')) {
    return (
      <div className="alert alert-error">
        <span>Something went wrong. Please try again.</span>
      </div>
    );
  }

  if (!scene) {
    return (
      <div className="flex items-center">
        <span className="loading loading-spinner mr-2" />
        <span>Loading scene...</span>
      </div>
    );
  }

  if (state.matches('playing')) {
    return (
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <ScenePanel
            player={player}
            scene={scene}
            onChoose={makeChoice}
            onRestart={restartGame}
          />
        </div>

        <div className="col-span-4 space-y-4">
          <PlayerInfoCard player={player} />
          <StatsCard stats={player?.stats} />
          <InventoryCard inventory={player?.inventory} />
        </div>
      </div>
    );
  }
};
