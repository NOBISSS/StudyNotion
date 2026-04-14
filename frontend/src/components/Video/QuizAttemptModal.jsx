

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { FiX, FiCheck, FiClock, FiAward, FiRefreshCw } from "react-icons/fi"
import { MdQuiz } from "react-icons/md"
import { getQuizBySubSection, attemptQuiz, getQuizAttempts } from "../../services/operations/QuizAPI"

// ── States ─────────────────────────────────────────────────────────────────
// "loading" | "start" | "question" | "submitting" | "result" | "history" | "error"

// ── Progress Bar ───────────────────────────────────────────────────────────
const ProgressBar = ({ current, total }) => (
    <div className="w-full h-1.5 bg-[#2C333F] rounded-full overflow-hidden">
        <div
            className="h-full bg-[#FFD60A] rounded-full transition-all duration-300"
            style={{ width: `${(current / total) * 100}%` }}
        />
    </div>
)

// ── Result Screen ──────────────────────────────────────────────────────────
const ResultScreen = ({ attempt, quiz, onRetry, onClose, onViewHistory }) => {
    const totalPoints = quiz.questions.reduce((s, q) => s + q.points, 0)
    const pct = totalPoints > 0 ? Math.round((attempt.score / totalPoints) * 100) : 0
    const passed = pct >= 60

    return (
        <div className="flex flex-col items-center py-8 px-6 gap-6">
            {/* Score ring */}
            <div className="relative">
                <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#2C333F" strokeWidth="8" />
                    <circle
                        cx="60" cy="60" r="52" fill="none"
                        stroke={passed ? "#22C55E" : "#EF4444"}
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 52}`}
                        strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                        style={{ transition: "stroke-dashoffset 0.8s ease" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{pct}%</span>
                    <span className="text-[#6E727F] text-xs">score</span>
                </div>
            </div>

            {/* Result label */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${passed ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#EF4444]/10 text-[#EF4444]"
                }`}>
                {passed ? <FiAward size={16} /> : <FiX size={16} />}
                {passed ? "Passed!" : "Not passed"}
            </div>

            {/* Score details */}
            <div className="w-full bg-[#161D29] rounded-xl border border-[#2C333F] p-4 grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-2xl font-bold text-[#FFD60A]">{attempt.score}</p>
                    <p className="text-[#6E727F] text-xs">Points earned</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-white">{totalPoints}</p>
                    <p className="text-[#6E727F] text-xs">Total points</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-[#60A5FA]">
                        {attempt.answers?.filter((a) => a.isCorrect).length ?? "—"}
                    </p>
                    <p className="text-[#6E727F] text-xs">Correct answers</p>
                </div>
            </div>

            {/* Per-question breakdown */}
            <div className="w-full flex flex-col gap-2">
                <p className="text-[#AFB2BF] text-xs font-semibold uppercase tracking-wider mb-1">
                    Question Breakdown
                </p>
                {quiz.questions.map((q, i) => {
                    const ans = attempt.answers?.[i]
                    return (
                        <div
                            key={q.questionId}
                            className={`flex items-start gap-3 p-3 rounded-lg border ${ans?.isCorrect
                                    ? "border-[#22C55E]/30 bg-[#22C55E]/5"
                                    : "border-[#EF4444]/30 bg-[#EF4444]/5"
                                }`}
                        >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${ans?.isCorrect ? "bg-[#22C55E]" : "bg-[#EF4444]"
                                }`}>
                                {ans?.isCorrect
                                    ? <FiCheck size={11} className="text-white" />
                                    : <FiX size={11} className="text-white" />
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm leading-snug">{q.question}</p>
                                <p className={`text-xs mt-0.5 ${ans?.isCorrect ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                                    {ans?.isCorrect ? `+${q.points} pts` : "0 pts"}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full">
                <button
                    onClick={onViewHistory}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#2C333F] text-[#AFB2BF] text-sm hover:bg-[#2C333F] transition-colors"
                >
                    <FiClock size={14} /> History
                </button>
                <button
                    onClick={onRetry}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#FFD60A]/30 text-[#FFD60A] text-sm hover:bg-[#FFD60A]/10 transition-colors"
                >
                    <FiRefreshCw size={14} /> Retry
                </button>
                <button
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-lg bg-[#FFD60A] hover:bg-[#FFC800] text-black font-bold text-sm transition-colors"
                >
                    Done
                </button>
            </div>
        </div>
    )
}

// ── History Screen ─────────────────────────────────────────────────────────
const HistoryScreen = ({ attempts, totalPoints, onBack }) => (
    <div className="px-6 py-5 flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-1">
            <button
                onClick={onBack}
                className="text-[#6E727F] hover:text-white transition-colors text-sm flex items-center gap-1"
            >
                ← Back
            </button>
            <p className="text-white font-semibold">Attempt History</p>
        </div>

        {attempts.length === 0 ? (
            <p className="text-[#6E727F] text-sm text-center py-8">No past attempts</p>
        ) : (
            attempts.map((att, i) => {
                const pct = totalPoints > 0 ? Math.round((att.score / totalPoints) * 100) : 0
                const passed = pct >= 60
                return (
                    <div
                        key={att._id}
                        className="flex items-center justify-between bg-[#161D29] rounded-xl border border-[#2C333F] p-4"
                    >
                        <div>
                            <p className="text-white text-sm font-medium">Attempt #{attempts.length - i}</p>
                            <p className="text-[#6E727F] text-xs mt-0.5">
                                {new Date(att.attemptedAt || att.createdAt).toLocaleString("en-IN", {
                                    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                                })}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className={`text-lg font-bold ${passed ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                                {pct}%
                            </p>
                            <p className="text-[#6E727F] text-xs">{att.score}/{totalPoints} pts</p>
                        </div>
                    </div>
                )
            })
        )}
    </div>
)

// ── Main Modal ─────────────────────────────────────────────────────────────
const QuizAttemptModal = ({ subSectionId, onClose, onCompleted }) => {
    const { token } = useSelector((state) => state.auth)

    const [state, setState] = useState("loading")
    const [quiz, setQuiz] = useState(null)
    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState({}) // { questionId: optionId }
    const [attempt, setAttempt] = useState(null)
    const [history, setHistory] = useState([])
    const [error, setError] = useState("")

    // Load quiz on mount
    useEffect(() => {
        const load = async () => {
            setState("loading")
            const data = await getQuizBySubSection(token, subSectionId)
            if (!data) { setState("error"); setError("Could not load quiz."); return }
            setQuiz(data)
            // Check for existing attempts (show history option)
            const hist = await getQuizAttempts(token, data._id)
            setHistory(hist || [])
            setState("start")
        }
        load()
    }, [subSectionId, token])

    const startQuiz = () => {
        setCurrentQ(0)
        setAnswers({})
        setAttempt(null)
        setState("question")
    }

    const selectAnswer = (questionId, optionId) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
    }

    const handleNext = () => {
        if (currentQ < quiz.questions.length - 1) {
            setCurrentQ((p) => p + 1)
        }
    }

    const handlePrev = () => {
        if (currentQ > 0) setCurrentQ((p) => p - 1)
    }

    const handleSubmit = async () => {
        setState("submitting")

        // Build answers array matching attemptQuizSchema:
        // answers: [{ questionId: string, answer: string (optionId) }]
        const answersPayload = quiz.questions.map((q) => ({
            questionId: q.questionId.toString(),
            answer: answers[q.questionId.toString()] || "",
        }))

        const result = await attemptQuiz(token, {
            quizId: quiz._id,
            answers: answersPayload,
        })

        if (!result) { setState("question"); return }

        // Refresh history
        const hist = await getQuizAttempts(token, quiz._id)
        setHistory(hist || [])
        setAttempt(result)
        setState("result")

        // Notify parent (mark completed)
        const totalPoints = quiz.questions.reduce((s, q) => s + q.points, 0)
        const pct = totalPoints > 0 ? Math.round((result.score / totalPoints) * 100) : 0
        if (pct >= 60) onCompleted?.(result)
    }

    const q = quiz?.questions?.[currentQ]
    const currentAnswer = q ? answers[q.questionId.toString()] : null
    const answeredCount = Object.keys(answers).length
    const totalQ = quiz?.questions?.length ?? 0

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-lg bg-[#1E2735] rounded-2xl border border-[#2C333F] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#2C333F] sticky top-0 bg-[#1E2735] z-10">
                    <div className="flex items-center gap-2">
                        <MdQuiz size={18} className="text-[#FFD60A]" />
                        <p className="text-white font-semibold text-sm truncate max-w-[260px]">
                            {quiz?.title || "Quiz"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-[#6E727F] hover:text-white hover:bg-[#2C333F] transition-colors"
                    >
                        <FiX size={16} />
                    </button>
                </div>

                {/* ── LOADING ── */}
                {state === "loading" && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className="w-8 h-8 border-2 border-[#FFD60A] border-t-transparent rounded-full animate-spin" />
                        <p className="text-[#6E727F] text-sm">Loading quiz...</p>
                    </div>
                )}

                {/* ── ERROR ── */}
                {state === "error" && (
                    <div className="flex flex-col items-center py-12 gap-3 px-6">
                        <p className="text-[#EF4444] text-sm text-center">{error}</p>
                        <button onClick={onClose} className="text-[#AFB2BF] text-sm hover:text-white">
                            Close
                        </button>
                    </div>
                )}

                {/* ── START SCREEN ── */}
                {state === "start" && quiz && (
                    <div className="px-6 py-8 flex flex-col items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-[#FFD60A]/10 flex items-center justify-center">
                            <MdQuiz size={32} className="text-[#FFD60A]" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-white font-bold text-xl mb-2">{quiz.title}</h2>
                            {quiz.description && (
                                <p className="text-[#AFB2BF] text-sm">{quiz.description}</p>
                            )}
                        </div>

                        <div className="w-full grid grid-cols-3 gap-3 text-center">
                            {[
                                { label: "Questions", value: quiz.questions.length },
                                { label: "Total Points", value: quiz.questions.reduce((s, q) => s + q.points, 0) },
                                { label: "Past Attempts", value: history.length },
                            ].map((s) => (
                                <div key={s.label} className="bg-[#161D29] rounded-xl border border-[#2C333F] py-3">
                                    <p className="text-[#FFD60A] text-xl font-bold">{s.value}</p>
                                    <p className="text-[#6E727F] text-xs">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 w-full">
                            {history.length > 0 && (
                                <button
                                    onClick={() => setState("history")}
                                    className="flex-1 py-3 rounded-xl border border-[#2C333F] text-[#AFB2BF] text-sm hover:bg-[#2C333F] transition-colors flex items-center justify-center gap-2"
                                >
                                    <FiClock size={14} /> View History
                                </button>
                            )}
                            <button
                                onClick={startQuiz}
                                className="flex-1 py-3 rounded-xl bg-[#FFD60A] hover:bg-[#FFC800] text-black font-bold text-sm transition-colors"
                            >
                                {history.length > 0 ? "Retry Quiz" : "Start Quiz"}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── QUESTION ── */}
                {(state === "question" || state === "submitting") && quiz && q && (
                    <div className="px-5 py-5 flex flex-col gap-5">
                        {/* Progress */}
                        <div className="flex items-center justify-between text-xs text-[#6E727F] mb-1">
                            <span>Question {currentQ + 1} of {totalQ}</span>
                            <span>{answeredCount}/{totalQ} answered</span>
                        </div>
                        <ProgressBar current={currentQ + 1} total={totalQ} />

                        {/* Question text */}
                        <div className="bg-[#161D29] rounded-xl border border-[#2C333F] p-4">
                            <div className="flex items-start justify-between gap-3">
                                <p className="text-white text-base font-medium leading-relaxed flex-1">
                                    {q.question}
                                </p>
                                <span className="text-[#FFD60A] text-xs font-bold shrink-0 bg-[#FFD60A]/10 px-2 py-1 rounded-full">
                                    {q.points} pt{q.points !== 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="flex flex-col gap-2.5">
                            {q.options.map((opt) => {
                                const isSelected = currentAnswer === opt.optionId.toString()
                                return (
                                    <button
                                        key={opt.optionId}
                                        type="button"
                                        onClick={() => selectAnswer(q.questionId.toString(), opt.optionId.toString())}
                                        className={`flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-150 ${isSelected
                                                ? "border-[#FFD60A] bg-[#FFD60A]/10 text-white"
                                                : "border-[#2C333F] bg-[#161D29] text-[#AFB2BF] hover:border-[#374151] hover:text-white"
                                            }`}
                                    >
                                        <span className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${isSelected ? "border-[#FFD60A] bg-[#FFD60A]" : "border-[#374151]"
                                            }`}>
                                            {isSelected && <FiCheck size={10} className="text-black font-bold" />}
                                        </span>
                                        <span className="text-sm">{opt.optionText}</span>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between gap-3 pt-1">
                            <button
                                onClick={handlePrev}
                                disabled={currentQ === 0}
                                className="px-4 py-2.5 rounded-lg border border-[#2C333F] text-[#AFB2BF] text-sm disabled:opacity-40 hover:bg-[#2C333F] transition-colors disabled:cursor-not-allowed"
                            >
                                ← Previous
                            </button>

                            {/* Question dots */}
                            <div className="flex gap-1.5">
                                {quiz.questions.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentQ(i)}
                                        className={`w-2 h-2 rounded-full transition-all ${i === currentQ
                                                ? "bg-[#FFD60A] w-4"
                                                : answers[quiz.questions[i].questionId.toString()]
                                                    ? "bg-[#22C55E]"
                                                    : "bg-[#2C333F]"
                                            }`}
                                    />
                                ))}
                            </div>

                            {currentQ < totalQ - 1 ? (
                                <button
                                    onClick={handleNext}
                                    className="px-4 py-2.5 rounded-lg bg-[#FFD60A] hover:bg-[#FFC800] text-black font-bold text-sm transition-colors"
                                >
                                    Next →
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={state === "submitting"}
                                    className="px-4 py-2.5 rounded-lg bg-[#22C55E] hover:bg-green-400 text-white font-bold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {state === "submitting" ? "Submitting..." : "Submit Quiz"}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* ── RESULT ── */}
                {state === "result" && attempt && quiz && (
                    <ResultScreen
                        attempt={attempt}
                        quiz={quiz}
                        onRetry={startQuiz}
                        onClose={onClose}
                        onViewHistory={() => setState("history")}
                    />
                )}

                {/* ── HISTORY ── */}
                {state === "history" && (
                    <HistoryScreen
                        attempts={history}
                        totalPoints={quiz?.questions?.reduce((s, q) => s + q.points, 0) ?? 0}
                        onBack={() => setState(attempt ? "result" : "start")}
                    />
                )}
            </div>
        </div>
    )
}

export default QuizAttemptModal