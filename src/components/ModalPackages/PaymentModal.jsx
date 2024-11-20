import React, { useState, useEffect } from "react";
import { Modal, Spin, message, Button } from "antd";
import baseAxios from "../../interceptor/baseAxios";

const PaymentModal = ({
  isVisible,
  onClose,
  packageId,
  onClosePackagesModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isVisible && packageId) {
      setLoading(true);
      baseAxios
        .get("/advertising-package/qr-code", { advertisingPackage: packageId })
        .then((response) => {
          setLoading(false);
          setQrCode(response);
        })
        .catch((error) => {
          setLoading(false);
          setError("Không thể tải mã QR, vui lòng thử lại.");
          message.error("Lỗi khi tải mã QR.");
        });
    }
  }, [isVisible, packageId]);

  const handleClose = () => {
    onClose();
    setQrCode(null);
    setPaymentStatus(null);
  };

  const checkPaymentStatus = () => {
    setLoading(true);
    setTimeout(() => {
      baseAxios
        .get(`/advertising-package/pay/${packageId}`)
        .then((response) => {
          setLoading(false);
          if (response.data.status === "success") {
            setPaymentStatus("Đã thanh toán thành công");
            message.success("Thanh toán thành công!");
            setTimeout(() => {
              handleClose();
            }, 2000);
          } else {
            setPaymentStatus("Thanh toán không thành công");
            message.error("Thanh toán không thành công.");
          }
        })
        .catch((error) => {
          setLoading(false);
          setPaymentStatus("Không thể kiểm tra trạng thái thanh toán");
          message.error("Lỗi khi kiểm tra trạng thái thanh toán.");
        });
    }, 1000);
  };

  return (
    <Modal
      title="Thanh toán"
      open={isVisible}
      onCancel={handleClose}
      footer={null}
      width={600}
    >
      <div className="text-center">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : qrCode ? (
          <div className="mx-auto">
            <img
              className="mx-auto mt-12 h-52 w-52 rounded-lg border p-2 md:mt-0"
              src={qrCode}
              alt="QR Code"
            />
            <Button
              className=""
              onClick={checkPaymentStatus}
              disabled={loading}
            >
              {loading
                ? "Đang kiểm tra trạng thái thanh toán..."
                : "Kiểm tra trạng thái thanh toán"}
            </Button>
            {paymentStatus && (
              <div className="mt-4 text-lg font-semibold">{paymentStatus}</div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Không có mã QR để hiển thị.</p>
        )}
      </div>
    </Modal>
  );
};

export default PaymentModal;
