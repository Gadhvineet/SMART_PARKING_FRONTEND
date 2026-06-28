import axios from "axios";

const SERVER = import.meta.env.VITE_API_URL;

const getToken = () => {
  return localStorage.getItem("token");
};

// ==============================
// GET RAZORPAY KEY
// ==============================
export const getRazorpayKey = async () => {
  const res = await axios.get(
    `${SERVER}/payments/razorpay-key`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );
  return res.data;
};

// ==============================
// CREATE ORDER
// ==============================
export const createOrder = async (data) => {
  const res = await axios.post(
    `${SERVER}/payments/create-order`,
    data,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );
  return res.data;
};

// ==============================
// VERIFY PAYMENT
// ==============================
export const verifyPayment = async (data) => {
  const res = await axios.post(
    `${SERVER}/payments/verify`,
    data,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );
  return res.data;
};
