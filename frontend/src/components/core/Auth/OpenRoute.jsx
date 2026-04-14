import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const OpenRoute = ({ children }) => {
    const { token, loading } = useSelector((state) => state.auth);
    if (loading) return <div>Loading...</div>
    if (token) {
        return <Navigate to="/dashboard/my-profile" />
    }
    return children
}

export default OpenRoute