import './App.css';
import 'boxicons';
import { useState, useEffect, useRef } from 'react';
import Structure from './components/Structure';
import Header from './components/Header';
import LeftSideBar from './components/LeftSIdeBar';
import Auth from './components/Auth'; 
// import TheVISAI from './components/TheVISAI';
import { ToastContainer } from 'react-toastify';
import { auth } from "./components/Firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {

  const [width, setWidth] = useState(window.innerWidth);
  const [user, setUser] = useState(null);
  const [isSideBarOpen, setSideBarOpen] = useState(false);
  const [isAuthOpen, setAuthOpen] = useState(false);

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
    <div className="baloo-paaji-2-BaseFont1 transition-all ease-linear duration-300">
      {/* Header */}
      <Header
        onMenuClick={toggleSideBar}
        isSideBarOpen={isSideBarOpen}
        Auth={toggleAuth}
        user={user}
        setUser={setUser}
      />

      {/* Sidebar */}
      <div ref={width < 780 ? sideBarRef : null}>
        <LeftSideBar isOpen={isSideBarOpen} user={user} />
      </div>

      {/* Auth */}
      {(!user && !isAuthOpen) && <Auth closeAuth={toggleAuth} setUser={setUser} />}

      {/* Main Structure */}
      <Structure currentWidth={width} />
      {/* <TheVISAI/> */}
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default App;
