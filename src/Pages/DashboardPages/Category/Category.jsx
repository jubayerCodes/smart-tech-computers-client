"use client";

import React, { useEffect, useRef, useState } from "react";
import CategoryRow from "./CategoryRow/CategoryRow";
import DashboardPagination from "@/Components/Dashboard/DashboardPagination/DashboardPagination";
import { toast } from "react-hot-toast";
import axios from "axios";
import Swal from "sweetalert2";
import { FaXmark } from "react-icons/fa6";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSort } from "@fortawesome/free-solid-svg-icons";

const Category = () => {
  const tableRef = useRef(null);
  const fileInputRef = useRef(null);
  const addCategoryCloseBtn = useRef(null);
  const updateCategoryCloseBtn = useRef(null);

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const [categoryName, setCategoryName] = useState("");
  const [categoryImg, setCategoryImg] = useState(null);
  const [status, setStatus] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    subCategoryName: "",
    status: "",
    subCategoryImg: null, // Handle file uploads separately
  });
  const [isEditing, setIsEditing] = useState(false);

  // Pagination Start
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const skip = limit * (page - 1);
  const [totalPages, setTotalPages] = useState(1);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const filteredCategories = Array.isArray(categories)
    ? categories.slice(skip, skip + limit)
    : [];
  // Pagination End

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/v1/category`
        );

        setCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching Categories:", error);
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategory();
  }, [limit]);

  useEffect(() => {
    setTotalPages(Math.ceil(categories.length / limit));
  }, [categories, limit]);

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

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });

    const sortedData = [...categories].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSubCategories(sortedData);
  };
  const handleCategoryNameChange = (e) => setCategoryName(e.target.value);
  const handleFileChange = (e) => setCategoryImg(e.target.files[0]);
  const handleStatusChange = (e) => setStatus(e.target.value);
  const handleAddClick = () => {
    setIsEditing(false); // Set to add mode
    setSelectedCategory(null);

    // Reset form fields
    setCategoryName("");
    setStatus("");
    setCategoryImg(null);
  };
  const handleEditClick = (category) => {
    setIsEditing(true); // Set editing mode
    setSelectedCategory(category);

    // Set form fields with the category's existing data
    setCategoryName(category.categoryName);
    setStatus(category.status);
    setCategoryImg(category.categoryImg || null);
  };
  const handleDeleteClick = (categoryId) => {
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
        handleDeleteCategory(categoryId); // Call delete function if confirmed
      }
    });
  };

  // Handle Category form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName || !status) {
      toast.error("Category name and status are required!");
      return;
    }

    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("status", status);
    if (categoryImg) {
      formData.append("categoryImg", categoryImg); // Append image if available
    }

    try {
      let response;
      if (isEditing && selectedCategory) {
        // Update existing category
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_API}/api/v1/category/${selectedCategory._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Category updated successfully!");
      } else {
        // Add new category
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/api/v1/category`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Category added successfully!");
      }

      // Update categories state with new data
      const updatedCategories = isEditing
        ? categories.map((category) =>
            category._id === selectedCategory._id
              ? response.data.data
              : category
          )
        : [response.data.data, ...categories]; // New category at the top

      setCategories(updatedCategories);
      localStorage.setItem("categories", JSON.stringify(updatedCategories));

      // Reset form and state
      setCategoryName("");
      setStatus("");
      setCategoryImg(null); // Reset image input
      setPage(1);
      setIsEditing(false);
      setSelectedCategory(null);

      // Close the modal programmatically
      addCategoryCloseBtn.current.click();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to process category"
      );
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    // Prepare form data for the update request
    const formData = new FormData();
    formData.append("categoryName", selectedCategory.categoryName);
    formData.append("status", selectedCategory.status);

    // Append category image if a new one is selected, and it differs from the old image
    if (
      selectedCategory.categoryImg &&
      selectedCategory.categoryImg !== selectedCategory.oldCategoryImg
    ) {
      formData.append("categoryImg", selectedCategory.categoryImg);
    }

    try {
      // Send PUT request to update the category
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/api/v1/category/${selectedCategory._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // If the update is successful, update the state with the new category data
      if (data && data._id) {
        setCategories((prevCategories) => {
          // Replace the updated category in the state array
          return prevCategories.map((category) =>
            category._id === data._id ? { ...category, ...data } : category
          );
        });

        // Provide feedback to the user
        toast.success("Category updated successfully!");

        // Close the modal after the update
        updateCategoryCloseBtn.current.click();
      } else {
        toast.error("Category update failed. Please try again.");
      }
    } catch (error) {
      // Handle error if update fails
      console.error("Update failed:", error.response?.data || error.message);
      toast.error(
        "An error occurred while updating the category. Please try again."
      );
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!categoryId) {
      toast.error("No category selected!");
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/api/v1/category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Category deleted successfully!");

        // Update state by removing the deleted category
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category._id !== categoryId)
        );
      } else {
        toast.error(response.data.message || "Failed to delete category.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="main-content">
      <div className="page-content">
        {/* <!-- Table --> */}
        <div className="data-table">
          <div className="invoice-btn">
            <h1>PRODUCT CATEGORY</h1>
            <div className="table-btn-item">
              <button
                type="submit"
                className="view-more-btn"
                data-bs-toggle="modal"
                data-bs-target="#addCategory"
                onClick={handleAddClick}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 10.6667V21.3333M10.6667 16H21.3333M10.4 28H21.6C23.8402 28 24.9603 28 25.816 27.564C26.5686 27.1805 27.1805 26.5686 27.564 25.816C28 24.9603 28 23.8402 28 21.6V10.4C28 8.15979 28 7.03969 27.564 6.18404C27.1805 5.43139 26.5686 4.81947 25.816 4.43597C24.9603 4 23.8402 4 21.6 4H10.4C8.15979 4 7.03969 4 6.18404 4.43597C5.43139 4.81947 4.81947 5.43139 4.43597 6.18404C4 7.03969 4 8.15979 4 10.4V21.6C4 23.8402 4 24.9603 4.43597 25.816C4.81947 26.5686 5.43139 27.1805 6.18404 27.564C7.03969 28 8.15979 28 10.4 28Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                ADD CATEGORY
              </button>
            </div>
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
                  placeholder="Search Category..."
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
                      <th>Serial No:</th>
                      <th>CATEGORY IMAGE</th>
                      <th>CATEGORY</th>
                      <th>SUB-CATEGORY</th>
                      <th>STATUS</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories?.length > 0 ? (
                      filteredCategories?.map((category, index) => (
                        <CategoryRow
                          key={category._id || index}
                          category={category}
                          index={index}
                          handleEditClick={handleEditClick}
                          handleDeleteClick={handleDeleteClick}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">No categories available</td>
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
                pages={pages}
              />
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2025. All Rights Reserved.</p>
        </div>
        {/* <!-- Table End --> */}

        {/* <!-- ADD Category Modal Start --> */}
        <section
          className="modal fade"
          id="addCategory"
          tabIndex="-1"
          aria-labelledby="addCategoryLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="heading-wrap">
                <button
                  type="button"
                  className="close-btn close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  ref={addCategoryCloseBtn}
                >
                  <FaXmark />
                </button>
                <h2 className="heading">ADD NEW CATEGORY</h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-row">
                      <label htmlFor="">CATEGORY NAME</label>
                      <input
                        type="text"
                        placeholder="Type here.."
                        required
                        value={categoryName}
                        onChange={handleCategoryNameChange}
                      />
                    </div>

                    <div className="form-row select-input-box">
                      <label htmlFor="select-status">CATEGORY STATUS</label>
                      <select
                        id="select-status"
                        className="select-status"
                        required
                        value={status}
                        onChange={handleStatusChange}
                      >
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="form-row">
                      <label htmlFor="photo">CATEGORY PHOTO</label>
                      <div className="upload-profile">
                        <div className="item">
                          <div className="img-box">
                            {selectedCategory?.categoryImg && (
                              <img
                                src={`${process.env.NEXT_PUBLIC_API}${selectedCategory.categoryImg}`}
                                alt="Category"
                                width="100"
                              />
                            )}
                          </div>

                          <div className="profile-wrapper">
                            <label className="custom-file-input-wrapper m-0">
                              <input
                                type="file"
                                className="custom-file-input"
                                aria-label="Upload Photo"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                              />
                            </label>
                            <p>PNG, JPEG or GIF (Upto 1 MB)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="actions">
                    <button type="submit" className="btn-save">
                      SUBMIT
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
        {/* <!-- ADD Category Modal End --> */}

        {/* <!-- UPDATE Category Modal Start --> */}
        <section
          className="modal fade"
          id="updateCategory"
          tabIndex="-1"
          aria-labelledby="updateCategoryLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="heading-wrap">
                <button
                  type="button"
                  className="close-btn close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  ref={updateCategoryCloseBtn}
                >
                  <FaXmark />
                </button>
                <h2 className="heading">UPDATE CATEGORY</h2>
              </div>

              <form onSubmit={handleUpdateCategory}>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-row">
                      <label htmlFor="">CATEGORY NAME</label>
                      <input
                        type="text"
                        placeholder="Type here.."
                        required
                        value={selectedCategory?.categoryName || ""} // Use optional chaining and fallback value
                        onChange={(e) =>
                          setSelectedCategory({
                            ...selectedCategory,
                            categoryName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-row select-input-box">
                      <label htmlFor="select-status">STATUS</label>
                      <select
                        id="select-status"
                        className="select-status"
                        required
                        value={selectedCategory?.status || ""}
                        onChange={(e) =>
                          setSelectedCategory({
                            ...selectedCategory,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="form-row">
                      <label htmlFor="photo">CATEGORY PHOTO</label>
                      <div className="upload-profile">
                        <div className="item">
                          <div className="img-box">
                            {selectedCategory?.categoryImg && (
                              <img
                                src={`${process.env.NEXT_PUBLIC_API}/${selectedCategory.categoryImg}`}
                                alt="Category"
                                width="100"
                              />
                            )}
                          </div>

                          <div className="profile-wrapper">
                            <label className="custom-file-input-wrapper m-0">
                              <input
                                type="file"
                                className="custom-file-input"
                                aria-label="Upload Photo"
                                onChange={(e) =>
                                  setSelectedCategory({
                                    ...selectedCategory,
                                    categoryImg: e.target.files[0],
                                  })
                                }
                              />
                            </label>
                            <p>PNG,JPEG or GIF (Upto 1 MB)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="actions">
                    <button type="submit" className="btn-save">
                      SUBMIT
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
        {/* <!-- UPDATE Category Modal Start --> */}
      </div>
    </div>
  );
};

export default Category;
