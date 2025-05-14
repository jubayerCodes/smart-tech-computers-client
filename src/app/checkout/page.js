import Checkout from "@/Pages/WebsitePages/Checkout/Checkout";
import React from "react";
import "@/assets/css/checkout.css";

export const metadata = {
  title: "Checkout | ABC Computers",
};

const CheckoutPage = () => {
  return (
    <>
      <Checkout />
    </>
  );
};

export default CheckoutPage;
