import path from 'path';
import { fileURLToPath } from 'url';

import { createContainer, InjectionMode, Lifetime } from 'awilix';

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

console.log(container.registrations);

export default container;
