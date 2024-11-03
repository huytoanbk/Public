import React from "react";
import { Form, Input, Button } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { LockOutlined, IdcardOutlined, PhoneOutlined } from "@ant-design/icons";
import { z } from "zod";

const registrationSchema = z.object({
  fullName: z.string().min(1, { message: 'Vui lòng nhập họ tên' }),
  // phone: z.string()
  //   .min(1, { message: 'Vui lòng nhập số điện thoại' })
  //   .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, { message: 'Số điện thoại không hợp lệ' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
  confirmPassword: z.string().min(6, { message: 'Xác nhận mật khẩu phải có ít nhất 6 ký tự' }),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Mật khẩu không khớp',
});

const RegistrationForm = ({ onSubmit }) => {
  const { control, handleSubmit, formState: { errors } } = useFormContext();

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="space-y-4">
      <Form.Item
        validateStatus={errors?.fullName ? "error" : ""}
        help={errors?.fullName?.message}
      >
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              prefix={<IdcardOutlined />}
              placeholder="Họ và tên"
              size="large"
            />
          )}
        />
      </Form.Item>
      {/* <Form.Item
        validateStatus={errors?.phone ? "error" : ""}
        help={errors?.phone?.message}
      >
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              prefix={<PhoneOutlined />}
              placeholder="Số điện thoại"
              size="large"
            />
          )}
        />
      </Form.Item> */}
      <Form.Item
        validateStatus={errors?.password ? "error" : ""}
        help={errors?.password?.message}
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Password
              {...field}
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          )}
        />
      </Form.Item>
      <Form.Item
        validateStatus={errors?.confirmPassword ? "error" : ""}
        help={errors?.confirmPassword?.message}
      >
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <Input.Password
              {...field}
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
              size="large"
            />
          )}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegistrationForm;
