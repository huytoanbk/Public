import React, { useEffect, useState } from "react";
import {
  Table,
  Select,
  Tag,
  Pagination,
  Modal,
  Descriptions,
  Avatar,
  message,
  Input,
  Button,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import axiosInstance from "../../../interceptor";
import { getAvatar } from "../../../utiils/format-info-room";

const roleOptions = [
  { label: "User", value: "USER" },
  { label: "Admin", value: "ADMIN" },
];

const UserManagement = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [originalRoles, setOriginalRoles] = useState([]);
  const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { register, handleSubmit, watch, getValues, control } = useForm({
    defaultValues: { active: "", key: "" },
  });

  const activeFilter = watch("active");

  const fetchUsers = async (page = 1, size = 10) => {
    const searchValue = getValues("key");
    setLoading(true);
    try {
      const response = await axiosInstance.get("/users/all", {
        params: { key: searchValue, page: currentPage, size: pageSize },
      });
      setData(response.data.content || []);
      setTotal(response.data.totalElements || 0);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (userId, newStatus) => {
    try {
      await axiosInstance.post(`/users/update-status`, {
        userId,
        active: newStatus,
      });
      message.success("Cập nhật thông tin user thành công")
      fetchUsers();
    } catch (error) {
      message.error("Cập nhật thông tin user thất bại")
      console.error("Error updating status:", error);
    }
  };

  const fetchUserDetail = async (userId) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      setSelectedUser(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeFilter, currentPage, pageSize]);

  const handleRoleChange = (roles, record) => {
    setSelectedRoles(roles);
    setOriginalRoles(record.roles.map((role) => role.name));
    setCurrentUserId(record.id);
    setIsModalConfirmVisible(true);
  };

  const handleModalConfirm = async () => {
    try {
      await axiosInstance.post("/users/set-roles", {
        id: currentUserId,
        roles: selectedRoles,
      });
      fetchUsers();
      message.success("Cập nhật vai trò thành công!");
    } catch (error) {
      message.error("Cập nhật vai trò thất bại!");
      console.error("Error updating roles:", error);
    } finally {
      setIsModalConfirmVisible(false);
    }
  };

  const handleModalCancel = () => {
    setSelectedRoles(originalRoles);
    setIsModalConfirmVisible(false);
  };

  const columns = [
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (text, record) => (
        <Select
          defaultValue={record.active}
          style={{ width: 120 }}
          onClick={(e) => e.stopPropagation()}
          onChange={(value) => updateStatus(record.id, value)}
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
      ),
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (_, record) => (
        <Select
          mode="multiple"
          onClick={(e) => e.stopPropagation()}
          value={record.roles.map((role) => role.name)}
          onChange={(value) => handleRoleChange(value, record)}
          options={roleOptions}
          style={{ width: "100%" }}
        />
      ),
    },
  ];

  const handleRowClick = (record) => {
    fetchUserDetail(record.id);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit(fetchUsers)} className="flex mb-4 gap-4">
        <Controller
          name="key"
          control={control}
          render={({ field }) => (
            <Input
              style={{ width: 200 }}
              {...field}
              placeholder="Nhập tên user"
            />
          )}
        />
        <Button htmlType="submit">Tìm kiếm</Button>
      </form>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        loading={loading}
        pagination={false}
        scroll={{ x: 900 }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
      <div className="flex justify-end mt-4">
        <Pagination
          total={total}
          current={currentPage}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger
          onShowSizeChange={(current, size) => handlePageChange(current, size)}
        />
      </div>

      <Modal
        open={isModalVisible}
        title="User Details"
        onCancel={handleCloseModal}
        footer={null}
        width={800}
      >
        {selectedUser && (
          <div>
            <Avatar
              src={getAvatar(selectedUser.avatar)}
              size={80}
              className="mb-4"
            />
            <Descriptions column={1} bordered>
              <Descriptions.Item label="ID" labelStyle={{ width: "200px" }}>
                {selectedUser.id}
              </Descriptions.Item>
              <Descriptions.Item
                label="Full Name"
                labelStyle={{ width: "200px" }}
              >
                {selectedUser.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Email" labelStyle={{ width: "200px" }}>
                {selectedUser.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone" labelStyle={{ width: "200px" }}>
                {selectedUser.phone}
              </Descriptions.Item>
              <Descriptions.Item
                label="Địa chỉ"
                labelStyle={{ width: "200px" }}
              >
                {selectedUser?.address}
              </Descriptions.Item>
              <Descriptions.Item
                label="Nhận thông báo khi có bài viết mới"
                labelStyle={{ width: "200px" }}
              >
                {selectedUser?.notiStatus}
              </Descriptions.Item>
              <Descriptions.Item
                label="Thời hạn đăng bài"
                labelStyle={{ width: "200px" }}
              >
                {selectedUser?.rechargeVip}
              </Descriptions.Item>
              <Descriptions.Item
                label="Trạng thái"
                labelStyle={{ width: "200px" }}
              >
                {selectedUser.active}
              </Descriptions.Item>
              <Descriptions.Item label="Roles" labelStyle={{ width: "200px" }}>
                {selectedUser?.roles?.map((role) => (
                  <Tag key={role.id}>{role.name}</Tag>
                ))}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
      <Modal
        title="Xác nhận cập nhật Role"
        open={isModalConfirmVisible}
        onOk={handleModalConfirm}
        onCancel={handleModalCancel}
      >
        <p>Bạn có chắc chắn muốn Cập nhật role cho user này không?</p>
      </Modal>
    </div>
  );
};

export default UserManagement;
