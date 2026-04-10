import React,{useState} from "react";
import { getUserProfile, updateUserProfile } from "../services/userServices";

function ProfilePage(){

const user = JSON.parse(localStorage.getItem("user"));

const [name,setName] = useState(user.name);
const [email,setEmail] = useState(user.email);

const handleUpdate = async()=>{

try{

await updateUserProfile(user._id,{name,email});

alert("Profile updated");

localStorage.setItem("user",JSON.stringify({...user,name,email}));

}catch(err){
console.log(err);
}

};

return(

<div className="min-h-screen bg-slate-50 p-10">

<div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow">

<h2 className="text-2xl font-bold mb-6">
Profile Settings
</h2>

<input
className="border w-full mb-4 p-2"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
className="border w-full mb-4 p-2"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<button
onClick={handleUpdate}
className="bg-black text-white px-6 py-2 rounded"
>
Update Profile
</button>

</div>

</div>

);
}

export default ProfilePage;