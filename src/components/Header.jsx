import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import Profile from './Profile';
import { Context } from '../context/Context';
import { signOut } from 'firebase/auth';
import { auth, db } from "./Firebase";
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { IoCheckmarkCircle } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import { MdError } from "react-icons/md";

export default function Header({ onMenuClick, isSideBarOpen, Auth, user, setUser, selectedModel, setSelectedModel, SetHome, setProfOpen, profOpen}) {
  const [isOpen, setOpen] = useState(false);
  const [onMenu, setOnMenu] = useState(false);
  const [newChat, setNewChat] = useState(false);
  const [drop, setDrop] = useState(false);
  const { newChats, setIsSpeaking} = useContext(Context);
  const models = [
    { name: "Gemini", description: "Enhanced contextual understanding" },
    { name: "VISUAL-AI", description: "Advanced multimodal AI capabilities" },
    { name: "Open-AI", description: "High accuracy and deep reasoning" },
    { name: "Llama-3", description: "Fast and efficient for real-time tasks" },
    { name: "Claude-Next", description: "Optimized for multitasking" },
    { name: "Mistral-AI", description: "Compact and lightweight" }
  ];

  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  const profileButtonRef = useRef(null);

  const [profileImage, setProfileImage] = useState(null);  
  const [userDetails, setUserDetails] = useState(null);

  // Fetch user data when user logs in
  const fetchUserData = useCallback(async () => {
    if (user) {
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserDetails(userData);
        setProfileImage(userData.profileImage);
      }
    }
  }, [user]);

   useEffect(() => {
    fetchUserData(); 
  }, [user, fetchUserData]);

  // Close profile when clicking outside
  useEffect(() => {

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(event.target)
      ) {
        setDrop(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setOpen(false);
        setProfOpen(profOpen);
      }

    };

      document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

   // Toggle dropdown menu
   const toggleDropdown = () => {
    setDrop((prev) => !prev);
  };

  // Toggle profile dropdown
  const toggleProfile = () => {
    setOpen((prev) => !prev);
    setProfOpen(!profOpen);
  };

  // Logout function
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setUserDetails(null);
        setProfileImage(null);
        toast.success("Logged out successfully!", {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: true, 
          icon : <TiTick/>
        });
      })
      .catch((error) => {
        toast.error(error.message, {
          className: "custom-toast",
          autoClose: 1000,
          icon : <MdError/>
        });
      });
  };

  return (
    <div
      className={`flex flex-nowrap justify-between items-center p-2 transition-all translate-x-0 duration-300 h-12 right-0`}
    >
      {/* Left Section */}
      <div className="flex flex-nowrap w-auto gap-2 text-md">
        {/* Sidebar Toggle Button */}
        <button
          className="cursor-pointer w-auto h-auto border-[1px] border-zinc-800 rounded-lg px-2 pt-1 hover:bg-zinc-900"
          onMouseLeave={() => setOnMenu(false)}
          onMouseEnter={() => setOnMenu(true)}
          onClick={onMenuClick}
        >
          <i className="bx bx-sidebar"></i>
          <p className={`absolute w-auto h-auto border-[1px] border-zinc-800 rounded-md p-1 text-sm -translate-x-1 opacity-0 transition-all duration-300 ${
            onMenu ? 'opacity-100 translate-y-2' : ''
          }`}>
            Toggle Sidebar
          </p>
        </button>

        {/* New Chat Button */}
        {!isSideBarOpen && (
          <button
            className="cursor-pointer w-auto h-auto border-[1px] border-zinc-800 rounded-lg px-2 pt-1 hover:bg-zinc-900"
            onMouseEnter={() => setNewChat(true)}
            onMouseLeave={() => setNewChat(false)}
            onClick={() => {
              newChats(); 
              SetHome(true);
             } 
            }
          >
            <i className="bx bx-plus"></i>
            <p className={`absolute w-auto h-auto border-[1px] border-zinc-800 rounded-md p-1 text-sm -translate-x-1 opacity-0 transition-all duration-300 ${
              newChat ? 'opacity-100 translate-y-2' : ''
            }`}>
              New Chat
            </p>
          </button>
        )}

         {/* Dropdown Button */}
      <button
        ref={dropdownButtonRef}
        className="cursor-pointer h-auto w-auto border-[1px] text-md border-zinc-800 rounded-md px-2 pt-1 flex gap-1 hover:bg-zinc-900"
        onClick={toggleDropdown}
      >
        <h2>{selectedModel}</h2>
        <div className="w-5 pt-0.5">
          <i className="bx bx-chevron-down"></i>
        </div>
      </button>

       {/* Dropdown Menu */}
      {drop && (
        <div  ref={dropdownRef}
          className="absolute flex flex-col w-auto mt-10 ml-[5.2rem] border-[1px] border-zinc-800 rounded-md px-1 gap-2 bg-black custom-scrollbar overflow-y-auto transition-all duration-300"
          style={{ maxHeight: "6rem",
              // background: "linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(20, 20, 20, 0.5) 100%)",
           }} 
        >
          {models.map((model, index) => (
            <button
              key={index}
              className={`cursor-pointer flex items-center flex-row justify-between gap-2 text-white py-1 px-2 rounded-md ${
                selectedModel === model.name
                  ? "bg-zinc-900"
                  : "hover:bg-zinc-700"
              }`}
              onClick={() => {
                setSelectedModel(model.name);
                setDrop(false); // Close dropdown after selecting
                newChats();
                SetHome(true);
                setIsSpeaking(false);
              }}
             
            >
              <div className=" w-fit flex flex-col justify-between items-start gap-1" >

              {/* Model Name */}
              <span className="left-0">{model.name}</span>
             
              {/* Model Description */}
              <span className="text-sm opacity-75">{model.description}</span>
              
                           
              </div>

                {/* Checkmark Icon */}
              {selectedModel === model.name && (
                <IoCheckmarkCircle className="text-green-500 mr-2" />
              )} 
            </button>
          ))}
        </div>
        )}
      </div>

      {/* Profile Section */}
      <button
      ref={profileButtonRef}
        className={`w-auto text-sm cursor-pointer ${
          user
            ? 'rounded-full p-1 h-auto hover:bg-zinc-800'
            : 'bg-white h-full px-2 text-black hover:bg-gray-200 rounded-md'
        }`}
        onClick={user ? toggleProfile : Auth}
      >
        {!user ? (
          'Login'
        ) : (
          <img
            src={profileImage || "https://via.placeholder.com/30"} // Fallback image
            className="w-[30px] h-[30px] rounded-full"
            alt="Profile"
          />
        )}

        {/* Profile Dropdown */}
        {isOpen && (
          <div ref={profileRef} className="h-auto w-auto p-2 right-1 flex flex-col absolute bg-zinc-900 bg-opacity-60 border-[1px] border-slate-700 rounded-lg transition-all duration-300 translate-y-4">
            <div>
              <Profile />
              <button
                className="cursor-pointer text-sm border-[1px] border-zinc-700 bg-zinc-700 h-auto w-full px-3 py-1 rounded-md hover:bg-zinc-800 transition duration-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </button>
    </div>
  );
}
