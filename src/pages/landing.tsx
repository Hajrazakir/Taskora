import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, CalendarDays, CircleDot, ClipboardList, MessageSquare, Sparkles, Users,
} from 'lucide-react';
import { useAuth, DEMO_EMAIL, DEMO_PASSWORD } from '@/context/auth-context';

const features = [
  {
    icon: <ClipboardList size={18} />,
    title: 'Boards that match how you work',
    body: 'Group tasks by project, drag them across to do, in progress, and done, and see status at a glance.',
  },
  {
    icon: <Users size={18} />,
    title: 'One workspace, whole team',
    body: 'Assign owners, track who is doing what, and keep everyone pointed at the same due dates.',
  },
  {
    icon: <MessageSquare size={18} />,
    title: 'Activity, not status meetings',
    body: 'Every move, comment, and completed task lands in a live feed, so updates stop living in someone\u2019s head.',
  },
];

const previewColumns: { label: string; tone: 'todo' | 'in-progress' | 'done'; cards: { title: string; tag: string }[] }[] = [
  { label: 'To do', tone: 'todo', cards: [{ title: 'Create social launch assets', tag: 'Low' }] },
  { label: 'In progress', tone: 'in-progress', cards: [{ title: 'Prepare launch checklist', tag: 'Medium' }, { title: 'Map the onboarding flow', tag: 'High' }] },
  { label: 'Done', tone: 'done', cards: [{ title: 'Review the homepage copy', tag: 'High' }] },
];

function LandingPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  async function tryDemo() {
    await login(DEMO_EMAIL, DEMO_PASSWORD);
    navigate('/dashboard');
  }

  return (
    <div className="marketing">
      <header className="marketing-nav">
        <div className="brand light"><span className="brand-mark"><Sparkles size={16} /></span><span>taskflow</span></div>
        <nav className="marketing-nav-links">
          <button className="text-button" onClick={tryDemo}>View live demo</button>
          <button className="secondary-button" onClick={() => navigate('/login')}>Log in</button>
          <button className="primary-button" onClick={() => navigate('/signup')}>Get started <ArrowRight size={15} /></button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <h1>Plan the work. See the progress. Ship on time.</h1>
          <p className="subheading large">
            Taskflow is where a small team keeps its projects, tasks, and updates in one place \u2014
            instead of scattered across chat threads and spreadsheets.
          </p>
          <div className="hero-actions">
            <button className="primary-button large" onClick={() => navigate('/signup')}>Get started free <ArrowRight size={16} /></button>
            <button className="secondary-button large" onClick={tryDemo}>View live demo</button>
          </div>
          <p className="hero-note">No credit card. The live demo signs you in instantly with sample projects.</p>
        </div>

        <div className="hero-preview" aria-hidden="true">
          <div className="preview-window">
            <div className="preview-window-top"><span /><span /><span /></div>
            <div className="preview-board">
              {previewColumns.map((column) => (
                <div className="preview-column" key={column.label}>
                  <div className="preview-column-heading"><span className={`status-dot ${column.tone}`} />{column.label}</div>
                  {column.cards.map((card) => (
                    <div className="preview-card" key={card.title}>
                      <span className={`priority ${card.tag === 'High' ? 'high' : card.tag === 'Medium' ? 'medium' : 'low'}`}>{card.tag}</span>
                      <p>{card.title}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="feature-strip">
        {features.map((feature) => (
          <div className="feature-card" key={feature.title}>
            <span className="feature-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </div>
        ))}
      </section>

      <section className="cta-band">
        <div>
          <h2>Bring your next project into one place.</h2>
          <p>Create an account, or explore the live demo with sample projects already loaded.</p>
        </div>
        <div className="cta-band-actions">
          <button className="primary-button large" onClick={() => navigate('/signup')}>Create free account</button>
          <button className="ghost-button large" onClick={tryDemo}>View live demo <ArrowRight size={15} /></button>
        </div>
      </section>

      <footer className="marketing-footer">
        <div className="brand"><span className="brand-mark small"><Sparkles size={14} /></span><span>taskflow</span></div>
        <p>Built as a portfolio project. <CircleDot size={12} /> Not affiliated with any other product.</p>
        <p className="footer-meta"><CalendarDays size={13} /> {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default LandingPage;
