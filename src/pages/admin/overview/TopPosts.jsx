import React, { useState, useEffect } from "react";
import axiosInstance from "../../../interceptor";

const TopPosts = () => {
  const [topCommentedPosts, setTopCommentedPosts] = useState([]);
  const [topLikedPosts, setTopLikedPosts] = useState([]);

  const fetchFakeData = async () => {
    const responseComment = await axiosInstance.get("/posts/top-10-comment");
    const responsetopLiked = await axiosInstance.get('/posts/top-10-like');
    setTopCommentedPosts(responseComment.data);
    setTopLikedPosts(responsetopLiked.data);
  };

  useEffect(() => {
    fetchFakeData();
  }, []);

  const renderPostItem = (post, type) => {
    const firstImage = post?.images?.length ? post?.images[0] : '' ;
    return (
      <div key={post.id} className="flex  justify-between p-4 border-b w-full">
        <div className="flex items-center">
          <div className="">
            <img
              className="w-[120px] h-[80px] object-cover rounded mr-5"
              src={firstImage}
              alt={post.title}
            />
          </div>
          <div>
            <h3 className="text-gray-800 text-base font-medium">
              {post.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {type === "comments"
                ? `${post.comments} bình luận`
                : `${post.likes} lượt yêu thích`}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Top Bài Viết</h2>
      <div className="flex justify-between">
        <div className="min-w-[400px]">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Được Bình Luận Nhiều Nhất
          </h3>
          <div className="divide-y">
            {topCommentedPosts.map((post) => renderPostItem(post, "comments"))}
          </div>
        </div>
        <div className="min-w-[300px]">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Được Yêu Thích Nhiều Nhất
          </h3>
          <div className="divide-y">
            {topLikedPosts.map((post) => renderPostItem(post, "likes"))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPosts;
