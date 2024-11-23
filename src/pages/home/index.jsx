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
  Drawer,
  Skeleton,
  Avatar,
  Typography,
} from "antd";
import { getListPost } from "../../services/get-list-post";
import "../../styles/home.css";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { numberWithCommas } from "../../utiils/number-with-comma";
import { Controller, useForm } from "react-hook-form";
import PostAdsSlider from "../../components/PostAdsSlider";
import SliderFilter from "../../components/SliderFilter";
import baseAxios from "../../interceptor/baseAxios";
import moment from "moment";
import "./home.css";
import CardHorizontal from "../../components/CardItem/CardHorizontal";
import { statusRoomOptions } from "../../components/ConfigPost";

const { Header, Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;
const { Title } = Typography;

const HomePage = () => {
  const searchParam = useSearchParams();
  const location = useLocation();
  const [articles, setArticles] = useState([]);
  const [paginationData, setPaginationData] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
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
  const { control, watch, setValue } = useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const region = watch("region");
  const priceRange = watch("priceRange");
  const areaRange = watch("areaRange");
  const furniture = watch("furniture");
  const province = watch("province");
  const district = watch("district");
  const statusRoom = watch("statusRoom");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(location.search);
        const p = params.get("p");
        const response = await getListPost({
          page: pagination.current - 1,
          size: pagination.pageSize,
          type: filter.tab,
          key: p,
          statusRoom,
          fieldSort: filter.sort,
          ...(priceRange && {
            price: {
              from: priceRange[0],
              to: priceRange[1],
            },
          }),
          ...(areaRange && {
            acreage: {
              from: areaRange[0],
              to: areaRange[1],
            },
          }),
          ...(province && {
            province,
          }),
          ...(district && {
            district,
          }),
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
  }, [
    filter,
    pagination,
    region,
    areaRange,
    furniture,
    priceRange,
    province,
    district,
    statusRoom,
    location.search,
  ]);
  const selectedProvinceId = watch("province");
  useEffect(() => {
    if (selectedProvinceId) {
      const selectedProvince = provinces.find(
        (province) => province.name === selectedProvinceId
      );
      setDistricts(selectedProvince ? selectedProvince.district : []);
      setValue("district", undefined);
    }
  }, [selectedProvinceId, provinces, setValue]);
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await baseAxios.get("/province");
        setProvinces(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quận:", error);
      }
    };

    fetchDistricts();
  }, []);

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

  const handleAfterChange = (fieldName, value) => {
    setValue(fieldName, value);
  };

  return (
    <Layout className="bg-white pt-2 homepage">
      <Content className="w-full mx-auto mb-20 max-w-6xl px-5">
        <Row gutter={30}>
          <Title className="" level={3}>
            Phòng mới ưu đãi
          </Title>
          <PostAdsSlider />
        </Row>
        <Row
          gutter={30}
          className="py-3 px-3 max-w-6xl w-full flex-1 justify-between gap-x-4 mx-auto"
        >
          <Col span={16} className="bg-white">
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
                type="card"
              >
                <TabPane tab="Tất cả" key="all"></TabPane>
                <TabPane tab="Cho thuê" key="RENT"></TabPane>
                <TabPane tab="Ở ghép" key="GRAFT"></TabPane>
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
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <List.Item key={index}>
                    <Card className="product-card mb-5">
                      <Row gutter={10}>
                        <Col span={8} className="product-image-col">
                          <Skeleton.Image
                            style={{
                              width: "100%",
                              height: "100%",
                              minHeight: 90,
                            }}
                          />
                        </Col>
                        <Col span={16} className="product-info-col">
                          <Skeleton.Input
                            active
                            style={{
                              width: "80%",
                              height: 16,
                              marginBottom: 6,
                            }}
                          />
                          <Skeleton.Input
                            active
                            style={{
                              width: "60%",
                              height: 16,
                              marginBottom: 6,
                            }}
                          />
                          <Skeleton.Input
                            active
                            style={{
                              width: "70%",
                              height: 16,
                              marginBottom: 6,
                            }}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </List.Item>
                ))}
              </>
            ) : articles ? (
              <div>
                {viewMode === "list" ? (
                  <List
                    itemLayout="vertical"
                    dataSource={articles}
                    loading={loading}
                    renderItem={(item) => <CardHorizontal item={item} />}
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={paginationData.totalElements}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                  />
                </div>
              </div>
            ) : (
              <p>No data</p>
            )}
          </Col>
          <Col
            span={8}
            className="bg-white hidden md:block"
            style={{ flex: "0 0 30%" }}
          >
            <span className="text-lg font-bold">Bộ lọc</span>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                Tỉnh / Thành phố
              </label>
              <Controller
                name="province"
                control={control}
                className="w-full"
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Chọn tỉnh"
                    className="w-full"
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    {provinces.map((province) => (
                      <Select.Option key={province.name} value={province.name}>
                        {province.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Quận</label>
              <Controller
                name="district"
                control={control}
                className="w-full"
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Chọn quận"
                    disabled={!districts.length}
                    className="w-full"
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    {districts.map((district) => (
                      <Select.Option
                        key={district.id}
                        value={district.districtName}
                      >
                        {district.districtName}
                      </Select.Option>
                    ))}
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
                    onAfterChange={(value) =>
                      handleAfterChange("priceRange", value)
                    }
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
              <label className="block text-sm font-medium mb-1">
                Trạng thái phòng
              </label>
              <Controller
                name="statusRoom"
                control={control}
                className="w-full"
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Chọn trạng thái phòng"
                    className="w-full"
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    options={statusRoomOptions}
                  ></Select>
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
        <Col span={16} className="bg-white">
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
                  onAfterChange={(value) =>
                    handleAfterChange("priceRange", value)
                  }
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
        </Col>
      </Drawer>
    </Layout>
  );
};

export default HomePage;
