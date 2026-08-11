import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';

const metricCards = [
  {
    label: 'Active customers',
    value: '248',
    meta: '+12 this week',
    tone: 'blue' as const,
  },
  {
    label: 'Low-stock products',
    value: '14',
    meta: '8 need attention',
    tone: 'amber' as const,
  },
  {
    label: 'Draft challans',
    value: '6',
    meta: '2 pending review',
    tone: 'slate' as const,
  },
  {
    label: 'Confirmed challans',
    value: '31',
    meta: 'Today: 5',
    tone: 'emerald' as const,
  },
];

const alerts = [
  {
    title: 'USB-C Cable',
    detail: 'Stock is below threshold in Mumbai WH.',
    tone: 'amber' as const,
  },
  {
    title: 'Mechanical Keyboard',
    detail: 'High demand from wholesale accounts.',
    tone: 'blue' as const,
  },
  {
    title: 'Outreach follow-up',
    detail: '4 customers need follow-up this afternoon.',
    tone: 'rose' as const,
  },
];

const activityRows = [
  ['CH-2026-000123', 'Sales', 'Confirmed', '2 min ago'],
  ['CH-2026-000122', 'Warehouse', 'Stock IN', '18 min ago'],
  ['CH-2026-000121', 'Accounts', 'Viewed', '41 min ago'],
];

export function DashboardPage() {
  return (
    <div className="page-stack dashboard-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <Badge tone="emerald">ERP Overview</Badge>
          <h1>Run the business from one operational view.</h1>
          <p>
            This shell is prepared for customers, products, inventory, and
            challans. It gives you a clean, responsive workspace before data
            integrations land.
          </p>
          <div className="hero-actions">
            <Button>Open Customers</Button>
            <Button variant="secondary">View Inventory</Button>
          </div>
        </div>

        <div className="hero-sidecard">
          <p className="eyebrow">Today</p>
          <div className="hero-stat">
            <strong>96%</strong>
            <span>fulfillment confidence</span>
          </div>
          <div className="hero-stat">
            <strong>12</strong>
            <span>items below stock alert</span>
          </div>
          <div className="hero-stat">
            <strong>4</strong>
            <span>follow-ups due today</span>
          </div>
        </div>
      </section>

      <section className="metric-grid">
        {metricCards.map((card) => (
          <Card key={card.label} className="metric-card">
            <div className="metric-card-inner">
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <Badge tone={card.tone}>{card.meta}</Badge>
            </div>
          </Card>
        ))}
      </section>

      <section className="content-grid">
        <Card
          title="Operational alerts"
          description="Quickly see what needs attention first."
        >
          <div className="alert-stack">
            {alerts.map((alert) => (
              <div key={alert.title} className="alert-row">
                <div>
                  <strong>{alert.title}</strong>
                  <p>{alert.detail}</p>
                </div>
                <Badge tone={alert.tone}>Watch</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Recent activity"
          description="Placeholder activity feed for live operations."
        >
          <Table>
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Area</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {activityRows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell) => (
                      <td key={cell}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Table>
        </Card>
      </section>
    </div>
  );
}
