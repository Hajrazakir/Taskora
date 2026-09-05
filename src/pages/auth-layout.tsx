import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <Link to="/" className="brand"><span className="brand-mark"><Sparkles size={16} /></span><span>taskflow</span></Link>
        <div className="auth-aside-body">
          <p className="auth-quote">"We used to lose half our week to scattered messages and missed deadlines. With TaskFlow, every task, owner, and due date finally lives in one place — and the whole team actually opens it every morning."</p>
          <div className="auth-quote-person">
            <span className="user-avatar gold-ring">HZ</span>
            <div><b>Hajra Zakir</b><small>Founder &amp; Owner, TaskFlow</small></div>
          </div>
        </div>
        <div className="auth-aside-stats">
          <div><b>3</b><span>Sample projects</span></div>
          <div><b>12</b><span>Sample tasks</span></div>
          <div><b>1 min</b><span>To get set up</span></div>
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <h1>{title}</h1>
          <p className="subheading">{subtitle}</p>
          {children}
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
