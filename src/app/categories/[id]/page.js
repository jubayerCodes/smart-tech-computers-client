import AllProducts from "@/Components/Products/AllProducts/AllProducts";
import React from "react";

export const metadata = {
  title: "Category | ABC Computers",
};

const SingleCategory = async ({ params }) => {
  const { id } = await params;

  return (
    <>
      <AllProducts catId={id} />
    </>
  );
};

export default SingleCategory;
