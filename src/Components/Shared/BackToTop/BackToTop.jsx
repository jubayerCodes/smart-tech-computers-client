"use client"
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { FaArrowUp } from "react-icons/fa6";

const BackToTop = () => {
  const path = usePathname();


  useEffect(() => {

    if (path.startsWith("/dashboard")) {
      return;
    }

    // Function to update the progress bar
    function updateProgressBar() {
      const progressBar = document.querySelector(".progress_bar");
      const progressBarContainer = document.querySelector(".progress_bar_container");
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalHeight) * 100;

      progressBar.style.width = progress + "%";

      if (window.pageYOffset > 100) {
        progressBarContainer.classList.add("visible");
      } else {
        progressBarContainer.classList.remove("visible");
      }
    }

    // Function to update the progress circle
    const updateProgressCircle = () => {
      if (typeof window === "undefined") return;

      const progressElement = document.querySelector(".progress_circle_bar");
      const scrollToTopElement = document.querySelector(".scroll_to_top");
      const progressCircleContainer = document.querySelector(".progress_circle_container");

      if (!progressElement || !scrollToTopElement || !progressCircleContainer) return; // Avoid errors if elements are missing

      const totalHeight = document.body.scrollHeight - window.innerHeight;
      let progress = (window.pageYOffset / totalHeight) * 283;
      progress = Math.min(progress, 283);
      progressElement.style.strokeDashoffset = 283 - progress;

      // Show or hide the progress circle container based on scroll position
      if (window.pageYOffset > 100) {
        progressCircleContainer.classList.add("visible");
        scrollToTopElement.style.display = "flex";
      } else {
        progressCircleContainer.classList.remove("visible");
        scrollToTopElement.style.display = "none";
      }
    };

    // Function to scroll to the top of the page
    const scrollToTop = () => {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    // Select the "Back to Top" button element
    const scrollToTopElement = document.querySelector(".scroll_to_top");
    scrollToTopElement.addEventListener("click", scrollToTop);

    // Update progress initially
    updateProgressBar();
    updateProgressCircle();

    // Attach event listeners
    window.addEventListener("scroll", () => {
      updateProgressBar();
      updateProgressCircle();
    });

    window.addEventListener("resize", () => {
      updateProgressBar();
      updateProgressCircle();
    });

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener("scroll", updateProgressCircle);
      window.removeEventListener("resize", updateProgressBar);
    };
  }, []);

  if (path.startsWith("/dashboard")) {
    return;
  }

  return (
    <>
      {/* <!-- Back to Top Button --> */}
      <div className="progress_bar_container">
        <div className="progress_bar"></div>
      </div>

      {/* <!-- progress circle --> */}
      <div className="progress_circle_container">
        <svg className="progress_circle" viewBox="0 0 100 100">
          <circle
            className="progress_background"
            cx="50"
            cy="50"
            r="45"
          ></circle>
          <circle
            className="progress_circle_bar"
            cx="50"
            cy="50"
            r="45"
          ></circle>
        </svg>
        <div className="scroll_to_top">
          <FaArrowUp className="icon" />
        </div>
      </div>
      {/* <!-- Back to Top Button --> */}
    </>
  );
};

export default BackToTop;
