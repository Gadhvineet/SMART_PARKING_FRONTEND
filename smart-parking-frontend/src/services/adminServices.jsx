import axios from "axios";

const API = "http://localhost:5000/admin";

const getToken = () => {
  return localStorage.getItem("token");
};

export const getDashboardStats = () => {
  return axios.get(`${API}/dashboard`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

export const getUsers = () => {
  return axios.get(`${API}/users`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

export const getOwners = () => {
  return axios.get(`${API}/owners`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

export const getParkingLots = () => {
  return axios.get(`${API}/parkinglots`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

export const getSlots = () => {
  return axios.get(`${API}/slots`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

export const getBookings = () => {
  return axios.get(`${API}/bookings`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

export const deleteUser = (id) => {
  return axios.delete(`${API}/users/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

export const deleteParkingLot = (id) => {
  return axios.delete(`${API}/parkinglots/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};