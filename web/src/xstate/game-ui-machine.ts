import { setup } from 'xstate';

export const gameUiMachine = setup({
  types: {
    context: {} as {
      error?: string;
    },
    events: {} as
      | { type: 'START' }
      | { type: 'JOIN_SUCCESS' }
      | { type: 'JOIN_FAIL'; error: string }
      | { type: 'SCENE_UPDATE' }
      | { type: 'RESET' },
  },
}).createMachine({
  id: 'game-ui',
  initial: 'idle',
  context: {},

  states: {
    idle: {
      on: {
        START: {
          target: 'joining',
        },
      },
    },

    joining: {
      on: {
        JOIN_SUCCESS: 'playing',
        JOIN_FAIL: {
          target: 'error',
          actions: ({ context, event }) => {
            context.error = event.error;
          },
        },
      },
    },

    playing: {
      on: {
        SCENE_UPDATE: 'playing',
        RESET: 'idle',
      },
    },

    error: {
      on: {
        RESET: 'idle',
      },
    },
  },
});
