import { Link } from 'react-router-dom';
import { Compass, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="brand"><span className="brand-mark"><Sparkles size={16} /></span><span>taskflow</span></div>
      <div className="not-found-body">
        <span className="not-found-icon"><Compass size={22} /></span>
        <h1>Page not found</h1>
        <p className="subheading">The page you're looking for doesn't exist or may have moved.</p>
        <Link to="/" className="primary-button large">Back to homepage</Link>
      </div>
    </div>
  );
}
