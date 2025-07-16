
/* UserData.js */
import React, { useState, useEffect, useContext } from "react";
import { IoMdArrowRoundUp } from "react-icons/io";
import { AiOutlineLoading } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import MarkdownWithCopy from "../DATA/MarkdownWithCopy";
import { Context } from "../../context/Context";
import CopyButton from "./UI-Components/CopyButton";

export default function UserData({ message, handleSendMessage, currentWidth}) {
   const [editingMessageId, setEditingMessageId] = useState(null); // ID of the message being edited
   const [editedText, setEditedText] = useState(""); // Text being edited
   const {setMessages, isTyping, loading} = useContext(Context);
   
    const editResponse = (messageId, text) => {
        setEditingMessageId(messageId);
        setEditedText(text);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, isEditing: true } : msg
          )
        );
    };

 const handleSubmitEdit = async (messageId) => {
        const editedMessage = editedText.trim();
        if (!editedMessage) return;
      
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, isEditing: false } : msg
          )
        );
      
        setEditingMessageId(null);
        setEditedText("");
      
        // Send the edited message as a new user message
        await handleSendMessage(editedMessage);
 };


  return (
    <div className="sm:text-sm text-xs w-fit ml-auto max-w-[80%]"
      onMouseEnter={(e) => {
              if (currentWidth > 520) {
                e.currentTarget.querySelector(".icons-container").style.opacity = 1;
              }
            }}
            onMouseLeave={(e) => {
              if (currentWidth > 520) {
                e.currentTarget.querySelector(".icons-container").style.opacity = 0;
              }
        }}
     >

     <div> 
        <div className="px-2 rounded themeuser">
         {message.isEditing ? (
          <textarea
            className="w-full resize-none outline-none"
            value={editedText}
            onChange={(e) => {
                setEditedText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            
            />
        ) : (
            <MarkdownWithCopy text={message.text} />
        )}
        </div>
      
        <div className={`flex icons-container gap-0.5 mt-0.5 ${currentWidth > 520 ? " opacity-0 transition-opacity duration-300" : "opacity-100"}`} >
            <CopyButton text={message.text} />

                <div> 
                     {editingMessageId === message.id?(
                       <button
                         className="p-2 rounded-lg h-8 w-8 theme-button3 focus:outline-none cursor-pointer"
                         title="Send Message"
                         onClick={() => handleSubmitEdit(message.id)}
                         disabled={isTyping || !editedText.trim()} // Ensure this uses editedText, not input
                        >
                    
                        {isTyping || loading ? <AiOutlineLoading className="animate-spin" /> : <IoMdArrowRoundUp />}
                     </button>
                    ):(
                      <button
                      className="p-2 rounded-lg theme-button3 cursor-pointer"
                        onClick={() => editResponse(message.id, message.text)}
                        >
                        <FaEdit />
                    </button>
                    )}
            </div>
        </div>
        
     </div>
    </div>
  );
}
