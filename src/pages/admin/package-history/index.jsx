import React, { useState, useEffect } from "react";
import { Table, Tag, Tooltip, message } from "antd";
import axiosInstance from "../../../interceptor";

export default function PackageHistory() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 30,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [totalAmount, settotalAmount] = useState(false);

  useEffect(() => {
    fetchPackageHistory(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const fetchPackageHistory = async (page, size) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/advertising-package/pay-ad?page=${page - 1}&size=${size}`
      );
      const { content, totalElements, totalAmount } = response.data;
      settotalAmount(totalAmount);
      setData(content);
      setPagination((prev) => ({
        ...prev,
        total: totalElements,
      }));
    } catch (error) {
      message.error("Không thể tải dữ liệu!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination((prev) => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };

  const renderWithTooltip = (text) => (
    <Tooltip title={text}>
      <div
        style={{
          maxWidth: 200,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {text}
      </div>
    </Tooltip>
  );

  const columns = [
    {
      title: "ID Order",
      dataIndex: "id",
      key: "id",
      render: renderWithTooltip,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: renderWithTooltip,
    },
    // {
    //   title: "ID Người dùng",
    //   dataIndex: "userId",
    //   key: "userId",
    //   render: renderWithTooltip,
    // },
    {
      title: "Gói hội viên",
      dataIndex: "advertisingPackageName",
      key: "advertisingPackageName",
      render: renderWithTooltip,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      render: (price) => renderWithTooltip(`${price.toLocaleString()} VNĐ`),
    },
    {
      title: "Loại gói",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === 0 ? "blue-inverse" : "magenta"}>
        {type === 0  ? "Hiển thị" : "Lượt đăng"}
      </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "green" : "red"}>
          {status === "ACTIVE" ? "Đang hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Ngày mua",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        renderWithTooltip(new Date(date * 1000).toLocaleString("vi-VN")),
    },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold mb-4">Lịch sử mua gói hội viên</h2>
        <div className="text-base">
          <span>Tổng doanh thu: <b className="font-bold">{totalAmount?.toLocaleString()}</b></span>
        </div>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 900 }}
      />
    </div>
  );
}
