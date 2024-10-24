import React from "react";
import { Form, Input, Button } from "antd";
import { Controller } from "react-hook-form";
import { MailOutlined } from "@ant-design/icons";

const ForgotPasswordForm = ({ control, errors, handleSubmit, onSubmit }) => (
  <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="space-y-4">
    <Form.Item validateStatus={errors.email ? "error" : ""} help={errors.email?.message}>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            prefix={<MailOutlined />}
            placeholder="Email"
            className="py-2 px-3"
            size="large"
            style={{ borderBottom: "1px solid #ddd" }}
          />
        )}
      />
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit" className="w-full py-2 text-lg rounded-lg">
        Send Reset Link
      </Button>
    </Form.Item>
  </Form>
);

export default ForgotPasswordForm;
