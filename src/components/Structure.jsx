    import React, { useContext, useEffect, useRef, useState} from "react";
    import { toast } from 'react-toastify';
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
    import DOMPurify from "dompurify";
    import { TiTick } from "react-icons/ti";
    import { MdError } from "react-icons/md";



    export default function Structure({ currentWidth, SetHome }) {
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

      const messagesEndRef = useRef(null);
      const [isHovered, setIsHovered] = useState(false); 

      useEffect(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        navigator.clipboard.writeText(text)
        .then(() => {
          toast.success("Text copied to clipboard!", {
            position: "bottom-right",
            autoClose: 500, // 1 second duration
            hideProgressBar: true, 
            icon : <TiTick/>
          });
        })
        .catch(err => {
          toast.error("Failed to copy text", {
            position: "bottom-right",
            autoClose: 1000,
            hideProgressBar: true, 
            icon: <MdError/>
          });
          console.error("Copy failed:", err);
        });
    
      };
      const handleLike = () => {
        toast.success("Liked!", {
          position: "bottom-right",
          autoClose: 500,
          hideProgressBar: true,
          icon: <MdThumbUp />,
        });
      };
      
      const handleDislike = () => {
        toast.error("Disliked!", {
          position: "bottom-right",
          autoClose: 500,
          hideProgressBar: true,
          icon: <MdThumbDown />,
        });
      };
    
      const [speakingMessageId, setSpeakingMessageId] = useState(null); // Track which message is speaking
      const handleTextToSpeech = (text, messageId) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = DOMPurify.sanitize(text);
        const visibleText = tempDiv.textContent || tempDiv.innerText;
      
        if (!visibleText.trim()) return;
      
        if (speakingMessageId === messageId) {
          speechSynthesis.cancel();
          setSpeakingMessageId(null);
          return;
        }
      
        const detectedLang = detectLanguage(visibleText); // Detect language
        let voices = speechSynthesis.getVoices();
        let selectedVoice = selectVoice(voices, detectedLang);
      
        if (!selectedVoice) {
          speechSynthesis.onvoiceschanged = () => {
            voices = speechSynthesis.getVoices();
            selectedVoice = selectVoice(voices, detectedLang);
            speakText(visibleText, selectedVoice, messageId, detectedLang);
          };
          return;
        }
      
        speakText(visibleText, selectedVoice, messageId, detectedLang);
      };
      
      // Function to detect language (Basic Script Detection)
      const detectLanguage = (text) => {
        const hindiPattern = /[\u0900-\u097F]/; // Hindi Unicode Range
        const englishPattern = /^[A-Za-z0-9.,!?'"() ]+$/; // English Characters
        if (hindiPattern.test(text)) return "hi-IN";
        if (englishPattern.test(text)) return "en-US";
        return "hi-IN"; // Default to Hindi (Hinglish case)
      };
      
      // Function to Select Appropriate Voice
      const selectVoice = (voices, lang) => {
        return voices.find((voice) => voice.lang.startsWith(lang)) || voices[0];
      };
      
      // Function to Speak Text
      const speakText = (text, voice, messageId, lang) => {
        const utterance = new SpeechSynthesisUtterance(text);
        if (voice) utterance.voice = voice;
      
        utterance.lang = lang;
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
      
        setSpeakingMessageId(messageId);
        speechSynthesis.speak(utterance);
      
        utterance.onend = () => setSpeakingMessageId(null);
      };
      
      
      const renderMessageContent = (message) => {
        const sanitizedText = DOMPurify.sanitize(message.text);
        
        if (!sanitizedText) return null;
      
        return (
          <div dangerouslySetInnerHTML={{ __html: sanitizedText }} />
        );
      
        
      };
      

      return (
        <div className={`flex flex-col justify-self-center gap-2 text-white ${currentWidth < 780 ? "w-[98%] h-[85vh] " : "w-[45rem] h-[90vh]"}`}>
          <div className="flex-1 p-4 overflow-y-scroll gap-2 custom-scrollbar rounded-2xl overflow-x-hiddeen h-[80%]">

        {messages.map((message, index) => (
          <div key={message.id || `msg-${index}`}
            className={`p-2 rounded-lg mb-2 ${message.type === "user"
                ? "text-black w-fit ml-auto max-w-[80%]"
                : "text-white w-fit max-w-[100%]"

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
            ) : !message.text?(
              <div>
              {message.isBot && <RiRobot3Fill className="text-xl mr-2" />}
              </div>
          ):(
              <div>
                <div
                  className={`${message.type === "user" ? "p-2 rounded-lg" : " overflow-x-scroll overflow-y-hidden custom-scrollbar-horizontal"}`}
                  style={{ backgroundColor: message.type !== "user" ? "rgb(10,10,10)" : "rgb(240,240,240)" }}
                >
                  
                {renderMessageContent(message)}
                </div>
                
                <div
                  className={`icons-container text-white flex gap-2 mt-2 ${currentWidth > 520 ? "opacity-0 transition-opacity duration-300" : "opacity-100"}`}
                >
                  <button className="p-2 rounded-lg hover:bg-zinc-900 cursor-pointer" onClick={() => {
                    handleCopy(message.text);
                    }}>
                    <MdContentCopy />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-zinc-900 cursor-pointer" onClick={() => editResponse(message.text)}>
                    <FaEdit />
                  </button>
                  {message.type !== "user" && (
                    <>
                      <button
                        className="p-2 rounded-lg hover:bg-zinc-900 cursor-pointer"
                        onClick={() => handleTextToSpeech(message.text, message.id)}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        {speakingMessageId === message.id && isHovered ? <HiSpeakerXMark /> : <HiSpeakerWave />}
                      </button>
                      <button className="p-2 rounded-lg hover:bg-zinc-900 cursor-pointer" onClick={handleLike}> <MdThumbUp /> </button>
                      <button className="p-2 rounded-lg hover:bg-zinc-900 cursor-pointer" onClick={handleDislike}> <MdThumbDown /> </button>
                    </>
                  )}
                </div>
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
          <div className="border-zinc-700 h-auto bg-zinc-800 text-white rounded-2xl focus-within:ring-[1px] "
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
                    SetHome(false);

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
                onClick={() => {
                  handleSendMessage();
                  SetHome(false)
                }
              }
                disabled={isTyping || !input.trim()} // Disable while AI is typing
              >
                {isTyping ? <AiOutlineLoading className="animate-spin" /> : <IoMdArrowRoundUp />}
              </button>
            </div>
          </div>
        </div>
      );
    }
