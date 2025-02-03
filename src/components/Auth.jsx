import { createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider } from 'firebase/auth';
import React,{useState} from 'react';
import { auth, db } from './Firebase';
import {setDoc, doc} from "firebase/firestore";
import { toast } from 'react-toastify';
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { TiTick } from "react-icons/ti";
import { MdError } from "react-icons/md";


const generateProfileImage = (name) => {
  const initials = name.split(" ").map((n) => n[0].toUpperCase()).join("");
  const color = "ffffff"; // Background color (you can change this if needed)
  const textColor = "000000"; // Text color set to black
  return `https://ui-avatars.com/api/?name=${initials}&background=${color}&color=${textColor}&size=128`;
};
const Auth = ({setUser, closeAuth }) => {

  const [isSignUp, setIsSignUp] = useState(false);

  const [formData, setFormData] = useState({
    firstname: '',
    lastname:'',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const provider = new GoogleAuthProvider();

     // Google Authentication
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Generate a profile image if the user does not have one
      const profileImage = user.photoURL || generateProfileImage(user.displayName || "User");

      // Save or update user details in Firestore
      const userRef = doc(db, "Users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        name: user.displayName,
        profileImage: profileImage,
      }, { merge: true });

      setUser(user);
      toast.success("Logged in with Google successfully!", {
        position: "top-center", // Position of the toast
        autoClose: 500, // Duration in milliseconds (5 seconds)
        hideProgressBar: true, 
        icon : <TiTick/>
      });
      closeAuth();
    } catch (error) {
      toast.error(error.message,{
        position: "bottom-center", // Position of the toast
        autoClose: 1000, // Duration in milliseconds (5 seconds)
        hideProgressBar: true, 
        icon: <MdError/>
      });
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Update state with logged-in user
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

   // Handle form submission
   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        // Sign up user
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        const fullName = `${formData.firstname} ${formData.lastname}`.trim();
        const profileImage = generateProfileImage(fullName);

        // Save user details in Firestore
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          name: fullName,
          profileImage,
        });

        setUser(user);
        toast.success("User Sign-Up Successfully!",{
          position: "top-center", // Position of the toast
          autoClose: 500, // Duration in milliseconds (5 seconds)
          hideProgressBar: true, 
          icon : <TiTick/>
        });
      } else {
        // Login user
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        setUser(userCredential.user);
        toast.success("User Logged-In Successfully!",{
          position: "top-center", // Position of the toast
          autoClose: 500, // Duration in milliseconds (5 seconds)
          hideProgressBar: true, 
          icon : <TiTick/>
        });
      }
      closeAuth();
    } catch (error) {
      toast.error(error.message,{
        position: "bottom-center", // Position of the toast
        hideProgressBar: true, 
        autoClose: 1000, // Duration in milliseconds (5 seconds)
        icon: <MdError/>
      });
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="inset-0 fixed w-full h-full flex items-center justify-center bg-black  z-50">
      <div className="max-w-md pl-10 pr-10 h-[80%]">

        <h2 className="text-center h-auto text-2xl font-bold text-white">
          {isSignUp ? 'Sign Up' : 'Login'}
          </h2>
          <p className="h-auto w-auto p-2 font-thin text-sm opacity-60 justify-self-center" >
          {!isSignUp ? 'Use your email and password to sign in' : 'Create an account with your email and password'}
          </p>
          
        <form className=" h-auto p-3" onSubmit={handleSubmit}>

          {isSignUp && (
            <div>

            <label htmlFor="firstname" className="text-sm opacity-60 font-thin text-white">First Name</label>
            <input type="text" name="firstname" id="firstname" value={formData.firstname} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-zinc-800 text-white rounded-md" required />

            <label htmlFor="lastname" className="text-sm opacity-60 font-thin text-white">Last Name</label>
            <input type="text" name="lastname" id="lastname" value={formData.lastname} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-zinc-800 text-white rounded-md" required />
        
            </div>
          )}

          
            <label htmlFor="email" className="text-sm opacity-60 font-thin text-white">Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-zinc-800 text-white rounded-md" required/>

            <label htmlFor="password" className="text-sm opacity-60 font-thin text-white">Password</label>
            <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-zinc-800 text-white rounded-md" required/>
        

          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" className="text-sm opacity-60 font-thin text-white">Confirm Password</label>
              <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-zinc-800 text-white rounded-md"required/>
            </div>
          )}

          <button type="submit" className="w-full py-2 mt-4 bg-white font-thin text-black rounded-md hover:bg-zinc-200 transition duration-300 cursor-pointer">
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>

        </form>
        <div className=" flex flex-row w-full items-center justify-between gap-1"><p className="bg-gray-400  h-[2px] w-[50%]"></p> <p>OR</p> <p className="bg-gray-400 h-[2px] w-[50%]"></p></div>
        <button onClick={handleGoogleSignIn} className="w-full py-2 mt-4 mb-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 cursor-pointer">
          Continue with Google
        </button>

      <div className="text-center text-sm font-thin h-auto w-auto">

       {isSignUp ? (<p className="text-gray-400" >Already have an account?{" "}
       <button onClick={() => setIsSignUp(false)} className="text-white w-auto h-auto font-bold cursor-pointer" >Login</button>{" "}instead.</p>
               ) : ( <p className="text-gray-400" >Don't have an account?{" "}
      <button onClick={() => setIsSignUp(true)} className="text-white w-auto h-auto font-bold cursor-pointer">Sign up</button>{" "}for free.</p>
       )}

        <button onClick={closeAuth} className="h-auto w-auto mt-2 cursor-pointer text-zinc-100" >
           <p className="hover:text-zinc-300">Continue without {!isSignUp ? 'Login' : 'Sign Up'}</p>
        </button>
      
      </div>

        
      </div>
    </div>
  );
};

export default Auth;