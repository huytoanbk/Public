import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notification, Button } from "antd";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
} from "./validationSchemas";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import { getUserInfo } from "../../utiils/get-user-info";
import { useUser } from "../../context/UserContext";
import baseAxios from "../../interceptor/baseAxios";

const Login = () => {
  const [params] = useSearchParams();
  const { updateUserInfo, userInfo } = useUser();
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_ENDPOINT;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(
      isForgotPassword
        ? forgotPasswordSchema
        : isRegister
        ? registerSchema
        : loginSchema
    ),
  });

  const handleLogin = async (data) => {
    try {
      const response = await baseAxios.post("/auth/authenticate", data);
      if (response.status === 200) {
        await handleAfterGetToken(response.data);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Invalid email or password";
      notification.error({
        message: message,
      });
    }
  };

  const handleRegister = async (data) => {
    try {
      const response = await axios.post(`${baseUrl}/users/register`, data);
      if (response.status === 200) {
        notification.success({
          message: "Đăng ký thành công",
        });
        await handleAfterGetToken(response.data);
        reset();
        setIsRegister(false);
      } else {
        notification.error({
          message: response.data.message,
        });
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Đăng ký thất bại";
      notification.error({
        message: message,
      });
    }
  };

  const handleForgotPassword = async (data) => {
    try {
      const response = await axios.post(
        `${baseUrl}/users/email-send-otp`,
        data
      );
      if (response.status === 200) {
        notification.success({
          message:
            "Please check your email for password recovery instructions.",
        });
      } else {
        notification.error({
          message: response.data.message,
        });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Error in password recovery";
      notification.error({
        message: message,
      });
    }
  };

  const handleAfterGetToken = async (tokenInfo) => {
    localStorage.setItem("token", JSON.stringify(tokenInfo));
    const userInfo = await getUserInfo();
    updateUserInfo({ ...tokenInfo, ...userInfo.data });
    navigate("/");
  };

  const onSubmit = (data) => {
    if (isForgotPassword) {
      handleForgotPassword(data);
    } else if (isRegister) {
      handleRegister(data);
    } else {
      handleLogin(data);
    }
  };

  useEffect(() => {
    const isRegisterSearchParam = params.get("is_register");
    setIsRegister(isRegisterSearchParam === "true");
  }, [params]);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo]);

  return (
    <div className="min-h-[600px] bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {isRegister
            ? "Đăng ký"
            : isForgotPassword
            ? "Quên mật khẩu"
            : "Đăng nhập"}
        </h2>

        {isForgotPassword ? (
          <ForgotPasswordForm onFinish={() => {
            setIsRegister(false)
            setIsForgotPassword(false)
          }} />
        ) : isRegister ? (
          <RegisterForm />
        ) : (
          <LoginForm
            control={control}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
        )}

        <div className="text-center flex justify-between mt-3">
          <Button
            type="link"
            onClick={() => {
              setIsRegister(!isRegister);
              if (!isRegister) {
                setIsForgotPassword(false);
              }
            }}
          >
            {isRegister
              ? "Đã có tài khoản? Đăng nhập"
              : "Chưa có tài khoản? Đăng ký"}
          </Button>
          <Button
            type="link"
            onClick={() => {
              setIsForgotPassword(!isForgotPassword);
              if (!isForgotPassword) {
                setIsRegister(false);
              }
            }}
          >
            {isForgotPassword ? "Về đăng nhập" : "Quên mật khẩu?"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
