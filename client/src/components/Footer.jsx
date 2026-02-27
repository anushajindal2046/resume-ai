import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} Resume AI. All rights reserved.
          </div>
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/about" className="text-slate-600 hover:text-slate-900">
              About
            </Link>
            <Link to="/feedback" className="text-slate-600 hover:text-slate-900">
              Feedback
            </Link>
            <Link to="/" className="text-slate-600 hover:text-slate-900">
              Home
            </Link>
            <Link to="/upload" className="text-slate-600 hover:text-slate-900">
              Analysis
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
