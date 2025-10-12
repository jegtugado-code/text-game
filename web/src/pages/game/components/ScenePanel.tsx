import type { Scene } from '@text-game/shared';
import React from 'react';
import type { PlayerInterface } from '../../../interfaces/player-interface';

type Props = {
  player: PlayerInterface | null;
  scene: Scene;
  onChoose: (choiceLabel: string) => void;
  onRestart: () => void;
};

export const ScenePanel: React.FC<Props> = ({
  player,
  scene,
  onChoose,
  onRestart,
}) => {
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <div className="flex justify-between">
          <h3 className="card-title">{scene.title}</h3>
          <span className="badge badge-primary self-center">
            {player?.choices.length ? player.choices.length - 1 : 0}
          </span>
        </div>
        <p>{scene.text}</p>

        {scene.isEnding && (
          <div className="mt-4">
            <div className="alert alert-success text-center">
              <span className="text-xl font-bold">Adventure Complete!</span>
            </div>
          </div>
        )}

        <div className="card-actions mt-4 flex flex-wrap gap-2">
          {scene.choices.map(choice => (
            <button
              key={choice.label + choice.nextScene}
              onClick={() => onChoose(choice.label)}
              className="btn btn-secondary"
            >
              {choice.label}
            </button>
          ))}
          {scene.isEnding && (
            <button
              onClick={() => onRestart()}
              className="btn btn-secondary ml-auto"
            >
              Restart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
