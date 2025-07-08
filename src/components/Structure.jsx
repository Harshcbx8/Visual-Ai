import { useContext, useEffect, useRef, useState} from "react";
import { Context } from "../context/Context";
import { LuBrainCircuit } from "react-icons/lu";
import { RiRobot3Fill } from "react-icons/ri";
import Loader from "./StructureComp/Loader";
import InputPrompt from "./StructureComp/InputPrompt";
import UserData from "./StructureComp/UserData";
import BotOutput from "./StructureComp/BotOutput";

  export default function Structure({ currentWidth, SetHome, aiModel }) {
     const messagesEndRef = useRef(null);
     const {onSent, setInput, input, messages, setMessages, isTyping, loading} = useContext(Context);
       
       // whenever typing stops, scroll to bottom
        useEffect(() => {
          if (!isTyping || setInput!=null) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }
        }, [isTyping]);

      const handleSendMessage = async (customText = null) => {
        const messageText = customText || input.trim();
        if (!messageText || isTyping) return;
      
        const userMessage = {
          id: Date.now(),
          text: messageText,
          type: "user",
        };
      
        setMessages((prev) => [...prev, userMessage]);
        setInput(""); 
      
        await onSent(messageText); // Process response from AI
      };
      
      return (
        <div className={`flex flex-col justify-self-center gap-2 sm:max-w-4xl w-full h-screen pt-12 pb-8
        `}>
         <div className="flex-1 p-4 overflow-y-scroll gap-2 custom-scrollbar rounded-2xl overflow-x-hiddeen h-[80%]">

          {messages.map((message, index) => (
            <div key={message.id || `msg-${index}`} >
                <div>
                    {message.type === "user" ? <UserData message={message} handleSendMessage={handleSendMessage} currentWidth={currentWidth}/> : <BotOutput message={message} currentWidth={currentWidth} />}
                  
                </div>
            </div>
          ))}
          

         <Loader loading={loading} />
          {/* Empty div for scrolling to bottom */}

          <div ref={messagesEndRef} />
        </div>
          
          <InputPrompt aiModel={aiModel} SetHome={SetHome} handleSendMessage={handleSendMessage} currentWidth={currentWidth}/>
        </div>
      );

    }
