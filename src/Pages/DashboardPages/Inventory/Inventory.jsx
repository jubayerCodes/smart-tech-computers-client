"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const Inventory = () => {
  const tableRef = useRef(null);

  const [products, setProducts] = useState([]);
  // const filteredProducts = Array.isArray(products)
  //     ? product.slice(skip, skip + limit)
  //     : [];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/v1/product-list`
        );

        setProducts(response.data.data || []);
        // setTotalItems(response?.data?.data.length);
      } catch (error) {
        if (error.response) {
          console.error(
            `Error fetching brands: ${error.response.status} - ${error.response.data}`
          );
        } else if (error.request) {
          console.error("No response received from server:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // ..............Table searchbar filter Start.......................//
    const searchInput = document.querySelector("#searchInput");
    searchInput?.addEventListener("input", function () {
      const filter = searchInput?.value?.toLowerCase();
      const rows = document?.querySelectorAll("#printTable tbody tr");

      rows?.forEach((row) => {
        const cells = row.querySelectorAll("td");
        let isMatch = false;

        cells.forEach((cell) => {
          if (cell.textContent.toLowerCase().includes(filter)) {
            isMatch = true;
          }
        });

        row.style.display = isMatch ? "" : "none";
      });
    });
    // ..............Table searchbar filter End.......................//
  }, []);

  return (
    <>
      <div className="main-content">
        <div className="page-content">
          {/* <!-- Table --> */}
          <div className="data-table">
            <div className="invoice-btn">
              <h1>INVENTORY</h1>
            </div>

            {/* <!-- Action Buttons --> */}
            <div className="button-wrapper mb-3">
              {/* <!-- Search and Filter --> */}
              <div className="btn-group">
                <div className="input-group">
                  <input
                    type="text"
                    id="searchInput"
                    className="form-control"
                    placeholder="Search Product/ Services..."
                  />
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                {/* <!-- Table --> */}
                <div className="table-wrapper">
                  <table
                    id="printTable"
                    className="table table-hover"
                    ref={tableRef}
                  >
                    <thead>
                      <tr>
                        <th>SL NO</th>
                        <th>IMAGE</th>
                        <th>CODE</th>
                        <th>NAME</th>
                        <th>PRICE</th>
                        <th>DISCOUNT PRICE</th>
                        <th>BRAND</th>
                        <th>CATEGORY</th>
                        <th>SUB-CATEGORY</th>
                        <th>STOCK</th>
                        <th>COLORS</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products?.length > 0 ? (
                        products?.map((product, index) => (
                          <tr key={product._id || index}>
                            <td>{index + 1}</td>
                            <td>
                              {product?.productImg ? (
                                <img
                                  src={`${process.env.NEXT_PUBLIC_API}${product.productImg}`}
                                  alt={product?.productName || "Product"}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    borderRadius: "5px",
                                  }}
                                />
                              ) : (
                                "No Image"
                              )}
                            </td>
                            <td>{product?.productCode}</td>
                            <td>{product?.productName}</td>
                            <td>{product?.price}</td>
                            <td>{product?.discountPrice}</td>
                            <td>{product?.brandID?.brandName}</td>
                            <td>{product?.categoryID?.categoryName}</td>
                            <td>{product?.subCategoryID?.subCategoryName}</td>
                            <td>{product?.stock}</td>
                            <td>{product?.color?.join(", ")}</td>
                            <td>
                              <div id="action_btn">
                                <a
                                  href={`/dashboard/products/update-product/${product._id}`}
                                >
                                  <svg
                                    width="44"
                                    height="44"
                                    viewBox="0 0 44 44"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <rect
                                      width="44"
                                      height="44"
                                      rx="6"
                                      fill="#F4FFF2"
                                    />
                                    <path
                                      d="M20.833 12.6668H15.933C13.9728 12.6668 12.9927 12.6668 12.244 13.0482C11.5855 13.3838 11.05 13.9192 10.7145 14.5778C10.333 15.3265 10.333 16.3066 10.333 18.2668V28.0668C10.333 30.027 10.333 31.007 10.7145 31.7557C11.05 32.4143 11.5855 32.9497 12.244 33.2853C12.9927 33.6668 13.9728 33.6668 15.933 33.6668H25.733C27.6932 33.6668 28.6733 33.6668 29.422 33.2853C30.0805 32.9497 30.616 32.4143 30.9515 31.7557C31.333 31.007 31.333 30.027 31.333 28.0668V23.1668M17.333 26.6668H19.2866C19.8573 26.6668 20.1427 26.6668 20.4112 26.6023C20.6493 26.5451 20.8769 26.4509 21.0857 26.3229C21.3211 26.1786 21.5229 25.9769 21.9265 25.5733L33.083 14.4168C34.0495 13.4503 34.0495 11.8833 33.083 10.9168C32.1165 9.95027 30.5495 9.95027 29.583 10.9168L18.4264 22.0733C18.0229 22.4769 17.8211 22.6786 17.6768 22.9141C17.5489 23.1229 17.4546 23.3505 17.3974 23.5886C17.333 23.8571 17.333 24.1425 17.333 24.7132V26.6668Z"
                                      stroke="#5AA469"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </a>

                                <a
                                  href="#"
                                  onClick={() => {
                                    handleDeleteClick(product?._id);
                                  }}
                                >
                                  <svg
                                    width="44"
                                    height="44"
                                    viewBox="0 0 44 44"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <rect
                                      width="44"
                                      height="44"
                                      rx="6"
                                      fill="#FFD9D7"
                                    />
                                    <path
                                      d="M26.6667 14.9999V14.0666C26.6667 12.7598 26.6667 12.1064 26.4123 11.6073C26.1886 11.1682 25.8317 10.8113 25.3926 10.5876C24.8935 10.3333 24.2401 10.3333 22.9333 10.3333H21.0667C19.7599 10.3333 19.1065 10.3333 18.6074 10.5876C18.1683 10.8113 17.8114 11.1682 17.5877 11.6073C17.3333 12.1064 17.3333 12.7598 17.3333 14.0666V14.9999M19.6667 21.4166V27.2499M24.3333 21.4166V27.2499M11.5 14.9999H32.5M30.1667 14.9999V28.0666C30.1667 30.0268 30.1667 31.0069 29.7852 31.7556C29.4496 32.4141 28.9142 32.9496 28.2556 33.2851C27.5069 33.6666 26.5268 33.6666 24.5667 33.6666H19.4333C17.4731 33.6666 16.4931 33.6666 15.7444 33.2851C15.0858 32.9496 14.5504 32.4141 14.2148 31.7556C13.8333 31.0069 13.8333 30.0268 13.8333 28.0666V14.9999"
                                      stroke="#CA0B00"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="12">No categories available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* <!-- Pagination and Display Info --> */}
                <div className="my-3">
                  <span id="display-info"></span>
                </div>

                <footer className="footer">
                  <div className="entries-page">
                    <label htmlFor="entries" className="mr-2">
                      Products per page:
                    </label>
                    <div className="select-container">
                      <select
                        id="entries"
                        className="form-control"
                        style={{ width: "auto" }}
                      >
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                      <span className="dropdown-icon">&#9662;</span>
                      {/* <!-- Dropdown icon --> */}
                    </div>
                  </div>

                  <div id="pagination" className="pagination">
                    <button id="prevBtn" className="btn">
                      Prev
                    </button>
                    <a href="#" className="page-link page-link--1">
                      1
                    </a>
                    <a href="#" className="page-link page-link--2">
                      2
                    </a>
                    <a href="#" className="page-link page-link--3">
                      3
                    </a>
                    <button id="nextBtn" className="btn">
                      Next
                    </button>
                  </div>
                </footer>
              </div>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2025. All Rights Reserved.</p>
          </div>
          {/* <!-- Table End --> */}

          {/* <!-- Table Action Button Modal Start --> */}
        </div>
      </div>
    </>
  );
};

export default Inventory;
