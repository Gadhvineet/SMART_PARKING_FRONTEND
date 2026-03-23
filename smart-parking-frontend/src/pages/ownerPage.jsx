import React from "react";

function OwnerPage() {
  return (
    <div>
      <h1>Owner Dashboard</h1>

      <h2>Add Parking</h2>
      <input type="text" placeholder="Parking Name" />
      <br />
      <input type="text" placeholder="Location" />
      <br />
      <input type="number" placeholder="Total Slots" />
      <br />
      <button>Add Parking</button>

      <h2>My Parking Lots</h2>
      <p>No data yet...</p>
    </div>
  );
}

export default OwnerPage;