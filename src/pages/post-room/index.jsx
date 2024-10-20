import React from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Select,
  InputNumber,
} from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axiosInstance from "../../interceptor";

const { Option } = Select;

const schema = z.object({
  city: z.string().min(1, "Vui lòng chọn thành phố"),
  district: z.string().min(1, "Vui lòng chọn quận/huyện"),
  street: z.string().min(1, "Vui lòng nhập tên đường"),
  area: z.number().min(1, "Diện tích phải lớn hơn 0"),
  price: z.number().min(1, "Giá thuê phải lớn hơn 0"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
  contact: z.object({
    phone: z
      .string()
      .min(10, "Số điện thoại phải có ít nhất 10 chữ số")
      .max(11, "Số điện thoại không quá 11 chữ số")
      .regex(/^(\+84|0)\d{9}$/, "Số điện thoại không hợp lệ"),
    email: z.string().email("Email không hợp lệ"),
  }),
  images: z.array(z.any()).min(1, "Vui lòng tải lên ít nhất 1 hình ảnh"),
});

const UserPostCreate = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    axiosInstance.post('/', data);
    message.success("Đăng tin thành công!");
  };

  return (
    <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
      <Form.Item label="Thành phố">
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <Select placeholder="Chọn thành phố" {...field}>
              <Option value="Hà Nội">Hà Nội</Option>
              <Option value="TP HCM">TP HCM</Option>
              <Option value="Đà Nẵng">Đà Nẵng</Option>
            </Select>
          )}
        />
        {errors.city && <p style={{ color: "red" }}>{errors.city.message}</p>}
      </Form.Item>
      <Form.Item label="Quận/Huyện">
        <Controller
          name="district"
          control={control}
          render={({ field }) => (
            <Select placeholder="Chọn quận/huyện" {...field}>
              <Option value="Ba Đình">Ba Đình</Option>
              <Option value="1">Quận 1</Option>
            </Select>
          )}
        />
        {errors.district && (
          <p style={{ color: "red" }}>{errors.district.message}</p>
        )}
      </Form.Item>

      <Form.Item label="Tên đường">
        <Controller
          name="street"
          control={control}
          render={({ field }) => (
            <Input placeholder="Nhập tên đường" {...field} />
          )}
        />
        {errors.street && (
          <p style={{ color: "red" }}>{errors.street.message}</p>
        )}
      </Form.Item>

      <Form.Item label="Diện tích phòng (m²)">
        <Controller
          name="area"
          control={control}
          render={({ field }) => (
            <InputNumber placeholder="Nhập diện tích" {...field} />
          )}
        />
        {errors.area && <p style={{ color: "red" }}>{errors.area.message}</p>}
      </Form.Item>

      <Form.Item label="Giá thuê (VNĐ)">
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <InputNumber
              placeholder="Nhập giá thuê"
              onChange={(e) => field.onChange(Number(e.target.value))}
              {...field}
            />
          )}
        />
        {errors.price && <p style={{ color: "red" }}>{errors.price.message}</p>}
      </Form.Item>

      <Form.Item label="Hình ảnh thực tế">
        <Controller
          name="images"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Upload
              beforeUpload={(file) => {
                const newFiles = value ? [...value] : [];
                newFiles.push(file);
                onChange(newFiles);
                return false;
              }}
              onRemove={(file) => {
                const newFiles = value.filter((f) => f.uid !== file.uid);
                onChange(newFiles);
              }}
              multiple
              showUploadList={true}
              accept="image/*"
            >
              <Button>Click để tải lên</Button>
            </Upload>
          )}
        />
        {errors.images && (
          <p style={{ color: "red" }}>{errors.images.message}</p>
        )}
      </Form.Item>

      <Form.Item label="Mô tả chi tiết về phòng">
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input.TextArea
              rows={4}
              placeholder="Nhập mô tả chi tiết"
              {...field}
            />
          )}
        />
        {errors.description && (
          <p style={{ color: "red" }}>{errors.description.message}</p>
        )}
      </Form.Item>

      <Form.Item label="Thông tin liên hệ">
        <Controller
          name="contact.phone"
          control={control}
          render={({ field }) => (
            <Input placeholder="Số điện thoại" {...field} />
          )}
        />
        {errors.contact?.phone && (
          <p style={{ color: "red" }}>{errors.contact.phone.message}</p>
        )}

        <Controller
          name="contact.email"
          control={control}
          render={({ field }) => <Input placeholder="Email" {...field} />}
        />
        {errors.contact?.email && (
          <p style={{ color: "red" }}>{errors.contact.email.message}</p>
        )}
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Đăng tin
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserPostCreate;
