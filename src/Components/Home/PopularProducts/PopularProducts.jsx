"use client";

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { QuickViewContext } from "@/Utilities/Contexts/QuickViewContextProvider";
import { CartContext } from "@/Utilities/Contexts/CartContextProvider";

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const { setProduct } = useContext(QuickViewContext);
  const { directAddToCart } = useContext(CartContext);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/v1/product-list`
      );

      if (response?.data?.status === "success") {
        setProducts(response?.data?.data);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div className="populer_product">
        <div className="container">
          <div className="heading">
            <div>
              <h2>Popular Products</h2>
            </div>
          </div>

          <div id="newproduct">
            <div className="row g-3 g-md-4">
              {products?.slice(0, 8)?.map((product) => (
                <div
                  key={product?._id}
                  className="col-lg-3 col-6 d-flex align-item-stretch"
                >
                  <div className="populer_product_card">
                    <div className="product">
                      <a href={`/products/${product?._id}`}>
                        <img
                          src={`${process.env.NEXT_PUBLIC_API}${product.productImg}`}
                          alt=""
                        />
                      </a>
                      <span
                        className={`product_status ${
                          !product?.stock ? "sold_out" : ""
                        }`}
                      >
                        {!product?.stock ? "Out Of Stock" : "In Stock"}
                      </span>

                      <div className="product_icon">
                        <a
                          href=""
                          className="icon"
                          id="quick_view"
                          data-bs-toggle="modal"
                          data-bs-target="#quickViewModal"
                          onClick={() => {
                            setProduct(product);
                          }}
                        >
                          <svg
                            width="39"
                            height="27"
                            viewBox="0 0 39 27"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19.5 1C10.8676 1 3.55869 6.24444 1 13.5C3.55869 20.7556 10.8676 26 19.5 26C28.1324 26 35.4413 20.7556 38 13.5C35.4413 6.24444 28.1324 1 19.5 1Z"
                              stroke="white"
                              strokeWidth="2"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M19 21C22.866 21 26 17.6421 26 13.5C26 9.35786 22.866 6 19 6C15.134 6 12 9.35786 12 13.5C12 17.6421 15.134 21 19 21Z"
                              stroke="white"
                              strokeWidth="2"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                        <button
                          className="icon"
                          onClick={() =>
                            directAddToCart(product?._id, product?.stock)
                          }
                        >
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_1_35)">
                              <path
                                d="M24.3301 22.9997H13.5301C12.8711 23.001 12.23 22.7853 11.7058 22.3858C11.1817 21.9864 10.8036 21.4255 10.6301 20.7897L8.00007 11.2597C7.95962 11.1114 7.95392 10.9557 7.9834 10.8048C8.01289 10.654 8.07677 10.5119 8.17007 10.3897C8.26728 10.2632 8.39334 10.1618 8.53773 10.094C8.68212 10.0261 8.84065 9.9938 9.00007 9.99971H28.0001C28.147 9.99947 28.2921 10.0316 28.4252 10.0938C28.5583 10.156 28.6761 10.2468 28.7701 10.3597C28.8629 10.4727 28.9298 10.6047 28.9661 10.7464C29.0024 10.8881 29.0072 11.036 28.9801 11.1797L27.2801 20.5397C27.1537 21.2301 26.7894 21.8543 26.2504 22.3037C25.7114 22.7532 25.0319 22.9995 24.3301 22.9997ZM10.3301 11.9997L12.5801 20.2597C12.6387 20.4779 12.7694 20.6698 12.951 20.8041C13.1326 20.9385 13.3543 21.0074 13.5801 20.9997H24.3801C24.6169 21.0036 24.8473 20.9233 25.0305 20.7731C25.2136 20.6229 25.3375 20.4127 25.3801 20.1797L26.8001 11.9997H10.3301Z"
                                fill="#ffff"
                              />
                              <path
                                d="M9 12C8.77555 12.0083 8.55485 11.9408 8.37344 11.8084C8.19203 11.6759 8.06049 11.4863 8 11.27L6.45 5.73C6.38951 5.5137 6.25797 5.32406 6.07656 5.19163C5.89515 5.05921 5.67445 4.9917 5.45 5H4C3.73478 5 3.48043 4.89465 3.29289 4.70711C3.10536 4.51957 3 4.26522 3 4C3 3.73479 3.10536 3.48043 3.29289 3.2929C3.48043 3.10536 3.73478 3 4 3H5.49C6.1434 2.99908 6.77923 3.2115 7.30086 3.60498C7.8225 3.99846 8.20141 4.55149 8.38 5.18L10 10.73C10.0406 10.8613 10.0538 10.9996 10.0386 11.1362C10.0234 11.2729 9.98021 11.4049 9.9117 11.5241C9.8432 11.6432 9.75086 11.747 9.64045 11.8289C9.53004 11.9108 9.40393 11.969 9.27 12C9.18059 12.0146 9.08941 12.0146 9 12Z"
                                fill="#ffff"
                              />
                              <path
                                d="M16 29C15.6044 29 15.2178 28.8827 14.8889 28.6629C14.56 28.4432 14.3036 28.1308 14.1522 27.7654C14.0009 27.3999 13.9613 26.9978 14.0384 26.6098C14.1156 26.2219 14.3061 25.8655 14.5858 25.5858C14.8655 25.3061 15.2219 25.1156 15.6098 25.0384C15.9978 24.9613 16.3999 25.0009 16.7654 25.1522C17.1308 25.3036 17.4432 25.56 17.6629 25.8889C17.8827 26.2178 18 26.6044 18 27C18 27.5304 17.7893 28.0391 17.4142 28.4142C17.0391 28.7893 16.5304 29 16 29Z"
                                fill="#ffff"
                              />
                              <path
                                d="M22 29C21.6044 29 21.2178 28.8827 20.8889 28.6629C20.56 28.4432 20.3036 28.1308 20.1522 27.7654C20.0009 27.3999 19.9613 26.9978 20.0384 26.6098C20.1156 26.2219 20.3061 25.8655 20.5858 25.5858C20.8655 25.3061 21.2219 25.1156 21.6098 25.0384C21.9978 24.9613 22.3999 25.0009 22.7654 25.1522C23.1308 25.3036 23.4432 25.56 23.6629 25.8889C23.8827 26.2178 24 26.6044 24 27C24 27.5304 23.7893 28.0391 23.4142 28.4142C23.0391 28.7893 22.5304 29 22 29Z"
                                fill="#ffff"
                              />
                              <path
                                d="M22 17H16C15.7348 17 15.4804 16.8946 15.2929 16.7071C15.1054 16.5196 15 16.2652 15 16C15 15.7348 15.1054 15.4804 15.2929 15.2929C15.4804 15.1054 15.7348 15 16 15H22C22.2652 15 22.5196 15.1054 22.7071 15.2929C22.8946 15.4804 23 15.7348 23 16C23 16.2652 22.8946 16.5196 22.7071 16.7071C22.5196 16.8946 22.2652 17 22 17Z"
                                fill="#ffff"
                              />
                            </g>
                            <defs>
                              <clipPath>
                                <rect width="32" height="32" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </button>
                        <a href="./product-single.html" className="icon">
                          <svg
                            width="36"
                            height="32"
                            viewBox="0 0 36 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M17.7046 32L17.1119 31.4641C3.6298 20.134 0 16.1531 0 9.64593C0 4.28708 4.22242 0 9.33378 0C13.6303 0 16.0748 2.52631 17.7046 4.44018C19.3343 2.52631 21.7788 0 26.0753 0C31.2608 0 35.4091 4.36363 35.4091 9.64593C35.4091 16.1531 31.7793 20.134 18.2972 31.4641L17.7046 32ZM9.33378 1.99042C5.25951 1.99042 1.92601 5.4354 1.92601 9.64593C1.92601 15.2344 5.33359 18.9091 17.7046 29.3971C30.0755 18.9091 33.4831 15.2344 33.4831 9.64593C33.4831 5.4354 30.1496 1.99042 26.0753 1.99042C22.3715 1.99042 20.3714 4.28708 18.8157 6.1244L17.7046 7.42584L16.5934 6.1244C15.0378 4.28708 13.0377 1.99042 9.33378 1.99042Z"
                              fill="white"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>

                    <div className="product_details">
                      <a href={`/products/${product?._id}`}>
                        <h3 className="product_name">{product?.productName}</h3>
                      </a>
                      <div className="price">
                        <span>
                          ৳ {product?.discountPrice?.toLocaleString(2)}
                        </span>
                        <span>৳ {product?.price?.toLocaleString(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="view_all_products">
            <a href="/products" className="view_all_btn">
              View All Products
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopularProducts;
