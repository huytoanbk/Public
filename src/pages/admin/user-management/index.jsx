import React, { useEffect, useState } from 'react';
import { Table, Select, Tag, Pagination } from 'antd';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const UserManagement = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch } = useForm({ defaultValues: { active: '' } });
  const activeFilter = watch('active');

  const fetchUsers = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const response = {data: {
        "content": [
          {
            "id": 1,
            "fullName": "John Doe",
            "email": "johndoe@example.com",
            "phone": "123456789",
            "active": "active",
            "roles": [
              {
                "id": 1,
                "name": "Admin",
                "createdAt": "2024-10-27T09:07:34.171Z",
                "updatedAt": "2024-10-27T09:07:34.171Z",
                "active": "active"
              },
              {
                "id": 2,
                "name": "User",
                "createdAt": "2024-10-27T09:07:34.171Z",
                "updatedAt": "2024-10-27T09:07:34.171Z",
                "active": "active"
              }
            ]
          },
          {
            "id": 2,
            "fullName": "Jane Smith",
            "email": "janesmith@example.com",
            "phone": "987654321",
            "active": "inactive",
            "roles": [
              {
                "id": 2,
                "name": "User",
                "createdAt": "2024-10-27T09:07:34.171Z",
                "updatedAt": "2024-10-27T09:07:34.171Z",
                "active": "active"
              }
            ]
          }
        ],
        "totalElements": 2,
        "totalPages": 1,
        "size": 10,
        "number": 0,
        "first": true,
        "last": true,
        "numberOfElements": 2
      }}
      
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
      await axios.put(`http://localhost:8888/api/v1/users/${userId}/status`, { active: newStatus });
      fetchUsers();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeFilter]);

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (text, record) => (
        <Select
          defaultValue={record.active}
          style={{ width: 120 }}
          onChange={(value) => updateStatus(record.id, value)}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />
      ),
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (
        <>
          {roles.map((role) => (
            <Tag color="blue" key={role.id}>
              {role.name}
            </Tag>
          ))}
        </>
      ),
    },
  ];

  const handlePageChange = (page, pageSize) => {
    fetchUsers(page, pageSize);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <form onChange={handleSubmit(fetchUsers)} className="flex mb-4 gap-4">
        <Select
          placeholder="Filter by Status"
          style={{ width: 200 }}
          {...register('active')}
          options={[
            { value: '', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />
      </form>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        loading={loading}
        pagination={false}
      />
      <div className="flex justify-end mt-4">
        <Pagination
          total={total}
          onChange={handlePageChange}
          pageSize={10}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default UserManagement;
