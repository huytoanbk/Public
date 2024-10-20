import { useState } from "react";
import { Layout, Input, Button, Dropdown, Menu, Select, Row, Col } from "antd";
import { UserOutlined, PlusOutlined, MenuOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
// import { useForm, useController } from "react-hook-form";

const { Header } = Layout;
const { Option } = Select;

const AppHeader = () => {
  const { clearUserInfo, userInfo } = useUser();
  const navigate = useNavigate();
  const { pathname = "" } = useLocation();
  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      clearUserInfo();
    }
  };

  const accountMenu = (
    <Menu onClick={handleMenuClick}>
      {userInfo ? (
        <>
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
              <svg
                data-layer-type="text"
                x="206.5"
                y="233.52999954223634"
                viewBox="4.699999809265137 4.699999809265137 219.8398895263672 47.939998626708984"
                height="47.939998626708984"
                width="219.8398895263672"
                className="h-full"
              >
                <g
                  data-horizontal-grow="left"
                  data-vertical-center="false"
                  // style="fill: rgb(15, 21, 48); font-size: 47px; font-weight: 600; font-style: normal; font-family: Comfortaa; dominant-baseline: hanging; text-transform: none; fill-opacity: 1;"
                >
                  <path
                    d="M6.91 41.41L6.91 41.41Q5.97 41.41 5.33 40.77Q4.70 40.14 4.70 39.20L4.70 39.20L4.70 6.91Q4.70 5.92 5.33 5.31Q5.97 4.70 6.91 4.70L6.91 4.70Q8.22 4.70 8.88 5.88L8.88 5.88L24.02 36.10L22.47 36.10L37.27 5.88Q37.98 4.70 39.24 4.70L39.24 4.70Q40.19 4.70 40.82 5.31Q41.45 5.92 41.45 6.91L41.45 6.91L41.45 39.20Q41.45 40.14 40.80 40.77Q40.14 41.41 39.24 41.41L39.24 41.41Q38.30 41.41 37.67 40.77Q37.04 40.14 37.04 39.20L37.04 39.20L37.04 12.88L37.88 12.78L25.00 39.10Q24.30 40.23 23.08 40.23L23.08 40.23Q21.67 40.23 21.06 38.87L21.06 38.87L8.18 13.11L9.12 12.88L9.12 39.20Q9.12 40.14 8.48 40.77Q7.85 41.41 6.91 41.41ZM62.04 41.60L62.04 41.60Q58.28 41.60 55.34 39.93Q52.41 38.26 50.74 35.32Q49.07 32.38 49.07 28.58L49.07 28.58Q49.07 24.72 50.74 21.78Q52.41 18.85 55.34 17.18Q58.28 15.51 62.04 15.51L62.04 15.51Q65.80 15.51 68.74 17.18Q71.68 18.85 73.34 21.78Q75.01 24.72 75.06 28.58L75.06 28.58Q75.06 32.38 73.37 35.32Q71.68 38.26 68.76 39.93Q65.85 41.60 62.04 41.60ZM62.04 37.74L62.04 37.74Q64.63 37.74 66.60 36.57Q68.57 35.39 69.70 33.32Q70.83 31.26 70.83 28.58L70.83 28.58Q70.83 25.90 69.70 23.81Q68.57 21.71 66.60 20.54Q64.63 19.36 62.04 19.36L62.04 19.36Q59.50 19.36 57.50 20.54Q55.51 21.71 54.38 23.81Q53.25 25.90 53.25 28.58L53.25 28.58Q53.25 31.26 54.38 33.32Q55.51 35.39 57.50 36.57Q59.50 37.74 62.04 37.74ZM92.68 41.41L91.79 41.41Q89.39 41.41 87.47 40.21Q85.54 39.01 84.46 36.97Q83.38 34.92 83.38 32.29L83.38 32.29L83.38 9.68Q83.38 8.74 83.97 8.13Q84.55 7.52 85.49 7.52L85.49 7.52Q86.43 7.52 87.04 8.13Q87.66 8.74 87.66 9.68L87.66 9.68L87.66 32.29Q87.66 34.40 88.83 35.77Q90.00 37.13 91.79 37.13L91.79 37.13L93.25 37.13Q94.05 37.13 94.59 37.74Q95.13 38.35 95.13 39.29L95.13 39.29Q95.13 40.23 94.45 40.82Q93.77 41.41 92.68 41.41L92.68 41.41ZM92.17 20.35L80.84 20.35Q79.99 20.35 79.43 19.83Q78.87 19.32 78.87 18.52L78.87 18.52Q78.87 17.67 79.43 17.16Q79.99 16.64 80.84 16.64L80.84 16.64L92.17 16.64Q93.01 16.64 93.58 17.16Q94.14 17.67 94.14 18.52L94.14 18.52Q94.14 19.32 93.58 19.83Q93.01 20.35 92.17 20.35L92.17 20.35ZM112.94 41.60L112.94 41.60Q109.04 41.60 106.06 39.93Q103.07 38.26 101.38 35.32Q99.69 32.38 99.69 28.58L99.69 28.58Q99.69 24.72 101.28 21.78Q102.88 18.85 105.70 17.18Q108.52 15.51 112.24 15.51L112.24 15.51Q115.85 15.51 118.49 17.13Q121.12 18.75 122.53 21.60Q123.94 24.44 123.94 28.15L123.94 28.15Q123.94 28.95 123.40 29.49Q122.86 30.03 121.97 30.03L121.97 30.03L102.65 30.03L102.65 26.56L122.01 26.56L120.08 27.92Q120.04 25.43 119.10 23.45Q118.16 21.48 116.42 20.35Q114.68 19.22 112.24 19.22L112.24 19.22Q109.56 19.22 107.61 20.45Q105.66 21.67 104.62 23.78Q103.59 25.90 103.59 28.58L103.59 28.58Q103.59 31.26 104.79 33.35Q105.98 35.44 108.08 36.66Q110.17 37.88 112.94 37.88L112.94 37.88Q114.44 37.88 116.07 37.32Q117.69 36.75 118.63 36.00L118.63 36.00Q119.29 35.49 120.04 35.46Q120.79 35.44 121.35 35.91L121.35 35.91Q122.06 36.57 122.11 37.34Q122.15 38.12 121.45 38.68L121.45 38.68Q119.85 39.95 117.48 40.77Q115.10 41.60 112.94 41.60ZM136.25 41.41L135.92 41.41Q133.95 41.41 132.40 40.33Q130.85 39.25 129.98 37.34Q129.11 35.44 129.11 32.95L129.11 32.95L129.11 6.82Q129.11 5.88 129.70 5.29Q130.28 4.70 131.22 4.70L131.22 4.70Q132.21 4.70 132.80 5.29Q133.39 5.88 133.39 6.82L133.39 6.82L133.39 32.95Q133.39 34.78 134.11 35.96Q134.84 37.13 135.92 37.13L135.92 37.13L137.10 37.13Q137.99 37.13 138.51 37.72Q139.03 38.31 139.03 39.29L139.03 39.29Q139.03 40.23 138.25 40.82Q137.47 41.41 136.25 41.41L136.25 41.41ZM152.89 41.88L152.89 41.88Q149.65 41.88 147.11 40.44Q144.57 39.01 143.14 36.47Q141.70 33.93 141.70 30.69L141.70 30.69Q141.70 29.75 142.34 29.12Q142.97 28.48 143.91 28.48L143.91 28.48Q144.90 28.48 145.51 29.12Q146.12 29.75 146.12 30.69L146.12 30.69Q146.12 32.76 147.02 34.38Q147.91 36.00 149.44 36.92Q150.96 37.84 152.89 37.84L152.89 37.84Q154.86 37.84 156.39 36.90Q157.92 35.96 158.79 34.36Q159.66 32.76 159.66 30.69L159.66 30.69L159.66 6.91Q159.66 5.92 160.29 5.31Q160.93 4.70 161.87 4.70L161.87 4.70Q162.81 4.70 163.44 5.31Q164.08 5.92 164.08 6.91L164.08 6.91L164.08 30.69Q164.08 33.93 162.62 36.47Q161.16 39.01 158.65 40.44Q156.13 41.88 152.89 41.88ZM184.66 41.60L184.66 41.60Q180.90 41.60 177.97 39.93Q175.03 38.26 173.36 35.32Q171.69 32.38 171.69 28.58L171.69 28.58Q171.69 24.72 173.36 21.78Q175.03 18.85 177.97 17.18Q180.90 15.51 184.66 15.51L184.66 15.51Q188.42 15.51 191.36 17.18Q194.30 18.85 195.97 21.78Q197.63 24.72 197.68 28.58L197.68 28.58Q197.68 32.38 195.99 35.32Q194.30 38.26 191.38 39.93Q188.47 41.60 184.66 41.60ZM184.66 37.74L184.66 37.74Q187.25 37.74 189.22 36.57Q191.20 35.39 192.32 33.32Q193.45 31.26 193.45 28.58L193.45 28.58Q193.45 25.90 192.32 23.81Q191.20 21.71 189.22 20.54Q187.25 19.36 184.66 19.36L184.66 19.36Q182.13 19.36 180.13 20.54Q178.13 21.71 177.00 23.81Q175.87 25.90 175.87 28.58L175.87 28.58Q175.87 31.26 177.00 33.32Q178.13 35.39 180.13 36.57Q182.13 37.74 184.66 37.74ZM207.88 52.64L207.88 52.64Q207.46 52.64 206.89 52.41L206.89 52.41Q205.01 51.56 205.86 49.73L205.86 49.73L220.52 16.92Q221.37 15.13 223.20 15.89L223.20 15.89Q225.13 16.69 224.28 18.57L224.28 18.57L209.57 51.32Q209.01 52.64 207.88 52.64ZM213.33 40.47L213.33 40.47Q212.49 40.84 211.78 40.56Q211.08 40.28 210.65 39.48L210.65 39.48L199.98 18.52Q199.56 17.72 199.87 16.97Q200.17 16.22 201.02 15.89L201.02 15.89Q201.82 15.51 202.55 15.77Q203.27 16.03 203.65 16.87L203.65 16.87L213.94 37.79Q214.41 38.63 214.27 39.36Q214.13 40.09 213.33 40.47Z"
                    transform="translate(0, 0)"
                  ></path>
                </g>
              </svg>
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
