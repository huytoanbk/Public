import React, { useState, useEffect } from 'react'; 
import { Form, Input, Button, Upload, Avatar, message, Typography, Row, Col } from 'antd';
import { UploadOutlined, EditOutlined } from '@ant-design/icons';
import axiosInstance from '../../interceptor';

const { Title, Text } = Typography;

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    axiosInstance.get('/users').then((response) => {
      setUser(response.data);
      setAvatar(response.data.avatar);
    });
  }, []);

  const onFinish = (values) => {
    axiosInstance.put(`/users/${user.id}`, values)
      .then(() => {
        message.success("Cập nhật thông tin thành công");
        setEditing(false);  // Tắt chế độ chỉnh sửa sau khi lưu
      })
      .catch(() => message.error("Cập nhật thất bại"));
  };

  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axiosInstance.post('/users/upload-avatar', formData, {
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
          layout="vertical"
          initialValues={{
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
          }}
          onFinish={onFinish}
        >
          <Row gutter={16} justify="space-between">
            <Col span={8}>
              <div className="flex flex-col items-center mb-6">
                <Avatar size={100} src={avatar} className='mb-3' />
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
            </Col>
            <Col span={16}>
              <div className="flex justify-between">
                <Title level={3}>Thông tin người dùng</Title>
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
                    <Button onClick={handleCancelClick} type="default" className='mr-4'>
                      Hủy
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                    >
                      Lưu thay đổi
                    </Button>
                  </div>
                )}
              </div>
              <Form.Item label="Tên đầy đủ" name="fullName">
                <Input disabled={!editing} />
              </Form.Item>
              <Form.Item label="Email" name="email">
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Số điện thoại" name="phone">
                <Input disabled={!editing} />
              </Form.Item>
              <Form.Item label="Trạng thái" name="active">
                <Text>{user.active}</Text>
              </Form.Item>
              <Form.Item label="Vai trò">
                {user.roles.map(role => (
                  <Text key={role.id} style={{ display: 'block' }}>{role.name}</Text>
                ))}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ) : (
        <p>Đang tải thông tin người dùng...</p>
      )}
    </div>
  );
};

export default UserProfile;
