import React, { useState, useEffect } from 'react';

const TopPosts = () => {
  const [topCommentedPosts, setTopCommentedPosts] = useState([]);
  const [topLikedPosts, setTopLikedPosts] = useState([]);

  const fetchFakeData = async () => {
    const fakeResponse = {
      topCommented: [
        { id: 1, title: "Bài viết 1", comments: 120, image: "https://via.placeholder.com/50" },
        { id: 2, title: "Bài viết 2", comments: 95, image: "https://via.placeholder.com/50" },
        { id: 3, title: "Bài viết 3", comments: 85, image: "https://via.placeholder.com/50" },
        { id: 4, title: "Bài viết 4", comments: 80, image: "https://via.placeholder.com/50" },
        { id: 5, title: "Bài viết 5", comments: 75, image: "https://via.placeholder.com/50" },
      ],
      topLiked: [
        { id: 1, title: "Bài viết 6", likes: 300, image: "https://via.placeholder.com/50" },
        { id: 2, title: "Bài viết 7", likes: 280, image: "https://via.placeholder.com/50" },
        { id: 3, title: "Bài viết 8", likes: 270, image: "https://via.placeholder.com/50" },
        { id: 4, title: "Bài viết 9", likes: 250, image: "https://via.placeholder.com/50" },
        { id: 5, title: "Bài viết 10", likes: 240, image: "https://via.placeholder.com/50" },
      ],
    };
    setTopCommentedPosts(fakeResponse.topCommented);
    setTopLikedPosts(fakeResponse.topLiked);
  };

  useEffect(() => {
    fetchFakeData();
  }, []);

  const renderPostItem = (post, type) => (
    <div key={post.id} className="flex  justify-between p-4 border-b w-full">
      <div className="flex items-center">
        <div className="">
          <img
            className="w-full h-full object-cover rounded mr-5"
            src={post.image}
            alt={post.title}
          />
        </div>
        <div>
          <h3 className="text-gray-800 text-base font-medium">{post.title}</h3>
          <p className="text-gray-600 text-sm">
            {type === "comments" ? `${post.comments} bình luận` : `${post.likes} lượt yêu thích`}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white shadow rounded-lg w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Top Bài Viết</h2>
     <div className='flex justify-between'>
     <div className="min-w-[400px]">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Được Bình Luận Nhiều Nhất</h3>
        <div className="divide-y">
          {topCommentedPosts.map((post) => renderPostItem(post, "comments"))}
        </div>
      </div>
      <div className='min-w-[300px]'>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Được Yêu Thích Nhiều Nhất</h3>
        <div className="divide-y">
          {topLikedPosts.map((post) => renderPostItem(post, "likes"))}
        </div>
      </div>
     </div>
    </div>
  );
};

export default TopPosts;
