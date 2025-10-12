import React from 'react';

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
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold whitespace-break-spaces">
            Welcome to{'\n'}Text Game
          </h1>
          <p className="my-6">Enter your name to start your adventure!</p>
          <input
            type="text"
            placeholder="Your Name"
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            className="input input-bordered w-full mb-6"
          />
          <button
            className="btn btn-primary"
            onClick={() => playerName && onStart(playerName)}
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};
