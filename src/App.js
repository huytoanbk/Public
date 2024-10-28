import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { useForm, FormProvider } from "react-hook-form";
import "swiper/css";
import "swiper/css/pagination";
import 'leaflet/dist/leaflet.css';
import Home from "./pages/home";
import Login from "./pages/login";
import AdminLayout from "./pages/admin";
import PrivateRoute from "./PrivateRoute";
import Profile from "./pages/admin/profile";
import Dashboard from "./pages/admin/dashboard";
import PostManagement from "./pages/admin/post-management";
import PostCreate from "./pages/admin/post-create";
import AdsManagement from "./pages/admin/ads-management";
import UserProfile from "./pages/profile";
import AppHeader from "./components/Header";
import Footer from "./components/Footer";
import PostDetail from "./pages/post-detail";
import NotFound from "./pages/not-found";
import Breadcrumb from "./components/Breadcrumb";
import CreatePostForm from "./pages/post-room";
import { useUser } from "./context/UserContext";
import { useEffect } from "react";
import axiosInstance from "./interceptor";
import UserManagement from "./pages/admin/user-management";

function App() {
  const { pathname = "" } = useLocation();
  const methods = useForm();
  const navigate = useNavigate();
  const { updateUserInfo, clearUserInfo, userInfo } = useUser();

  const handleCheckRole = async () => {
    console.log('userInfo', userInfo);
    console.log('pathname.includes("/admin") && Boolean(userInfo)', Boolean(userInfo));
    if (pathname.includes("/admin") && Boolean(userInfo)) {
      console.log('userInfo', userInfo);
      const userInfoResponse = await axiosInstance.get(`/users`);
      if(userInfoResponse && userInfoResponse.data) {
        // const isAdmin = userInfo.roles.find(
        //   (roleItem) => roleItem.name === "ADMIN"
        // );
        // if (!isAdmin) {
        //   navigate("/");
        // }
      }
    }
  }
  useEffect(() => {
    const token = localStorage.getItem("token") || "null";
    const userInfo = localStorage.getItem("userInfo") || "null";
    if (token !== "null") {
      const userToken = JSON.parse(token);
      const userInfoData = JSON.parse(userInfo);
      updateUserInfo({ ...userToken, ...userInfoData });
      return;
    }
    clearUserInfo();
  }, []);

  useEffect(() => {
    handleCheckRole();
  }, [userInfo, pathname]);

  return (
    <div className="App">
      <FormProvider {...methods}>
        {!pathname.includes("/admin") && <AppHeader />}
        {!pathname.includes("/admin") && <Breadcrumb />}
        <Routes>
          <Route index element={<Home />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route
            path="/create-post"
            element={
              <PrivateRoute>
                <CreatePostForm />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<Home />} />
          <Route
            path="/admin/*"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route
                      path="post-management"
                      element={<PostManagement />}
                    />
                    <Route
                      path="user-management"
                      element={<UserManagement />}
                    />
                    <Route path="ads-management" element={<AdsManagement />} />
                    <Route path="post-create" element={<PostCreate />} />
                    {/* <Route path="create" element={<PostCreate />} /> */}
                    <Route path="profile" element={<Profile />} />{" "}
                  </Routes>
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </FormProvider>
      <Footer />
    </div>
  );
}

export default App;
