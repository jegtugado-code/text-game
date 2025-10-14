import React, { useState } from 'react';
import { GameText } from '../GameText';

type Props = {
  playerName: string;
  setPlayerName: (v: string) => void;
  onStart: (name: string) => void;
};

export const StartCard: React.FC<Props> = ({
  playerName,
  setPlayerName,
  onStart,
}) => {
  const [isTitleStreaming, setIsTitleStreaming] = useState(true);
  const [isTextStreaming, setIsTextStreaming] = useState(false);
  const isStreaming = isTitleStreaming || isTextStreaming;
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <GameText
            enableStreaming
            text={'Welcome to\nText Game'}
            className="text-5xl font-bold whitespace-pre-wrap break-words leading-relaxed"
            onStreamingChange={setIsTitleStreaming}
          />
          {!isTitleStreaming && (
            <GameText
              enableStreaming
              text="Enter your name to start your adventure!"
              className="my-6 whitespace-pre-wrap break-words leading-relaxed"
              onStreamingChange={setIsTextStreaming}
            />
          )}
          {!isStreaming && (
            <input
              type="text"
              placeholder="Your Name"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              className="input input-bordered w-full mb-6"
            />
          )}
          <button
            className="btn btn-primary"
            disabled={isStreaming || !playerName.trim()}
            onClick={() => playerName && onStart(playerName)}
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};
