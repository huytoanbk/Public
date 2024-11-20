import React from "react";
import { useNavigate } from "react-router-dom";
import AdvertisingPackageForm from "./AdvertisingPackageForm";
import axiosInstance from "../../../interceptor";
import { notification } from "antd";

const CreateAdvertisingPackage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      await axiosInstance.post("/advertising-package", data);
      notification.success("Tạo gói hội viên thành công");
      navigate("/admin/ads-management");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại";
      notification.error({
        message: message,
      });
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold mb-4">Tạo gói hội viên</h2>
      <AdvertisingPackageForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateAdvertisingPackage;
