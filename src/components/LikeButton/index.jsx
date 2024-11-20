import { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import {  message } from "antd";
import axiosInstance from "../../interceptor";

const LikeButton = ({ post }) => {
  const { id, like: initialLikeStatus } = post;
  const [isLiked, setIsLiked] = useState(initialLikeStatus);
  const [loading, setLoading] = useState(false);

  const handleLike = async (event) => {
    event.stopPropagation();
    setLoading(true);
    try {
      await axiosInstance.post(`/posts/like-post/${id}`);
      setIsLiked(!isLiked);
      message.success(`Bạn đã ${!isLiked ? "thích" : "bỏ thích"} bài viết thành công!`);
    } catch (error) {
      console.error("Error liking post:", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleLike}
        disabled={loading}
        className="text-xl focus:outline-none"
        aria-label={isLiked ? "Bỏ thích bài viết" : "Thích bài viết"}
      >
        {isLiked ? (
          <AiFillHeart className="text-red-500" />
        ) : (
          <AiOutlineHeart className="text-gray-500" />
        )}
      </button>
    </div>
  );
};

export default LikeButton;
