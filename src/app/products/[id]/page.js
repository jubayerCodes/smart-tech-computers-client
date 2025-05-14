import SingleProduct from "@/Pages/WebsitePages/SingleProduct/SingleProduct";
import React from "react";

export const metadata = {
  title: "Products | ABC Computers",
};

const ProductSinglePage = async ({ params }) => {
  const { id } = await params;
  

  return (
    <>
      <SingleProduct id={id} />
    </>
  );
};

export default ProductSinglePage;
