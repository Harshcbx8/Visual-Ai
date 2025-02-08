import React, { useEffect, useState} from 'react';
import { auth, db } from './Firebase';
import { doc, getDoc } from 'firebase/firestore';
import { IoSettingsOutline } from "react-icons/io5";
import { RiToolsLine, RiRobot3Line } from "react-icons/ri";

const Profile = () =>{
  
    const [userDetails, setUserDetails] = useState(null);
  
        // Fetch user details only once
        useEffect(() => {
            const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, "Users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                setUserDetails(docSnap.data());
                }
            }
            };
            fetchUserData();
        }, []);  // Empty dependency array to run only once

       
    if (!userDetails) return (
        <div className="loading-container">
          {[...Array(3)].map((_, index) => (
          <div key={index} className="loading-row">
            <div
             className="loading-bar"
            style={{ "--bar-index": index }}
           ></div>
            </div>
           ))}
         </div>
      );
      
     const { name, email } = userDetails;
     
 return(

      <div className="flex flex-col justify-evenly  gap-1 text-xl border-b-2 border-zinc-600 mb-2">

           <div className="flex items-center justify-between cursor-auto">
            <p>Welcome</p>
            <p className="text-sm">{name}</p>
            
           </div>
            <p className="text-sm">{email}</p>

            <div className="border-t-2 border-zinc-600 flex flex-col py-1">
            <button className=" flex item-center text-sm  h-auto w-full px-3 py-1 rounded-md hover:bg-zinc-600 transition duration-300">
             < RiRobot3Line className='mr-2' /> <p className="w-fit" >My Model</p></button>
             <button className="flex items-center text-sm h-auto w-full px-3 py-1 rounded-md hover:bg-zinc-600 transition duration-300">
             <RiToolsLine className="mr-2"/> <p className="w-fit"> Customize Model </p> </button>
             <button className="flex items-center text-sm h-auto w-full px-3 py-1 rounded-md hover:bg-zinc-600 transition duration-300">
             <IoSettingsOutline className="mr-2" /> 
              <p className="w-fit">Settings</p></button>
             </div>
           
       </div>

    );
 };

 export default Profile;
