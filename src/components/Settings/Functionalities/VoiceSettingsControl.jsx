import { useContext, useEffect } from "react";
import { Context } from "../../../context/Context";

export default function VoiceSettingsControl() {
  const { voiceSettings, setVoiceSettings } = useContext(Context);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVoiceSettings((prev) => ({
      ...prev,
      [name]: name === "gender" ? value : parseFloat(value)
    }));
  };
  
  useEffect(() => {
  const loadVoices = () => {
    const voices = speechSynthesis.getVoices();
    console.table(voices.map(v => ({ name: v.name, lang: v.lang })));
  };

  speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}, []);

  return (
    <div className="space-y-4 p-4 sm:text-sm text-xs theme-text">
      <div>
        <label className="block mb-1">Voice Gender</label>
        <select
          name="gender"
          value={voiceSettings.gender}
          onChange={handleChange}
          className="w-full themeInp cursor-pointer rounded p-1"
        >
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Pitch: {voiceSettings.pitch}</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          name="pitch"
          value={voiceSettings.pitch}
          onChange={handleChange}
          className="w-full h-1"
        />
      </div>

      <div>
        <label className="block mb-1">Rate: {voiceSettings.rate}</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          name="rate"
          value={voiceSettings.rate}
          onChange={handleChange}
          className="w-full h-1"
        />
      </div>

      <div>
        <label className="block mb-1 ">Volume: {voiceSettings.volume}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          name="volume"
          value={voiceSettings.volume}
          onChange={handleChange}
          className="w-full h-1"
        />
      </div>
    </div>
  );
}
