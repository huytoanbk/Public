import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { Link } from "react-router-dom";

const PostManagement = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch("URL_CỦA_API_LẤY_TIN");
    const data = await response.json();
    setPosts(data);
  };

  const deletePost = async (id) => {
    await fetch(`URL_CỦA_API_XÓA_TIN/${id}`, { method: "DELETE" });
    message.success("Xóa tin thành công!");
    fetchPosts();
  };

  const columns = [
    {
      title: "Thành phố",
      dataIndex: "city",
    },
    {
      title: "Diện tích",
      dataIndex: "area",
    },
    {
      title: "Giá thuê",
      dataIndex: "price",
    },
    {
      title: "Hành động",
      render: (text, record) => (
        <>
          <Link to={`/admin/edit/${record.id}`}>
            <Button type="link">Chỉnh sửa</Button>
          </Link>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa tin này?"
            onConfirm={() => deletePost(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2>Danh sách tin đã đăng</h2>
        <Link to="/admin/create">
          <Button type="primary" style={{ marginBottom: "16px" }}>
            Đăng tin mới
          </Button>
        </Link>
      </div>
      <Table columns={columns} dataSource={posts} rowKey="id" />
    </div>
  );
};

export default PostManagement;
