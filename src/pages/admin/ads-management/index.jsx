import React, { useEffect, useState } from "react";
import { Table, Input, Button, Tag, Modal, Space, Tooltip, message } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import axiosInstance from "../../../interceptor";
import {
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

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
  const fetchData = async (page = 0, pageSize = 10, search = "") => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/advertising-package`, {
        params: { page, size: pageSize, ...(search && { key: search }) },
      });
      const { content, totalElements } = response.data;
      setData(content.map((item) => ({ ...item, key: item.id })) || []);
      setPagination({ current: page + 1, pageSize, total: totalElements });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSearch = ({ search }) => {
    setSearchQuery(search);
    fetchData(0, pagination.pageSize, search);
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
          <Tooltip title="Xem">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => viewPackage(record.id)}
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => editPackage(record.id)}
            />
          </Tooltip>
          {/* <Tooltip title="Thay đổi trạng thái">
            <Button
              type="link"
              danger
              icon={<SyncOutlined />}
              onClick={() => changeStatus(record.id, record.active)}
            />
          </Tooltip> */}
          <Tooltip title="Xóa">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => deletePackage(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const viewPackage = async (id) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/advertising-package/${id}`);
      const data = response.data;

      Modal.info({
        title: (
          <div className="text-lg font-semibold text-gray-800">
            Thông tin gói: {data.advertisingName}
          </div>
        ),
        content: (
          <div className="space-y-4 text-sm">
            {data.price && (
              <div className="flex items-center">
                <FileTextOutlined className="text-blue-500 mr-2" />
                <p className="font-medium">Giá:</p>
                <span className="ml-2 font-bold text-gray-900">
                  {data.price.toLocaleString()} VND
                </span>
              </div>
            )}

            {data.des && (
              <div className="flex items-center">
                <FileTextOutlined className="text-green-500 mr-2" />
                <p className="font-medium">Mô tả:</p>
                <span className="ml-2 font-bold text-gray-900">{data.des}</span>
              </div>
            )}

            {data.createdAt && (
              <div className="flex items-center">
                <CalendarOutlined className="text-purple-500 mr-2" />
                <p className="font-medium">Ngày tạo:</p>
                <span className="ml-2 font-bold text-gray-900">
                  {new Date(data.createdAt * 1000).toLocaleString()}
                </span>
              </div>
            )}

            {data.createdBy && (
              <div className="flex items-center">
                <UserOutlined className="text-teal-500 mr-2" />
                <p className="font-medium">Người tạo:</p>
                <span className="ml-2 font-bold text-gray-900">
                  {data.createdBy}
                </span>
              </div>
            )}

            {data.updatedAt && (
              <div className="flex items-center">
                <ClockCircleOutlined className="text-red-500 mr-2" />
                <p className="font-medium">Ngày cập nhật:</p>
                <span className="ml-2 font-bold text-gray-900">
                  {new Date(data.updatedAt * 1000).toLocaleString()}
                </span>
              </div>
            )}

            {data.updatedBy && (
              <div className="flex items-center">
                <UserOutlined className="text-indigo-500 mr-2" />
                <p className="font-medium">Người cập nhật:</p>
                <span className="ml-2 font-bold text-gray-900">
                  {data.updatedBy}
                </span>
              </div>
            )}

            {data.active && (
              <div className="flex items-center">
                <SyncOutlined className="text-orange-500 mr-2" />
                <p className="font-medium">Trạng thái:</p>
                <span className="ml-2 font-bold text-gray-900">
                  {data.active}
                </span>
              </div>
            )}

            {data.countDate && (
              <div className="flex items-center">
                <ClockCircleOutlined className="text-yellow-500 mr-2" />
                <p className="font-medium">Số ngày:</p>
                <span className="ml-2 font-bold text-gray-900">
                  {data.countDate} ngày
                </span>
              </div>
            )}
          </div>
        ),
        onOk() {},
      });
    } catch (error) {
      Modal.error({
        title: "Lỗi",
        content: "Không thể tải thông tin gói. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  const editPackage = (id) => {
    navigate(`/admin/edit-advertising-package/${id}`);
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

  const deletePackage = (record) => {
    const {id, advertisingName} = record
    Modal.confirm({
      title: "Xóa gói",
      content: `Bạn có chắc muốn xóa gói "${advertisingName}" này?`,
      onOk: async () => {
        try {
          await axiosInstance.put(`/advertising-package`, {
            ...record,
            active: 'INACTIVE'
          });
          message.success("Gói đã được xóa thành công!");
          fetchData();
        } catch (error) {
          message.error("Xóa gói thất bại. Vui lòng thử lại!");
        }
      },
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
