import type { Stats } from '@text-game/shared';
import React from 'react';

type Props = {
  stats?: Stats;
};

export const StatsCard: React.FC<Props> = ({ stats }) => {
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h3 className="card-title mb-2">Stats</h3>
        <div className="space-y-2">
          {Object.entries(stats ?? {}).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <span className="w-16 text-sm capitalize opacity-70">{key}:</span>
              <div className="flex items-center gap-2 flex-1">
                <progress
                  className="progress progress-primary w-full"
                  value={value}
                  max={100}
                />
                <div className="badge badge-ghost badge-xs min-w-[2rem] text-center">
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
