import React, { useState } from "react";
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
  type: z.number(),
  countDate: z
    .number()
    .min(1, "Giá trị phải lớn hơn hoặc bằng 1")
    .refine((value) => value !== undefined, {
      message: "Vui lòng nhập giá trị",
    }),
});

const AdvertisingPackageForm = ({ initialData = null, onSubmit }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      advertisingName: "",
      price: 0,
      des: "",
      active: "ACTIVE",
      type: "Thời gian hiển thị",
      countDate: 1,
    },
  });

  const typeValue = watch("type");

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

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-2">Loại</label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              disabled={initialData}
              className="w-full"
              options={[
                { label: "Thời gian hiển thị", value: 0 },
                { label: "Lượt đăng bài", value: 1 },
              ]}
            />
          )}
        />
        {errors.type && (
          <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-2">
          {typeValue === 0 ? "Số ngày hiển thị" : "Số lượt đăng"}
        </label>
        <Controller
          name="countDate"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              className="w-full"
              min={1}
              placeholder={
                typeValue === "Thời gian hiển thị"
                  ? "Nhập số ngày hiển thị"
                  : "Nhập số lượt đăng"
              }
            />
          )}
        />
        {errors.countDate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.countDate.message}
          </p>
        )}
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
