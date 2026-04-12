import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { migrateGuestProgress } from '../storage/progress.js';

export default function Login() {
  const { loginWithEmail, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const { error: loginError } = await loginWithEmail(email, password);
    setSubmitting(false);

    if (loginError) {
      setError('Incorrect email or password. Please try again, or reset your password below.');
    } else {
      await migrateGuestProgress();
      navigate('/');
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address first.');
      return;
    }

    setSubmitting(true);
    const { error: resetError } = await resetPassword(email);
    setSubmitting(false);

    if (resetError) {
      setError(resetError.message);
    } else {
      setResetSent(true);
    }
  };

  if (resetSent) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6">
        <div className="text-5xl">📧</div>
        <h1 className="text-2xl font-bold">Check Your Email</h1>
        <p className="text-gray-600 max-w-sm">
          We've sent a password reset link to <strong>{email}</strong>.
          Click the link in the email to set a new password.
        </p>
        <button
          onClick={() => { setResetMode(false); setResetSent(false); }}
          className="px-8 py-4 bg-green-600 text-white rounded-2xl text-lg font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
        >
          Back to Login
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/"
          className="text-green-700 font-semibold min-h-[48px] min-w-[48px] flex items-center"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">{resetMode ? 'Reset Password' : 'Log In'}</h1>
        <div className="w-12" />
      </div>

      {!resetMode && (
        <div className="p-4 bg-green-50 rounded-xl mb-6">
          <p className="text-sm text-green-800">
            <strong>Explorers:</strong> ask your parent or guardian to help you log in!
          </p>
        </div>
      )}

      {resetMode ? (
        <form onSubmit={handleReset} className="space-y-5">
          <p className="text-gray-600 text-sm">
            Enter your email and we'll send you a link to reset your password.
          </p>

          <div>
            <label className="block font-semibold mb-1" htmlFor="reset-email">
              Email
            </label>
            <input
              id="reset-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
              placeholder="parent@example.com"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-600 transition-colors min-h-[48px]"
          >
            {submitting ? 'Sending...' : 'Send Reset Link'}
          </button>

          <button
            type="button"
            onClick={() => { setResetMode(false); setError(''); }}
            className="w-full py-3 text-gray-600 font-semibold hover:text-gray-800 transition-colors min-h-[48px]"
          >
            Back to login
          </button>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
              placeholder="parent@example.com"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-600 transition-colors min-h-[48px]"
          >
            {submitting ? 'Logging in...' : 'Start Exploring! 🌍'}
          </button>

          <button
            type="button"
            onClick={() => { setResetMode(true); setError(''); }}
            className="w-full py-2 text-sm text-gray-600 hover:text-green-700 transition-colors min-h-[48px]"
          >
            Forgotten your password?
          </button>
        </form>
      )}

      <div className="mt-6 text-center space-y-3">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-700 font-semibold">
            Create one
          </Link>
        </p>
        <p className="text-sm text-gray-600">
          Or{' '}
          <Link to="/habitats" className="text-gray-600 font-semibold">
            continue as guest
          </Link>
          {' '}— no account needed
        </p>
      </div>
    </main>
  );
}
