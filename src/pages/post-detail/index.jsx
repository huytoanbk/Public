import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import baseAxios from "../../interceptor/baseAxios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Typography, message } from "antd";
const commentSchema = z.object({
  content: z.string().min(1, "Nội dung bình luận là bắt buộc"),
});
const { Title } = Typography;

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(commentSchema),
  });
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await baseAxios.get(`/posts/${id}`);
        if (response.data) {
          setPost(response.data);
        } else {
          setError("Không tìm thấy bài viết.");
        }
      } catch (error) {
        setError("Có lỗi xảy ra khi lấy thông tin bài viết.");
      } finally {
        setLoading(false);
      }
    };
    const fetchComments = async () => {
      try {
        const response = await baseAxios.get(`/api/v1/posts/${id}/comment`);
        setComments(response.data.comments);
        setCommentCount(response.data.totalCount);
        setShowMore(response.data.totalCount > 10);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const onSubmit = async (data) => {
    try {
      const response = await baseAxios.post(`/api/v1/posts/${id}/comment`, {
        content: data.content,
      });
      setComments([response.data, ...comments]);
      reset();
      message.success("Đã gửi bình luận thành công!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      message.error("Có lỗi xảy ra khi gửi bình luận.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl font-semibold">{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Không có bài viết nào.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4  max-w-6xl">
      <div className="flex mb-10">
        <div className="w-full md:w-3/4 pr-4">
          <Swiper
            modules={[Navigation, Thumbs]}
            navigation
            thumbs={{ swiper: thumbsSwiper }}
            className="w-full"
          >
            {post.images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`Post image ${index}`}
                  className="w-full h-[300px] object-cover rounded-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper
            onSwiper={setThumbsSwiper}
            slidesPerView={4}
            spaceBetween={10}
            className="mt-4"
          >
            {post.images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`Thumbnail ${index}`}
                  className="w-full h-[80px] object-cover rounded-lg cursor-pointer"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <h1 className="text-3xl font-bold mt-4">{post.title}</h1>
          <div className="mt-4">
            <p className="text-xl font-semibold">
              Giá:{" "}
              <span className="text-red-500">
                {post.price.toLocaleString()} VNĐ
              </span>
            </p>
            <p>
              <strong>Đặt cọc:</strong> {post.deposit.toLocaleString()} VNĐ
            </p>
            <p>
              <strong>Diện tích:</strong> {post.acreage} m²
            </p>
            <p>
              <strong>Địa chỉ:</strong> {post.address}, {post.district},{" "}
              {post.province}
            </p>
            <p>
              <strong>Liên hệ:</strong> {post.contact}
            </p>
            <p>
              <strong>Được đăng bởi:</strong> {post.createdBy}
            </p>
            <p>
              <strong>Ngày đăng:</strong>{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>

        <div className="hidden md:block w-1/4 h-auto">
          <div className="bg-white p-4 rounded-lg shadow-md sticky top-[100px]">
            <img
              src="/path/to/avatar.jpg"
              alt="User Avatar"
              className="w-16 h-16 rounded-full mb-4"
            />
            <h2 className="text-lg font-bold">Tên người dùng</h2>
            <p className="text-sm">Số bài viết: 10</p>
            <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
              Gọi điện
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 md:w-3/4">
        <Title level={2}>Bình luận</Title>
        {comments.slice(0, showMore ? 10 : comments.length).map((comment) => (
          <div key={comment.id} className="border-b py-4">
            <p className="font-semibold">{comment.createdBy}</p>
            <p className="text-sm text-gray-500">
              {comment.createdAt
                ? `${Math.floor(
                    (new Date() - new Date(comment.createdAt)) /
                      (1000 * 60 * 60 * 24)
                  )} ngày trước`
                : new Date(comment.createdAt).toLocaleDateString()}
            </p>
            <p>{comment.content}</p>
          </div>
        ))}
        {showMore && (
          <Button
            onClick={() => setShowMore(false)}
            className="mt-4"
            type="link"
          >
            Xem thêm
          </Button>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <Input.TextArea
            {...register("content")}
            rows={3}
            placeholder="Nhập bình luận của bạn..."
            className={`border rounded w-full p-2 ${
              errors.content ? "border-red-500" : ""
            }`}
            required
          />
          {errors.content && (
            <p className="text-red-500">{errors.content.message}</p>
          )}
          <Button type="primary" htmlType="submit" className="mt-2">
            Gửi bình luận
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PostDetail;
