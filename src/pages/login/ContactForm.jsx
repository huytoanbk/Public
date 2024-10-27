import React from "react";
import { Form, Input, Button } from "antd";
import { Controller, useFormContext } from "react-hook-form";

const ContactForm = ({ onSubmit }) => {
  const { control, handleSubmit, formState: { errors } } = useFormContext();

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item
        validateStatus={errors?.contact ? "error" : ""}
        help={errors?.contact?.message}
      >
        <Controller
          name="contact"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Nhập số điện thoại hoặc email"
              size="large"
            />
          )}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Gửi OTP
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ContactForm;
