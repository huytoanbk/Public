import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import baseAxios from "../../interceptor/baseAxios";
import PaymentModal from "./PaymentModal";
import { useNavigate } from "react-router-dom";

const ModalPackages = ({ isVisible, onClose }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const handleBuyPackage = (packageId) => {
    setSelectedPackageId(packageId);
  };

  useEffect(() => {
    baseAxios
      .get("/advertising-package?page=1&size=10")
      .then((response) => {
        const fakePackages = [
          {
            id: 1,
            advertisingName: "Gói cơ bản",
            price: 99,
            des: "Phù hợp cho người dùng cá nhân hoặc nhỏ lẻ.",
            createdAt: "2024-11-01T10:00:00.000Z",
            createdBy: "Admin",
            updatedAt: "2024-11-15T12:00:00.000Z",
            updatedBy: "Admin",
            active: "ACTIVE",
          },
          {
            id: 2,
            advertisingName: "Gói tiêu chuẩn",
            price: 199,
            des: "Bao gồm nhiều tính năng mở rộng và hỗ trợ nâng cao.",
            createdAt: "2024-11-02T10:00:00.000Z",
            createdBy: "Admin",
            updatedAt: "2024-11-16T12:00:00.000Z",
            updatedBy: "Admin",
            active: "ACTIVE",
          },
          {
            id: 3,
            advertisingName: "Gói cao cấp",
            price: 299,
            des: "Dành cho doanh nghiệp với hỗ trợ 24/7.",
            createdAt: "2024-11-03T10:00:00.000Z",
            createdBy: "Admin",
            updatedAt: "2024-11-17T12:00:00.000Z",
            updatedBy: "Admin",
            active: "ACTIVE",
          },
          {
            id: 4,
            advertisingName: "Gói đặc biệt",
            price: 499,
            des: "Đáp ứng nhu cầu cá nhân hoá cho các doanh nghiệp lớn.",
            createdAt: "2024-11-04T10:00:00.000Z",
            createdBy: "Admin",
            updatedAt: "2024-11-18T12:00:00.000Z",
            updatedBy: "Admin",
            active: "ACTIVE",
          },
          {
            id: 5,
            advertisingName: "Gói thử nghiệm",
            price: 0,
            des: "Gói miễn phí dùng thử trong 7 ngày.",
            createdAt: "2024-11-05T10:00:00.000Z",
            createdBy: "Admin",
            updatedAt: "2024-11-19T12:00:00.000Z",
            updatedBy: "Admin",
            active: "ACTIVE",
          },
        ];
        // setPackages(response.data.content);
        setPackages(fakePackages);
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
                  <span className="mr-2 text-4xl font-extrabold text-blue-600">
                    ${pkg.price}
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
          onClose={() => setSelectedPackageId(null)}
          packageId={selectedPackageId}
          onClosePackagesModal={() => {
            onClose();
            navigate("/create-post")
          }}
        />
      </div>
    </Modal>
  );
};

export default ModalPackages;
