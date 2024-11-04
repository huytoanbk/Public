import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Input, Button } from "antd";
import baseAxios from "../../interceptor/baseAxios";

const { Option } = Select;

const AddressModal = ({ visible, onClose, onAddressSelected, initValue }) => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await baseAxios.get("/province");
        setProvinces(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh:", error);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    if (initValue && initValue.province && initValue.district) {
      form.setFieldsValue({ province: initValue.province });
      form.setFieldsValue({ district: initValue.district });
      const fullAddress = initValue.address.split(`, ${initValue.district}, ${initValue.province}`);
      form.setFieldsValue({ specificAddress: fullAddress });
      findListDistrict(initValue.province);
    }
  }, [initValue]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const fullAddress = `${values.specificAddress}, ${values.district}, ${values.province}`;
        onAddressSelected({
          ...values,
          fullAddress,
        });
        onClose();
      })
      .catch((info) => {});
  };

  const findListDistrict = (provinceName) => {
    const selectedProvince = provinces.find(
      (province) => province.name === provinceName
    );
    setDistricts(selectedProvince ? selectedProvince.district : []);
  };

  const handleProvinceChange = (value) => {
    findListDistrict(value);
    form.setFieldsValue({ district: undefined });
  };

  return (
    <Modal
      title="Chọn địa chỉ"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Xác nhận
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Tỉnh / Thành phố"
          name="province"
          rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố!" }]}
        >
          <Select
            placeholder="Chọn tỉnh / thành phố"
            onChange={handleProvinceChange}
          >
            {provinces.map((province) => (
              <Option key={province.name} value={province.name}>
                {province.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Quận/Huyện"
          name="district"
          rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
        >
          <Select
            placeholder="Chọn quận"
            disabled={!districts.length && !initValue?.district}
          >
            {districts.map((district) => (
              <Option key={district.id} value={district.districtName}>
                {district.districtName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Địa chỉ cụ thể"
          name="specificAddress"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể!" }]}
        >
          <Input placeholder="Nhập địa chỉ cụ thể" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddressModal;
