import React, { useContext, useState, useEffect } from 'react';
import Profile from './Profile';
import { Context } from '../context/Context';
import { signOut } from 'firebase/auth';
import { auth } from "./Firebase";


export default function Header({ onMenuClick, isSideBarOpen, Auth, user, setUser }) {
  const [isOpen, setOpen] = useState(false);
  const [onMenu, setOnMenu] = useState(false);
  const [newChat, setNewChat] = useState(false);
  const [drop, setDrop] = useState(false);
  const { newChats } = useContext(Context);
  

  const [profileImage, setProfileImage] = useState(null);  

  const toggleProfile = () => {
    setOpen(!isOpen);
  };

    // Get user profile image or fallback
    useEffect(() => {
      if (user && user.photoURL) {
        setProfileImage(user.photoURL);
      }
    }, [user]);
  
    const handleProfileImage = (img) => {
      setProfileImage(img);  // Update the profile image in the parent
    };

     // Logout function
     const handleLogout = () => {
      signOut(auth) // Sign the user out from Firebase
        .then(() => {
          setUser(null); // Clear the user state in your app
          toast.success("Logged out successfully!", {
            position: "top-center",
            autoClose: 500,
          });
        })
        .catch((error) => {
          toast.error(error.message, {
            position: "bottom-center",
            autoClose: 1000,
          });
        });
      };
  return (
    <div
      className={`z-50 fixed flex flex-nowrap justify-between items-center p-2 transition-all translate-x-0 duration-300 h-12 ${
        isSideBarOpen ? 'w-[80%] right-0' : 'w-full'
      }`}
    >
      {/* Left Section */}
      <div className="flex flex-nowrap w-auto gap-2 text-md">
        {/* Sidebar Toggle Button */}
        <button
          className="w-auto h-auto border-[1px] border-zinc-800 rounded-lg px-2 pt-1 hover:bg-zinc-900"
          onMouseLeave={() => setOnMenu(false)}
          onMouseEnter={() => setOnMenu(true)}
          onClick={onMenuClick}
        >
          <i className="bx bx-sidebar"></i>
          <p
            className={`absolute w-auto h-auto border-[1px] border-zinc-800 rounded-md p-1 text-sm -translate-x-1 opacity-0 transition-all duration-300 ${
              onMenu ? 'opacity-100 translate-y-2' : ''
            }`}
          >
            Toggle Sidebar
          </p>
        </button>

        {/* New Chat Button */}
        {!isSideBarOpen && (
          <button
            className="w-auto h-auto border-[1px] border-zinc-800 rounded-lg px-2 pt-1 hover:bg-zinc-900"
            onMouseEnter={() => setNewChat(true)}
            onMouseLeave={() => setNewChat(false)}
            onClick={() => newChats()}
          >
            <i className="bx bx-plus"></i>
            <p
              className={`absolute w-auto h-auto border-[1px] border-zinc-800 rounded-md p-1 text-sm -translate-x-1 opacity-0 transition-all duration-300 ${
                newChat ? 'opacity-100 translate-y-2' : ''
              }`}
            >
              New Chat
            </p>
          </button>
        )}

        {/* Dropdown Menu */}
        <button
          className="h-auto w-auto border-[1px] text-md border-zinc-800 rounded-md px-2 pt-1 flex gap-1 hover:bg-zinc-900"
          onClick={() => setDrop(!drop)}
        >
          <h2>VISUAL-AI</h2>
          <div className="w-5 pt-0.5">
            <i className="bx bx-chevron-down"></i>
          </div>
          {drop && (
            <div
              className={`absolute flex flex-col w-44 h-auto mt-8 border-[1px] border-zinc-800 rounded-md px-2 gap-1 opacity-0 -translate-x-1 transition-all duration-300 ${
                drop ? 'opacity-100 translate-y-1' : ''
              }`}
            >
              <button className="">GPT-4.0</button>
              <button className="">Jarvis-2</button>
            </div>
          )}
        </button>
      </div>

      {/* Profile Section */}
      <button
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
            src={profileImage}
            className="w-[30px] h-[30px] rounded-full"
            alt="Profile"
          />
        )}

        {/* Profile Dropdown */}
        {isOpen && (
          <div
            className={`h-auto w-auto p-2 right-1 flex flex-col absolute bg-zinc-900 bg-opacity-60 border-[1px] border-slate-700 rounded-lg transition-all duration-300 translate-y-4`}
          >
            <div>
              <Profile getProfileImage={handleProfileImage} />
              <button
                className="text-sm border-[1px] border-zinc-700 bg-zinc-700 h-auto w-full px-3 py-1 rounded-md hover:bg-zinc-800 transition duration-300"
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
