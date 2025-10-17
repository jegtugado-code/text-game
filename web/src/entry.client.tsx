import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

import { AuthProvider } from './contexts';
import { ToastProvider } from './features/toast';

const queryClient = new QueryClient();

ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <HydratedRouter />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
