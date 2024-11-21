import axios from "axios";
import axiosInstance from "../interceptor";

export async function getListPost(data) {
  try {
    const baseUrl = process.env.REACT_APP_API_ENDPOINT;
    let response;
    const isLoggedIn = localStorage.getItem("token");
    if(!isLoggedIn) {
      response = await axios.post(`${baseUrl}/posts/search`, data);
    }else {
      response = await axiosInstance.post(`${baseUrl}/posts/search`, data);
    }
    return response.data;
  } catch (error) {
    return error;
  }
}
