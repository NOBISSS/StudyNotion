import './App.css';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Home } from './pages/Home';
import { Login } from './components/core/Login';
import { Signup } from './components/core/signup';
import Navbar from './components/core/Navbar';
import CatalogItem from './components/core/CatalogItem';
import CourseDetail from './components/core/CourseDetail';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from './pages/VerifyEmail';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Dashboard from './pages/Dashboard';
import MyProfile from './components/core/Dashboard/MyProfile';
import OpenRoute from './components/core/Auth/OpenRoute';
import PrivateRoute from './components/core/Auth/PrivateRoute';
import Error from './pages/Error';
import Settings from './components/common/Settings';
import EnrolledCourses from './pages/EnrolledCourses';
import Cart from './components/core/Auth/Cart';
import MyCourses from './components/Instructor/MyCourses';
import AddCourse from './components/core/Dashboard/Add-Course/AddCourse';
import { ACCOUNT_TYPE } from './utils/constants';

function App() {
  const { user } = useSelector((state) => state.profile);

  return (
    <div className="w-screen min-h-screen bg-[#000917] font-inter">
      <Navbar />

      <Routes>
        {/* ── Public routes ──────────────────────────────────────── */}
        <Route path="/"                       element={<Home />} />
        <Route path="/about"                  element={<About />} />
        <Route path="/contact"                element={<ContactUs />} />
        <Route path="/verifyemail"            element={<VerifyEmail />} />
        <Route path="/catalog/:catalogName/:catalogId" element={<CatalogItem />} />
        <Route path="/courses/:courseId"      element={<CourseDetail />} />

        {/* ── Auth-only routes (redirect to dashboard if logged in) ─ */}
        <Route path="/login"            element={<OpenRoute><Login /></OpenRoute>} />
        <Route path="/signup"           element={<OpenRoute><Signup /></OpenRoute>} />
        <Route path="/forgotpassword"   element={<OpenRoute><ForgotPassword /></OpenRoute>} />
        <Route path="/update-password/:id" element={<OpenRoute><UpdatePassword /></OpenRoute>} />

        {/* ── Protected dashboard routes ─────────────────────────── */}
        <Route element={<PrivateRoute><Dashboard /></PrivateRoute>}>
          {/* Available to all authenticated users */}
          <Route path="/dashboard/my-profile"     element={<MyProfile />} />
          <Route path="/dashboard/cart"           element={<Cart />} />
          <Route path="/dashboard/settings"       element={<Settings />} />

          {/* Student-only routes */}
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses />} />
          )}

          {/* Instructor-only routes */}
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="/dashboard/my-courses" element={<MyCourses />} />
              <Route path="/dashboard/add-course" element={<AddCourse />} />
            </>
          )}
        </Route>

        {/* ── 404 ────────────────────────────────────────────────── */}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;