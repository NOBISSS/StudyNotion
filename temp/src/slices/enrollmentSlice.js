import { createSlice } from "@reduxjs/toolkit";

// ─── State shape ──────────────────────────────────────────────────────────────
//
//  enrolledCourses        — array of courseEnrollment objects for the current student
//                           Each item shape (from GET /enrollments/getmy):
//                           {
//                             _id, userId,
//                             courseId: { _id, courseName, thumbnailUrl,
//                                         instructorId, progress, totalDuration },
//                             createdAt, updatedAt
//                           }
//
//  enrolledCoursesFetched — boolean; true once the list has been successfully loaded
//                           Used to skip redundant API calls (cache flag)
//
//  enrolledCourseIds      — Set-like object { [courseId]: true }
//                           Lets components do O(1) "is this course enrolled?" checks
//
//  allEnrollments         — full enrollment list (admin view)
//  allEnrollmentsFetched  — cache flag for admin list
//
//  enrolling              — true while POST /enrollments/enroll is in-flight
//  enrollError            — last enroll error message (string | null)
//
//  loadingEnrolled        — true while GET /enrollments/getmy is in-flight
//  enrolledError          — last fetch error message (string | null)
//
//  loadingAll             — true while GET /enrollments/getall is in-flight
//  allError               — last admin-fetch error message (string | null)
//
const initialState = {
  // Student enrolled courses
  enrolledCourses:        [],
  enrolledCoursesFetched: false,
  enrolledCourseIds:      {},   // { [courseId]: true } for O(1) lookup

  // Admin — all enrollments
  allEnrollments:         [],
  allEnrollmentsFetched:  false,

  // Loading / error flags
  enrolling:        false,
  enrollError:      null,

  loadingEnrolled:  false,
  enrolledError:    null,

  loadingAll:       false,
  allError:         null,
};

const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState,

  reducers: {
    // ── Enroll in a course ──────────────────────────────────────────────────
    enrollStart(state) {
      state.enrolling   = true;
      state.enrollError = null;
    },

    // payload: courseEnrollment object from POST response
    // { _id, userId, courseId (string — not populated), createdAt, updatedAt }
    enrollSuccess(state, action) {
      state.enrolling = false;
      const enrollment = action.payload;

      // Add to enrolledCourses list.
      // courseId here is a raw string (not populated), so we store a minimal
      // stub; the full populated data comes on the next getmy call.
      // We mark enrolledCoursesFetched = false so the next getmy call refreshes.
      state.enrolledCourses.push(enrollment);
      state.enrolledCoursesFetched = false; // invalidate cache → force re-fetch

      // Register the courseId in the fast-lookup map
      const cid =
        typeof enrollment.courseId === "object"
          ? enrollment.courseId?._id
          : enrollment.courseId;
      if (cid) state.enrolledCourseIds[cid] = true;
    },

    enrollFailure(state, action) {
      state.enrolling   = false;
      state.enrollError = action.payload; // error message string
    },

    // ── Fetch enrolled courses (student) ────────────────────────────────────
    fetchEnrolledCoursesStart(state) {
      state.loadingEnrolled = true;
      state.enrolledError   = null;
    },

    // payload: courseEnrollments array from GET /enrollments/getmy
    // Each item: { _id, userId, courseId: { _id, courseName, thumbnailUrl,
    //              instructorId, progress, totalDuration }, createdAt }
    fetchEnrolledCoursesSuccess(state, action) {
      state.loadingEnrolled        = false;
      state.enrolledCourses        = action.payload;
      state.enrolledCoursesFetched = true;

      // Build fast-lookup map from populated courseId._id
      state.enrolledCourseIds = {};
      action.payload.forEach((enrollment) => {
        const cid =
          typeof enrollment.courseId === "object"
            ? enrollment.courseId?._id
            : enrollment.courseId;
        if (cid) state.enrolledCourseIds[cid] = true;
      });
    },

    fetchEnrolledCoursesFailure(state, action) {
      state.loadingEnrolled = false;
      state.enrolledError   = action.payload;
    },

    // ── Fetch all enrollments (admin) ────────────────────────────────────────
    fetchAllEnrollmentsStart(state) {
      state.loadingAll = true;
      state.allError   = null;
    },

    fetchAllEnrollmentsSuccess(state, action) {
      state.loadingAll            = false;
      state.allEnrollments        = action.payload;
      state.allEnrollmentsFetched = true;
    },

    fetchAllEnrollmentsFailure(state, action) {
      state.loadingAll = false;
      state.allError   = action.payload;
    },

    // ── Utility ──────────────────────────────────────────────────────────────

    // Invalidate student cache (call after unenroll or any mutation)
    invalidateEnrolledCache(state) {
      state.enrolledCoursesFetched = false;
    },

    // Invalidate admin cache
    invalidateAdminCache(state) {
      state.allEnrollmentsFetched = false;
    },

    // Full reset on logout
    resetEnrollmentState() {
      return initialState;
    },
  },
});

export const {
  enrollStart,
  enrollSuccess,
  enrollFailure,
  fetchEnrolledCoursesStart,
  fetchEnrolledCoursesSuccess,
  fetchEnrolledCoursesFailure,
  fetchAllEnrollmentsStart,
  fetchAllEnrollmentsSuccess,
  fetchAllEnrollmentsFailure,
  invalidateEnrolledCache,
  invalidateAdminCache,
  resetEnrollmentState,
} = enrollmentSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

/** Full list of enrollment objects (student view) */
export const selectEnrolledCourses      = (state) => state.enrollment.enrolledCourses;

/** true while GET /enrollments/getmy is in-flight */
export const selectEnrolledLoading      = (state) => state.enrollment.loadingEnrolled;

/** Error string from the last failed getmy call */
export const selectEnrolledError        = (state) => state.enrollment.enrolledError;

/** true once the student list has been fetched at least once */
export const selectEnrolledFetched      = (state) => state.enrollment.enrolledCoursesFetched;

/** true while POST /enrollments/enroll is in-flight */
export const selectEnrolling            = (state) => state.enrollment.enrolling;

/** Error string from the last failed enroll call */
export const selectEnrollError          = (state) => state.enrollment.enrollError;

/**
 * Returns true if the given courseId is in the student's enrollment list.
 * Usage in component:
 *   const isEnrolled = useSelector(selectIsEnrolled(courseId));
 */
export const selectIsEnrolled = (courseId) => (state) =>
  Boolean(state.enrollment.enrolledCourseIds[courseId]);

/** Full list of all enrollment objects (admin view) */
export const selectAllEnrollments       = (state) => state.enrollment.allEnrollments;

/** true while GET /enrollments/getall is in-flight */
export const selectAllEnrollmentsLoading = (state) => state.enrollment.loadingAll;

/** true once the admin list has been fetched at least once */
export const selectAllEnrollmentsFetched = (state) => state.enrollment.allEnrollmentsFetched;

export default enrollmentSlice.reducer;