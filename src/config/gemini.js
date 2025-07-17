import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Access API keys from environment variables
const apiKey1 = import.meta.env.VITE_GOOGLE_API_KEY;
const apiKey2 = import.meta.env.VITE_GOOGLE_API_KEY2;

if (!apiKey1 && !apiKey2) {
  throw new Error("No API key is set. Ensure at least one key in the .env file.");
}

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

function getModel(apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
}

/**
 * Fetches a response from Gemini API for the given prompt.
 * Tries apiKey1 first, then apiKey2 if apiKey1 fails.
 * Retries on 503 errors with exponential backoff.
 * @param {string} prompt - The prompt to send.
 * @param {number} retryCount - Number of retries on failure.
 * @param {number} delay - Initial delay between retries (ms).
 * @param {string} apiKey - The API key to use.
 * @returns {Promise<string>} - The response text or error message.
 */
async function runWithKey(prompt, retryCount = 3, delay = 2000, apiKey) {
  try {
    const model = getModel(apiKey);
    const chatSession = model.startChat({ generationConfig, history: [] });
    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error fetching response:", error);

    // Retry if 503 Service Unavailable
    if (retryCount > 0 && error.message && error.message.includes("503")) {
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return runWithKey(prompt, retryCount - 1, delay * 2, apiKey); // Exponential backoff
    }

    throw error; // propagate error to try fallback key
  }
}

async function run(prompt, retryCount = 3, delay = 2000) {
  try {
    return await runWithKey(prompt, retryCount, delay, apiKey1);
  } catch (error) {
    // If apiKey2 exists, try it as fallback
    if (apiKey2) {
      console.warn("Trying fallback API key...");
      try {
        return await runWithKey(prompt, retryCount, delay, apiKey2);
      } catch (err2) {
        console.error("Fallback API key also failed:", err2);
        return "Error: Unable to fetch data from both API keys. Please try again later.";
      }
    }
    return "Error: Unable to fetch data. Please try again later.";
  }
}

export default run;
