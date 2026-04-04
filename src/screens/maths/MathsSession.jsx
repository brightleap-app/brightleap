import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { loadProgress, updateProgress } from '../../storage/progress.js';
import { findModuleById, findTopicById } from '../../data/maths/topics.js';
import { selectSessionQuestions, getTopicIntro, getCorrectFeedback, getIncorrectAcknowledgement } from '../../engine/mathsSession.js';
import { createDifficultyTracker } from '../../engine/adaptiveDifficulty.js';
import { validateAnswer } from '../../engine/mathsAnswerValidator.js';
import { calculateXP } from '../../engine/quiz.js';
import { useTheme } from '../../themes/ThemeContext.jsx';
import QuestionCard from '../../components/maths/QuestionCard.jsx';
import WorkedExample from '../../components/maths/WorkedExample.jsx';
import ProgressBar from '../../components/maths/ProgressBar.jsx';
import ElizabethHelper from '../../components/ElizabethHelper.jsx';

const PHASES = {
  INTRO: 'intro',
  QUESTION: 'question',
  CORRECT: 'correct',
  INCORRECT: 'incorrect',
  WORKED_EXAMPLE: 'worked_example',
  SUMMARY: 'summary',
};

export default function MathsSession() {
  const { moduleId, topicId } = useParams();
  const navigate = useNavigate();
  const progress = loadProgress();
  const mathsProgress = progress.mathsProgress || {};

  const { mathsHabitats } = useTheme();
  const mod = findModuleById(moduleId);
  const topic = findTopicById(moduleId, topicId);
  const themedHabitat = mathsHabitats[topicId];

  // Session state
  const [phase, setPhase] = useState(PHASES.INTRO);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [sessionXP, setSessionXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [elizabethMsg, setElizabethMsg] = useState(null);
  const [difficultyTracker] = useState(() => {
    const topicProgress = mathsProgress[moduleId]?.[topicId];
    const startDiff = topicProgress?.difficultyReached || 1;
    return createDifficultyTracker(startDiff);
  });

  // Load questions on mount
  useEffect(() => {
    const topicProgress = mathsProgress[moduleId]?.[topicId];
    const startDiff = topicProgress?.difficultyReached || 1;
    const qs = selectSessionQuestions(topicId, startDiff, 10);
    setQuestions(qs);
  }, [moduleId, topicId]);

  const currentQuestion = questions[questionIndex];
  const intro = getTopicIntro(topicId);

  const handleStartSession = () => {
    setPhase(PHASES.QUESTION);
  };

  const handleAnswer = useCallback((answer) => {
    if (!currentQuestion) return;

    const isCorrect = validateAnswer(currentQuestion, answer);

    if (isCorrect) {
      const feedback = getCorrectFeedback();
      setFeedbackMsg(feedback);
      setResults((prev) => [...prev, 'correct']);

      // XP
      const xp = calculateXP(true);
      setSessionXP((prev) => prev + xp);

      // Streak
      setStreak((prev) => {
        const newStreak = prev + 1;
        setBestStreak((best) => Math.max(best, newStreak));

        // Elizabeth streak celebrations
        if (newStreak === 5) {
          setElizabethMsg({ mood: 'excited', message: "Five in a row! You're on fire! 🔥" });
        } else if (newStreak === 10) {
          setElizabethMsg({ mood: 'excited', message: "TEN in a row?! You're absolutely smashing it! ⭐" });
        }

        return newStreak;
      });

      // Difficulty adjustment
      difficultyTracker.onCorrect();

      setPhase(PHASES.CORRECT);
    } else {
      const ack = getIncorrectAcknowledgement();
      setFeedbackMsg({ text: ack });
      setResults((prev) => [...prev, 'wrong']);
      setStreak(0);
      difficultyTracker.onIncorrect();
      setPhase(PHASES.INCORRECT);
    }
  }, [currentQuestion, difficultyTracker]);

  const handleNext = useCallback(() => {
    if (questionIndex + 1 >= questions.length) {
      // Session complete — save progress
      const totalCorrect = results.filter((r) => r === 'correct').length + (phase === PHASES.CORRECT ? 0 : 0);
      const accuracy = questions.length > 0 ? totalCorrect / questions.length : 0;

      const updatedMathsProgress = { ...mathsProgress };
      if (!updatedMathsProgress[moduleId]) updatedMathsProgress[moduleId] = {};
      const existing = updatedMathsProgress[moduleId][topicId] || {};

      const totalAttempted = (existing.questionsAttempted || 0) + questions.length;
      const weightedAccuracy = totalAttempted > 0
        ? ((existing.accuracy || 0) * (existing.questionsAttempted || 0) + accuracy * questions.length) / totalAttempted
        : accuracy;

      let status = 'in_progress';
      if (weightedAccuracy >= 0.85 && totalAttempted >= 10) status = 'mastered';
      else if (weightedAccuracy >= 0.6) status = 'practising';

      updatedMathsProgress[moduleId][topicId] = {
        status,
        accuracy: Math.round(weightedAccuracy * 100) / 100,
        questionsAttempted: totalAttempted,
        lastPractised: new Date().toISOString().split('T')[0],
        difficultyReached: difficultyTracker.difficulty,
        streak: bestStreak,
      };

      // Check if topic was just mastered — unlock animal
      const wasMastered = existing.status === 'mastered';
      const nowMastered = status === 'mastered';
      const justMastered = nowMastered && !wasMastered;

      const currentProgress = loadProgress();
      const unlockedMathsAnimals = currentProgress.unlockedMathsAnimals || [];
      if (justMastered && !unlockedMathsAnimals.includes(topicId)) {
        unlockedMathsAnimals.push(topicId);
      }

      updateProgress({
        mathsProgress: updatedMathsProgress,
        unlockedMathsAnimals,
        xp: progress.xp + sessionXP,
      });

      if (justMastered && themedHabitat?.reward) {
        // Navigate to reveal screen
        navigate(`/maths/reveal/${topicId}`);
        return;
      }

      setPhase(PHASES.SUMMARY);
    } else {
      setQuestionIndex((prev) => prev + 1);
      setFeedbackMsg(null);
      setPhase(PHASES.QUESTION);
    }
  }, [questionIndex, questions, results, phase, moduleId, topicId, mathsProgress, difficultyTracker, bestStreak, sessionXP, progress.xp]);

  const handleWorkedExampleComplete = () => {
    handleNext();
  };

  if (!mod || !topic) {
    return (
      <main className="min-h-screen p-6 max-w-lg mx-auto">
        <Link to="/" className="text-green-700 font-semibold min-h-[48px] inline-flex items-center">← Back</Link>
        <p className="text-center text-gray-500 mt-8">Topic not found.</p>
      </main>
    );
  }

  // INTRO phase
  if (phase === PHASES.INTRO && intro) {
    return (
      <main className="min-h-screen p-6 max-w-lg mx-auto flex flex-col items-center">
        <div className="flex items-center justify-between mb-6 w-full">
          <Link to="/maths" className="text-green-700 font-semibold min-h-[48px] inline-flex items-center">← Back</Link>
          <h1 className="text-xl font-bold">{mod.emoji} {topic.name}</h1>
          <div className="w-12" />
        </div>

        <div className="bg-blue-50 rounded-2xl p-6 w-full max-w-sm text-center mb-6">
          <h2 className="text-2xl font-bold mb-3" style={{ color: mod.colour }}>{intro.title}</h2>
          <p className="text-base mb-4 leading-relaxed">{intro.explanation}</p>
          <div className="bg-white rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-gray-500 font-semibold mb-1">For example:</p>
            <p className="text-base">{intro.example}</p>
          </div>
        </div>

        <button
          onClick={handleStartSession}
          className="px-8 py-4 bg-green-600 text-white rounded-2xl text-xl font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
        >
          Let's go!
        </button>
      </main>
    );
  }

  // SUMMARY phase
  if (phase === PHASES.SUMMARY) {
    const totalCorrect = results.filter((r) => r === 'correct').length;
    const accuracy = questions.length > 0 ? Math.round((totalCorrect / questions.length) * 100) : 0;

    return (
      <main className="min-h-screen p-6 max-w-lg mx-auto flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold mt-4">Session Complete!</h1>

        <div className="bg-green-50 rounded-2xl p-6 w-full max-w-sm text-center">
          <p className="text-4xl mb-2">🎉</p>
          <p className="text-xl font-bold text-green-700 mb-4">Great work!</p>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-2xl font-bold" style={{ color: mod.colour }}>{totalCorrect}/{questions.length}</p>
              <p className="text-xs text-gray-500">Correct</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{accuracy}%</p>
              <p className="text-xs text-gray-500">Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">+{sessionXP}</p>
              <p className="text-xs text-gray-500">XP earned</p>
            </div>
          </div>

          {bestStreak > 2 && (
            <p className="text-sm text-amber-600 font-semibold">🔥 Best streak: {bestStreak} in a row</p>
          )}
        </div>

        {/* Progress dots recap */}
        <ProgressBar total={questions.length} current={questions.length} results={results} />

        <div className="flex flex-col gap-3 w-full max-w-sm mt-4">
          <button
            onClick={() => {
              setPhase(PHASES.INTRO);
              setQuestionIndex(0);
              setResults([]);
              setSessionXP(0);
              setStreak(0);
              setBestStreak(0);
              const newQs = selectSessionQuestions(topicId, difficultyTracker.difficulty, 10);
              setQuestions(newQs);
            }}
            className="px-8 py-4 bg-green-600 text-white rounded-2xl text-xl font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
          >
            Practice Again
          </button>
          <Link
            to="/maths"
            className="px-8 py-3 bg-gray-100 text-gray-600 rounded-2xl font-semibold hover:bg-gray-200 transition-colors min-h-[48px] text-center"
          >
            Back to {mod.name}
          </Link>
          <Link
            to="/"
            className="px-8 py-3 bg-gray-50 text-gray-500 rounded-2xl font-semibold hover:bg-gray-100 transition-colors min-h-[48px] text-center"
          >
            Home
          </Link>
        </div>
      </main>
    );
  }

  // QUESTION / CORRECT / INCORRECT / WORKED_EXAMPLE phases
  return (
    <main className="min-h-screen p-6 max-w-lg mx-auto flex flex-col items-center">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 w-full">
        <Link to="/maths" className="text-green-700 font-semibold min-h-[48px] inline-flex items-center">← Back</Link>
        <p className="text-sm text-gray-500 font-semibold">{topic.name}</p>
        <p className="text-sm text-amber-600 font-semibold">⭐ +{sessionXP}</p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <ProgressBar total={questions.length} current={questionIndex} results={results} />
      </div>

      {/* Question */}
      {phase === PHASES.QUESTION && currentQuestion && (
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          onAnswer={handleAnswer}
        />
      )}

      {/* Correct feedback */}
      {phase === PHASES.CORRECT && feedbackMsg && (
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="bg-green-50 rounded-2xl p-6 text-center w-full max-w-sm">
            <p className="text-4xl mb-2">{feedbackMsg.emoji}</p>
            <p className="text-xl font-bold text-green-700">{feedbackMsg.text}</p>
            {streak > 1 && (
              <p className="text-sm text-amber-600 mt-2">🔥 {streak} in a row!</p>
            )}
          </div>
          <button
            onClick={handleNext}
            className="px-8 py-4 bg-green-600 text-white rounded-2xl text-xl font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
          >
            Next
          </button>
        </div>
      )}

      {/* Incorrect feedback — show acknowledgement then worked example */}
      {phase === PHASES.INCORRECT && feedbackMsg && (
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="bg-amber-50 rounded-2xl p-6 text-center w-full max-w-sm">
            <p className="text-base text-amber-800 font-semibold">{feedbackMsg.text}</p>
          </div>
          {currentQuestion?.worked_solution_steps ? (
            <WorkedExample
              steps={currentQuestion.worked_solution_steps}
              analogy={currentQuestion.analogy}
              onComplete={handleWorkedExampleComplete}
            />
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-4 bg-blue-100 text-blue-800 rounded-2xl font-semibold hover:bg-blue-200 transition-colors min-h-[48px]"
            >
              Next question
            </button>
          )}
        </div>
      )}

      {/* Elizabeth helper */}
      {elizabethMsg && (
        <ElizabethHelper
          mood={elizabethMsg.mood}
          message={elizabethMsg.message}
          onDismiss={() => setElizabethMsg(null)}
        />
      )}
    </main>
  );
}
