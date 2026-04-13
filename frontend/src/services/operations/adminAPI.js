// services/operations/adminAPI.js
import toast from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { adminEndpoints } from "../apis"

const {
  CREATE_CATEGORY_API,
  UPDATE_CATEGORY_API,
  DELETE_CATEGORY_API,
  GET_ALL_CATEGORY_API,
  GET_ALL_USERS_API,
  BAN_USER_API,
  UNBAN_USER_API,
  DELETE_USER_API,
  GET_ALL_COURSES_API,
  TOGGLE_COURSE_API,
  GET_ADMIN_ANALYTICS_API,
} = adminEndpoints

// ── Category Operations ────────────────────────────────────────────────────

export const getAllCategories = async (token) => {
  try {
    const response = await apiConnector("GET", GET_ALL_CATEGORY_API, null, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) throw new Error(response?.data?.message)
    return response.data.data.category
  } catch (error) {
    console.error("GET_ALL_CATEGORIES ERROR:", error)
    toast.error(error.message || "Failed to fetch categories")
    return []
  }
}

export const createCategory = async (token, { name, description }) => {
  const toastId = toast.loading("Creating category...")
  try {
    const response = await apiConnector(
      "POST",
      CREATE_CATEGORY_API,
      { name, description },
      { Authorization: `Bearer ${token}` }
    )
    if (!response?.data?.success) throw new Error(response?.data?.message)
    toast.success("Category created successfully", { id: toastId })
    return response.data.data.category
  } catch (error) {
    console.error("CREATE_CATEGORY ERROR:", error)
    toast.error(error.message || "Failed to create category", { id: toastId })
    return null
  } finally {
    toast.dismiss(toastId)
  }
}

export const updateCategory = async (token, categoryId, { name, description }) => {
  const toastId = toast.loading("Updating category...")
  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_CATEGORY_API + categoryId,
      { name, description },
      { Authorization: `Bearer ${token}` }
    )
    if (!response?.data?.success) throw new Error(response?.data?.message)
    toast.success("Category updated successfully", { id: toastId })
    return response.data.data.category
  } catch (error) {
    console.error("UPDATE_CATEGORY ERROR:", error)
    toast.error(error.message || "Failed to update category", { id: toastId })
    return null
  } finally {
    toast.dismiss(toastId)
  }
}

export const deleteCategory = async (token, categoryId) => {
  const toastId = toast.loading("Deleting category...")
  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_CATEGORY_API + categoryId,
      null,
      { Authorization: `Bearer ${token}` }
    )
    if (!response?.data?.success) throw new Error(response?.data?.message)
    toast.success("Category deleted successfully", { id: toastId })
    return true
  } catch (error) {
    console.error("DELETE_CATEGORY ERROR:", error)
    toast.error(error.message || "Failed to delete category", { id: toastId })
    return false
  } finally {
    toast.dismiss(toastId)
  }
}

// ── User Operations ────────────────────────────────────────────────────────

export const getAllUsers = async (token) => {
  try {
    const response = await apiConnector("GET", GET_ALL_USERS_API, null, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) throw new Error(response?.data?.message)
    return response.data.data.users
  } catch (error) {
    console.error("GET_ALL_USERS ERROR:", error)
    toast.error(error.message || "Failed to fetch users")
    return []
  }
}

export const banUser = async (token, userId) => {
  const toastId = toast.loading("Banning user...")
  try {
    const response = await apiConnector(
      "PUT",
      BAN_USER_API + userId,
      null,
      { Authorization: `Bearer ${token}` }
    )
    if (!response?.data?.success) throw new Error(response?.data?.message)
    toast.success("User banned successfully", { id: toastId })
    return true
  } catch (error) {
    toast.error(error.message || "Failed to ban user", { id: toastId })
    return false
  } finally {
    toast.dismiss(toastId)
  }
}

export const unbanUser = async (token, userId) => {
  const toastId = toast.loading("Unbanning user...")
  try {
    const response = await apiConnector(
      "PUT",
      UNBAN_USER_API + userId,
      null,
      { Authorization: `Bearer ${token}` }
    )
    if (!response?.data?.success) throw new Error(response?.data?.message)
    toast.success("User unbanned successfully", { id: toastId })
    return true
  } catch (error) {
    toast.error(error.message || "Failed to unban user", { id: toastId })
    return false
  } finally {
    toast.dismiss(toastId)
  }
}

// ── Course Operations ──────────────────────────────────────────────────────

export const getAllCoursesAdmin = async (token) => {
  try {
    const response = await apiConnector("GET", GET_ALL_COURSES_API, null, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) throw new Error(response?.data?.message)
    return response.data.data.courses
  } catch (error) {
    console.error("GET_ALL_COURSES_ADMIN ERROR:", error)
    toast.error(error.message || "Failed to fetch courses")
    return []
  }
}

export const toggleCourseStatus = async (token, courseId) => {
  const toastId = toast.loading("Updating course status...")
  try {
    const response = await apiConnector(
      "PUT",
      TOGGLE_COURSE_API + courseId,
      null,
      { Authorization: `Bearer ${token}` }
    )
    if (!response?.data?.success) throw new Error(response?.data?.message)
    toast.success("Course status updated", { id: toastId })
    return true
  } catch (error) {
    toast.error(error.message || "Failed to update course", { id: toastId })
    return false
  } finally {
    toast.dismiss(toastId)
  }
}

// ── Analytics ─────────────────────────────────────────────────────────────

export const getAdminAnalytics = async () => {
  try {
    const response = await apiConnector("GET", GET_ADMIN_ANALYTICS_API);
    if (!response?.data?.success) throw new Error(response?.data?.message)
    return response.data.data
  } catch (error) {
    console.error("GET_ADMIN_ANALYTICS ERROR:", error)
    return null
  }
}