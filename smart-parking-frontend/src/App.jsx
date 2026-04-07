import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";

import UserPage from "./pages/userPage";
import OwnerPage from "./pages/ownerPage";
import AdminPage from "./pages/adminPage";

import VehiclesPage from "./pages/VehiclesPage";
import ParkingLotsPage from "./pages/ParkingLotsPage";
import AddParkingPage from "./pages/AddParkingPage";
import FindParkingPage from "./pages/FindParkingPage";

/* ADMIN PAGES */
import AdminUsersPage from "./pages/adminUsersPage";
import AdminOwnersPage from "./pages/adminOwnersPage";
import AdminParkingLotsPage from "./pages/adminParkingLotsPage";
import AdminSlotsPage from "./pages/adminSlotsPage";
import AdminBookingsPage from "./pages/adminBookingsPage";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/protectedRoute";

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

          {/* ================= ADMIN ROUTES ================= */}

          {/* ADMIN DASHBOARD */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* ADMIN USERS */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />

          {/* ADMIN OWNERS */}
          <Route
            path="/admin/owners"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminOwnersPage />
              </ProtectedRoute>
            }
          />

          {/* ADMIN PARKING LOTS */}
          <Route
            path="/admin/parkinglots"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminParkingLotsPage />
              </ProtectedRoute>
            }
          />

          {/* ADMIN SLOTS */}
          <Route
            path="/admin/slots"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminSlotsPage />
              </ProtectedRoute>
            }
          />

          {/* ADMIN BOOKINGS */}
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminBookingsPage />
              </ProtectedRoute>
            }
          />

          {/* ================= USER FEATURES ================= */}

          {/* VEHICLES PAGE */}
          <Route
            path="/vehicles"
            element={
              <ProtectedRoute allowedRoles={["user", "owner"]}>
                <VehiclesPage />
              </ProtectedRoute>
            }
          />

          {/* USER FIND PARKING */}
          <Route
            path="/find-parking"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <FindParkingPage />
              </ProtectedRoute>
            }
          />

          {/* ================= OWNER FEATURES ================= */}

          {/* OWNER ADD PARKING */}
          <Route
            path="/owner/add-parking"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <AddParkingPage />
              </ProtectedRoute>
            }
          />

          {/* OWNER MANAGE PARKING LOTS */}
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
  );
}

export default App;