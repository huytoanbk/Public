import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdvertisingPackageForm from "./AdvertisingPackageForm";
import axiosInstance from "../../../interceptor";
import { message as messageAntd } from "antd";

const EditAdvertisingPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axiosInstance.get(`/advertising-package/${id}`);
        setInitialData(response.data);
      } catch (error) {
        console.error("Error fetching package:", error);
      }
    };

    fetchPackage();
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      await axiosInstance.put(`/advertising-package/${id}`, data);
      messageAntd.success("Cập nhật gói hội viên thành công");
      navigate("/admin/ads-management");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại";
        messageAntd.error({
        message: message,
      });
    }
  };

  if (!initialData) {
    return <p>Đang tải...</p>;
  }

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold mb-4">Chỉnh sửa gói hội viên</h2>
      <AdvertisingPackageForm
        initialData={initialData}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditAdvertisingPackage;
