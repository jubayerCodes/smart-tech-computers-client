"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Swal from "sweetalert2";

const HeroSlider = () => {
  const tableRef = useRef(null);
  const fileInputRef = useRef(null);
  const addModalCloseBtn = useRef(null);
  const updateModalCloseBtn = useRef(null);

  const [slides, setSlides] = useState([]);
  const [status, setStatus] = useState("");
  const [slideTitle, setSlideTitle] = useState("");
  const [slideImg, setSlideImg] = useState("");
  const [slideDescription, setSlideDescription] = useState("");
  const [slideImgFile, setSlideImgFile] = useState(null);
  const [selectedSlide, setSelectedSlide] = useState({
    title: "",
    des: "",
    status: "",
    img: null, // Handle file uploads separately
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/v1/hero-slider`
        );
        setSlides(response?.data?.data || []);
      } catch (error) {
        // Improved error handling
        if (error.response) {
          console.error(
            `Error fetching slides: ${error.response.status} - ${error.response.data}`
          );
        } else if (error.request) {
          console.error("No response received from server:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
      }
    };

    fetchSlides();
  }, []);

  const handleSlideTitleChange = (e) => setSlideTitle(e.target.value);
  const handleSlideDescriptionChange = (e) =>
    setSlideDescription(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const requiredWidth = 1920;
      const requiredHeight = 600;

      if (img.width === requiredWidth && img.height === requiredHeight) {
        setSlideImgFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setSlideImg(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setSlideImgFile(null);
        toast.error(
          `Image must be exactly ${requiredWidth}x${requiredHeight} pixels.`
        );
      }

      URL.revokeObjectURL(img.src);
      e.target.value = "";
    };
  };

  const handleAddClick = () => {
    setIsEditing(false); // Set to add mode
    setSelectedSlide(null); // Clear selected brand

    // Reset form fields
    setSlideTitle("");
    setSlideDescription("");
    setSlideImg("");
    setStatus("");
    setSlideImgFile(null);
  };
  const handleEditClick = (slide) => {
    setIsEditing(true); // Set editing mode
    setSelectedSlide(slide); // Store selected slide data in state

    // Set form fields with the slide's existing data
    setSlideTitle(slide?.title);
    setSlideDescription(slide?.des);
    setSlideImg("");
    setStatus(slide?.status);
    setSlideImgFile(null);
  };
  const handleDeleteClick = (slideId) => {
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
        deleteSlide(slideId); // Call delete function if confirmed
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!slideTitle || !status || !slideImgFile) {
      toast.error("Slide title, status and description are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", slideTitle);
    formData.append("des", slideDescription);
    formData.append("status", status);
    if (slideImgFile) {
      formData.append("slideImg", slideImgFile); // Append image if available
    }

    try {
      // Add new category
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/v1/hero-slider`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Slide added successfully!");

      // Update categories state with new data
      const updatedSlides = [response?.data?.data, ...slides];

      setSlides(updatedSlides);
      localStorage.setItem("slides", JSON.stringify(updatedSlides));

      // Reset form and state

      setIsEditing(false);
      setSelectedSlide(null);

      setSlideTitle("");
      setSlideDescription("");
      setStatus("");
      setSlideImg("");
      setSlideImgFile(null);

      // Close the modal programmatically
      addModalCloseBtn.current.click();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to process slide");
    }
  };

  const handleUpdateSlide = async (e) => {
    e.preventDefault();

    // Prepare form data for the update request
    const formData = new FormData();
    formData.append("title", selectedSlide.title);
    formData.append("des", selectedSlide.des);
    formData.append("status", selectedSlide.status);
    // Append slide image if a new one is selected
    if (slideImgFile) {
      formData.append("slideImg", slideImgFile);
    }

    try {
      // Send PUT request to update the brand
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/api/v1/hero-slider/${selectedSlide._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // If the update is successful, update the state with the new slide data
      if (data && data._id) {
        setSlides((prevSlides) => {
          // Replace the updated slide in the state array
          return prevSlides.map((slide) =>
            slide._id === data._id ? { ...slide, ...data } : slide
          );
        });

        // Provide feedback to the user
        toast.success("Hero Slide updated successfully!");

        // Close the modal after the update
        updateModalCloseBtn.current.click();
      } else {
        toast.error("Hero Slide update failed. Please try again.");
      }
    } catch (error) {
      // Handle error if update fails
      console.error("Update failed:", error.response?.data || error.message);
      toast.error(
        "An error occurred while updating the hero slide. Please try again."
      );
    }
  };

  const deleteSlide = async (slideId) => {
    if (!slideId) {
      toast.error("No slide selected!");
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/api/v1/hero-slider/${slideId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response?.data?.status === "success") {
        toast.success("Slide deleted successfully!");

        // Update state by removing the deleted slide
        setSlides((prevSlides) =>
          prevSlides.filter((slide) => slide._id !== slideId)
        );
      } else {
        toast.error(response?.data?.message || "Failed to delete slide.");
      }
    } catch (error) {
      console.error("Error deleting slide:", error);
      toast.error(error?.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <>
      <div className="main-content">
        <div className="page-content">
          {/* <!-- Table --> */}
          <div className="data-table">
            <div className="invoice-btn">
              <h1>HERO SLIDER</h1>
              <div className="table-btn-item">
                <button
                  type="submit"
                  className="view-more-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#addSlide"
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
                  ADD SLIDE
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
                    placeholder="Search Brands..."
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
                        <th>SL NO</th>
                        <th>SLIDE IMAGE</th>
                        <th>TITLE</th>
                        <th className="description">DESCRIPTION</th>
                        <th>STATUS</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slides?.length > 0 ? (
                        slides?.map((slide, index) => (
                          <tr key={slide._id || index}>
                            <td>{index + 1}</td>
                            <td>
                              {slide?.slideImg ? (
                                <img
                                  src={`${process.env.NEXT_PUBLIC_API}${slide?.slideImg}`}
                                  alt={slide?.slideImg || "Slide"}
                                  style={{
                                    aspectRatio: "1920 / 500",
                                    objectFit: "cover",
                                    borderRadius: "5px",
                                    width: "100px",
                                  }}
                                  // onError={(e) => (e.target.src = "/default-brand.png")} // Fallback Image
                                />
                              ) : (
                                "No Image"
                              )}
                            </td>
                            <td>{slide?.title || "Slide Title Not Found!"}</td>
                            <td className="description">
                              {slide?.des
                                ?.split(" ")
                                ?.slice(0, 20)
                                ?.join(" ") || "No Description"}
                              ...
                            </td>
                            <td>
                              <span
                                className={
                                  slide?.status === "active"
                                    ? "active"
                                    : "inactive"
                                }
                              >
                                {slide?.status || "Unknown"}
                              </span>
                            </td>
                            <td>
                              <div id="action_btn">
                                {/* Update slide Button */}
                                <a
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#updateSlide"
                                  onClick={() => handleEditClick(slide)}
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

                                {/* Delete Brand Button */}
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteClick(slide?._id);
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
                          <td colSpan="5">No slides available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2025. All Rights Reserved.</p>
          </div>
          {/* <!-- Table End --> */}

          {/* <!-- ADD Brands Modal Start --> */}
          <section
            className="modal fade"
            id="addSlide"
            tabIndex="-1"
            aria-labelledby="addSlideLabel"
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
                    ref={addModalCloseBtn}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                  <h2 className="heading">ADD NEW SLIDE</h2>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-row">
                        <label htmlFor="">SLIDE TITLE</label>
                        <input
                          type="text"
                          placeholder="Type here.."
                          required
                          value={slideTitle}
                          onChange={handleSlideTitleChange}
                        />
                      </div>

                      <div className="form-row">
                        <label htmlFor="">SLIDE DESCRIPTION</label>
                        <textarea
                          type="text"
                          placeholder="Type here.."
                          required
                          value={slideDescription}
                          onChange={handleSlideDescriptionChange}
                        />
                      </div>

                      <div className="form-row select-input-box">
                        <label htmlFor="select-status">SLIDE STATUS</label>
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
                        <label htmlFor="photo">SLIDE IMAGE</label>
                        <div className="upload-profile">
                          <div className="item">
                            <div className="img-box">
                              {slideImg && (
                                <img src={slideImg} alt="Slide" width="60" />
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
          {/* <!--  ADD Brands Modal End --> */}

          {/* Update Brand */}
          <section
            className="modal fade"
            id="updateSlide"
            tabIndex="-1"
            aria-labelledby="updateSlideLabel"
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
                    ref={updateModalCloseBtn}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                  <h2 className="heading">UPDATE SLIDE</h2>
                </div>
                <form onSubmit={handleUpdateSlide}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-row">
                        <label htmlFor="">SLIDE TITLE</label>
                        <input
                          type="text"
                          placeholder="Type here.."
                          required
                          value={selectedSlide?.title || ""}
                          onChange={(e) => {
                            setSelectedSlide({
                              ...selectedSlide,
                              title: e.target.value,
                            });
                          }}
                        />
                      </div>

                      <div className="form-row">
                        <label htmlFor="">SLIDE DESCRIPTION</label>
                        <textarea
                          type="text"
                          placeholder="Type here.."
                          required
                          value={selectedSlide?.des || ""}
                          onChange={(e) => {
                            setSelectedSlide({
                              ...selectedSlide,
                              des: e.target.value,
                            });
                          }}
                        />
                      </div>

                      <div className="form-row select-input-box">
                        <label htmlFor="select-status">SLIDE STATUS</label>
                        <select
                          id="select-status"
                          className="select-status"
                          required
                          value={selectedSlide?.status || ""}
                          onChange={(e) => {
                            setSelectedSlide({
                              ...selectedSlide,
                              status: e.target.value,
                            });
                          }}
                        >
                          <option value="">Select Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      <div className="form-row">
                        <label htmlFor="photo">SLIDE IMAGE</label>
                        <div className="upload-profile">
                          <div className="item">
                            <div className="img-box">
                              {slideImg === "" ? (
                                <img
                                  src={`${process.env.NEXT_PUBLIC_API}${selectedSlide?.slideImg}`}
                                  alt="Slide"
                                  width="60"
                                />
                              ) : (
                                <img src={slideImg} alt="Slide 2" width="60" />
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
          {/* Update Brand */}
        </div>
      </div>
    </>
  );
};

export default HeroSlider;
