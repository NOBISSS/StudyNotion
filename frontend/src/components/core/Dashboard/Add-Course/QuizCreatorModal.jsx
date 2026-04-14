// components/core/Dashboard/Add-Course/QuizCreatorModal.jsx
//
// Usage (inside CourseBuilderForm when adding a subsection of type "quiz"):
//   <QuizCreatorModal
//     courseId={courseId}
//     sectionId={sectionId}
//     onClose={() => setShowQuizModal(false)}
//     onSaved={(quiz) => { /* add to section list */ }}
//     existingQuiz={null}           // pass quiz object to edit
//     subSectionId={null}           // pass for edit mode
//   />

import { useState } from "react"
import { useSelector } from "react-redux"
import { FiPlus, FiTrash2, FiX, FiCheck } from "react-icons/fi"
import { MdQuiz } from "react-icons/md"
import { createQuiz, updateQuiz } from "../../../../services/operations/quizAPI"

// ── Empty question template ────────────────────────────────────────────────
const emptyQuestion = () => ({
  _key: Math.random().toString(36).slice(2), // local UI key only
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",  // will be set to the option text that is correct
  points: 1,
})

// ── Single Question Editor ─────────────────────────────────────────────────
const QuestionEditor = ({ q, index, onChange, onRemove, canRemove }) => {
  const inputCls = "w-full bg-[#161D29] border border-[#2C333F] focus:border-[#FFD60A] outline-none text-white placeholder-[#6E727F] text-sm rounded-lg px-3 py-2.5 transition-colors"

  const updateField = (field, value) => onChange({ ...q, [field]: value })

  const updateOption = (i, value) => {
    const opts = [...q.options]
    // If this option was the correct answer by text, update correctAnswer too
    const wasCorrect = q.correctAnswer === opts[i]
    opts[i] = value
    onChange({ ...q, options: opts, correctAnswer: wasCorrect ? value : q.correctAnswer })
  }

  const addOption = () => {
    if (q.options.length >= 6) return
    onChange({ ...q, options: [...q.options, ""] })
  }

  const removeOption = (i) => {
    if (q.options.length <= 2) return
    const opts = q.options.filter((_, idx) => idx !== i)
    onChange({ ...q, options: opts, correctAnswer: q.correctAnswer === q.options[i] ? "" : q.correctAnswer })
  }

  return (
    <div className="bg-[#161D29] rounded-xl border border-[#2C333F] p-4">
      {/* Question header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[#FFD60A] text-xs font-bold uppercase tracking-wider">
          Question {index + 1}
        </span>
        <div className="flex items-center gap-2">
          {/* Points */}
          <div className="flex items-center gap-1.5">
            <label className="text-[#6E727F] text-xs">Points:</label>
            <input
              type="number"
              min={1}
              max={10}
              value={q.points}
              onChange={(e) => updateField("points", Math.max(1, parseInt(e.target.value) || 1))}
              className="w-14 bg-[#2C333F] border border-[#2C333F] focus:border-[#FFD60A] outline-none text-white text-xs rounded-lg px-2 py-1.5 text-center transition-colors"
            />
          </div>
          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 rounded-lg text-[#6E727F] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
            >
              <FiTrash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Question text */}
      <textarea
        rows={2}
        placeholder="Enter your question..."
        value={q.question}
        onChange={(e) => updateField("question", e.target.value)}
        className={`${inputCls} resize-none mb-3`}
      />

      {/* Options */}
      <div className="flex flex-col gap-2 mb-2">
        <p className="text-[#6E727F] text-xs mb-1">
          Options — click the circle to mark correct answer
        </p>
        {q.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            {/* Correct answer selector */}
            <button
              type="button"
              onClick={() => updateField("correctAnswer", opt || "")}
              className={`w-5 h-5 rounded-full border-2 shrink-0 transition-all ${
                q.correctAnswer && q.correctAnswer === opt && opt !== ""
                  ? "border-[#22C55E] bg-[#22C55E]"
                  : "border-[#374151] hover:border-[#22C55E]"
              } flex items-center justify-center`}
              title="Mark as correct answer"
            >
              {q.correctAnswer === opt && opt !== "" && (
                <FiCheck size={10} className="text-white" />
              )}
            </button>

            <input
              type="text"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              className={`${inputCls} flex-1 ${
                q.correctAnswer === opt && opt !== "" ? "border-[#22C55E]/50" : ""
              }`}
            />

            {q.options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(i)}
                className="p-1.5 text-[#6E727F] hover:text-[#EF4444] transition-colors shrink-0"
              >
                <FiX size={13} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add option */}
      {q.options.length < 6 && (
        <button
          type="button"
          onClick={addOption}
          className="text-[#FFD60A] text-xs font-medium flex items-center gap-1 mt-1 hover:text-[#FFC800] transition-colors"
        >
          <FiPlus size={13} /> Add option
        </button>
      )}
    </div>
  )
}

