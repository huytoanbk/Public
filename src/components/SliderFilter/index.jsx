import React from "react";
import { Slider } from "antd";

const formatValue = (value, unit) => {
  if (unit === "VND") {
    return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND`;
  }
  return `${value} ${unit}`;
};

const SliderFilter = ({
  label,
  min,
  max,
  step,
  onChange,
  onAfterChange,
  value = [min, max],
  unit = "",
}) => {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Slider
        range
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        onAfterChange={onAfterChange}
        value={value}
        tooltip={{
          formatter: (val) => formatValue(val, unit),
        }}
      />
      <div className="flex justify-between text-sm mt-2">
        <span>{formatValue(value[0], unit)}</span>
        <span>{formatValue(value[1], unit)}</span>
      </div>
    </div>
  );
};

export default SliderFilter;
