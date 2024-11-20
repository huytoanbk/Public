import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, InputNumber, Select } from "antd";
import "tailwindcss/tailwind.css";

const schema = z.object({
  advertisingName: z.string().nonempty("Vui lòng nhập tên gói"),
  price: z
    .number()
    .min(1000, "Giá phải lớn hơn hoặc bằng 1000")
    .refine((value) => value !== undefined, {
      message: "Vui lòng nhập giá",
    }),
  des: z.string().nonempty("Vui lòng nhập mô tả"),
  active: z.enum(["ACTIVE", "INACTIVE"], "Vui lòng chọn trạng thái"),
});

const AdvertisingPackageForm = ({ initialData = null, onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      advertisingName: "",
      price: 0,
      des: "",
      active: "ACTIVE",
    },
  });

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
  };

  return (
    <form
      className="max-w-xl mx-auto bg-white p-5 shadow-md rounded-lg"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-2">Tên gói</label>
        <Controller
          name="advertisingName"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Nhập tên gói" />
          )}
        />
        {errors.advertisingName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.advertisingName.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-2">Giá</label>
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              className="w-full"
              min={0}
              placeholder="Nhập giá"
            />
          )}
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-2">Mô tả</label>
        <Controller
          name="des"
          control={control}
          render={({ field }) => (
            <Input.TextArea {...field} rows={4} placeholder="Nhập mô tả" />
          )}
        />
      </div>

      <div className="mb-4 w-[150px]">
        <label className="block font-medium text-gray-700 mb-2">
          Trạng thái
        </label>
        <Controller
          name="active"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              className="w-full"
              options={[
                { label: "Hoạt động", value: "ACTIVE" },
                { label: "Không hoạt động", value: "INACTIVE" },
              ]}
            />
          )}
        />
        {errors.active && (
          <p className="text-red-500 text-sm mt-1">{errors.active.message}</p>
        )}
      </div>

      <Button type="primary" htmlType="submit" className="w-full">
        {initialData ? "Cập nhật gói hội viên" : "Tạo gói hội viên"}
      </Button>
    </form>
  );
};

export default AdvertisingPackageForm;
