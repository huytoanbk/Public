import React, { useEffect, useState } from "react";
import { Table, Input, Button, Tag, Modal, Space } from "antd";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import axiosInstance from "../../../interceptor";

const AdsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const schema = z.object({
    search: z.string().optional(),
  });

  const { control, handleSubmit, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { search: "" },
  });

  const fetchData = async (page = 1, pageSize = 10, search = "") => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/advertising-package`, {
        params: { page, size: pageSize, search },
      });
      const { content } = response.data;
      setData(content || []);
      setPagination({ current: page, pageSize, total: response.data.total });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSearch = ({ search }) => {
    setSearchQuery(search);
    fetchData(1, pagination.pageSize, search);
  };

  const handleTableChange = (pagination) => {
    fetchData(pagination.current, pagination.pageSize, searchQuery);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Tên gói",
      dataIndex: "advertisingName",
      key: "advertisingName",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "green" : "red"}>
          {status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => viewPackage(record.id)}>
            Xem
          </Button>
          <Button type="link" onClick={() => editPackage(record.id)}>
            Sửa
          </Button>
          <Button
            type="link"
            danger
            onClick={() => changeStatus(record.id, record.active)}
          >
            Thay đổi trạng thái
          </Button>
          <Button type="link" danger onClick={() => deletePackage(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const viewPackage = (id) => {
    Modal.info({ title: `Thông tin gói`, content: `Gói ID: ${id}` });
  };

  const editPackage = (id) => {
    console.log("Edit package ID:", id);
  };

  const changeStatus = (id, currentStatus) => {
    Modal.confirm({
      title: "Xác nhận",
      content: `Bạn có chắc muốn ${
        currentStatus === "ACTIVE" ? "hủy kích hoạt" : "kích hoạt"
      } gói này?`,
      onOk: () => console.log("Status changed for ID:", id),
    });
  };

  const deletePackage = (id) => {
    Modal.confirm({
      title: "Xóa gói",
      content: "Bạn có chắc muốn xóa gói này?",
      onOk: () => console.log("Package deleted ID:", id),
    });
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Quản lý gói hội viên</h2>
        <Button
          type="primary"
          onClick={() => navigate("/admin/create-advertising-package")}
        >
          Tạo gói hội viên
        </Button>
      </div>
      <form
        className="flex items-center gap-4 mb-4"
        onSubmit={handleSubmit(onSearch)}
      >
        <Controller
          name="search"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Tìm kiếm..." className="w-1/3" />
          )}
        />
        <Button type="primary" htmlType="submit">
          Tìm kiếm
        </Button>
      </form>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default AdsManagement;
