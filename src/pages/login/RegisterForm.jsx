import React from "react";
import { Form, Input, Button } from "antd";
import { Controller } from "react-hook-form";
import { LockOutlined, PhoneOutlined, IdcardOutlined } from "@ant-design/icons";

const RegisterForm = ({ control, errors, handleSubmit, onSubmit }) => (
  <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="space-y-4">
    <Form.Item validateStatus={errors.fullName ? "error" : ""} help={errors.fullName?.message}>
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
    <Form.Item validateStatus={errors.phone ? "error" : ""} help={errors.phone?.message}>
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
    <Form.Item validateStatus={errors.email ? "error" : ""} help={errors.email?.message}>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            prefix={<LockOutlined />}
            placeholder="Email"
            className="py-2 px-3"
            size="large"
            style={{ borderBottom: "1px solid #ddd" }}
          />
        )}
      />
    </Form.Item>
    <Form.Item validateStatus={errors.password ? "error" : ""} help={errors.password?.message}>
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
    <Form.Item>
      <Button type="primary" htmlType="submit" className="w-full py-2 text-lg rounded-lg">
        Register
      </Button>
    </Form.Item>
  </Form>
);

export default RegisterForm;
