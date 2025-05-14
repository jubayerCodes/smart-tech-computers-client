"use client";

import passwordEye from "@/assets/icons/password-eye-icon.svg";
import signInBg from "@/assets/img/Sign-In-bg.png";
import signInCardImg from "@/assets/img/sign-in-card-img.png";
import { AdminRouteContext } from "@/Layouts/DashboardLayout/DashboardLayout";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";

const AuthLogin = () => {
  const { setIsLoading } = useContext(AdminRouteContext);

  const [login, setLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // Loading state
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const router = useRouter(); // Initialize router

  // Handle Signup Form Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Signup Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/SignUP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === "success" && result.token) {
        // ✅ Ensure success & token exists
        toast.success("🎉 Hurray! User Registration Successful.");

        // ✅ Store token securely in localStorage
        localStorage.setItem("token", result.token);
        // router.push("/login");  // Redirect to login page after successful signup
      } else {
        toast.error(result.message || "❌ Signup failed! Please try again.");
      }
    } catch (error) {
      console.error("❌ Signup Error:", error);
      toast.error("❌ Signup failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Login Form Change
  const handleLoginChange = (e) => {
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value });
  };

  // Handle Login Form Submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginFormData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Invalid email or password.");
      }

      // ✅ If login is successful
      if (result.status === "success" && result.token) {
        localStorage.setItem("token", result.token);
        if (localStorage.getItem("token")) {
          setIsLoading(true);
          router.push("/dashboard"); // Redirect to dashboard

          toast.success("Welcome to the dashboard");
        } else {
          toast.error("Login failed! Please check your credentials.");
        }
      }
    } catch (error) {
      console.error("❌ Login Error:", error);
      toast.error(
        error.message || "Login failed! Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to handle protected API requests
  const fetchProtectedData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No token found, please log in again.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token here
        },
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(result.message || "Failed to fetch protected data");
      }
    } catch (error) {
      console.error("❌ Fetch Protected Data Error:", error);
    }
  };

  return (
    <div className="sign-in-signup">
      <div
        className="container"
        style={{
          background: `url(${signInBg?.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Sign-in Form */}
        <div className="card" style={{ display: login ? "block" : "none" }}>
          <div className="card-wrapper">
            <div className="card-image">
              <img src={signInCardImg?.src} alt="" />
            </div>

            <div className="card-item">
              <h2>Welcome to ABC Computers</h2>

              <form onSubmit={handleLoginSubmit}>
                <input
                  type="email"
                  id="username"
                  name="email"
                  onChange={handleLoginChange}
                  placeholder="Enter a mail"
                  required
                />

                <label htmlFor="loginPassword">
                  <input
                    type={showPassword ? "text" : "password"} // Toggle password visibility
                    id="loginPassword"
                    name="password"
                    placeholder="Enter password"
                    onChange={handleLoginChange}
                    required
                  />
                  <a href="#" onClick={() => setShowPassword(!showPassword)}>
                    <img
                      className="hide-icon"
                      src={passwordEye.src}
                      alt="Toggle Password"
                    />
                  </a>
                </label>

                <a href="#" className="forgot-password">
                  Forgot Password?
                </a>

                <button
                  className="sign-in-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "SIGN IN"}
                </button>
              </form>

              <div className="switch">
                Don’t have an account?{" "}
                <span onClick={() => setLogin(false)}>SIGN UP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Signup Form */}
        <div className="card" style={{ display: login ? "none" : "block" }}>
          <div className="card-wrapper">
            <div className="card-image">
              <img src={signInCardImg?.src} alt="" />
            </div>

            <div className="card-item">
              <h2>Create an account</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  onChange={handleChange}
                  required
                />
                <input
                  type="number"
                  name="mobile"
                  placeholder="Phone number"
                  onChange={handleChange}
                  required
                />

                <label htmlFor="signUpPassword">
                  <input
                    type="password"
                    id="signUpPassword"
                    name="password"
                    placeholder="Enter password"
                    onChange={handleChange}
                    required
                  />
                  <a href="#">
                    <img className="hide-icon" src={passwordEye?.src} alt="" />
                  </a>
                </label>

                <button
                  className="sign-up-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing Up..." : "SIGN UP"}
                </button>
              </form>
              <div className="switch">
                Already have an account?{" "}
                <span onClick={() => setLogin(true)}>SIGN IN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
