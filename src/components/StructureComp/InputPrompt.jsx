import { AiOutlineLoading } from "react-icons/ai";
import { IoMdArrowRoundUp } from "react-icons/io";
import { RiAttachmentLine } from "react-icons/ri";
import { motion } from "framer-motion";
import { useContext } from "react";
import { Context } from "../../context/Context";

export default function InputPrompt({aiModel, SetHome, handleSendMessage, currentWidth}) {
  const {setInput, input, isTyping} = useContext(Context);
  
  return (
    <div className="sm:text-sm text-xs">
        {aiModel === "Gemini" || aiModel === "VISUAL-AI"? (

          <div className="sticky border theme-border lg:mx-0 mx-2 h-auto theme-bg-comp rounded-xl focus-within:ring-[1px] "
           tabIndex="0">
            
            <div className="relative flex items-center pb-8">
              <textarea
                id="chatInput"
                rows="2"
                className="flex-1 p-4 resize-none overflow-hidden theme-bg-comp rounded-xl outline-none border-none focus:ring-0 focus:outline-none  max-h-[300px] 
                  overflow-y-auto custom-scrollbar"
                placeholder="Enter your prompt..."
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onInput={(e) => {
                    e.target.style.height = 'auto';
                    const newHeight = Math.min(e.target.scrollHeight, 300);
                    e.target.style.height = `${newHeight}px`;// Set height based on content
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
                className=" cursor-pointer absolute left-2 bottom-2 p-2 rounded-md h-8 w-8 theme-button focus:outline-none"
                title="Attach Document"
              >
                <RiAttachmentLine />
              </button>

              <button
                className="absolute right-2 bottom-2 p-2 rounded-md h-8 w-8 theme-button focus:outline-none cursor-pointer"
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
           ):(
            <motion.div 
              key={aiModel}
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.8 }} 
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-auto w-auto sm:text-sm text-xs  flex justify-center "
            >
              <h2 className="theme-bg-comp  px-4 py-2 rounded-lg shadow-lg">This AI model is currently unavailable</h2>
            </motion.div>
           )
          }
    </div>
  )
}
