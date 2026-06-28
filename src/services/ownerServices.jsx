import axios from "axios";

const SERVER_URL = import.meta.env.VITE_API_URL;

// GET TOKEN
const getToken = () => {
  return localStorage.getItem("token");
};

// COMMON AUTH HEADER
const authHeader = () => {
  return {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  };
};

// ===============================
// PARKING LOT SERVICES
// ===============================

// GET OWNER PARKING LOTS
export const getOwnerParkingLots = async () => {
  const res = await axios.get(
    `${SERVER_URL}/parkinglots/get`,
    authHeader()
  );

  return res.data.parkingLots;
};

// CREATE PARKING LOT
export const createParkingLot = async (data) => {
  const res = await axios.post(
    `${SERVER_URL}/parkinglots/create`,
    data,
    authHeader()
  );

  return res.data;
};

// UPDATE PARKING LOT
export const updateParkingLot = async (id, data) => {
  const res = await axios.put(
    `${SERVER_URL}/parkinglots/update/${id}`,
    data,
    authHeader()
  );

  return res.data;
};

// DELETE PARKING LOT
export const deleteParkingLot = async (id) => {
  const res = await axios.delete(
    `${SERVER_URL}/parkinglots/delete/${id}`,
    authHeader()
  );

  return res.data;
};

// ===============================
// SLOT SERVICES
// ===============================

// GET SLOTS BY LOT
export const getSlotsByLot = async (lotId) => {
  const res = await axios.get(
    `${SERVER_URL}/slots/lot/${lotId}`,
    authHeader()
  );

  return res.data.slots;
};

// CREATE MULTIPLE SLOTS
export const createSlots = async (parkingLotId, slotsArray) => {
  const res = await axios.post(
    `${SERVER_URL}/slots/create-multiple`,
    {
      parkingLot: parkingLotId,
      slots: slotsArray
    },
    authHeader()
  );

  return res.data;
};

// DELETE SLOT
export const deleteSlot = async (slotId) => {
  const res = await axios.delete(
    `${SERVER_URL}/slots/delete/${slotId}`,
    authHeader()
  );

  return res.data;
};

// ===============================
// OWNER BOOKING SERVICES
// ===============================

// GET OWNER BOOKINGS
export const getOwnerBookings = async () => {
  const res = await axios.get(
    `${SERVER_URL}/reservations/owner`,
    authHeader()
  );

  return res.data.reservations;
};

// GET ACTIVE BOOKINGS COUNT
export const getActiveBookings = async () => {
  const res = await axios.get(
    `${SERVER_URL}/reservations/owner-active`,
    authHeader()
  );

  return res.data.count;
};

// GET OWNER ANALYTICS
export const getOwnerAnalytics = async () => {
  const res = await axios.get(
    `${SERVER_URL}/reservations/owner-analytics`,
    authHeader()
  );

  return res.data;
};

// ===============================
// OWNER BOOKING ACTIONS
// ===============================

// MARK BOOKING COMPLETED
export const completeBooking = async (reservationId) => {
  const res = await axios.put(
    `${SERVER_URL}/reservations/update/${reservationId}`,
    { status: "completed" },
    authHeader()
  );

  return res.data;
};

// CANCEL BOOKING
export const cancelBooking = async (reservationId) => {
  const res = await axios.put(
    `${SERVER_URL}/reservations/update/${reservationId}`,
    { status: "cancelled" },
    authHeader()
  );

  return res.data;
};

// ===============================
// OWNER REVIEW SERVICES
// ===============================

// GET OWNER REVIEWS
export const getOwnerReviews = async () => {
  const res = await axios.get(
    `${SERVER_URL}/reviews/owner`,
    authHeader()
  );

  return res.data.reviews;
};