import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  DatePicker,
  message as messageAntd,
  Row,
  Col,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import axiosInstance from "../../interceptor";
import LocationPicker from "../../components/LocationPicker";
import { useNavigate } from "react-router-dom";
import Title from "antd/es/typography/Title";
import "./post-room.css";
import ModalPackages from "../ModalPackages";

const schema = z.object({
  title: z
    .string({ required_error: "Vui lòng nhập tiêu đề" })
    .min(1, { message: "Tiêu đề phải có ít nhất 1 ký tự" }),
  content: z
    .string({ required_error: "Vui lòng nhập nội dung" })
    .min(1, { message: "Vui lòng nhập nội dung" }),
  price: z
    .number({ required_error: "Vui lòng nhập giá" })
    .positive({ message: "Giá phải lớn hơn 0" }),
  deposit: z
    .number({ required_error: "Vui lòng nhập số tiền đặt cọc" })
    .positive({ message: "Đặt cọc phải lớn hơn 0" }),
  address: z
    .string({ required_error: "Vui lòng nhập địa chỉ" })
    .min(1, { message: "Vui lòng nhập địa chỉ" }),
  acreage: z
    .number({ required_error: "Vui lòng nhập diện tích" })
    .positive({ message: "Diện tích phải lớn hơn 0" }),
  contact: z
    .string({ required_error: "Vui lòng nhập số điện thoại liên hệ" })
    .regex(/^0\d{9}$/, {
      message:
        "Số điện thoại không hợp lệ. Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số.",
    }),
  type: z
    .string({ required_error: "Vui lòng chọn loại phòng" })
    .min(1, { message: "Vui lòng chọn loại phòng" }),
  statusRoom: z
    .string({ required_error: "Vui lòng chọn trạng thái phòng" })
    .min(1, { message: "Vui lòng chọn trạng thái phòng" }),
  province: z
    .string({ required_error: "Vui lòng chọn tỉnh" })
    .min(1, { message: "Vui lòng chọn tỉnh" }),
  district: z
    .string({ required_error: "Vui lòng chọn quận" })
    .min(1, { message: "Vui lòng chọn quận" }),
  images: z
    .array(z.string(), { required_error: "Vui lòng tải lên hình ảnh" })
    .min(1, { message: "Vui lòng tải lên hình ảnh" }),
});

export const statusRoomOptions = [
  { value: "EMPTY", label: "Nhà trống" },
  { value: "FULLY_FURNISHED", label: "Nội thất đầy đủ" },
  { value: "LUXURY_FURNITURE", label: "Nội thất cao cấp" },
];

export const roomTypeOtions = [
  {
    label: "Cho thuê",
    value: "RENT",
  },
  {
    label: "Ở ghép",
    value: "GRAFT",
  },
];

export const roomActiveOtions = [
  {
    label: "Đang chờ duyệt",
    value: "PENDING",
  },
  {
    label: "Ngừng hoạt động",
    value: "INACTIVE",
  },
];

