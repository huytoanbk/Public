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
        notification.success({
          message: "Login successful",
        });
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
          message: "Registration successful",
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
      const message = error?.response?.data?.message || "Registration failed";
      notification.error({
        message: message,
      });
    }
  };

  const handleForgotPassword = async (data) => {
    try {
      const response = await axios.post(
        `${baseUrl}/users/forgot-password`,
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
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {isRegister
            ? "Create Account"
            : isForgotPassword
            ? "Forgot Password"
            : "Welcome Back"}
        </h2>

        {isForgotPassword ? (
          <ForgotPasswordForm
            control={control}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
        ) : isRegister ? (
          <RegisterForm
            control={control}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
        ) : (
          <LoginForm
            control={control}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
        )}

        <div className="text-center">
          <Button type="link" onClick={() => {
            setIsRegister(!isRegister);
            if(!isRegister) {
              setIsForgotPassword(false);
            }
          }}>
            {isRegister
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Button>
          <Button
            type="link"
            onClick={() => {
              setIsForgotPassword(!isForgotPassword)
              if(!isForgotPassword) {
                setIsRegister(false);
              }
            }}
          >
            {isForgotPassword ? "Back to Login" : "Forgot Password?"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
