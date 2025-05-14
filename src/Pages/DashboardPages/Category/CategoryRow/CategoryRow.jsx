import React from "react";

const CategoryRow = ({
  category,
  index,
  handleEditClick,
  handleDeleteClick,
}) => {
  return (
    <tr key={category?._id || index}>
      <td>{index + 1}</td>
      <td>
        {category?.categoryImg ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API}${category.categoryImg}`}
            alt={category?.categoryName || "Category"}
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
      <td>{category?.categoryName}</td>
      <td>
        <div className="sub-cg">
          {category?.subCategories?.length > 0 ? (
            category.subCategories.map((subCategory, index) => (
              <span key={index} style={{ marginRight: "8px" }}>
                {subCategory.subCategoryName}
              </span>
            ))
          ) : (
            <span>No subcategories</span>
          )}
        </div>
      </td>
      <td>
        <span className={category?.status === "active" ? "active" : "inactive"}>
          {category?.status || "N/A"}
        </span>
      </td>
      <td>
        <div id="action_btn">
          {/* Update Category Button */}
          <a
            href="#"
            data-bs-toggle="modal"
            data-bs-target="#updateCategory"
            onClick={() => handleEditClick(category)}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="44" height="44" rx="6" fill="#F4FFF2" />
              <path
                d="M20.833 12.6668H15.933C13.9728 12.6668 12.9927 12.6668 12.244 13.0482C11.5855 13.3838 11.05 13.9192 10.7145 14.5778C10.333 15.3265 10.333 16.3066 10.333 18.2668V28.0668C10.333 30.027 10.333 31.007 10.7145 31.7557C11.05 32.4143 11.5855 32.9497 12.244 33.2853C12.9927 33.6668 13.9728 33.6668 15.933 33.6668H25.733C27.6932 33.6668 28.6733 33.6668 29.422 33.2853C30.0805 32.9497 30.616 32.4143 30.9515 31.7557C31.333 31.007 31.333 30.027 31.333 28.0668V23.1668M17.333 26.6668H19.2866C19.8573 26.6668 20.1427 26.6668 20.4112 26.6023C20.6493 26.5451 20.8769 26.4509 21.0857 26.3229C21.3211 26.1786 21.5229 25.9769 21.9265 25.5733L33.083 14.4168C34.0495 13.4503 34.0495 11.8833 33.083 10.9168C32.1165 9.95027 30.5495 9.95027 29.583 10.9168L18.4264 22.0733C18.0229 22.4769 17.8211 22.6786 17.6768 22.9141C17.5489 23.1229 17.4546 23.3505 17.3974 23.5886C17.333 23.8571 17.333 24.1425 17.333 24.7132V26.6668Z"
                stroke="#5AA469"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          {/* Delete Category Button */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleDeleteClick(category?._id); // Ensure the category ID is passed
            }}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="44" height="44" rx="6" fill="#FFD9D7" />
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
};

export default CategoryRow;
