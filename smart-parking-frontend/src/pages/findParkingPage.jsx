import React, { useEffect, useState } from "react";
import axios from "axios";
import { createReservation, getUserVehicles } from "../services/userServices";

function FindParkingPage() {

const [parkingLots,setParkingLots] = useState([]);
const [slots,setSlots] = useState([]);
const [vehicles,setVehicles] = useState([]);

const [selectedLot,setSelectedLot] = useState(null);
const [selectedSlot,setSelectedSlot] = useState(null);
const [selectedVehicle,setSelectedVehicle] = useState(null);

// NEW STATES
const [date,setDate] = useState("");
const [startTime,setStartTime] = useState("");
const [endTime,setEndTime] = useState("");

const token = localStorage.getItem("token");


// FETCH PARKING LOTS
const fetchParkingLots = async()=>{

const res = await axios.get(
"http://localhost:5000/parkinglots/all",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

setParkingLots(res.data.parkingLots);

};


// FETCH VEHICLES
const fetchVehicles = async()=>{

const res = await getUserVehicles();
setVehicles(res.vehicles);

};


// FETCH SLOTS
const fetchSlots = async(lotId)=>{

const res = await axios.get(
`http://localhost:5000/slots/lot/${lotId}`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

setSlots(res.data.slots);
};


// CLICK BOOK
const handleSelectLot = async(lotId)=>{

setSelectedLot(lotId);

fetchSlots(lotId);

fetchVehicles();

};


// FINAL BOOKING
const handleBooking = async()=>{

if(!selectedSlot || !selectedVehicle || !date || !startTime || !endTime){

alert("Please fill all booking details");

return;

}

// COMBINE DATE + TIME
const startDateTime = new Date(`${date}T${startTime}`);
const endDateTime = new Date(`${date}T${endTime}`);

if(endDateTime <= startDateTime){
alert("End time must be after start time");
return;
}

const data = {

vehicle:selectedVehicle,
parkingLot:selectedLot,
slot:selectedSlot,

timePeriod:{
startTime:startDateTime,
endTime:endDateTime
}

};

await createReservation(data);

alert("Parking booked successfully");

};


useEffect(()=>{
fetchParkingLots();
},[]);


return(

<div className="min-h-screen bg-slate-50 p-10">

<h1 className="text-3xl font-bold text-center mb-10">
Find Available Parking
</h1>


{/* PARKING LOTS */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

{parkingLots.map((parking)=>(

<div key={parking._id}
className="bg-white rounded-2xl p-6 shadow border">

<h2 className="text-xl font-bold mb-3">
{parking.name}
</h2>

<p>City: {parking.location?.city}</p>

<p>Slots: {parking.availableSlots}</p>

<p>Price: ₹{parking.pricePerHour}</p>

<button
onClick={()=>handleSelectLot(parking._id)}
className="w-full mt-4 py-2 rounded-lg bg-black text-white">

Book Parking

</button>

</div>

))}

</div>


{/* SLOT SELECTOR */}

{selectedLot && (

<div className="mt-10">

<h2 className="text-xl font-bold mb-4">
Select Slot
</h2>

<div className="flex flex-wrap gap-3">

{slots.map(slot=>(

<button
key={slot._id}
onClick={()=>setSelectedSlot(slot._id)}
className="px-4 py-2 border rounded">

{slot.slotNumber}

</button>

))}

</div>

</div>

)}


{/* VEHICLE SELECTOR */}

{selectedLot && (

<div className="mt-10">

<h2 className="text-xl font-bold mb-4">
Select Vehicle
</h2>

<select
onChange={(e)=>setSelectedVehicle(e.target.value)}
className="border p-2"
>

<option>Select Vehicle</option>

{vehicles.map(v=>(

<option key={v._id} value={v._id}>
{v.vehicleNumber}
</option>

))}

</select>

</div>

)}


{/* DATE & TIME SELECTOR */}

{selectedLot && (

<div className="mt-10">

<h2 className="text-xl font-bold mb-4">
Select Date & Time
</h2>

<input
type="date"
value={date}
onChange={(e)=>setDate(e.target.value)}
className="border p-2 mr-3"
/>

<input
type="time"
value={startTime}
onChange={(e)=>setStartTime(e.target.value)}
className="border p-2 mr-3"
/>

<input
type="time"
value={endTime}
onChange={(e)=>setEndTime(e.target.value)}
className="border p-2"
/>

<button
onClick={handleBooking}
className="ml-4 bg-black text-white px-6 py-2 rounded">

Reserve

</button>

</div>

)}

</div>

);

}

export default FindParkingPage;