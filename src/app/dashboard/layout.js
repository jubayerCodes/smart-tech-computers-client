import React from "react";
import "@/assets/css/style.css";
import "@/assets/css/navbar-sidebar.css";
import "@/assets/css/all-modal.css";
import "@/assets/css/table-function.css";
import DashboardLayout from "@/Layouts/DashboardLayout/DashboardLayout";
import { Toaster } from 'react-hot-toast'; // Import Toaster

export const metadata = {
    title: "Dashboard | ABC Computers",
};

const layout = ({ children }) => {
    return (
        <>
            <Toaster /> {/* Add Toaster component here to display toast notifications */}
            <DashboardLayout>{children}</DashboardLayout>
        </>
    );
};

export default layout;
