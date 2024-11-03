import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const tokenStorage = localStorage.getItem("token");
    if (tokenStorage) {
      const { token = "" } = JSON.parse(tokenStorage) || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // const navigate = useNavigate();

    if (error.response && error.response.status === 401) {
      try {
        const tokenStorage = localStorage.getItem("token");
        const { refreshToken = "" } = JSON.parse(tokenStorage) || {};

        if (!refreshToken) {
          localStorage.removeItem('token');
          window.location.href = "/";
          return Promise.reject(error);
        }

        const refreshResponse = await axiosInstance.post("/auth/refresh-token", {
          refreshToken,
        });

        if (refreshResponse.data && refreshResponse.data.token) {
          const newToken = refreshResponse.data.token;
          localStorage.setItem("token", JSON.stringify(newToken));
          const {token = ''} = newToken;
          error.config.headers["Authorization"] = `Bearer ${token}`;
          return axiosInstance(error.config);
        } else {
          localStorage.removeItem("token");
          window.location.href = "/";
        }
      } catch (refreshError) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
    const errorMessage = error?.response?.data?.message;
    error["errorMessage"] = errorMessage;
    return Promise.reject(error);
  }
);

export default axiosInstance;
