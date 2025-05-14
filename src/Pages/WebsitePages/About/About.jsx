"use client";
import React, { useEffect } from "react";

import aboutImg from "@/assets/img/about/hero-bg-image.webp";
import counterImg from "@/assets/img/about/counter-img.webp";

import aboutImg1 from "@/assets/img/about/about-card-img1.webp";
import aboutImg2 from "@/assets/img/about/about-card-img2.webp";
import aboutImg3 from "@/assets/img/about/about-card-img3.webp";

import teamImg1 from "@/assets/img/about/team-img1.webp";
import teamImg2 from "@/assets/img/about/team-img2.webp";
import teamImg3 from "@/assets/img/about/team-img3.webp";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
const About = () => {
  useEffect(() => {
    // Video Modal JS Start.........................................
    const modalBtn = document.querySelectorAll(".openModalBtn");
    const modals = document.querySelectorAll(".video_modal");
    const closeBtn = document.querySelectorAll(".close");

    // Open the modal and start the video when the button is clicked
    modalBtn.forEach((btn) => {
      btn.onclick = function () {
        const modalId = btn.getAttribute("data-modal");
        const modal = document.getElementById(`myModal${modalId}`);
        const iframe = modal.querySelector("iframe");

        // Add autoplay to the iframe source
        iframe.src = iframe.src.includes("autoplay=1")
          ? iframe.src
          : iframe.src + "?autoplay=1";

        modal.style.display = "block"; // Show the modal
      };
    });

    // Close the modal and stop the video when the close button is clicked
    closeBtn.forEach((btn) => {
      btn.onclick = function () {
        const modalId = btn.getAttribute("data-close");
        const modal = document.getElementById(`myModal${modalId}`);
        modal.style.display = "none"; // Hide the modal

        // Stop the video by resetting the iframe's source
        const iframe = modal.querySelector("iframe");
        iframe.src = iframe.src.split("?")[0];
      };
    });

    // Close the modal if the user clicks outside the modal content
    window.onclick = function (event) {
      modals.forEach((modal) => {
        if (event.target === modal) {
          modal.style.display = "none";

          // Stop the video by resetting the iframe's source
          const iframe = modal.querySelector("iframe");
          iframe.src = iframe.src.split("?")[0];
        }
      });
    };
    // Video Modal JS End.........................................
  }, []);

  return (
    <>
      {/* <!-- Hero Start --> */}
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(90deg, #000 0%, rgba(0, 0, 0, 0) 100%),
          url(${aboutImg.src})`,
        }}
      >
        <div className="container">
          <div className="hero_container d-flex aling-item-center">
            <div className="hero_contant">
              <h2>About US</h2>
              <div className="breadcrumd">
                <a href="./index.html">Home </a>
                <div className="icon">
                  <svg
                    width="39"
                    height="38"
                    viewBox="0 0 39 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g filter="url(#filter0_d_1_1672)">
                      <path
                        d="M18.5565 25.9035C17.9726 26.4888 17.9724 27.4363 18.5561 28.0219L19.4665 28.9351C20.0524 29.5228 21.0042 29.5231 21.5904 28.9357L34.4423 16.0597C35.0268 15.4741 35.0268 14.5259 34.4423 13.9403L21.5904 1.0643C21.0042 0.476929 20.0524 0.477217 19.4665 1.06494L18.5561 1.97809C17.9724 2.56365 17.9726 3.51117 18.5565 4.09652L28.3775 13.9406C28.9616 14.5261 28.9616 15.4739 28.3775 16.0594L18.5565 25.9035Z"
                        fill="white"
                      />
                      <path
                        d="M4.55653 25.9035C3.97256 26.4888 3.97239 27.4363 4.55614 28.0219L5.46647 28.9351C6.05238 29.5228 7.00416 29.5231 7.59042 28.9357L20.4423 16.0597C21.0268 15.4741 21.0268 14.5259 20.4423 13.9403L7.59043 1.0643C7.00416 0.476929 6.05238 0.477217 5.46647 1.06494L4.55614 1.97809C3.97239 2.56365 3.97256 3.51117 4.55653 4.09652L14.3775 13.9406C14.9616 14.5261 14.9616 15.4739 14.3775 16.0594L4.55653 25.9035Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_d_1_1672"
                        x="0.118652"
                        y="0.624023"
                        width="38.7622"
                        height="36.752"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                      >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="2" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_1_1672"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_1_1672"
                          result="shape"
                        />
                      </filter>
                    </defs>
                  </svg>
                </div>
                <span className="breadcrumb_last">About US</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Hero Start --> */}

      {/* <!-- About Start --> */}
      <div id="about">
        <div className="container">
          <div className="about_wrapper">
            <div className="row">
              <div className="col-lg-6">
                <div className="about_details">
                  <p className="our_journey">Our Journey Since at 1999</p>
                  <div className="heading">
                    <div>
                      <h2>Welcome to ABC Computers</h2>
                    </div>
                  </div>
                  <p className="desc">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book.
                  </p>
                  <p className="desc">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book.
                  </p>

                  <h3 className="desc_title">Our Vision</h3>
                  <p className="desc">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book.
                  </p>

                  <h3 className="desc_title">Our Mission</h3>
                  <p className="desc">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book.
                  </p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="about_counter">
                  <div className="counter_image">
                    <img src={counterImg.src} alt="" />
                  </div>

                  <div className="row d-flex counter_container">
                    <div className="col-4 d-flex align-items-stretch">
                      <div className="counter_box">
                        <h2 className="counter" data-target="20">
                          0
                        </h2>
                        <p>Years of Experience</p>
                      </div>
                    </div>
                    <div className="col-4 d-flex align-items-stretch">
                      <div className="counter_box">
                        <h2 className="counter" data-target="5000">
                          0
                        </h2>
                        <p>Customers</p>
                      </div>
                    </div>
                    <div className="col-4 d-flex align-items-stretch">
                      <div className="counter_box">
                        <h2 className="counter" data-target="20">
                          0
                        </h2>
                        <p>Awards</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- About End --> */}

      {/* <!-- About Card Start --> */}
      <div className="about_card">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="card_wrapper">
                <div className="card_img">
                  <img src={aboutImg1.src} alt="" />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card_wrapper">
                <div className="card_img">
                  <img src={aboutImg2.src} alt="" />
                </div>
                <a className="icon openModalBtn" data-modal="1">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r="40"
                      fill="black"
                      fillOpacity="0.8"
                    />
                    <path
                      d="M56 40L32 53.8564L32 26.1436L56 40Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card_wrapper">
                <div className="card_img">
                  <img src={aboutImg3.src} alt="" />
                </div>
                <a className="icon openModalBtn" data-modal="2">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r="40"
                      fill="black"
                      fillOpacity="0.8"
                    />
                    <path
                      d="M56 40L32 53.8564L32 26.1436L56 40Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Video Modal Start --> */}
      {/* <!-- Modal 1 --> */}
      <div id="myModal1" className="modal video_modal">
        <div className="modal-content">
          <span className="close" data-close="1">
            &times;
          </span>
          <iframe
            src="https://www.youtube.com/embed/2dEaJSw81jU?si=kpC8mPGS-4yFA-Hc"
            allow="fullscreen"
          ></iframe>
        </div>
      </div>
      {/* <!-- Modal 2 --> */}
      <div id="myModal2" className="modal video_modal">
        <div className="modal-content">
          <span className="close" data-close="2">
            &times;
          </span>
          <iframe
            src="https://www.youtube.com/embed/2dEaJSw81jU?si=kpC8mPGS-4yFA-Hc"
            allow="fullscreen"
          ></iframe>
        </div>
      </div>

      {/* <!-- About Card End --> */}

      {/* <!-- Team Start --> */}
      <div className="team">
        <div className="container">
          <div className="heading">
            <div>
              <h2>A Team Of Highly Skilled</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <div className="team_card_wrapper">
                <div className="card_img">
                  <img src={teamImg1.src} alt="" />
                  <div className="social">
                    <a href="#">
                      <FaFacebookF className="icon" />
                    </a>
                    <a href="#">
                      <FaXTwitter className="icon" />
                    </a>
                    <a href="#">
                      <FaInstagram className="icon" />
                    </a>
                  </div>
                </div>
                <div className="details">
                  <h2 className="name">Ram Gopal Sarker</h2>
                  <h3 className="profession">Owner</h3>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="team_card_wrapper">
                <div className="card_img">
                  <img src={teamImg2.src} alt="" />
                  <div className="social">
                    <a href="#">
                      <FaFacebookF className="icon" />
                    </a>
                    <a href="#">
                      <FaXTwitter className="icon" />
                    </a>
                    <a href="#">
                      <FaInstagram className="icon" />
                    </a>
                  </div>
                </div>
                <div className="details">
                  <h2 className="name">Jan Ringo</h2>
                  <h3 className="profession">CEO & Founder</h3>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="team_card_wrapper">
                <div className="card_img">
                  <img src={teamImg3.src} alt="" />
                  <div className="social">
                    <a href="#">
                      <FaFacebookF className="icon" />
                    </a>
                    <a href="#">
                      <FaXTwitter className="icon" />
                    </a>
                    <a href="#">
                      <FaInstagram className="icon" />
                    </a>
                  </div>
                </div>
                <div className="details">
                  <h2 className="name">Tristin Chineze</h2>
                  <h3 className="profession">Accountant</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Team End --> */}
    </>
  );
};

export default About;
