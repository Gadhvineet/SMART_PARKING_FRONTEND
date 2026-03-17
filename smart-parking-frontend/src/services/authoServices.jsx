import axios from "axios"
import { data } from "react-router-dom"

const API_URL = "http://localhost:5000/api/auth" 

export const registerUser = async (data) => {
    const res = await axios.post(`${API_URL}/register`, data);
    return res.data;
}

