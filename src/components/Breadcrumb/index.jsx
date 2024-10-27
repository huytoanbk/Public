import React, { useEffect, useState } from 'react';
import { Breadcrumb as BreadcrumbAntd } from 'antd';
import { Link, useLocation, useParams } from 'react-router-dom';
import baseAxios from '../../interceptor/baseAxios';

const Breadcrumb = () => {
  const location = useLocation();
  const { id } = useParams();
  const [postTitle, setPostTitle] = useState('');
  const pathnames = location.pathname.split('/').filter(x => x);

  const customNames = {
    'create-post': 'Tạo bài viết',
    'edit-post': 'Chỉnh sửa bài viết',
    'posts': 'Danh sách bài viết',
    'search': 'Tìm kiếm',
  };

  useEffect(() => {
    const fetchPostTitle = async () => {
      if (id) {
        try {
          const response = await baseAxios.get(`/posts/${id}`);
          setPostTitle(response.data.title);
        } catch (error) {
          console.error('Error fetching post title:', error);
        }
      }
    };

    fetchPostTitle();
  }, [id]);

  return (
    <BreadcrumbAntd>
      <BreadcrumbAntd.Item>
        <Link to="/">Trang chủ</Link>
      </BreadcrumbAntd.Item>
      {pathnames.map((pathname, index) => {
        const isLast = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const displayName = customNames[pathname] || (isLast && postTitle) || pathname;

        return isLast ? (
          <BreadcrumbAntd.Item key={to}>{displayName}</BreadcrumbAntd.Item>
        ) : (
          <BreadcrumbAntd.Item key={to}>
            <Link to={to}>{displayName}</Link>
          </BreadcrumbAntd.Item>
        );
      })}
    </BreadcrumbAntd>
  );
};

export default Breadcrumb;
