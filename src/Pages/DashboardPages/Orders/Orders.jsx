"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import DashboardPagination from "@/Components/Dashboard/DashboardPagination/DashboardPagination";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { Button, Dropdown, Modal } from "react-bootstrap";
import "./Orders.css";

const Orders = () => {
  const statuses = [
    "confirmed",
    "pending",
    "cancelled",
    "delivered",
    "processing",
  ];
  const [modalShow, setModalShow] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState(false);

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

        console.log(response.data.data);

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
  }, [limit, updatedStatus]);

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

  const deleteOrder = async (billingDetailID) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/api/v1/order-delete/${billingDetailID}`
      );

      if (response.data.status === "success") {
        const newOrders = orders.filter(
          (order) => order?.billingDetailID !== billingDetailID
        );

        setOrders(newOrders);

        toast.success("Order deleted successfully");
      } else {
        toast.error(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteClick = (billingDetailID) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5AA469",
      cancelButtonColor: "#FF0000",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteOrder(billingDetailID);
      }
    });
  };

  const handleUpdateStatus = async (id, status) => {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API}/api/v1/order-update/${id}`,
      { status: status }
    );

    if (response?.data?.status === "success") {
      setUpdatedStatus(!updatedStatus);
      if (status === "confirmed") {
        toast.success("Order confirmed successfully");
      }
    }
  };

  return (
    <>
      <div className="main-content">
        <div className="page-content">
          {/* <!-- Table --> */}
          <div className="data-table">
            <div className="invoice-btn">
              <h1>Orders</h1>
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
                        <th>Order ID</th>
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
                              <Dropdown>
                                <div className="d-flex gap-1">
                                  <Button>{order?.payment_status}</Button>

                                  <Dropdown.Toggle
                                    split
                                    variant="light"
                                    id="dropdown-split-basic"
                                  />
                                </div>

                                <Dropdown.Menu>
                                  {statuses?.map((status, idx) => (
                                    <Dropdown.ItemText
                                      key={idx}
                                      onClick={() =>
                                        handleUpdateStatus(order?._id, status)
                                      }
                                    >
                                      {status}
                                    </Dropdown.ItemText>
                                  ))}
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                            <td>
                              {/* Delete Brand Button */}
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteClick(order?.billingDetailID);
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

export default Orders;
