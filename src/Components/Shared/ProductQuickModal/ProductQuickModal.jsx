"use client";
import { QuickViewContext } from "@/Utilities/Contexts/QuickViewContextProvider";
import React, { useContext, useEffect } from "react";

const ProductQuickModal = () => {
  const { product } = useContext(QuickViewContext);

  return (
    <>
      <section
        className="modal fade"
        id="quickViewModal"
        tabIndex="-1"
        aria-labelledby="quickViewModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal_header">
              <h5 className="modal_title" id="quickViewModalLabel">
                {product?.productName}
              </h5>
            </div>
            <div className="modal_body">
              <div className="product">
                <img
                  src={`${process.env.NEXT_PUBLIC_API}${product?.productImg}`}
                  alt={product?.productName}
                  className="img-fluid"
                />
              </div>
              <div className="price">
                <span className="price1">৳{product?.discountPrice}</span>
                <span className="price2 text-muted">৳{product?.price}</span>
              </div>
            </div>
            <div className="modal_footer">
              <button
                type="button"
                className="btn close_btn"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <a href={`/products/${product?._id}`} className="btn details_btn">
                View Details
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductQuickModal;
