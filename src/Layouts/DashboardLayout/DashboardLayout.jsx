"use client";

import DashboardNavbar from "@/Components/Dashboard/DashboardNavbar/DashboardNavbar";
import DashboardSidebar from "@/Components/Dashboard/DashboardSidebar/DashboardSidebar";
import AdminRoute from "@/Components/Routes/AdminRoute/AdminRoute";
import { usePathname } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";
import "@/assets/css/bootstrap.min.css";

export const AdminRouteContext = createContext({});

const DashboardLayout = ({ children }) => {
  const path = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const value = {
    isAdmin,
    isLoading,
    setIsAdmin,
    setIsLoading,
  };

  return (
    <AdminRouteContext.Provider value={value}>
      <AdminRoute>
        <DashboardNavbar />
        <DashboardSidebar />
        {children}
      </AdminRoute>
    </AdminRouteContext.Provider>
  );
};

export default DashboardLayout;
