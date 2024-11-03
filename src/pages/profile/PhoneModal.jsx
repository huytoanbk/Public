import React, { useState } from "react";
import { Form, Input, Button, Modal, message } from "antd";
import axiosInstance from "../../interceptor";
import OTPInput from "react-otp-input";

const PhoneVerificationModal = ({ visible, onClose, onVerified  }) => {
  const [phone, setPhone] = useState("");
  const [isOtpStage, setIsOtpStage] = useState(false);
  const [otp, setOtp] = useState("");

  const handlePhoneSubmit = async () => {
    try {
      await axiosInstance.get(`/users/phone-send-otp?phone=${phone}`);
      message.success("OTP đã được gửi!");
      setIsOtpStage(true);
    } catch (error) {
      message.error("Gửi OTP thất bại, vui lòng thử lại!");
    }
  };

  const handleOtpSubmit = async () => {
    try {
      await axiosInstance.post("/users/verify-otp", { value: phone, otp });
      message.success("Xác thực OTP thành công!");
      onVerified(phone);
      onClose();
      setIsOtpStage(false);
    } catch (error) {
      message.error("OTP không hợp lệ, vui lòng thử lại!");
    }
  };

  return (
    <Modal
      title={isOtpStage ? "Nhập OTP" : "Nhập số điện thoại"}
      open={visible}
      onCancel={() => {
        setIsOtpStage(false);
        setPhone("");
        setOtp("");
        onClose();
      }}
      footer={null}
    >
      {isOtpStage ? (
        <>
          <p className="mb-3">
            OTP vừa được gửi vào số điện thoại <b>{phone}</b>. Vui lòng kiểm tra
            tin nhắn{" "}
          </p>
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            separator={<span>-</span>}
            renderInput={(props) => <input {...props} />}
            containerStyle={{
              columnGap: "2rem",
              marginTop: "2rem",
            }}
            shouldAutoFocus={true}
            inputStyle={{
              width: "2.5rem",
              height: "2.5rem",
              fontSize: "1rem",
              borderRadius: 4,
              border: "1px solid #ddd",
            }}
          />
          <Button
            type="primary"
            onClick={handleOtpSubmit}
            className="mt-6 text-center block mx-auto"
          >
            Xác nhận OTP
          </Button>
        </>
      ) : (
        <Form onFinish={handlePhoneSubmit}>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            validateTrigger="onSubmit"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^0\d{9}$/,
                message:
                  "Số điện thoại không hợp lệ! Số điện thoại phải có 10 chữ số và bắt đầu bằng 0.",
              },
            ]}
          >
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Gửi OTP
          </Button>
        </Form>
      )}
    </Modal>
  );
};

export default PhoneVerificationModal;
