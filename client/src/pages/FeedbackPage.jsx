import { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitFeedback } from '../utils/api';

export default function FeedbackPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await submitFeedback({ name, email, message });
      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err.message || 'Failed to send');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto text-center py-12 animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Thank you</h1>
        <p className="text-slate-600 mb-6">Your feedback has been submitted.</p>
        <Link to="/" className="text-blue-600 font-medium hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Feedback</h1>
      <p className="text-slate-600 mb-6">Send us your suggestions or report an issue.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name (optional)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email (optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white resize-none"
            placeholder="Your feedback..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Send feedback'}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-500">
        <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </p>
    </div>
  );
}
