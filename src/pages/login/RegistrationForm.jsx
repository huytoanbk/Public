import React from "react";
import { Form, Input, Button } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { LockOutlined, IdcardOutlined } from "@ant-design/icons";

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
              placeholder="Full Name"
              size="large"
            />
          )}
        />
      </Form.Item>
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
              placeholder="Password"
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
              placeholder="Confirm Password"
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
