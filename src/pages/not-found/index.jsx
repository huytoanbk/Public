import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <h2 className="mt-4 text-3xl font-semibold">Trang không tìm thấy</h2>
        <p className="mt-2 text-gray-600">
          Rất tiếc, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
        </p>
        <div className="mt-8">
          <Link to="/" className="inline-block px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-500">
            Quay lại trang chủ
          </Link>
          <Link to="/contact" className="inline-block px-6 py-3 ml-4 text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white">
            Liên hệ hỗ trợ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
