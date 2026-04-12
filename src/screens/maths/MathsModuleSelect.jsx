import { useParams, Link } from 'react-router-dom';
import { loadProgress } from '../../storage/progress.js';
import { getMathsTrailById } from '../../data/maths/topics.js';
import { ElizabethHelpButton } from '../../components/ElizabethHelper.jsx';

export default function MathsModuleSelect() {
  const { trailId } = useParams();
  const progress = loadProgress();
  const mathsProgress = progress.mathsProgress || {};

  const trail = getMathsTrailById(trailId);

  if (!trail) {
    return (
      <main className="min-h-screen p-6 max-w-lg mx-auto">
        <Link to="/maths" className="text-green-700 font-semibold min-h-[48px] inline-flex items-center">← Back</Link>
        <p className="text-center text-gray-600 mt-8">Trail not found.</p>
      </main>
    );
  }

  function getModuleStatus(mod) {
    if (mod.comingSoon) return 'coming_soon';
    const topicStatuses = mod.topics.map((t) => {
      const tp = mathsProgress[mod.id]?.[t.id];
      return tp?.status || 'not_started';
    });
    if (topicStatuses.every((s) => s === 'mastered')) return 'mastered';
    if (topicStatuses.some((s) => s !== 'not_started')) return 'in_progress';
    return 'not_started';
  }

  function getModuleProgress(mod) {
    if (mod.comingSoon || mod.topics.length === 0) return 0;
    const mastered = mod.topics.filter((t) => {
      const tp = mathsProgress[mod.id]?.[t.id];
      return tp?.status === 'mastered';
    }).length;
    return Math.round((mastered / mod.topics.length) * 100);
  }

  const statusBadge = {
    not_started: { label: 'New', bg: 'bg-gray-100', text: 'text-gray-600' },
    in_progress: { label: 'In Progress', bg: 'bg-blue-100', text: 'text-blue-700' },
    mastered: { label: 'Mastered!', bg: 'bg-green-100', text: 'text-green-700' },
    coming_soon: { label: 'Coming Soon', bg: 'bg-gray-100', text: 'text-gray-600' },
  };

  return (
    <main className="min-h-screen p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link to="/maths" className="text-green-700 font-semibold min-h-[48px] inline-flex items-center">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">{trail.emoji} {trail.name}</h1>
        <div className="w-12" />
      </div>

      <p className="text-gray-600 text-center mb-6">{trail.description}</p>

      <div className="flex flex-col gap-3">
        {trail.modules.map((mod) => {
          const status = getModuleStatus(mod);
          const badge = statusBadge[status];
          const pct = getModuleProgress(mod);
          const isLocked = mod.comingSoon;

          const card = (
            <div
              className={`rounded-2xl p-5 border-2 transition-all ${
                isLocked
                  ? 'border-gray-200 opacity-60'
                  : 'border-gray-200 hover:border-green-400 hover:shadow-md cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{mod.emoji}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badge.bg} ${badge.text}`}>
                  {badge.label}
                </span>
              </div>
              <h3 className="text-lg font-bold" style={{ color: isLocked ? '#9ca3af' : mod.colour }}>
                {mod.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{mod.description}</p>
              {!isLocked && mod.topics.length > 0 && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: mod.colour }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{pct}% complete</p>
                </div>
              )}
              {isLocked && (
                <p className="text-xs text-gray-600 mt-2">🔒 Coming soon</p>
              )}
            </div>
          );

          if (isLocked) return <div key={mod.id}>{card}</div>;

          return (
            <Link key={mod.id} to={`/maths/trail/${trailId}/topic/${mod.id}`} className="block">
              {card}
            </Link>
          );
        })}
      </div>

      <ElizabethHelpButton screenKey="mathsDashboard" />
    </main>
  );
}
