import { useState } from "react";
import { Layout, Input, Button, Dropdown, Menu, Select, Row, Col } from "antd";
import { UserOutlined, PlusOutlined, MenuOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Logo from "../Icon/logo";

const { Header } = Layout;
const { Option } = Select;

const AppHeader = () => {
  const { clearUserInfo, userInfo } = useUser();
  const navigate = useNavigate();
  const { pathname = "" } = useLocation();
  const handleMenuClick = ({ key }) => {
    if(key === "my-account"){
      navigate('/profile')
    }
    if (key === "logout") {
      clearUserInfo();
    }
  };

  const accountMenu = (
    <Menu onClick={handleMenuClick}>
      {userInfo ? (
        <>
          <Menu.Item key="my-account">Tài khoản của tôi</Menu.Item>
          <Menu.Item key="saved">Tin đã lưu</Menu.Item>
          <Menu.Item key="logout">Đăng xuất</Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item key="login" onClick={() => navigate("/login")}>
            Đăng nhập
          </Menu.Item>
          <Menu.Item
            key="register"
            onClick={() => navigate("/login?is_register=true")}
          >
            Đăng ký
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  return (
    <Header
      style={{
        padding: "10px",
        height: "auto",
        backgroundColor: "#fff",
        borderBottom: "1px solid #ddd",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Row justify="space-between" align="middle" gutter={16}>
        <Col>
          <Link to={"/"}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold" }}
              className="h-[25px]"
            >
             <Logo />
            </div>
          </Link>
        </Col>
        {!pathname.includes("/login") && (
          <Col
            flex="auto"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Input.Search
              placeholder="Tìm kiếm..."
              style={{ maxWidth: 600 }}
              enterButton
            />
          </Col>
        )}

        {!pathname.includes("/login") && (
          <Col>
            <Button icon={<MenuOutlined />}>Quản lý tin</Button>
          </Col>
        )}

        <Col>
          <Dropdown overlay={accountMenu} trigger={["click"]}>
            <Button icon={<UserOutlined />}>
              {userInfo ? `Xin chào, ${userInfo?.fullName}` : "Tài khoản"}
            </Button>
          </Dropdown>
        </Col>
        {!pathname.includes("/login") && (
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ padding: "0 20px" }}
              onClick={() => navigate('/create-post')}
            >
              Đăng tin
            </Button>
          </Col>
        )}
      </Row>
      {pathname === "/" && (
        <Row
          justify="center"
          align="middle"
          style={{ marginTop: "10px", gap: "10px" }}
        >
          <span
            style={{ fontSize: "16px", fontWeight: "bold", lineHeight: "24px" }}
          >
            Bộ lọc:
          </span>
          <Select defaultValue="Hà Nội" style={{ width: 120 }}>
            <Option value="Hà Nội">Hà Nội</Option>
            <Option value="TP.HCM">TP.HCM</Option>
          </Select>

          <Select defaultValue="Cho thuê" style={{ width: 120 }}>
            <Option value="Cho thuê">Cho thuê</Option>
            <Option value="Ở ghép">Ở ghép</Option>
          </Select>

          <Select defaultValue="1 triệu đ" style={{ width: 120 }}>
            <Option value="1 triệu đ">1 triệu đ</Option>
            <Option value="2 triệu đ">2 triệu đ</Option>
          </Select>

          <Select defaultValue="Diện tích" style={{ width: 120 }}>
            <Option value="20m²">20m²</Option>
            <Option value="30m²">30m²</Option>
          </Select>

          <Select defaultValue="Nội thất" style={{ width: 120 }}>
            <Option value="Có nội thất">Có nội thất</Option>
            <Option value="Không nội thất">Không nội thất</Option>
          </Select>
        </Row>
      )}
    </Header>
  );
};

export default AppHeader;
