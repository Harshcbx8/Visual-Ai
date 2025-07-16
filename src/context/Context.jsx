import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [previousPrompt, setPreviousPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({rate: 1, pitch: 1, volume: 1,gender: "female"});

  const [globeSpeed, setGlobeSpeed] = useState(0.02);
  const [particleSpeed, setParticleSpeed] = useState(0.015);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Format markdown and code blocks
  const formatText = (text) => {
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
    text = text.replace(/\n/g, "<br>");
    return text;
  };

  // Start a new chat session
  const newChats = () => {
    setLoading(false);
    setShowResult(false);
    setMessages([]);
  };

  // Send prompt to Gemini API and handle response
  const onSent = async (prompt) => {
    if (isTyping) return;
    setLoading(true);
    setShowResult(true);
    setIsTyping(true);
    setGlobeSpeed(0.08);
    setParticleSpeed(0.08);

    // Add loading message
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

    // Track previous prompts (max 20)
    setPreviousPrompt((prev) => [prompt, ...prev].slice(0, 20));

    // Format code blocks and markdown
    let formattedResponse = response.replace(/```(\w+)?\n([\s\S]+?)```/g, (match, lang, code) => {
      return `<div class='code-block'><pre><code class='language-${lang || "plaintext"}'>${code}</code></pre></div>`;
    });
    
    formattedResponse = formatText(formattedResponse);

    // Single pass: find the loading placeholder and replace it
    // Remove setMessages update from inside the typing animation
    setMessages(prev =>
      prev.map(msg =>
        msg.isLoading
          ? { ...msg, isLoading: false, isBot: true, text: formattedResponse }
          : msg
      )
    );
    // Do not update setMessages in MarkdownWithCopy!
  };
  
  const contextValue = {
    previousPrompt,
    setPreviousPrompt,
    onSent,
    // regenerateResponse,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    input,
    setInput,
    newChats,
    messages,
    setMessages,
    isTyping,
    globeSpeed,
    particleSpeed,
    isSpeaking,
    setIsSpeaking,
    voiceSettings,
    setVoiceSettings,
    setGlobeSpeed,
    setParticleSpeed,
    setIsTyping,
  };

  return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export default ContextProvider;
