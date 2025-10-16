import React from 'react';

import type { PlayerInterface } from '../../features/game';

interface Props {
  player: PlayerInterface | null;
}

export const PlayerInfoCard: React.FC<Props> = ({ player }) => {
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h3 className="card-title">Player Info</h3>
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-70">Name:</span>
          <div className="badge badge-primary badge-lg">{player?.name}</div>
        </div>
      </div>
    </div>
  );
};
