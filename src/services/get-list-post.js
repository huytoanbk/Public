import axios from "axios";

export async function getListPost(data) {
  try {
    const baseUrl = process.env.REACT_APP_API_ENDPOINT;
    const response = await axios.post(`${baseUrl}/posts/search`, data);
    // const response = await axios.get(`${baseUrl}/posts/search`);
    return response.data;
  } catch (error) {
    return error;
  }
}
