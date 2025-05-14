"use client";

import React, { useEffect, useRef, useState } from "react";
import SubCategoryRow from "./SubCategoryRow/SubCategoryRow";
import DashboardPagination from "@/Components/Dashboard/DashboardPagination/DashboardPagination";
import { toast } from "react-hot-toast";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import { FaXmark } from "react-icons/fa6";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSort } from "@fortawesome/free-solid-svg-icons";

const SubCategory = () => {
  const tableRef = useRef(null);
  const addSubCategoryCloseBtn = useRef(null);
  const updateSubCategoryCloseBtn = useRef(null);

  const [subCategoryName, setSubCategoryName] = useState("");
  const [status, setStatus] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState({
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
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const filteredSubCategories = subCategories.slice(skip, skip + limit);
  // Pagination End

  // Set Category Infos for Category Selection
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/v1/category`
        );
        setCategories(response.data.data); // Assuming categories are returned in `data.data`
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategory = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/v1/sub-category`
        );

        setSubCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching Sub Categories:", error);
        toast.error("Failed to fetch subcategories");
      }
    };

    fetchSubCategory();
  }, [limit]);

  useEffect(() => {
    console.log(subCategories);
  }, [subCategories]);

  useEffect(() => {
    setTotalPages(Math.ceil(subCategories.length / limit));
  }, [subCategories, limit]);

  // useEffect(() => {
  //   // Check if selectedSubCategory exists and contains a categoryId
  //   if (selectedSubCategory && selectedSubCategory.categoryId) {
  //     // Find the category based on categoryId
  //     const category = categories.find(
  //       (cat) => cat._id === selectedSubCategory?.categoryId?._id
  //     );

  //     if (category) {
  //       console.log("Category is correctly bound with subcategory:", category);
  //       // Update the selected category state
  //       setSelectedCategory(category);
  //     } else {
  //       console.log("No matching category found for the subcategory.");
  //       setSelectedCategory(null); // Reset the selected category if no match is found
  //     }
  //   } else {
  //     // Reset selectedCategory if no categoryId exists
  //     setSelectedCategory(null);
  //   }
  // }, [selectedSubCategory, categories]); // Run when selectedSubCategory or categories change

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

    const sortedData = [...subCategories].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSubCategories(sortedData);
  };
  const handleSubCategoryNameChange = (e) => setSubCategoryName(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);
  const handleAddClick = () => {
    setIsEditing(false); // Set to add mode
    setSelectedSubCategory({ subCategoryName: "", status: "", _id: "" }); // Reset subcategory
    setSelectedCategory(null); // Reset selected category

    // Reset form fields
    setSubCategoryName("");
    setStatus("");
  };
  const handleEditClick = (subCategory) => {
    setIsEditing(true);
    setSelectedSubCategory(subCategory);
    setSubCategoryName(subCategory.subCategoryName);
    setStatus(subCategory.status);

    // Find the category based on the subcategory's categoryId
    const category = categories.find(
      (category) => category._id === subCategory.categoryId?._id
    );

    setSelectedCategory(category || null);
  };
  const handleDeleteClick = (subCategoryId) => {
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
        handleDeleteSubCategory(subCategoryId); // Call delete function if confirmed
      }
    });
  };

  // Handle Sub Category form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure selectedCategory._id is used correctly for the categoryId
    const categoryId = selectedCategory?._id;

    if (!subCategoryName || !status || !categoryId) {
      toast.error("Sub Category name, status, and category are required!");
      return;
    }

    const subCategoryData = {
      subCategoryName,
      subCategoryStatus: status,
      categoryId,
    };

    try {
      let response;
      if (isEditing) {
        // If editing, send a PUT request
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_API}/api/v1/sub-category/${selectedSubCategory._id}`,
          subCategoryData
        );
        toast.success("Sub Category updated successfully!");
      } else {
        // If adding new, send a POST request
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/api/v1/sub-category`,
          subCategoryData
        );
        toast.success("Sub Category added successfully!");
      }

      const updatedSubCategories = isEditing
        ? subCategories.map((subCategory) =>
            subCategory._id === selectedSubCategory._id
              ? response.data.data
              : subCategory
          )
        : [response.data.data, ...subCategories]; // Add new subcategory at the top

      setSubCategories(updatedSubCategories);
      setSubCategoryName("");
      setStatus("");
      setSelectedCategory(null); // Clear selected category
      setIsEditing(false);
      setSelectedSubCategory({ subCategoryName: "", status: "", _id: "" });

      // Close the modal programmatically
      addSubCategoryCloseBtn.current.click();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Failed to process sub category"
      );
    }
  };

  const handleUpdateSubCategory = async (e) => {
    e.preventDefault();

    if (
      !selectedSubCategory.subCategoryName ||
      !selectedSubCategory.status ||
      !selectedCategory
    ) {
      toast.error("Sub Category Name, Status, and Category are required.");
      return;
    }

    try {
      const updatedSubCategoryData = {
        subCategoryName: selectedSubCategory.subCategoryName,
        status: selectedSubCategory.status,
        categoryId: selectedCategory._id, // Add categoryId to update request
      };

      // Send PUT request to update the sub category
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/api/v1/sub-category/${selectedSubCategory._id}`,
        updatedSubCategoryData
      );

      if (data && data._id) {
        // Update the subCategories state by replacing the updated subcategory
        setSubCategories((prevSubCategories) =>
          prevSubCategories.map((subCategory) =>
            subCategory._id === data._id
              ? { ...subCategory, ...data }
              : subCategory
          )
        );

        toast.success("Sub Category updated successfully!");

        // Close the modal after the update
        updateSubCategoryCloseBtn.click();

        // Reset the selected subcategory
        setSelectedSubCategory({ subCategoryName: "", status: "", _id: "" });
        setSelectedCategory(null); // Reset the selected category after update
      } else {
        toast.error("Sub Category update failed. Please try again.");
      }
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      toast.error(
        "An error occurred while updating the sub category. Please try again."
      );
    }
  };

  const handleDeleteSubCategory = async (subCategoryId) => {
    if (!subCategoryId) {
      toast.error("No sub category selected!");
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/api/v1/sub-category/${subCategoryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Sub Category deleted successfully!");

        // Update state by removing the deleted sub category
        setSubCategories((prevSubCategories) =>
          prevSubCategories.filter(
            (subCategory) => subCategory._id !== subCategoryId
          )
        );
      } else {
        toast.error(response.data.message || "Failed to delete sub category.");
      }
    } catch (error) {
      console.error("Error deleting sub category:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  const handleCategoryChange = (selectedOption) => {
    if (selectedOption) {
      // Update selectedCategory state to the selected category object
      const selectedCat = categories.find(
        (category) => category._id === selectedOption.value
      );
      setSelectedCategory(selectedCat); // Update selected category

      // Update selectedSubCategory with categoryId (for form submission)
      setSelectedSubCategory((prevState) => ({
        ...prevState,
        categoryId: selectedOption.value, // Update the categoryId in selectedSubCategory
        category: selectedCat, // Update the entire category object in selectedSubCategory
      }));
    } else {
      // If nothing is selected, reset the selected category and categoryId
      setSelectedCategory(null);
      setSelectedSubCategory((prevState) => ({
        ...prevState,
        categoryId: null, // Reset categoryId when no category is selected
        category: null, // Reset category object
      }));
    }
  };

  return (
    <div className="main-content">
      <div className="page-content">
        {/* <!-- Table --> */}
        <div className="data-table">
          <div className="invoice-btn">
            <h1>PRODUCT SUB CATEGORY</h1>
            <div className="table-btn-item">
              <button
                type="submit"
                className="view-more-btn"
                data-bs-toggle="modal"
                data-bs-target="#addSubCategory"
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
                ADD SUB CATEGORY
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
                  placeholder="Search Sub Category..."
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
                      <th>CATEGORY</th>
                      <th onClick={() => handleSort("subCategoryName")}>
                        SUB CATEGORY NAME
                        {/* <FontAwesomeIcon
                          icon={faSort}
                          style={{ marginLeft: "8px" }}
                        /> */}
                      </th>
                      <th onClick={() => handleSort("status")}>STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubCategories.length > 0 ? (
                      filteredSubCategories.map((subCategory, index) => {
                        const category = categories?.find(
                          (cat) => cat?._id === subCategory?.categoryId?._id
                        );
                        return (
                          <tr key={subCategory?._id || index}>
                            <td>{index + 1}</td>
                            <td>
                              {category?.categoryName ||
                                "Category Name Not Found!"}
                            </td>
                            <td>
                              {subCategory?.subCategoryName ||
                                "Sub Category Name Not Found!"}
                            </td>
                            <td>
                              <span
                                className={
                                  subCategory?.status === "active"
                                    ? "active"
                                    : "inactive"
                                }
                              >
                                {subCategory?.status || "Unknown"}
                              </span>
                            </td>
                            <td>
                              <div id="action_btn">
                                {/* Update Button */}
                                <a
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#updateSubCategory"
                                  onClick={() => handleEditClick(subCategory)}
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

                                {/* Delete Button */}
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteClick(subCategory?._id);
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
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4">No subcategory available</td>
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

        {/* <!-- ADD Sub Category Modal Start --> */}
        <section
          className="modal fade"
          id="addSubCategory"
          tabIndex="-1"
          aria-labelledby="addSubCategoryLabel"
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
                  ref={addSubCategoryCloseBtn}
                >
                  <FaXmark />
                </button>
                <h2 className="heading">ADD NEW SUB CATEGORY</h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-row">
                      <label htmlFor="">SELECT CATEGORY</label>
                      <Select
                        className="select-search"
                        classNamePrefix="select"
                        isClearable={true}
                        isSearchable={true}
                        name="categories"
                        options={
                          categories?.length
                            ? categories.map((category) => ({
                                label: category.categoryName,
                                value: category._id,
                              }))
                            : [{ label: "No categories available", value: "" }]
                        }
                        placeholder="Select Category..."
                        onChange={handleCategoryChange} // Ensure this is correctly handled
                        value={
                          selectedCategory
                            ? {
                                label: selectedCategory?.categoryName,
                                value: selectedCategory?._id,
                              }
                            : null
                        } // Ensure value is null when no category is selected
                      />
                    </div>
                    <div className="form-row">
                      <label htmlFor="">SUB CATEGORY NAME</label>
                      <input
                        type="text"
                        placeholder="Type here.."
                        required
                        value={subCategoryName}
                        onChange={handleSubCategoryNameChange}
                      />
                    </div>

                    <div className="form-row select-input-box">
                      <label htmlFor="select-status">SUB CATEGORY STATUS</label>
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
        {/* <!-- ADD Sub Category Modal End --> */}

        {/* <!-- UPDATE Category Modal Start --> */}
        <section
          className="modal fade"
          id="updateSubCategory"
          tabIndex="-1"
          aria-labelledby="updateSubCategoryLabel"
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
                  ref={updateSubCategoryCloseBtn}
                >
                  <FaXmark />
                </button>
                <h2 className="heading">UPDATE SUB CATEGORY</h2>
              </div>

              <form onSubmit={handleUpdateSubCategory}>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-row">
                      <label htmlFor="">SELECT CATEGORY</label>
                      <Select
                        className="select-search"
                        classNamePrefix="select"
                        isClearable={true}
                        isSearchable={true}
                        name="categories"
                        options={categories.map((category) => ({
                          label: category.categoryName, // This will show the category name in the select box
                          value: category._id, // This is the value for the category, used in form submission
                          ...category, // Spread category properties for easier access
                        }))}
                        placeholder="Select Categories"
                        onChange={(selectedOption) =>
                          handleCategoryChange(selectedOption)
                        } // Correctly handle the change event
                        value={
                          selectedSubCategory?.category
                            ? {
                                label:
                                  selectedSubCategory.category.categoryName, // Display the selected category name
                                value: selectedSubCategory.category._id, // The category ID is set as the value
                              }
                            : null
                        } // Correctly set selected category based on `selectedSubCategory.category`
                        // Only render value if `selectedSubCategory.category` is not null
                      />
                    </div>

                    <div className="form-row">
                      <label htmlFor="">SUB CATEGORY NAME</label>
                      <input
                        type="text"
                        placeholder="Type here.."
                        required
                        value={selectedSubCategory?.subCategoryName || ""}
                        onChange={(e) =>
                          setSelectedSubCategory({
                            ...selectedSubCategory,
                            subCategoryName: e.target.value,
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
                        value={selectedSubCategory?.status || ""}
                        onChange={(e) =>
                          setSelectedSubCategory({
                            ...selectedSubCategory,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
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

export default SubCategory;
