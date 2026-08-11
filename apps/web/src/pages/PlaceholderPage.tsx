import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

type PlaceholderPageProps = {
  title: string;
  subtitle: string;
  bullets: readonly string[];
};

export function PlaceholderPage({
  title,
  subtitle,
  bullets,
}: PlaceholderPageProps) {
  return (
    <div className="page-stack">
      <section className="section-hero">
        <Badge tone="blue">Coming next</Badge>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </section>

      <Card title={`${title} workspace`} description="Shell only for Step 5A.">
        <ul className="bullet-list">
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
