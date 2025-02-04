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
        <button
      onClick={handleGoogleSignIn}
      className="flex items-center justify-center cursor-pointer w-full py-2 px-4 mt-4 mb-4 bg-white border border-gray-300 
                 rounded-md shadow-md hover:bg-zinc-300 transition duration-300"
    >
      {/* Google Icon */}
      <div className="mr-3">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="w-5 h-5"
        >
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
        </svg>
      </div>

      {/* Multi-colored Google Text */}
      <span className="text-md  text-black"> Continue with Google </span>
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