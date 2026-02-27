import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { listResumes } from '../utils/api';

export default function HistoryPage() {
  const { user, token } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    listResumes(token)
      .then((data) => setResumes(data.resumes || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <p className="text-slate-600 mb-4">Sign in to view your resume history.</p>
        <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Resume History</h1>
      <p className="text-slate-600 mb-6">Your saved analyses. Click to view details.</p>
      {resumes.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          <p>No resumes yet.</p>
          <Link to="/upload" className="inline-block mt-4 text-blue-600 font-medium hover:underline">
            Upload your first resume
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {resumes.map((r) => (
            <li key={r._id}>
              <Link
                to={`/results/${r._id}`}
                className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{r.fileName || 'Resume'}</p>
                    <p className="text-sm text-slate-500">
                      Score: {r.score} · {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>
                <span className="text-blue-600 text-sm font-medium">View →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
