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
function App() {
  const {user}=useSelector((state)=>state.profile);
  return (
    <div className='w-screen min-h-screen outline outline-red-500 bg-[#000917] font-inter'>
      <Navbar/>
      <Routes>
        <Route path='/' element={
          <OpenRoute>
          <Home/>
          </OpenRoute>
          }/>

        <Route path='/catalog/:catalogName/:catalogId' element={
          <OpenRoute>
          <CatalogItem/>
          </OpenRoute>
          }/>
        <Route path='/signup' element={
          <OpenRoute>
          <Signup/>
          </OpenRoute>
          }/>
        <Route path='/forgotpassword' element={
          <OpenRoute>
          <ForgotPassword/>
          </OpenRoute>
          }/>

        <Route path='/update-password/:id' element={
          <OpenRoute>
          <UpdatePassword/>
          </OpenRoute>}/>
        <Route path='/verifyemail' element={<VerifyEmail/>}/>
        <Route path='/about' element={
          <OpenRoute>
          <About/>
          </OpenRoute>
          }/>
        <Route path='/contact' element={<ContactUs/>}/>
        
        <Route element={<PrivateRoute><Dashboard/></PrivateRoute>}>
            <Route path="/dashboard/my-profile" element={<MyProfile />}/>
            <Route path="/dashboard/cart" element={<Cart />}/>
            <Route path="/dashboard/settings" element={<Settings/>}/>
            <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses/>}/>
            {
              user?.accountType===ACCOUNT_TYPE.STUDENT && (
                <>
                <Route path="/dashboard/settings" element={<Settings/>}/>
                <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses/>}/>
                </>
              )
            }
            {
              user?.accountType===ACCOUNT_TYPE.INSTRUCTOR && (
                <>
                <Route path="/dashboard/my-courses" element={<MyCourses/>}/>
                <Route path="/dashboard/add-course" element={<AddCourse/>}/>
                </>
              )
            }

        </Route>
        
        <Route path='/login' element={<Login/>}/>
        <Route path='*' element={<Error/>}/>
        </Routes>
        
    </div>

  )
}

export default App;
