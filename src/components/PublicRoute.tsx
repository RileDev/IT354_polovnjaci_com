import React from 'react'
import {useAuthStore} from "../stores/authStore.ts";
import {Navigate, Outlet} from "react-router-dom";

const PublicRoute = () => {
    const { user, isLoading } = useAuthStore();

    if(isLoading)
        return <div className="flex justify-center p-10">Učitavanje...</div>;

    if(user)
        return <Navigate to="/" replace />;

    return <Outlet />
}
export default PublicRoute
