import axios from "axios";

const SERVER = import.meta.env.VITE_API_URL;

const getToken = () => {
  return localStorage.getItem("token");
};

// ==============================
// GET USER NOTIFICATIONS
// ==============================
export const getNotifications = async () => {
  const res = await axios.get(
    `${SERVER}/api/notifications`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );
  return res.data;
};

// ==============================
// MARK SINGLE AS READ
// ==============================
export const markNotificationAsRead = async (id) => {
  const res = await axios.put(
    `${SERVER}/api/notifications/${id}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );
  return res.data;
};

// ==============================
// MARK ALL AS READ
// ==============================
export const markAllNotificationsAsRead = async () => {
  const res = await axios.put(
    `${SERVER}/api/notifications/read-all`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );
  return res.data;
};
