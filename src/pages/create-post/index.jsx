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
  Card,
  Space,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import axiosInstance from "../../interceptor";

const schema = z.object({
  title: z.string().nonempty("Vui lòng nhập tiêu đề"),
  content: z.string().nonempty("Vui lòng nhập nội dung"),
  price: z.number().positive("Giá phải lớn hơn 0"),
  deposit: z.number().positive("Đặt cọc phải lớn hơn 0"),
  address: z.string().nonempty("Vui lòng nhập địa chỉ"),
  acreage: z.number().positive("Diện tích phải lớn hơn 0"),
  contact: z.string().email("Vui lòng nhập email hợp lệ"),
  expirationDate: z.date().refine((date) => date > new Date(), {
    message: "Ngày hết hạn phải sau ngày hiện tại",
  }),
  province: z.string().nonempty("Vui lòng chọn tỉnh"),
  district: z.string().nonempty("Vui lòng chọn quận"),
  images: z
    .any()
    .refine((files) => files?.length > 0, "Vui lòng tải lên hình ảnh"),
});

const CreatePostForm = () => {
  const [loading, setLoading] = useState(false);
  const { handleSubmit, register, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(schema),
  });

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
    formData.append("expirationDate", data.expirationDate.toISOString());
    formData.append("province", data.province);
    formData.append("district", data.district);
    formData.append("images", data.images[0].originFileObj);
    formData.append("map", "213123123123123");
    formData.append("active", "ACTIVE");
    formData.append("type", "RENT");

    try {
      setLoading(true);
      const response = await axiosInstance.post("/posts", formData, {
        headers: {
          Authorization: `Bearer YOUR_TOKEN_HERE`,
        },
      });
      notification.success({ message: "Tạo bài viết thành công!" });
    } catch (error) {
      notification.error({ message: "Có lỗi xảy ra", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-[1100px] w-full">
      <Card className="shadow-lg rounded-lg">
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Card title="Thông tin cơ bản" className="shadow-sm rounded-lg">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Tiêu đề" validateStatus={errors.title ? "error" : ""} help={errors.title?.message}>
                    <Input {...register("title")} placeholder="Nhập tiêu đề" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Giá" validateStatus={errors.price ? "error" : ""} help={errors.price?.message}>
                    <Input type="number" {...register("price")} placeholder="Nhập giá" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Đặt cọc" validateStatus={errors.deposit ? "error" : ""} help={errors.deposit?.message}>
                    <Input type="number" {...register("deposit")} placeholder="Nhập số tiền đặt cọc" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Diện tích" validateStatus={errors.acreage ? "error" : ""} help={errors.acreage?.message}>
                    <Input type="number" {...register("acreage")} placeholder="Nhập diện tích (m²)" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card title="Địa chỉ và Liên hệ" className="shadow-sm rounded-lg">
              <Form.Item label="Địa chỉ" validateStatus={errors.address ? "error" : ""} help={errors.address?.message}>
                <Input {...register("address")} placeholder="Nhập địa chỉ" />
              </Form.Item>
              <Form.Item label="Ngày hết hạn" validateStatus={errors.expirationDate ? "error" : ""} help={errors.expirationDate?.message}>
                <DatePicker {...register("expirationDate")} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item label="Hình ảnh">
                <Upload {...register("images")} listType="picture" maxCount={1}>
                  <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
                </Upload>
              </Form.Item>
            </Card>

            <Card title="Khu vực" className="shadow-sm rounded-lg">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Tỉnh" validateStatus={errors.province ? "error" : ""} help={errors.province?.message}>
                    <Select {...register("province")} placeholder="Chọn tỉnh">
                      <Select.Option value="Hà Nội">Hà Nội</Select.Option>
                      <Select.Option value="TP.HCM">TP.HCM</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Quận" validateStatus={errors.district ? "error" : ""} help={errors.district?.message}>
                    <Select {...register("district")} placeholder="Chọn quận">
                      <Select.Option value="Hà Đông">Hà Đông</Select.Option>
                      <Select.Option value="Cầu Giấy">Cầu Giấy</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Space>
          <Form.Item className="mt-4">
            <Button type="primary" htmlType="submit" loading={loading} block>
              Tạo bài viết
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreatePostForm;
