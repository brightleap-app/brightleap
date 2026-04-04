import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { loadProgress, saveProgress } from '../../storage/progress.js';
import { validateAnswer } from '../../engine/mathsAnswerValidator.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import RegisterPrompt from '../../components/RegisterPrompt.jsx';
import QuestionCard from '../../components/maths/QuestionCard.jsx';
import FractionDisplay from '../../components/maths/FractionDisplay.jsx';
import ProgressBar from '../../components/maths/ProgressBar.jsx';

import arithmeticQuestions from '../../data/maths/mock_sats_arithmetic.json';
import reasoningQuestions from '../../data/maths/mock_sats_reasoning.json';

const STATES = {
  INTRO: 'intro',
  PAPER_INTRO: 'paper_intro',
  QUESTION: 'question',
  PAUSED: 'paused',
  PAPER_COMPLETE: 'paper_complete',
  RESULTS: 'results',
};

const PAPERS = [
  { id: 'arithmetic', name: 'Paper 1: Arithmetic', emoji: '🔢', questions: arithmeticQuestions, timeLimit: 30 * 60, description: 'Pure calculations — no word problems. Work quickly and carefully.' },
  { id: 'reasoning', name: 'Paper 2: Reasoning', emoji: '🧩', questions: reasoningQuestions, timeLimit: 40 * 60, description: 'Word problems and puzzles. Read each question carefully.' },
];

const SCORE_BRACKETS = [
  { min: 45, label: 'SATs Superstar!', emoji: '⭐' },
  { min: 35, label: 'Maths Master!', emoji: '🌟' },
  { min: 25, label: 'Getting Stronger!', emoji: '💪' },
  { min: 0, label: 'Keep Practising!', emoji: '🌱' },
];

