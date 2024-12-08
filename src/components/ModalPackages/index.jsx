import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, message as messageAntd, Typography } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import baseAxios from "../../interceptor/baseAxios";
import PaymentModal from "./PaymentModal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../interceptor";
import { GrNext, GrPrevious } from "react-icons/gr";

const { Title } = Typography;

const ModalPackages = ({ isVisible, onClose, isHidePostPkg = false }) => {
  const swiperRef = useRef(null);
  const swiperPostPkgRef = useRef(null);
  const [packages, setPackages] = useState([]);
  const [postPackages, setPostPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedPackageId, setSelectedPackageId] = useState(null);

  const handleBuyPackage = async (packageId) => {
    try {
      const response = await axiosInstance.post("/advertising-package/pay", {
        advertisingPackage: packageId,
      });
      const { id = "" } = response?.data || {};
      setSelectedPackageId(id);
    } catch (error) {
      const { errorMessage = "Có lỗi xảy ra" } = error;
      messageAntd.error(errorMessage);
    }
  };

  useEffect(() => {
    if (isVisible) {
      if (!isHidePostPkg) {
        baseAxios
          .get("/advertising-package?status=ACTIVE&type=0")
          .then((response) => {
            const listPackages = response?.data?.content || {};
            setPackages(listPackages);
          })
          .catch((error) => {
            console.error("Error fetching packages:", error);
          });
      }

      baseAxios
        .get("/advertising-package?status=ACTIVE&type=1")
        .then((response) => {
          const listPostPackages = response?.data?.content || {};
          setPostPackages(listPostPackages);
        })
        .catch((error) => {
          console.error("Error fetching packages:", error);
        });
    }
  }, [isVisible]);

  return (
    <Modal
      title="Mua gói hội viên để đăng bài"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      {!isHidePostPkg && (
        <>
          <Title className="mt-8" level={4}>
            Số ngày hiển thị
          </Title>
          <div className="bg-white p-3 rounded-lg mb-5 relative">
            {packages.length <= 3 ? (
              <div className="flex justify-between gap-4">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="flex flex-col justify-between h-[340px] p-6 w-[230px] text-center bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h3 className="mb-4 text-xl font-bold text-gray-800">
                      {pkg.advertisingName}
                    </h3>
                    <p className="font-light text-gray-600">{pkg.des}</p>
                    <div className="flex justify-center items-baseline my-6">
                      <span className="mr-2 text-3xl font-extrabold text-blue-600">
                        {pkg.price.toLocaleString()}đ
                      </span>
                    </div>
                    <Button
                      type="primary"
                      onClick={() => handleBuyPackage(pkg.id)}
                    >
                      Mua ngay
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <Swiper
                slidesPerView={3}
                spaceBetween={20}
                navigation
                pagination={{ clickable: true }}
                modules={[Navigation, Pagination]}
                className="px-2 py-2 pl-7"
                loop
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
              >
                {packages.map((pkg) => (
                  <SwiperSlide key={pkg.id}>
                    <div className="flex flex-col justify-between h-[340px] p-6 w-[230px] text-center bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                      <h3 className="mb-4 text-xl font-bold text-gray-800">
                        {pkg.advertisingName}
                      </h3>
                      <p className="font-light text-gray-600">{pkg.des}</p>
                      <div className="flex justify-center items-baseline my-6">
                        <span className="mr-2 text-3xl font-extrabold text-blue-600">
                          {pkg.price.toLocaleString()}đ
                        </span>
                      </div>
                      <Button
                        type="primary"
                        onClick={() => handleBuyPackage(pkg.id)}
                      >
                        Mua ngay
                      </Button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
            <button
              className="absolute top-[150px] left-[-16px] z-10 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
              onClick={() => swiperRef.current.slidePrev()}
            >
              <GrPrevious className="text-xl text-black" />
            </button>
            <button
              className="absolute top-[150px] right-[-16px] z-10 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
              onClick={() => swiperRef.current.slideNext()}
            >
              <GrNext className="text-xl text-black" />
            </button>
          </div>
        </>
      )}
      <Title level={4}>Số lượt đăng bài viết</Title>
      <div className="bg-white p-3 rounded-lg relative">
        {postPackages.length <= 3 ? (
          <div className="flex justify-between gap-4">
            {postPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex flex-col justify-between h-[340px] p-6 w-[230px] text-center bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="mb-4 text-xl font-bold text-gray-800">
                  {pkg.advertisingName}
                </h3>
                <p className="font-light text-gray-600">{pkg.des}</p>
                <div className="flex justify-center items-baseline my-6">
                  <span className="mr-2 text-3xl font-extrabold text-blue-600">
                    {pkg.price.toLocaleString()}đ
                  </span>
                </div>
                <Button type="primary" onClick={() => handleBuyPackage(pkg.id)}>
                  Mua ngay
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <Swiper
            slidesPerView={3}
            spaceBetween={20}
            navigation
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination]}
            className="px-2 py-2 pl-7"
            loop
            onSwiper={(swiper) => {
              swiperPostPkgRef.current = swiper;
            }}
          >
            {postPackages.map((pkg) => (
              <SwiperSlide key={pkg.id}>
                <div className="flex flex-col justify-between h-[340px] p-6 w-[230px] text-center bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="mb-4 text-xl font-bold text-gray-800">
                    {pkg.advertisingName}
                  </h3>
                  <p className="font-light text-gray-600">{pkg.des}</p>
                  <div className="flex justify-center items-baseline my-3">
                    <span className="mr-2 text-3xl font-extrabold text-blue-600">
                      {pkg.price.toLocaleString()}đ
                    </span>
                  </div>
                  <Button
                    type="primary"
                    onClick={() => handleBuyPackage(pkg.id)}
                  >
                    Mua ngay
                  </Button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        {postPackages.length > 3 && (
          <>
            <button
              className="absolute top-[150px] left-[-16px] z-10 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
              onClick={() => swiperPostPkgRef.current.slidePrev()}
            >
              <GrPrevious className="text-xl text-black" />
            </button>
            <button
              className="absolute top-[150px] right-[-16px] z-10 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
              onClick={() => swiperPostPkgRef.current.slideNext()}
            >
              <GrNext className="text-xl text-black" />
            </button>
          </>
        )}
      </div>

      <PaymentModal
        isVisible={!!selectedPackageId}
        onClose={() => {
          setSelectedPackageId(null);
        }}
        packageId={selectedPackageId}
        onClosePackagesModal={() => {
          setSelectedPackageId(null);
          setTimeout(() => onClose(), 200);
        }}
      />
    </Modal>
  );
};

export default ModalPackages;
