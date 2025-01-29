import { createContext, useState } from "react";
import run from "../config/gemini";
import { RiRobot3Fill } from "react-icons/ri";


export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [previousPrompt, setPreviousPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false); // Track if AI is typing

  const newChats = () => {
    setLoading(false);
    setShowResult(false);
    setMessages([]); // Clear messages for a new chat
  };

  const onSent = async (prompt) => {

    if (isTyping) return; 
    
    setLoading(true);
    setShowResult(true);
    setIsTyping(true); 
  
    // Add a loading message to the chat
    setMessages((prev) => [
      ...prev,
      { text: "", type: "bot", isLoading: true },
    ]);
  
    let response;
    try {
      response = await run(prompt || input);
      if (!response) throw new Error("No response from the server.");
    } catch (error) {
      console.error("Error fetching response:", error);
      response = "Error: Unable to fetch data.";
    }
  
    setLoading(false); // Stop loading animation

    setPreviousPrompt((prev) => {
      const updatedPrompts = [prompt, ...prev]; // Add the new prompt to the start of the array
      return updatedPrompts.slice(0, 20); // Keep only the most recent 20 prompts
    });
  
    // Format response with line breaks and bold tags
    const formattedResponse = response
      .split("**")
      .map((chunk, i) => (i % 2 === 1 ? `<b>${chunk}</b>` : chunk))
      .join("")
      .replace(/\*/g, "<br>");
  
    // Update messages to start the typing animation
    setMessages((prev) => {
      
      const updatedMessages = prev.map((msg) =>
        msg.isLoading ? { ...msg, icon: <RiRobot3Fill />, isLoading: false } : msg
      );
  
      return [
        ...updatedMessages,
        { text: "", type: "bot", isLoading: false }, // Placeholder for the animated response
      ];
    });
  
    // Typewriter animation
    let currentText = "";
    const responseChars = [...formattedResponse];
    const speed = responseChars.length > 100 ? 1 : 20; // Adjust typing speed

    responseChars.forEach((char, index) => {
      setTimeout(() => {
        currentText += char;
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            ...updatedMessages[updatedMessages.length - 1],
            text: currentText,
          };
          return updatedMessages;
        });
        if (index === responseChars.length - 1) {
          setIsTyping(false); // Unlock input when typing completes
        }
      }, index * speed); // Adjust typing speed here (50ms per character)
    });
  };
  
  const contextValue = {
    previousPrompt,
    setPreviousPrompt,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChats,
    messages,
    setMessages,
    isTyping,
  };

  return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export default ContextProvider;
