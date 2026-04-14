import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { CourseEnrollmentEndPoints } from "../apis";
import {
  enrollStart,
  enrollSuccess,
  enrollFailure,
  fetchEnrolledCoursesStart,
  fetchEnrolledCoursesSuccess,
  fetchEnrolledCoursesFailure,
  fetchAllEnrollmentsStart,
  fetchAllEnrollmentsSuccess,
  fetchAllEnrollmentsFailure,
  enrollWishlistSuccess,
} from "../../slices/enrollmentSlice";
import { resetCart } from "../../slices/cartSlice";

const {
  ENROLL_COURSE_API,
  GET_ALL_ENROLLED_COURSES_STUDENT_API,
  GET_ALL_ENROLLED_COURSES_ADMIN_API,
  ENROLL_WISHLIST_COURSE_API,
} = CourseEnrollmentEndPoints;

// ─────────────────────────────────────────────────────────────────────────────
// 1. Enroll in a course  (student)
//    POST /enrollments/enroll
//
//    Request body : { courseId }
//    Response     : { success, message, data: { courseEnrollment:
//                     { _id, userId, courseId, createdAt, updatedAt } } }
//
//    On success:
//      • stores the new enrollment in Redux
//      • invalidates the enrolled-courses cache (enrolledCoursesFetched = false)
//        so the next getMyEnrolledCourses call always re-fetches fresh data
//      • navigates to the course player page
// ─────────────────────────────────────────────────────────────────────────────
export const enrollInCourse = (courseId, token, navigate) => async (dispatch) => {
  const toastId = toast.loading("Enrolling in course...");
  dispatch(enrollStart());

  try {
    const response = await apiConnector(
      "POST",
      ENROLL_COURSE_API,
      { courseId },
      { Authorization: `Bearer ${token}` }
    );

    console.log("ENROLL_COURSE_API RESPONSE>>>>>>>>>", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    // response.data.data.courseEnrollment
    const enrollment = response.data.data.courseEnrollment;

    dispatch(enrollSuccess(enrollment));
    toast.success("Enrolled successfully!");

    // Navigate to course player after enroll
    if (navigate) navigate(`/courses/${courseId}/learn`);

    return enrollment;
  } catch (error) {
    console.log("ENROLL_COURSE_API ERROR", error);
    toast.error(error?.response?.data?.message || "Enrollment failed. Please try again.");
    dispatch(enrollFailure(error?.response?.data?.message || "Enrollment failed."));
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};
export const enrollInWishlist = (navigate) => async (dispatch) => {
  const toastId = toast.loading("Enrolling in wishlist...");
  dispatch(enrollStart());

  try {
    const response = await apiConnector(
      "POST",
      ENROLL_WISHLIST_COURSE_API,
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    const enrollments = response.data.data.enrollments;
    dispatch(enrollWishlistSuccess(enrollments));
    toast.success("Enrolled successfully!");

    dispatch(resetCart());
    if (navigate) navigate(`/dashboard/enrolled-courses`);

    return enrollments;
  } catch (error) {
    console.log("ENROLL_WISHLIST_COURSE_API ERROR", error);
    toast.error(error?.response?.data?.message || "Enrollment failed. Please try again.");
    dispatch(enrollFailure(error?.response?.data?.message || "Enrollment failed."));
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Get enrolled courses for the logged-in student
//    GET /enrollments/getmy
//
//    Response: { success, message, data: { courseEnrollments: [
//      { _id, userId, courseId: { _id, courseName, thumbnailUrl,
//        instructorId, progress, totalDuration }, createdAt, updatedAt }
//    ] } }
//
//    Cache strategy:
//      forceRefresh = false (default) → skip API call if already in store
//      forceRefresh = true            → always fetch  (call after enroll/unenroll)
// ─────────────────────────────────────────────────────────────────────────────
export const getMyEnrolledCourses =
  (token, forceRefresh = false) =>
    async (dispatch, getState) => {
      // ── Cache hit: return early if data is already loaded ─────────────────
      const { enrolledCoursesFetched } = getState().enrollment;
      if (enrolledCoursesFetched && !forceRefresh) return;

      const toastId = toast.loading("Loading...");
      dispatch(fetchEnrolledCoursesStart());

      try {
        const response = await apiConnector(
          "GET",
          GET_ALL_ENROLLED_COURSES_STUDENT_API,
          null,
          { Authorization: `Bearer ${token}` }
        );

        console.log("GET_ALL_ENROLLED_COURSES_STUDENT_API RESPONSE>>>>>>>>>", response);

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        // response.data.data.courseEnrollments  →  array
        const courseEnrollments = response.data.data.courseEnrollments;

        dispatch(fetchEnrolledCoursesSuccess(courseEnrollments));
        return courseEnrollments;
      } catch (error) {
        console.log("GET_ALL_ENROLLED_COURSES_STUDENT_API ERROR", error);
        toast.error(error?.response?.data?.message || "Failed to fetch enrolled courses.");
        dispatch(fetchEnrolledCoursesFailure(error?.response?.data?.message || "Fetch failed."));
        return null;
      } finally {
        toast.dismiss(toastId);
      }
    };

// ─────────────────────────────────────────────────────────────────────────────
// 3. Get ALL enrollments — admin only
//    GET /enrollments/getall
//
//    Same response shape and cache strategy as getMyEnrolledCourses.
// ─────────────────────────────────────────────────────────────────────────────
export const getAllEnrollmentsAdmin =
  (token, forceRefresh = false) =>
    async (dispatch, getState) => {
      // ── Cache hit ─────────────────────────────────────────────────────────
      const { allEnrollmentsFetched } = getState().enrollment;
      if (allEnrollmentsFetched && !forceRefresh) return;

      const toastId = toast.loading("Loading...");
      dispatch(fetchAllEnrollmentsStart());

      try {
        const response = await apiConnector(
          "GET",
          GET_ALL_ENROLLED_COURSES_ADMIN_API,
          null,
          { Authorization: `Bearer ${token}` }
        );

        console.log("GET_ALL_ENROLLED_COURSES_ADMIN_API RESPONSE>>>>>>>>>", response);

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        // Normalize: same shape as student endpoint
        const enrollments = response.data.data.courseEnrollments;

        dispatch(fetchAllEnrollmentsSuccess(enrollments));
        return enrollments;
      } catch (error) {
        console.log("GET_ALL_ENROLLED_COURSES_ADMIN_API ERROR", error);
        toast.error(error?.response?.data?.message || "Failed to fetch all enrollments.");
        dispatch(fetchAllEnrollmentsFailure(error?.response?.data?.message || "Fetch failed."));
        return null;
      } finally {
        toast.dismiss(toastId);
      }
    };