import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Pagination } from "antd";
import PostList from "./post-list";
import axiosInstance from "../../interceptor";

const MySavedPost = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/posts/like-post", {
          authorId: id,
          page: currentPage - 1,
          size: 5,
        });
        setPosts(response.data.content);
        setTotalPosts(response.data.totalElements);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, [id, currentPage]);

  return (
    <div className="flex gap-8 p-6 max-w-6xl mx-auto">
      <div className="">
        <PostList posts={posts} />
        <Pagination
          current={currentPage}
          pageSize={5}
          total={totalPosts}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default MySavedPost;
