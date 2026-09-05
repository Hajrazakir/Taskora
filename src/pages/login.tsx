import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Sparkles } from 'lucide-react';
import AuthLayout from './auth-layout';
import { useAuth, DEMO_EMAIL, DEMO_PASSWORD } from '@/context/auth-context';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: string) {
  if (!value.trim()) return 'Email is required.';
  if (!EMAIL_PATTERN.test(value.trim())) return 'Enter a valid email address (e.g. name@company.com).';
  return '';
}
function validatePassword(value: string) {
  if (!value) return 'Password is required.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  return '';
}

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    setFieldErrors({ email: emailErr, password: passwordErr });
    setError('');
    if (emailErr || passwordErr) return;

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? 'Something went wrong.');
      return;
    }
    navigate('/dashboard');
  }

  async function handleDemo() {
    setSubmitting(true);
    await login(DEMO_EMAIL, DEMO_PASSWORD);
    setSubmitting(false);
    navigate('/dashboard');
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to pick up where your team left off.">
      <form onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: '' })); }}
            placeholder="you@company.com"
            autoFocus
            className={fieldErrors.email ? 'input-error' : ''}
          />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </label>
        <label>
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors((f) => ({ ...f, password: '' })); }}
            placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
            className={fieldErrors.password ? 'input-error' : ''}
          />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
        </label>
        <button className="primary-button large full" type="submit" disabled={submitting}><LogIn size={16} /> Log in</button>
      </form>

      <div className="auth-divider"><span>or</span></div>

      <button className="secondary-button large full" onClick={handleDemo} disabled={submitting}>
        <Sparkles size={16} /> Continue with the demo account
      </button>
      <p className="auth-hint">Demo credentials: {DEMO_EMAIL} / {DEMO_PASSWORD}</p>

      <p className="auth-switch">Don't have an account? <Link to="/signup">Sign up for free</Link></p>
    </AuthLayout>
  );
}

export default LoginPage;
