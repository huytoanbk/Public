import React, { useState } from "react";
import { Button, Modal, Form, Input, notification, message } from "antd";
import axiosInstance from "../../interceptor";

const AccountSettingsModal = ({ visible, onClose }) => {
  const [showError, setShowError] = useState(false);

  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        const { oldPassword, newPassword } = values;
        try {
          await axiosInstance.post("/users/change-password", {
            oldPassword,
            newPassword,
          });
          message.success({ content: "Thay đổi mật khẩu thành công!" });
          onClose();
          form.resetFields(["newPassword", "oldPassword", "confirmPassword"]);
        } catch (error) {
          const { errorMessage = "Có lỗi xảy ra. Vui lòng thử lại." } = error;
          message.error({ content: errorMessage });
        }
      })
      .catch((info) => {
        setShowError(true);
      });
  };

  return (
    <Modal
      title="Cài đặt tài khoản"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Xác nhận
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Mật khẩu cũ"
          name="oldPassword"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu cũ" />
        </Form.Item>
        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>
        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          rules={[
            { required: showError, message: "Vui lòng xác nhận mật khẩu mới!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const newPassword = getFieldValue("newPassword");
                if (!value || newPassword === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp!")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Xác nhận mật khẩu mới" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AccountSettingsModal;
