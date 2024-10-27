import axiosInstance from "../interceptor";

export async function getUserInfo() {
  const baseUrl = process.env.REACT_APP_API_ENDPOINT;
  const userInfo = await axiosInstance.get(`${baseUrl}/users`);
  if (userInfo && userInfo.data) {
    localStorage.setItem("userInfo", JSON.stringify(userInfo.data));
    return userInfo;
  }
  return null;
}
