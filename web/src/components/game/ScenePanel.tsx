import type { PlayerModel, SceneModel } from '@text-game/shared';
import React, { useState } from 'react';

import { GameText } from '../GameText';

interface Props {
  player: PlayerModel | null;
  scene: SceneModel;
  onChoose: (choiceId: string) => void;
  onSubmitInput: (value: string) => void;
}

export const ScenePanel: React.FC<Props> = ({
  player,
  scene,
  onChoose,
  onSubmitInput,
}) => {
  const [isTitleStreaming, setIsTitleStreaming] = useState(true);
  const [isTextStreaming, setIsTextStreaming] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const isStreaming = isTitleStreaming || isTextStreaming;

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <div className="flex justify-between">
          <GameText
            enableStreaming
            text={scene.title}
            className="card-title whitespace-pre-wrap break-words leading-relaxed"
            onStreamingChange={setIsTitleStreaming}
          />
          <span className="badge badge-primary self-center">
            {player?.choicesMade.length ? player.choicesMade.length - 1 : 0}
          </span>
        </div>
        {!isTitleStreaming && (
          <GameText
            enableStreaming
            text={scene.description}
            className="whitespace-pre-wrap break-words leading-relaxed"
            onStreamingChange={setIsTextStreaming}
          />
        )}

        {scene.isEnding && (
          <div className="mt-4">
            <div className="alert alert-success text-center">
              <span className="text-xl font-bold">Adventure Complete!</span>
            </div>
          </div>
        )}

        <div className="card-actions mt-4 flex flex-wrap gap-2">
          {scene.inputPrompt && (
            <div className="w-full flex gap-2 items-center">
              <input
                aria-label="scene-input"
                placeholder={String(scene.inputPrompt ?? '')}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="input input-bordered flex-1"
                disabled={isStreaming}
              />
              <button
                className="btn btn-primary"
                onClick={() => {
                  const v = inputValue.trim();
                  if (!v) return;
                  onSubmitInput(v);
                  setInputValue('');
                }}
                disabled={isStreaming || inputValue.trim().length === 0}
              >
                Submit
              </button>
            </div>
          )}
          {scene.choices.map(choice => (
            <button
              key={String(choice.id)}
              onClick={() => {
                if (!choice.id) {
                  // Do not allow selecting choices without stable ids.
                  // Keep a visible warning in the console to help debug missing ids.
                  console.warn('Choice missing id, cannot select:', choice);
                  return;
                }
                onChoose(String(choice.id));
              }}
              className="btn btn-secondary"
              disabled={isStreaming || !choice.id}
            >
              {choice.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
