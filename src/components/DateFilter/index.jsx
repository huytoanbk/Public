import React from "react";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";

const DateFilter = ({ onDateChange }) => {
  const handleChange = (date, dateString) => {
    onDateChange(dateString);
  };

  return (
    <Space direction="vertical" size={12}>
      <DatePicker.RangePicker
        defaultValue={[dayjs().subtract(7, "day"), dayjs()]}
        onChange={handleChange}
        format="YYYY-MM-DD"
      />
    </Space>
  );
};

export default DateFilter;
