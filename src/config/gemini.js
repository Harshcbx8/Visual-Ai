import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";

   // Access API key from environment variable
   const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error("API key is missing. Ensure it is set in the .env file.");
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run(prompt, retryCount = 3, delay = 2000) {
    try {
      const chatSession = model.startChat({ generationConfig, history: [] });
      const result = await chatSession.sendMessage(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Error fetching response:", error);
      
      // Retry if 503 Service Unavailable
      if (retryCount > 0 && error.message.includes("503")) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return run(prompt, retryCount - 1, delay * 2); // Exponential backoff
      }
      
      return "Error: Unable to fetch data. Please try again later.";
    }
  }
  
  
  export default run;
  