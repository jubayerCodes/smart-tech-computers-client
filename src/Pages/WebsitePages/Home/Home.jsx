import Brands from "@/Components/Home/Brands/Brands";
import Discount from "@/Components/Home/Discount/Discount";
import FeaturedCategories from "@/Components/Home/FeaturedCategories/FeaturedCategories";
import Hero from "@/Components/Home/Hero/Hero";
import PopularProducts from "@/Components/Home/PopularProducts/PopularProducts";
import Specials from "@/Components/Home/Specials/Specials";
import Features from "@/Components/Shared/Features/Features";
import ProductQuickModal from "@/Components/Shared/ProductQuickModal/ProductQuickModal";
import React from "react";

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <PopularProducts />
      <FeaturedCategories />
      <Discount />
      <Specials />
      <ProductQuickModal />
      <Brands />
    </>
  );
};

export default Home;
