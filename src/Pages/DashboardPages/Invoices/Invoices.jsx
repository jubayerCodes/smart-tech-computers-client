"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import DashboardPagination from "@/Components/Dashboard/DashboardPagination/DashboardPagination";
import { Button, Dropdown, Modal } from "react-bootstrap";
import "./Invoices.css";
import { FaPrint, FaRegEye } from "react-icons/fa6";

const Invoices = () => {
  const [modalShow, setModalShow] = useState(false);

  const tableRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  // Pagination Start
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const skip = limit * (page - 1);
  const [totalItems, setTotalItems] = useState(1);
  const filteredOrders = orders.slice(skip, limit * page);
  // Pagination End

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/v1/order-list`
        );

        setOrders(response.data.data || []);
        setTotalItems(response?.data?.data.length);
      } catch (error) {
        // Improved error handling
        if (error.response) {
          console.error(
            `Error fetching Orders: ${error.response.status} - ${error.response.data}`
          );
        } else if (error.request) {
          console.error("No response received from server:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
      }
    };

    fetchOrders();

    const dropdown = document?.querySelector(".dropdown-menu.show");

    if (dropdown) {
      dropdown?.classList.remove("show");
    }
  }, [limit]);

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
              <h1>INVOICES</h1>
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
                    placeholder="Search Orders..."
                  />
                  {/* <!-- Entries per page --> */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                {/* <!-- Table --> */}
                <div className="table-wrapper">
                  <table
                    ref={tableRef}
                    id="printTable"
                    className="table table-hover"
                  >
                    <thead>
                      <tr>
                        <th>Invoice No.</th>
                        <th>Products</th>
                        <th>Customer Phone</th>
                        <th>Customer Email</th>
                        <th>Payment Method</th>
                        <th>Tran. ID/Acc. No. </th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders?.length > 0 ? (
                        filteredOrders?.map((order, index) => (
                          <tr key={order._id || index}>
                            <td>{order?.orderID}</td>
                            <td>
                              <button
                                onClick={() => {
                                  setProducts(order?.invoiceProducts);
                                  setModalShow(true);
                                  setGrandTotal(order?.grandTotal);
                                }}
                              >
                                View
                              </button>
                            </td>
                            <td style={{ color: "#888888" }}>
                              {order?.billingDetails?.cus_phone}
                            </td>
                            <td>{order?.billingDetails?.cus_email}</td>
                            <td>{order?.pay_method}</td>
                            <td>
                              {order?.tran_id === ""
                                ? order?.acc_number
                                : order?.tran_id}
                            </td>
                            <td className={`status ${order?.payment_status}`}>
                              <Button>{order?.payment_status}</Button>
                            </td>
                            <td>
                              <div className="d-flex gap-2 justify-content-end">
                                {/* <button>
                                                                    <FaPrint />
                                                                </button> */}

                                {/* Delete Brand Button */}
                                <a href={`/dashboard/invoices/${order?._id}`}>
                                  <button>
                                    <FaRegEye />
                                  </button>
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7">No Orders available</td>
                          <td></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* <!-- Pagination and Display Info --> */}
                <DashboardPagination
                  limit={limit}
                  page={page}
                  setLimit={setLimit}
                  setPage={setPage}
                  totalItems={totalItems}
                />
              </div>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2025. All Rights Reserved.</p>
          </div>
          {/* <!-- Table End --> */}
        </div>
      </div>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Products Ordered
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="table_wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product) => (
                  <tr key={product?.productID}>
                    <td className="d-flex">
                      <div className="product_profile">
                        <div className="cart_img">
                          <img
                            src={`${process.env.NEXT_PUBLIC_API}${product?.productDetails?.productImg}`}
                            alt=""
                          />
                        </div>
                        <div>
                          <a
                            href={`/products/${product?.productID}`}
                            className="product_name"
                          >
                            {product?.productDetails?.productName}
                          </a>
                          <div>x{product?.qty}</div>
                        </div>
                      </div>
                    </td>
                    <td className="product_price">
                      <h3>
                        ${product?.productDetails?.price?.toLocaleString(2)}
                      </h3>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <div className="total">
                      <h3>Total</h3>
                    </div>
                  </td>
                  <td className="product_price">
                    <h3>${grandTotal.toLocaleString(2)}</h3>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Invoices;
