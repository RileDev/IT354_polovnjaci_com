import React from 'react'
import {useAuthStore} from "../stores/authStore.ts";
import {useLocation, Navigate, Outlet} from "react-router-dom";

const ProtectedRoute = () => {
    const {user, isLoading} = useAuthStore()
    const location = useLocation()

    if(isLoading)
        return <div className="flex justify-center p-10">Učitavanje...</div>;


    if(!user)
        return <Navigate to="/prijava" state={{ from: location }} replace />;


    return <Outlet />
}
export default ProtectedRoute
