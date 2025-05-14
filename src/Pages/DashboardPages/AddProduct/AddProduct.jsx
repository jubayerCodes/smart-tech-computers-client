"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import "./AddProduct.css";
import Select from "react-select";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import FroalaEditorComponent from "react-froala-wysiwyg";

import { FaXmark } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const AddProduct = () => {
  const fileInputRef = useRef(null);

  const router = useRouter();

  const brandFileInputRef = useRef(null);
  const categoryFileInputRef = useRef(null);

  // Set Brand Infos for Brand Selection
  const [brandName, setBrandName] = useState("");
  const [brandStatus, setBrandStatus] = useState("");
  const [brandImg, setBrandImg] = useState(null);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState({});

  // Set Category Infos for Category Selection
  const [categoryName, setCategoryName] = useState("");
  const [categoryStatus, setCategoryStatus] = useState("");
  const [categoryImg, setCategoryImg] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Set Sub Category Infos for Sub Category Selection
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryStatus, setSubCategoryStatus] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState({
    subCategoryName: "",
    status: "",
    subCategoryImg: null,
  });
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  // Set Product Infos in Add Product Form
  const [product, setProduct] = useState([]);
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [productStatus, setProductStatus] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [keyFeature, setKeyFeature] = useState("");
  const [specification, setSpecification] = useState("");
  const [description, setDescription] = useState("");
  const [productImg, setProductImg] = useState("");
  const [productImgFiles, setProductImgFiles] = useState([]);
  const [stock, setStock] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [color, setColor] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({
    productName: "",
    productStatus: "",
    productImg: null,
  });

  // ======= Add Product Handles ======= //
  const handleProductCodeChange = (e) => setProductCode(e.target.value);
  const handleProductNameChange = (e) => setProductName(e.target.value);
  const handleProductStatusChange = (e) => setProductStatus(e.target.value);
  const handleProductPriceChange = (e) => setPrice(e.target.value);
  const handleProductDiscountChange = (e) => setDiscountPrice(e.target.value);
  const handleProductKeyFeatureChange = (e) => setKeyFeature(e.target.value);
  const handleProductSpecificationChange = (e) =>
    setSpecification(e.target.value);
  const handleProductDescriptionChange = (e) => setDescription(e.target.value);
  const handleProductStockChange = (e) => setStock(e.target.value);
  // ======= Add Product Handles ======= //

  // Fetch brands when the component mounts
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/v1/brands`);
        setBrands(response.data.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
        toast.error("Failed to load brands.");
      }
    };
    fetchBrands();
  }, []);

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

  // Fetch sub categories when the component mounts
  useEffect(() => {
    const fetchSubCategory = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/v1/sub-category`
        );
        setSubCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching sub categories:", error);
        toast.error("Failed to load sub categories.");
      }
    };
    fetchSubCategory();
  }, []);

  // ======== Handle Submit for Brand, Category & Sub Category ======== //
  const handleSubmit = async (e, type) => {
    e.preventDefault();

    let formData = {};
    let requestData = {};
    let url = "";
    let isFormData = true;
    let successMessage = "";
    let updateState = null;

    // Switch statement to handle different types
    switch (type) {
      case "brand":
        if (!brandName || !brandStatus) {
          toast.error("Brand name and status are required!");
          return;
        }
        formData.brandName = brandName;
        formData.status = brandStatus;
        if (brandImg) formData.brandImg = brandImg;

        url = `${process.env.NEXT_PUBLIC_API}/api/v1/brands`;
        successMessage = "Brand added successfully!";
        updateState = setBrands;

        // Reset after submission
        setBrandName("");
        setBrandImg(null);
        setBrandStatus("");
        break;

      case "category":
        if (!categoryName || !categoryStatus) {
          toast.error("Category name and status are required!");
          return;
        }
        formData.categoryName = categoryName;
        formData.status = categoryStatus;
        if (categoryImg) formData.categoryImg = categoryImg;

        url = `${process.env.NEXT_PUBLIC_API}/api/v1/category`;
        successMessage = "Category added successfully!";
        updateState = setCategories;

        // Reset after submission
        setCategoryName("");
        setCategoryImg(null);
        setCategoryStatus("");
        break;

      case "subCategory":
        const categoryId = selectedCategory?._id;
        if (!subCategoryName || !subCategoryStatus || !categoryId) {
          toast.error("Sub Category name, status, and category are required!");
          return;
        }

        requestData = { subCategoryName, subCategoryStatus, categoryId };
        isFormData = false; // Use JSON for sub-category

        url = `${process.env.NEXT_PUBLIC_API}/api/v1/sub-category`;
        successMessage = "Sub Category added successfully!";
        updateState = setSubCategories;

        // Reset after submission
        setSubCategoryName("");
        setSubCategoryStatus("");
        setSelectedCategory(null);
        break;

      case "product":
        const categoryID = selectedCategory?._id;
        const subCategoryID = selectedSubCategory?._id;
        const brandID = selectedBrand?._id;
        formData = new FormData();

        // Validate required fields
        if (
          !productName ||
          !productStatus ||
          !price ||
          !categoryID ||
          !subCategoryID ||
          !brandID
        ) {
          toast.error(
            "Product name, status, price, brand, category, and subcategory are required!"
          );
          return;
        }

        if (productImgFiles.length > 0) {
          productImgFiles.forEach((file) => {
            formData.append("productImgs", file); // Correct field name
          });
        }

        // Append all required fields to FormData
        formData.append("productName", productName);
        formData.append("productStatus", productStatus);
        formData.append("price", price);
        formData.append("brandID", brandID);
        formData.append("categoryID", categoryID);
        formData.append("subCategoryID", subCategoryID);

        // Append optional fields if they exist
        if (productCode) formData.append("productCode", productCode);
        if (discountPrice) formData.append("discountPrice", discountPrice);
        if (keyFeature) formData.append("keyFeature", keyFeature);
        if (specification) formData.append("specification", specification);
        if (description) formData.append("description", description);
        if (stock) formData.append("stock", stock);
        if (color.length > 0) formData.append("color", JSON.stringify(color));

        url = `${process.env.NEXT_PUBLIC_API}/api/v1/add-product`;
        successMessage = "Product added successfully!";
        updateState = setProduct;
        break;

      default:
        toast.error("Invalid form type!");
        return;
    }

    // Close modal or form (adjust according to your UI)
    document
      .querySelector(
        `#add${type.charAt(0).toUpperCase() + type.slice(1)} .close`
      )
      ?.click();

    try {
      const response = isFormData
        ? await axios.post(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await axios.post(url, requestData);

      toast.success(successMessage);

      if (updateState) {
        updateState((prevData) => [...prevData, response.data.data]);
      }

      if (type === "product") {
        router.push("/dashboard/products");
      }
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred!"
      );
    }
  };

  // ======== Handle Image Upload for Brand & Category ======== //
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];

    // Check if a file is selected
    if (!file) return;

    // Check file type and size (optional validation)
    if (file.size > 1024 * 1024) {
      // Limit file size to 1MB
      alert("File size must be less than 1 MB");
      return;
    }

    // Handle the file based on the modal type
    if (type === "brand") {
      setBrandImg(file); // Set the brand image state
    } else if (type === "category") {
      setCategoryImg(file); // Set the category image state
    }
  };

  const handleUpload = async (e) => {
    const files = e.target.files;

    const newFiles = [];

    for (const i in files) {
      if (Object.prototype.hasOwnProperty.call(files, i)) {
        const file = files[i];

        newFiles.push(file);
      }
    }

    setProductImgFiles([...newFiles]);
  };

  const handleBrandChange = (selectedOption) => {
    if (selectedOption) {
      const brand = brands.find((b) => b._id === selectedOption.value);
      setSelectedBrand(brand); // Ensure the selected brand is updated
    } else {
      setSelectedBrand(null); // Reset when nothing is selected
    }
  };

  const handleCategoryChange = (selectedOption) => {
    if (selectedOption) {
      // Find the selected category by ID
      const selectedCat = categories.find(
        (cat) => cat._id === selectedOption.value
      );

      // Filter subcategories based on selected category's ID
      const filteredSubCategories = subCategories.filter(
        (sub) =>
          sub.categoryId === selectedOption.value ||
          sub.categoryId?._id === selectedOption.value
      );

      // Update the selected category and filtered subcategories
      setSelectedCategory(selectedCat);
      setFilteredSubCategories(filteredSubCategories);
      setSelectedSubCategory(null); // Reset subcategory selection when category changes
    } else {
      // Reset states when no category is selected
      setSelectedCategory(null);
      setFilteredSubCategories([]); // Clear subcategories dropdown
      setSelectedSubCategory(null); // Reset subcategory selection
    }
  };

  const handleSubCategoryChange = (selectedOption) => {
    if (selectedOption) {
      // Find the subcategory from filtered list by ID
      const subCat = filteredSubCategories.find(
        (sub) => sub._id === selectedOption.value
      );

      // Update the selected subcategory
      setSelectedSubCategory(subCat);
    } else {
      // Reset subcategory selection when nothing is selected
      setSelectedSubCategory(null);
    }
  };

  // ======= Add Brand Handles ======= //
  const handleAddClick = () => {
    setSelectedBrand(null);
    setSelectedProduct(null);

    // Reset form fields
    setBrandName("");
    setBrandStatus("");
    setBrandImg(null);

    setProductName("");
    setProductStatus("");
    setPrice("");
    setDiscountPrice("");
    setKeyFeature("");
    setSpecification("");
    setDescription("");
    setProductImg("");
    setProductImgFiles([]);
    setStock("");
    setColor([]);
  };
  const handleBrandNameChange = (e) => setBrandName(e.target.value);
  const handleBrandStatusChange = (e) => setBrandStatus(e.target.value);
  // ======= Add Brand Handles ======= //

  // ======= Add Category Handles ======= //
  const handleCategoryNameChange = (e) => setCategoryName(e.target.value);
  const handleCategoryStatusChange = (e) => setCategoryStatus(e.target.value);
  // ======= Add Category Handles ======= //

  // ======= Add Sub Category Handles ======= //
  const handleSubCategoryNameChange = (e) => setSubCategoryName(e.target.value);
  const handleSubCategoryStatusChange = (e) =>
    setSubCategoryStatus(e.target.value);
  // ======= Add Sub Category Handles ======= //

  const handleColorInput = (e) => {
    setColorInput(e.target.value);
  };

  const addColor = (color) => {
    setColor((prev) => [...prev, color]);
    setColorInput("");
  };

  const deleteColor = (removedColor) => {
    const newColor = color.filter((c) => c !== removedColor);
    setColor(newColor);
  };

  return (
    <>
      <div className="main-content">
        <div className="page-content">
          <div className="col-10 m-auto">
            <div className="heading-wrap">
              <h2 className="heading">Add New Product</h2>
            </div>
            <form
              className="add-product-form"
              onSubmit={(e) => handleSubmit(e, "product")}
            >
              <div className="row">
                <div className="form-row select-input-box col-lg-6">
                  <label htmlFor="select-to">Brand *</label>
                  <div className="input-field">
                    <Select
                      className="select-search"
                      classNamePrefix="select"
                      isClearable={true}
                      isSearchable={true}
                      name="brands"
                      options={brands.map((brand) => ({
                        label: brand.brandName,
                        value: brand._id,
                        ...brand, // Keep the full brand object so we can use it later
                      }))}
                      placeholder="Select Brands..."
                      onChange={handleBrandChange}
                      value={
                        selectedBrand?._id
                          ? {
                              label: selectedBrand.brandName,
                              value: selectedBrand._id,
                            }
                          : null
                      } // Bind the value to the selected brand
                    />
                    <button
                      type="button"
                      className="add-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#addBrand"
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
                        ></path>
                      </svg>
                      ADD
                    </button>
                  </div>
                </div>
                <div className="form-row select-input-box col-lg-6">
                  <label htmlFor="select-to">Category *</label>
                  <div className="input-field">
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
                              label: selectedCategory.categoryName,
                              value: selectedCategory._id,
                            }
                          : null
                      } // Ensure value is null when no category is selected
                    />
                    <button
                      type="button"
                      className="add-btn"
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
                        ></path>
                      </svg>
                      ADD
                    </button>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="form-row select-input-box col-lg-6">
                  <label htmlFor="select-to">Sub Category *</label>
                  <div className="input-field">
                    <Select
                      className="select-search"
                      classNamePrefix="select"
                      isClearable={true}
                      isSearchable={true}
                      name="subCategories"
                      options={
                        selectedCategory
                          ? filteredSubCategories.map((subCat) => ({
                              label: subCat.subCategoryName,
                              value: subCat._id,
                            }))
                          : []
                      } // Ensure options are only populated when category is selected
                      placeholder="Select Sub Category..."
                      value={
                        selectedSubCategory?._id
                          ? {
                              label: selectedSubCategory.subCategoryName,
                              value: selectedSubCategory._id,
                            }
                          : null
                      } // Ensure value is null when no subcategory is selected
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          const subCat = filteredSubCategories.find(
                            (sub) => sub._id === selectedOption.value
                          );
                          setSelectedSubCategory(subCat); // Set selected subcategory
                        } else {
                          setSelectedSubCategory(null); // Reset when nothing is selected
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="add-btn"
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
                        ></path>
                      </svg>
                      ADD
                    </button>
                  </div>
                </div>

                <div className="form-row col-lg-6">
                  <label htmlFor="product-code">Product Code *</label>
                  <input
                    type="text"
                    placeholder="Product Code"
                    required
                    value={productCode}
                    onChange={handleProductCodeChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-row col-lg-6">
                  <label htmlFor="">Product Name *</label>
                  <input
                    type="text"
                    placeholder="Product Name"
                    required
                    value={productName}
                    onChange={handleProductNameChange}
                  />
                </div>
                <div className="form-row col-lg-6">
                  <label htmlFor="">Status</label>
                  <select
                    value={productStatus}
                    onChange={handleProductStatusChange}
                  >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="form-row col-lg-6">
                  <label htmlFor="">Product Price *</label>
                  <input
                    type="number"
                    placeholder="Product Price"
                    required
                    min={0}
                    value={price}
                    onChange={handleProductPriceChange}
                  />
                </div>
                <div className="form-row col-lg-6">
                  <label htmlFor="">Discount Price</label>
                  <input
                    type="number"
                    placeholder="Discount Price"
                    min={0}
                    value={discountPrice}
                    onChange={handleProductDiscountChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-row">
                  <label htmlFor="">Key Features*</label>
                  <FroalaEditorComponent
                    tag="textarea"
                    onModelChange={(content) => setKeyFeature(content)}
                    value={keyFeature}
                    onChange={handleProductKeyFeatureChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-row">
                  <label htmlFor="">Specifications*</label>
                  <FroalaEditorComponent
                    tag="textarea"
                    onModelChange={(content) => setSpecification(content)}
                    value={specification}
                    onChange={handleProductSpecificationChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-row">
                  <label htmlFor="">Description*</label>
                  <FroalaEditorComponent
                    tag="textarea"
                    onModelChange={(content) => setDescription(content)}
                    value={description}
                    onChange={handleProductDescriptionChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-row col-lg-6">
                  <label htmlFor="photo">Product Photo</label>
                  <div className="upload-profile">
                    <div className="item">
                      <div className="img-box">
                        {productImg && (
                          <img src={productImg} alt="Slide" width="60" />
                        )}
                      </div>

                      <div className="profile-wrapper">
                        <label className="custom-file-input-wrapper m-0">
                          <input
                            type="file"
                            className="custom-file-input"
                            aria-label="Upload Photo"
                            multiple={true}
                            ref={fileInputRef}
                            onChange={handleUpload}
                          />
                        </label>
                        <p>PNG,JPEG or GIF (Upto 1 MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-row col-lg-6">
                  <label htmlFor="">Stock*</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    min={0}
                    value={stock}
                    onChange={handleProductStockChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-row col-lg-6">
                  <label htmlFor="">Colors*</label>
                  <input
                    type="text"
                    placeholder="Add new color"
                    value={colorInput}
                    onChange={handleColorInput}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addColor(colorInput);
                      }
                    }}
                  />

                  <div className="colors">
                    {color?.map((c, idx) => (
                      <span onClick={() => deleteColor(c)} key={idx}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="row">
                <button type="submit" className="submit-btn">
                  ADD Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modals */}

      {/* Brand Modal Start */}
      <section
        className="modal fade"
        id="addBrand"
        tabIndex="-1"
        aria-labelledby="addBrandLabel"
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
              >
                <FaXmark />
              </button>
              <h2 className="heading">ADD NEW BRAND</h2>
            </div>
            <form onSubmit={(e) => handleSubmit(e, "brand")}>
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-row">
                    <label htmlFor="">BRAND NAME</label>
                    <input
                      type="text"
                      placeholder="Type here.."
                      required
                      value={brandName}
                      onChange={handleBrandNameChange}
                    />
                  </div>

                  <div className="form-row select-input-box">
                    <label htmlFor="select-status">BRAND STATUS</label>
                    <select
                      id="select-status"
                      className="select-status"
                      required
                      value={brandStatus}
                      onChange={handleBrandStatusChange}
                    >
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label htmlFor="photo">BRAND PHOTO</label>
                    <div className="upload-profile">
                      <div className="item">
                        <div className="img-box">
                          {selectedBrand?.brandImg && (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API}/${selectedBrand.brandImg}`}
                              alt="Brand"
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
                              ref={brandFileInputRef} // Separate file input ref for brand modal
                              onChange={(e) => handleFileChange(e, "brand")}
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
      {/* Brand Modal End */}

      {/* Category Modal Start */}
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
              >
                <FaXmark />
              </button>
              <h2 className="heading">ADD NEW CATEGORY</h2>
            </div>

            <form onSubmit={(e) => handleSubmit(e, "category")}>
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-row">
                    <label htmlFor="">CATEGORY NAME</label>
                    <input
                      type="text"
                      placeholder="Type here.."
                      required
                      value={categoryName || ""} // Ensure default empty string when no value
                      onChange={handleCategoryNameChange}
                    />
                  </div>

                  <div className="form-row select-input-box">
                    <label htmlFor="select-status">STATUS</label>
                    <select
                      id="select-status"
                      className="select-status"
                      required
                      value={categoryStatus}
                      onChange={handleCategoryStatusChange}
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
                              ref={categoryFileInputRef}
                              onChange={(e) => handleFileChange(e, "category")}
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
      {/* Category Modal End */}

      {/* Sub Category Modal Start */}
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
              >
                <FaXmark />
              </button>
              <h2 className="heading">ADD SUB CATEGORY</h2>
            </div>

            <form onSubmit={(e) => handleSubmit(e, "subCategory")}>
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
                      options={categories?.map((category) => ({
                        label: category.categoryName,
                        value: category._id,
                        ...category,
                      }))}
                      placeholder="Select Categories"
                      onChange={handleSubCategoryChange} // Ensure this is correctly wired
                      value={
                        selectedCategory
                          ? {
                              label: selectedCategory.categoryName,
                              value: selectedCategory._id,
                            }
                          : null
                      } // Correct binding
                    />
                  </div>
                  <div className="form-row">
                    <label htmlFor="">SUB CATEGORY NAME</label>
                    <input
                      type="text"
                      placeholder="Type here.."
                      required
                      value={subCategoryName || ""} // Ensure default empty string
                      onChange={handleSubCategoryNameChange}
                    />
                  </div>

                  <div className="form-row select-input-box">
                    <label htmlFor="select-status">STATUS</label>
                    <select
                      id="select-status"
                      className="select-status"
                      required
                      value={subCategoryStatus || ""} // Default empty string when no value
                      onChange={handleSubCategoryStatusChange}
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
      {/* Sub Category Modal End */}

      {/* Modals */}
    </>
  );
};

export default AddProduct;
