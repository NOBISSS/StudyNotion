// services/operations/quizAPI.js
import toast from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { BACKEND_URL } from "../../utils/constants"

const QUIZ_ENDPOINTS = {
    GET_QUIZ: (subSectionId) => `${BACKEND_URL}/subsections/quiz/get/${subSectionId}`,
    CREATE_QUIZ: `${BACKEND_URL}/subsections/quiz/add`,
    UPDATE_QUIZ: (subSectionId) => `${BACKEND_URL}/subsections/quiz/update/${subSectionId}`,
    DELETE_QUIZ: (subSectionId) => `${BACKEND_URL}/subsections/quiz/delete/${subSectionId}`,
    ATTEMPT_QUIZ: `${BACKEND_URL}/subsections/quiz/attempt`,
    GET_ATTEMPT: (quizId) => `${BACKEND_URL}/subsections/quiz/getattempt/${quizId}`,
}

// ── Instructor: Create Quiz ────────────────────────────────────────────────
// POST /subsections/quiz/add
// Body: { title, description?, courseId, sectionId, questions: [{ question, options[], correctAnswer, points }] }
export const createQuiz = async (token, payload) => {
    const toastId = toast.loading("Creating quiz...")
    try {
        const response = await apiConnector("POST", QUIZ_ENDPOINTS.CREATE_QUIZ, payload, {
            Authorization: `Bearer ${token}`,
        })
        if (!response?.data?.success) throw new Error(response?.data?.message)
        toast.success("Quiz created successfully", { id: toastId })
        return response.data.data.quiz
    } catch (error) {
        console.error("CREATE_QUIZ ERROR:", error)
        toast.error(error.message || "Failed to create quiz", { id: toastId })
        return null
    } finally {
        toast.dismiss(toastId)
    }
}

// ── Instructor: Update Quiz ────────────────────────────────────────────────
// PUT /subsections/quiz/update/:subSectionId
export const updateQuiz = async (token, subSectionId, payload) => {
    const toastId = toast.loading("Updating quiz...")
    try {
        const response = await apiConnector(
            "PUT",
            QUIZ_ENDPOINTS.UPDATE_QUIZ(subSectionId),
            payload,
            { Authorization: `Bearer ${token}` }
        )
        if (!response?.data?.success) throw new Error(response?.data?.message)
        toast.success("Quiz updated successfully", { id: toastId })
        return response.data.data.quiz
    } catch (error) {
        console.error("UPDATE_QUIZ ERROR:", error)
        toast.error(error.message || "Failed to update quiz", { id: toastId })
        return null
    } finally {
        toast.dismiss(toastId)
    }
}

// ── Instructor: Delete Quiz ────────────────────────────────────────────────
// POST /subsections/quiz/delete/:subSectionId
export const deleteQuiz = async (token, subSectionId) => {
    const toastId = toast.loading("Deleting quiz...")
    try {
        const response = await apiConnector(
            "POST",
            QUIZ_ENDPOINTS.DELETE_QUIZ(subSectionId),
            null,
            { Authorization: `Bearer ${token}` }
        )
        if (!response?.data?.success) throw new Error(response?.data?.message)
        toast.success("Quiz deleted successfully", { id: toastId })
        return true
    } catch (error) {
        console.error("DELETE_QUIZ ERROR:", error)
        toast.error(error.message || "Failed to delete quiz", { id: toastId })
        return false
    } finally {
        toast.dismiss(toastId)
    }
}

// ── Student: Get Quiz (no correct answers in response) ─────────────────────
// GET /subsections/quiz/get/:subSectionId
export const getQuizBySubSection = async (token, subSectionId) => {
    try {
        const response = await apiConnector(
            "GET",
            QUIZ_ENDPOINTS.GET_QUIZ(subSectionId),
            null,
            { Authorization: `Bearer ${token}` }
        )
        if (!response?.data?.success) throw new Error(response?.data?.message)
        return response.data.data.quiz
    } catch (error) {
        console.error("GET_QUIZ ERROR:", error)
        toast.error(error.message || "Failed to load quiz")
        return null
    }
}

// ── Student: Attempt Quiz ──────────────────────────────────────────────────
// POST /subsections/quiz/attempt
// Body: { quizId, answers: [{ questionId, answer: optionId }] }
export const attemptQuiz = async (token, { quizId, answers }) => {
    const toastId = toast.loading("Submitting quiz...")
    try {
        const response = await apiConnector(
            "POST",
            QUIZ_ENDPOINTS.ATTEMPT_QUIZ,
            { quizId, answers },
            { Authorization: `Bearer ${token}` }
        )
        if (!response?.data?.success) throw new Error(response?.data?.message)
        toast.success("Quiz submitted!", { id: toastId })
        return response.data.data.quizAttempt
    } catch (error) {
        console.error("ATTEMPT_QUIZ ERROR:", error)
        toast.error(error.message || "Failed to submit quiz", { id: toastId })
        return null
    } finally {
        toast.dismiss(toastId)
    }
}

// ── Student: Get Past Attempts ─────────────────────────────────────────────
// GET /subsections/quiz/getattempt/:quizId
export const getQuizAttempts = async (token, quizId) => {
    try {
        const response = await apiConnector(
            "GET",
            QUIZ_ENDPOINTS.GET_ATTEMPT(quizId),
            null,
            { Authorization: `Bearer ${token}` }
        )
        if (!response?.data?.success) throw new Error(response?.data?.message)
        return response.data.data.quizAttempts
    } catch (error) {
        console.error("GET_QUIZ_ATTEMPTS ERROR:", error)
        return []
    }
}