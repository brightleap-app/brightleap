import { Link } from 'react-router-dom';
import ElizabethCharacter from './ElizabethCharacter.jsx';

export default function RegisterPrompt({ feature = 'this feature' }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6 max-w-md mx-auto">
      <ElizabethCharacter mood="waving" size={100} />

      <h1 className="text-2xl font-bold">Create a Free Account</h1>

      <p className="text-gray-600 leading-relaxed">
        You need a free account to access {feature}. It only takes a minute
        and your parent or guardian can set it up for you!
      </p>

      <div className="bg-green-50 rounded-xl p-4 text-sm text-green-800 text-left space-y-1">
        <p>With a free account you get:</p>
        <p>✓ All 8 habitats and animals</p>
        <p>✓ Diagnostic explorer quiz</p>
        <p>✓ Mock SATs spelling tests</p>
        <p>✓ Arcade mini-games</p>
        <p>✓ Progress saved across devices</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          to="/register"
          className="px-8 py-4 bg-green-600 text-white rounded-2xl text-lg font-semibold hover:bg-green-700 transition-colors min-h-[48px] text-center"
        >
          Create Free Account
        </Link>
        <Link
          to="/login"
          className="px-8 py-3 bg-gray-100 text-gray-600 rounded-2xl font-semibold hover:bg-gray-200 transition-colors min-h-[48px] text-center"
        >
          Already have an account? Log in
        </Link>
        <Link
          to="/"
          className="text-sm text-gray-600 hover:text-gray-800 transition-colors min-h-[48px] flex items-center justify-center"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
