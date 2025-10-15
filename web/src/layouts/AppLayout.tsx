import { useState, type PropsWithChildren } from 'react';

import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { ToastNotifications } from '../features/toast';

export const AppLayout = ({ children }: PropsWithChildren) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-primary-content" data-theme="coffee">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        {/* Mobile sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          mobile
        />

        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 p-6">{children}</main>
        <ToastNotifications />
      </div>
    </div>
  );
};
