"use client";
import React from 'react';
// Note: Replace Outlet with children in Next.js layout
import { useRouter, usePathname, redirect } from "next/navigation";


const ProtectedRoute = () => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
        return {/* Navigate "/login" handled in layout or effect */};
    }

    return <Outlet />;
};

export default ProtectedRoute;