function getBracket(score) {
  return SCORE_BRACKETS.find((b) => score >= b.min);
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MathsMockSATs() {
  const { isLoggedIn } = useAuth();
  const startTimeRef = useRef(null);
  const hasSavedRef = useRef(false);

  const [state, setState] = useState(STATES.INTRO);
  const [paperIndex, setPaperIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [results, setResults] = useState([]); // { paperId, questionId, correct, marks, userAnswer }
  const [elapsed, setElapsed] = useState(0);
  const [paperElapsed, setPaperElapsed] = useState(0);

  const currentPaper = PAPERS[paperIndex];
  const currentQuestion = currentPaper?.questions[questionIndex];
  const totalQuestions = PAPERS.reduce((s, p) => s + p.questions.length, 0);
  const questionsAnsweredSoFar = results.length;

  // Timer
  useEffect(() => {
    if (state === STATES.QUESTION) {
      if (!startTimeRef.current) startTimeRef.current = Date.now();
      const interval = setInterval(() => {
        const now = Date.now();
        setElapsed(Math.floor((now - startTimeRef.current) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state]);

  // Save results
  useEffect(() => {
    if (state === STATES.RESULTS && !hasSavedRef.current) {
      hasSavedRef.current = true;
      const totalMarks = results.reduce((s, r) => s + (r.correct ? r.marks : 0), 0);
      const maxMarks = results.reduce((s, r) => s + r.marks, 0);
      const progress = loadProgress();
      const mathsMockTests = progress.mathsMockTests || [];
      mathsMockTests.push({
        date: new Date().toISOString().slice(0, 10),
        score: totalMarks,
        total: maxMarks,
        elapsed,
        papers: PAPERS.map((p) => {
          const paperResults = results.filter((r) => r.paperId === p.id);
          return {
            paperId: p.id,
            score: paperResults.reduce((s, r) => s + (r.correct ? r.marks : 0), 0),
            total: paperResults.reduce((s, r) => s + r.marks, 0),
          };
        }),
      });
      saveProgress({ ...progress, mathsMockTests });
    }
  }, [state, results, elapsed]);

  if (!isLoggedIn) return <RegisterPrompt feature="Mock SATs Maths Test" />;

  const handleAnswer = (answer) => {
    if (!currentQuestion) return;

    const correct = validateAnswer(currentQuestion, answer);
    setResults((prev) => [...prev, {
      paperId: currentPaper.id,
      questionId: currentQuestion.id,
      correct,
      marks: currentQuestion.marks,
      userAnswer: answer,
      question: currentQuestion,
    }]);

    // Next question or end of paper
    const nextQ = questionIndex + 1;
    if (nextQ >= currentPaper.questions.length) {
      // Paper complete
      if (paperIndex + 1 < PAPERS.length) {
        setState(STATES.PAPER_COMPLETE);
      } else {
        setState(STATES.RESULTS);
      }
    } else {
      setQuestionIndex(nextQ);
    }
  };

  const handleNextPaper = () => {
    setPaperIndex((prev) => prev + 1);
    setQuestionIndex(0);
    setState(STATES.PAPER_INTRO);
  };

  const handleRetry = () => {
    setPaperIndex(0);
    setQuestionIndex(0);
    setResults([]);
    setElapsed(0);
    startTimeRef.current = null;
    hasSavedRef.current = false;
    setState(STATES.INTRO);
  };

  // INTRO
  if (state === STATES.INTRO) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6 max-w-md mx-auto">
        <div className="text-5xl">📝</div>
        <h1 className="text-2xl font-bold">Mock SATs Maths Test</h1>
        <p className="text-gray-600 leading-relaxed">
          Ready to try a practice maths SATs? This test has two papers, just like the real thing.
        </p>
        <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 text-left space-y-2 w-full">
          <p><strong>How it works:</strong></p>
          <p>🔢 <strong>Paper 1: Arithmetic</strong> — 25 calculations ({PAPERS[0].questions.reduce((s, q) => s + q.marks, 0)} marks)</p>
          <p>🧩 <strong>Paper 2: Reasoning</strong> — 20 word problems ({PAPERS[1].questions.reduce((s, q) => s + q.marks, 0)} marks)</p>
          <p>No hints or help — it's exam practice!</p>
          <p>You'll see the answers and worked solutions at the end.</p>
        </div>
        <button
          onClick={() => setState(STATES.PAPER_INTRO)}
          className="px-8 py-4 bg-green-600 text-white rounded-2xl text-lg font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
        >
          Start Test
        </button>
        <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors min-h-[48px] flex items-center">
          Maybe later
        </Link>
      </main>
    );
  }

  // PAPER INTRO
  if (state === STATES.PAPER_INTRO) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6 max-w-md mx-auto">
        <div className="text-5xl">{currentPaper.emoji}</div>
        <h1 className="text-2xl font-bold">{currentPaper.name}</h1>
        <p className="text-gray-600 leading-relaxed">{currentPaper.description}</p>
        <p className="text-sm text-gray-500">{currentPaper.questions.length} questions</p>
        <button
          onClick={() => setState(STATES.QUESTION)}
          className="px-8 py-4 bg-green-600 text-white rounded-2xl text-lg font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
        >
          Begin {currentPaper.id === 'arithmetic' ? 'Arithmetic' : 'Reasoning'}
        </button>
      </main>
    );
  }

  // PAUSED
  if (state === STATES.PAUSED) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6">
        <div className="text-5xl">☕</div>
        <h1 className="text-2xl font-bold">Take a Break</h1>
        <p className="text-gray-600">Need a breather? Come back when you're ready.</p>
        <p className="text-sm text-gray-400">Question {questionIndex + 1} of {currentPaper.questions.length}</p>
        <button
          onClick={() => setState(STATES.QUESTION)}
          className="px-8 py-4 bg-green-600 text-white rounded-2xl text-lg font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
        >
          Continue
        </button>
      </main>
    );
  }

  // PAPER COMPLETE (between papers)
  if (state === STATES.PAPER_COMPLETE) {
    const paperResults = results.filter((r) => r.paperId === currentPaper.id);
    const paperScore = paperResults.reduce((s, r) => s + (r.correct ? r.marks : 0), 0);
    const paperMax = paperResults.reduce((s, r) => s + r.marks, 0);

    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6 max-w-md mx-auto">
        <div className="text-5xl">👍</div>
        <h1 className="text-2xl font-bold">{currentPaper.name} Complete!</h1>
        <p className="text-lg text-gray-600">You scored {paperScore} out of {paperMax} marks.</p>
        <p className="text-gray-500">One more paper to go — you're doing great!</p>
        <button
          onClick={handleNextPaper}
          className="px-8 py-4 bg-green-600 text-white rounded-2xl text-lg font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
        >
          Start {PAPERS[paperIndex + 1].name}
        </button>
      </main>
    );
  }

  // RESULTS
  if (state === STATES.RESULTS) {
    const totalMarks = results.reduce((s, r) => s + (r.correct ? r.marks : 0), 0);
    const maxMarks = results.reduce((s, r) => s + r.marks, 0);
    const bracket = getBracket(totalMarks);

    const progress = loadProgress();
    const prevTests = (progress.mathsMockTests || []).slice(0, -1);
    const lastScore = prevTests.length > 0 ? prevTests[prevTests.length - 1].score : null;

    return (
      <main className="min-h-screen p-6 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{bracket.emoji}</div>
          <h1 className="text-2xl font-bold mb-2">You scored {totalMarks} out of {maxMarks}!</h1>
          <p className="text-xl font-semibold text-green-700">{bracket.label}</p>
          <p className="text-sm text-gray-400 mt-2">Time: {formatTime(elapsed)}</p>

          {/* Paper breakdown */}
          <div className="flex gap-4 justify-center mt-4">
            {PAPERS.map((p) => {
              const pr = results.filter((r) => r.paperId === p.id);
              const ps = pr.reduce((s, r) => s + (r.correct ? r.marks : 0), 0);
              const pm = pr.reduce((s, r) => s + r.marks, 0);
              return (
                <div key={p.id} className="bg-gray-50 rounded-xl p-3 flex-1">
                  <p className="text-xs text-gray-500">{p.emoji} {p.id === 'arithmetic' ? 'Arithmetic' : 'Reasoning'}</p>
                  <p className="text-lg font-bold">{ps}/{pm}</p>
                </div>
              );
            })}
          </div>

          {lastScore !== null && (
            <div className="mt-4 p-3 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-800">
                {totalMarks > lastScore
                  ? `That's ${totalMarks - lastScore} more than last time! Amazing improvement! 🎉`
                  : totalMarks === lastScore
                  ? "Same score as last time — you're staying consistent! 💪"
                  : "Keep practising — you'll beat your last score soon! 🌱"}
              </p>
              <p className="text-xs text-blue-600 mt-1">Last test: {lastScore}/{maxMarks}</p>
            </div>
          )}
        </div>

        {/* Review answers by paper */}
        {PAPERS.map((paper) => {
          const paperResults = results.filter((r) => r.paperId === paper.id);
          return (
            <div key={paper.id} className="mb-8">
              <h2 className="font-bold text-lg mb-3">{paper.emoji} {paper.name}</h2>
              <div className="space-y-2">
                {paperResults.map((r, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border ${
                      r.correct ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{r.correct ? '✓' : '✗'}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{r.question.question_text}</p>
                        {!r.correct && (
                          <p className="text-xs text-gray-500 mt-1">
                            Correct answer: {typeof r.question.correct_answer === 'object'
                              ? `${r.question.correct_answer.numerator}/${r.question.correct_answer.denominator}`
                              : r.question.correct_answer}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{r.question.marks}mk</span>
                    </div>
                    {!r.correct && r.question.worked_solution_steps && (
                      <div className="mt-2 pl-8 space-y-1">
                        {r.question.worked_solution_steps.map((step, j) => (
                          <p key={j} className="text-xs text-gray-600">{step}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleRetry}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
          >
            Try Another Test
          </button>
          <Link to="/maths" className="w-full py-3 bg-blue-100 text-blue-800 rounded-xl font-semibold hover:bg-blue-200 transition-colors min-h-[48px] text-center">
            Back to Maths
          </Link>
          <Link to="/" className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors min-h-[48px] text-center">
            Home
          </Link>
        </div>

        {prevTests.length > 0 && (
          <div className="mt-8">
            <h2 className="font-bold text-lg mb-3">Previous Tests</h2>
            <div className="space-y-2">
              {[...prevTests].reverse().slice(0, 5).map((t, i) => (
                <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t.date}</span>
                  <span className="font-semibold">{t.score}/{t.total}</span>
                  <span className="text-xs text-gray-400">{formatTime(t.elapsed)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    );
  }

  // QUESTION
  if (!currentQuestion) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setState(STATES.PAUSED)}
          className="text-gray-500 font-semibold min-h-[48px] min-w-[48px] flex items-center text-sm"
        >
          Pause
        </button>
        <div className="text-center">
          <span className="text-sm text-gray-600 font-semibold">{currentPaper.emoji} {currentPaper.id === 'arithmetic' ? 'Arithmetic' : 'Reasoning'}</span>
          <div className="text-xs text-gray-400">
            Question {questionIndex + 1} of {currentPaper.questions.length}
          </div>
        </div>
        <span className="text-xs text-gray-400 min-w-[48px] text-right">{formatTime(elapsed)}</span>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gray-500 transition-all duration-500"
            style={{ width: `${(questionIndex / currentPaper.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          onAnswer={handleAnswer}
        />
      </div>
    </main>
  );
}
