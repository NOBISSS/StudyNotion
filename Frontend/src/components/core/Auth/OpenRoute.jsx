import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const OpenRoute = ({children}) => {
    const {token}=useSelector((state)=>state.auth);
    console.log("IN OPEN ROUTE TOKEN:",token);
    if(token){
        return <Navigate to="/dashboard/my-profile"/>
    }
    return children
}

export default OpenRoute