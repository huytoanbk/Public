import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  message,
  Typography,
  Row,
  Col,
} from "antd";
import { UploadOutlined, EditOutlined } from "@ant-design/icons";
import axiosInstance from "../../interceptor";
import PhoneVerificationModal from "./PhoneModal";
import AddressModal from "./AddressModal";
import AccountSettingsModal from "./AccountSettingsModal";

const { Title, Text } = Typography;

const UserProfile = () => {
  const [form] = Form.useForm();

  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);

  useEffect(() => {
    axiosInstance.get("/users").then((response) => {
      setUser(response.data);
      setAvatar(response.data.avatar);
    });
  }, []);

  const handlePhoneVerified = (verifiedPhone) => {
    form.setFieldsValue({ phone: verifiedPhone });
  };

  const handleAddressSelected = (selectedAddress) => {
    const {district = '', province = '', fullAddress}  = selectedAddress;
    form.setFieldsValue({ address: selectedAddress, fullAddress });
  };

  const onFinish = (values) => {
    const { roles, id, createdAt, updatedAt, notiStatus, uptime, ...restUser } =
      user;
    const formatData = {
      ...restUser,
      ...values,
    };
    axiosInstance
      .post(`/users`, formatData)
      .then(() => {
        message.success("Cập nhật thông tin thành công");
        setEditing(false);
      })
      .catch((error) => {
        const { errorMessage = "Cập nhật thất bại" } = error;
        message.error(errorMessage);
      });
  };

  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/users/upload-avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAvatar(response.data.url);
      message.success("Tải lên avatar thành công!");
    } catch (error) {
      message.error("Tải lên avatar thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCancelClick = () => {
    setEditing(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-[1200px] w-full pb-20 mt-10">
      {user ? (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            introduce: user.introduce,
          }}
          onFinish={onFinish}
        >
          <Row gutter={16} justify="space-between">
            <Col span={8}>
              <div className="flex flex-col items-center mb-6">
                <Avatar size={100} src={avatar} className="mb-3" />
                {editing && (
                  <Upload
                    customRequest={handleUpload}
                    showUploadList={false}
                    accept="image/*"
                  >
                    <Button icon={<UploadOutlined />} loading={loading}>
                      Thay đổi avatar
                    </Button>
                  </Upload>
                )}
              </div>
              <Button
                type="default"
                onClick={() => setIsModalVisible(true)}
                className="mt-2 mx-auto block"
              >
                Cài đặt tài khoản
              </Button>
            </Col>
            <Col span={16}>
              <div className="flex justify-between">
                <Title level={3}>Hồ sơ cá nhân </Title>
                {!editing ? (
                  <Button
                    icon={<EditOutlined />}
                    onClick={handleEditClick}
                    type="default"
                  >
                    Chỉnh sửa
                  </Button>
                ) : (
                  <div>
                    <Button
                      onClick={handleCancelClick}
                      type="default"
                      className="mr-4"
                    >
                      Hủy
                    </Button>
                    <Button type="primary" htmlType="submit">
                      Lưu thay đổi
                    </Button>
                  </div>
                )}
              </div>
              <Form.Item label="Tên đầy đủ" name="fullName">
                <Input disabled={!editing} />
              </Form.Item>
              <Form.Item label="Mô tả bản thân" name="introduce">
                <Input.TextArea
                  placeholder="Nhập mô tả bản thân"
                  rows={4}
                  disabled={!editing}
                />
              </Form.Item>
              <Form.Item label="Email" name="email">
                <Input disabled={!editing} readOnly />
              </Form.Item>
              <Form.Item label="Số điện thoại" name="phone">
                <Input
                  onClick={() => setIsModalVisible(true)}
                  disabled={!editing}
                />
              </Form.Item>
              <Form.Item label="Địa chỉ" name="address">
                <Input
                  onClick={() => setIsAddressModalVisible(true)}
                  disabled={!editing}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ) : (
        <p>Đang tải thông tin người dùng...</p>
      )}
      <PhoneVerificationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onVerified={handlePhoneVerified}
      />
      <AddressModal
        visible={isAddressModalVisible}
        onClose={() => setIsAddressModalVisible(false)}
        onAddressSelected={handleAddressSelected}
      />
      <AccountSettingsModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default UserProfile;
