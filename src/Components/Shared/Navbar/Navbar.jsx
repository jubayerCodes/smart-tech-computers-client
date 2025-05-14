"use client";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import logo from "@/assets/img/main_logo_stc.png";
import { FaAngleRight, FaBars, FaSearch, FaTimes } from "react-icons/fa";
import cartImg1 from "@/assets/img/cart-product-img1.webp";
import cartImg2 from "@/assets/img/cart-product-img2.webp";
import cartImg3 from "@/assets/img/cart-product-img3.webp";
import Link from "next/link";
import axios from "axios";
import MenuItem from "./MenuItem/MenuItem";
import { CartContext } from "@/Utilities/Contexts/CartContextProvider";

const Navbar = () => {
  const searchRef = useRef(null);

  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, subTotal } =
    useContext(CartContext);

  const [search, setSearch] = useState(false);
  const [categories, setCategories] = useState([]);
  const menuUlRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const path = usePathname();

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

  useEffect(() => {
    const searchedProducts = products?.filter((product) =>
      product?.productName?.toLowerCase().includes(searchValue.toLowerCase())
    );

    setFilteredProducts(searchedProducts);
  }, [products, searchValue]);

  useEffect(() => {
    setSearchResult(false);

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResult(false);
      }
    };

    setSearchValue("");
    setSearch(false);

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [path]);

  useEffect(() => {
    if (path.startsWith("/dashboard")) {
      return;
    }

    const resetDropdowns = () => {
      document.querySelectorAll("li.megamenu").forEach((item) => {
        item.classList.remove("sub-open");
      });
    };

    document.addEventListener("click", function (event) {
      if (!event.target.closest(".tooltip-a, .toggle-tooltip")) {
        document.querySelectorAll(".tooltip-a").forEach(function (tooltip) {
          tooltip.classList.remove("active");
          setSearch(false);
        });
      }
    });

    document.querySelectorAll("ul.submenu").forEach((submenu) => {
      let parentLi = submenu.closest("li");
      if (parentLi) {
        parentLi.classList.add("megamenu");
      }
    });

    function handleResize() {
      if (window.innerWidth < 1150) {
        // Add #menu_trigger if it doesn't exist
        if (!document.getElementById("menu_trigger")) {
          let menuTrigger = document.createElement("a");
          menuTrigger.href = "#";
          menuTrigger.id = "menu_trigger";
          menuTrigger.className = "menulines-button";
          menuTrigger.innerHTML = '<span class="menulines"></span>';
          document.getElementById("mainmenu")?.prepend(menuTrigger);
        }

        // Wrap .menu in .mobile-menu if it doesn't exist
        if (!document.querySelector(".mobile-menu")) {
          document.querySelectorAll(".menu").forEach((menu) => {
            let mobileMenu = document.createElement("div");
            mobileMenu.className = "mobile-menu";
            menu.parentNode.insertBefore(mobileMenu, menu);
            mobileMenu.appendChild(menu);

            Object.assign(mobileMenu.style, {
              position: "fixed",
              top: "65px",
              left: "-100%",
              height: "100%",
              width: "300px",
              zIndex: "1000",
              transition: "left 0.5s ease",
            });
          });
        }

        // Add back button for submenus if it doesn't exist
        document.querySelectorAll(".submenu").forEach((submenu) => {
          if (!submenu.querySelector(".backmenu-row")) {
            let subvalue = submenu.previousElementSibling?.textContent || "";
            let backMenuRow = document.createElement("div");
            backMenuRow.className = "backmenu-row";
            backMenuRow.innerHTML = `<a href="#" class="back-trigger"></a><em>${subvalue}</em>`;
            submenu.prepend(backMenuRow);
          }
        });
      } else {
        // Remove elements added for mobile view
        document.getElementById("menu_trigger")?.remove();
        document.querySelectorAll(".mobile-menu").forEach((mobileMenu) => {
          let menu = mobileMenu.querySelector(".menu");
          if (menu) {
            mobileMenu.parentNode.insertBefore(menu, mobileMenu);
          }
          mobileMenu.remove();
        });
        document.querySelectorAll(".back-trigger").forEach((el) => el.remove());
      }
    }

    // Run on resize
    window.addEventListener("resize", handleResize);
    handleResize();

    // Close mobile menu when close_btn is clicked
    document.addEventListener("click", function (event) {
      if (event.target.closest(".close_btn")) {
        let mobileMenu = document.querySelector(".mobile-menu");
        if (mobileMenu) {
          mobileMenu.style.left = "-100%"; // Close menu
        }

        document
          .querySelectorAll("#menu_trigger, #menu_trigger2")
          .forEach((trigger) => {
            trigger.classList.remove("menuopen");
          });

        resetDropdowns();
        event.preventDefault();
      }
    });

    // Close mobile menu if clicked outside
    document.addEventListener("click", function (event) {
      let mobileMenu = document.querySelector(".mobile-menu");
      if (
        mobileMenu &&
        !event.target.closest(".mobile-menu, #menu_trigger, #menu_trigger2")
      ) {
        mobileMenu.style.left = "-100%"; // Close menu

        document
          .querySelectorAll("#menu_trigger, #menu_trigger2")
          .forEach((trigger) => {
            trigger.classList.remove("menuopen");
          });

        resetDropdowns(); // Reset dropdowns to default state
      }
    });

    const cartSidebar = document.getElementById("cartSidebar");
    const overlay = document.getElementById("overlay_cart");
    cartSidebar.classList.remove("active");
    overlay.classList.remove("active");
  }, [path, categories]);

  // Navbar header Add to Cart Sidebar Js Start...................

  const toggleCart = () => {
    const cartSidebar = document.getElementById("cartSidebar");
    const overlay = document.getElementById("overlay_cart");
    cartSidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  };
  // Navbar header Add to Cart Sidebar Js End...................

  const toggleMobileMenu = (e) => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    const mobileMenu = document.querySelector(".mobile-menu");

    if (mobileMenu && getComputedStyle(mobileMenu).left === "0px") {
      mobileMenu.style.left = "-100%"; // Close menu
      document
        .querySelectorAll("#menu_trigger, #menu_trigger2")
        .forEach((trigger) => {
          trigger.classList.remove("menuopen");
        });

      document.querySelectorAll("li.megamenu").forEach((item) => {
        item.classList.remove("sub-open");
      });
    } else {
      if (mobileMenu) {
        mobileMenu.style.left = "0"; // Open menu
      }
      document
        .querySelectorAll("#menu_trigger, #menu_trigger2")
        .forEach((trigger) => {
          trigger.classList.add("menuopen");
        });
    }
  };

  const handleSearch = () => {
    setSearch(!search);
  };

  const handleSubOpen = (li) => {
    const menuItems = menuUlRef.current.children;
    const activeLi = Array.from(menuItems).find((el) =>
      el.classList.contains("sub-open")
    );

    if (activeLi) {
      activeLi.classList.remove("sub-open");
    }

    li.classList.add("sub-open");
  };

  const handleSearchValue = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  if (path.startsWith("/dashboard")) {
    return;
  }

  return (
    <>
      <header id="navbar_header">
        <div className="container">
          <div className="header_wrapper">
            <div className="mobile_view_toggle">
              <a href="#" id="menu_trigger2" onClick={() => toggleMobileMenu()}>
                <FaBars className="icon" />
              </a>
            </div>
            <a href="/" className="header_logo mobile_view_logo">
              <img src={logo.src} alt="" />
            </a>
            <a href="/" className="header_logo desktop_view">
              <img src={logo.src} alt="" />
            </a>
            <div className="search">
              <input
                className="search_icon"
                type="text"
                placeholder="Search"
                value={searchValue}
                onInput={handleSearchValue}
                onClick={() => setSearchResult(true)}
              />
              <button type="submit" className="src_btn">
                <FaSearch className="icon" />
              </button>

              {searchValue !== "" && searchResult ? (
                filteredProducts.length ? (
                  <div className={`search-result`} ref={searchRef}>
                    {filteredProducts?.slice(0, 4)?.map((product) => (
                      <a href={`/products/${product?._id}`} key={product?._id}>
                        <div className="search_product_card">
                          <div className="product">
                            <img
                              alt=""
                              src={`${process.env.NEXT_PUBLIC_API}${product?.productImg}`}
                            />
                          </div>
                          <div className="product_details">
                            <h3 className="product_name">
                              {product?.productName}
                            </h3>
                            <div className="price">
                              <span className="main-price">
                                ৳{product?.discountPrice}
                              </span>
                              <span className="discount text-muted">
                                <del>৳{product?.price}</del>
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className={`search-result`} ref={searchRef}>
                      <p className="text-center mt-3">No Products found!</p>
                    </div>
                  </>
                )
              ) : (
                <></>
              )}
            </div>
            <div className="header_item_wrapper">
              <div className="others">
                <a
                  className="icon mobile_view_icon search-toggle toggle-tooltip"
                  onClick={() => handleSearch()}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.5312 18.625C22.4688 17.15 23.0187 15.4 23.0187 13.5188C23.0187 8.2625 18.7625 4 13.5125 4C8.25625 4 4 8.2625 4 13.5188C4 18.775 8.25625 23.0375 13.5063 23.0375C15.4125 23.0375 17.1875 22.475 18.675 21.5125L19.1063 21.2125L25.8937 28L28 25.8563L21.2188 19.0688L21.5312 18.625ZM18.8375 8.2C20.2563 9.61875 21.0375 11.5062 21.0375 13.5125C21.0375 15.5187 20.2563 17.4063 18.8375 18.825C17.4187 20.2438 15.5312 21.025 13.525 21.025C11.5187 21.025 9.63125 20.2438 8.2125 18.825C6.79375 17.4063 6.0125 15.5187 6.0125 13.5125C6.0125 11.5062 6.79375 9.61875 8.2125 8.2C9.63125 6.78125 11.5187 6 13.525 6C15.5312 6 17.4187 6.78125 18.8375 8.2Z"
                      fill="#09090B"
                    />
                  </svg>
                </a>
                <a
                  className="icon cart_icon cart_button"
                  onClick={() => toggleCart()}
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
                        fill="#09090B"
                      />
                      <path
                        d="M9 12C8.77555 12.0083 8.55485 11.9408 8.37344 11.8084C8.19203 11.6759 8.06049 11.4863 8 11.27L6.45 5.73C6.38951 5.5137 6.25797 5.32406 6.07656 5.19163C5.89515 5.05921 5.67445 4.9917 5.45 5H4C3.73478 5 3.48043 4.89465 3.29289 4.70711C3.10536 4.51957 3 4.26522 3 4C3 3.73479 3.10536 3.48043 3.29289 3.2929C3.48043 3.10536 3.73478 3 4 3H5.49C6.1434 2.99908 6.77923 3.2115 7.30086 3.60498C7.8225 3.99846 8.20141 4.55149 8.38 5.18L10 10.73C10.0406 10.8613 10.0538 10.9996 10.0386 11.1362C10.0234 11.2729 9.98021 11.4049 9.9117 11.5241C9.8432 11.6432 9.75086 11.747 9.64045 11.8289C9.53004 11.9108 9.40393 11.969 9.27 12C9.18059 12.0146 9.08941 12.0146 9 12Z"
                        fill="#09090B"
                      />
                      <path
                        d="M16 29C15.6044 29 15.2178 28.8827 14.8889 28.6629C14.56 28.4432 14.3036 28.1308 14.1522 27.7654C14.0009 27.3999 13.9613 26.9978 14.0384 26.6098C14.1156 26.2219 14.3061 25.8655 14.5858 25.5858C14.8655 25.3061 15.2219 25.1156 15.6098 25.0384C15.9978 24.9613 16.3999 25.0009 16.7654 25.1522C17.1308 25.3036 17.4432 25.56 17.6629 25.8889C17.8827 26.2178 18 26.6044 18 27C18 27.5304 17.7893 28.0391 17.4142 28.4142C17.0391 28.7893 16.5304 29 16 29Z"
                        fill="#09090B"
                      />
                      <path
                        d="M22 29C21.6044 29 21.2178 28.8827 20.8889 28.6629C20.56 28.4432 20.3036 28.1308 20.1522 27.7654C20.0009 27.3999 19.9613 26.9978 20.0384 26.6098C20.1156 26.2219 20.3061 25.8655 20.5858 25.5858C20.8655 25.3061 21.2219 25.1156 21.6098 25.0384C21.9978 24.9613 22.3999 25.0009 22.7654 25.1522C23.1308 25.3036 23.4432 25.56 23.6629 25.8889C23.8827 26.2178 24 26.6044 24 27C24 27.5304 23.7893 28.0391 23.4142 28.4142C23.0391 28.7893 22.5304 29 22 29Z"
                        fill="#09090B"
                      />
                      <path
                        d="M22 17H16C15.7348 17 15.4804 16.8946 15.2929 16.7071C15.1054 16.5196 15 16.2652 15 16C15 15.7348 15.1054 15.4804 15.2929 15.2929C15.4804 15.1054 15.7348 15 16 15H22C22.2652 15 22.5196 15.1054 22.7071 15.2929C22.8946 15.4804 23 15.7348 23 16C23 16.2652 22.8946 16.5196 22.7071 16.7071C22.5196 16.8946 22.2652 17 22 17Z"
                        fill="#09090B"
                      />
                    </g>
                    <defs>
                      <clipPath>
                        <rect width="32" height="32" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span>{cart?.length}</span>
                </a>
                <Link href={"/user-profile"} className="icon">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_1_46)">
                      <path
                        d="M21.947 16.332C23.219 14.915 24 13.049 24 11C24 6.589 20.411 3 16 3C11.589 3 8 6.589 8 11C8 15.411 11.589 19 16 19C17.555 19 19.003 18.547 20.233 17.776C24.583 19.415 27.578 23.396 27.959 28H4.042C4.301 24.901 5.755 22.011 8.12 19.949C8.537 19.586 8.58 18.955 8.217 18.538C7.855 18.122 7.223 18.078 6.806 18.441C3.751 21.103 2 24.951 2 29C2 29.553 2.448 30 3 30H29C29.553 30 30 29.553 30 29C30 23.514 26.82 18.615 21.947 16.332ZM10 11C10 7.691 12.691 5 16 5C19.309 5 22 7.691 22 11C22 14.309 19.309 17 16 17C12.691 17 10 14.309 10 11Z"
                        fill="#09090B"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1_46">
                        <rect width="32" height="32" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* // <!-- Search Tooltip --> */}
      <div className={`tooltip-a ${search ? "active" : ""}`}>
        <form>
          <input
            type="text"
            placeholder="Search here..."
            value={searchValue}
            onInput={handleSearchValue}
          />
          <button type="submit" className="src_btn">
            <FaSearch className="icon" />
          </button>
        </form>

        {searchValue !== "" ? (
          filteredProducts?.length ? (
            <div className={`search-result`}>
              {filteredProducts?.slice(0, 4)?.map((product) => (
                <Link href={`/products/${product?._id}`} key={product?._id}>
                  <div className="search_product_card">
                    <div className="product">
                      <img
                        alt=""
                        src={`${process.env.NEXT_PUBLIC_API}${product?.productImg}`}
                      />
                    </div>
                    <div className="product_details">
                      <h3 className="product_name">{product?.productName}</h3>
                      <div className="price">
                        <span className="main-price">
                          ৳{product?.discountPrice}
                        </span>
                        <span className="discount text-muted">
                          <del>৳{product?.price}</del>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <>
              <div className={`search-result`} ref={searchRef}>
                <p className="text-center mt-3">No Products found!</p>
              </div>
            </>
          )
        ) : (
          <></>
        )}
      </div>
      {/* <!-- Header --> */}

      {/* <!-- Add to cart Sidebar Start --> */}
      <div
        className="overlay_cart"
        id="overlay_cart"
        onClick={() => toggleCart()}
      ></div>
      <div className="cart_sidebar" id="cartSidebar">
        <div className="card_cartSidebar_wrapper">
          <div className="cart_header">
            <h2>Shopping Cart</h2>
            <span className="close_btn" onClick={() => toggleCart()}>
              ×
            </span>
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
                    <span className="title">{item?.productName}</span>
                    <div className="price_container">
                      <span className="price">
                        ৳{item?.price?.toLocaleString(2)} ×{" "}
                        <span className="quantity">{item?.quantity}</span>
                      </span>
                      <div className="quantity_wrapper">
                        <div className="wrap">
                          <button
                            className="btn-decrease"
                            onClick={() => decreaseQuantity(item?.productID)}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="quantity-input"
                            value={item?.quantity}
                            readOnly
                          />
                          <button
                            className="btn-increase"
                            onClick={() => increaseQuantity(item?.productID)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="action">
                  <button
                    className="dlt_btn"
                    onClick={() => removeFromCart(item?.productID)}
                  >
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 36 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.500977"
                        y="0.5"
                        width="35"
                        height="35"
                        rx="6.07143"
                        stroke="#E31736"
                      />
                      <path
                        d="M28.1478 9.6031H24.1286L22.4698 6.89544C22.0054 6.20729 21.2882 5.78613 20.4685 5.78613H15.5312C14.7115 5.78613 13.9504 6.20729 13.5309 6.89544L11.8711 9.6031H7.8519C7.41891 9.6031 7.07129 9.94328 7.07129 10.3665V11.1299C7.07129 11.5545 7.41891 11.8933 7.8519 11.8933H8.63251V27.1611C8.63251 28.8478 10.0303 30.2147 11.755 30.2147H24.2448C25.9694 30.2147 27.3672 28.8478 27.3672 27.1611V11.8933H28.1478C28.582 11.8933 28.9284 11.5545 28.9284 11.1299V10.3665C28.9284 9.94328 28.582 9.6031 28.1478 9.6031ZM15.458 8.21372C15.5068 8.13023 15.6044 8.07631 15.7068 8.07631H20.2929C20.3966 8.07631 20.4942 8.12999 20.5429 8.21348L21.3955 9.6031H14.6042L15.458 8.21372ZM24.2448 27.9245H11.755C11.3238 27.9245 10.9744 27.5828 10.9744 27.1611V11.8933H25.0254V27.1611C25.0254 27.581 24.6741 27.9245 24.2448 27.9245ZM17.9999 25.6343C18.4313 25.6343 18.7805 25.2929 18.7805 24.871V14.9468C18.7805 14.5249 18.4313 14.1835 17.9999 14.1835C17.5684 14.1835 17.2192 14.527 17.2192 14.9468V24.871C17.2192 25.2908 17.5705 25.6343 17.9999 25.6343ZM14.0968 25.6343C14.5261 25.6343 14.8774 25.2908 14.8774 24.871V14.9468C14.8774 14.5249 14.5283 14.1835 14.0968 14.1835C13.6653 14.1835 13.3162 14.527 13.3162 14.9468V24.871C13.3162 25.2908 13.6675 25.6343 14.0968 25.6343ZM21.9029 25.6343C22.3344 25.6343 22.6835 25.2929 22.6835 24.871V14.9468C22.6835 14.5249 22.3344 14.1835 21.9029 14.1835C21.4714 14.1835 21.1223 14.527 21.1223 14.9468V24.871C21.1223 25.2908 21.4736 25.6343 21.9029 25.6343Z"
                        fill="#E31736"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart_footer">
            <p>
              <span>Sub-Total</span>
              <span id="subtotal">৳{subTotal.toLocaleString(2)}</span>
            </p>
            {/* <p className="grand_total">
              <span>Grand Total</span>
              <span id="grandtotal">৳343.98</span>
            </p> */}
            <div className="cart_buttons">
              <Link href={"/cart"}>
                <button className="view_cart">View Cart</button>
              </Link>
              <Link href={"/checkout"}>
                <button className="checkout">Checkout Now</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Header End --> */}

      {/* <!-- Navbar Start --> */}
      <nav className="menu-row" id="navbar">
        <div className="container">
          <div className="menu-box">
            <div id="mainmenu">
              <ul className="menu" ref={menuUlRef}>
                <button
                  className="close_btn"
                  onClick={() => toggleMobileMenu()}
                >
                  <FaTimes className="icon" />
                </button>
                {categories?.map((category, idx) => (
                  <MenuItem
                    handleSubOpen={handleSubOpen}
                    category={category}
                    key={category?._id}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>
      {/* <!-- Navbar End --> */}
    </>
  );
};

export default Navbar;
