"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./UpdateProduct.css";
import Select from "react-select";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import FroalaEditorComponent from "react-froala-wysiwyg";
import { FaXmark } from "react-icons/fa6";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateProduct = ({ id }) => {
  const BrandModalCloseBtn = useRef(null);
  const CategoryModalCloseBtn = useRef(null);
  const SubCategoryCloseModal = useRef(null);

  const [productImgPreview, setProductImgPreview] = useState("");

  const [productData, setProductData] = useState({});
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
  const [productImgFile, setProductImgFile] = useState(null);
  const [stock, setStock] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [color, setColor] = useState([]);

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

  // ======= Update Product Handles ======= //
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

  // ======= Update Product Handles ======= //

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

      const productDetails = response?.data?.data;
      const product = productDetails?.productID;
      const brand = product?.brandID;
      const category = product?.categoryID;
      const subCategory = product?.subCategoryID;

      setProductData(product);

      setSelectedBrand(brand);
      setSelectedCategory(category);
      setSelectedSubCategory(subCategory);
      setProductCode(product?.productCode);
      setProductName(product?.productName);
      setProductStatus(product?.productStatus);
      setPrice(product?.price);
      setDiscountPrice(product?.discountPrice);
      setKeyFeature(productDetails?.keyFeature);
      setSpecification(productDetails?.specification);
      setDescription(productDetails?.description);
      setStock(product?.stock);
      setColor(product?.color);
      setProductImg(product?.productImg);

      // Set filtered sub categories
      const filteredSubCategories = subCategories?.filter(
        (sub) => sub.categoryId?._id === category?._id
      );

      setFilteredSubCategories(filteredSubCategories);
    };

    fetchProduct();
  }, [id, subCategories]);

  // Fetch brands when the component mounts
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/v1/brands`);
        setBrands(response?.data?.data);
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

  const handleAddBrand = async (e) => {
    e.preventDefault();

    const formData = {};

    if (!brandName || !brandStatus) {
      toast.error("Brand name and status are required!");
      return;
    }
    formData.brandName = brandName;
    formData.status = brandStatus;
    if (brandImg) formData.brandImg = brandImg;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/v1/brands`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response?.data?.status === "success") {
        toast.success("Brand added successfully!");
        setBrands([...brands, response?.data?.data]);
        setSelectedBrand(response?.data?.data);
        BrandModalCloseBtn.current.click();
      }
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred!"
      );
    }

    // Reset after submission
    setBrandName("");
    setBrandImg(null);
    setBrandStatus("");
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();

    const formData = {};

    if (!categoryName || !categoryStatus) {
      toast.error("Category name and status are required!");
      return;
    }
    formData.categoryName = categoryName;
    formData.status = categoryStatus;
    if (categoryImg) formData.categoryImg = categoryImg;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/v1/category`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response?.data?.status === "success") {
        toast.success("Category added successfully!");
        setCategories([...categories, response?.data?.data]);
        setSelectedCategory(response?.data?.data);

        // Set filtered sub categories
        const filteredSubCategories = subCategories?.filter(
          (sub) => sub.categoryId?._id === response?.data?.data?._id
        );

        setFilteredSubCategories(filteredSubCategories);
        setSelectedSubCategory(null);

        CategoryModalCloseBtn.current.click();
      }
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred!"
      );
    }

    // Reset after submission
    setCategoryName("");
    setCategoryImg(null);
    setCategoryStatus("");
  };

  const handleAddSubCategory = async (e) => {
    e.preventDefault();

    let formData = {};

    const categoryId = selectedCategory?._id;

    if (!subCategoryName || !subCategoryStatus || !categoryId) {
      toast.error("Sub Category name, status, and category are required!");
      return;
    }

    formData.subCategoryName = subCategoryName;
    formData.subCategoryStatus = subCategoryStatus;
    formData.categoryId = categoryId;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/v1/sub-category`,
        formData
      );

      if (response?.data?.status === "success") {
        toast.success("Sub Category added successfully!");
        setFilteredSubCategories([
          ...filteredSubCategories,
          response?.data?.data,
        ]);
        setSelectedSubCategory(response?.data?.data);
        SubCategoryCloseModal.current.click();
      }
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred!"
      );
    }

    // Reset after submission
    setSubCategoryName("");
    setSubCategoryStatus("");
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (productImgFiles.length > 0) {
      productImgFiles.forEach((file) => {
        formData.append("productImgs", file); // Correct field name
      });
    }

    formData.append("productCode", productCode);
    formData.append("productName", productName);
    formData.append("price", price);
    formData.append("discountPrice", discountPrice);
    formData.append("stock", stock);
    formData.append("keyFeature", keyFeature);
    formData.append("specification", specification);
    formData.append("description", description);
    formData.append("color", JSON.stringify(color));
    formData.append("brandID", selectedBrand?._id);
    formData.append("categoryID", selectedCategory?._id);
    formData.append("subCategoryID", selectedSubCategory?._id);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/api/v1/update-product/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response?.status === 200) {
        toast.success("Product updated successfully!");
      }
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred!"
      );
    }
  };

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
              <h2 className="heading">Update Product</h2>
            </div>
            <form className="add-product-form" onSubmit={handleUpdateProduct}>
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
                        selectedCategory?._id
                          ? {
                              label: selectedCategory?.categoryName,
                              value: selectedCategory?._id,
                            }
                          : null
                      } // Ensure value is null when no category is selected
                    />
                    <button
                      type="button"
                      className="add-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#addCategory"
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
                    defaultValue={productCode}
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
                    defaultValue={productName}
                    onChange={handleProductNameChange}
                  />
                </div>
                <div className="form-row col-lg-6">
                  <label htmlFor="">Status</label>
                  <select
                    defaultValue={productStatus}
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
                    min={0}
                    defaultValue={price}
                    onChange={handleProductPriceChange}
                  />
                </div>
                <div className="form-row col-lg-6">
                  <label htmlFor="">Discount Price</label>
                  <input
                    type="number"
                    placeholder="Discount Price"
                    min={0}
                    defaultValue={discountPrice}
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
                    model={keyFeature}
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
                    model={specification}
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
                    model={description}
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
                        {productImgPreview ? (
                          <img
                            src={productImgPreview}
                            alt="product"
                            width="60"
                          />
                        ) : productImg ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API}${productImg}`}
                            alt="profile"
                            width="60"
                          />
                        ) : (
                          <></>
                        )}
                      </div>

                      <div className="profile-wrapper">
                        <label className="custom-file-input-wrapper m-0">
                          <input
                            type="file"
                            className="custom-file-input"
                            aria-label="Upload Photo"
                            multiple={true}
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
                    defaultValue={stock}
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
                    defaultValue={colorInput}
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
                  Update Product
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
                ref={BrandModalCloseBtn}
              >
                <FaXmark />
              </button>
              <h2 className="heading">ADD NEW BRAND</h2>
            </div>
            <form onSubmit={handleAddBrand}>
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-row">
                    <label htmlFor="">BRAND NAME</label>
                    <input
                      type="text"
                      placeholder="Type here.."
                      defaultValue={brandName}
                      onChange={handleBrandNameChange}
                    />
                  </div>

                  <div className="form-row select-input-box">
                    <label htmlFor="select-status">BRAND STATUS</label>
                    <select
                      id="select-status"
                      className="select-status"
                      defaultValue={brandStatus}
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
                              onChange={(e) => {
                                const file = e.target.files[0];

                                setBrandImg(file);
                              }}
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
                ref={CategoryModalCloseBtn}
              >
                <FaXmark />
              </button>
              <h2 className="heading">ADD NEW CATEGORY</h2>
            </div>

            <form onSubmit={handleAddCategory}>
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-row">
                    <label htmlFor="">CATEGORY NAME</label>
                    <input
                      type="text"
                      placeholder="Type here.."
                      defaultValue={categoryName || ""} // Ensure default empty string when no value
                      onChange={handleCategoryNameChange}
                    />
                  </div>

                  <div className="form-row select-input-box">
                    <label htmlFor="select-status">STATUS</label>
                    <select
                      id="select-status"
                      className="select-status"
                      defaultValue={categoryStatus}
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
                              onChange={(e) => {
                                const file = e.target.files[0];

                                setCategoryImg(file);
                              }}
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
                ref={SubCategoryCloseModal}
              >
                <FaXmark />
              </button>
              <h2 className="heading">ADD SUB CATEGORY</h2>
            </div>

            <form onSubmit={handleAddSubCategory}>
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
                      onChange={handleCategoryChange} // Ensure this is correctly wired
                      defaultValue={
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
                      defaultValue={subCategoryName || ""} // Ensure default empty string
                      onChange={handleSubCategoryNameChange}
                    />
                  </div>

                  <div className="form-row select-input-box">
                    <label htmlFor="select-status">STATUS</label>
                    <select
                      id="select-status"
                      className="select-status"
                      defaultValue={subCategoryStatus || ""} // Default empty string when no value
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

export default UpdateProduct;
