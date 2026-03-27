// services/operations/progressAPI.js
import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const ADD_REVIEW_API = BASE_URL + "/reviews/add";

// ─────────────────────────────────────────────────────────────────────────────
// Add a course review
// POST /reviews/add
// Body: { courseId, rating, review }
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