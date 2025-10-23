import { GameState } from '@text-game/shared';
import {
  modelToPlayerSchema,
  playerSchemaToModel,
} from '@text-game/shared/mappers';
import { Room, Client, ServerError } from 'colyseus';
import { IGameSystem } from 'src/core/game-system';

import { IPlayerService } from '../../services/player-service';
import type { ITokenService, JwtPayload } from '../../services/token-service';
import { dbPlayerToModel } from '../mappers/db-player-mapper';

interface ChoiceMessage {
  choiceId: string; // id of the choice selected
}

interface InputMessage {
  value: string;
}

// Passed from the client when joining the room
export interface GameRoomOptions {
  token?: string;
}

export interface GameRoomMetadata {
  userId: string;
  email: string;
}

export class GameRoom extends Room<GameState, GameRoomMetadata> {
  public tokenService!: ITokenService;
  public playerService!: IPlayerService;
  public gameSystem!: IGameSystem;

  async onAuth(client: Client, options: GameRoomOptions) {
    if (!options.token) {
      throw new ServerError(400, 'Authentication token missing.');
    }

    try {
      // Verify the token using the secret key
      const user = this.tokenService.verifyToken(options.token);

      console.log(
        `Client ${client.sessionId} authenticated with user: ${user.email}`
      );

      // Store user info in room metadata
      await this.setMetadata({
        userId: user.sub,
        email: user.email as string,
      });

      // Return the decoded data, which will be passed to onJoin()
      return user;
    } catch (err) {
      console.error('JWT verification failed:', err);
      throw new ServerError(401, 'Invalid or expired token.');
    }
  }

  onCreate(options: GameRoomOptions) {
    this.maxClients = 1; // Only one client allowed
    this.autoDispose = true; // Destroy when the player leaves
    // Initialize state
    this.state = new GameState();
    console.log('GameRoom created with options:', options);

    // Handle player making a choice
    this.onMessage<ChoiceMessage>('choice', (client: Client, { choiceId }) => {
      const player = this.state.player;
      if (!player) return;

      const model = playerSchemaToModel(player);
      this.gameSystem.narrativeSystem.choiceMade(model, choiceId);
      const next = this.gameSystem.narrativeSystem.getCurrentScene(model);
      this.state.player = modelToPlayerSchema(model);
      client.send('scene', next);
      void this.playerService.savePlayerState(this.metadata.userId, model);
    });

    // Handle text input from player for scenes that request input
    this.onMessage<InputMessage>('input', (client: Client, { value }) => {
      const player = this.state.player;
      if (!player) return;

      const model = playerSchemaToModel(player);
      this.gameSystem.narrativeSystem.inputMade(model, value);
      const next = this.gameSystem.narrativeSystem.getCurrentScene(model);
      this.state.player = modelToPlayerSchema(model);
      client.send('scene', next);
      void this.playerService.savePlayerState(this.metadata.userId, model);
    });
  }

  async onJoin(client: Client, _options: GameRoomOptions, user: JwtPayload) {
    console.log(client.sessionId, '-', user.email, 'joined!');

    // Load or create player for this user
    const dbPlayer = await this.playerService.loadOrCreatePlayerForUser(
      user.sub!
    );

    const model = dbPlayerToModel(dbPlayer);
    this.gameSystem.narrativeSystem.loadChapter(model.currentChapter);
    await this.gameSystem.narrativeSystem.loadQuest(model);
    const next = this.gameSystem.narrativeSystem.getCurrentScene(model);
    this.state.player = modelToPlayerSchema(model);
    client.send('scene', next);
  }

  async onLeave(_client: Client, consented: boolean) {
    const userId = this.metadata.userId;

    if (!consented || !userId) {
      return;
    }

    const player = this.state.player;
    const model = playerSchemaToModel(player);
    await this.playerService.savePlayerState(userId, model);
  }

  onDispose() {
    console.log('GameRoom disposed');
  }
}
