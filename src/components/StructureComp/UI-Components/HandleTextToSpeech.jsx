import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import DOMPurify from "dompurify";
import { useContext, useState, useEffect } from 'react';
import { Context } from "../../../context/Context";

export default function HandleTextToSpeech({ message }) {
  const [isHovered, setIsHovered] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const {setIsSpeaking, voiceSettings } = useContext(Context);

  useEffect(() => {
    // Cancel any speech when component unmounts
    return () => {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, []);

  const handleTextToSpeech = (text, messageId) => {
  speechSynthesis.cancel(); // Stop previous speech if any
  setSpeakingMessageId(null);
  setIsSpeaking(false);

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = DOMPurify.sanitize(text);
  const visibleText = tempDiv.textContent || tempDiv.innerText;

    if (!visibleText.trim()) return;

    const detectedLang = detectLanguage(visibleText);
    let voices = speechSynthesis.getVoices();
    let selectedVoice = selectVoice(voices, detectedLang, voiceSettings.gender); // ✅ gender passed here

    if (!selectedVoice) {
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices();
        selectedVoice = selectVoice(voices, detectedLang, voiceSettings.gender); // ✅ gender passed here too
        speakText(visibleText, selectedVoice, messageId, detectedLang);
      };
    } else {
      speakText(visibleText, selectedVoice, messageId, detectedLang);
    }
  };


  const detectLanguage = (text) => {
    const hindiPattern = /[\u0900-\u097F]/;
    const englishPattern = /^[A-Za-z0-9.,!?'"() ]+$/;
    if (hindiPattern.test(text)) return "hi-IN";
    if (englishPattern.test(text)) return "en-US";
    return "en-US"; // default to English
  };

  const selectVoice = (voices, lang, gender) => {
  // Filter by language first
  const filteredByLang = voices.filter((v) => v.lang.startsWith(lang));

  // Try to find voice based on gender in the filtered voices
  const genderedVoice = filteredByLang.find((v) =>
    gender === "female"
      ? /female|zira|susan|samantha|eva|helena/i.test(v.name)
      : /male|david|mark|george|alex/i.test(v.name)
  );

  return genderedVoice || filteredByLang[0] || voices[0]; // Fallback
};


  const speakText = (text, voice, messageId, lang) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = lang;
    utterance.rate = voiceSettings.rate;
    utterance.pitch = voiceSettings.pitch;
    utterance.volume = voiceSettings.volume;

    setSpeakingMessageId(messageId);
    setIsSpeaking(true);

    speechSynthesis.speak(utterance);

    utterance.onend = () => {
      setSpeakingMessageId(null);
      setIsSpeaking(false);
    };

    utterance.onerror = (e) => {
      console.error("Speech synthesis error:", e.error);
      setSpeakingMessageId(null);
      setIsSpeaking(false);
    };
  };

  return (
    <button
      className="p-2 rounded-lg theme-button3 cursor-pointer"
      onClick={() => handleTextToSpeech(message.text, message.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {speakingMessageId === message.id && isHovered ? (
        <HiSpeakerXMark />
      ) : (
        <HiSpeakerWave />
      )}
    </button>
  );
}
