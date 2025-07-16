import { useContext, useState, useEffect, useRef, useCallback } from 'react';
import Profile from './Profile';
import { Context } from '../context/Context';
import { signOut } from 'firebase/auth';
import { auth, db } from "./Firebase";
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { IoCheckmarkCircle } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import { MdError } from "react-icons/md";

export default function Header({
  onMenuClick,
  isSideBarOpen,
  Auth,
  user,
  setUser,
  selectedModel,
  setSelectedModel,
  SetHome,
  setProfOpen,
  settingsSections,
  setActiveSection,
  setModalOpen
}) {
  const [isOpen, setOpen] = useState(false);
  const [onMenu, setOnMenu] = useState(false);
  const [newChat, setNewChat] = useState(false);
  const [drop, setDrop] = useState(false);
  const { newChats } = useContext(Context);

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
    } else {
      setUserDetails(null);
      setProfileImage(null);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [user, fetchUserData]);

  // Close dropdowns/profile on outside click or model/user change
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) 
      ) {
        setDrop(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setOpen(false);
        setProfOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setProfOpen]);

  useEffect(() => {
    setDrop(false);
    setOpen(false);
  }, [selectedModel]);

  // Toggle dropdown menu
  const toggleDropdown = useCallback(() => setDrop((prev) => !prev), []);
  // Toggle profile dropdown
  const toggleProfile = useCallback(() => {
    setOpen((prev) => !prev);
    setProfOpen((prev) => !prev);
  }, [setProfOpen]);

  // Logout function
  const handleLogout = useCallback(() => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setUserDetails(null);
        setProfileImage(null);
        toast.success("Logged out successfully!", {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: true,
          icon: <TiTick />
        });
      })
      .catch((error) => {
        toast.error(error.message, {
          className: "custom-toast",
          autoClose: 1000,
          icon: <MdError />
        });
      });
  }, [setUser]);

  return (
    <header className="flex justify-between items-center px-2 h-12 right-0 w-full theme-text theme-bg z-40 border-b theme-border">
      {/* Left Section */}
      <div className="flex flex-nowrap w-auto gap-2">
        {/* Sidebar Toggle Button */}
        <button
          className="relative cursor-pointer w-auto h-auto border theme-border theme-button rounded-lg px-2 pt-1"
          onMouseLeave={() => setOnMenu(false)}
          onMouseEnter={() => setOnMenu(true)}
          onClick={onMenuClick}
          aria-label="Toggle Sidebar"
        >
          <i className="bx bx-sidebar"></i>
          <span className={`absolute top-8 left-5 w-26 h-auto border theme-border rounded-sm p-1 sm:text-sm text-xs -translate-x-1 opacity-0 transition-all duration-300 z-50 ${
            onMenu ? 'opacity-100 translate-y-2 theme-bg-comp' : ''
          }`}>
            Toggle Sidebar
          </span>
        </button>

        {/* New Chat Button */}
        {!isSideBarOpen && (
          <button
            className="relative cursor-pointer w-auto h-auto border theme-border rounded-lg px-2 pt-1 theme-button"
            onMouseEnter={() => setNewChat(true)}
            onMouseLeave={() => setNewChat(false)}
            onClick={() => {
              newChats();
              SetHome(true);
            }}
            aria-label="New Chat"
          >
            <i className="bx bx-plus"></i>
            <span className={`absolute top-8 w-18 h-auto border theme-border rounded-sm p-1 sm:text-sm text-xs -translate-x-1 opacity-0 transition-all duration-300 z-50 ${
              newChat ? 'opacity-100 translate-y-2 theme-bg-comp' : ''
            }`}>
              New Chat
            </span>
          </button>
        )}

        {/* Dropdown Button */}
        <button
          ref={dropdownButtonRef}
          className="sm:text-sm text-xs cursor-pointer h-auto w-auto border theme-border rounded-md px-2 pt-1.5 sm:pt-0.5 flex gap-1 theme-button"
          onClick={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={drop}
        >
          <h2>{selectedModel}</h2>
          <div className="w-5 pt-0.5">
            <i className="bx bx-chevron-down"></i>
          </div>
        </button>

        {/* Dropdown Menu */}
        {drop && (
          <div
            ref={dropdownRef}
            className="absolute sm:text-sm text-xs px-2 py-2 flex flex-col w-auto mt-8 ml-[5.2rem] border theme-border rounded-md gap-2 theme-bg-comp custom-scrollbar overflow-y-auto transition-all duration-300 z-50"
            style={{ maxHeight: "10rem" }}
            role="listbox"
          >
            {models.map((model, index) => (
              <button
                key={index}
                className={`cursor-pointer flex items-center flex-row justify-between gap-2 theme-text py-1 theme-shadow shadow-sm px-2 rounded-md ${
                  selectedModel === model.name
                    ? "theme-selected"
                    : "theme-button3"
                }`}
                onClick={() => {
                  setSelectedModel(model.name);
                  setDrop(false);
                  newChats();
                  SetHome(true);
                }}
                aria-selected={selectedModel === model.name}
              >
                <div className="w-fit flex flex-col justify-between items-start gap-1">
                  <span className="left-0 text-left w-full">{model.name}</span>
                  <span className="text-xs opacity-60">{model.description}</span>
                </div>
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
        className={`w-auto cursor-pointer sm:text-sm text-xs ${
          user
            ? 'rounded-full p-0.5 h-auto theme-button'
            : 'login px-2 py-1 rounded-md'
        }`}
        onClick={user ? toggleProfile : Auth}
      >
        {!user ? (
          'Login'
        ) : (
          <img
            src={profileImage || "https://via.placeholder.com/30"}
            className="w-[35px] h-[35px] rounded-full border-1 theme-border"
            alt="Profile"
          />
        )}
        
      </button>

      {/* Profile Dropdown */}
      {isOpen && user && (
        <div
          ref={profileRef}
          className="absolute z-50 theme-bg-comp top-13 h-auto w-auto p-2 right-1 flex flex-col border theme-border rounded-lg"
        >
          <Profile
            userDetails={userDetails}
            settingsSections={settingsSections}
            setModalOpen={setModalOpen}
            setActiveSection={setActiveSection}
          />
          <button
            className="cursor-pointer text-xs sm:text-sm border theme-border theme-button h-auto w-full px-3 py-1 rounded-md transition duration-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
