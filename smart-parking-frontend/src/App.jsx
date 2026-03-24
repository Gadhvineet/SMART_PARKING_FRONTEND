import React from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Home from "./pages/home"
import Login from "./pages/login"
import Signup from "./pages/signup"
import UserPage from "./pages/userPage"
import OwnerPage from "./pages/ownerPage"
import AdminPage from "./pages/adminPage"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/protectedRoute"


const Layout = ({ children }) => {
  const location = useLocation();
 const hideNavbar =
  location.pathname === "/" ||
  location.pathname === "/login" ||
  location.pathname === "/signup";

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
        <Route 
  path="/user" 
  element={
    <ProtectedRoute>
      <UserPage />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/owner" 
  element={
    <ProtectedRoute>
      <OwnerPage />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/admin" 
  element={
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  } 
/>
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}




export default App