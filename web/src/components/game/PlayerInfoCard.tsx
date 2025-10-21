import type { PlayerJSON } from '@text-game/shared';
import React from 'react';

interface Props {
  player: PlayerJSON | null;
}

export const PlayerInfoCard: React.FC<Props> = ({ player }) => {
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h3 className="card-title">Player Info</h3>
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-70">Name:</span>
          <div className="badge badge-primary badge-lg">
            {player?.name ?? 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};
