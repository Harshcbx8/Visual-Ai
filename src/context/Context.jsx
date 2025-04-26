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
  const [isTyping, setIsTyping] = useState(false);

  // AI Globe Animation States
  const [globeSpeed, setGlobeSpeed] = useState(0.02); // Speed of rings/particles
  const [globeSpeaking, setGlobeSpeaking] = useState(false); // AI Speaking animation trigger
  const [particleSpeed, setParticleSpeed] = useState(0.015);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const regenerateResponse = async (currentMessage) => {
    if (isTyping) return;
    setLoading(true);
    setIsTyping(true);
    await onSent(currentMessage);
  };

  const formatText = (text) => {
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
    text = text.replace(/\n/g, "<br>");
    return text;
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

    setGlobeSpeed(0.08); 
    setParticleSpeed(0.08);
    

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
  
    setLoading(false); 
    

    setPreviousPrompt((prev) => {
      const updatedPrompts = [prompt, ...prev];
      return updatedPrompts.slice(0, 20); 
    });

  
  
     let formattedResponse = response.replace(/```(\w+)?\n([\s\S]+?)```/g, (match, lang, code) => {
      // Wrap the code block in a div with a special class
       return `<div class='code-block'><pre><code class='language-${lang || "plaintext"}'>${code}</code></pre></div>`;
     });

    formattedResponse = formatText(formattedResponse);
  
    setMessages((prev) => {
      
      const updatedMessages = prev.map((msg) =>
        msg.isLoading ? { ...msg, isLoading: false, isBot: true } : msg
      );
  
      return [
        ...updatedMessages,
        { text: "", type: "bot", isLoading: false },
      ];
      
    });

  
    

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
          setParticleSpeed(0.015);
          setGlobeSpeed(0.02);
        }
       }, index * speed); // Adjust typing speed here (50ms per character)
      });
   };
  
  const contextValue = {
    previousPrompt,
    setPreviousPrompt,
    onSent,
    regenerateResponse,
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
    globeSpeed,
    globeSpeaking,
    particleSpeed,
    isSpeaking,
    setIsSpeaking,
  };

  return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export default ContextProvider;
