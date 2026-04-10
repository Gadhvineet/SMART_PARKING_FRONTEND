import React, { useEffect, useState } from "react";

function Navbar() {

  const [user,setUser] = useState(null);

  useEffect(()=>{
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  },[]);

  const handleLogout = () => {

    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if(confirmLogout){

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href="/login";
    }
  };

  return (

    <div className="w-full bg-[#020617] text-white px-6 py-4 flex justify-between items-center">

      <h1
        className="font-bold text-lg cursor-pointer"
        onClick={()=>window.location.href="/user"}
      >
        FindPark
      </h1>

      <div className="flex gap-6 items-center">

        <span
          className="cursor-pointer"
          onClick={()=>window.location.href="/profile"}
        >
          {user?.name}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-1 rounded"
        >
          Logout
        </button>

      </div>

    </div>

  );

}

export default Navbar;