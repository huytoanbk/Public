import React, { useEffect, useState } from "react";
import { Table, Input, Pagination, Button, message, Spin, Tooltip } from "antd";
import { Controller, useForm } from "react-hook-form";
import axiosInstance from "../../interceptor";
import { useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import {
  getPostStatus,
  getRoomStatus,
  getRoomType,
} from "../../utiils/format-info-room";
const { Search } = Input;

const MyPost = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, control, handleSubmit } = useForm();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async (query = "") => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/posts/search-user-post?page=${
          currentPage - 1
        }&size=${pageSize}&query=${query}`
      );
      setData(response.data.content);
      setTotal(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSearch = ({search}) => {
    setCurrentPage(1);
    fetchPosts(search);
  };

  const handleEdit = (id) => {
    navigate(`/edit-post/${id}`);
  };

  const handleDeactive = async (id) => {
    try {
      await axiosInstance.put(`/posts/${id}/deactivate`);
      message.success("Post deactivated successfully");
      fetchPosts();
    } catch (error) {
      console.error("Error deactivating post:", error);
      message.error("Failed to deactivate post");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 140,
      render: (id) => (
        <Tooltip title={id}>
          <span className="truncate">{id}</span>
        </Tooltip>
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (title) => (
        <Tooltip title={title}>
          <span className="truncate">{title}</span>
        </Tooltip>
      ),
      width: "auto",
    },
    {
      title: "Trạng thái",
      dataIndex: "statusRoom",
      key: "statusRoom",
      render: (statusRoom) => (
        <Tooltip title={getRoomStatus(statusRoom)}>
          <span className="truncate">{getRoomStatus(statusRoom)}</span>
        </Tooltip>
      ),
      width: 150,
    },
    {
      title: "Lượt xem",
      dataIndex: "view",
      key: "view",
      render: (view) => (
        <Tooltip title={view}>
          <span className="truncate">{view}</span>
        </Tooltip>
      ),
      width: 80,
    },
    {
      title: "Trạng thái bài đăng",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <Tooltip title={getPostStatus(active)}>
          <span className="truncate">{getPostStatus(active)}</span>
        </Tooltip>
      ),
      width: 100,
    },
    {
      title: "Loại phòng",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tooltip title={getRoomType(type)}>
          <span className="truncate">{getRoomType(type)}</span>
        </Tooltip>
      ),
      width: 150,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => handleEdit(record.id)}>
            Sửa
          </Button>
        </div>
      ),
      width: 150,
    },
  ];

  return (
    <div className="container mx-auto p-4 max-w-6xl mx-auto">
      <form onSubmit={handleSubmit(onSearch)} className="mb-4 flex gap-2">
      <Controller
        name="search"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Search
            {...field}
            placeholder="Tìm kiếm bài viết"
            className="w-1/3"
          />
        )}
      />
      </form>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey="id"
          className="shadow-sm rounded"
        />
      </Spin>

      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default MyPost;
