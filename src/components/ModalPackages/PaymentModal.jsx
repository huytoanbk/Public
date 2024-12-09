import React, { useState, useEffect } from "react";
import { Modal, Spin, message, Button } from "antd";
import baseAxios from "../../interceptor/baseAxios";

const qrCode = '/default-thumbnail.png';

const PaymentModal = ({
  isVisible,
  onClose,
  packageId,
  onClosePackagesModal,
}) => {
  const [loading, setLoading] = useState(false);
  // const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   if (isVisible && packageId) {
  //     setLoading(true);
  //     baseAxios
  //       .get("/advertising-package/qr-code", {
  //         params: { advertisingPackage: packageId },
  //       })
  //       .then((response) => {
  //         setLoading(false);
  //         setQrCode(response.data);
  //       })
  //       .catch(() => {
  //         setLoading(false);
  //         setError("Không thể tải mã QR, vui lòng thử lại.");
  //         message.error("Lỗi khi tải mã QR.");
  //       });
  //   }
  // }, [isVisible, packageId]);

  const handleClose = () => {
    onClose();
    // setQrCode(null);
  };

  const checkPaymentStatus = () => {
    setLoading(true);
    setTimeout(() => {
      baseAxios
        .get(`/advertising-package/pay/${packageId}`)
        .then((response) => {
          setLoading(false);
          if (response?.data?.active?.toUpperCase() === "ACTIVE") {
            message.success("Thanh toán thành công!");
            setTimeout(() => {
              handleClose();
              onClosePackagesModal();
            }, 200);
          } else {
            message.error("Thanh toán không thành công.");
          }
        })
        .catch(() => {
          setLoading(false);
          message.error("Lỗi khi kiểm tra trạng thái thanh toán.");
        });
    }, 1000);
  };

  return (
    <Modal
      title="Thanh Toán"
      open={isVisible}
      onCancel={handleClose}
      footer={null}
      width={600}
    >
      <div className="text-center space-y-8">
        {error ? (
          <div className="text-red-500 font-semibold">{error}</div>
        ) : qrCode ? (
          <>
            <img
              className="mx-auto h-52 w-52 rounded-lg border p-2 shadow-md"
              src={qrCode}
              alt="QR Code"
            />
            <div className="text-lg font-medium text-gray-700">
              Giao dịch của bạn đang được xử lý,
              <br />
              vui lòng đợi trong giây lát...
            </div>
            <Button
              className="mt-6 px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500"
              onClick={checkPaymentStatus}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spin size="small" className="mr-2" />
                  Đang kiểm tra trạng thái thanh toán...
                </>
              ) : (
                "Kiểm tra trạng thái thanh toán"
              )}
            </Button>
          </>
        ) : (
          <div className="text-gray-500">Không có mã QR để hiển thị.</div>
        )}
      </div>
    </Modal>
  );
};

export default PaymentModal;
