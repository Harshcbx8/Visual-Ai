    import React, { useContext, useEffect, useRef } from "react";
    import { RiAttachmentLine } from "react-icons/ri";
    import { IoMdArrowRoundUp } from "react-icons/io";
    import { Context } from "../context/Context";
    import { LuBrainCircuit } from "react-icons/lu";
    import { AiOutlineLoading } from "react-icons/ai";

    export default function Structure({ currentWidth }) {
      const {
        onSent,
        loading,
        setInput,
        input,
        messages,
        setMessages,
        isTyping,
      } = useContext(Context);

      const messagesEndRef = useRef(null);

      useEffect(() => {
        // Scroll to the bottom whenever messages update
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

      return (
        <div
          className={`flex flex-col justify-self-center h-[90vh] w-[45rem] gap-2 text-white ${
            currentWidth < 780 ? "w-[95%]" : "w-[45rem]"
          }`}
        >
          <div className="flex-1 p-4 overflow-y-scroll overflow-x-hidden gap-2 custom-scrollbar rounded-2xl max-h-[80%]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded-lg mb-2 ${
              message.type === "user"
                ? "text-black w-fit ml-auto max-w-[80%]"
                : "text-white w-fit"
            }`}
            style={message.type !== "user" ? { backgroundColor: "rgb(10,10,10)" } : {backgroundColor: "rgb(240,240,240)"}}
          >
          {message.isLoading ? (
            <span className="flex items-center animate-pulse">
              <LuBrainCircuit className="text-xl opacity-75" />
              <span className="ml-2">Thinking....</span>
            </span>
            ) : (
          <div>
            {message.icon ? message.icon : <div dangerouslySetInnerHTML={{ __html: message.text }} />}
          </div>
            )}
            </div>
          ))}
          

          {loading && (
            <div className="loading-container">
              {[...Array(3)].map((_, index) => (
              <div key={index} className="loading-row">
                <div
                className="loading-bar"
                style={{ "--bar-index": index }}
              ></div>
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
                className="absolute left-2 bottom-2 p-2 rounded-lg h-8 w-8 bg-zinc-700 hover:bg-zinc-600 focus:outline-none"
                title="Attach Document"
              >
                <RiAttachmentLine />
              </button>

              <button
                className="absolute right-2 bottom-2 p-2 rounded-lg h-8 w-8 bg-zinc-700 hover:bg-zinc-600 focus:outline-none"
                title="Send Message"
                onClick={handleSendMessage}
                disabled={isTyping} // Disable while AI is typing
              >
                {isTyping ? <AiOutlineLoading className="animate-spin" /> : <IoMdArrowRoundUp />}
              </button>
            </div>
          </div>
        </div>
      );
    }
