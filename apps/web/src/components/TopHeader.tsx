import { Button } from './ui/Button';

export function TopHeader() {
  return (
    <header className="top-header">
      <div>
        <p className="eyebrow">ERP workspace</p>
        <h2>Dashboard</h2>
      </div>

      <div className="header-actions">
        <div className="header-chip">
          <span className="chip-dot" />
          <span>Desktop / Mobile Ready</span>
        </div>
        <Button variant="ghost">Export</Button>
      </div>
    </header>
  );
}
