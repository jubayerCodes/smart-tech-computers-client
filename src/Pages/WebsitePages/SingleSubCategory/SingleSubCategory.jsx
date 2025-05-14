"use client";

import React, { useContext, useEffect, useState } from "react";
import specialSliderImg4 from "@/assets/img/product/special-slider-img4.webp";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import axios from "axios";
import { QuickViewContext } from "@/Utilities/Contexts/QuickViewContextProvider";
import ProductQuickModal from "@/Components/Shared/ProductQuickModal/ProductQuickModal";
import "../../../assets/css/product.css";
import { CartContext } from "@/Utilities/Contexts/CartContextProvider";

const SingleSubCategory = ({ id: subCategoryId }) => {
  const [filterPrice, setFilterPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const { setProduct } = useContext(QuickViewContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [pages, setPages] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [categories, setCategories] = useState([]);
  const { directAddToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/v1/product-list`
      );

      setProducts(response?.data?.data);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/v1/category`);

      if (response?.data?.status === "success") {
        setCategories(response?.data?.data);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    let newProducts = [];

    // Category Filter
    newProducts = subCategoryId
      ? products?.filter((p) => p.subCategoryID?._id === subCategoryId)
      : products;

    const pageLength = Math.ceil(newProducts?.length / limit);
    const totalPages = Array.from({ length: pageLength }, (_, i) => i + 1);

    const skip = (page - 1) * limit;

    const paginatedProducts = newProducts?.slice(skip, skip + limit);

    setPages(totalPages);
    setFilteredProducts(paginatedProducts);
  }, [subCategoryId, products, page, limit]);

  useEffect(() => {
    // Sidebar Phone View Toggle......

    const toggleBtn = document.querySelector(".toggle-sidebar");
    const sidebar = document.querySelector(".sidebar");
    const closeSidebarBtn = document.getElementById("close-sidebar");

    // Function to toggle the sidebar
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");

      // Add or remove the 'active-toggle' class on the button when sidebar is active
      toggleBtn.classList.toggle(
        "active-toggle",
        sidebar.classList?.contains("active")
      );
    });

    // Close sidebar when close button is clicked
    closeSidebarBtn.addEventListener("click", () => {
      sidebar.classList.remove("active");
      toggleBtn.classList.remove("active-toggle"); // Remove active toggle when sidebar is closed
    });

    // Close sidebar when clicking outside of it
    document.addEventListener("click", (event) => {
      if (
        sidebar.classList?.contains("active") &&
        !sidebar?.contains(event.target) &&
        !toggleBtn?.contains(event.target)
      ) {
        sidebar.classList.remove("active");
        toggleBtn.classList.remove("active-toggle"); // Remove active toggle when clicking outside
      }
    });

    // Sidebar Phone View Toggle......

    // Grid View and Single View.........
    const gridViewBtn = document.querySelector(".grid-view");
    const singleViewBtn = document.querySelector(".single-view");
    const wrapper = document.querySelector(".wrapper");

    gridViewBtn.addEventListener("click", () => {
      wrapper.classList.remove("single-column");
    });

    singleViewBtn.addEventListener("click", () => {
      wrapper.classList.add("single-column");
    });
    // Grid View and Single View.........

    // Select all search bars
    const searchBars = document.querySelectorAll(".search-bar");

    // Add input event listener to each search bar
    searchBars.forEach((searchBar) => {
      searchBar.addEventListener("input", function () {
        const searchValue = this.value.toLowerCase();
        const products = document.querySelectorAll(".product-card");

        products.forEach((product) => {
          const productTitle = product
            .querySelector("h3")
            .innerText.toLowerCase();
          // Show product if it matches the search input, otherwise hide it
          product.style.display = productTitle.includes(searchValue)
            ? "block"
            : "none";
        });
      });
    });
  }, []);

  const updatePrice = (value) => {
    setFilterPrice(value);
  };

  const handleNextPage = () => {
    if (page >= pages?.length) return;

    setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page <= 1) return;

    setPage(page - 1);
  };

  return (
    <>
      <div id="all_products">
        <div className="container">
          <div className="product_page_main">
            {/* <!-- Sidebar for Filters --> */}
            <aside className="sidebar">
              <button id="close-sidebar" className="close_btn">
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="product_searchbar search_desktop_view">
                <h2>Search</h2>
                <br />
                <div className="search_input">
                  <input
                    type="text"
                    className="search-bar"
                    placeholder="Search here..."
                  />
                  <a href="#">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </a>
                </div>
              </div>
              <div className="filter-price">
                <h2>Filter Price</h2>
                <br />
                <div className="price-filter">
                  <input
                    type="range"
                    id="priceRange"
                    min="0"
                    max="999"
                    value={filterPrice}
                    step="1"
                    onInput={(e) => updatePrice(e.target.value)}
                    style={{
                      background: `linear-gradient(to right, #e31736 ${
                        (filterPrice / 999) * 100
                      }%, #ddd ${(filterPrice / 999) * 100}%)`,
                    }}
                  />
                  <p>
                    Price: ৳<span id="priceValue">0</span> - ৳1000
                  </p>
                </div>
              </div>
              <div className="categories">
                <h2>Categories</h2>
                <ul>
                  {categories?.slice(0, 8)?.map((category) => (
                    <li key={category?._id}>
                      <a
                        href="#"
                        className="category-link"
                        data-category={category?._id}
                        onClick={() => {
                          setCategoryId(category?._id);
                          setPage(1);
                        }}
                      >
                        {category?.categoryName}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="#" className="category-link" data-category="more">
                      More... <span></span>
                    </a>
                  </li>
                </ul>
              </div>
              {/* <!-- Big Discount Start --> */}
              <div id="discount">
                <div className="discount_wrapper">
                  <h2 className="title">Big Discount</h2>
                  <span className="offer">Save Up to 70% Off</span>
                  <button className="shop_now_btn">Shop Now</button>
                </div>
              </div>
              {/* <!-- Big Discount End --> */}

              {/* <!-- Special Products Start --> */}
              <div className="special_product">
                <div className="heading">
                  <div>
                    <h2>Specials</h2>
                  </div>
                </div>
                <div className="special_product_card">
                  <div className="product">
                    <img src={specialSliderImg4.src} alt="" />
                    <span className="special_product_status">New</span>

                    <div className="product_icon">
                      <a href="./product-single.html" className="icon">
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
                      <a href="#" className="icon">
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
                      </a>
                      <a href="#" className="icon">
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
                    <div className="rating">
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </div>
                    <h3 className="product_name">
                      HP M24fw 24" FHD IPS Monitor
                    </h3>
                    <div className="price">
                      <span>$129.99</span>
                      <span className="discount">$299.99</span>
                    </div>
                    {/* <!-- Progress --> */}
                    <div className="ce_ixelgen_progress_bar block">
                      <div className="progress_bar">
                        <div className="progress_bar_item grid-x">
                          <div>
                            <h4 className="item_label cell auto">
                              Available: 642
                            </h4>
                          </div>
                          <div className="item_bar cell">
                            <div className="progress" data-progress="20"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- Special Products End --> */}
            </aside>

            <div className="product_item_main wrapper">
              {/* <!-- Header Section --> */}
              <div className="product_searchbar search_phone_view">
                <h2>Search</h2>
                <br />
                <div className="search_input">
                  <input
                    type="text"
                    className="search-bar"
                    placeholder="Search here..."
                  />
                  <a href="#">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </a>
                </div>
              </div>
              <header className="header">
                <div className="d-flex">
                  <div className="toggle-sidebar-wrapper toggle-sidebar">
                    <button className="icon">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_424_17)">
                          <path
                            d="M26 6H4V9.17L11.41 16.59L12 17.17V26H16V24H18V26C18 26.5304 17.7893 27.0391 17.4142 27.4142C17.0391 27.7893 16.5304 28 16 28H12C11.4696 28 10.9609 27.7893 10.5858 27.4142C10.2107 27.0391 10 26.5304 10 26V18L2.59 10.59C2.40283 10.4039 2.25434 10.1827 2.15308 9.93897C2.05182 9.69526 1.99979 9.43391 2 9.17V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H26V6Z"
                            fill="white"
                          />
                          <path
                            d="M29.71 11.2899L26.71 8.28994C26.617 8.19621 26.5064 8.12182 26.3846 8.07105C26.2627 8.02028 26.132 7.99414 26 7.99414C25.868 7.99414 25.7373 8.02028 25.6154 8.07105C25.4936 8.12182 25.383 8.19621 25.29 8.28994L16 17.5899V21.9999H20.41L29.71 12.7099C29.8037 12.617 29.8781 12.5064 29.9289 12.3845C29.9797 12.2627 30.0058 12.132 30.0058 11.9999C30.0058 11.8679 29.9797 11.7372 29.9289 11.6154C29.8781 11.4935 29.8037 11.3829 29.71 11.2899ZM19.59 19.9999H18V18.4099L23 13.4099L24.59 14.9999L19.59 19.9999ZM26 13.5899L24.41 11.9999L26 10.4099L27.59 11.9999L26 13.5899Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_424_17">
                            <rect width="32" height="32" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span>Filter</span>
                    </button>
                  </div>
                </div>
                <div className="product_showing">
                  <div className="showing-entries">
                    <span id="display-info">
                      {`Showing ${(page - 1) * limit + 1}-${
                        page * limit > filteredProducts?.length
                          ? filteredProducts?.length
                          : page * limit
                      } of ${filteredProducts?.length} results`}
                    </span>
                  </div>

                  <div className="grid_icon">
                    <button className="grid-view">
                      <svg
                        width="34"
                        height="34"
                        viewBox="0 0 34 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="10" height="10" rx="1" fill="#09090B" />
                        <rect
                          x="12"
                          width="10"
                          height="10"
                          rx="1"
                          fill="#09090B"
                        />
                        <rect
                          x="24"
                          width="10"
                          height="10"
                          rx="1"
                          fill="#09090B"
                        />
                        <rect
                          y="12"
                          width="10"
                          height="10"
                          rx="1"
                          fill="#09090B"
                        />
                        <rect
                          x="12"
                          y="12"
                          width="10"
                          height="10"
                          rx="1"
                          fill="#09090B"
                        />
                        <rect
                          x="24"
                          y="12"
                          width="10"
                          height="10"
                          rx="1"
                          fill="#09090B"
                        />
                        <rect
                          y="24"
                          width="10"
                          height="10"
                          rx="1"
                          fill="#09090B"
                        />
                        <rect
                          x="12"
                          y="24"
                          width="10"
                          height="10"
                          rx="1"
                          fill="#09090B"
                        />
                        <rect
                          x="24"
                          y="24"
                          width="10"
                          height="10"
                          rx="1"
                          fill="#09090B"
                        />
                      </svg>
                    </button>
                    <button className="single-view">
                      <svg
                        width="32"
                        height="34"
                        viewBox="0 0 32 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 0.833333C0 0.373096 0.373096 0 0.833333 0H9.16667C9.6269 0 10 0.373096 10 0.833333V9.16667C10 9.6269 9.6269 10 9.16667 10H0.833333C0.373096 10 0 9.6269 0 9.16667V0.833333Z"
                          fill="#09090b"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M32 6H12V4H32V6Z"
                          fill="#09090b"
                        />
                        <rect
                          y="12"
                          width="10"
                          height="10"
                          rx="1"
                          fill="#09090b"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M32 18H12V16H32V18Z"
                          fill="#09090b"
                        />
                        <rect
                          y="24"
                          width="10"
                          height="10"
                          rx="1"
                          fill="#09090b"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M32 30H12V28H32V30Z"
                          fill="#09090b"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <select className="sort-by">
                  <option>Default sorting</option>
                  <option>Sort by A to Z</option>
                  <option>Sort by Newest</option>
                  <option>Sort by Best Selling</option>
                  <option>Sort by Price: High to Low</option>
                  <option>Sort by Price: Low to High</option>
                </select>
              </header>

              {/* <!-- Main Product Grid --> */}
              <main className="product-grid product-list">
                {/* <!-- Product Card Example --> */}
                {filteredProducts?.map((product) => (
                  <div
                    className="product-card"
                    data-category={product?.categoryID?._id}
                    key={product?._id}
                  >
                    <div className="special_product_card">
                      <div className="product">
                        <a href={`/products/${product?._id}`}>
                          <img
                            src={`${process.env.NEXT_PUBLIC_API}${product?.productImg}`}
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
                            href="#"
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
                          <a href="#" className="icon">
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
                          <h3 className="product_name">
                            {product?.productName}
                          </h3>
                        </a>
                        <div className="price">
                          <span>
                            ৳{product?.discountPrice?.toLocaleString(2)}
                          </span>
                          <span className="discount">
                            ৳{product?.price?.toLocaleString(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </main>
              {filteredProducts?.length === 0 ? (
                <h5 style={{ textAlign: "center" }}>No Products Found!</h5>
              ) : (
                <></>
              )}

              {/* <!-- Pagination --> */}
              {pages.length > 1 ? (
                <div className="product_pagination">
                  <button
                    className="link"
                    disabled={page <= 1}
                    onClick={handlePrevPage}
                  >
                    <FaAnglesLeft />
                  </button>
                  {pages?.map((p) => (
                    <button
                      key={p}
                      className={`link ${p === page ? "active" : ""}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    className="link"
                    onClick={handleNextPage}
                    disabled={page >= pages?.length}
                  >
                    <FaAnglesRight />
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
      <ProductQuickModal />
    </>
  );
};

export default SingleSubCategory;
