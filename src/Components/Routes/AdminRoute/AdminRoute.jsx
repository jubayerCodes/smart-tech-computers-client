"use client";
import { AdminRouteContext } from "@/Layouts/DashboardLayout/DashboardLayout";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const AdminRoute = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAdmin, isLoading, setIsAdmin, setIsLoading } =
    useContext(AdminRouteContext);

  useEffect(() => {
    setIsLoading(true);
    setIsAdmin(false);

    const fetchAdmin = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/v1/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const result = await response?.data;

        if (result?.status === "success") {
          setIsAdmin(true);
          setIsLoading(false);
          return;
        } else {
          setIsAdmin(false);
          setIsLoading(false);
          if (pathname !== "/dashboard") {
            toast.error(result?.message);
          }
          return;
        }
      } catch (error) {
        setIsAdmin(false);
        setIsLoading(false);
        console.log(error);
      }
    };

    fetchAdmin();
  }, [pathname]);

  useEffect(() => {
    if (!isAdmin && !isLoading && !pathname.startsWith("/dashboard/login")) {
      return router.push("/dashboard/login");
    }
  }, [isLoading, isAdmin, isLoading, pathname]);

  if (isLoading) {
    return <></>;
  }

  return (
    <>{isAdmin || pathname.startsWith("/dashboard/login") ? children : <></>}</>
  );
};

export default AdminRoute;
