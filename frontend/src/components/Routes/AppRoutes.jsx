// components/Routes/AppRoutes.jsx
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ACCOUNT_TYPE } from '../../utils/constants'

// ─── Page Loader ──────────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-[#000917]">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2C333F] border-t-[#FFD60A]" />
      <p className="text-[#6B7280] text-xs">Loading...</p>
    </div>
  </div>
)

// ─── Lazy imports — every page loaded only when first visited ─────────────────
// Public pages
const Home              = lazy(() => import('../../pages/Home').then(m => ({ default: m.Home })))
const About             = lazy(() => import('../../pages/About'))
const ContactUs         = lazy(() => import('../../pages/ContactUs'))
const Error             = lazy(() => import('../../pages/Error'))

// Auth pages
const Login             = lazy(() => import('../core/Login').then(m => ({ default: m.Login })))
const Signup            = lazy(() => import('../core/Signup').then(m => ({ default: m.Signup })))
const ForgotPassword    = lazy(() => import('../../pages/ForgotPassword'))
const ReactivateAccount = lazy(() => import('../../pages/ReactivateAccount'))
const UpdatePassword    = lazy(() => import('../../pages/UpdatePassword'))
const VerifyEmail       = lazy(() => import('../../pages/VerifyEmail'))
const ResetPassword     = lazy(() => import('../../pages/ResetPassword'))

// Catalog / Course
const CatalogItem       = lazy(() => import('../core/CatalogItem'))
const CourseDetail      = lazy(() => import('../core/CourseDetail'))

// Dashboard shell + shared pages
const Dashboard         = lazy(() => import('../../pages/Dashboard'))
const MyProfile         = lazy(() => import('../core/Dashboard/MyProfile'))
const Settings          = lazy(() => import('../common/Settings'))
const Cart              = lazy(() => import('../core/Auth/Cart'))
const Checkout          = lazy(() => import('../core/Auth/Cart/Checkout'))

// Student-only pages
const EnrolledCourses   = lazy(() => import('../../pages/EnrolledCourses'))
const VideoDetail       = lazy(() => import('../Video/VideoDetail'))
const StudentDashboard  = lazy(() => import('../Analytic-Dashboard/StudentDashboard'))

// Instructor-only pages
const MyCourses         = lazy(() => import('../Instructor/MyCourses'))
const AddCourse         = lazy(() => import('../core/Dashboard/Add-Course/AddCourse'))
const InstructorDashboard = lazy(() => import('../Analytic-Dashboard/InstructorDashboard'))

// Auth guards
import OpenRoute    from '../core/Auth/OpenRoute'
import PrivateRoute from '../core/Auth/PrivateRoute'

// ─── AppRoutes ────────────────────────────────────────────────────────────────
// KEY FIX for "why it breaks when moved to a separate file":
// useSelector MUST be called inside a component that is a DESCENDANT of <Provider>.
// AppRoutes is rendered inside App.jsx which is already inside <Provider> in main.jsx,
// so it works. The only other common mistake is forgetting to wrap lazy() with Suspense.

const AppRoutes = () => {
  const { user } = useSelector((state) => state.profile)
  const isStudent    = user?.accountType === ACCOUNT_TYPE.STUDENT
  const isInstructor = user?.accountType === ACCOUNT_TYPE.INSTRUCTOR

  return (
    // ✅ Suspense wraps ALL routes — handles any lazy-loaded page
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* ── Public ───────────────────────────────────────────────── */}
        <Route path="/"                              element={<Home />} />
        <Route path="/about"                         element={<About />} />
        <Route path="/contact"                       element={<ContactUs />} />
        <Route path="/verifyemail"                   element={<VerifyEmail />} />
        <Route path="/catalog/:catalogName/:catalogId" element={<CatalogItem />} />
        <Route path="/courses/:courseId"             element={<CourseDetail />} />

        {/* ── Open (redirect if logged in) ─────────────────────────── */}
        <Route path="/login"            element={<OpenRoute><Login /></OpenRoute>} />
        <Route path="/signup"           element={<OpenRoute><Signup /></OpenRoute>} />
        <Route path="/forgotpassword"   element={<OpenRoute><ForgotPassword /></OpenRoute>} />
        <Route path="/forgotpassword/verify"   element={<OpenRoute><VerifyEmail /></OpenRoute>} />
        <Route path="/reactivate-account"   element={<OpenRoute><ReactivateAccount /></OpenRoute>} />
        <Route path="/reactivate-account/verify"   element={<OpenRoute><VerifyEmail /></OpenRoute>} />
        <Route path="/update-password/:id" element={<OpenRoute><UpdatePassword /></OpenRoute>} />
        <Route path="/resetpassword"    element={<OpenRoute><ResetPassword /></OpenRoute>} />

        {/* ── Analytics dashboards ──────────────────────────────────── */}
        <Route path="/dashboard/analytics" element={
          isStudent ? <StudentDashboard /> : <InstructorDashboard />
        } />

        {/* ── Protected dashboard ───────────────────────────────────── */}
        <Route element={<PrivateRoute><Dashboard /></PrivateRoute>}>

          {/* All authenticated users */}
          <Route path="/dashboard/my-profile"  element={<MyProfile />} />
          <Route path="/dashboard/settings"    element={<Settings />} />
          <Route path="/dashboard/cart"        element={<Cart />} />
          <Route path="/dashboard/checkout"    element={<Checkout />} />

          {/* Student-only */}
          {isStudent && (
            <>
              <Route path="/dashboard/enrolled-courses"          element={<EnrolledCourses />} />
              <Route path="/courses/:courseId/learn"             element={<VideoDetail />} />
              <Route path="/courses/:courseId/learn/:subSectionId" element={<VideoDetail />} />
            </>
          )}

          {/* Instructor-only */}
          {isInstructor && (
            <>
              <Route path="/dashboard/my-courses"  element={<MyCourses />} />
              <Route path="/dashboard/add-course"  element={<AddCourse />} />
            </>
          )}
        </Route>

        {/* ── 404 ──────────────────────────────────────────────────── */}
        <Route path="*" element={<Error />} />

      </Routes>
    </Suspense>
  )
}

export default AppRoutes