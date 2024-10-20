import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Form, Input, Button, Divider, notification } from "antd";
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { getUserInfo } from "../../utiils/get-user-info";
import { useUser } from "../../context/UserContext";

const loginSchema = z.object({
  email: z
    .string()
    .email("Email không hợp lệ")
    .min(1, { message: "Vui lòng nhập trường này" }),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .min(1, { message: "Vui lòng nhập trường này" }),
});

const registerSchema = z
  .object({
    fullName: z.string().min(1, { message: "Vui lòng nhập trường này" }),
    email: z
      .string()
      .email("Email không hợp lệ")
      .min(1, { message: "Vui lòng nhập trường này" }),
    phone: z
      .string()
      .min(1, { message: "Vui lòng nhập trường này" })
      .max(10)
      .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, "Số điện thoại không hợp lệ"),
    // username: z.string().min(1, { message: 'Vui lòng nhập trường này' }),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .min(1, { message: "Vui lòng nhập trường này" }),
    confirmPassword: z
      .string()
      .min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự")
      .min(1, { message: "Vui lòng nhập trường này" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu không khớp",
  });

const Login = () => {
  const [params] = useSearchParams();
  const { updateUserInfo } = useUser();
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_ENDPOINT;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
  });

  const handleLogin = async (data) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/authenticate`, data);
      if (response.status === 200) {
        notification.success({
          message: "Login successful",
        });
        handleAfterGetToken(response.data);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Invalid email or password";
      notification.error({
        message: message,
      });
    }
  };

  const handleAfterGetToken = async (tokenInfo) => {
    localStorage.setItem("token", JSON.stringify(tokenInfo));
    const userInfo = await getUserInfo();
    updateUserInfo({...tokenInfo, ...userInfo.data});
    navigate("/");
  };

  const handleRegister = async (data) => {
    try {
      const response = await axios.post(`${baseUrl}/users/register`, data);
      if (response.status !== 200) {
        notification.error({
          message: response.message,
        });
      }
      handleAfterGetToken(response.data);
      notification.success({
        message: "Registration successful",
      });
      reset();
      setIsRegister(false);
    } catch (error) {
      const message = error?.response?.data?.message || "Registration failed";
      notification.error({
        message: message,
      });
    }
  };

  const onSubmit = (data) => {
    if (isRegister) {
      handleRegister(data);
    } else {
      handleLogin(data);
    }
  };

  useEffect(() => {
    const isRegisterSearchParam = params.get("is_register");
    isRegisterSearchParam ? setIsRegister(true) : setIsRegister(false);
  }, [params]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>

        <Form
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {isRegister && (
            <>
              <Form.Item
                validateStatus={errors.fullName ? "error" : ""}
                help={errors.fullName?.message}
              >
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      prefix={<IdcardOutlined />}
                      placeholder="Full Name"
                      className="py-2 px-3"
                      size="large"
                      style={{ borderBottom: "1px solid #ddd" }}
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                validateStatus={errors.phone ? "error" : ""}
                help={errors.phone?.message}
              >
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      prefix={<PhoneOutlined />}
                      placeholder="Phone"
                      className="py-2 px-3"
                      maxLength={10}
                      size="large"
                      style={{ borderBottom: "1px solid #ddd" }}
                    />
                  )}
                />
              </Form.Item>
            </>
          )}

          <Form.Item
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserOutlined />}
                  placeholder="Email"
                  className="py-2 px-3"
                  size="large"
                  style={{ borderBottom: "1px solid #ddd" }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  className="py-2 px-3"
                  size="large"
                  style={{ borderBottom: "1px solid #ddd" }}
                />
              )}
            />
          </Form.Item>

          {isRegister && (
            <Form.Item
              validateStatus={errors.confirmPassword ? "error" : ""}
              help={errors.confirmPassword?.message}
            >
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    prefix={<LockOutlined />}
                    placeholder="Confirm Password"
                    className="py-2 px-3"
                    size="large"
                    style={{ borderBottom: "1px solid #ddd" }}
                  />
                )}
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full py-2 text-lg rounded-lg"
              style={{ background: "#4f46e5", borderColor: "#4f46e5" }}
            >
              {isRegister ? "Register" : "Login"}
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <div className="text-center">
          <Button
            type="link"
            onClick={() => {
              setIsRegister(!isRegister);
              reset();
            }}
            className="text-blue-500 hover:text-blue-600 transition duration-300"
          >
            {isRegister
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
