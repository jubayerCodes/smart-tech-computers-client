"use client";
import React, { useState } from "react";
import "./ImageMagnifier.css";

const ImageMagnifier = ({ imgSrc }) => {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseHover = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    setPosition({ x, y });

    setCursorPosition({
      x: e.pageX - left,
      y: e.pageY - top,
    });
  };

  return (
    <div
      onMouseEnter={() => setZoomOpen(true)}
      onMouseLeave={() => setZoomOpen(false)}
      onMouseMove={(e) => handleMouseHover(e)}
      className="zoom-container"
    >
      <img
        className="main-img"
        src={imgSrc}
        alt=""
        width={"500px"}
        height={"500px"}
      />
      <div
        className={`zoom ${zoomOpen ? "open" : ""}`}
        style={{
          position: "absolute",
          left: `${cursorPosition.x - 100}px`,
          top: `${cursorPosition.y - 100}px`,
          pointerEvents: "none",
        }}
      >
        <div
          className="zoom-img"
          style={{
            backgroundImage: `url(${imgSrc})`,
            backgroundPosition: `${position.x}% ${position.y}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default ImageMagnifier;
