import React from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"

import Home from "./pages/home"
import Login from "./pages/login"
import Signup from "./pages/signup"

import UserPage from "./pages/userPage"
import OwnerPage from "./pages/ownerPage"
import AdminPage from "./pages/adminPage"

import VehiclesPage from "./pages/VehiclesPage"
import ParkingLotsPage from "./pages/ParkingLotsPage"
import FindParkingPage from "./pages/FindParkingPage"

import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/protectedRoute"


const Layout = ({ children }) => {
  const location = useLocation()

  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup"

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>

      <Layout>

        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />


          {/* USER DASHBOARD */}
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserPage />
              </ProtectedRoute>
            }
          />


          {/* OWNER DASHBOARD */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerPage />
              </ProtectedRoute>
            }
          />


          {/* ADMIN DASHBOARD */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />


          {/* VEHICLES PAGE */}
          <Route
            path="/vehicles"
            element={
              <ProtectedRoute allowedRoles={["user", "owner"]}>
                <VehiclesPage />
              </ProtectedRoute>
            }
          />


          {/* USER FIND PARKING PAGE */}
          <Route
            path="/find-parking"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <FindParkingPage />
              </ProtectedRoute>
            }
          />


          {/* OWNER PARKING LOT MANAGEMENT */}
          <Route
            path="/owner/parkinglots"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <ParkingLotsPage />
              </ProtectedRoute>
            }
          />

        </Routes>

      </Layout>

    </BrowserRouter>
  )
}

export default App