import path from 'path';
import { fileURLToPath } from 'url';

import {
  asClass,
  asValue,
  createContainer,
  InjectionMode,
  Lifetime,
} from 'awilix';

import gameSystem from './core/game-system';
import narrativeSystem from './core/narrative-system';
import { prisma } from './db/prisma';
import { EnvConfig } from './env-config';

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

// Automatically register all services in the 'src/services' directory.
// The default lifetime is SCOPED, creating a new instance per request.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const servicesPath = path.join(__dirname, 'services', '*.ts');
await container.loadModules([servicesPath], {
  // Use camelCase for the registered name, e.g., 'todos-service.js' becomes 'todosService'.
  formatName: 'camelCase',
  resolverOptions: {
    lifetime: Lifetime.SCOPED,
  },
  // Awilis will always use the default export
  esModules: true,
});

container.register({
  // Register the Prisma client instance as a singleton value
  prisma: asValue(prisma),
  // Register the environment configuration as a singleton value
  envConfig: asValue(EnvConfig),
  // Game Systems
  gameSystem: asClass(gameSystem).scoped(),
  narrativeSystem: asClass(narrativeSystem).scoped(),
});

export default container;
