"use client";
import "@/assets/css/product-single.css";
import "@/assets/css/vendor/lightslider.css";
import Breadcrumb from "@/Components/Shared/Breadcrumb/Breadcrumb";
import { useContext, useEffect, useState } from "react";
import "./SingleProduct.css";

import moreProduct1 from "@/assets/img/product/more-product-img1.webp";
import moreProduct2 from "@/assets/img/product/more-product-img2.webp";
import moreProduct3 from "@/assets/img/product/more-product-img3.webp";
import moreProduct4 from "@/assets/img/product/more-product-img4.webp";

import recentImg1 from "@/assets/img/product/recent-shopping-img1.webp";
import recentImg2 from "@/assets/img/product/recent-shopping-img2.webp";
import recentImg3 from "@/assets/img/product/recent-shopping-img3.webp";
import recentImg4 from "@/assets/img/product/recent-shopping-img4.webp";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { LiaTimesSolid } from "react-icons/lia";
import { Swiper, SwiperSlide } from "swiper/react";

import axios from "axios";
import "swiper/css";
import { FreeMode, Thumbs } from "swiper/modules";
import { CartContext } from "@/Utilities/Contexts/CartContextProvider";
import { useRouter } from "next/navigation";

const SingleProduct = ({ id }) => {
  const router = useRouter();

  const [productDetails, setProductDetails] = useState({});
  const product = productDetails?.productID;
  const [selectedColor, setSelectedColor] = useState("");
  const [colorSelected, setColorSelected] = useState(true);

  const { addToCart } = useContext(CartContext);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/v1/product-details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response?.data?.status === "success") {
        setProductDetails(response?.data?.data);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    console.log(productDetails);
  }, [productDetails]);

  // Slider Product Quantity Start..................
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (selectedColor === "" && product?.color?.length) {
      setColorSelected(false);
      return;
    }

    setColorSelected(true);

    const cartItem = {
      productID: productDetails?.productID?._id,
      productName: productDetails?.productID?.productName,
      price:
        productDetails?.productID?.discountPrice ||
        productDetails?.productID?.price,
      productImg: productDetails?.productID?.productImg,
      subCategory: productDetails?.productID?.subCategoryID?.subCategoryName,
      quantity: quantity,
    };

    if (selectedColor !== "") {
      cartItem.color = selectedColor;
    }

    addToCart(cartItem);
  };

  const handleBuyNow = () => {
    if (selectedColor === "" && product?.color?.length) {
      setColorSelected(false);
      return;
    }

    setColorSelected(true);

    const cartItem = {
      productID: productDetails?.productID?._id,
      productName: productDetails?.productID?.productName,
      price:
        productDetails?.productID?.discountPrice ||
        productDetails?.productID?.price,
      productImg: productDetails?.productID?.productImg,
      subCategory: productDetails?.productID?.subCategoryID?.subCategoryName,
      quantity: quantity,
    };

    if (selectedColor !== "") {
      cartItem.color = selectedColor;
    }

    addToCart(cartItem);

    router.push("/cart");
  };

  return (
    <>
      <Breadcrumb pageTitle={product?.productName} />

      {/* <!-- Product Single Start --> */}
      <div className="single_product">
        <div className="container">
          <div className="single_product_wrapper">
            <div className="row no-gutters">
              <div className="col-lg-6">
                <Swiper
                  style={{
                    "--swiper-navigation-color": "#fff",
                    "--swiper-pagination-color": "#fff",
                  }}
                  loop={true}
                  spaceBetween={10}
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[FreeMode, Thumbs]}
                  className="mySwiper2"
                >
                  {productDetails?.productImgs?.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_API}${img}`}
                        alt=""
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <Swiper
                  onSwiper={setThumbsSwiper}
                  loop={true}
                  spaceBetween={5}
                  slidesPerView={5}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Thumbs]}
                  className="mySwiper"
                >
                  {productDetails?.productImgs?.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_API}${img}`}
                        alt=""
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="col-lg-6">
                {/* <!-- Product Details Section --> */}
                <div className="product_details_custom">
                  <h1>{product?.productName}</h1>
                  <div className="price">
                    <span className="discounted_price">
                      ৳{product?.discountPrice?.toLocaleString(2)}
                    </span>
                    <span className="original_price">
                      ৳{product?.price?.toLocaleString(2)}
                    </span>
                  </div>

                  <div className="product_all_details">
                    <div className="availability_custom">
                      <div className="product_stock">
                        <span className="available">Available</span>
                        <p
                          className={`in_stock ${
                            product?.stock === 0 ? "text-danger" : ""
                          }`}
                        >
                          :{" "}
                          <span>
                            {product?.stock > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </p>
                      </div>

                      <div className="product_code">
                        <p>Product Code: {product?.productCode}</p>
                      </div>
                    </div>

                    <div className="key_feature">
                      <p>Key Features</p>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: productDetails?.keyFeature,
                        }}
                      ></div>
                    </div>
                  </div>

                  {product?.stock !== 0 ? (
                    <>
                      {product?.color?.length ? (
                        <>
                          <div className="select_color_custom">
                            <label>Select Color: {selectedColor}</label>
                            <div className="color_btn_container">
                              {product?.color?.map((color, idx) => (
                                <button
                                  onClick={() => setSelectedColor(color)}
                                  key={idx}
                                  className={`color_btn ${
                                    selectedColor === color ? "active" : ""
                                  }`}
                                >
                                  {color}
                                </button>
                              ))}

                              <button
                                onClick={() => setSelectedColor("")}
                                className={`color_btn`}
                              >
                                <LiaTimesSolid />
                              </button>
                            </div>
                            {!colorSelected ? (
                              <span className="text-danger">
                                *Select color first!
                              </span>
                            ) : (
                              <></>
                            )}
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                      <div className="action_buttons_custom">
                        <div className="quantity_wrapper">
                          <div className="quantity_custom">
                            <button
                              type="button"
                              className="btn-decrease"
                              onClick={() => decreaseQuantity()}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              id="quantity"
                              min="1"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                            />
                            <button
                              type="button"
                              className="btn-increase"
                              onClick={() => increaseQuantity()}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="button_wrapper">
                          <button
                            className="add_to_cart"
                            onClick={handleAddToCart}
                          >
                            Add to Cart
                          </button>
                          <button className="buy_now" onClick={handleBuyNow}>
                            Buy Now
                          </button>
                        </div>
                      </div>

                      <div className="gift_receipt_custom">
                        <label>
                          <input type="checkbox" />
                          <span>Add a gift receipt for easy returns</span>
                        </label>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Product Single End --> */}

      {/* <!-- Product DEs --> */}
      <div className="product_des">
        <div className="container">
          <div className="buttons">
            <a href="#specification" className="tab_btn">
              Specification
            </a>
            <a href="#description" className="tab_btn">
              Description
            </a>
          </div>
          <div id="specification" className="table_wrapper">
            <div
              dangerouslySetInnerHTML={{
                __html: productDetails?.specification,
              }}
            ></div>
          </div>
        </div>
      </div>
      {/* <!-- Product DEs --> */}

      {/* <!-- Product Documents Start --> */}
      <div id="description" className="product_document">
        <div className="container">
          <div className="document">
            <h2 className="title">Description</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: productDetails?.description,
              }}
            ></div>
          </div>
        </div>
      </div>
      {/* <!-- Product Documents End --> */}
    </>
  );
};

export default SingleProduct;
