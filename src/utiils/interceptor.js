import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const baseURL = process.env.REACT_APP_API_ENDPOINT || "";

const instance = axios.create({
  baseURL,
});

const AxiosInterceptor = ({ children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const resInterceptor = (response) => {
      return response;
    };
    const errInterceptor = (error) => {
      if (error.response.status === 401) {
        navigate("/");
      }
      return Promise.reject(error);
    };
    const interceptor = instance.interceptors.response.use(
      resInterceptor,
      errInterceptor
    );

    return () => instance.interceptors.response.eject(interceptor);
  }, [navigate]);

  return children;
};

export default instance;
export { AxiosInterceptor };
