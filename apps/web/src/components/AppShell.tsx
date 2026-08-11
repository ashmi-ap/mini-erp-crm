import { Outlet } from 'react-router-dom';

import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

export function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="shell-main">
        <TopHeader />
        <main className="shell-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
