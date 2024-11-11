import { useEffect, useState } from "react";
import ConfigPost from "../../components/ConfigPost";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import axiosInstance from "../../interceptor";

const EditPostForm = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchPostData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/posts/${id}`);
      if (response.data) {
        setPostData(response.data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchPostData();
  }, []);

  if (loading) return <Spin tip="Loading..." />;
  if (notFound) return <div>Page 404 - Not Found</div>;

  return <ConfigPost initData={postData} isEdit={true} />;
};

export default EditPostForm;
