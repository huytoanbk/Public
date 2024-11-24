import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import baseAxios from "../../interceptor/baseAxios";
import { Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { IoIosTimer } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import { IoPricetag } from "react-icons/io5";
import { BiArea } from "react-icons/bi";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./index.css";
import { getRoomType, getThumbnail } from "../../utiils/format-info-room";
import LikeButton from "../LikeButton";
import axiosInstance from "../../interceptor";

const PostAdsSlider = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListPost = async () => {
      try {
        let response;
        const isLoggedIn = localStorage.getItem("token");
        if (!isLoggedIn) {
          response = await baseAxios.get(`/posts/recommend`);
        } else {
          response = await axiosInstance.get(`/posts/recommend`);
        }
        setProducts(response.data.content);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    fetchListPost();
  }, []);

  return (
    <div className="product-slider mb-8 w-full mx-auto relative px-5">
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
        {products.map((product) => {
          const { images = [] } = product;
          const imageUrl = getThumbnail(images[0]);
          return (
            <SwiperSlide
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg transition-shadow duration-300 ease-in-out cursor-pointer flex flex-col h-full"
              onClick={() => navigate(`/post/${product.id}`)}
            >
              <div className="rounded overflow-hidden shadow-lg flex flex-col h-full">
                <div className="relative">
                  <div>
                    <img
                      className="w-full h-[200px]"
                      src={imageUrl}
                      alt="Product Image"
                    />
                    <div className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25"></div>
                  </div>
                  {product.type && (
                    <div className="text-xs absolute top-0 right-0 bg-indigo-600 px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out">
                      {getRoomType(product.type)}
                    </div>
                  )}
                </div>
                <div className="px-4 py-3 mb-auto flex-grow">
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out mb-2 truncate max-w-[180px]">
                      {product.title}
                    </div>
                    <LikeButton post={product} />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-sm flex items-center mb-2">
                      <BiArea className="mr-2" />
                      Diện tích: {product.acreage} m²
                    </p>
                    <div className="text-gray-700 font-semibold text-md flex items-center">
                      <IoPricetag className="mr-1 text-indigo-600" />
                      {product.price.toLocaleString()} đ
                    </div>
                  </div>
                  <div
                    className="line-clamp-2 h-[44px] text-base"
                    dangerouslySetInnerHTML={{
                      __html: product.content,
                    }}
                  ></div>
                </div>
                <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
                  <span className="py-1 text-xs font-regular text-gray-900 flex items-center">
                    <IoIosTimer className="mr-[6px]" />
                    {product.uptime}
                  </span>
                  <span className="py-1 text-xs font-regular text-gray-900 flex items-center">
                    <CiLocationOn className="mr-[6px]" />
                    {product.district}, {product.province}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
        <div className="swiper-pagination bottom-[-20px]"></div>
        <div className="swiper-button-prev-custom swiper-button-prev absolute left-10 top-1/2 transform -translate-y-1/2 z-10 text-gray-600"></div>
        <div className="swiper-button-next-custom swiper-button-next absolute right-10 top-1/2 transform -translate-y-1/2 z-10 text-gray-600"></div>
      </Swiper>
    </div>
  );
};

export default PostAdsSlider;
