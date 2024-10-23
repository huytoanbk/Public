import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import baseAxios from "../../interceptor/baseAxios";
import { Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";

const PostAdsSlider = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await baseAxios.get("/posts/search");
        setProducts(response.data.content);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-slider w-full max-w-6xl mx-auto relative">
      <Swiper
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className}"></span>`;
          },
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        loop={true}
        spaceBetween={20}
        slidesPerView={3}
        className="mySwiper"
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
        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2">
          <div className="swiper-pagination"></div>
        </div>
      </Swiper>
    </div>
  );
};

export default PostAdsSlider;
