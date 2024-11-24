import { Modal, Descriptions, message } from "antd";
import React, { useEffect, useState } from "react";
import { Table, Button, Form, Input, Select, Space, notification } from "antd";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import baseAxios from "../../../interceptor/baseAxios";
import {
  getPostStatus,
  getRoomStatus,
  getRoomType,
} from "../../../utiils/format-info-room";
import { render } from "@testing-library/react";
import { FaEye } from "react-icons/fa";
import { RxExternalLink } from "react-icons/rx";
import { Link } from "react-router-dom";
import moment from "moment";
import axiosInstance from "../../../interceptor";
import { statusRoomOptions, roomTypeOtions } from "../../../components/ConfigPost";

const { Option } = Select;

const PostManagement = () => {
  const { control, handleSubmit } = useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchData = async (filters = {}, updatedPagination = pagination) => {
    setLoading(true);
    try {
      const response = await baseAxios.post("/posts/search", {
        page: updatedPagination.current - 1,
        size: updatedPagination.pageSize,
        ...filters,
      });
      const { content, totalElements } = response.data;
      setData(content);
      setPagination((prev) => ({ ...prev, total: totalElements }));
    } catch (error) {
      notification.error({ message: "Failed to fetch posts" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSearch = (data) => {
    const newPagination = { ...pagination, current: 1 };
    setPagination(newPagination);
    fetchData(data, newPagination);
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
    fetchData({}, newPagination);
  };

  const handleAction = async (action, record) => {
    switch (action) {
      case "view":
        await fetchPost(record.id);
        break;
      case "edit":
        break;
      case "delete":
        break;
      case "toggle":
        break;
      default:
        break;
    }
  };

  const fetchPost = async (postId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/posts/${postId}`);
      setSelectedPost(response.data);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Không thể lấy dữ liệu bài viết!");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPost(null);
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Status",
      dataIndex: "statusRoom",
      key: "statusRoom",
      render: (_, record) => <span>{getRoomStatus(record.statusRoom)}</span>,
    },
    { title: "Created By", dataIndex: "createdBy", key: "createdBy" },
    { title: "Province", dataIndex: "province", key: "province" },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (_, record) => <PostStatusColumn record={record} />,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (_, record) => <span>{getRoomType(record.type)}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleAction("view", record)} icon={<FaEye />}>
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form
        layout="inline"
        onFinish={handleSubmit(onSearch)}
        style={{ gap: "16px", marginBottom: "20px" }}
      >
        <Form.Item label="Tiêu đề bài viết">
  <Controller
    name="title"
    control={control}
    render={({ field }) => (
      <Input {...field} placeholder="Nhập tiêu đề bài viết" />
    )}
  />
</Form.Item>
        <Form.Item label="Trạng thái bài viết">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Chọn trạng thái" allowClear>
                {statusOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item label="Trạng thái nhà">
          <Controller
            name="statusRoom"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Chọn trạng thái" allowClear>
                {statusRoomOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item label="Loại phòng">
          <Controller
            name="roomType"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Chọn loại phòng" allowClear>
                {roomTypeOtions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
        scroll={{ x: 1000 }}
        style={{ marginTop: "20px" }}
      />
      <Modal
        title={
          <span className="flex items-center">
            {selectedPost?.title || "Post Details"}
            <Link to={`/post/${selectedPost?.id}`} className="ml-2">
              <RxExternalLink />
            </Link>
          </span>
        }
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        {selectedPost && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Tiêu đề">
              <div>{selectedPost.title}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Giá">
              <div>{selectedPost.price}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Đặt cọc">
              <div>{selectedPost.deposit}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              <div>{selectedPost.address}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Diện tích">
              <div>{selectedPost.acreage}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái phòng">
              <div>{getRoomStatus(selectedPost.statusRoom)}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Liên hệ">
              <div>{selectedPost.contact}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              <div>
                {moment(selectedPost.createdAt, "DD-MM-YYYYTHH:mm:ssZ").format(
                  "HH:mm:ss DD/MM/YYYY"
                )}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Người tạo">
              <div>{selectedPost.createdBy}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật">
              <div>
                {moment(selectedPost.updatedAt, "DD-MM-YYYYTHH:mm:ssZ").format(
                  "HH:mm:ss DD/MM/YYYY"
                )}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Người cập nhật">
              <div>{selectedPost.updatedBy}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày hết hạn">
              <div>{selectedPost.expirationDate}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Tỉnh/Thành phố">
              <div>{selectedPost.province}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Quận/Huyện">
              <div>{selectedPost.district}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Lượt xem">
              <div>{selectedPost.view}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Bản đồ">
              <div>{selectedPost.map}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Hoạt động">
              <div>{getPostStatus(selectedPost.active)}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Loại phòng">
              <div>{getRoomType(selectedPost.type)}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Hình ảnh">
              <div>
                {selectedPost.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Hình ảnh ${index + 1}`}
                    style={{ width: "100%", marginBottom: "10px" }}
                  />
                ))}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Nội dung">
              <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

const statusOptions = [
  { value: "ACTIVE", label: "Duyệt bài viết" },
  { value: "PENDING", label: "Đang chờ duyệt" },
  { value: "INACTIVE", label: "Ngừng hoạt động" },
  { value: "REJECT", label: "Từ chối" },
];

const PostStatusColumn = ({ record }) => {
  const handleStatusChange = async (value) => {
    try {
      const response = await axios.put(`/update-status/status=${value}`, {
        postId: record.id,
        status: value,
      });
      if (response.status === 200) {
        message.success("Cập nhật trạng thái thành công!");
      } else {
        message.error("Cập nhật trạng thái thất bại!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };

  return (
    <Select
      value={record.active}
      onChange={handleStatusChange}
      options={statusOptions}
      style={{ width: 180 }}
    />
  );
};

export default PostManagement;
