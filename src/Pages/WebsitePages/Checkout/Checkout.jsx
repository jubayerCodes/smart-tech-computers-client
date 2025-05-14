"use client";
import React, { useContext, useState } from "react";
import passwordEye from "@/assets/icons/password-eye-icon.svg";
import paymentImg from "@/assets/img/payment.png";

import bkashImg from "@/assets/img/payment-bkash.png";
import nagadImg from "@/assets/img/payment-nagad.png";
import bankImg from "@/assets/img/payment-bank.png";
import QRImg from "@/assets/img/QR.png";

import modalBkash from "@/assets/img/bkash.png";
import bracBankimg from "@/assets/img/Bracbank.png";

import { Modal } from "react-bootstrap";
import { UserContext } from "@/Utilities/Contexts/UserContextProvider";
import toast from "react-hot-toast";
import axios from "axios";
import { CartContext } from "@/Utilities/Contexts/CartContextProvider";
import logo from "@/assets/img/abc-logo-icon.png";
import { FaRegCopy } from "react-icons/fa";
import { PlaceOrderContext } from "@/Utilities/Contexts/PlaceOrderContextProvider";
import { useRouter } from "next/navigation";

const Checkout = () => {
  const router = useRouter();

  const { placeOrder } = useContext(PlaceOrderContext);

  const { cart, subTotal, grandTotal, removeCart, discount } =
    useContext(CartContext);
  const bankAccount = 546746449874;

  const { setUserID } = useContext(UserContext);
  const [paymentOption, setPaymentOption] = useState("bkash");
  const [loginModal, setLoginModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [login, setLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Form values

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, SetCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [tranID, setTranID] = useState("");
  const [cusBankAccount, setCusBankAccount] = useState("");

  const [error, setError] = useState({});

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

  // Handle Signup Form Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleCountryChange = (e) => {
  //   const selectedCountryIndex = e.target.value;

  //   if (selectedCountryIndex == 0) {
  //     return setStateOptions([]);
  //   }

  //   const newStates = states[selectedCountryIndex]?.split("|");
  //   setStateOptions(newStates);
  // };

  // Handle Signup Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/v1/SignUP`,
        formData
      );

      const result = await response?.data;

      if (result?.status === "success" && result?.token) {
        // ✅ Ensure success & token exists
        toast.success("🎉 Hurray! User Registration Successful.");

        // ✅ Store token securely in localStorage
        localStorage.setItem("token", result?.token);
        // router.push("/login");  // Redirect to login page after successful signup

        const _id = result?.result?._id;

        setUserID(_id);

        e.target.reset();
        setFormData({
          name: "",
          email: "",
          mobile: "",
          password: "",
        });
      }
    } catch (error) {
      console.error("❌ Signup Error:", error);
      toast.error(
        error?.response?.data?.message || "❌ Signup failed! Please try again."
      );
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

    console.log(loginFormData);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/v1/Login`,
        loginFormData
      );

      const result = await response?.data;

      if (result?.status !== "success") {
        throw new Error(result.message || "Invalid email or password.");
      }

      // ✅ If login is successful
      if (result?.status === "success" && result?.token) {
        localStorage.setItem("token", result?.token);
        toast.success("Login successful!");
        // router.push("/"); // Redirect to dashboard

        const _id = result?.user?._id;

        setUserID(_id);

        e.target.reset();
        setLoginFormData({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.error("❌ Login Error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Login failed! Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = (e) => {
    setError({});

    if (!cart.length) {
      return alert("Cart is empty! Add product first.");
    }

    if (name === "") {
      return setError({ id: "name", error: "Full Name is required!" });
    }

    if (address === "") {
      return setError({ id: "address", error: "Address is required!" });
    }

    if (phone === "") {
      return setError({ id: "phone", error: "Phone Number is required!" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email === "") {
      return setError({ id: "email", error: "Email address is required!" });
    } else if (!emailRegex.test(email)) {
      return setError({ id: "email", error: "Invalid email address!" });
    }

    if (city === "") {
      return setError({ id: "city", error: "City is required!" });
    }

    setPaymentModal(true);
  };

  const handlePayNow = async () => {
    setLoading(true);

    setError({});

    if (paymentOption !== "bank") {
      if (tranID === "") {
        return setError({
          id: "transaction",
          error: "Transaction ID is required!",
        });
      }
    } else if (paymentOption === "bank") {
      if (cusBankAccount === "") {
        return setError({
          id: "bankAccount",
          error: "Bank account is required!",
        });
      }
    }

    const products = cart?.map((prod) => {
      const checkoutOrder = {
        productID: prod?.productID,
        qty: prod?.quantity,
      };

      if (prod?.color) {
        checkoutOrder.color = prod?.color;
      }

      return checkoutOrder;
    });

    const discount = 0;

    const orderData = {
      billingDetails: {
        cus_name: name,
        cus_address: address,
        cus_phone: phone,
        cus_email: email,
        cus_city: city,
        order_notes: notes,
      },
      cartItems: [...products],
      paymentDetails: {
        subTotal: subTotal,
        discount: discount,
        grandTotal: grandTotal,
        pay_method: paymentOption,
        tran_id: tranID,
        acc_number: cusBankAccount,
      },
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API}/api/v1/create-invoice`,
      orderData
    );

    if (response?.data?.data?.status === "success") {
      placeOrder(response.data.data);
      removeCart();
      toast.success("Order placed successfully!");
      router.push("/thank-you");

      setLoading(false);

      setName("");
      setAddress("");
      SetCity("");
      setPhone("");
      setEmail("");
      setNotes("");
      setTranID("");
      setError({});
      setCusBankAccount("");
      setPaymentModal(false);
    } else if (response?.data?.data?.status === "failed") {
      toast.error("Out of stock!");
      setPaymentModal(false);
      setTranID("");
      setError({});
      setCusBankAccount("");
    }
  };

  const copyBankAccount = async () => {
    try {
      await navigator.clipboard.writeText(bankAccount);
      toast.success("Account Number Copied");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      {/* <!-- Billing Details Start --> */}
      <div className="billing_details">
        <div className="container">
          <div className="breadcrumb">
            <a href="/cart">Shopping Cart </a>
            <div className="icon">
              <svg
                width="32"
                height="30"
                viewBox="0 0 32 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.0565 25.9035C14.4726 26.4888 14.4724 27.4363 15.0561 28.0219L15.9665 28.9351C16.5524 29.5228 17.5042 29.5231 18.0904 28.9357L30.9423 16.0597C31.5268 15.4741 31.5268 14.5259 30.9423 13.9403L18.0904 1.0643C17.5042 0.476929 16.5524 0.477217 15.9665 1.06494L15.0561 1.97809C14.4724 2.56365 14.4726 3.51117 15.0565 4.09652L24.8775 13.9406C25.4616 14.5261 25.4616 15.4739 24.8775 16.0594L15.0565 25.9035Z"
                  fill="#09090B"
                />
                <path
                  d="M1.05653 25.9035C0.472561 26.4888 0.472386 27.4363 1.05614 28.0219L1.96647 28.9351C2.55238 29.5228 3.50416 29.5231 4.09042 28.9357L16.9423 16.0597C17.5268 15.4741 17.5268 14.5259 16.9423 13.9403L4.09043 1.0643C3.50416 0.476929 2.55238 0.477217 1.96647 1.06494L1.05614 1.97809C0.472388 2.56365 0.472563 3.51117 1.05653 4.09652L10.8775 13.9406C11.4616 14.5261 11.4616 15.4739 10.8775 16.0594L1.05653 25.9035Z"
                  fill="#09090B"
                />
              </svg>
            </div>
            <span className="breadcrumb_last active">Checkout</span>
          </div>

          <div className="row">
            <div className="col-lg-4">
              <div className="billing_section">
                <h2 className="heading">Billing Details</h2>
                <form>
                  <div className="form_group">
                    <label htmlFor="first-name">
                      Full Name<span>*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {error?.id === "name" ? (
                      <span className="error-message">* {error?.error}</span>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="form_group">
                    <label htmlFor="address">
                      Address<span>*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      placeholder="House name and address..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    {error?.id === "address" ? (
                      <span className="error-message">* {error?.error}</span>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="form_group">
                    <label htmlFor="phone">
                      Phone Number<span>*</span>
                    </label>
                    <input
                      type="number"
                      id="phone"
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    {error?.id === "phone" ? (
                      <span className="error-message">* {error?.error}</span>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="form_group">
                    <label htmlFor="email">
                      Email Address<span>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="example@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {error?.id === "email" ? (
                      <span className="error-message">* {error?.error}</span>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="form_group">
                    <label htmlFor="city">
                      Town / City<span>*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      placeholder="Town/City"
                      value={city}
                      onChange={(e) => SetCity(e.target.value)}
                    />
                    {error?.id === "city" ? (
                      <span className="error-message">* {error?.error}</span>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="form_group">
                    <label htmlFor="order-notes">Order Notes (Optional)</label>
                    <textarea
                      id="order-notes"
                      placeholder="Notes about your order, e.g. special notes for delivery"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="shipping_section">
                <h2 className="heading">Payment Method</h2>
                <div className="payment_option">
                  <div className="radio-container">
                    <input
                      type="radio"
                      name="payment"
                      id="bkash"
                      checked={paymentOption === "bkash"}
                      onChange={(e) => setPaymentOption(e.target.value)}
                      value={"bkash"}
                    />
                    <label htmlFor="bkash">
                      <span className="details">
                        <strong>Bkash</strong>
                        <img
                          src={bkashImg?.src}
                          className="payment-img"
                          alt=""
                        />
                      </span>
                    </label>
                  </div>
                  {/* {
                      paymentOption === "bkash" ?
                      <>
                      <input
                        type="text"
                        id="bkash_transaction"
                        placeholder="Transaction ID"
                        className="transaction"
                        value={tranID}
                        onChange={(e)=> setTranID(e.target.value)}
                      />
                      {
                        error?.id === "tranID" ? 
                        <span className="error-message">* {error?.error}</span>
                        :
                        <></>
                      }
                      </> : 
                      <></>
                    } */}
                </div>
                <div className="payment_option">
                  <div className="radio-container">
                    <input
                      type="radio"
                      name="payment"
                      id="nagad"
                      checked={paymentOption === "nagad"}
                      onChange={(e) => setPaymentOption(e.target.value)}
                      value={"nagad"}
                    />
                    <label htmlFor="nagad">
                      <span className="details">
                        <strong>Nagad</strong>
                        <img
                          src={nagadImg?.src}
                          className="payment-img"
                          alt=""
                        />
                      </span>
                    </label>
                  </div>
                  {/* {
                      paymentOption === "nagad" ?
                      <><input
                        type="text"
                        id="nagad_transaction"
                        placeholder="Transaction ID"
                        className="transaction"
                        value={tranID}
                        onChange={(e)=> setTranID(e.target.value)}
                      />

                      {
                        error?.id === "tranID" ? 
                        <span className="error-message">* {error?.error}</span>
                        :
                        <></>
                      }

                      </>
                      : 
                      <></>
                    } */}
                </div>
                <div className="payment_option">
                  <div className="radio-container">
                    <input
                      type="radio"
                      name="payment"
                      id="bank"
                      checked={paymentOption === "bank"}
                      onChange={(e) => setPaymentOption(e.target.value)}
                      value={"bank"}
                    />
                    <label htmlFor="bank">
                      <span className="details">
                        <strong>Bank</strong>
                        <img
                          src={bankImg?.src}
                          className="payment-img"
                          alt=""
                        />
                      </span>
                    </label>
                  </div>
                </div>
                <img src={paymentImg?.src} className="payment-methods-img" />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="order_summery_wrapper">
                <div className="order_items">
                  <div className="cart_header">
                    <h2 className="heading">Your Order</h2>
                  </div>
                  <ul className="cart_items">
                    {cart?.map((item, idx) => (
                      <li key={idx}>
                        <div className="product_details_wrapper">
                          <div className="product_item">
                            <img
                              src={`${process.env.NEXT_PUBLIC_API}${item?.productImg}`}
                              alt=""
                            />
                          </div>
                          <div className="item">
                            <a
                              href={`/products/${item?.productID}`}
                              className="title"
                            >
                              {item?.productName.slice(0, 15)}...
                            </a>
                            <div className="type_wrap_container">
                              <h2 className="type_wrap">
                                {item?.subCategory}
                                <span>x{item?.quantity}</span>
                              </h2>
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="price">
                            {" "}
                            ৳{item?.price?.toLocaleString(2)}{" "}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="discount_wrapper">
                  <h2 className="title">Discount Code</h2>
                  <div className="group">
                    <input type="text" placeholder="Add discount code" />
                    <button className="apply_btn">Apply</button>
                  </div>
                </div>

                <div className="order_summary">
                  <p className="summary_item">
                    <span>Sub-Total</span>{" "}
                    <span className="price1">
                      ৳{subTotal?.toLocaleString()}
                    </span>
                  </p>
                  <p className="summary_item">
                    <span>Discount</span>{" "}
                    <span className="price">
                      -৳{discount?.toLocaleString()}
                    </span>
                  </p>
                  <p className="summary_item">
                    <span className="grand">Grand Total</span>
                    <span className="grand_price">
                      ৳{grandTotal?.toLocaleString()}
                    </span>
                  </p>
                  <button className="continue_btn" onClick={handleCheckout}>
                    Checkout Now
                  </button>
                  <>
                    {/* Sign in modal */}
                    <Modal
                      show={loginModal}
                      onHide={() => setLoginModal(false)}
                      size="md"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Body>
                        <div className="container sign-in-signup-container">
                          {/* <!-- Sign in Form Start --> */}
                          <div
                            className="login"
                            style={{ display: `${login ? "block" : "none"}` }}
                          >
                            <div>
                              <h2>Account Login</h2>
                              <form
                                className="login-form"
                                onSubmit={handleLoginSubmit}
                              >
                                <div className="input-row">
                                  <div className="input-field">
                                    <label htmlFor="loginEmail">Email</label>
                                    <input
                                      type="email"
                                      id="loginEmail"
                                      name="email"
                                      placeholder="Enter a email"
                                      onChange={handleLoginChange}
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="input-row">
                                  <div className="input-field">
                                    <label htmlFor="loginPassword">
                                      Password
                                      <input
                                        type={
                                          showPassword ? "text" : "password"
                                        } // Toggle password visibility
                                        id="loginPassword"
                                        name="password"
                                        placeholder="Enter password"
                                        onChange={handleLoginChange}
                                        required
                                        className="mt-1"
                                      />
                                      <a
                                        onClick={() =>
                                          setShowPassword(!showPassword)
                                        }
                                      >
                                        <img
                                          className="hide-icon"
                                          src={passwordEye.src}
                                          alt="Toggle Password"
                                        />
                                      </a>
                                    </label>
                                  </div>
                                </div>

                                <div className="input-row">
                                  <button className="sign-in-btn" type="submit">
                                    SIGN IN
                                  </button>
                                </div>
                              </form>
                              <div className="switch">
                                <div>
                                  <span>Don't have an account?</span>
                                  <span
                                    className="switch-btn"
                                    onClick={() => setLogin(false)}
                                  >
                                    Register Now
                                  </span>
                                </div>
                                <span className="forgot">Forgot Password?</span>
                              </div>
                            </div>
                          </div>
                          {/* <!-- Sign in Form End --> */}

                          {/* <!-- Registration Form Start --> */}
                          <div
                            className="register"
                            style={{ display: `${login ? "none" : "block"}` }}
                          >
                            <div>
                              <h2>Register Account</h2>
                              <form
                                className="register-form"
                                onSubmit={handleSubmit}
                              >
                                <div className="input-row">
                                  <div className="input-field">
                                    <label htmlFor="name">Name</label>
                                    <input
                                      type="text"
                                      id="name"
                                      name="name"
                                      placeholder="Name"
                                      onChange={handleChange}
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="input-row">
                                  <div className="input-field">
                                    <label htmlFor="email">Email</label>
                                    <input
                                      type="email"
                                      id="email"
                                      name="email"
                                      placeholder="Enter a email"
                                      onChange={handleChange}
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="input-row">
                                  <div className="input-field">
                                    <label htmlFor="number">Phone Number</label>
                                    <input
                                      type="number"
                                      id="number"
                                      name="mobile"
                                      placeholder="Phone number"
                                      onChange={handleChange}
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="input-row">
                                  <div className="input-field">
                                    <label htmlFor="password">
                                      Password
                                      <input
                                        type={
                                          showPassword ? "text" : "password"
                                        } // Toggle password visibility
                                        id="password"
                                        name="password"
                                        placeholder="Enter password"
                                        onChange={handleChange}
                                        required
                                        className="mt-1"
                                      />
                                      <a
                                        onClick={() =>
                                          setShowPassword(!showPassword)
                                        }
                                      >
                                        <img
                                          className="hide-icon"
                                          src={passwordEye.src}
                                          alt="Toggle Password"
                                        />
                                      </a>
                                    </label>
                                  </div>
                                </div>

                                <div className="input-row">
                                  <input
                                    type="checkbox"
                                    id="checkbox"
                                    onChange={() =>
                                      setAcceptedTerms(!acceptedTerms)
                                    }
                                  />
                                  <label
                                    htmlFor="checkbox"
                                    className="checkbox"
                                  >
                                    I accept the{" "}
                                    <a href={"#"} className="policy">
                                      Privacy Policy.
                                    </a>
                                  </label>
                                </div>

                                <div className="input-row">
                                  <button
                                    className="sign-up-btn"
                                    type="submit"
                                    disabled={!acceptedTerms}
                                  >
                                    SIGN UP
                                  </button>
                                </div>
                              </form>
                              <div className="switch">
                                <span>Already have an account?</span>
                                <span
                                  className="switch-btn"
                                  onClick={() => setLogin(true)}
                                >
                                  Login Now
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* <!-- Registration Form End --> */}
                        </div>
                      </Modal.Body>
                    </Modal>

                    {/* Payment Modal */}
                    <Modal
                      show={paymentModal}
                      onHide={() => setPaymentModal(false)}
                      size="md"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <span
                        className="close"
                        onClick={() => setPaymentModal(false)}
                      >
                        &times;
                      </span>
                      <div className="modal-logo">
                        <div className="logo">
                          <img src={logo.src} alt="" />
                        </div>
                      </div>

                      {paymentOption === "bkash" ? (
                        <>
                          <div className="tabs">
                            <div className="tab-buttons">
                              <div className="payment-img">
                                <img src={modalBkash?.src} alt="" />
                              </div>
                            </div>
                            <div className="tab-content">
                              <div>
                                <h2>Instructions:</h2>
                                <p>1. Open Bkash app or dial *247#</p>
                                <p>2. Select Send Money/ Scan this QR Code</p>
                                <div className="qr-code">
                                  <div className="qr-img">
                                    <img src={QRImg.src} alt="" />
                                  </div>
                                </div>
                                <p>
                                  3. Send {grandTotal?.toLocaleString()} BDT to
                                  this Number - 017 00 456 234
                                </p>
                                <p>4. Enter reference no - your name</p>
                                <p>
                                  5. Get you Transaction ID and enter on below
                                  box then click PAY NOW
                                </p>
                              </div>
                            </div>
                          </div>

                          <input
                            className="transaction"
                            type="text"
                            placeholder="Enter your transaction ID"
                            value={tranID}
                            onChange={(e) => setTranID(e.target.value)}
                          />

                          {error?.id === "transaction" ? (
                            <span className="error-message">
                              * {error?.error}
                            </span>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (
                        <></>
                      )}

                      {paymentOption === "nagad" ? (
                        <>
                          <div className="tabs">
                            <div className="tab-buttons">
                              <div className="payment-img">
                                <img src={nagadImg?.src} alt="" />
                              </div>
                            </div>
                            <div className="tab-content">
                              <div>
                                <h2>Instructions:</h2>
                                <p>1. Open Nagad app or dial *167#</p>
                                <p>2. Select Send Money/ Scan this QR Code</p>
                                <div className="qr-code">
                                  <div className="qr-img">
                                    <img src={QRImg.src} alt="" />
                                  </div>
                                </div>
                                <p>
                                  3. Send {grandTotal?.toLocaleString()} BDT to
                                  this Number - 017 00 456 234
                                </p>
                                <p>4. Enter reference no - your name</p>
                                <p>
                                  5. Get you Transaction ID and enter on below
                                  box then click PAY NOW
                                </p>
                              </div>
                            </div>
                          </div>

                          <input
                            className="transaction"
                            type="text"
                            placeholder="Enter your transaction ID"
                            value={tranID}
                            onChange={(e) => setTranID(e.target.value)}
                          />

                          {error?.id === "transaction" ? (
                            <span className="error-message">
                              * {error?.error}
                            </span>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (
                        <></>
                      )}

                      {paymentOption === "bank" ? (
                        <>
                          <div className="tabs">
                            <div className="tab-buttons">
                              <div className="payment-img">
                                <img src={bracBankimg?.src} alt="" />
                              </div>
                            </div>
                            <div className="tab-content">
                              <div>
                                <h2>Instructions:</h2>
                                <p>
                                  1. Transfer the payable amount on our BRAC
                                  bank account and input your account number
                                </p>
                                <div className="account-info">
                                  <p>
                                    Account Holder Name:{" "}
                                    <span>ABC Computers</span>
                                  </p>
                                  <p>
                                    Account Number: <span>{bankAccount}</span>{" "}
                                    <button
                                      className="copy"
                                      onClick={copyBankAccount}
                                    >
                                      <FaRegCopy />
                                    </button>
                                  </p>
                                  <p>
                                    Branch: <span>Pabna Branch</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <input
                            className="transaction"
                            type="text"
                            placeholder="Enter Your Account Number"
                            value={cusBankAccount}
                            onChange={(e) => setCusBankAccount(e.target.value)}
                          />

                          {error?.id === "bankAccount" ? (
                            <span className="error-message">
                              * {error?.error}
                            </span>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                      <button
                        disabled={loading}
                        className="pay-now"
                        onClick={handlePayNow}
                      >
                        {loading ? "Loading..." : "PAY NOW"}
                      </button>
                    </Modal>
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Billing Details End --> */}
    </>
  );
};

export default Checkout;
