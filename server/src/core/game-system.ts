import { INarrativeSystem } from './narrative-system';

export interface IGameSystem {
  narrativeSystem: INarrativeSystem;
}

export default class GameSystem implements IGameSystem {
  public readonly narrativeSystem;

  constructor({ narrativeSystem }: { narrativeSystem: INarrativeSystem }) {
    this.narrativeSystem = narrativeSystem;
  }
}
