import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="text-center py-24 animate-fade-in">
      <h1 className="text-6xl font-bold text-slate-200 mb-2">404</h1>
      <p className="text-xl font-semibold text-slate-700 mb-2">Page not found</p>
      <p className="text-slate-500 mb-8 max-w-sm mx-auto">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
