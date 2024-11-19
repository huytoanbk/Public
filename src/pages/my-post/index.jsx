import React, { useEffect, useState } from "react";
import { Table, Input, Pagination, Button, message, Spin } from "antd";
import { useForm } from "react-hook-form";
import axiosInstance from "../../interceptor";
import { useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import { getRoomStatus, getRoomType } from "../../utiils/format-info-room";

const MyPost = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
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

  const onSearch = ({ search }) => {
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
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Status",
      dataIndex: "statusRoom",
      key: "statusRoom",
      render: (statusRoom) => getRoomStatus(statusRoom),
    },
    { title: "Views", dataIndex: "view", key: "view" },
    { title: "Active", dataIndex: "active", key: "active" },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => getRoomType(type),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => handleEdit(record.id)}>
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4 max-w-6xl mx-auto">
      <form onSubmit={handleSubmit(onSearch)} className="mb-4 flex gap-2">
        <Input.Search
          {...register("search")}
          placeholder="Search posts"
          className="w-1/3"
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
