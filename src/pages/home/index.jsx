import { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Tabs,
  Select,
  Button,
  Card,
  Collapse,
  List,
  Pagination,
  Spin,
  Form,
} from "antd";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { getListPost } from "../../services/get-list-post";
import "../../styles/home.css";
import { Link } from "react-router-dom";
import { numberWithCommas } from "../../utiils/number-with-comma";
import { Controller, useForm } from "react-hook-form";
import PostAdsSlider from "../../components/PostAdsSlider";

const { Header, Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [filter, setFilter] = useState({
    tab: "all",
    sort: "newest",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 9,
  });
  const [loading, setLoading] = useState(false);
  const { getValues, control } = useForm();
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await getListPost({
          page: pagination.current - 1,
          size: pagination.pageSize,
          tab: filter.tab,
          sort: filter.sort,
        });
        setArticles(response.content);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching articles:", error);
      }
    };
    fetchArticles();
  }, [filter, pagination]);

  const handleTabChange = (key) => {
    setFilter({ ...filter, tab: key });
  };

  const handleSortChange = (value) => {
    setFilter({ ...filter, sort: value });
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "grid" : "list");
  };

  const handlePageChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  return (
    <Layout className="bg-[#f5f5f5] pt-5 homepage">
      <Content className="px-4 max-w-[1100px] w-full mx-auto ">
        <Row gutter={16} >
          <PostAdsSlider />
        </Row>
        <Row gutter={16} className="py-3 w-full flex-1">
          <Col span={16} className="bg-white">
            {/* <div> */}
            <Header style={{ background: "white", padding: 0 }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Tabs
                    className="mb-0"
                    defaultActiveKey="all"
                    onChange={handleTabChange}
                  >
                    <TabPane tab="Tất cả" key="all"></TabPane>
                    <TabPane tab="Cho thuê" key="rent"></TabPane>
                    <TabPane tab="Ở ghép" key="share"></TabPane>
                  </Tabs>
                </Col>

                <Col>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Select
                      defaultValue="newest"
                      style={{ width: 150 }}
                      onChange={handleSortChange}
                    >
                      <Option value="newest">Tin mới trước</Option>
                      <Option value="priceLow">Giá thấp trước</Option>
                      <Option value="priceHigh">Giá cao trước</Option>
                    </Select>
                    {/* <Button onClick={toggleViewMode}>
                        {viewMode === "list" ? (
                          <AppstoreOutlined />
                        ) : (
                          <UnorderedListOutlined />
                        )}
                      </Button> */}
                  </div>
                </Col>
              </Row>
            </Header>

            {loading ? (
              <Spin size="large" />
            ) : articles ? (
              <div>
                {viewMode === "list" ? (
                  <List
                    itemLayout="vertical"
                    dataSource={articles}
                    renderItem={(item) => (
                      <List.Item>
                        <Card className="product-card">
                          <Row gutter={10}>
                            <Col span={8} className="product-image-col">
                              <img
                                src={item.images[0]}
                                alt={item.title}
                                className="product-image"
                              />
                            </Col>

                            <Col span={16} className="product-info-col">
                              <Link to={`/product/${item.id}`}>
                                <h3 className="product-title">{item.title}</h3>
                              </Link>

                              <p className="product-price">
                                {numberWithCommas(item.price)} triệu/tháng{" "}
                                <span className="dot">·</span>{" "}
                                {numberWithCommas(item.acreage)} m²
                              </p>

                              <p className="product-location">
                                {item.district} <span className="dot">·</span>{" "}
                                {new Date(item.createdAt).toLocaleDateString()}
                              </p>

                              <div className="product-owner">
                                {item.ownerInfo}
                              </div>
                            </Col>
                          </Row>
                        </Card>
                      </List.Item>
                    )}
                    pagination={false}
                  />
                ) : (
                  <Row gutter={[16, 16]}>
                    {articles.map((article) => (
                      <Col span={8} key={article.id}>
                        <Card title={article.title}>{article.content}</Card>
                      </Col>
                    ))}
                  </Row>
                )}
                <Pagination
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={articles.length}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            ) : (
              <p>No data</p>
            )}
            {/* </div> */}
          </Col>

          <Col span={6} className="bg-white">
            <Collapse accordion>
              <Panel header="Lọc theo khoảng giá" key="1">
                <Form.Item>
                  <Controller
                    name="price"
                    control={control}
                    render={(field) => (
                      <Select
                        defaultValue="under1m"
                        style={{ width: "100%" }}
                        onChange={() => {
                          console.log("getValues", getValues("header-search"));
                        }}
                        {...field}
                      >
                        <Option value="under1m">Giá dưới 1 triệu</Option>
                        <Option value="1to2m">Giá 1 - 2 triệu</Option>
                        <Option value="2to3m">Giá 2 - 3 triệu</Option>
                        <Option value="3to5m">Giá 3 - 5 triệu</Option>
                        <Option value="5to7m">Giá 5 - 7 triệu</Option>
                        <Option value="above7m">Giá trên 7 triệu</Option>
                      </Select>
                    )}
                  />
                </Form.Item>
              </Panel>

              <Panel header="Lọc theo diện tích" key="2">
                <Select defaultValue="under20sqm" style={{ width: "100%" }}>
                  <Option value="under20sqm">Dưới 20 m²</Option>
                  <Option value="20to30sqm">20 - 30 m²</Option>
                  <Option value="30to40sqm">30 - 40 m²</Option>
                  <Option value="40to50sqm">40 - 50 m²</Option>
                  <Option value="above50sqm">Trên 50 m²</Option>
                </Select>
              </Panel>

              <Panel header="Lọc theo tình trạng nội thất" key="3">
                <Select defaultValue="fullFurnished" style={{ width: "100%" }}>
                  <Option value="premiumFurnished">Nội thất cao cấp</Option>
                  <Option value="fullFurnished">Nội thất đầy đủ</Option>
                  <Option value="empty">Nhà trống</Option>
                </Select>
              </Panel>

              <Panel header="Lọc theo quận" key="4">
                <Select defaultValue="baDinh" style={{ width: "100%" }}>
                  <Option value="baDinh">Quận Ba Đình</Option>
                  <Option value="bacTuLiem">Quận Bắc Từ Liêm</Option>
                  <Option value="cauGiay">Quận Cầu Giấy</Option>
                  <Option value="dongDa">Quận Đống Đa</Option>
                  <Option value="haDong">Quận Hà Đông</Option>
                  <Option value="haiBaTrung">Quận Hai Bà Trưng</Option>
                </Select>
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default HomePage;
