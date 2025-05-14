"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";

const Brands = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/v1/brands`);

      if (response?.data?.status === "success") {
        setBrands(response?.data?.data);
      }
    };

    fetchBrands();
  }, []);

  if (brands.length === 0) return null;

  return (
    <div className="brand">
      <div className="container">
        <div className="heading">
          <div>
            <h2>Brand</h2>
          </div>
        </div>

        <div className="carousel-container">
          <div className="brand-carousel">
            <Swiper
              slidesPerView={5}
              breakpoints={{
                0: { slidesPerView: 2 },
                600: { slidesPerView: 3 },
                1000: { slidesPerView: 5 },
              }}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              modules={[Autoplay]}
            >
              {brands?.slice(0, 12)?.map((brand, idx) => (
                <SwiperSlide key={idx}>
                  <div className="item">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API}${brand.brandImg}`}
                      alt=""
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brands;
