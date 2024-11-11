import React, { useState } from "react";
import { message } from "antd";

const ContactInfo = ({ contact }) => {
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);
  const [isCopyMode, setIsCopyMode] = useState(false);

  const maskPhone = (phone) => {
    return phone ? phone.slice(0, -4) + "****" : "";
  };

  const handleCopy = (phone) => {
    navigator.clipboard.writeText(phone);
    message.success("Sao chép số điện thoại thành công!");
  };

  return (
    <p className="bg-[#f4f4f4] inline-block px-4 py-3 rounded">
      <strong className="mr-2">Liên hệ:</strong>
      {isPhoneVisible ? (
        <span>{contact}</span>
      ) : (
        <span>{maskPhone(contact)}</span>
      )}

      <button
        onClick={() => {
          if (!isPhoneVisible) {
            setIsPhoneVisible(true);
          }
          if(isPhoneVisible) {
            handleCopy(contact)
          }
        }}
        className="font-bold text-[#306bd9] ml-4"
      >
        {isPhoneVisible ? "Sao chép SĐT" : "Hiện SĐT"}
      </button>
    </p>
  );
};

export default ContactInfo;
