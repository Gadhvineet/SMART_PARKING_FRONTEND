import { useState } from "react";
import { registerUser } from "../services/authServices";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "",
    role: "user"   
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await registerUser(formData);
      alert("Account Created");
      navigate("/login");
    } catch (error) {
      alert("Signup Error");
    }
  };

  return (
    <div>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>

        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
        <br />

        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <br />

        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <br />

        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
        <br />

        {}
        <select name="role" onChange={handleChange}>
          <option value="user">User</option>
          <option value="owner">Parking Owner</option>
        </select>
        <br />

        <button type="submit">Join</button>

      </form>
    </div>
  );
}

export default Signup;