import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <section className="text-center max-w-3xl mx-auto py-12 sm:py-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-5">
          Analyze Your Resume with AI.{' '}
          <span className="text-blue-600">Get Hired Faster.</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-10">
          Upload your resume and get an ATS score, skill match, and actionable insights in under 60 seconds.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Upload Resume
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            to="/results"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-slate-700 font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
          >
            View Sample Report
          </Link>
        </div>
      </section>
      <section className="grid sm:grid-cols-3 gap-6 mt-16">
        {[
          { title: 'ATS Compatibility', desc: 'See how well your resume passes applicant tracking systems.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
          { title: 'Skill Gap Analysis', desc: 'Compare your skills to job descriptions and see what\'s missing.', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' },
          { title: 'Keyword Optimization', desc: 'Get suggestions to improve keyword match for your target role.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
        ].map(({ title, desc, icon }) => (
          <div
            key={title}
            className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
