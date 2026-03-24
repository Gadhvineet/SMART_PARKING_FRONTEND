// import axios from "axios"

// const API_URL = "http://localhost:5000/api/users"

// export const registerUser = async (data) => {
//     const res = await axios.post(`${API_URL}/register`, data)
//     return res.data
// }

// export const loginUser = async (data) => {
//   const res = await axios.post("/api/users/login", data);
//   return res.data;
// };

import axios from "axios"

const API_URL = "http://localhost:5000/api/users"


export const registerUser = async (data) => {
    const res = await axios.post(`${API_URL}/register`, data)
    return res.data
}


export const loginUser = async (data) => {
    const res = await axios.post(`${API_URL}/login`, data)

   
    localStorage.setItem("token", res.data.token)
    localStorage.setItem("user", JSON.stringify(res.data.user))

    return res.data
}