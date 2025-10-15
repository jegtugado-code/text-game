import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

import { ToastProvider } from './features/toast';

const queryClient = new QueryClient();

ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <HydratedRouter />
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
