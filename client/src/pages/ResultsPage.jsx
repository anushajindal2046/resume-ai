import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getResume, downloadReport } from '../utils/api';

function ScoreMeter({ score, size = 180 }) {
  const percent = Math.min(100, Math.max(0, Number(score) || 0));
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative inline-flex flex-col items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90 absolute inset-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#2563eb"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-slate-900">{percent}</span>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">ATS Score</span>
      </div>
    </div>
  );
}

function BreakdownBars({ breakdown }) {
  const items = [
    { key: 'core', label: 'Skill Assessment', color: 'bg-blue-500' },
    { key: 'tools', label: 'Tools & Experience', color: 'bg-emerald-500' },
    { key: 'soft', label: 'Soft Skills', color: 'bg-amber-500' },
  ];
  if (!breakdown) return null;

  return (
    <div className="space-y-4">
      {items.map(({ key, label, color }) => {
        const data = breakdown[key];
        if (!data) return null;
        const max = data.maxPoints || 1;
        const pct = Math.round((data.points / max) * 100);
        return (
          <div key={key}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium text-slate-700">{label}</span>
              <span className="text-slate-500">{pct}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ResultsPage() {
  const { id } = useParams();
  const location = useLocation();
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      getResume(id, token || undefined)
        .then(setData)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } else if (location.state?.result) {
      const r = location.state.result;
      setData({
        score: r.score,
        extractedSkills: r.matchedSkills,
        missingSkills: r.missingSkills || [],
        missingForJob: r.missingForJob || [],
        scoringBreakdown: r.scoringBreakdown,
        fitResults: r.fitResults || [],
      });
    } else {
      setData(null);
    }
  }, [id, token, location.state]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading results…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md rounded-xl bg-red-50 border border-red-100 p-6 animate-fade-in">
        <p className="text-red-700 font-medium">{error}</p>
        <Link to="/upload" className="inline-block mt-4 text-sm font-semibold text-blue-600 hover:underline">
          Back to Upload
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-900 mb-3">No results to show</h1>
        <p className="text-slate-600 mb-8 max-w-sm mx-auto">
          Upload and analyze a resume, or open a saved result from a link.
        </p>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Upload
        </Link>
      </div>
    );
  }

  const skills = data.extractedSkills || data.matchedSkills || [];
  const missingSkills = data.missingSkills || [];
  const missingForJob = data.missingForJob || [];
  const breakdown = data.scoringBreakdown;
  const fitResults = data.fitResults || [];
  const skillMatchPct = skills.length ? Math.min(100, Math.round((skills.length / 15) * 100)) : 0;
  const readability = data.score >= 70 ? 'High' : data.score >= 40 ? 'Medium' : 'Low';

  async function handleDownload() {
    if (!id) return;
    setDownloading(true);
    try {
      await downloadReport(id, token || undefined);
    } catch (e) {
      // ignore or toast
    } finally {
      setDownloading(false);
    }
  }

  const cardClass = 'rounded-xl bg-white border border-slate-200 shadow-sm p-6';

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Analysis Results</h1>
        <div className="flex items-center gap-3">
          <Link
            to="/upload"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Edit Resume / Re-upload
          </Link>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading || !id}
            className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            {downloading ? 'Downloading…' : 'Download Report (HTML)'}
          </button>
        </div>
      </div>

      {/* Main results card - ResumeIQ style */}
      <div className={`${cardClass} overflow-hidden`}>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left: ATS Score + Skill Match + Readability */}
          <div className="flex flex-col items-center lg:items-start shrink-0">
            <div className="relative flex flex-col items-center">
              <ScoreMeter score={data.score} />
            </div>
            <div className="mt-4 space-y-2 w-full max-w-[220px]">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Skill Match</span>
                <span className="font-semibold text-green-600">{skillMatchPct}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Readability</span>
                <span className="font-semibold text-blue-600">{readability}</span>
              </div>
            </div>
          </div>

          {/* Right: Keywords + Missing + Breakdown */}
          <div className="flex-1 min-w-0 space-y-6">
            {skills.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Keywords Found</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {missingSkills.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Missing Keywords (from database)</h3>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {missingForJob.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Missing for Target Job (Critical)</h3>
                <div className="flex flex-wrap gap-2">
                  {missingForJob.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full bg-orange-100 text-orange-800 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Score Breakdown</h3>
              <BreakdownBars breakdown={breakdown} />
            </div>
          </div>
        </div>
      </div>

      {/* Company Fit */}
      {fitResults.length > 0 && (
        <section className={cardClass}>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Company Fit
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fitResults.map((fit, i) => (
              <div
                key={i}
                className="p-4 rounded-lg border border-slate-100 bg-slate-50/50"
              >
                <p className="font-semibold text-slate-900 truncate">{fit.companyName || 'Company'}</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{fit.fitPercentage}%</p>
                <p className="text-xs text-slate-500 font-medium">fit</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
