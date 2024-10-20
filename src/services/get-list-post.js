import axios from "axios";

export async function getListPost(data) {
  try {
    const baseUrl = process.env.REACT_APP_API_ENDPOINT;
    const response = await axios({
        method: 'GET',
        baseURL: `${baseUrl}/posts/search`,
        data: data
    });
    return response.data;
  } catch (error) {
    return error;
  }
}
