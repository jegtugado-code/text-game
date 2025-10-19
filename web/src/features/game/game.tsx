import { useEffect } from 'react';

import { InventoryCard } from '../../components/game/InventoryCard';
import { PlayerInfoCard } from '../../components/game/PlayerInfoCard';
import { ScenePanel } from '../../components/game/ScenePanel';
import { StatsCard } from '../../components/game/StatsCard';
import { useGameUI } from '../../xstate/use-game-ui';

export function Game() {
  const {
    state,
    scene,
    player,
    startGame,
    makeChoice,
    restartGame,
    sendInput,
  } = useGameUI();

  const isIdle = state.matches('idle');

  useEffect(() => {
    if (!isIdle) return;
    startGame();
  }, [startGame, isIdle]);

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
            onSubmitInput={sendInput}
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
}
