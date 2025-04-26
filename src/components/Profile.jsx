import React, { useEffect, useState } from 'react';
import { auth, db } from './Firebase';
import { doc, getDoc } from 'firebase/firestore';
import { IoSettingsOutline } from "react-icons/io5";
import { RiToolsLine, RiRobot3Line } from "react-icons/ri";

const Profile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

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
    }, []);

    const openModal = (content) => {
        setModalContent(content);
        setModalOpen(true);
    };

    if (!userDetails) return (
        <div className="loading-container">
            {[...Array(3)].map((_, index) => (
                <div key={index} className="loading-row">
                    <div className="loading-bar" style={{ "--bar-index": index }}></div>
                </div>
            ))}
        </div>
    );

    const { name, email } = userDetails;

    return (
        <div className="flex flex-col justify-evenly gap-1 text-xl border-b-2 border-zinc-600 mb-2">
            <div className="flex items-center justify-between cursor-auto">
                <p>Welcome</p>
                <p className="text-sm">{name}</p>
            </div>
            <p className="text-sm">{email}</p>

            <div className="border-t-2 border-zinc-600 flex flex-col py-1">
                <button onClick={() => openModal("My Model Settings")}
                    className="flex items-center text-sm h-auto w-full px-3 py-1 rounded-md hover:bg-zinc-600 transition duration-300">
                    <RiRobot3Line className='mr-2' /> <p className="w-fit">My Model</p>
                </button>
                <button onClick={() => openModal("Customize Model Settings")}
                    className="flex items-center text-sm h-auto w-full px-3 py-1 rounded-md hover:bg-zinc-600 transition duration-300">
                    <RiToolsLine className="mr-2" /> <p className="w-fit"> Customize Model </p>
                </button>
                <button onClick={() => openModal("General Settings")}
                    className="flex items-center text-sm h-auto w-full px-3 py-1 rounded-md hover:bg-zinc-600 transition duration-300">
                    <IoSettingsOutline className="mr-2" />
                    <p className="w-fit">Settings</p>
                </button>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-96 text-black relative">
                        <h2 className="text-lg font-semibold mb-3">{modalContent}</h2>
                        <p>Here you can configure settings for {modalContent.toLowerCase()}.</p>
                        <button onClick={() => setModalOpen(false)}
                            className="mt-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
