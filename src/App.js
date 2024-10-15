import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import Login from './pages/login';
import Admin from './pages/admin';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin/*" 
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </div>
  );
}

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Home from './pages/Home';
// import Admin from './pages/Admin';
// import Login from './components/Login';
// import PrivateRoute from './PrivateRoute';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Trang public */}
//         <Route path="/" element={<Home />} />
        
//         {/* Trang đăng nhập */}
//         <Route path="/login" element={<Login />} />
        
//         {/* Trang quản lý - bắt buộc đăng nhập */}
//         <Route 
//           path="/admin/*" 
//           element={
//             <PrivateRoute>
//               <Admin />
//             </PrivateRoute>
//           } 
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
