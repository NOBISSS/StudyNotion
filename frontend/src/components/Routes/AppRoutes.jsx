import React from 'react'
import {Route,Routes} from "react-router-dom"
import { Home } from '../../pages/Home';
import { Login } from '../core/Login';
import CatalogItem from '../core/CatalogItem';
import { Signup } from '../core/signup';
import ForgotPassword from '../../pages/ForgotPassword';
import UpdatePassword from '../../pages/UpdatePassword';
import VerifyEmail from '../../pages/VerifyEmail';
import About from '../../pages/About';
import ContactUs from '../../pages/ContactUs';
import Dashboard from '../../pages/Dashboard';
import MyProfile from '../core/Dashboard/MyProfile';
import OpenRoute from '../core/Auth/OpenRoute';
import PrivateRoute from '../core/Auth/PrivateRoute';
import Error from '../../pages/Error';
import Settings from '../common/Settings';
import EnrolledCourses from '../../pages/EnrolledCourses';
import Cart from '../core/Auth/Cart';
import { ACCOUNT_TYPE } from '../../utils/constants';
import { useSelector } from 'react-redux';
import MyCourses from '../Instructor/MyCourses';
import AddCourse from '../core/Dashboard/Add-Course/AddCourse';

const AppRoutes = () => {
    const {user}=useSelector((state)=>state.profile);
  return (
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
                {/* <Route path="/dashboard/add-course" element={<AddCourse/>}/> */}
                <Route path="/dashboard/add-course" element={<AddCourse/>}/>
                </>
              )
            }

        </Route>
        
        <Route path='/login' element={<Login/>}/>
        <Route path='*' element={<Error/>}/>
        </Routes>
  )
}

export default AppRoutes