import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Avatar, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import axiosInstance from '../../interceptor';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInstance.get('http://localhost:8888/api/v1/users').then((response) => {
      setUser(response.data);
      setAvatar(response.data.avatar);
    });
  }, []);

  const onFinish = (values) => {
    axios.put(`http://localhost:8888/api/v1/users/${user.id}`, values)
      .then(() => message.success("Cập nhật thông tin thành công"))
      .catch(() => message.error("Cập nhật thất bại"));
  };

  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8888/api/v1/users/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAvatar(response.data.url);
      message.success('Tải lên avatar thành công!');
    } catch (error) {
      message.error('Tải lên avatar thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {user ? (
        <Form
          layout="vertical"
          initialValues={{
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
          }}
          onFinish={onFinish}
        >
          <div className="flex items-center mb-6">
            <Avatar size={100} src={avatar} />
            <Upload
              customRequest={handleUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} loading={loading}>
                Thay đổi avatar
              </Button>
            </Upload>
          </div>
          <Form.Item label="Tên đầy đủ" name="fullName">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <p>Đang tải thông tin người dùng...</p>
      )}
    </div>
  );
};

export default UserProfile;
