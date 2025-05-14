import AllProducts from "@/Components/Products/AllProducts/AllProducts";
import Breadcrumb from "@/Components/Shared/Breadcrumb/Breadcrumb";
import Features from "@/Components/Shared/Features/Features";
import React from "react";

const Products = () => {
  return (
    <>
      <Breadcrumb pageTitle={"Products"} />
      <Features />
      <AllProducts />
    </>
  );
};

export default Products;
