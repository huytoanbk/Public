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
  notification,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import axiosInstance from "../../interceptor";
import LocationPicker from "../../components/LocationPicker";
import { useNavigate } from "react-router-dom";
import Title from "antd/es/typography/Title";

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
  expirationDate: z
    .string({ required_error: "Vui lòng chọn ngày" })
    .min(1, { message: "Vui lòng chọn ngày" }),
  province: z
    .string({ required_error: "Vui lòng chọn tỉnh" })
    .min(1, { message: "Vui lòng chọn tỉnh" }),
  district: z
    .string({ required_error: "Vui lòng chọn quận" })
    .min(1, { message: "Vui lòng chọn quận" }),
  images: z
    .array(z.string(), { required_error: "Vui lòng tải lên hình ảnh" })
    .min(1, { message: "Vui lòng tải lên hình ảnh" }),

  // location: z
  //   .string({ required_error: "Vui lòng chọn địa điểm" })
  //   .min(1, { message: "Vui lòng lựa chọn địa điểm chính xác" }),
});

const CreatePostForm = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [location, setLocation] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    register,
    watch,
    clearErrors,
    setError,
    formState: { errors },
    setValue,
  } = useForm({
    shouldFocusError: false,
    resolver: zodResolver(schema),
  });

  const handleUploadChange = async (info) => {
    const files = info.fileList;
    const uploadedUrls = [];
    for (const file of files) {
      if (file.status === "done") {
        uploadedUrls.push(file.url || file.thumbUrl);
      } else if (file.status === "error") {
      }
    }
    setFileList(files);
    setValue("images", uploadedUrls);
  };

  const handleLocationSelect = (coordinates) => {
    setLocation(coordinates);
  };

  const onError = (errors) => {
    console.log("Errors:", errors);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("price", data.price);
    formData.append("deposit", data.deposit);
    formData.append("address", data.address);
    formData.append("acreage", data.acreage);
    formData.append("statusRoom", "ACTIVE");
    formData.append("contact", data.contact);
    formData.append("expirationDate", data.expirationDate);
    formData.append("province", data.province);
    formData.append("district", data.district);
    if(data.location) formData.append("location", data.location);
    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/posts", formData);
      notification.success({ message: "Tạo bài viết thành công!" });
      // navigate('/my-post');
    } catch (error) {
      const {errorMessage = "Có lỗi xảy ra"} = error;
      notification.error({
        message: errorMessage,
      });
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
      setValue("district", undefined);
    }
  }, [selectedProvinceId, provinces, setValue]);

  return (
    <div className="container mx-auto py-8" style={{ maxWidth: 800 }}>
      <Title level={4} className="!mb-7">Đăng tin cho thuê phòng/ ở ghép</Title>
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
          <Col xs={24} sm={12}>
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
          <Col xs={24} sm={12}>
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
        </Row>

        <Form.Item
          label="Địa chỉ"
          validateStatus={errors.address ? "error" : ""}
          help={errors.address?.message}
        >
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Nhập địa chỉ" />
            )}
          />
        </Form.Item>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Ngày hết hạn"
              validateStatus={errors.expirationDate ? "error" : ""}
              help={errors.expirationDate?.message}
              validateTrigger={["onChange", "onBlur"]}
              rules={[
                {
                  validator: (_, value) => {
                    if (value && value > new Date()) {
                      return Promise.reject(
                        new Error("Ngày hết hạn không hợp lệ")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <input
                type="date"
                {...register("expirationDate")}
                className="custom-date-input"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Liên hệ"
              validateStatus={errors.contact ? "error" : ""}
              help={errors.contact?.message}
            >
              <Controller
                name="contact"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Nhập số điện thoại liên hệ" />
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
                multiple
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
                      notification.success({
                        message: "Tải lên hình ảnh thành công",
                      });
                    }
                    onSuccess(response.data);
                    clearErrors("images");
                  } catch (error) {
                    onError(error);
                    setError("images", { message: "Tải lên không thành công" });
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

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12}>
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
          <Col xs={24} sm={12}>
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
                    disabled={!districts.length}
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
        </Row>
        <Form.Item label="Chọn địa điểm">
          <LocationPicker
            initLocation={[21.0283334, 105.854041]}
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
            Tạo bài viết
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreatePostForm;
