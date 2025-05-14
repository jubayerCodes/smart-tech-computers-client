"use client";

import { useEffect, useState } from "react";
import logo from "@/assets/img/main_logo_stc.png";
import logoSm from "@/assets/img/stc-logo-icon.png";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DashboardActiveLink from "../DashboardActiveLink/DashboardActiveLink";
import DashboardSubmenu from "../DashboardSubmenu/DashboardSubmenu";

const DashboardSidebar = () => {
  const path = usePathname();
  const router = useRouter();
  const [isSidebarEnabled, setIsSidebarEnabled] = useState(false);

  useEffect(() => {
    // Ensure code runs only in the browser
    if (typeof window === "undefined" || typeof document === "undefined")
      return;
  }, []);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Make a POST request to the logout endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/Logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request to maintain session
      });

      // Check if the request was successful
      if (response.ok) {
        // Clear the client-side authentication token (if it's stored in localStorage)
        localStorage.removeItem("token"); // Clear any stored token from localStorage

        // Optionally, also clear sessionStorage if used
        sessionStorage.removeItem("token"); // Clear session storage if token is stored there

        // Redirect the user to the login page after successful logout
        router.push("/dashboard/login"); // Redirect to login
      } else {
        // Handle errors if the response is not OK (e.g., display a message to the user)
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      // Handle any errors that occur during the fetch request
      console.error("Error during logout:", error);
    }
  };

  // Hide the sidebar if the user is on the login page
  if (path.startsWith("/dashboard/login")) {
    return null;
  }

  // Function to toggle the sidebar
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

  const handleSubmenuToggle = (item) => {
    if (typeof document === "undefined") return;

    const currentActive = item?.classList?.contains("active");

    if (currentActive) {
      item?.classList?.remove("active");
      return;
    }

    const activeSubmenu = document.querySelector(
      ".vertical-menu .submenu-active.active"
    );

    if (activeSubmenu) {
      activeSubmenu?.classList?.remove("active");
    }

    item?.classList?.add("active");
  };

  return (
    <div className="vertical-menu">
      <button
        type="button"
        className="btn btn-sm px-3 font-size-24 header-item waves-effect vertical-menu-btn"
        onClick={() => toggleSidebar(!isSidebarEnabled)}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="8" fill="#EEEEEE" />
          <path
            d="M9.5 9.5V30.5M30.5 20H14.1667M14.1667 20L22.3333 28.1667M14.1667 20L22.3333 11.8333"
            stroke="#171717"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {/* <!-- LOGO Box --> */}
      <div className="navbar-brand-box">
        <Link href="/dashboard" className="logo logo-dark">
          <span className="logo-sm">
            <svg
              width="52"
              height="53"
              viewBox="0 0 52 53"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.2051 35.4792V14.3447H21.5219V20.7907C22.8582 20.0059 23.9075 19.5898 26.2534 19.5898C28.2403 19.5898 29.884 20.5005 31.1847 21.8557C32.4854 23.2012 33.1357 25.1378 33.1357 27.6655C33.1357 30.2797 32.47 32.2932 31.1386 33.706C29.8175 35.1188 28.2096 35.592 26.3149 35.592C25.3829 35.592 24.4612 35.609 23.5497 35.1765C22.6484 34.7344 21.8701 34.0856 21.2146 33.2303V35.4792H17.2051ZM21.4911 27.4925C21.4911 29.0783 21.7574 30.2509 22.29 31.0101C23.0376 32.0866 24.031 32.6248 25.2702 32.6248C26.2227 32.6248 27.0318 32.2451 27.6975 31.4859C28.3734 30.717 28.7114 29.5108 28.7114 27.8673C28.7114 26.1182 28.3734 24.8591 27.6975 24.0902C27.0215 23.3118 26.1561 22.9225 25.1013 22.9225C24.0669 22.9225 23.2066 23.3021 22.5204 24.0614C21.8342 24.8111 21.4911 25.9548 21.4911 27.4925Z"
                fill="url(#paint0_linear_2019_70)"
              />
              <path
                d="M10.7068 24.8169L6.59549 24.1501C7.05767 22.662 7.85306 21.5604 8.98165 20.8453C10.1102 20.1302 11.787 19.7727 14.0119 19.7727C16.0327 19.7727 17.5375 19.9901 18.5263 20.425C19.5152 20.8502 20.2084 21.3961 20.6061 22.0629C21.0146 22.72 21.2188 23.9327 21.2188 25.7011L21.1704 30.4554C21.1704 31.8082 21.4735 32.5752 21.6132 33.2227C21.7637 33.8604 24.2679 34.7797 24.6656 35.5141L17.7202 35.3975C17.6019 35.1269 17.4568 34.8425 17.2849 34.311C17.2096 34.0694 17.5056 34.4929 17.4734 34.4156C16.6995 35.0921 15.8719 35.133 14.9905 35.4712C14.1091 35.8095 12.8189 35.862 11.8193 35.862C10.0565 35.862 8.66457 35.432 7.64347 34.5719C6.63311 33.7119 6.12793 32.6248 6.12793 31.3106C6.12793 30.4409 6.35902 29.6678 6.82121 28.9914C7.28339 28.3053 7.9283 27.7835 8.75594 27.426C9.59432 27.0588 10.7981 26.7399 12.3674 26.4693C14.4849 26.1118 15.952 25.7784 16.7689 25.4692V25.0633C16.7689 24.2806 16.554 23.725 16.124 23.3964C15.6941 23.0582 14.8826 22.8891 13.6895 22.8891C12.8834 22.8891 12.2546 23.034 11.8031 23.3239C11.3517 23.6042 10.9862 24.1018 10.7068 24.8169ZM16.7689 28.1217C16.1885 28.2957 15.2695 28.5034 14.0119 28.745C12.7544 28.9866 11.9321 29.2233 11.5452 29.4553C10.954 29.8321 10.6584 30.3105 10.6584 30.8902C10.6584 31.4604 10.8949 31.9532 11.3678 32.3687C11.8408 32.7842 12.4427 32.992 13.1736 32.992C13.9904 32.992 14.7697 32.7504 15.5114 32.2673C16.0595 31.9001 16.4196 31.4507 16.5916 30.9192C16.7098 30.5714 16.7689 29.9094 16.7689 28.9334V28.1217Z"
                fill="url(#paint1_linear_2019_70)"
              />
              <path
                d="M45.5514 24.672L41.2647 25.3967C41.1203 24.5947 40.7901 23.9907 40.2743 23.5848C39.7688 23.179 39.1085 22.9761 38.2934 22.9761C37.2102 22.9761 36.3435 23.3288 35.6936 24.0342C35.0539 24.7299 34.7341 25.8992 34.7341 27.5419C34.7341 29.3683 35.0591 30.6583 35.709 31.4121C36.3693 32.1658 37.2514 32.5427 38.3553 32.5427C39.1807 32.5427 39.8564 32.3252 40.3826 31.8904C40.9088 31.4459 41.2802 30.6873 41.4968 29.6147L45.768 30.296C45.3244 32.132 44.4733 33.5186 43.2146 34.456C41.9559 35.3933 40.2691 35.862 38.1542 35.862C35.7503 35.862 33.8314 35.1517 32.3973 33.7312C30.9736 32.3107 30.2617 30.3443 30.2617 27.8318C30.2617 25.2904 30.9787 23.3143 32.4128 21.9034C33.8468 20.483 35.7864 19.7727 38.2315 19.7727C40.233 19.7727 41.8218 20.1786 42.9979 20.9903C44.1844 21.7923 45.0355 23.0195 45.5514 24.672Z"
                fill="url(#paint2_linear_2019_70)"
              />
              <circle
                cx="26"
                cy="26.2988"
                r="25.5517"
                stroke="black"
                strokeWidth="0.896552"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_2019_70"
                  x1="25.1704"
                  y1="14.3447"
                  x2="25.1704"
                  y2="35.5921"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4CB050" />
                  <stop offset="1" stopColor="#337836" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_2019_70"
                  x1="15.3967"
                  y1="19.7727"
                  x2="15.3967"
                  y2="35.862"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4CB050" />
                  <stop offset="1" stopColor="#337836" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_2019_70"
                  x1="38.0149"
                  y1="19.7727"
                  x2="38.0149"
                  y2="35.862"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4CB050" />
                  <stop offset="1" stopColor="#337836" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="logo-sm2">
            <img src={logoSm.src} height={30} width={40} alt="smart tech computers" />
          </span>
          <span className="logo-lg">
            <img src={logo.src} width={180} alt="" />
          </span>
        </Link>
      </div>
      {/* <!-- Logo Box End --> */}

      {/* <!--- Side Menu --> */}
      <div data-simplebar className="sidebar-menu-scroll">
        <div id="sidebar-menu">
          {/* <!-- Left Menu Start --> */}
          <div className="nav">
            <div className="menu">
              <ul>
                <DashboardActiveLink href={"/dashboard"}>
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="44" height="44" rx="6" fill="#F4FFF2" />
                    <path
                      d="M18.5 16.1667H13.3667C12.7133 16.1667 12.3866 16.1667 12.137 16.2938C11.9175 16.4057 11.739 16.5842 11.6272 16.8037C11.5 17.0532 11.5 17.3799 11.5 18.0333V30.6333C11.5 31.2867 11.5 31.6134 11.6272 31.863C11.739 32.0825 11.9175 32.261 12.137 32.3728C12.3866 32.5 12.7133 32.5 13.3667 32.5H18.5M18.5 32.5H25.5M18.5 32.5L18.5 13.3667C18.5 12.7133 18.5 12.3866 18.6272 12.137C18.739 11.9175 18.9175 11.739 19.137 11.6272C19.3866 11.5 19.7133 11.5 20.3667 11.5L23.6333 11.5C24.2867 11.5 24.6134 11.5 24.863 11.6272C25.0825 11.739 25.261 11.9175 25.3728 12.137C25.5 12.3866 25.5 12.7133 25.5 13.3667V32.5M25.5 20.8333H30.6333C31.2867 20.8333 31.6134 20.8333 31.863 20.9605C32.0825 21.0723 32.261 21.2508 32.3728 21.4703C32.5 21.7199 32.5 22.0466 32.5 22.7V30.6333C32.5 31.2867 32.5 31.6134 32.3728 31.863C32.261 32.0825 32.0825 32.261 31.863 32.3728C31.6134 32.5 31.2867 32.5 30.6333 32.5H25.5"
                      stroke="#5AA469"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span className="text">DASHBOARD</span>
                </DashboardActiveLink>

                <DashboardSubmenu
                  handleSubmenuToggle={handleSubmenuToggle}
                  submenuItems={[
                    { title: "PRODUCTS", href: "/dashboard/products" },
                    { title: "BRANDS", href: "/dashboard/brands" },
                    { title: "CATEGORY", href: "/dashboard/category" },
                    { title: "SUB CATEGORY", href: "/dashboard/sub-category" },
                  ]}
                  submenuTitle={"PRODUCTS"}
                  icon={
                    <svg
                      width="44"
                      height="44"
                      viewBox="0 0 44 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="44" height="44" rx="6" fill="#F4FFF2" />
                      <path
                        d="M16.7497 20.8333H13.3663C12.7129 20.8333 12.3862 20.8333 12.1367 20.9605C11.9172 21.0723 11.7387 21.2508 11.6268 21.4703C11.4997 21.7199 11.4997 22.0466 11.4997 22.7V32.5M27.2497 20.8333H30.633C31.2864 20.8333 31.6131 20.8333 31.8627 20.9605C32.0822 21.0723 32.2607 21.2508 32.3725 21.4703C32.4997 21.7199 32.4997 22.0466 32.4997 22.7V32.5M27.2497 32.5V15.2333C27.2497 13.9265 27.2497 13.2731 26.9954 12.774C26.7717 12.335 26.4147 11.978 25.9757 11.7543C25.4765 11.5 24.8231 11.5 23.5163 11.5H20.483C19.1762 11.5 18.5228 11.5 18.0237 11.7543C17.5847 11.978 17.2277 12.335 17.004 12.774C16.7497 13.2731 16.7497 13.9265 16.7497 15.2333V32.5M33.6663 32.5H10.333M20.833 16.1667H23.1663M20.833 20.8333H23.1663M20.833 25.5H23.1663"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                />

                <DashboardSubmenu
                  handleSubmenuToggle={handleSubmenuToggle}
                  submenuItems={[
                    { title: "ORDERS", href: "/dashboard/orders" },
                    { title: "INVOICES", href: "/dashboard/invoices" },
                  ]}
                  submenuTitle={"ORDERS"}
                  icon={
                    <svg
                      width="44"
                      height="44"
                      viewBox="0 0 44 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="44" height="44" rx="6" fill="#F4FFF2" />
                      <path
                        d="M16.7497 20.8333H13.3663C12.7129 20.8333 12.3862 20.8333 12.1367 20.9605C11.9172 21.0723 11.7387 21.2508 11.6268 21.4703C11.4997 21.7199 11.4997 22.0466 11.4997 22.7V32.5M27.2497 20.8333H30.633C31.2864 20.8333 31.6131 20.8333 31.8627 20.9605C32.0822 21.0723 32.2607 21.2508 32.3725 21.4703C32.4997 21.7199 32.4997 22.0466 32.4997 22.7V32.5M27.2497 32.5V15.2333C27.2497 13.9265 27.2497 13.2731 26.9954 12.774C26.7717 12.335 26.4147 11.978 25.9757 11.7543C25.4765 11.5 24.8231 11.5 23.5163 11.5H20.483C19.1762 11.5 18.5228 11.5 18.0237 11.7543C17.5847 11.978 17.2277 12.335 17.004 12.774C16.7497 13.2731 16.7497 13.9265 16.7497 15.2333V32.5M33.6663 32.5H10.333M20.833 16.1667H23.1663M20.833 20.8333H23.1663M20.833 25.5H23.1663"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                />

                <DashboardSubmenu
                  handleSubmenuToggle={handleSubmenuToggle}
                  submenuItems={[
                    { title: "HERO SLIDER", href: "/dashboard/hero-slider" },
                  ]}
                  submenuTitle={"SLIDERS"}
                  icon={
                    <svg
                      width="44"
                      height="44"
                      viewBox="0 0 44 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="44" height="44" rx="6" fill="#F4FFF2" />
                      <path
                        d="M16.7497 20.8333H13.3663C12.7129 20.8333 12.3862 20.8333 12.1367 20.9605C11.9172 21.0723 11.7387 21.2508 11.6268 21.4703C11.4997 21.7199 11.4997 22.0466 11.4997 22.7V32.5M27.2497 20.8333H30.633C31.2864 20.8333 31.6131 20.8333 31.8627 20.9605C32.0822 21.0723 32.2607 21.2508 32.3725 21.4703C32.4997 21.7199 32.4997 22.0466 32.4997 22.7V32.5M27.2497 32.5V15.2333C27.2497 13.9265 27.2497 13.2731 26.9954 12.774C26.7717 12.335 26.4147 11.978 25.9757 11.7543C25.4765 11.5 24.8231 11.5 23.5163 11.5H20.483C19.1762 11.5 18.5228 11.5 18.0237 11.7543C17.5847 11.978 17.2277 12.335 17.004 12.774C16.7497 13.2731 16.7497 13.9265 16.7497 15.2333V32.5M33.6663 32.5H10.333M20.833 16.1667H23.1663M20.833 20.8333H23.1663M20.833 25.5H23.1663"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                />

                {/* <DashboardSubmenu
                  handleSubmenuToggle={handleSubmenuToggle}
                  submenuItems={[
                    { title: "INVENTORY", href: "/dashboard/inventory" },
                  ]}
                  submenuTitle={"INVENTORY"}
                  icon={
                    <svg
                      width="44"
                      height="44"
                      viewBox="0 0 44 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="44" height="44" rx="6" fill="#F4FFF2" />
                      <path
                        d="M16.7497 20.8333H13.3663C12.7129 20.8333 12.3862 20.8333 12.1367 20.9605C11.9172 21.0723 11.7387 21.2508 11.6268 21.4703C11.4997 21.7199 11.4997 22.0466 11.4997 22.7V32.5M27.2497 20.8333H30.633C31.2864 20.8333 31.6131 20.8333 31.8627 20.9605C32.0822 21.0723 32.2607 21.2508 32.3725 21.4703C32.4997 21.7199 32.4997 22.0466 32.4997 22.7V32.5M27.2497 32.5V15.2333C27.2497 13.9265 27.2497 13.2731 26.9954 12.774C26.7717 12.335 26.4147 11.978 25.9757 11.7543C25.4765 11.5 24.8231 11.5 23.5163 11.5H20.483C19.1762 11.5 18.5228 11.5 18.0237 11.7543C17.5847 11.978 17.2277 12.335 17.004 12.774C16.7497 13.2731 16.7497 13.9265 16.7497 15.2333V32.5M33.6663 32.5H10.333M20.833 16.1667H23.1663M20.833 20.8333H23.1663M20.833 25.5H23.1663"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                /> */}
              </ul>
            </div>
          </div>
        </div>
        {/* <!-- Sidebar --> */}
      </div>

      <li className="log-out">
        <button onClick={handleLogout}>
          <svg
            width="27"
            height="27"
            viewBox="0 0 27 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.0556 2.76261H23.2222C24.7564 2.76261 26 3.96443 26 5.44695V6.78912M19.0556 24.2374H23.2222C24.7564 24.2374 26 23.0356 26 21.553V20.2108M2.97958 23.4691L11.3129 25.885C13.0951 26.4018 14.8889 25.1121 14.8889 23.3138V3.6861C14.8889 1.88797 13.0951 0.598274 11.3129 1.11497L2.97958 3.53088C1.80464 3.87151 1 4.91658 1 6.10201V20.8979C1 22.0834 1.80464 23.1285 2.97958 23.4691Z"
              stroke="#008AEE"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.33431 13.5H9.33331"
              stroke="#008AEE"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.0555 13.5H26M26 13.5L23.2222 10.8156M26 13.5L23.2222 16.1843"
              stroke="#008AEE"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text">Log Out</span>
        </button>
      </li>
    </div>
  );
};

export default DashboardSidebar;
