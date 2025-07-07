import './App.css';
import 'boxicons';
import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import LeftSideBar from './components/LeftSIdeBar';
import { ToastContainer } from 'react-toastify';
import { auth } from "./components/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import Core from './pages/Core';

import { IoSettingsOutline } from "react-icons/io5";
import { RiToolsLine, RiRobot3Line } from "react-icons/ri";

const settingsSections = [
  {
    key: "My Model",
    icon: <RiRobot3Line className="mr-2" />,
    content: (
      <div>
        <h2 className="text-lg font-semibold mb-3">My Model Settings</h2>
        <ul className="list-disc pl-5 text-base">
          <li>View and switch between available AI models</li>
          <li>See current model capabilities</li>
          <li>Set your preferred default model</li>
        </ul>
      </div>
    ),
  },
  {
    key: "Customize Model",
    icon: <RiToolsLine className="mr-2" />,
    content: (
      <div>
        <h2 className="text-lg font-semibold mb-3">Customize Model Settings</h2>
        <ul className="list-disc pl-5 text-base">
          <li>Adjust AI creativity (temperature, max tokens, etc.)</li>
          <li>Enable/disable multimodal features</li>
          <li>Set language or tone preferences</li>
        </ul>
      </div>
    ),
  },
  {
    key: "General",
    icon: <IoSettingsOutline className="mr-2" />,
    content: (
      <div>
        <h2 className="text-lg font-semibold mb-3">General Settings</h2>
        <ul className="list-disc pl-5 text-base">
          <li>Manage account details</li>
          <li>Export or clear chat history</li>
          <li>Notification preferences</li>
          <li>Theme and accessibility options</li>
        </ul>
      </div>
    ),
  },
];


function App() {
  const [home, SetHome] = useState(true);
  const [width, setWidth] = useState(window.innerWidth);
  const [user, setUser] = useState(null);
  const [isSideBarOpen, setSideBarOpen] = useState(false);
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Gemini"); // State for model selection
  const [profOpen, setProfOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(settingsSections[0].key);

  const sideBarRef = useRef(null);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Toggle Sidebar
  const toggleSideBar = () => {
    setSideBarOpen((prev) => !prev);
  };

  // Toggle Auth
  const toggleAuth = () => {
    setAuthOpen((prev) => !prev);
  };

  // Handle clicks outside the sidebar
  const handleClickOutside = (event) => {
    if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
      setSideBarOpen(false);
    }
  };

  // Add/remove click event listener based on sidebar state
  useEffect(() => {
    if (isSideBarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSideBarOpen]);


    // Check for user login status
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user); // Update user state based on authentication status
      });
  
      return () => unsubscribe();
    }, []);



  return (
    <div className={`text-md transition-all ease-linear duration-300 ${width > 901? (isSideBarOpen ? "w-[80%]  ml-[20%] " : "w-[100%]") : ""}`}>
      {/* Header */}
      <Header
        onMenuClick={toggleSideBar}
        isSideBarOpen={isSideBarOpen}
        Auth={toggleAuth}
        user={user}
        setUser={setUser}
        selectedModel={selectedModel} // Pass state
        setSelectedModel={setSelectedModel} // Pass setter function
        SetHome={SetHome}
        setProfOpen={setProfOpen}
        profOpen={profOpen}
        settingsSections={settingsSections}
        setModalOpen={setModalOpen}
        setActiveSection={setActiveSection}
      />

       {/* Sidebar */}
      <div ref={width < 901 ? sideBarRef : null}>
        <LeftSideBar isOpen={isSideBarOpen}  SetHome={SetHome} user={user}/>
      </div>
     
       <Core isAuthOpen={isAuthOpen} home={home} selectedModel={selectedModel} width={width}
       isSideBarOpen={isSideBarOpen} profOpen={profOpen}  user={user}
       toggleAuth={toggleAuth} setUser={setUser} modalOpen={modalOpen}
       settingsSections={settingsSections} activeSection={activeSection} setActiveSection={setActiveSection} setModalOpen={setModalOpen}
       SetHome={SetHome}
       />
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default App;
