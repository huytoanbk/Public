import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
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
import UserPostCreate from "./pages/post-room";
import AppHeader from "./components/Header";

function App() {
  const {pathname = ''} = useLocation();
  return (
    <div className="App">
      {!pathname.includes('/admin') && <AppHeader />}
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
        <Route
          path="/post-room"
          element={
            <PrivateRoute>
              <UserPostCreate />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="post-management" element={<PostManagement />} />
                  <Route path="ads-management" element={<AdsManagement />} />
                  <Route path="post-create" element={<PostCreate />} />
                  <Route path="profile" element={<Profile />} />{" "}
                </Routes>
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </div>
  );
}

export default App;
