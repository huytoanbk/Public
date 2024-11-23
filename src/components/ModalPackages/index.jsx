import React, { useState, useEffect } from "react";
import { Modal, Button, message as messageAntd } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import baseAxios from "../../interceptor/baseAxios";
import PaymentModal from "./PaymentModal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../interceptor";

const ModalPackages = ({ isVisible, onClose }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  console.log("selectedPackageId", selectedPackageId);

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
    baseAxios
      .get("/advertising-package")
      .then((response) => {
        const listPackages = response?.data?.content || {};
        setPackages(listPackages);
      })
      .catch((error) => {
        console.error("Error fetching packages:", error);
      });
  }, []);

  return (
    <Modal
      title="Danh sách gói hội viên"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div className="bg-white p-3 rounded-lg">
        {packages.length <= 3 ? (
          <div className="flex justify-between gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex flex-col justify-between h-[340px] p-6 max-w-xs text-center bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
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
            className="px-3 py-2"
          >
            {packages.map((pkg) => (
              <SwiperSlide key={pkg.id}>
                <div className="flex flex-col justify-between h-[340px] p-6 max-w-xs text-center bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="mb-4 text-xl font-bold text-gray-800">
                    {pkg.advertisingName}
                  </h3>
                  <p className="font-light text-gray-600">{pkg.des}</p>
                  <div className="flex justify-center items-baseline my-6">
                    <span className="mr-2 text-4xl font-extrabold text-blue-600">
                      ${pkg.price}
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
      </div>
    </Modal>
  );
};

export default ModalPackages;
