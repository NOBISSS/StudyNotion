// pages/Dashboard.jsx
import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/core/Dashboard/Sidebar'

const Dashboard = () => {
  const { loading: authLoading }    = useSelector(state => state.auth)
  const { loading: profileLoading } = useSelector(state => state.profile)
  const location = useLocation()

  if (profileLoading || authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2C3244] border-t-[#FFD60A]" />
      </div>
    )
  }

  // VideoDetail has its own full-page layout — no sidebar needed
  // Route: /courses/:courseId/learn  or  /courses/:courseId/learn/:subSectionId
  const isVideoPage = location.pathname.includes("/learn")

  if (isVideoPage) {
    return <Outlet />
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.0rem)]">
      <Sidebar />
      <div className="h-[calc(100vh-3.0rem)] w-full overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard