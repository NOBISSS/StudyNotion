import React from 'react'
import { Route } from 'react-router-dom'
import { ACCOUNT_TYPE } from '../../utils/constants'
import { useSelector } from 'react-redux';

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