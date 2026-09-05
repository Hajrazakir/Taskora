import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, UserPlus } from 'lucide-react';
import AuthLayout from './auth-layout';
import { useAuth, DEMO_EMAIL, DEMO_PASSWORD } from '@/context/auth-context';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateName(value: string) {
  if (!value.trim()) return 'Full name is required.';
  if (value.trim().length < 2) return 'Name looks too short.';
  return '';
}
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

function SignupPage() {
  const navigate = useNavigate();
  const { signup, login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    setFieldErrors({ name: nameErr, email: emailErr, password: passwordErr });
    setError('');
    if (nameErr || emailErr || passwordErr) return;

    setSubmitting(true);
    const result = await signup(name, email, password);
    setSubmitting(false);
    if (result.ok) navigate('/dashboard');
    else setError(result.error ?? 'Something went wrong.');
  }

  async function handleDemo() {
    setSubmitting(true);
    await login(DEMO_EMAIL, DEMO_PASSWORD);
    setSubmitting(false);
    navigate('/dashboard');
  }

  return (
    <AuthLayout title="Create your account" subtitle="Set up your workspace in under a minute.">
      <form onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        <label>
          Full name
          <input
            required
            value={name}
            onChange={(e) => { setName(e.target.value); if (fieldErrors.name) setFieldErrors((f) => ({ ...f, name: '' })); }}
            placeholder="Hajra Zakir"
            autoFocus
            className={fieldErrors.name ? 'input-error' : ''}
          />
          {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
        </label>
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: '' })); }}
            placeholder="you@company.com"
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
            placeholder="At least 8 characters"
            className={fieldErrors.password ? 'input-error' : ''}
          />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
        </label>
        <button className="primary-button large full" type="submit" disabled={submitting}><UserPlus size={16} /> Create account</button>
      </form>

      <div className="auth-divider"><span>or</span></div>

      <button className="secondary-button large full" onClick={handleDemo} disabled={submitting}>
        <Sparkles size={16} /> Continue with the demo account
      </button>
      <p className="auth-hint">Demo credentials: {DEMO_EMAIL} / {DEMO_PASSWORD}</p>

      <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
    </AuthLayout>
  );
}

export default SignupPage;
