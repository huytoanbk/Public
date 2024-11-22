import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Controller, useForm } from "react-hook-form";
import baseAxios from "../../interceptor/baseAxios";
import OTPInput from "react-otp-input";

const ForgotPassword = ({onFinish}) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const sendOtp = async (data) => {
    try {
      await baseAxios.get(`/users/email-send-otp`, {
        params: { email: data.email },
      });
      message.success("OTP đã được gửi đến email của bạn!");
      setEmail(data.email);
      setStep(2);
    } catch (error) {
      message.error("Gửi OTP thất bại, vui lòng thử lại!");
    }
  };

  const verifyOtp = async () => {
    try {
      await baseAxios.post(`/users/verify-otp`, {
        value: email,
        otp,
      });
      message.success("Xác thực OTP thành công!");
      resetPassword();
    } catch (error) {
      message.error("OTP không hợp lệ, vui lòng thử lại!");
    }
  };

  const resetPassword = async () => {
    try {
      await baseAxios.put(`/users/reset-pw`, { email });
      message.success("Mật khẩu mới đã được gửi đến email của bạn!");
      onFinish();
      reset();
    } catch (error) {
      message.error("Không thể reset mật khẩu, vui lòng thử lại!");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      {step === 1 && (
        <Form
          layout="vertical"
          onFinish={handleSubmit(sendOtp)}
          className="space-y-4"
        >
          <Form.Item
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Vui lòng nhập email",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Email không hợp lệ",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Email"
                  className="py-2 px-3"
                  size="large"
                  style={{ borderBottom: "1px solid #ddd" }}
                />
              )}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full py-2 text-base rounded-lg"
            >
              Gửi OTP đến email
            </Button>
          </Form.Item>
        </Form>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="text-center font-semibold text-lg">Nhập mã OTP</div>
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            inputStyle={{
              width: "3rem",
              height: "3rem",
              margin: "0.5rem",
              fontSize: "1.5rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
            containerStyle={{ justifyContent: "center" }}
            isInputNum
            renderInput={(props) => <input {...props} />}
          />
          <Button
            type="primary"
            className="w-full py-2 text-base rounded-lg"
            onClick={verifyOtp}
          >
            Xác nhận OTP
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
