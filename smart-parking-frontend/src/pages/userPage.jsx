import React from "react";

function UserPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>User Dashboard</h1>

      <hr />

      {}
      <div>
        <h2>Search Parking</h2>
        <input type="text" placeholder="Enter location..." />
        <button>Search</button>
      </div>

      <hr />

      {}
      <div>
        <h2>Available Parking Slots</h2>
        <p>No parking data yet...</p>
      </div>

      <hr />

      {}
      <div>
        <h2>My Bookings</h2>
        <p>No bookings yet...</p>
      </div>

    </div>
  );
}

export default UserPage;