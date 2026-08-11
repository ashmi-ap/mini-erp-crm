import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

export function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-copy">
          <p className="eyebrow">Mini ERP CRM</p>
          <h1>Sign in to the operations workspace.</h1>
          <p>
            Authentication will connect in a later step. This screen establishes
            the visual language and form layout for the app.
          </p>
        </div>

        <Card
          title="Login"
          description="Placeholder form until API integration lands."
        >
          <div className="form-stack">
            <Input label="Email" type="email" placeholder="sales@erp.demo" />
            <Input label="Password" type="password" placeholder="••••••••" />
            <Button fullWidth>Continue</Button>
          </div>
        </Card>
      </section>
    </main>
  );
}
