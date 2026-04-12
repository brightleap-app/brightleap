import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadProgress, updateProgress } from '../../storage/progress.js';
import { validateAnswer } from '../../engine/mathsAnswerValidator.js';
import diagnosticData from '../../data/maths/diagnostic.json';
import QuestionCard from '../../components/maths/QuestionCard.jsx';
import ProgressBar from '../../components/maths/ProgressBar.jsx';
import ElizabethHelper from '../../components/ElizabethHelper.jsx';

const PHASES = {
  INTRO: 'intro',
  QUESTION: 'question',
  TRANSITION: 'transition',
  RESULTS: 'results',
};

export default function MathsDiagnostic() {
  const navigate = useNavigate();
  const progress = loadProgress();

  const [phase, setPhase] = useState(PHASES.INTRO);
  const [roundIndex, setRoundIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [roundResults, setRoundResults] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [placement, setPlacement] = useState(null);
  const [elizabethMsg, setElizabethMsg] = useState(null);

  // Determine which rounds to show based on adaptive logic
  const getRounds = useCallback(() => {
    const rounds = [diagnosticData.rounds[0]]; // Round 1 always

    // Round 2 — adaptive based on Round 1 results
    const round1Correct = roundResults.length >= 1 ? roundResults[0] : 0;
    if (round1Correct >= 2) {
      // High path
      rounds.push(diagnosticData.rounds[1]); // Round 2A (harder)
    } else {
      // Low path
      rounds.push(diagnosticData.rounds[2]); // Round 2B (easier)
    }

    // Round 3 always (decimals/percentages awareness)
    rounds.push(diagnosticData.rounds[3]);

    return rounds;
  }, [roundResults]);

  const getCurrentRound = useCallback(() => {
    const rounds = getRounds();
    return rounds[roundIndex] || null;
  }, [getRounds, roundIndex]);

  const getCurrentQuestion = useCallback(() => {
    const round = getCurrentRound();
    if (!round) return null;
    return round.questions[questionIndex] || null;
  }, [getCurrentRound, questionIndex]);

  const totalAllQuestions = useCallback(() => {
    const rounds = getRounds();
    return rounds.reduce((sum, r) => sum + r.questions.length, 0);
  }, [getRounds]);

  const handleStart = () => {
    setPhase(PHASES.QUESTION);
    setTotalQuestions(totalAllQuestions());
  };

  const handleAnswer = useCallback((answer) => {
    const question = getCurrentQuestion();
    if (!question) return;

    const isCorrect = validateAnswer(question, answer);
    setAllResults((prev) => [...prev, isCorrect ? 'correct' : 'wrong']);

    // Move to next question in round
    const round = getCurrentRound();
    const nextQIndex = questionIndex + 1;

    if (nextQIndex < round.questions.length) {
      // More questions in this round
      setQuestionIndex(nextQIndex);
    } else {
      // Round complete — count correct for this round
      const roundCorrectSoFar = allResults
        .slice(allResults.length - questionIndex)
        .filter((r) => r === 'correct').length + (isCorrect ? 1 : 0);

      setRoundResults((prev) => [...prev, roundCorrectSoFar]);
      setQuestionIndex(0);

      const nextRound = roundIndex + 1;
      const totalRounds = getRounds().length;

      if (nextRound < totalRounds) {
        setRoundIndex(nextRound);
        setPhase(PHASES.TRANSITION);
      } else {
        // All rounds done — calculate placement
        const totalCorrect = [...allResults, isCorrect ? 'correct' : 'wrong']
          .filter((r) => r === 'correct').length;
        const total = [...allResults, 'x'].length;

        let placementKey;
        if (totalCorrect >= total * 0.7) {
          placementKey = 'strong';
        } else if (totalCorrect >= total * 0.4) {
          placementKey = 'medium';
        } else {
          placementKey = 'beginning';
        }

        const p = diagnosticData.placement_rules[placementKey];
        setPlacement(p);

        // Save diagnostic results
        updateProgress({
          mathsDiagnosticResults: {
            dateTaken: new Date().toISOString().split('T')[0],
            totalCorrect,
            totalQuestions: total,
            placement: placementKey,
            startTopic: p.startTopic,
            startDifficulty: p.startDifficulty,
          },
        });

        setPhase(PHASES.RESULTS);
      }
    }
  }, [getCurrentQuestion, getCurrentRound, questionIndex, allResults, roundIndex, getRounds]);

  const handleContinueToNextRound = () => {
    setPhase(PHASES.QUESTION);
    setTotalQuestions(totalAllQuestions());
  };

  // INTRO
  if (phase === PHASES.INTRO) {
    return (
      <main className="min-h-screen p-6 max-w-lg mx-auto flex flex-col items-center gap-6">
        <div className="flex items-center justify-between mb-4 w-full">
          <Link to="/" className="text-green-700 font-semibold min-h-[48px] inline-flex items-center">← Back</Link>
          <h1 className="text-2xl font-bold">🧮 Maths Explorer Quiz</h1>
          <div className="w-12" />
        </div>

        <div className="bg-blue-50 rounded-2xl p-6 text-center max-w-sm">
          <p className="text-4xl mb-3">🧮</p>
          <h2 className="text-xl font-bold text-blue-800 mb-3">Let's see what you know!</h2>
          <p className="text-base text-gray-700 mb-4 leading-relaxed">
            I'm going to ask you a few quick maths questions. Don't worry about getting them all right —
            this just helps me know where to start!
          </p>
          <p className="text-sm text-gray-600">Takes about 3 minutes</p>
        </div>

        <button
          onClick={handleStart}
          className="px-8 py-4 bg-green-600 text-white rounded-2xl text-xl font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
        >
          Let's go!
        </button>
      </main>
    );
  }

  // TRANSITION between rounds
  if (phase === PHASES.TRANSITION) {
    return (
      <main className="min-h-screen p-6 max-w-lg mx-auto flex flex-col items-center gap-6 justify-center">
        <div className="bg-green-50 rounded-2xl p-6 text-center max-w-sm">
          <p className="text-4xl mb-3">👍</p>
          <p className="text-lg font-bold text-green-700 mb-2">Nice work!</p>
          <p className="text-base text-gray-600">Just a few more questions to go...</p>
        </div>
        <button
          onClick={handleContinueToNextRound}
          className="px-8 py-4 bg-green-600 text-white rounded-2xl text-xl font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
        >
          Continue
        </button>
      </main>
    );
  }

  // RESULTS
  if (phase === PHASES.RESULTS && placement) {
    return (
      <main className="min-h-screen p-6 max-w-lg mx-auto flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold mt-4">All done!</h1>

        <div className="bg-green-50 rounded-2xl p-6 text-center max-w-sm">
          <p className="text-4xl mb-3">🌟</p>
          <p className="text-lg font-semibold text-green-700 mb-4 leading-relaxed">
            {placement.message}
          </p>
        </div>

        <ProgressBar total={allResults.length} current={allResults.length} results={allResults} />

        <div className="flex flex-col gap-3 w-full max-w-sm mt-4">
          <button
            onClick={() => navigate(`/maths/session/${placement.startModule}/${placement.startTopic}`)}
            className="px-8 py-4 bg-green-600 text-white rounded-2xl text-xl font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
          >
            Start Learning!
          </button>
          <Link
            to="/"
            className="px-8 py-3 bg-gray-100 text-gray-600 rounded-2xl font-semibold hover:bg-gray-200 transition-colors min-h-[48px] text-center"
          >
            Back to Home
          </Link>
        </div>

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

  // QUESTION phase
  const currentQuestion = getCurrentQuestion();

  if (!currentQuestion) {
    return (
      <main className="min-h-screen p-6 max-w-lg mx-auto">
        <Link to="/" className="text-green-700 font-semibold min-h-[48px] inline-flex items-center">← Back</Link>
        <p className="text-center text-gray-600 mt-8">Something went wrong. Please try again.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 max-w-lg mx-auto flex flex-col items-center">
      <div className="flex items-center justify-between mb-4 w-full">
        <Link to="/" className="text-green-700 font-semibold min-h-[48px] inline-flex items-center">← Back</Link>
        <p className="text-sm text-gray-600 font-semibold">Explorer Quiz</p>
        <div className="w-12" />
      </div>

      <div className="mb-6">
        <ProgressBar total={totalQuestions || 8} current={allResults.length} results={allResults} />
      </div>

      <QuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
        onAnswer={handleAnswer}
      />
    </main>
  );
}
