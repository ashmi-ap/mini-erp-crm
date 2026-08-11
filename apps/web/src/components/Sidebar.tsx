import { NavLink } from 'react-router-dom';

import { Button } from './ui/Button';

const navigationItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Customers', to: '/customers' },
  { label: 'Products', to: '/products' },
  { label: 'Inventory', to: '/inventory' },
  { label: 'Challans', to: '/challans' },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">ME</div>
        <div>
          <p className="brand-label">Mini ERP CRM</p>
          <h1>Operations Hub</h1>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `nav-link${isActive ? ' is-active' : ''}`
            }
            end={item.to === '/dashboard'}
          >
            <span className="nav-link-dot" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="status-card">
          <p className="status-label">Workspace</p>
          <strong>Ready for Step 5B</strong>
          <span>Auth-aware data flows will connect here later.</span>
        </div>

        <Button variant="secondary" fullWidth>
          Switch Workspace
        </Button>
      </div>
    </aside>
  );
}
