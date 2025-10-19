/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AwilixContainer } from 'awilix';

export function roomWithContainer<T extends new (...args: any[]) => any>(
  RoomClass: T,
  container: AwilixContainer
) {
  return class extends RoomClass {
    constructor(...args: any[]) {
      super(...args);

      // 👇 Create a scoped container for this room
      const scoped = container.createScope();

      // Merge the cradle (injected services) onto the room instance
      Object.assign(this, scoped.cradle);
    }
  };
}
