import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">About Resume AI</h1>
      <p className="text-slate-600 leading-relaxed mb-4">
        Resume AI helps you optimize your resume for applicant tracking systems (ATS) and job descriptions.
        Upload a PDF or DOCX resume to get an ATS score, keyword match, and missing-skills analysis.
      </p>
      <p className="text-slate-600 leading-relaxed mb-4">
        When you paste a target job description, we compare your resume to the job and highlight
        skills the job wants that your resume is missing. Create an account to save your analyses
        and access them anytime from your dashboard.
      </p>
      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-2">Features</h2>
      <ul className="list-disc list-inside text-slate-600 space-y-2 mb-6">
        <li>PDF and DOCX resume parsing</li>
        <li>ATS-friendly score (0–100) with breakdown</li>
        <li>Keyword and skill extraction</li>
        <li>Target job comparison (missing-for-job skills)</li>
        <li>Company fit prediction</li>
        <li>Downloadable HTML report</li>
        <li>Resume history when signed in</li>
      </ul>
      <Link to="/" className="text-blue-600 font-medium hover:underline">Back to Home</Link>
    </div>
  );
}
