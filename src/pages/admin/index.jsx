import React, { useRef } from "react";
import { Layout, Menu, Dropdown, Button, Avatar } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, Link, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const navItems = [
  {
    key: "/",
    label: "Tổng quát",
    path: "/admin",
  },
  {
    key: "/admin/post-management",
    label: "Quản lý lịch sử tin đã đăng",
    path: "/admin/post-management",
  },
  {
    key: "/admin/ads-management",
    label: "Quản lý quảng cáo",
    path: "/admin/ads-management",
  },
  {
    key: "/admin/user-management",
    label: "Quản lý user",
    path: "/admin/user-management",
  },
];

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const siderRef = useRef(null);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        icon={<UserOutlined />}
        onClick={() => navigate("/admin/profile")}
      >
        User Profile
      </Menu.Item>
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider ref={siderRef} trigger={null} collapsible collapsed={collapsed}>
        <div
          className="logo"
          style={{ color: "white", textAlign: "center", padding: "16px" }}
        >
          Admin
        </div>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {navItems.map((item) => (
            <li key={item.key}>
              <Link
                to={item.path}
                style={{
                  display: "block",
                  padding: "10px 16px",
                  backgroundColor:
                    location.pathname === item.path ? "#e6f7ff" : "transparent",
                  color: location.pathname === item.path ? "#1890ff" : "#fff",
                  borderRadius: "4px",
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingRight: "20px",
          }}
        >
          <Dropdown overlay={menu} placement="bottomRight">
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Avatar icon={<UserOutlined />} />
              <span style={{ marginLeft: "10px" }}>Admin</span>
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            backgroundColor: "#fff",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
