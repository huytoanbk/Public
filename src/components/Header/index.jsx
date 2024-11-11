import { useEffect, useState } from "react";
import {
  Layout,
  Input,
  Button,
  Dropdown,
  Menu,
  Select,
  Row,
  Col,
  Switch,
  notification,
} from "antd";
import { UserOutlined, PlusOutlined, MenuOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Logo from "../Icon/logo";
import baseAxios from "../../interceptor/baseAxios";
import axiosInstance from "../../interceptor";

const { Header } = Layout;
const { Option } = Select;

const AppHeader = () => {
  const { clearUserInfo, userInfo } = useUser();
  const [notiStatus, setNotiStatus] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname = "" } = location;
  const handleMenuClick = ({ key }) => {
    if (key === "my-account") {
      navigate("/profile");
    }
    if (key === "logout") {
      clearUserInfo();
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    }
    if(key === "my-post") {
      navigate("/my-post")
    }
  };

  const onSearch = (value) => {
    navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  const onChangeHandle = (e) => {
    const value = e.target.value;
    const params = new URLSearchParams(location.search);

    if (value) {
      params.set("p", value);
    } else {
      params.delete("p");
    }

    navigate({ search: params.toString() }, { replace: true });
  };

  const toggleNotiStatus = async (checked) => {
    const status = checked ? "ACTIVE" : "INACTIVE";
    try {
      await axiosInstance.post(`/users/change-noti?notiStatus=${status}`);
      setNotiStatus(checked);
      notification.success({
        message: `Đã ${
          checked ? "bật" : "tắt"
        } tính năng gửi mail tự động thành công`,
        description: "Khi có bài viết mới, email sẽ tự động gửi đến bạn",
      });
    } catch (error) {
      const messageDisplay =
        error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau";
      notification.error({
        message: "Cập nhật tính năng gửi mail tự động thất bại",
        description: messageDisplay,
      });
      console.error("Error updating notification status:", error);
    }
  };

  useEffect(() => {
    if(userInfo) {
      const { notiStatus = null } = userInfo;
      if (notiStatus === "ACTIVE") {
        setNotiStatus(true);
      } else {
        setNotiStatus(false);
      }
    }
  }, [userInfo]);

  const accountMenu = (
    <Menu onClick={handleMenuClick}>
      {userInfo ? (
        <>
          <Menu.Item key="my-account">Tài khoản của tôi</Menu.Item>
          <Menu.Item key="turn-on-noti">
            Nhận mail khi có bài viết mới{" "}
            <Switch
              checked={notiStatus}
              onChange={toggleNotiStatus}
              style={{ marginLeft: 8 }}
            />
          </Menu.Item>
          <Menu.Item key="saved">Tin đã lưu</Menu.Item>
          <Menu.Item key="my-post">Bài viết của tôi</Menu.Item>
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
              onSearch={onSearch}
              onChange={onChangeHandle}
            />
          </Col>
        )}
        {/* {!pathname.includes("/login") && (
          <Col>
            <Button icon={<MenuOutlined />}>Quản lý tin</Button>
          </Col>
        )} */}

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
              onClick={() => navigate("/create-post")}
            >
              Đăng tin
            </Button>
          </Col>
        )}
      </Row>
    </Header>
  );
};

export default AppHeader;
