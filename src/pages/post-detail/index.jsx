import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import baseAxios from "../../interceptor/baseAxios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Image,
  Input,
  Typography,
  message,
  Modal,
  Row,
  Col,
  Divider,
} from "antd";
import { useUser } from "../../context/UserContext";
import "./post-detail.css";
import { GrNext, GrPrevious } from "react-icons/gr";
import { CiLocationOn } from "react-icons/ci";
import { IoIosTimer } from "react-icons/io";
import LocationPicker from "../../components/LocationPicker";
import { BiArea, BiCategory } from "react-icons/bi";
import {
  getAvatar,
  getRoomStatus,
  getRoomType,
  getThumbnail,
} from "../../utiils/format-info-room";
import { FaHouseCircleCheck } from "react-icons/fa6";
import ContactInfo from "./contact-info";
import { IoNewspaperOutline } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";

const commentSchema = z.object({
  comment: z
    .string({ required_error: "Nội dung bình luận là bắt buộc" })
    .min(1, "Nội dung bình luận là bắt buộc"),
});
const { Title } = Typography;

const PostDetail = () => {
  const { id } = useParams();
  const { userInfo } = useUser();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const swiperRef = useRef(null);

  const showModal = () => {
    if (post && post.longitude && post.latitude) {
      setIsModalVisible(true);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
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
        const response = await baseAxios.get(`/posts/${id}/comment`);
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
      const { userId } = userInfo;
      const response = await baseAxios.post(`/posts/${id}/comment`, {
        comment: data.comment,
        postId: id,
        userId,
        userTo: "",
      });
      setComments([response.data, ...comments]);
      reset();
      message.success("Đã gửi bình luận thành công!");
    } catch (error) {
      const { errorMessage = "Có lỗi xảy ra khi gửi bình luận." } = error;
      console.error("Error submitting comment:", error);
      message.error(errorMessage);
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
    <div className="container mx-auto pb-8 px-5 max-w-6xl">
      <div className="flex mb-10 gap-x-[45px] justify-center">
        <div className="w-full md:w-[650px]">
          <div className="relative w-[644px] h-[412px]">
            <Swiper
              modules={[Navigation, Thumbs]}
              navigation
              thumbs={{ swiper: thumbsSwiper }}
              className="h-full"
              loop
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
            >
              {post.images.map((image, index) => (
                <SwiperSlide key={index} className="h-full">
                  <Image
                    src={getThumbnail(image)}
                    alt={`Post image ${index}`}
                    className="w-full h-full object-cover rounded-lg"
                    width={"100%"}
                    height={"100%"}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <button
              className="absolute top-1/2 left-[-16px] z-10 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
              onClick={() => swiperRef.current.slidePrev()}
            >
              <GrPrevious className="text-xl text-black" />
            </button>
            <button
              className="absolute top-1/2 right-[-16px] z-10 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
              onClick={() => swiperRef.current.slideNext()}
            >
              <GrNext className="text-xl text-black" />
            </button>
          </div>

          <Swiper
            onSwiper={setThumbsSwiper}
            slidesPerView={5.5}
            className="mt-4 w-[644px]"
            spaceBetween={10}
            loop
          >
            {post.images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={getThumbnail(image)}
                  alt={`Thumbnail ${index}`}
                  className={`w-[104px] h-[104px] object-cover rounded-lg cursor-pointer ${
                    activeIndex === index
                      ? "border-2 border-solid border-[#FF8800]"
                      : ""
                  }`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="bg-white rounded-lg shadow-md p-4 mx-auto">
            <Title className="!text-lg !mb-4 !mt-0">{post.title}</Title>
            <div className="text-lg mb-4">
              <span className="text-red-500 font-bold">
                {post.price.toLocaleString("vi-VN", {
                  minimumFractionDigits: 0,
                }) + " VND/tháng"}
              </span>
              <span className="mx-2">•</span>
              <span className="text-black text-base font-semibold">
                {post.acreage.toLocaleString()} m²
              </span>
              <span className="ml-3">
                <strong>(Đặt cọc:</strong>{" "}
                {post.deposit.toLocaleString("vi-VN", {
                  minimumFractionDigits: 0,
                })}{" "}
                VND)
              </span>
            </div>
            <div className="mt-4 mb-4">
              <span
                onClick={showModal}
                className="cursor-pointer py-1 mb-1 text-sm font-regular hover:underline text-gray-900 inline-flex items-center "
              >
                <CiLocationOn
                  className="mr-[4px] w-5 h-5"
                  width={20}
                  height={20}
                />
                {post.address}
              </span>
              <span className="py-1 text-sm font-regular text-gray-900 flex items-center">
                <IoIosTimer
                  className="mr-[6px] w-5 h-5"
                  width={20}
                  height={20}
                />
                Cập nhật {post.uptime}
              </span>
            </div>
            <div className="mb-10">
              <h3 className="mb-3 text-base font-bold">Đặc điểm phòng</h3>
              <Row gutter={16} className="!mx-0" align="middle">
                <Col span={1} className="!px-0">
                  <BiCategory width={20} height={20} className="w-5 h-5" />
                </Col>
                <Col span={7}>
                  <span className="text-base">Loại phòng</span>
                </Col>
                <Col span={7}>
                  <span className="text-base font-bold">
                    {getRoomType(post.type)}
                  </span>
                </Col>
              </Row>
              <Divider className="my-1" />
              <Row gutter={16} className="!mx-0" align="middle">
                <Col span={1} className="!px-0">
                  <FaHouseCircleCheck
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </Col>
                <Col span={7}>
                  <span className="text-base">Trạng thái phòng</span>
                </Col>
                <Col span={7}>
                  <span className="text-base font-bold">
                    {getRoomStatus(post.statusRoom)}
                  </span>
                </Col>
              </Row>
              <Divider className="my-1" />
              <Row gutter={16} className="!mx-0" align="middle">
                <Col span={1} className="!px-0">
                  <BiArea width={20} height={20} className="w-5 h-5" />
                </Col>
                <Col span={7}>
                  <span className="text-base">Diện tích</span>
                </Col>
                <Col span={7}>
                  <span className="text-base font-bold">
                    {post.acreage.toLocaleString()} m²
                  </span>
                </Col>
              </Row>
              <Divider className="my-1" />
            </div>
            {post.contact && (
              <div className="mb-10">
                <h3 className="mb-3 text-base font-bold">Mô tả chi tiết</h3>
                <ContactInfo contact={post.contact} />
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          {post.longitude && post.latitude && (
            <div className="bg-white mt-5 rounded-lg shadow-md p-4 mx-auto">
              <h3 className="mb-3 text-base font-bold">Xem trên bản đồ</h3>
              <div onClick={showModal} className="relative z-1 cursor-pointer">
                <LocationPicker
                  initLocation={[post.latitude, post.longitude]}
                  isDefaultValue={false}
                  disabled={true}
                  style={{ height: "200px" }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:block w-[340px] h-auto">
          <div className="bg-white p-4 rounded-lg shadow-md sticky top-[100px]">
            <div className="flex items-center mb-3">
              <img
                src={getAvatar(post?.userPostRes?.avatar)}
                alt="User Avatar"
                className="w-14 h-14 rounded-full mr-2 border border-[#8492a6] border-solid"
              />
              <div>
                <h2 className="text-base font-bold">
                  {post?.userPostRes?.fullName || "User"}
                </h2>
                <p className="text-sm flex items-center">
                  <IoNewspaperOutline className="mr-1 w-4 h-4" />
                  {post?.userPostRes?.totalPost || "1"} Tin đăng
                </p>
              </div>
            </div>

            <p className="text-sm flex items-center">
              <span className="text-[#589f39] text-[30px] mr-2">•</span>Hoạt
              động {post?.userPostRes?.uptime || "1 giờ trước"}
            </p>
            <p className="text-sm">
              Tham gia {post?.userPostRes?.dateOfJoin || "1 giờ trước"}
            </p>
            {post?.userPostRes?.phone && (
              <a
                href={`tel:${post?.userPostRes?.phone}`}
                className="flex items-center text-base justify-center mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-4 rounded inline-block"
              >
                <FaPhoneAlt className="mr-2 w-5 h-5" />
                Gọi điện
              </a>
            )}
            {post?.userPostRes?.email && (
              <a
                href={`mailto:${post?.userPostRes?.email}`}
                className="flex items-center text-base justify-center mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded inline-block"
              >
                <MdAlternateEmail className="mr-2 w-5 h-5" />
                Gửi email
              </a>
            )}
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
            rows={3}
            placeholder="Nhập bình luận của bạn..."
            className={`border rounded w-full p-2 ${
              errors.comment ? "border-red-500" : ""
            }`}
            {...register("comment")}
          />
          {errors.comment && (
            <p className="text-red-500">{errors.comment.message}</p>
          )}
          <Button
            type="primary"
            htmlType="submit"
            className="mt-2"
            disabled={Boolean(!userInfo)}
          >
            Gửi bình luận
          </Button>
          {!userInfo && (
            <span>
              Vui lòng <Link to={"/login"}>đăng nhập</Link> để bình luận
            </span>
          )}
        </form>
      </div>
      <Modal
        title="Bản đồ"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <LocationPicker
          initLocation={[post.latitude, post.longitude]}
          isDefaultValue={false}
        />
      </Modal>
    </div>
  );
};

export default PostDetail;
