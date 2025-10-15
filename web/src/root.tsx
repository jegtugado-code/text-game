import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import { constants } from './constants';
import './style.css';
import { AppLayout } from './layouts/AppLayout';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{constants.AppName}</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
