import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import { setToken } from '../../../slices/authSlice';

const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
        return payload.exp && payload.exp < currentTime;
    } catch (error) {
        console.error("Invalid token format:", error);
        return true; // treat as expired if decoding fails
    }
};

const PrivateRoute = ({children}) => {
    const {token}=useSelector((state)=> state.auth);
    const dispatch=useDispatch();
    if (!token) {
        console.log("❌ No token found, redirecting to login");
        return <Navigate to="/login" replace />;
    }

    if(isTokenExpired(token)){
        console.log("⚠️ Token expired, logging out");
        dispatch(setToken(null)); // removes from Redux + localStorage
        return <Navigate to="/login" replace />;
    }
    
    return children;
}

export default PrivateRoute