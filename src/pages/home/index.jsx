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
  Drawer
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
import SliderFilter from "../../components/SliderFilter";

const { Header, Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [paginationData, setPaginationData] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [filter, setFilter] = useState({
    tab: "all",
    sort: "newest",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const { getValues, control } = useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);

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
        const { content, ...paginationResponse } = response || {};
        setArticles(content);
        setPaginationData(paginationResponse);
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

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <Layout className="bg-[#f5f5f5] pt-5 homepage">
      <Content className="px-4 max-w-[1100px] w-full mx-auto">
        <Row gutter={30}>
          <PostAdsSlider />
        </Row>
        <Row gutter={30} className="py-3 w-full flex-1 justify-center">
          <Col span={16} className="bg-white" style={{ flex: "0 0 60%" }}>
            <Header
              style={{ background: "white", padding: 0 }}
              className="flex justify-between items-center"
            >
              <Button className="md:hidden" onClick={toggleDrawer}>
                Mở bộ lọc
              </Button>

              <Tabs
                className="mb-0"
                defaultActiveKey="all"
                onChange={handleTabChange}
              >
                <TabPane tab="Tất cả" key="all"></TabPane>
                <TabPane tab="Cho thuê" key="rent"></TabPane>
                <TabPane tab="Ở ghép" key="share"></TabPane>
              </Tabs>

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
              </div>
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
                  total={paginationData.totalElements}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            ) : (
              <p>No data</p>
            )}
          </Col>

          <Col span={6} className="bg-white p-4 hidden md:block" style={{ flex: "0 0 30%" }}>
            <span className="text-lg font-bold">Bộ lọc</span>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Khu vực</label>
              <Controller
                name="region"
                control={control}
                defaultValue="Hà Nội"
                render={({ field }) => (
                  <Select {...field} style={{ width: "100%" }}>
                    <Option value="Hà Nội">Hà Nội</Option>
                    <Option value="TP.HCM">TP.HCM</Option>
                  </Select>
                )}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                Loại hình
              </label>
              <Controller
                name="type"
                control={control}
                defaultValue="Cho thuê"
                render={({ field }) => (
                  <Select {...field} style={{ width: "100%" }}>
                    <Option value="Cho thuê">Cho thuê</Option>
                    <Option value="Ở ghép">Ở ghép</Option>
                  </Select>
                )}
              />
            </div>

            <div className="mt-4">
              <Controller
                name="priceRange"
                control={control}
                render={({ field }) => (
                  <SliderFilter
                    {...field}
                    label="Giá (VND)"
                    min={0}
                    max={10000000}
                    step={500000}
                    onChange={field.onChange}
                    value={field.value}
                    unit="VND"
                  />
                )}
              />
            </div>

            <div className="mt-4">
              <Controller
                name="areaRange"
                control={control}
                render={({ field }) => (
                  <SliderFilter
                    {...field}
                    label="Diện tích (m²)"
                    min={0}
                    max={100}
                    step={5}
                    onChange={field.onChange}
                    value={field.value}
                    unit="m²"
                  />
                )}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Nội thất</label>
              <Controller
                name="furniture"
                control={control}
                defaultValue="Có nội thất"
                render={({ field }) => (
                  <Select {...field} style={{ width: "100%" }}>
                    <Option value="Có nội thất">Có nội thất</Option>
                    <Option value="Không nội thất">Không nội thất</Option>
                  </Select>
                )}
              />
            </div>
          </Col>
        </Row>
      </Content>

      <Drawer
        title="Bộ lọc"
        placement="right"
        onClose={toggleDrawer}
        open={drawerVisible}
      >
        <Col span={16} className="bg-white" >
          <div className="">
            <label className="block text-sm font-medium mb-1">Khu vực</label>
            <Controller
              name="region"
              control={control}
              defaultValue="Hà Nội"
              render={({ field }) => (
                <Select {...field} style={{ width: "100%" }}>
                  <Option value="Hà Nội">Hà Nội</Option>
                  <Option value="TP.HCM">TP.HCM</Option>
                </Select>
              )}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Loại hình</label>
            <Controller
              name="type"
              control={control}
              defaultValue="Cho thuê"
              render={({ field }) => (
                <Select {...field} style={{ width: "100%" }}>
                  <Option value="Cho thuê">Cho thuê</Option>
                  <Option value="Ở ghép">Ở ghép</Option>
                </Select>
              )}
            />
          </div>

          <div className="mt-4">
            <Controller
              name="priceRange"
              control={control}
              render={({ field }) => (
                <SliderFilter
                  {...field}
                  label="Giá (VND)"
                  min={0}
                  max={10000000}
                  step={500000}
                  onChange={field.onChange}
                  value={field.value}
                  unit="VND"
                />
              )}
            />
          </div>

          <div className="mt-4">
            <Controller
              name="areaRange"
              control={control}
              render={({ field }) => (
                <SliderFilter
                  {...field}
                  label="Diện tích (m²)"
                  min={0}
                  max={100}
                  step={5}
                  onChange={field.onChange}
                  value={field.value}
                  unit="m²"
                />
              )}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Nội thất</label>
            <Controller
              name="furniture"
              control={control}
              defaultValue="Có nội thất"
              render={({ field }) => (
                <Select {...field} style={{ width: "100%" }}>
                  <Option value="Có nội thất">Có nội thất</Option>
                  <Option value="Không nội thất">Không nội thất</Option>
                </Select>
              )}
            />
          </div>
        </Col>
      </Drawer>
    </Layout>
  );
};

export default HomePage;
