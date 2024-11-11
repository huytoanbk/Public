import React, { useState, useEffect, useRef } from "react";
import { getThumbnail } from "../../utiils/format-info-room";

const ImageGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const handleMouseEnter = () => {
    let index = 1;
    intervalRef.current = setInterval(() => {
      setCurrentIndex(index);
      index = (index + 1) % images.length;
    }, 1000);
  };

  const handleMouseLeave = () => {
    clearInterval(intervalRef.current);
    setCurrentIndex(0);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {images.map((image, index) => (
        <img
          key={index}
          src={getThumbnail(image)}
          alt={`Gallery Image ${index + 1}`}
          className={`w-full h-full object-contain absolute top-0 left-0 transition-opacity duration-700 ease-in-out ${
            currentIndex === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
};

export default ImageGallery;
