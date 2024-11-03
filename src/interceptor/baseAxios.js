import axios from "axios";

const baseURL = process.env.REACT_APP_API_ENDPOINT;

const baseAxios = axios.create({
  baseURL,
});

baseAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const errorMessage = error?.response?.data?.message;
    error["errorMessage"] = errorMessage;
    return Promise.reject(error);
  }
);

export default baseAxios;
