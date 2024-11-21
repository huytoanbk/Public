import React, { useEffect, useState } from "react";
import { Breadcrumb as BreadcrumbAntd } from "antd";
import { Link, useLocation, useParams } from "react-router-dom";
import baseAxios from "../../interceptor/baseAxios";

const Breadcrumb = ({ match }) => {
  const location = useLocation();
  const [postTitle, setPostTitle] = useState("");
  const pathnames = location.pathname.split("/").filter((x) => x);

  const customNames = {
    "create-post": "Tạo bài viết",
    "edit-post": "Chỉnh sửa bài viết",
    posts: "Danh sách bài viết",
    search: "Tìm kiếm",
    profile: "Trang cá nhân",
    post: "Bài viết",
    login: "Đăng nhập",
    "my-post": "Bài viết của tôi",
    "edit": "Chỉnh sửa bài viết",
    author: "Tác giả",
    "my-saved-post": "Bài viết yêu thích",
  };

  useEffect(() => {
    const fetchPostTitle = async (id) => {
      if (id) {
        try {
          const response = await baseAxios.get(`/posts/${id}`);
          setPostTitle(response.data.title);
        } catch (error) {
          console.error("Error fetching post title:", error);
        }
      }
    };
    const fetchUserName = async (id) => {
      if (id) {
        try {
          const response = await baseAxios.get(`/users/${id}`);
          setPostTitle(response.data.fullName);
        } catch (error) {
          console.error("Error fetching post title:", error);
        }
      }
    };
    if (location.pathname.includes("post/")) {
      const id = location.pathname.split("post/")[1].split("/")[0];
      if (id) fetchPostTitle(id);
    }
    if (location.pathname.includes("author/")) {
      const id = location.pathname.split("author/")[1].split("/")[0];
      if (id) fetchUserName(id);
    }
  }, [location.pathname]);

  return (
    <div className="max-w-[1200px] w-full my-0 mx-auto p-5">
      <BreadcrumbAntd>
        <BreadcrumbAntd.Item>
          <Link to="/">Trang chủ</Link>
        </BreadcrumbAntd.Item>
        {pathnames.map((pathname, index) => {
          const isLast = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const displayName =
            customNames[pathname] || (isLast && postTitle) || pathname;

          return isLast ? (
            <BreadcrumbAntd.Item className="text-base" key={to}>{displayName}</BreadcrumbAntd.Item>
          ) : (
            <BreadcrumbAntd.Item key={to}>
              {/* <Link to={to}>{displayName}</Link> */}
              <span className="text-base">{displayName}</span>
            </BreadcrumbAntd.Item>
          );
        })}
      </BreadcrumbAntd>
    </div>
  );
};

export default Breadcrumb;
