import axios from "axios";

const SERVER = "http://localhost:5000";

const getToken = () => {
  return localStorage.getItem("token");
};

// ==============================
// GET USER PROFILE
// ==============================

export const getUserProfile = async () => {

  const res = await axios.get(
    `${SERVER}/api/users/get`,
    {
      headers:{
        Authorization:`Bearer ${getToken()}`
      }
    }
  );

  return res.data;
};


// ==============================
// UPDATE USER PROFILE
// ==============================

export const updateUserProfile = async (userId,data) => {

  const res = await axios.put(
    `${SERVER}/api/users/update/${userId}`,
    data,
    {
      headers:{
        Authorization:`Bearer ${getToken()}`
      }
    }
  );

  return res.data;
};


// ==============================
// GET USER VEHICLES
// ==============================

export const getUserVehicles = async () => {

  const res = await axios.get(
    `${SERVER}/vehicles/get`,
    {
      headers:{
        Authorization:`Bearer ${getToken()}`
      }
    }
  );

  return res.data;
};


// ==============================
// GET USER RESERVATIONS
// ==============================

export const getUserReservations = async () => {

  const res = await axios.get(
    `${SERVER}/reservations/user`,
    {
      headers:{
        Authorization:`Bearer ${getToken()}`
      }
    }
  );

  return res.data;
};


// ==============================
// CREATE RESERVATION
// ==============================

export const createReservation = async (data) => {

  const res = await axios.post(
    `${SERVER}/reservations/create`,
    data,
    {
      headers:{
        Authorization:`Bearer ${getToken()}`
      }
    }
  );

  return res.data;
};


// ==============================
// CANCEL RESERVATION
// ==============================

export const cancelReservation = async (reservationId) => {

  const res = await axios.put(
    `${SERVER}/reservations/update/${reservationId}`,
    { status: "cancelled" },
    {
      headers:{
        Authorization:`Bearer ${getToken()}`
      }
    }
  );

  return res.data;
};

// ==============================
// EXTEND RESERVATION
// ==============================

export const extendReservation = async (reservationId) => {

  const res = await axios.put(
    `${SERVER}/reservations/extend/${reservationId}`,
    {},
    {
      headers:{
        Authorization:`Bearer ${getToken()}`
      }
    }
  );

  return res.data;

};