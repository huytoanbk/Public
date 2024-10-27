import React from "react";
import { Button, message } from "antd";
import OTPInput from "react-otp-input";

const OTPVerification = ({ otp, setOtp, onSubmit, onChangeContact, onResendOtp }) => {
  return (
    <div>
      <h3>Nhập mã OTP</h3>
      <OTPInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        separator={<span>-</span>}
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
        className="mt-4"
        disabled={otp.length !== 6}
      >
        Xác thực OTP
      </Button>
      <div className="flex mt-4 space-x-4">
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
