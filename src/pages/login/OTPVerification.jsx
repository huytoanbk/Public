import React from "react";
import { Button, message, Typography } from "antd";
import OTPInput from "react-otp-input";

const {Title} = Typography

const OTPVerification = ({ otp, setOtp, onSubmit, onChangeContact, onResendOtp }) => {
  return (
    <div>
      <Title level={4} className="text-center !mb-5">Nhập mã OTP</Title>
      <OTPInput
        value={otp}
        containerStyle={{
          columnGap: '2rem'
        }}
        onChange={setOtp}
        numInputs={6}
        shouldAutoFocus={true}
        separator={<div><span>-</span></div>}
        inputStyle={{
          width: "2.5rem",
          height: "2.5rem",
          fontSize: "1rem",
          borderRadius: 4,
          border: "1px solid #ddd",
        }}
        renderInput={(props) => <input {...props} />}
      />
      <Button
        type="primary"
        onClick={onSubmit}
        className="mt-4 mx-auto block"
        disabled={otp.length !== 6}
      >
        Xác thực OTP
      </Button>
      <div className="flex mt-4 space-x-4 justify-between">
        <Button type="link" onClick={onChangeContact}>
          Đổi số điện thoại/email
        </Button>
        <Button type="link" onClick={onResendOtp}>
          Gửi lại OTP
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
