import React from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/navbar"
import Home from "./pages/home"
import Login from "./pages/login"
import Signup from "./pages/signup"
import UserPage from "./pages/userPage";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}




export default App