// ── Main Modal ────────────────────────────────────────────────────────────
const QuizCreatorModal = ({
  courseId,
  sectionId,
  onClose,
  onSaved,
  existingQuiz = null,
  subSectionId = null,
}) => {
  const { token } = useSelector((state) => state.auth)
  const isEdit = !!existingQuiz

  const [title, setTitle] = useState(existingQuiz?.title || "")
  const [description, setDescription] = useState(existingQuiz?.description || "")
  const [questions, setQuestions] = useState(
    existingQuiz?.questions?.length
      ? existingQuiz.questions.map((q) => ({
          _key: q.questionId || Math.random().toString(36).slice(2),
          questionId: q.questionId,
          question: q.question,
          // For edit mode: backend returns options as { optionId, optionText }
          options: q.options?.map((o) =>
            typeof o === "string" ? o : o.optionText
          ) || ["", "", "", ""],
          // correctAnswer from backend is optionId — match by index
          correctAnswer:
            q.options?.find(
              (o) => o.optionId?.toString() === q.correctAnswer?.toString()
            )?.optionText || "",
          points: q.points || 1,
        }))
      : [emptyQuestion()]
  )
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (!title.trim()) e.title = "Quiz title is required"
    questions.forEach((q, i) => {
      if (!q.question.trim()) e[`q_${i}_text`] = `Question ${i + 1}: text required`
      if (q.options.filter((o) => o.trim()).length < 2)
        e[`q_${i}_opts`] = `Question ${i + 1}: at least 2 options`
      if (!q.correctAnswer.trim())
        e[`q_${i}_ans`] = `Question ${i + 1}: select correct answer`
      if (!q.options.includes(q.correctAnswer))
        e[`q_${i}_ans`] = `Question ${i + 1}: correct answer must match an option`
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)

    // Build payload matching createQuizSchema exactly:
    // questions[].options = string[]
    // questions[].correctAnswer = string (must match one of the options)
    const payload = {
      title: title.trim(),
      description: description.trim(),
      courseId,
      sectionId,
      questions: questions.map((q) => ({
        ...(q.questionId ? { questionId: q.questionId } : {}),
        question: q.question.trim(),
        options: q.options.filter((o) => o.trim()), // string[] for create
        correctAnswer: q.correctAnswer.trim(),
        points: q.points,
      })),
    }

    let result
    if (isEdit && subSectionId) {
      // updateQuizSchema uses { optionId?, optionText } or optionsOnly[]
      // Simplest: use optionsOnly (plain string array) for update
      const updatePayload = {
        title: payload.title,
        description: payload.description,
        questions: payload.questions.map((q) => ({
          questionId: q.questionId,
          question: q.question,
          optionsOnly: q.options, // backend accepts optionsOnly: string[]
          correctAnswer: q.correctAnswer,
          points: q.points,
        })),
      }
      result = await updateQuiz(token, subSectionId, updatePayload)
    } else {
      result = await createQuiz(token, payload)
    }

    setSaving(false)
    if (result) {
      onSaved(result)
      onClose()
    }
  }

  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()])
  const removeQuestion = (key) =>
    setQuestions((prev) => prev.filter((q) => q._key !== key))
  const updateQuestion = (key, updated) =>
    setQuestions((prev) => prev.map((q) => (q._key === key ? updated : q)))

  // Any validation error
  const errorList = Object.values(errors)

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-6 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl bg-[#1E2735] rounded-2xl border border-[#2C333F] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2C333F]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FFD60A]/10 flex items-center justify-center">
              <MdQuiz size={18} className="text-[#FFD60A]" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base">
                {isEdit ? "Edit Quiz" : "Create Quiz"}
              </h2>
              <p className="text-[#6E727F] text-xs">
                {questions.length} question{questions.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#6E727F] hover:text-white hover:bg-[#2C333F] transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
            {/* Title & Description */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-[#F1F2FF]">
                  Quiz Title <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Module 1 Assessment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full bg-[#161D29] border ${
                    errors.title ? "border-[#EF4444]" : "border-[#2C333F] focus:border-[#FFD60A]"
                  } outline-none text-white placeholder-[#6E727F] text-sm rounded-lg px-4 py-3 transition-colors`}
                />
                {errors.title && <p className="text-[#EF4444] text-xs">{errors.title}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-[#AFB2BF]">
                  Description <span className="text-[#6E727F] text-xs">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description of this quiz..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#161D29] border border-[#2C333F] focus:border-[#FFD60A] outline-none text-white placeholder-[#6E727F] text-sm rounded-lg px-4 py-3 resize-none transition-colors"
                />
              </div>
            </div>

            {/* Divider */}
            <hr className="border-[#2C333F]" />

            {/* Questions */}
            <div className="flex flex-col gap-3">
              {questions.map((q, index) => (
                <QuestionEditor
                  key={q._key}
                  q={q}
                  index={index}
                  onChange={(updated) => updateQuestion(q._key, updated)}
                  onRemove={() => removeQuestion(q._key)}
                  canRemove={questions.length > 1}
                />
              ))}
            </div>

            {/* Add question */}
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-[#2C333F] hover:border-[#FFD60A]/50 text-[#6E727F] hover:text-[#FFD60A] text-sm font-medium transition-all"
            >
              <FiPlus size={16} /> Add Question
            </button>

            {/* Validation errors summary */}
            {errorList.length > 0 && (
              <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg px-4 py-3">
                <p className="text-[#EF4444] text-xs font-semibold mb-1">Please fix the following:</p>
                {errorList.map((err, i) => (
                  <p key={i} className="text-[#EF4444] text-xs">{err}</p>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#2C333F]">
            <p className="text-[#6E727F] text-xs">
              Total points: {questions.reduce((sum, q) => sum + (q.points || 0), 0)}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg border border-[#2C333F] text-[#AFB2BF] text-sm hover:bg-[#2C333F] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-lg bg-[#FFD60A] hover:bg-[#FFC800] text-black font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving
                  ? "Saving..."
                  : isEdit
                  ? "Save Changes"
                  : "Create Quiz"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuizCreatorModal