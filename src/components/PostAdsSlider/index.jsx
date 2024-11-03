import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import baseAxios from "../../interceptor/baseAxios";
import { Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./index.css";

const PostAdsSlider = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await baseAxios.post("/posts/search");
        setProducts(response.data.content);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-slider mb-8 w-full max-w-6xl mx-auto relative">
      <Swiper
        pagination={{ clickable: true }}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        modules={[Pagination, Navigation]}
        loop={true}
        spaceBetween={20}
        slidesPerView={3}
        className="mySwiper"
        observer={true}
        parallax={true}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div
              className="product-item bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out cursor-pointer"
              onClick={() => navigate(`/post/${product.id}`)}
            >
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-bold text-gray-800 truncate">
                {product.title}
              </h3>
              <p className="text-xl text-red-500 font-semibold mt-2">
                {product.price.toLocaleString()} VND
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {product.address}, {product.district}, {product.province}
              </p>
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-pagination bottom-[-20px]"></div>
        <div className="swiper-button-prev-custom swiper-button-prev absolute left-2 top-1/2 transform -translate-y-1/2 z-10 text-gray-600"></div>
        <div className="swiper-button-next-custom swiper-button-next absolute right-2 top-1/2 transform -translate-y-1/2 z-10 text-gray-600"></div>
      </Swiper>
    </div>
  );
};

export default PostAdsSlider;
