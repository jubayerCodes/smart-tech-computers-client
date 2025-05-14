import Products from "@/Pages/WebsitePages/Products/Products";
import React from "react";
import "@/assets/css/product.css";

export const metadata = {
  title: "Products | ABC Computers",
};

const ProductsPage = () => {
  return (
    <>
      <Products />
    </>
  );
};

export default ProductsPage;
