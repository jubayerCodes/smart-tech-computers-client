import UpdateProduct from "@/Pages/DashboardPages/UpdateProduct/UpdateProduct";
import React from "react";

export const metadata = {
  title: "Update Product | ABC Computers",
};

const UpdateProductPage = async ({ params }) => {
  const { id } = await params;
  return (
    <>
      <UpdateProduct id={id} />
    </>
  );
};

export default UpdateProductPage;
