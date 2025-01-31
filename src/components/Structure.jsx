    import React, { useContext, useEffect, useRef, useState} from "react";
    import { RiAttachmentLine } from "react-icons/ri";
    import { IoMdArrowRoundUp } from "react-icons/io";
    import { Context } from "../context/Context";
    import { LuBrainCircuit } from "react-icons/lu";
    import { AiOutlineLoading } from "react-icons/ai";
    import { MdThumbUp } from "react-icons/md";
    import { MdThumbDown } from "react-icons/md";
    import { HiSpeakerWave } from "react-icons/hi2";
    import { HiSpeakerXMark } from "react-icons/hi2";
    import { MdContentCopy } from "react-icons/md";
    import { FaEdit } from "react-icons/fa";
    import { RiRobot3Fill } from "react-icons/ri";


    export default function Structure({ currentWidth }) {
      const {
        onSent,
        loading,
        setInput,
        input,
        messages,
        setMessages,
        isTyping,
        regenerateResponse, 
        editResponse, 
      } = useContext(Context);

      const [isSpeaking, setIsSpeaking] = useState(false); // Track the speech state
      const messagesEndRef = useRef(null);

      useEffect(() => {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }, [messages]);

      const handleSendMessage = async () => {
        if (!input.trim() || isTyping) return; // Prevent sending while AI is typing

        // Add user message to chat
        const userMessage = {
          id: Date.now(),
          text: input,
          type: "user",
        };

        setMessages((prev) => [...prev, userMessage]);

        // Clear input field
        setInput("");

        // Send the message and wait for the bot's response
        await onSent(input); // Wait for onSent to process the response
      };

      const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
      };
    
      const handleTextToSpeech = (text) => {
        if (isSpeaking) {
          speechSynthesis.cancel(); // Stop the speech if it's already playing
          setIsSpeaking(false);
        } else {
          const utterance = new SpeechSynthesisUtterance(text);
          speechSynthesis.speak(utterance);
          setIsSpeaking(true);
    
          // Listen for when speech ends and update state
          utterance.onend = () => {
            setIsSpeaking(false);
          };
        }
      };

      return (
        <div className={`flex flex-col justify-self-center gap-2 text-white ${currentWidth < 780 ? "w-[95%] h-[85vh]" : "w-[45rem] h-[90vh]"}`}>
          <div className="flex-1 p-4 overflow-y-scroll overflow-x-hidden gap-2 custom-scrollbar rounded-2xl h-[90%]">

        {messages.map((message, index) => (
          <div key={message.id || `msg-${index}`}
            className={`p-2 rounded-lg mb-2 ${message.type === "user"
                ? "text-black w-fit ml-auto max-w-[80%]"
                : "text-white w-fit"
            }`}
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
          {message.isLoading ? (
              <span className="flex items-center animate-pulse">
                <LuBrainCircuit className="text-xl opacity-75" />
                <span className="ml-2">Thinking....</span>
              </span>
            ) : message.image ? (
              <img src={message.image} alt="AI generated" className="w-full max-h-96 object-cover" />
            ) : message.text? (
              <div >
                <div
                  className={`${message.type === "user" ? "p-2 rounded-lg" : ""}`}
                  style={{ backgroundColor: message.type !== "user" ? "rgb(10,10,10)" : "rgb(240,240,240)" }}
                >
                  {message.text}
                </div>
                <div
                  className={`icons-container text-white flex gap-2 mt-2 ${currentWidth > 520 ? "opacity-0 transition-opacity duration-300" : "opacity-100"}`}
                >
                  <button className="p-2 rounded-lg hover:bg-zinc-900 cursor-pointer" onClick={() => handleCopy(message.text)}>
                    <MdContentCopy />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-zinc-900 cursor-pointer" onClick={() => editResponse(message.text)}>
                    <FaEdit />
                  </button>
                  {message.type !== "user" && (
                    <>
                      <button className="p-2 rounded-lg hover:bg-zinc-900 cursor-pointer" onClick={() => handleTextToSpeech(message.text)}>
                        {isSpeaking ? <HiSpeakerXMark /> : <HiSpeakerWave />}
                      </button>
                      <button className="p-2 rounded-lg hover:bg-zinc-900 cursor-pointer" onClick={() => alert("Liked!")}> <MdThumbUp /> </button>
                      <button className="p-2 rounded-lg hover:bg-zinc-900 cursor-pointer" onClick={() => alert("Disliked!")}> <MdThumbDown /> </button>
                    </>
                  )}
                </div>
              </div>
            ):(
                <div>
                {message.isBot && <RiRobot3Fill className="text-xl mr-2" />}
                </div>
            )}
          </div>
        ))}
          

          {loading && (
            <div className="loading-container">
            {[...Array(3)].map((_, index) => (
             <div key={index} className="loading-row">
             <div className="loading-bar" style={{ "--bar-index": index }}></div>
              </div>
              ))}
             </div>
            )}

          {/* Empty div for scrolling to bottom */}
          <div ref={messagesEndRef} />
        </div>

          {/* Chat Input Section */}
          <div className="border-zinc-700 h-auto bg-zinc-800 text-white rounded-2xl focus-within:ring-[1px]"
           tabIndex="0">
            <div className="relative flex items-center pb-10">
              <textarea
                id="chatInput"
                rows="2"
                className="flex-1 p-4 resize-none overflow-hidden bg-zinc-800 text-white rounded-2xl outline-none border-none focus:ring-0 focus:outline-none"
                placeholder="Type your message..."
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onInput={(e) => {
                  e.target.style.height = "auto"; // Reset height
                  e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on content
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    if (currentWidth < 520) return; // Disable Enter on small screens
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />

              <button
                className=" cursor-pointer absolute left-2 bottom-2 p-2 rounded-lg h-8 w-8 bg-zinc-700 hover:bg-zinc-600 focus:outline-none"
                title="Attach Document"
              >
                <RiAttachmentLine />
              </button>

              <button
                className="absolute right-2 bottom-2 p-2 rounded-lg h-8 w-8 bg-zinc-700 hover:bg-zinc-600 focus:outline-none cursor-pointer"
                title="Send Message"
                onClick={handleSendMessage}
                disabled={isTyping || !input.trim()} // Disable while AI is typing
              >
                {isTyping ? <AiOutlineLoading className="animate-spin" /> : <IoMdArrowRoundUp />}
              </button>
            </div>
          </div>
        </div>
      );
    }
