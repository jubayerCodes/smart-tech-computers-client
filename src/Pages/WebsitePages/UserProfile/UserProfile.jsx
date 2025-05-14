"use client";
import Breadcrumb from "@/Components/Shared/Breadcrumb/Breadcrumb";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import "./UserProfile.css";
import { UserContext } from "@/Utilities/Contexts/UserContextProvider";
import toast from "react-hot-toast";

const UserProfile = () => {
  const router = useRouter();

  const { userID, setUserID, existingUserID } = useContext(UserContext);

  const [profileImgPreview, setProfileImgPreview] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({
    cus_name: "",
    cus_country: "",
    cus_state: "",
    cus_city: "",
    cus_postcode: "",
    cus_address: "",
    cus_email: "",
    cus_mobile: "",
    img_url: "",
    userID: "",
    profileImg: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setProfileImg(file);

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImgPreview(reader.result);
      };
      reader.readAsDataURL(file);

      URL.revokeObjectURL(img.src);
      e.target.value = "";
    };
  };

  useEffect(() => {
    console.log(existingUserID);

    const fetchProfile = async () => {
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/v1/profile-details/${existingUserID}`
      );

      console.log(result);

      if (result?.data?.status === "success") {
        setProfile(result?.data?.data);
      }
    };

    fetchProfile();
  }, [userID, existingUserID]);

  useEffect(() => {
    if (profile) {
      const {
        cus_name,
        cus_country,
        cus_state,
        cus_city,
        cus_postcode,
        cus_address,
        userID: userInfo,
      } = profile;

      setFormData({
        cus_name,
        cus_country,
        cus_state,
        cus_city,
        cus_postcode,
        cus_address,
        cus_email: userInfo?.email,
        cus_phone: userInfo?.mobile,
        img_url: userInfo?.img_url,
      });
    }
  }, [profile]);

  const handleLogout = async () => {
    try {
      // Make a POST request to the logout endpoint
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/v1/Logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Equivalent to fetch's credentials: "include"
        }
      );

      // Check if the request was successful
      if (response?.data?.status === "success") {
        // Clear the client-side authentication token (if it's stored in localStorage)
        localStorage.removeItem("token"); // Clear any stored token from localStorage

        // Optionally, also clear sessionStorage if used
        sessionStorage.removeItem("token"); // Clear session storage if token is stored there

        setUserID(null);

        // Redirect the user to the login page after successful logout
        router.push("/"); // Redirect to login
      } else {
        // Handle errors if the response is not OK (e.g., display a message to the user)
        console.error("Logout failed:", response?.data?.message);
      }
    } catch (error) {
      // Handle any errors that occur during the fetch request
      console.error("Error during logout:", error);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();

    const updatedProfile = {};

    updatedProfile.cus_name = formData?.cus_name;
    updatedProfile.cus_country = formData?.cus_country;
    updatedProfile.cus_state = formData?.cus_state;
    updatedProfile.cus_city = formData?.cus_city;
    updatedProfile.cus_postcode = formData?.cus_postcode;
    updatedProfile.cus_address = formData?.cus_address;
    updatedProfile.userID = formData?.userID;
    updatedProfile.profileImg = profileImg;

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/api/v1/profile/${existingUserID}`,
        updatedProfile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.status === "success") {
        setProfile(response?.data?.data);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error?.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <>
      {/* <!-- Hero Start --> */}
      <section id="hero">
        <div className="container">
          <div className="hero-wrapper">
            <div className="hero-shape hero-shape-1">
              <img src="./assets/icon/hero2.svg" alt="" />
            </div>
            <div className="hero-shape hero-shape-2">
              <img src="./assets/icon/hero1.svg" alt="" />
            </div>
          </div>
        </div>
      </section>
      <Breadcrumb pageTitle={"User Profile"} />

      {/* <!-- Hero End --> */}

      {/* <!-- user Dashboard start --> */}
      <section id="user_dashbord">
        <div className="user_dashbord_items">
          <div className="container">
            <div className="row mt-5">
              <div className="col-md-4 mt-3">
                <div className="sidenav_link">
                  <div className="sidenav_item">
                    <ul>
                      {/* <li className="sidelist_item">
                                                <a href="./user-dashboard.html" className="sidelist_logo">
                                                    <svg
                                                        className="svg_rect_icon"
                                                        width="40"
                                                        height="40"
                                                        viewBox="0 0 40 40"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <rect
                                                            x="1"
                                                            y="21"
                                                            width="10"
                                                            height="18"
                                                            rx="1"
                                                            stroke="#26A0DA"
                                                            strokeWidth="2"
                                                        />
                                                        <rect
                                                            x="15"
                                                            y="11"
                                                            width="10"
                                                            height="28"
                                                            rx="1"
                                                            stroke="#26A0DA"
                                                            strokeWidth="2"
                                                        />
                                                        <rect
                                                            x="29"
                                                            y="1"
                                                            width="10"
                                                            height="38"
                                                            rx="1"
                                                            stroke="#26A0DA"
                                                            strokeWidth="2"
                                                        />
                                                    </svg>
                                                    <span className="sidelist_text">Dashboard</span>
                                                </a>
                                            </li> */}
                      <li className="sidelist_item">
                        <a
                          href="./user-dashboard-edit-profile.html"
                          className="sidelist_logo"
                        >
                          <svg
                            className="svg_path_icon"
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M39 38H1C0.447715 38 0 38.4477 0 39C0 39.5523 0.447714 40 0.999999 40H39C39.5523 40 40 39.5523 40 39C40 38.4477 39.5523 38 39 38Z"
                              fill="#7C8992"
                            />
                            <path
                              d="M35.9992 10.7692C37.23 9.53846 37.23 7.69231 35.9992 6.46154L30.4608 0.923077C29.23 -0.307692 27.3839 -0.307692 26.1531 0.923077L3.07617 24V33.8462H12.9223L35.9992 10.7692ZM28.5391 2.1552L34.8839 8.5L29.6916 13.6923L23.3468 7.34751L28.5391 2.1552ZM5.1531 31.7692L5.80829 24.886L22.0391 8.6552L28.3839 15L12.1531 31.2308L5.1531 31.7692Z"
                              fill="#7C8992"
                            />
                          </svg>
                          <span className="sidelist_text">Edit Profile</span>
                        </a>
                      </li>
                      <li className="sidelist_item">
                        <a
                          href="./user-dashboard-change-password.html"
                          className="sidelist_logo"
                        >
                          <svg
                            className="svg_path_icon_3"
                            width="42"
                            height="42"
                            viewBox="0 0 42 42"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M18.4325 25.0992L21.8333 28.5H23.5V30.1667L25.1667 31.8333H26.8333V33.5L29.3333 36H31.8333V38.5L34.3333 41H39.3333L41 39.3333V34.3333L25.2 18.5333"
                              stroke="#7C8992"
                              strokeWidth="2"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                            />
                            <path
                              d="M1 13.5C1 20.4008 6.59917 26 13.5 26C20.4008 26 26 20.4008 26 13.5C26 6.59833 20.4008 1 13.5 1C6.59917 1 1 6.59833 1 13.5Z"
                              stroke="#7C8992"
                              strokeWidth="2"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                            />
                            <path
                              d="M7.60563 19.3925L19.3906 7.60748C16.1373 4.35415 10.859 4.35415 7.60479 7.60748C4.35063 10.8608 4.35146 16.1391 7.60563 19.3925Z"
                              stroke="#7C8992"
                              strokeWidth="2"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                            />
                            <path
                              d="M40.4902 38.825L26.5969 24.9316"
                              stroke="#7C8992"
                              strokeWidth="2"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="sidelist_text">Change Password</span>
                        </a>
                      </li>
                      <li className="sidelist_item">
                        <a
                          href="./user-dashboard-my-orders.html"
                          className="sidelist_logo"
                        >
                          <svg
                            className="svg_path_icon_4"
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M39.9742 11.8783C39.9742 11.8666 39.9742 11.8549 39.9613 11.8549C39.9613 11.8315 39.9484 11.8198 39.9484 11.7964C39.9484 11.7847 39.9355 11.7613 39.9355 11.7496C39.9355 11.7379 39.9226 11.7262 39.9226 11.7145C39.8968 11.6559 39.871 11.6091 39.8323 11.5623L31.4479 0.386191C31.2673 0.140433 30.9707 0 30.6482 0H22.4444H17.5556H9.35182C9.02935 0 8.73267 0.140433 8.55208 0.386191L0.167688 11.5623C0.128991 11.6091 0.103192 11.6676 0.0773942 11.7145C0.0773942 11.7262 0.0644953 11.7379 0.0644953 11.7496C0.0515963 11.7613 0.0515965 11.7847 0.0515965 11.7964C0.0515965 11.8198 0.0386976 11.8315 0.0386976 11.8549C0.0386976 11.8666 0.0386968 11.8783 0.0257977 11.8783C0.0128987 11.9368 0 11.9953 0 12.0538V39.1223C0 39.6021 0.438568 40 0.96743 40H39.0326C39.5614 40 40 39.6021 40 39.1223V12.0538C39.9871 11.9953 39.9871 11.9368 39.9742 11.8783ZM37.188 11.1761H24.6888L23.515 1.75541H30.1193L37.188 11.1761ZM17.1171 12.9315H22.8571V19.3681L20.5482 17.8935C20.3805 17.7882 20.187 17.7297 19.9936 17.7297C19.8001 17.7297 19.6066 17.7882 19.4389 17.8935L17.13 19.3681V12.9315H17.1171ZM21.5672 1.75541L22.7411 11.1761H17.2332L18.407 1.75541H21.5672ZM9.86778 1.75541H16.4721L15.2983 11.1761H2.7991L9.86778 1.75541ZM38.0522 38.2446H1.93486V12.9315H15.1951V21.0532C15.1951 21.3809 15.4015 21.6852 15.7111 21.8373C16.0335 21.9895 16.4205 21.9661 16.7172 21.7788L19.9936 19.684L23.2699 21.7788C23.4376 21.8841 23.6311 21.9427 23.8246 21.9427C23.9794 21.9427 24.1342 21.9075 24.276 21.849C24.5985 21.6969 24.792 21.3926 24.792 21.065V12.9432H38.0522V38.2446Z"
                              fill="#7C8992"
                            />
                            <path
                              d="M12.8981 28.7068H6.03579C5.50693 28.7068 5.06836 29.1047 5.06836 29.5846C5.06836 30.0644 5.50693 30.4623 6.03579 30.4623H12.8981C13.427 30.4623 13.8655 30.0644 13.8655 29.5846C13.8655 29.1047 13.427 28.7068 12.8981 28.7068Z"
                              fill="#7C8992"
                            />
                            <path
                              d="M9.46694 32.3932H6.03579C5.50693 32.3932 5.06836 32.7911 5.06836 33.2709C5.06836 33.7507 5.50693 34.1486 6.03579 34.1486H9.46694C9.9958 34.1486 10.4344 33.7507 10.4344 33.2709C10.4344 32.7911 9.9958 32.3932 9.46694 32.3932Z"
                              fill="#7C8992"
                            />
                          </svg>
                          <span className="sidelist_text">My Orders</span>
                        </a>
                      </li>
                      {/* <li className="sidelist_item">
                                                <a href="#" className="sidelist_logo">
                                                    <svg
                                                        className="svg_path_icon_5"
                                                        width="42"
                                                        height="42"
                                                        viewBox="0 0 42 42"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M41 1V25H33V30.3333L27.6667 25H9V1H41Z"
                                                            stroke="#7C8992"
                                                            strokeWidth="2"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M9 17H1V35.6667H9V41L14.3333 35.6667H23.6667V25"
                                                            stroke="#7C8992"
                                                            strokeWidth="2"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M14.334 7.66669H35.6673"
                                                            stroke="#7C8992"
                                                            strokeWidth="2"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M14.334 13H35.6673"
                                                            stroke="#7C8992"
                                                            strokeWidth="2"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M14.334 18.3333H35.6673"
                                                            stroke="#7C8992"
                                                            strokeWidth="2"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <span className="sidelist_text">Chat List</span>
                                                </a>
                                            </li> */}
                      {/* <li className="sidelist_item">
                                                <a href="#" className="sidelist_logo">
                                                    <svg
                                                        className="svg_path_icon_6"
                                                        width="42"
                                                        height="42"
                                                        viewBox="0 0 42 42"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M21 12.4286V15.2857"
                                                            stroke="#7C8992"
                                                            strokeWidth="2"
                                                            strokeMiterlimit="10"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M21 26.7143V29.5714"
                                                            stroke="#7C8992"
                                                            strokeWidth="2"
                                                            strokeMiterlimit="10"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M18.1434 26.7143H22.4291C24.0006 26.7143 25.2863 25.4286 25.2863 23.8571C25.2863 22.2857 24.0006 21 22.4291 21H19.572C18.0006 21 16.7148 19.7143 16.7148 18.1428C16.7148 16.5714 18.0006 15.2857 19.572 15.2857H23.8577"
                                                            stroke="#7C8992"
                                                            strokeWidth="2"
                                                            strokeMiterlimit="10"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M21.0006 6.71429C28.8577 6.71429 35.2863 13.1429 35.2863 21C35.2863 28.8572 28.8577 35.2857 21.0006 35.2857C13.1434 35.2857 6.71484 28.8572 6.71484 21V16.7143"
                                                            stroke="#7C8992"
                                                            strokeWidth="2"
                                                            strokeMiterlimit="10"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M12.4286 22.4286L6.71429 16.7143L1 22.4286"
                                                            stroke="#7C8992"
                                                            strokeWidth="2"
                                                            strokeMiterlimit="10"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M21 1C32 1 41 10 41 21C41 32 32 41 21 41"
                                                            stroke="#7C8992"
                                                            strokeWidth="2"
                                                            strokeMiterlimit="10"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <span className="sidelist_text">Refund Request</span>
                                                </a>
                                            </li> */}
                      {/* <li className="sidelist_item">
                                                <a
                                                    href="./user-dashboard-wallet-history.html"
                                                    className="sidelist_logo"
                                                >
                                                    <svg
                                                        className="svg_path_icon_7"
                                                        width="40"
                                                        height="40"
                                                        viewBox="0 0 40 40"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M37.7522 15.811V4.19948C37.7522 3.08571 37.3934 2.01755 36.7547 1.23C36.116 0.442443 35.2498 0 34.3465 0L3.4057 0C2.50246 0 1.6362 0.442443 0.997508 1.23C0.358814 2.01755 0 3.08571 0 4.19948L0 35.8005C0 36.9143 0.358814 37.9824 0.997508 38.77C1.6362 39.5576 2.50246 40 3.4057 40H34.3976C35.3009 40 36.1671 39.5576 36.8058 38.77C37.4445 37.9824 37.8033 36.9143 37.8033 35.8005V28.3675C38.4011 28.3045 38.9582 27.9678 39.3647 27.4238C39.7713 26.8797 39.9979 26.1676 40 25.4278V18.7717C40.0012 18.0181 39.7694 17.2923 39.3518 16.7423C38.9341 16.1922 38.3621 15.8591 37.7522 15.811ZM3.4057 2.09974H34.3976C34.8492 2.09974 35.2824 2.32096 35.6017 2.71474C35.9211 3.10851 36.1005 3.64259 36.1005 4.19948V4.87139C35.585 4.4956 34.9964 4.29964 34.3976 4.30446L3.4057 8.30446C2.80691 8.29964 2.21831 8.4956 1.70285 8.87139V4.19948C1.70285 3.64259 1.88226 3.10851 2.20161 2.71474C2.52095 2.32096 2.95408 2.09974 3.4057 2.09974ZM34.3976 37.7953H3.4057C2.95408 37.7953 2.52095 37.5741 2.20161 37.1803C1.88226 36.7865 1.70285 36.2524 1.70285 35.6955V12.399C1.70285 11.8421 1.88226 11.308 2.20161 10.9142C2.52095 10.5204 2.95408 10.2992 3.4057 10.2992L34.3976 6.29921C34.8492 6.29921 35.2824 6.52043 35.6017 6.91421C35.9211 7.30799 36.1005 7.84207 36.1005 8.39895V15.79H28.0289C26.6741 15.79 25.3747 16.4537 24.4166 17.635C23.4586 18.8164 22.9204 20.4186 22.9204 22.0892C22.9204 23.7599 23.4586 25.3621 24.4166 26.5435C25.3747 27.7248 26.6741 28.3885 28.0289 28.3885H36.0494V35.8005C36.0281 36.3283 35.8463 36.8268 35.5401 37.1965C35.2339 37.5663 34.826 37.7801 34.3976 37.7953ZM38.2461 25.3648C38.2461 25.5987 38.1707 25.823 38.0366 25.9884C37.9025 26.1538 37.7205 26.2467 37.5309 26.2467H28.0289C27.1257 26.2467 26.2594 25.8043 25.6207 25.0167C24.9821 24.2292 24.6232 23.161 24.6232 22.0472C24.6232 20.9335 24.9821 19.8653 25.6207 19.0778C26.2594 18.2902 27.1257 17.8478 28.0289 17.8478H37.4627C37.6524 17.8478 37.8343 17.9407 37.9685 18.1061C38.1026 18.2715 38.1779 18.4958 38.1779 18.7297L38.2461 25.3648Z"
                                                            fill="#7C8992"
                                                        />
                                                        <path
                                                            d="M28.0975 23.601C28.8687 23.601 29.4938 22.8302 29.4938 21.8793C29.4938 20.9283 28.8687 20.1575 28.0975 20.1575C27.3263 20.1575 26.7012 20.9283 26.7012 21.8793C26.7012 22.8302 27.3263 23.601 28.0975 23.601Z"
                                                            fill="#7C8992"
                                                        />
                                                    </svg>
                                                    <span className="sidelist_text">Wallet history</span>
                                                </a>
                                            </li> */}
                      {/* <li className="sidelist_item">
                                                <a href="#" className="sidelist_logo">
                                                    <svg
                                                        className="svg_path_icon_8"
                                                        width="42"
                                                        height="42"
                                                        viewBox="0 0 42 42"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M32.3043 1H9.69565C4.89318 1 1 4.89318 1 9.69565V32.3043C1 37.1068 4.89318 41 9.69565 41H32.3043C37.1068 41 41 37.1068 41 32.3043V9.69565C41 4.89318 37.1068 1 32.3043 1Z"
                                                            stroke="#7C8992"
                                                            strokeWidth="2"
                                                            strokeMiterlimit="10"
                                                        />
                                                        <path
                                                            d="M28 12.9231C28 16.7446 21 24 21 24C21 24 14 16.7446 14 12.9231C14 11.087 14.7375 9.32605 16.0503 8.02772C17.363 6.72939 19.1435 6 21 6C22.8565 6 24.637 6.72939 25.9497 8.02772C27.2625 9.32605 28 11.087 28 12.9231Z"
                                                            stroke="#7C8992"
                                                            strokeWidth="2"
                                                            strokeMiterlimit="10"
                                                        />
                                                        <path
                                                            d="M23.7392 25.2174H30.287C31.0246 25.1915 31.7423 25.4588 32.2833 25.9607C32.8243 26.4626 33.1446 27.1583 33.174 27.8957V33.8435C33.1446 34.5809 32.8243 35.2766 32.2833 35.7785C31.7423 36.2804 31.0246 36.5476 30.287 36.5218H11.7131C10.9756 36.5476 10.2579 36.2804 9.71685 35.7785C9.17584 35.2766 8.8556 34.5809 8.82617 33.8435V27.8957C8.8556 27.1583 9.17584 26.4626 9.71685 25.9607C10.2579 25.4588 10.9756 25.1915 11.7131 25.2174H18.261"
                                                            stroke="#7C8992"
                                                            strokeWidth="2"
                                                            strokeMiterlimit="10"
                                                        />
                                                        <path
                                                            d="M9.69531 31.3043H20.9997"
                                                            stroke="#7C8992"
                                                            strokeWidth="2"
                                                            strokeMiterlimit="10"
                                                        />
                                                        <path
                                                            d="M21 31.3043V35.6521"
                                                            stroke="#7C8992"
                                                            strokeWidth="2"
                                                            strokeMiterlimit="10"
                                                        />
                                                        <path
                                                            d="M26.2168 26.087V31.3044"
                                                            stroke="#7C8992"
                                                            strokeWidth="2"
                                                            strokeMiterlimit="10"
                                                        />
                                                        <path
                                                            d="M21 31.3043H32.3043"
                                                            stroke="#7C8992"
                                                            strokeWidth="2"
                                                            strokeMiterlimit="10"
                                                        />
                                                    </svg>
                                                    <span className="sidelist_text">Shipping Address</span>
                                                </a>
                                            </li> */}
                      {/* <li className="sidelist_item">
                                                <a href="#" className="sidelist_logo">
                                                    <svg
                                                        className="svg_path_icon_9"
                                                        width="40"
                                                        height="40"
                                                        viewBox="0 0 40 40"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M38.3739 27.2547C38.8051 27.2547 39.2187 27.0865 39.5236 26.7871C39.8286 26.4877 39.9999 26.0817 39.9999 25.6582V20.7357C40.0035 20.3199 39.9236 19.9075 39.7648 19.522C39.606 19.1365 39.3715 18.7855 39.0745 18.489C38.7776 18.1925 38.4241 17.9563 38.0342 17.794C37.6442 17.6316 37.2256 17.5463 36.8021 17.5428H36.6124L37.4254 16.7445C38.0212 16.1477 38.355 15.3452 38.355 14.5095C38.355 13.6737 38.0212 12.8712 37.4254 12.2744L33.8753 8.81533C33.5668 8.52112 33.1536 8.35655 32.7235 8.35655C32.2934 8.35655 31.8803 8.52112 31.5718 8.81533C31.2807 9.10114 30.8859 9.2617 30.4742 9.2617C30.0626 9.2617 29.6678 9.10114 29.3767 8.81533C29.0856 8.52953 28.9221 8.14189 28.9221 7.7377C28.9221 7.33352 29.0856 6.94588 29.3767 6.66008C29.6763 6.35716 29.8439 5.95151 29.8439 5.52923C29.8439 5.10696 29.6763 4.70131 29.3767 4.39839L25.8266 0.912733C25.2187 0.327695 24.4014 0 23.5502 0C22.6989 0 21.8817 0.327695 21.2738 0.912733L4.30914 17.5428H3.19803C2.77453 17.5463 2.35587 17.6316 1.96596 17.794C1.57605 17.9563 1.22253 18.1925 0.925586 18.489C0.62864 18.7855 0.394083 19.1365 0.23531 19.522C0.0765363 19.9075 -0.00334412 20.3199 0.000229693 20.7357V25.6582C-0.00336812 25.8666 0.035332 26.0736 0.114072 26.2672C0.192812 26.4607 0.310016 26.637 0.458847 26.7856C0.607679 26.9342 0.785158 27.0522 0.980934 27.1327C1.17671 27.2133 1.38686 27.2548 1.59913 27.2547C1.82101 27.2259 2.04659 27.244 2.26078 27.3077C2.47497 27.3714 2.67284 27.4793 2.84114 27.6241C3.00944 27.769 3.1443 27.9475 3.23669 28.1476C3.32908 28.3477 3.37688 28.565 3.37688 28.7847C3.37688 29.0044 3.32908 29.2216 3.23669 29.4218C3.1443 29.6219 3.00944 29.8004 2.84114 29.9452C2.67284 30.0901 2.47497 30.198 2.26078 30.2617C2.04659 30.3254 1.82101 30.3434 1.59913 30.3147C1.38686 30.3146 1.17671 30.3561 0.980934 30.4367C0.785158 30.5172 0.607679 30.6352 0.458847 30.7838C0.310016 30.9324 0.192812 31.1087 0.114072 31.3022C0.035332 31.4958 -0.00336812 31.7028 0.000229693 31.9111V36.8336C0.000199659 37.6688 0.336243 38.4702 0.935181 39.0632C1.53412 39.6563 2.34744 39.993 3.19803 40H36.8021C37.6527 39.993 38.466 39.6563 39.0649 39.0632C39.6639 38.4702 39.9999 37.6688 39.9999 36.8336V31.9111C39.9999 31.4877 39.8286 31.0817 39.5236 30.7823C39.2187 30.4829 38.8051 30.3147 38.3739 30.3147C37.996 30.2656 37.6491 30.0834 37.3978 29.802C37.1466 29.5205 37.008 29.159 37.008 28.7847C37.008 28.4104 37.1466 28.0489 37.3978 27.7674C37.6491 27.486 37.996 27.3038 38.3739 27.2547ZM22.4391 2.08349C22.5831 1.93703 22.7558 1.82055 22.9466 1.741C23.1375 1.66145 23.3428 1.62045 23.5502 1.62045C23.7575 1.62045 23.9628 1.66145 24.1537 1.741C24.3446 1.82055 24.5172 1.93703 24.6613 2.08349L28.1301 5.51593C27.5277 6.10942 27.1895 6.91314 27.1895 7.75101C27.1895 8.58888 27.5277 9.3926 28.1301 9.98609C28.4248 10.2773 28.7752 10.5084 29.1612 10.6662C29.5473 10.8239 29.9613 10.9051 30.3794 10.9051C30.7975 10.9051 31.2115 10.8239 31.5975 10.6662C31.9835 10.5084 32.334 10.2773 32.6287 9.98609L36.2601 13.4451C36.5482 13.7379 36.7092 14.129 36.7092 14.5361C36.7092 14.9431 36.5482 15.3343 36.2601 15.627L34.2547 17.5428H6.66684L22.4391 2.08349ZM38.2926 31.9111V36.8336C38.2926 37.0328 38.2526 37.23 38.175 37.414C38.0974 37.598 37.9836 37.7652 37.8402 37.9061C37.6967 38.0469 37.5264 38.1586 37.339 38.2348C37.1516 38.3111 36.9507 38.3503 36.7479 38.3503H3.19803C2.78835 38.3503 2.39545 38.1905 2.10576 37.9061C1.81608 37.6217 1.65333 37.2359 1.65333 36.8336V31.9377C2.49674 31.9307 3.30317 31.5968 3.89702 31.0088C4.49088 30.4207 4.82407 29.6261 4.82404 28.798C4.83131 27.9769 4.50787 27.1862 3.92416 26.5981C3.34045 26.0101 2.54374 25.6722 1.70753 25.6582V20.7357C1.71425 20.3331 1.87833 19.9483 2.16584 19.6611C2.45335 19.3738 2.84229 19.2061 3.25223 19.1925H36.8021C37.2118 19.1925 37.6047 19.3523 37.8944 19.6367C38.184 19.9211 38.3468 20.3069 38.3468 20.7091V25.5252C37.9246 25.5252 37.5065 25.6073 37.1167 25.7667C36.727 25.9262 36.3733 26.1598 36.076 26.4542C35.7787 26.7486 35.5437 27.0979 35.3846 27.4819C35.2255 27.8659 35.1454 28.277 35.149 28.6916C35.1345 29.107 35.2049 29.5211 35.356 29.9094C35.5072 30.2978 35.736 30.6524 36.029 30.9525C36.322 31.2526 36.6733 31.492 37.062 31.6567C37.4508 31.8213 37.8692 31.9078 38.2926 31.9111Z"
                                                            fill="#7C8992"
                                                        />
                                                        <rect
                                                            x="7"
                                                            y="24"
                                                            width="26"
                                                            height="2"
                                                            rx="1"
                                                            fill="#7C8992"
                                                        />
                                                        <rect
                                                            x="7"
                                                            y="28"
                                                            width="14"
                                                            height="2"
                                                            rx="1"
                                                            fill="#7C8992"
                                                        />
                                                        <rect
                                                            x="23"
                                                            y="28"
                                                            width="10"
                                                            height="2"
                                                            rx="1"
                                                            fill="#7C8992"
                                                        />
                                                        <rect
                                                            x="7"
                                                            y="32"
                                                            width="26"
                                                            height="2"
                                                            rx="1"
                                                            fill="#7C8992"
                                                        />
                                                    </svg>
                                                    <span className="sidelist_text">Support Ticket</span>
                                                </a>
                                            </li> */}
                      <li className="sidelist_item" onClick={handleLogout}>
                        <a className="sidelist_logo">
                          <svg
                            className="svg_path_icon_10"
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M36.0038 31.995C33.4836 35.3574 29.9683 37.8407 25.9569 39.0923C21.9456 40.3438 17.6419 40.3002 13.6568 38.9674C9.67162 37.6347 6.2075 35.0806 3.75607 31.6677C1.30464 28.2548 -0.00954286 24.1564 5.21388e-05 19.9543C0.00964714 15.7523 1.34253 11.66 3.80952 8.25826C6.27651 4.85657 9.75226 2.31833 13.7434 1.0038C17.7346 -0.310727 22.0385 -0.334753 26.0441 0.935132C30.0497 2.20502 33.5536 4.7043 36.0584 8.07823L33.9617 9.63483C31.7839 6.70142 28.7375 4.52847 25.2549 3.42439C21.7723 2.32031 18.0304 2.3412 14.5604 3.48409C11.0903 4.62699 8.06836 6.83382 5.92348 9.79136C3.7786 12.7489 2.61974 16.3069 2.6114 19.9603C2.60306 23.6137 3.74565 27.177 5.877 30.1443C8.00835 33.1116 11.0202 35.3322 14.485 36.4909C17.9498 37.6496 21.6915 37.6876 25.1792 36.5994C28.6668 35.5113 31.723 33.3523 33.9142 30.4288L36.0038 31.995Z"
                              fill="#7C8992"
                            />
                            <path
                              d="M39.2224 19.0643L31.2489 11.1569C31.125 11.034 30.9779 10.9365 30.816 10.87C30.6541 10.8035 30.4806 10.7693 30.3054 10.7693C30.1301 10.7693 29.9566 10.8035 29.7947 10.87C29.6328 10.9365 29.4857 11.034 29.3618 11.1569C29.2379 11.2798 29.1396 11.4256 29.0726 11.5862C29.0055 11.7467 28.971 11.9188 28.971 12.0926C28.971 12.2664 29.0055 12.4384 29.0726 12.599C29.1396 12.7595 29.2379 12.9054 29.3618 13.0283L35.0762 18.669H16.7137C16.3612 18.669 16.0232 18.8078 15.774 19.055C15.5248 19.3021 15.3848 19.6373 15.3848 19.9869C15.3848 20.3364 15.5248 20.6716 15.774 20.9188C16.0232 21.1659 16.3612 21.3048 16.7137 21.3048H35.0762L29.3618 26.9718C29.2379 27.0947 29.1396 27.2406 29.0726 27.4011C29.0055 27.5617 28.971 27.7337 28.971 27.9075C28.971 28.0813 29.0055 28.2534 29.0726 28.4139C29.1396 28.5745 29.2379 28.7204 29.3618 28.8432C29.4857 28.9661 29.6328 29.0636 29.7947 29.1301C29.9566 29.1966 30.1301 29.2308 30.3054 29.2308C30.4806 29.2308 30.6541 29.1966 30.816 29.1301C30.9779 29.0636 31.125 28.9661 31.2489 28.8432L39.2224 20.9358C39.347 20.8133 39.4459 20.6675 39.5133 20.5069C39.5808 20.3463 39.6155 20.174 39.6155 20.0001C39.6155 19.8261 39.5808 19.6538 39.5133 19.4932C39.4459 19.3326 39.347 19.1869 39.2224 19.0643Z"
                              fill="#7C8992"
                            />
                          </svg>
                          <span className="sidelist_text">Log Out</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-8 mt-3">
                <div className="sidenav_heading">
                  <div className="sidenav_profile">
                    <img src="./assets/icon/profile-img.png" alt="" />
                  </div>
                  <div className="sidenav_text_item">
                    <div className="sidenav_text">
                      <h4>{profile?.cus_name}</h4>
                      <p>+880 1xxx-xxxxxx</p>
                    </div>
                  </div>
                </div>
                <div className="edit_profile_heading">Edit Profile</div>
                <form id="edit_profile_all_item" onSubmit={handleEditProfile}>
                  <div className="edit_profile_input_box">
                    <span className="edit_profile_input_text">Name</span>
                    <input
                      type="text"
                      name="cus_name"
                      placeholder="enter your name"
                      defaultValue={profile?.cus_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="edit_profile_input_box">
                    <span className="edit_profile_input_text">
                      Email Address
                    </span>
                    <input
                      type="text"
                      name="cus_email"
                      placeholder="enter email address"
                      defaultValue={profile?.userID?.email}
                      onChange={handleChange}
                      readOnly
                    />
                  </div>
                  <div className="edit_profile_details">
                    <div className="edit_profile_input_box">
                      <span className="edit_profile_input_text">
                        Mobile Number
                      </span>
                      <input
                        type="number"
                        name="cus_phone"
                        placeholder="enter number"
                        defaultValue={profile?.userID?.mobile}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                    <div className="edit_profile_input_box">
                      <span className="edit_profile_input_text">Country</span>
                      <input
                        type="text"
                        placeholder="enter country"
                        name="cus_country"
                        defaultValue={profile?.cus_country}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="edit_profile_input_box">
                      <span className="edit_profile_input_text">State</span>
                      <input
                        type="text"
                        placeholder="enter state"
                        name="cus_state"
                        defaultValue={profile?.cus_state}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="edit_profile_input_box">
                      <span className="edit_profile_input_text">City</span>
                      <input
                        type="text"
                        placeholder="enter city"
                        name="cus_city"
                        defaultValue={profile?.cus_city}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="edit_profile_input_box">
                      <span className="edit_profile_input_text">Zip Code</span>
                      <input
                        type="number"
                        placeholder="enter zip code"
                        name="cus_postcode"
                        defaultValue={profile?.cus_postcode}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="edit_profile_input_box">
                      <span className="edit_profile_input_text">Address</span>
                      <input
                        type="text"
                        placeholder="enter your address"
                        name="cus_address"
                        defaultValue={profile?.cus_address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="edit_profile_input_box">
                    <span className="edit_profile_input_text">
                      Update Image
                    </span>
                    <div className="upload-profile">
                      <div className="item">
                        <div className="img-box">
                          {profileImgPreview ? (
                            <img
                              src={profileImgPreview}
                              alt="profile"
                              width="120"
                            />
                          ) : profile?.userID?.img_url ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API}${profile?.userID?.img_url}`}
                              alt="profile"
                              width="120"
                            />
                          ) : (
                            <></>
                          )}
                        </div>

                        <div className="profile-wrapper">
                          <label className="custom-file-input-wrapper m-0">
                            <input
                              type="file"
                              className="custom-file-input"
                              aria-label="Upload Photo"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p>PNG, JPEG, or GIF (Up to 1 MB)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 row mx-0">
                    <button className="submit-btn mx-auto" type="submit">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- user Dashboard end --> */}
    </>
  );
};

export default UserProfile;
