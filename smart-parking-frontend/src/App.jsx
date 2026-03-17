import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/navbar"

import Home from "./pages/home"
import Login from "./pages/login"
import Signup from "./pages/signup"

function App() {
  return (
    <BrowserRouter>
     <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App