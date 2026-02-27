import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { uploadResume } from '../utils/api';

const ACCEPT = '.pdf,.docx';
const ACCEPT_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function isValidType(file) {
  return ACCEPT_TYPES.includes(file.type);
}

export default function UploadPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const clear = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    const f = e.dataTransfer.files[0];
    if (!f) return;
    if (!isValidType(f)) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }
    setFile(f);
    setResult(null);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e) => {
    setError(null);
    const f = e.target.files?.[0];
    if (!f) return;
    if (!isValidType(f)) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }
    setFile(f);
    setResult(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    setResult(null);
    try {
      const data = await uploadResume(file, {
        jobDescription: jobDescription.trim(),
        token: token || undefined,
      });
      if (data.resumeId) {
        navigate(`/results/${data.resumeId}`, { replace: true });
        return;
      }
      setResult(data);
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  }, [file]);

  const removeFile = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
  }, []);

  const skillMatchPct = result?.matchedSkills?.length
    ? Math.min(100, Math.round((result.matchedSkills.length / 15) * 100))
    : 0;
  const readability = result?.score >= 70 ? 'High' : result?.score >= 40 ? 'Medium' : 'Low';

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Optimize your Resume for ATS
        </h1>
        <p className="text-slate-600">
          Upload your resume and optionally paste a job description. We'll analyze compatibility and suggest improvements.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Upload card */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative rounded-xl border-2 border-dashed p-8 bg-white border-slate-200 shadow-sm transition-all duration-300
            ${isDragging ? 'border-blue-400 bg-blue-50/50' : 'hover:border-slate-300'}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT}
            onChange={handleFileInput}
            className="sr-only"
            aria-label="Choose file"
          />
          <div
            className="flex flex-col items-center justify-center min-h-[200px] cursor-pointer"
            onClick={() => !file && fileInputRef.current?.click()}
          >
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            {!file ? (
              <>
                <p className="font-semibold text-slate-800 mb-1">Drag & Drop your file here</p>
                <button
                  type="button"
                  className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  Select File
                </button>
              </>
            ) : (
              <>
                <p className="font-semibold text-slate-800 truncate max-w-full">{file.name}</p>
                <p className="text-sm text-slate-500 mt-1">{formatBytes(file.size)}</p>
              </>
            )}
          </div>
        </div>

        {/* Target job card */}
        <div className="rounded-xl border border-slate-200 p-8 bg-white shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-2">Target Job (optional)</h3>
          <p className="text-sm text-slate-500 mb-4">Paste a job description to compare skills and improve match.</p>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description here..."
            className="w-full h-[180px] rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 placeholder-slate-400 resize-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={!file || isUploading}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isUploading ? 'Analyzing…' : 'Analyze Resume'}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
        {file && (
          <button
            type="button"
            onClick={removeFile}
            disabled={isUploading}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium"
          >
            Remove file
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm animate-fade-in">
          {error}
        </div>
      )}

      {/* Analysis Results - ResumeIQ style */}
      {result && (
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden animate-scale-in">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Analysis Results</h2>
          </div>
          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Score meter + metrics */}
              <div className="flex flex-col items-center lg:items-start shrink-0">
                <div className="relative inline-flex flex-col items-center">
                  <svg width={160} height={160} className="transform -rotate-90">
                    <circle cx={80} cy={80} r={70} fill="none" stroke="#e2e8f0" strokeWidth={12} />
                    <circle
                      cx={80}
                      cy={80}
                      r={70}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth={12}
                      strokeDasharray={2 * Math.PI * 70}
                      strokeDashoffset={2 * Math.PI * 70 * (1 - result.score / 100)}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900">{result.score}</span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ATS Score</span>
                  </div>
                </div>
                <div className="mt-6 space-y-2 w-full max-w-[200px]">
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

              {/* Right: Keywords + progress */}
              <div className="flex-1 min-w-0 space-y-6">
                {result.matchedSkills?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3">Keywords Found</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.matchedSkills.map((skill) => (
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
                {result.scoringBreakdown && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3">Score Breakdown</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'core', label: 'Skill Assessment', color: 'bg-blue-500' },
                        { key: 'tools', label: 'Tools & Experience', color: 'bg-emerald-500' },
                        { key: 'soft', label: 'Soft Skills', color: 'bg-amber-500' },
                      ].map(({ key, label, color }) => {
                        const data = result.scoringBreakdown[key];
                        if (!data) return null;
                        const max = data.maxPoints || 1;
                        const pct = Math.round((data.points / max) * 100);
                        return (
                          <div key={key}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-slate-700">{label}</span>
                              <span className="text-slate-500">{pct}%</span>
                            </div>
                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${color} rounded-full transition-all duration-700`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => navigate('/results', { state: { result } })}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Full Dashboard
              </button>
              <button
                type="button"
                onClick={clear}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium"
              >
                Edit Resume / Re-upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
