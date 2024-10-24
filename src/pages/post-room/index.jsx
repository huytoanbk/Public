import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
  Image,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import axiosInstance from "../../interceptor";

const schema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  content: z.string().min(1, "Vui lòng nhập nội dung"),
  price: z
    .number({ invalid_type_error: "Giá phải là số" })
    .positive("Giá phải lớn hơn 0")
    .refine((value) => value > 0, { message: "Giá phải lớn hơn 0" }),
  deposit: z
    .number({ invalid_type_error: "Đặt cọc phải là số" })
    .positive("Đặt cọc phải lớn hơn 0")
    .refine((value) => value > 0, { message: "Đặt cọc phải lớn hơn 0" }),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),
  acreage: z
    .number({ invalid_type_error: "Diện tích phải là số" })
    .positive("Diện tích phải lớn hơn 0")
    .refine((value) => value > 0, { message: "Diện tích phải lớn hơn 0" }),
  contact: z.string().email("Vui lòng nhập email hợp lệ"),
  expirationDate: z.date().refine((date) => date > new Date(), {
    message: "Ngày hết hạn phải sau ngày hiện tại",
  }),
  province: z.string().min(1, "Vui lòng chọn tỉnh"),
  district: z.string().min(1, "Vui lòng chọn quận"),
  images: z.array(z.string()).min(1, "Vui lòng tải lên ít nhất một hình ảnh"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
});

const CreatePostForm = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const {
    handleSubmit,
    register,
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
      } else if (file.status === "error") {
        notification.error({ message: "Tải lên hình ảnh thất bại" });
      }
    }

    setFileList(files);
    setValue("images", uploadedUrls);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("description", data.description);
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
      const response = await axios.post(
        "http://localhost:8888/api/v1/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer YOUR_TOKEN_HERE`,
          },
        }
      );
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

  return (
    <div className="container mx-auto py-8">
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tiêu đề"
              validateStatus={errors.title ? "error" : ""}
              help={errors.title?.message}
            >
              <Input {...register("title")} placeholder="Nhập tiêu đề" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Giá"
              validateStatus={errors.price ? "error" : ""}
              help={errors.price?.message}
            >
              <Input
                type="number"
                {...register("price")}
                placeholder="Nhập giá"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Đặt cọc"
              validateStatus={errors.deposit ? "error" : ""}
              help={errors.deposit?.message}
            >
              <Input
                type="number"
                {...register("deposit")}
                placeholder="Nhập số tiền đặt cọc"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Diện tích"
              validateStatus={errors.acreage ? "error" : ""}
              help={errors.acreage?.message}
            >
              <Input
                type="number"
                {...register("acreage")}
                placeholder="Nhập diện tích (m²)"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Địa chỉ"
          validateStatus={errors.address ? "error" : ""}
          help={errors.address?.message}
        >
          <Input {...register("address")} placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item
          label="Ngày hết hạn"
          validateStatus={errors.expirationDate ? "error" : ""}
          help={errors.expirationDate?.message}
        >
          <DatePicker
            {...register("expirationDate")}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="Hình ảnh">
          <Upload
            multiple
            customRequest={async ({ file, onSuccess, onError }) => {
              const formData = new FormData();
              formData.append("image", file);
              try {
                const response = await axiosInstance.post(
                  "/users/upload-avatar",
                  formData,
                  {
                    headers: {
                      Authorization: `Bearer `,
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

          {/* <div className="mt-4">
            {fileList.length > 0 && fileList.map((file) => (
              <Image
                key={file.uid}
                src={file.url || file.response.url}
                alt="preview"
                width={100}
                height={100}
                style={{ marginRight: 8 }}
              />
            ))}
          </div> */}
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tỉnh"
              validateStatus={errors.province ? "error" : ""}
              help={errors.province?.message}
            >
              <Select {...register("province")} placeholder="Chọn tỉnh">
                <Select.Option value="Hà Nội">Hà Nội</Select.Option>
                <Select.Option value="TP.HCM">TP.HCM</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Quận"
              validateStatus={errors.district ? "error" : ""}
              help={errors.district?.message}
            >
              <Select {...register("district")} placeholder="Chọn quận">
                <Select.Option value="Hà Đông">Hà Đông</Select.Option>
                <Select.Option value="Cầu Giấy">Cầu Giấy</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Mô tả"
          validateStatus={errors.description ? "error" : ""}
          help={errors.description?.message}
        >
          <Editor
            init={{
              height: 300,
              menubar: false,
              plugins: "lists link image preview",
              toolbar:
                "undo redo | styleselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image | preview",
            }}
            apiKey="ylik8itoa2gw2jvfvwx4q8v83rd4o6ge4thrf1cpgonzjrul"
            onEditorChange={(content) => setValue("description", content)}
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
