import React from "react";

const WrapperLayout = ({ children }) => {
  return (
    <div className="wrapper mx-auto px-4 py-5 sm:px-6 lg:px-8">{children}</div>
  );
};

export default WrapperLayout;
