import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [childName, setChildName] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!consent) {
      setError('Please agree to the data collection statement to continue.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    const { error: regError } = await register(email, password, childName.trim());
    setSubmitting(false);

    if (regError) {
      const msg = regError.message.toLowerCase();
      if (msg.includes('already registered') || msg.includes('already been registered') || msg.includes('duplicate') || msg.includes('already exists')) {
        setError('This email is already registered. Try logging in instead, or reset your password from the login page.');
      } else {
        setError(regError.message);
      }
      return;
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6">
        <div className="text-5xl">🎉</div>
        <h1 className="text-2xl font-bold">Account Created!</h1>
        <p className="text-gray-600 max-w-sm">
          Check your email to confirm your account, then you can log in and start exploring.
        </p>
        <Link
          to="/login"
          className="px-8 py-4 bg-green-600 text-white rounded-2xl text-lg font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
        >
          Go to Login
        </Link>
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
        <h1 className="text-2xl font-bold">Create Account</h1>
        <div className="w-12" />
      </div>

      <p className="text-gray-600 mb-6">
        Parents: create an account so your child's progress syncs across devices and unlocks premium features.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Parent email */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="email">
            Your email (parent/guardian)
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-[#F2EEE1] border-2 border-transparent rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="parent@example.com"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-[#F2EEE1] border-2 border-transparent rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="At least 6 characters"
            minLength={6}
          />
        </div>

        {/* Child's name */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="childName">
            Child's first name or nickname
          </label>
          <input
            id="childName"
            type="text"
            required
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            className="w-full p-3 bg-[#F2EEE1] border-2 border-transparent rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="e.g. Alex"
          />
          <p className="text-xs text-gray-600 mt-1">
            This is the name shown to your child in the app. No surname needed.
          </p>
        </div>

        {/* Parental consent */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-sm mb-2">Data Collection Statement</h3>
          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            Brightleap collects the minimum data needed to provide this service. We store:
          </p>
          <ul className="text-xs text-gray-600 list-disc ml-4 mb-3 space-y-1">
            <li>Your email address (for account access and password recovery)</li>
            <li>Your child's first name or nickname (shown in the app only to them)</li>
            <li>Spelling practice progress (words attempted, scores, and learning data)</li>
          </ul>
          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            We do <strong>not</strong> collect your child's date of birth, surname, school name,
            location, or any other personal information. We do not share data with third parties
            or use it for advertising. You can delete all data at any time from the Settings page.
          </p>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm">
              I am the parent or guardian and I consent to the data described above being collected
              for my child's use of Brightleap.
            </span>
          </label>
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-600 transition-colors min-h-[48px]"
        >
          {submitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-green-700 font-semibold">
          Log in
        </Link>
      </p>
    </main>
  );
}
