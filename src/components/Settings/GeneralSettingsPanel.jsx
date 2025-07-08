import React from 'react'
import { MdLink } from 'react-icons/md';
import VoiceSettingsControl from './Functionalities/VoiceSettingsControl';
import ThemeSelector from './Functionalities/ThemeSelector';
import LanguageSelector from './Functionalities/LanguageSelector';


export default function GeneralSettingsPanel() {


const Input = ({ label, textarea }) => (
  <div>
    <label className="block  sm:text-sm  text-xs mb-1">{label}</label>
    {textarea ? (
      <textarea className="w-full themeInp p-2 rounded" rows={2} />
    ) : (
      <input className="w-full themeInp p-1 rounded" />
    )}
  </div>
);
const Select = ({ label, options }) => (
  <div>
    <label className="block  sm:text-sm  text-xs mb-1">{label}</label>
    <select className="w-full themeInp p-2 rounded cursor-pointer">
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

const FileUpload = ({ label }) => (
  <div className='flex flex-col gap-2 sm:text-sm  text-xs'>
    <label className="block mb-1">{label}</label>
    <div className='flex gap-1 items-center'>
    <MdLink />
    <input type="file" className='text-xs cursor-pointer' />
    </div>
  </div>
);

const Accordion = ({ title, children }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border theme-border rounded  sm:text-sm  text-xs">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-2 text-left font-medium theme-button2 rounded cursor-pointer "
      >
        {title}
      </button>
      {open && <div className="flex flex-col gap-4 px-4 py-2 ">{children}</div>}
    </div>
  );
};

  return (
    <div className="space-y-4">
      <h2 className="sm:text-xl text-lg font-bold text-center border-b py-1 theme-border">General Settings</h2>
      {/* Profile */}
      <Accordion title="Profile">
        <Input label="Display Name" />
        <FileUpload label="Avatar" />
      </Accordion>
      {/* Data */}
      <Accordion title="Data & Privacy">
        <div className=' flex justify-between items-center sm:text-sm  text-xs'>
        <button className="cursor-pointer hover:bg-red-600 bg-red-500 text-white rounded px-2 py-1 transition-colors duration-300">Clear All Chat History</button>
        <button className="cursor-pointer theme-button theme-text rounded px-2 py-1 transition-colors duration-300">Download Data Archive</button>
        </div>
      </Accordion>
      {/* Theme & Language */}
      <Accordion title="Appearance & Language">
        <ThemeSelector/>
        <LanguageSelector/>
        <VoiceSettingsControl/>
      </Accordion>
      {/* Danger Zone */}
      <div className="border-t theme-border pt-4 sm:text-sm  text-xs">
        <button className="text-red-500 cursor-pointer hover:text-red-600 ">Delete Account</button>
      </div>
    </div>
  );
}
