
import React from "react";

import cardImg1 from "@/assets/img/credit-card1.webp";
import cardImg2 from "@/assets/img/credit-card2.webp";
import expressImg from "@/assets/img/express.webp";
import bkashImg from "@/assets/img/bkash.webp";

import paypalImg from "@/assets/img/paypal.webp";
import stripeImg from "@/assets/img/strip.webp";

import productImg1 from "@/assets/img/cart-product-img1.webp";
import productImg2 from "@/assets/img/cart-product-img2.webp";
import productImg3 from "@/assets/img/cart-product-img3.webp";

const Payment = () => {
  return (
    <>
      {/* <!-- Payment Start --> */}
      <div className="billing_details">
        <div className="container">
          <div className="breadcrumb">
            <a href="/cart">Shopping Cart</a>
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
            <a href="/checkout">Checkout </a>
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
            <span className="breadcrumb_last active">Payment Method</span>
          </div>

          <div className="row">
            <div className="col-lg-8">
              <div className="shipping_method_container">
                <h2>Shipping Method</h2>

                {/* <!-- Credit Card Option --> */}
                <div className="credit_card_wrapper">
                  <label className="method_option credit_card">
                    <input
                      type="radio"
                      name="payment-method"
                      id="credit-card"
                      defaultChecked
                    />
                    <span className="method_label credit_card_method_label">
                      Credit Card
                      <strong className="card_logo_box">
                        <span className="logo" data-card="MasterCard">
                          <img src={cardImg1.src} alt="MasterCard" />
                        </span>
                        <span className="logo" data-card="Visa">
                          <img src={cardImg2.src} alt="Visa" />
                        </span>
                        <span className="logo" data-card="American Express">
                          <img src={expressImg.src} alt="American Express" />
                        </span>
                        <span className="logo" data-card="Discover">
                          <img src={bkashImg.src} alt="Discover" />
                        </span>
                      </strong>
                    </span>
                  </label>

                  <div className="credit_card_info">
                    <div className="form_group">
                      <h2>Card Number</h2>
                      <input
                        type="text"
                        id="card-number"
                        placeholder="Enter card number"
                        required
                        maxlength="19"
                      />
                    </div>
                    <div className="form_group">
                      <h2>Name on Card</h2>
                      <input
                        type="text"
                        id="card-name"
                        placeholder="Enter card name"
                        required
                      />
                    </div>

                    <div className="credit_card_row">
                      <div className="form_group">
                        <h2>Expiration Date</h2>
                        <input
                          type="text"
                          id="expiration-date"
                          placeholder="Enter expiration date (MM/YY)"
                          required
                          maxlength="5"
                        />
                      </div>
                      <div className="form_group">
                        <h2>CVV</h2>
                        <input
                          type="text"
                          id="cvv"
                          placeholder="Enter CVV"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- Credit Card Option End --> */}

                {/* <!-- Paypal Option --> */}
                <label className="method_option">
                  <input type="radio" name="payment-method" id="paypal" />
                  <strong className="method_label">
                    Paypal
                    <span className="card_logo_box">
                      <span className="paypal_logo">
                        <img src={paypalImg.src} alt="PayPal" />
                      </span>
                    </span>
                  </strong>
                </label>

                {/* <!-- Stripe Option --> */}
                <label className="method_option">
                  <input type="radio" name="payment-method" id="stripe" />
                  <strong className="method_label">
                    Stripe
                    <span className="card_logo_box">
                      <span className="stripe_logo">
                        <img src={stripeImg.src} alt="Stripe" />
                      </span>
                    </span>
                  </strong>
                </label>
              </div>
            </div>

            {/* <!-- Summery --> */}
            <div className="col-lg-4">
              <div className="order_summery_wrapper">
                <div className="order_items">
                  <div className="cart_header">
                    <h2>Your Order</h2>
                  </div>
                  <ul className="cart_items">
                    <li>
                      <div className="product_details_wrapper">
                        <div className="product_item">
                          <img src={productImg1.src} alt="" />
                        </div>
                        <div className="item">
                          <span className="title">DJI Osmo Mobile 6</span>
                          <div className="type_wrap_container">
                            <h2 className="type_wrap">
                              Gimbal<span>1×</span>
                            </h2>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="price"> $149.99 </span>
                      </div>
                    </li>
                    <li>
                      <div className="product_details_wrapper">
                        <div className="product_item">
                          <img src={productImg2.src} alt="" />
                        </div>
                        <div className="item">
                          <span className="title">MSI- Gaming Case</span>
                          <div className="type_wrap_container">
                            <h2 className="type_wrap">
                              Gaming Case<span>1×</span>
                            </h2>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="price"> $139.99 </span>
                      </div>
                    </li>
                    <li>
                      <div className="product_details_wrapper">
                        <div className="product_item">
                          <img src={productImg3.src} alt="" />
                        </div>
                        <div className="item">
                          <span className="title">CAUGAR- Gaming Head</span>
                          <div className="type_wrap_container">
                            <h2 className="type_wrap">
                              Headphone<span>1×</span>
                            </h2>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="price">$54.00</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="order_summary mt-4">
                  <p className="summary_item">
                    <span>Sub-Total</span>{" "}
                    <span className="price1">$343.98</span>
                  </p>
                  <p className="summary_item">
                    <span>Taxes</span> <span className="price">-$5.00</span>
                  </p>
                  <p className="summary_item">
                    <span>Discount</span> <span className="price">-$0</span>
                  </p>
                  <p className="summary_item">
                    <span>Shipment Cost</span>{" "}
                    <span className="price">$22.50</span>
                  </p>
                  <p className="summary_item">
                    <span className="grand">Grand Total</span>
                    <span className="grand_price">$371.48</span>
                  </p>
                  <a href="/thank-you" className="checkout_btn">
                    Checkout Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Payment End --> */}
    </>
  );
};

export default Payment;
