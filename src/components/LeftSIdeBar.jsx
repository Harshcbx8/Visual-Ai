import { useContext, useState } from "react";
import { Context } from "../context/Context";

function LeftSidebar({ isOpen, user, SetHome }) {
  const [newChat, setNewChat] = useState(false);
  const { previousPrompt, setRecentPrompt, newChats, onSent } = useContext(Context);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  return (
    <div
      className={`theme-bg-comp z-50 h-full top-0 w-[20%] min-w-[18rem] border-r theme-border fixed sm:text-sm text-xs ${
        isOpen ? "left-0" : "-left-[450px]"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="w-auto h-auto">
        <div className="flex flex-row align-middle justify-between p-2">
          <h3 className="sm:text-xl text-lg">Chatbot</h3>
          <button
            className="w-auto rounded-md px-2 text-md theme-button cursor-pointer"
            onClick={() => {
              newChats();
              SetHome(true);
            }
          }
            onMouseEnter={() => setNewChat(true)}
            onMouseLeave={() => setNewChat(false)}
          >
            <i className="bx bx-plus"></i>
            <p
              className={`z-99 absolute  theme-bg-comp right-0 w-auto h-auto border theme-border rounded-md p-1 sm:text-sm text-xs -translate-x-1 opacity-0 transition-all duration-300 ${
                newChat ? "opacity-100 translate-y-2" : ""
              }`}
            >
              New Chat
            </p>
          </button>
        </div>

        <p className="theme-border border h-[1px] w-full" ></p>
      </div>
     
      <div className="h-full mt-2 overflow-y-auto">
      {user === null ? (
       <p className="text-gray-400  px-4">
         Login to view previous chats
       </p>
      ) : previousPrompt.length === 0 ? (
       <p className="text-gray-400  px-4">No previous chats</p>
      ) : (
        <>
        <p className="text-gray-400 px-2 ">Recent chats</p>
        {Array.isArray(previousPrompt) && previousPrompt.length > 0 ? (
          previousPrompt.map((item, index) => (
            <div key={index} className="px-2 py-2 cursor-pointer" onClick={() => loadPrompt(item)}> 
              <p className=" px-2 py-1 rounded-md ">{item.slice(0,40)}...</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 px-2 ">No recent chats</p>
        )}
      </>
    )}
    </div>

        
      
    </div>
  );
}

export default LeftSidebar;
