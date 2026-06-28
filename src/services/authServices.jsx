import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

// ==============================
// REGISTER
// ==============================

export const registerUser = async (data) => {

  const res = await axios.post(
    `${API_URL}/register`,
    data
  );

  return res.data;
};


// ==============================
// LOGIN
// ==============================

export const loginUser = async (data) => {

  const res = await axios.post(
    `${API_URL}/login`,
    data
  );

  return res.data; // important
};