import React from 'react';

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div>
      <h1>Welcome, {user?.name || "Operator"}</h1>
      <button onClick={handleLogout}>Logout</button>
      
      <section>
        <h2>Dashboard Status</h2>
        <p>Vehicle: Tesla Model 3</p>
        <p>Current Status: In-Session</p>
        <p>Wallet Balance: $142.50</p>
      </section>

      <section>
        <h2>Available Actions</h2>
        <ul>
          <li>Find New Parking</li>
          <li>View Vehicle List</li>
          <li>Transaction History</li>
        </ul>
      </section>
    </div>
  );
}

export default Home;