"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaBarsStaggered } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import axios from "axios";
import moment from "moment";
import logo from "@/assets/img/stc-logo-icon.png";

const DashboardNavbar = () => {
  const notiRef = useRef(null);
  const [isSidebarEnabled, setIsSidebarEnabled] = useState(false);
  const path = usePathname();
  const [show, setShow] = useState(false);
  const [orders, setOrders] = useState([]);
  const [limit, setLimit] = useState(4);

  const pendingOrders = orders?.filter(
    (order) => order?.payment_status === "pending"
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.API}/api/v1/order-list`
        );

        setOrders(response.data.data || []);
        console.log(response.data.data);
      } catch (error) {
        // Improved error handling
        if (error.response) {
          console.error(
            `Error fetching Orders: ${error.response.status} - ${error.response.data}`
          );
        } else if (error.request) {
          console.error("No response received from server:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (!path.startsWith("/dashboard")) {
      return;
    }

    // Sidebar Close on Outside Click
    document.addEventListener("click", function (event) {
      const sidebar = document.querySelector(".vertical-menu");
      const toggleButton = document.querySelector(".vertical-menu-btn");

      if (
        !sidebar?.contains(event.target) &&
        !toggleButton?.contains(event.target)
      ) {
        document.body.classList.remove("sidebar-enable");
      }
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [path]);

  const toggleSidebar = () => {
    if (typeof document === "undefined" || typeof window === "undefined")
      return;

    const currentSize = document.body.getAttribute("data-sidebar-size");

    document.body.classList.toggle("sidebar-enable");

    if (window.innerWidth >= 992) {
      document.body.setAttribute(
        "data-sidebar-size",
        currentSize === "sm" ? "lg" : "sm"
      );
    }

    setIsSidebarEnabled((prevState) => !prevState);
  };

  if (path.startsWith("/dashboard/login")) {
    return;
  }

  return (
    <nav id="page-topbar" className="isvertical-topbar">
      <div className="navbar-header">
        <div className="d-flex">
          {/* <!-- LOGO --> */}
          <div className="navbar-brand-box">
            <Link href="/dashboard" className="logo logo-dark">
              <span className="logo-sm">
                <img src={logo.src} alt="smart tech computers" />
              </span>
            </Link>
          </div>

          <button
            type="button"
            className="btn btn-sm px-3 font-size-24 header-item waves-effect vertical-menu-btn"
            onClick={() => toggleSidebar(!isSidebarEnabled)}
          >
            <i className="fa-solid fa-bars-staggered"></i>
            <FaBarsStaggered />
          </button>
        </div>

        <div className="d-flex align-items-center">
          <div className="dropdown d-inline-block">
            <button
              type="button"
              className="btn header-item noti-icon"
              id="page-header-notifications-dropdown-v"
              onClick={() => setShow(true)}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.45455 3.4881C6.04947 4.61889 3.63669 7.33014 3.63653 10.5164V16.7253L0.375499 19.3629C0.144442 19.5409 0 19.7945 0 20.0759V20.2035C0 21.2802 1.05824 22.153 2.36364 22.153H8.30287C8.56913 24.0982 10.5705 25.6098 13 25.6098C15.4295 25.6098 17.4309 24.0982 17.6971 22.153H23.6364C24.9418 22.153 26 21.2802 26 20.2035V20.0761C26.0001 19.7947 25.8557 19.541 25.6245 19.3629L22.3638 16.7256V10.5167C22.3637 7.33036 19.9507 4.61872 16.5455 3.48799V2.43688C16.5455 1.16681 15.3593 0.540947 14.8932 0.348687C14.2864 0.0983808 13.6138 0 13 0C12.3862 0 11.7136 0.0983808 11.1068 0.348687C10.6407 0.540947 9.45455 1.16681 9.45455 2.43688V3.4881ZM14.0955 2.92425C14.0894 2.94107 14.083 2.95765 14.0764 2.97398C13.723 2.94113 13.364 2.92425 13.0001 2.92425C12.6362 2.92425 12.2771 2.94114 11.9237 2.97401C11.917 2.95767 11.9106 2.94108 11.9045 2.92425H11.8182V2.43688C11.8182 2.16773 12.3468 1.9495 13 1.9495C13.6532 1.9495 14.1818 2.16773 14.1818 2.43688V2.92425H14.0955ZM15.3025 22.153H10.6975C10.9403 23.0167 11.879 23.6603 13 23.6603C14.121 23.6603 15.0597 23.0167 15.3025 22.153ZM6.00016 10.5164C6.00035 7.41792 9.11241 4.87375 13.0001 4.87375C16.8879 4.87375 20 7.41792 20.0001 10.5164H6.00016ZM6.00016 10.5164H20.0001V16.7256C20.0001 17.2493 20.2555 17.7509 20.7089 18.1175L23.288 20.2035H2.71208L5.6376 17.8373C5.86065 17.6605 6.00016 17.4119 6.00016 17.1347V10.5164Z"
                  fill="#192045"
                />
              </svg>

              {pendingOrders?.length ? (
                <>
                  <span className="noti-dot">{pendingOrders?.length}</span>
                </>
              ) : (
                <></>
              )}
            </button>
            <div
              className={`dropdown-menu dropdown-menu-xl dropdown-menu-start p-0 page-header-notifications-dropdown-v ${
                show ? "show" : ""
              }`}
              aria-labelledby="page-header-notifications-dropdown-v"
              style={{ right: "0px" }}
              ref={notiRef}
            >
              <div className="p-3">
                <div className="row align-items-center">
                  <div className="col">
                    <h5 className="m-0 font-size-15">Notifications</h5>
                  </div>
                  {/* <div className="col-auto">
                    <a
                      href="#!"
                      className="small fw-semibold text-decoration-underline"
                    >
                      Mark all as read
                    </a>
                  </div> */}
                </div>
              </div>
              <div data-simplebar style={{ maxHeight: "250px" }}>
                {pendingOrders?.slice(0, limit)?.map((order, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="text-reset notification-item"
                  >
                    <div className="d-flex">
                      <div className="flex-grow-1">
                        <p className="text-muted font-size-13 mb-0 float-end">
                          {moment(order?.updatedAt).fromNow()}
                        </p>
                        <h6 className="mb-1 noti-heading">
                          {order?.billingDetails?.cus_name} Placed an order
                        </h6>
                        <div>
                          <p className="mb-0">{order?.orderID}</p>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="p-2 border-top d-grid">
                <a
                  className="btn btn-link font-size-14 btn-block text-center"
                  style={{
                    display: "inline-block",
                    cursor: "pointer",
                    zIndex: "1",
                  }}
                >
                  <i className="uil-arrow-circle-right me-1"></i>
                  <span onClick={() => setLimit(12)}>View More..</span>
                </a>
              </div>
            </div>
          </div>
          <Link href={"/"}>
            <button type="submit" className="website-btn">
              Go To Website
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
