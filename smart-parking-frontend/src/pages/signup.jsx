import { useState } from "react"
import { registerUser } from "../services/authoServices"

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        const res = await registerUser(formData)
        console.log("User Registered",res)
        alert ("Registration Successful")
    } catch (error) {
        console.error("error", error)
        alert("Registration Failed")
    }
    }

    return (
        <div>
            <h1>Signup Page</h1>
            <form onSubmit={handleSubmit}>

                <div>
                    <label>Name:</label>
                    <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange} 
                    required
                    />
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Signup</button>
            </form>
        </div>
    )
}

export default Signup

       