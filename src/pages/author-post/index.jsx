import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { List, Pagination } from 'antd';
import axios from 'axios';
import AuthorInfo from './author-info';
import PostList from './post-list';
import baseAxios from '../../interceptor/baseAxios';

const AuthorPost = () => {
  const { id } = useParams(); 
  const [posts, setPosts] = useState([]);
  const [authorInfo, setAuthorInfo] = useState(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await baseAxios.post('/posts/search', {
          authorId: id,
          page: currentPage - 1,
          size: 5,
        });
        setPosts(response.data.content);
        setAuthorInfo(response.data.content[0]?.userPostRes);
        setTotalPosts(response.data.totalElements);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchData();
  }, [id, currentPage]);

  return (
    <div className="flex gap-8 p-6">
      <div className="w-1/4 bg-white p-4 rounded-lg shadow-lg">
        {authorInfo && <AuthorInfo author={authorInfo} />}
      </div>
      <div className="w-3/4">
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

export default AuthorPost;
