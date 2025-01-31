import { createContext, useState } from "react";
import run from "../config/gemini";


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

  const regenerateResponse = async (currentMessage) => {
    if (isTyping) return;
    setLoading(true);
    setIsTyping(true);
    
    // Regenerate the response by sending the prompt again
    await onSent(currentMessage);
  };

  const formatText = (text) => {
    // Format **bold** text
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
    // Format *italic* text
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
  
    // Format new lines
    text = text.replace(/\n/g, "<br>");
  
    return text;
  };
  

  const editResponse = (currentMessage) => {
    setInput(currentMessage);
    setMessages((prev) => prev.filter((msg) => msg.text !== currentMessage)); // Remove the message being edited
  };

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
  
     // 1. Handle Code Blocks First
     let formattedResponse = response.replace(/```(\w+)?\n([\s\S]+?)```/g, (match, lang, code) => {
      // Wrap the code block in a div with a special class
       return `<div class='code-block'><pre><code class='language-${lang || "plaintext"}'>${code}</code></pre></div>`;
     });

      // 2. Apply Text Formatting (bold, italic, new lines)
      formattedResponse = formatText(formattedResponse);
  
    // Update messages to start the typing animation
    setMessages((prev) => {
      
      const updatedMessages = prev.map((msg) =>
        msg.isLoading ? { ...msg, isLoading: false, isBot: true } : msg
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
    regenerateResponse,
    editResponse,
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
