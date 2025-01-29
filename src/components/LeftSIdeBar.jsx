import { useContext, useState } from "react";
import React from "react";
import { Context } from "../context/Context";

function LeftSidebar({ isOpen, user }) {
  const [newChat, setNewChat] = useState(false);
  const { previousPrompt, setRecentPrompt, newChats, onSent } = useContext(Context);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  return (
    <div
      className={`bg-zinc-900 z-50 h-full w-[20%] min-w-[18rem] fixed ${
        isOpen ? "left-0" : "-left-[450px]"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="w-auto h-auto">
        <div className="flex flex-row align-middle justify-between p-2">
          <h3 className="text-xl">Chatbot</h3>
          <button
            className="text-white w-auto rounded-md px-2 pt-1 hover:bg-zinc-800 cursor-pointer"
            onClick={() => newChats()}
            onMouseEnter={() => setNewChat(true)}
            onMouseLeave={() => setNewChat(false)}
          >
            <i className="bx bx-plus"></i>
            <p
              className={`z-99 absolute bg-black right-0 w-auto h-auto border-2 border-gray-800 rounded-md p-1 text-sm -translate-x-1 opacity-0 transition-all duration-300 ${
                newChat ? "opacity-100 translate-y-2" : ""
              }`}
            >
              New Chat
            </p>
          </button>
        </div>
      </div>
     
      <div className="h-full mt-2 overflow-y-auto">
      {user === null ? (
       <p className="text-gray-400 text-sm px-4">
         Login to view previous chats
       </p>
      ) : previousPrompt.length === 0 ? (
       <p className="text-gray-400 text-sm px-4">No previous chats</p>
      ) : (
      previousPrompt.map((item, index) => (
      <div
        key={index}
        className="px-4 py-2 cursor-pointer hover:bg-zinc-800"
        onClick={() => loadPrompt(item)}
      >
        <p className="text-white text-sm">{item.slice(0, 20)}...</p>
      </div>
      ))
    )}
    </div>

        
      
    </div>
  );
}

export default LeftSidebar;
