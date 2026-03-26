// services/operations/progressAPI.js
import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { BACKEND_URL } from "../../utils/constants";

const PROGRESS_API = BACKEND_URL + "/enrollments/updateprogress";
const ADD_REVIEW_API = BACKEND_URL + "/reviews/add";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Mark a subsection as completed / update progress
//    POST /enrollments/updateprogress
//    Body: { courseId, subSectionId }
// ─────────────────────────────────────────────────────────────────────────────
export const markSubSectionComplete = async (token, courseId, subSectionId) => {
  try {
    const response = await apiConnector(
      "POST",
      PROGRESS_API,
      { courseId, subSectionId },
      { Authorization: `Bearer ${token}` }
    );
    console.log("MARK_PROGRESS RESPONSE:", response);
    return response?.data?.data ?? null;
  } catch (error) {
    console.error("MARK_PROGRESS ERROR:", error);
    return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Add a review for a course
//    POST /reviews/add
//    Body: { courseId, rating, review }
// ─────────────────────────────────────────────────────────────────────────────
export const addCourseReview = async (token, courseId, rating, reviewText) => {
  const toastId = toast.loading("Saving review...");
  try {
    const response = await apiConnector(
      "POST",
      ADD_REVIEW_API,
      { courseId, rating, review: reviewText },
      { Authorization: `Bearer ${token}` }
    );
    console.log("ADD_REVIEW RESPONSE:", response);
    if (!response?.data?.success) throw new Error(response?.data?.message);
    toast.success("Review added successfully!");
    return response?.data?.data ?? null;
  } catch (error) {
    console.error("ADD_REVIEW ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to save review.");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};