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

const schema = z.object({
  title: z.string().min(1, { message: "Vui lòng nhập tiêu đề" }),
  content: z.string().min(1, { message: "Vui lòng nhập nội dung" }),
  price: z.number().positive({ message: "Giá phải lớn hơn 0" }),
  deposit: z.number().positive({ message: "Đặt cọc phải lớn hơn 0" }),
  address: z.string().min(1, { message: "Vui lòng nhập địa chỉ" }),
  acreage: z.number().positive({ message: "Diện tích phải lớn hơn 0" }),
  contact: z.string().email({ message: "Vui lòng nhập email hợp lệ" }),
  expirationDate: z.date().refine((date) => date > new Date(), {
    message: "Ngày hết hạn phải sau ngày hiện tại",
  }),
  province: z.string().min(1, { message: "Vui lòng chọn tỉnh" }),
  district: z.string().min(1, { message: "Vui lòng chọn quận" }),
  images: z.array(z.string()).min(1, { message: "Vui lòng tải lên hình ảnh" }),
  description: z.string().min(1, { message: "Vui lòng nhập mô tả" }),
  location: z
    .string()
    .min(1, { message: "Vui lòng lựa chọn địa điểm chính xác" }),
});

const CreatePostForm = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [location, setLocation] = useState(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleUploadChange = async (info) => {
    const files = info.fileList;
    const uploadedUrls = [];

    for (const file of files) {
      if (file.status === "done") {
        uploadedUrls.push(file.response.url);
        notification.success({ message: "Tải lên hình ảnh thành công" });
      } else if (file.status === "error") {
        notification.error({ message: "Tải lên hình ảnh thất bại" });
      }
    }

    setFileList(files);
    setValue("images", uploadedUrls);
  };

  const handleLocationSelect = (coordinates) => {
    console.log("coordinates", coordinates);
    setLocation(coordinates);
  };

  const onSubmit = async (data) => {
    console.log("location", location);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("price", data.price);
    formData.append("deposit", data.deposit);
    formData.append("address", data.address);
    formData.append("acreage", data.acreage);
    formData.append("statusRoom", "ACTIVE");
    formData.append("contact", data.contact);
    formData.append("expirationDate", data.expirationDate.toISOString());
    formData.append("province", data.province);
    formData.append("district", data.district);

    data.images.forEach((url) => {
      formData.append("images", url);
    });

    try {
      setLoading(true);
      const response = await axiosInstance.post("/posts", formData, {
        headers: {
          Authorization: "Bearer",
        },
      });
      notification.success({ message: "Tạo bài viết thành công!" });
    } catch (error) {
      notification.error({
        message: "Có lỗi xảy ra",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/province");
        const districtData = response.data.flatMap(
          (province) => province.district
        );
        setDistricts(districtData);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quận:", error);
      }
    };

    fetchDistricts();
  }, []);
  return (
    <div className="container mx-auto py-8" style={{ maxWidth: 800 }}>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
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
                  <Input type="number" {...field} placeholder="Nhập giá" />
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
                    type="number"
                    {...field}
                    placeholder="Nhập số tiền đặt cọc"
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

        <Form.Item
          label="Ngày hết hạn"
          validateStatus={errors.expirationDate ? "error" : ""}
          help={errors.expirationDate?.message}
        >
          <Controller
            name="expirationDate"
            control={control}
            render={({ field }) => (
              <DatePicker {...field} style={{ width: "100%" }} />
            )}
          />
        </Form.Item>

        <Form.Item label="Hình ảnh">
          <Upload
            multiple
            accept="image/jpeg,image/png,image/gif"
            customRequest={async ({ file, onSuccess, onError }) => {
              const formData = new FormData();
              formData.append("file", file);
              try {
                const response = await axiosInstance.post(
                  "/users/upload-avatar",
                  formData,
                  {
                    headers: {
                      Authorization: "Bearer",
                    },
                  }
                );
                onSuccess(response.data);
              } catch (error) {
                onError(error);
              }
            }}
            onChange={handleUploadChange}
            listType="picture"
            showUploadList={true}
          >
            <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
          </Upload>
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
                  <Select {...field} placeholder="Chọn tỉnh">
                    <Select.Option value="Hà Nội">Hà Nội</Select.Option>
                    <Select.Option value="TP.HCM">TP.HCM</Select.Option>
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
                  <Select {...field} placeholder="Chọn quận">
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
                onEditorChange={(content) => setValue("content", content)}
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
