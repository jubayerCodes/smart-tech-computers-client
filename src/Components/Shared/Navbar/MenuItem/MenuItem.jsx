
import React, { useEffect, useRef, useState } from "react";

const MenuItem = ({ category, handleSubOpen }) => {
  const submenuRef = useRef(null);

  useEffect(() => {
    // Back to menu in mobile
    document.addEventListener("click", function (event) {
      if (event.target.closest(".back-trigger")) {
        const activeLi =
          submenuRef.current.classList.contains("sub-open") &&
          submenuRef.current;

        if (activeLi) {
          activeLi.classList.remove("sub-open");
        }

        event.preventDefault();
      }
    });
  }, []);
  return (
    <>
      <li className={`megamenu`} ref={submenuRef}>
        <span>
          <a href={`/categories/${category?._id}`}>
            {category?.categoryName}
          </a>
          <span
            className={`${category?.subCategories?.length ? "navtrigger" : ""}`}
            onClick={() => {
              handleSubOpen(submenuRef.current);
            }}
          ></span>
        </span>
        <ul className="submenu" ref={submenuRef}>
          {category?.subCategories?.map((sub, idx) => (
            <li key={idx}>
              <a href={`/sub-categories/${sub?._id}`}>{sub?.subCategoryName}</a>
            </li>
          ))}
        </ul>
      </li>
    </>
  );
};

export default MenuItem;
