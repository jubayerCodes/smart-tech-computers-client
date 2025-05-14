"use client";
import Script from "next/script";
import React from "react";

const JavascriptClient = () => {
  return (
    <>
      <Script
        src="https://code.jquery.com/jquery-3.7.1.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="/js/website/vendor/bootstrap.bundle.min.js"
        strategy="afterInteractive"
      />
      <Script src="/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      <Script src={"/js/sidebar.js"} strategy="afterInteractive" />
      <Script src="/js/style.js" strategy="beforeInteractive" />
      <Script
        src="/js/website/vendor/swiper-bundle.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/js/website/popular-product-tab.js"
        strategy="afterInteractive"
      />
      <Script
        src="/js/website/vendor/owl.carousel.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="/js/website/specials-product-slider.js"
        strategy="afterInteractive"
      />
      <Script src="/js/website/app.js" strategy="afterInteractive" />
      <Script
        src="/js/website/product-video-slider.js"
        strategy="afterInteractive"
      />
      <Script
        src="/js/website/recent-shopping-slider.js"
        strategy="afterInteractive"
      />
    </>
  );
};

export default JavascriptClient;
