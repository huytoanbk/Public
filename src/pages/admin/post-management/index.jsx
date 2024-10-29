import { Modal, Descriptions } from "antd";
import React, { useEffect, useState } from "react";
import { Table, Button, Form, Input, Select, Space, notification } from "antd";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import baseAxios from "../../../interceptor/baseAxios";

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
        // params: {
        page: updatedPagination.current - 1,
        size: updatedPagination.pageSize,
        ...filters,
        // },
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

  const handleAction = (action, record) => {
    switch (action) {
      case "view":
        setSelectedPost(record);
        setIsModalVisible(true);
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

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPost(null);
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Status", dataIndex: "statusRoom", key: "statusRoom" },
    { title: "Created By", dataIndex: "createdBy", key: "createdBy" },
    { title: "Province", dataIndex: "province", key: "province" },
    { title: "Active", dataIndex: "active", key: "active" },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleAction("view", record)}>View</Button>
          <Button onClick={() => handleAction("edit", record)}>Edit</Button>
          <Button onClick={() => handleAction("delete", record)} danger>
            Delete
          </Button>
          <Button onClick={() => handleAction("toggle", record)}>
            Toggle Status
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
        <Form.Item label="Search by Title">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Enter title" />
            )}
          />
        </Form.Item>
        <Form.Item label="Status">
          <Controller
            name="statusRoom"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select status" allowClear>
                <Option value="available">Available</Option>
                <Option value="rented">Rented</Option>
              </Select>
            )}
          />
        </Form.Item>
        <Form.Item label="Room Type">
          <Controller
            name="roomType"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select type" allowClear>
                <Option value="single">Single</Option>
                <Option value="double">Double</Option>
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
        style={{ marginTop: "20px" }}
      />
      <Modal
        title={selectedPost?.title || "Post Details"}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        {selectedPost && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Title">
              <div>{selectedPost.title}</div>
            </Descriptions.Item>

            <Descriptions.Item label="Price">
              <div>{selectedPost.price}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Deposit">
              <div>{selectedPost.deposit}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              <div>{selectedPost.address}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Acreage">
              <div>{selectedPost.acreage}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <div>{selectedPost.statusRoom}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Contact">
              <div>{selectedPost.contact}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              <div>{selectedPost.createdAt}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Created By">
              <div>{selectedPost.createdBy}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              <div>{selectedPost.updatedAt}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Updated By">
              <div>{selectedPost.updatedBy}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Expiration Date">
              <div>{selectedPost.expirationDate}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Province">
              <div>{selectedPost.province}</div>
            </Descriptions.Item>
            <Descriptions.Item label="District">
              <div>{selectedPost.district}</div>
            </Descriptions.Item>
            <Descriptions.Item label="View">
              <div>{selectedPost.view}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Map">
              <div>{selectedPost.map}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Active">
              <div>{selectedPost.active}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              <div>{selectedPost.type}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Images">
              <div>
                {selectedPost.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Post image ${index + 1}`}
                    style={{ width: "100%", marginBottom: "10px" }}
                  />
                ))}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Content">
              <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default PostManagement;