const ConfigPost = ({ initData = null, isEdit = false }) => {
  const [isShowModalPackages, setIsShowModalPackages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [location, setLocation] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const navigate = useNavigate();
  const initLocation =
    initData?.longitude && initData?.latitude
      ? [initData.latitude, initData.longitude]
      : [21.0283334, 105.854041];

  const isSelectActive =
    initData?.status === "PENDING" || initData?.status === "REJECT";
  const {
    handleSubmit,
    control,
    watch,
    clearErrors,
    setError,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    shouldFocusError: false,
    resolver: zodResolver(schema),
    defaultValues: initData
      ? {
          ...initData,
          district: initData ? initData.district : "",
          address: initData.address.split(
            `, ${initData.district}, ${initData.province}`
          )[0],
          content: initData.content,
        }
      : {},
  });

  const handleUploadChange = async (info) => {
    const uploadedUrls = info.fileList
      .filter((file) => file.status === "done")
      .map((file) => file.response || file.thumbUrl);
    setFileList(info.fileList);
    setValue("images", uploadedUrls);
  };

  const handleLocationSelect = (coordinates) => {
    setLocation(coordinates);
  };

  const onError = (errors) => {
    const errorMessages = Object.values(errors).map((error) => error.message);
    message.error(
      <ul>
        {errorMessages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    );
  };

  const onSubmit = async (data) => {
    const payload = {
      title: data.title,
      content: data.content,
      price: data.price,
      deposit: data.deposit,
      address: `${data.address}, ${data.district}, ${data.province}`,
      acreage: data.acreage,
      statusRoom: data.statusRoom,
      contact: data.contact,
      province: data.province,
      district: data.district,
      images: data.images,
      type: data.type,
      ...(location && { latitude: location[0], longitude: location[1] }),
      ...(isEdit && { postId: initData.id }),
      ...(isEdit && { active: initData.active }),
    };
    try {
      setLoading(true);
      if (isEdit) {
        await axiosInstance.put("/posts/update", payload);
        messageAntd.success("Cập nhật bài viết thành công!");
      } else {
        await axiosInstance.post("/posts", payload);
        messageAntd.success("Tạo bài viết thành công!");
      }
      navigate("/my-post");
    } catch (error) {
      const { errorMessage = "Có lỗi xảy ra", errorCode = "" } = error;
      if (errorCode === "USER_NOT_RECHARGE_VIP") {
        messageAntd.error(
          "Bạn chưa mua gói thành viên, vui lòng mua để đăng tin"
        );
        setIsShowModalPackages(true);
        return;
      }
      messageAntd.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axiosInstance.get("/province");
        setProvinces(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quận:", error);
      }
    };

    fetchDistricts();
  }, []);

  const selectedProvinceId = watch("province");
  useEffect(() => {
    if (selectedProvinceId) {
      const selectedProvince = provinces.find(
        (province) => province.name === selectedProvinceId
      );
      setDistricts(selectedProvince ? selectedProvince.district : []);
      setValue("district", isEdit ? initData.district : undefined);
    }
  }, [selectedProvinceId, provinces, setValue]);

  useEffect(() => {
    if (isEdit) {
      if (initData?.images) {
        const formattedFiles = initData.images.map((url, index) => ({
          uid: index.toString(),
          name: `Image ${index + 1}`,
          status: "done",
          url,
        }));
        setFileList(formattedFiles);
      }
    }
  }, [initData, isEdit]);

  return (
    <div
      className="container mx-auto pt-3 pb-8 px-5"
      style={{ maxWidth: 1000 }}
    >
      <Title level={4} className="!mb-7">
        Đăng tin cho thuê phòng/ ở ghép
      </Title>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit, onError)}>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Tiêu đề"
              validateStatus={errors.title ? "error" : ""}
              help={errors.title?.message}
            >
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Nhập tiêu đề" />
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Giá"
              validateStatus={errors.price ? "error" : ""}
              help={errors.price?.message}
            >
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập giá"
                    onChange={(event) => {
                      const parseValue = Number(event.target.value)
                        ? Number(event.target.value)
                        : 0;
                      field.onChange(parseValue);
                    }}
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={isEdit ? 8 : 12}>
            <Form.Item
              label="Đặt cọc"
              validateStatus={errors.deposit ? "error" : ""}
              help={errors.deposit?.message}
            >
              <Controller
                name="deposit"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập số tiền đặt cọc"
                    onChange={(event) => {
                      const parseValue = Number(event.target.value)
                        ? Number(event.target.value)
                        : 0;
                      field.onChange(parseValue);
                    }}
                  />
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={isEdit ? 8 : 12}>
            <Form.Item
              label="Diện tích"
              validateStatus={errors.acreage ? "error" : ""}
              help={errors.acreage?.message}
            >
              <Controller
                name="acreage"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    {...field}
                    placeholder="Nhập diện tích (m²)"
                    onChange={(event) => {
                      const parseValue = Number(event.target.value)
                        ? Number(event.target.value)
                        : 0;
                      field.onChange(parseValue);
                    }}
                  />
                )}
              />
            </Form.Item>
          </Col>
          {isEdit && (
            <Col xs={24} sm={8}>
              <Form.Item
                label="Trạng thái"
                validateStatus={errors.active ? "error" : ""}
                help={errors.active?.message}
              >
                <Controller
                  name="active"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      disabled={isSelectActive}
                      placeholder="Trạng thái bài đăng"
                      options={roomActiveOtions}
                    ></Select>
                  )}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Tỉnh"
              validateStatus={errors.province ? "error" : ""}
              help={errors.province?.message}
            >
              <Controller
                name="province"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Chọn tỉnh / thành phố"
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
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Quận"
              validateStatus={errors.district ? "error" : ""}
              help={errors.district?.message}
            >
              <Controller
                name="district"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Chọn quận"
                    disabled={isEdit ? false : !districts.length}
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
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Địa chỉ"
              validateStatus={errors.address ? "error" : ""}
              help={errors.address?.message}
            >
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Nhập địa chỉ cụ thể" />
                )}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Liên hệ"
              validateStatus={errors.contact ? "error" : ""}
              help={errors.contact?.message}
            >
              <Controller
                name="contact"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập số điện thoại liên hệ"
                    maxLength={10}
                    onBlur={() => {
                      field.onBlur();
                    }}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      field.onChange(value);
                    }}
                  />
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Loại phòng"
              validateStatus={errors.type ? "error" : ""}
              help={errors.type?.message}
            >
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Chọn loại phòng"
                    options={roomTypeOtions}
                  ></Select>
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Trạng thái phòng"
              validateStatus={errors.statusRoom ? "error" : ""}
              help={errors.statusRoom?.message}
            >
              <Controller
                name="statusRoom"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Trạng thái phòng"
                    options={statusRoomOptions}
                  ></Select>
                )}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Hình ảnh"
          validateStatus={errors.images ? "error" : ""}
          help={errors.images?.message}
        >
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <Upload
                {...field}
                fileList={fileList}
                multiple
                className="upload-list-grid"
                accept="image/jpeg,image/png,image/gif"
                customRequest={async ({ file, onSuccess, onError }) => {
                  const formData = new FormData();
                  formData.append("file", file);
                  try {
                    const response = await axiosInstance.post(
                      "/images",
                      formData
                    );
                    if (response.status === 200) {
                      message.success("Tải lên hình ảnh thành công");
                      onSuccess(response.data);
                      clearErrors("images");
                    }
                  } catch (error) {
                    onError(error);
                    setError("images", {
                      message: "Tải lên không thành công",
                    });
                  }
                }}
                onChange={handleUploadChange}
                listType="picture"
                showUploadList={true}
              >
                <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
              </Upload>
            )}
          />
        </Form.Item>

        <Form.Item label="Chọn địa điểm">
          <LocationPicker
            initLocation={initLocation}
            isDefaultValue={true}
            onLocationSelect={handleLocationSelect}
          />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          validateStatus={errors.content ? "error" : ""}
          help={errors.content?.message}
        >
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <Editor
                init={{
                  height: 300,
                  menubar: false,
                  plugins: "lists link image preview",
                  toolbar:
                    "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | preview",
                }}
                initialValue={isEdit ? initData.content : ""}
                apiKey="ylik8itoa2gw2jvfvwx4q8v83rd4o6ge4thrf1cpgonzjrul"
                onEditorChange={(content) => {
                  if (content) {
                    clearErrors("content");
                    setValue("content", content);
                  } else {
                    setError("content", { message: "Vui lòng nhập nội dung" });
                  }
                }}
              />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? "Cập nhật" : "Tạo"} bài viết
          </Button>
        </Form.Item>
      </Form>
      <ModalPackages
        isVisible={isShowModalPackages}
        onClose={() => setIsShowModalPackages(false)}
        isHidePostPkg={true}
      />
    </div>
  );
};

export default ConfigPost;
