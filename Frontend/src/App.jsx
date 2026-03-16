import './App.css'
import {Route,Routes} from "react-router-dom"
import { Home } from './pages/Home';
import { Login } from './components/core/Login';
import Navbar from './components/core/Navbar';
import CatalogItem from './components/core/CatalogItem';
import { Signup } from './components/core/signup';
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
import { ACCOUNT_TYPE } from './utils/constants';
import { useSelector } from 'react-redux';
import MyCourses from './components/Instructor/MyCourses';
import AddCourse from './components/core/Dashboard/Add-Course/AddCourse';
import AppRoutes from './components/Routes/AppRoutes';
function App() {
  const {user}=useSelector((state)=>state.profile);
  return (
    <div className='w-screen min-h-screen outline outline-red-500 bg-[#000917] font-inter'>
      <Navbar/>
      <AppRoutes/>
    </div>
  )
}

export default App;
