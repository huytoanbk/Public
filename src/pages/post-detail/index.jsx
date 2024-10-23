import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import baseAxios from '../../interceptor/baseAxios';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await baseAxios.get(`/posts/${id}`);
        if (response.data) {
          setPost(response.data);
        } else {
          setError('Không tìm thấy bài viết.');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Có lỗi xảy ra khi lấy thông tin bài viết.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl font-semibold">{error}</p> {/* Cập nhật style */}
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
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Swiper
            modules={[Navigation, Thumbs]}
            navigation
            thumbs={{ swiper: thumbsSwiper }}
            className="w-full"
          >
            {post.images.map((image, index) => (
              <SwiperSlide key={index}>
                <img src={image} alt={`Post image ${index}`} className="w-full h-[300px] object-cover rounded-lg" />
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
                <img src={image} alt={`Thumbnail ${index}`} className="w-full h-[80px] object-cover rounded-lg cursor-pointer" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <p className="text-xl text-gray-700">
            Giá: <span className="text-red-500 font-semibold">{post.price.toLocaleString()} VNĐ</span>
          </p>
          <p className="text-sm text-gray-500">Đặt cọc: {post.deposit.toLocaleString()} VNĐ</p>
          <p className="text-gray-700">Diện tích: {post.acreage} m²</p>
          <p className="text-gray-700">Địa chỉ: {post.address}, {post.district}, {post.province}</p>
          <p className="text-gray-700">Liên hệ: {post.contact}</p>
          <p className="text-sm text-gray-400">Được đăng bởi: {post.createdBy}</p>
          <p className="text-sm text-gray-400">Ngày đăng: {new Date(post.createdAt).toLocaleDateString()}</p>

          <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4">
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded mb-2 sm:mb-0">
              Mua ngay
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
