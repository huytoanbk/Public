import React, { useState } from "react";
import { message, notification } from "antd";
import { useForm, FormProvider } from "react-hook-form";
import axios from "axios";

import ContactForm from "./ContactForm";
import OTPVerification from "./OTPVerification";
import RegistrationForm from "./RegistrationForm";
import baseAxios from "../../interceptor/baseAxios";
import { getUserInfo } from "../../utiils/get-user-info";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const { updateUserInfo } = useUser();
  const methods = useForm();
  const [step, setStep] = useState(1);
  const [contactValue, setContactValue] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const onSubmitContact = async ({ contact }) => {
    try {
      setContactValue(contact);
      const isPhone = /^\d+$/.test(contact);
      const apiUrl = isPhone
        ? `/users/phone-send-otp?phone=${contact}`
        : `/users/email-send-otp?email=${contact}`;

      await baseAxios.get(apiUrl);
      message.success("OTP đã được gửi!");
      setStep(2);
    } catch {
      message.error("Gửi OTP thất bại. Vui lòng thử lại!");
    }
  };

  const onSubmitOtp = async () => {
    try {
      await baseAxios.post("/users/verify-otp", {
        value: contactValue,
        otp,
      });
      message.success("Xác thực OTP thành công!");
      setStep(3);
    } catch {
      message.error("OTP không hợp lệ!");
    }
  };

  const handleAfterGetToken = async (tokenInfo) => {
    localStorage.setItem("token", JSON.stringify(tokenInfo));
    const userInfo = await getUserInfo();
    updateUserInfo({ ...tokenInfo, ...userInfo.data });
    navigate("/");
  };

  const onSubmitForm = async (formData) => {
    try {
      const {confirmPassword, ...data} = formData;
      const isPhone = /^\d+$/.test(contactValue);
      const payload = {
        ...data,
        ...(isPhone ? { phone: contactValue } : { email: contactValue }),
      };
      const response = await baseAxios.post("/users/register", payload);
      if (response.status === 200) {
        message.success("Registration successful");
        await handleAfterGetToken(response.data);
      } else {
        message.error({
          message: response.data.message,
        });
      }
    } catch(error) {
      const messageError = error?.response?.data?.message || "Đăng ký thất bại!"
      notification.error({
        message: messageError
      })
      // message.error({
      //   message: 
      // });
    }
  };

  const resetToContactForm = () => {
    setOtp("");
    setContactValue("");
    setStep(1);
    methods.reset();
  };

  const resendOtp = async () => {
    try {
      const isPhone = /^\d+$/.test(contactValue);
      const apiUrl = isPhone
        ? `/users/phone-send-otp?phone=${contactValue}`
        : `/users/email-send-otp?email=${contactValue}`;

      await baseAxios.get(apiUrl);
      message.success("OTP đã được gửi lại!");
    } catch {
      message.error("Gửi lại OTP thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto p-4">
        {step === 1 && <ContactForm onSubmit={onSubmitContact} />}
        {step === 2 && (
          <OTPVerification
            otp={otp}
            setOtp={setOtp}
            onSubmit={onSubmitOtp}
            onChangeContact={resetToContactForm}
            onResendOtp={resendOtp}
          />
        )}
        {step === 3 && (
          <RegistrationForm onSubmit={methods.handleSubmit(onSubmitForm)} />
        )}
      </div>
    </FormProvider>
  );
};

export default RegisterForm;
