import React from 'react'

export default function CustomizeModelPanel() {

function ColorPicker({ label, value = '#ffffff', onChange }) {
  const handleChange = (e) => {
    onChange && onChange(e.target.value);
  };

  return (
    <div className="flex items-center space-x-2 sm:text-sm  text-xs">
      <label className=" font-medium">{label}</label>
      <input
        type="color"
        value={value}
        onChange={handleChange}
        className="h-6 w-6 cursor-pointer border-0"
        aria-label={label}
      />
    </div>
  );
}

const Toggle = ({ label }) => (
  <label className="flex items-center space-x-2 sm:text-sm  text-xs">
    <input type="checkbox" className="form-checkbox cursor-pointer" />
    <span>{label}</span>
  </label>
);
    
const Input = ({ label, textarea }) => (
  <div>
    <label className="block sm:text-sm  text-xs mb-1">{label}</label>
    {textarea ? (
      <textarea className="w-full themeInp p-2 rounded" rows={2} />
    ) : (
      <input className="w-full themeInp p-1 rounded" />
    )}
  </div>
);
const Select = ({ label, options }) => (
  <div>
    <label className="block sm:text-sm  text-xs mb-1">{label}</label>
    <select className="w-full themeInp p-2 rounded cursor-pointer">
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);
const Slider = ({ label, min, max }) => (
  <div>
    <label className="block sm:text-sm text-xs mb-1">{label}</label>
    <input type="range" min={min} max={max} className="w-full h-1" />
  </div>
);

const Accordion = ({ title, children }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border theme-border rounded sm:text-sm  text-xs">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-2 text-left font-medium theme-button rounded cursor-pointer"
      >
        {title}
      </button>
      {open && <div className="flex flex-col gap-4 px-4 py-2 ">{children}</div>}
    </div>
  );
};

  return (
    <div className="space-y-4 sm:text-sm  text-xs">
      <h2 className="sm:text-xl text-lg font-bold text-center border-b py-1 theme-border">Customize / Create Model</h2>
      {/* New model form */}
      <div className="grid grid-cols-2 gap-4">
        <Input label="Model Name" />
        <Input label="Version" />
        <Select label="Base Model" options={["Gemini", "VISUAL AI", "GPT-4", "LLaMa", "BERT"]} />
        <Input label="Description" textarea />
      </div>
      {/* Advanced */}
      <Accordion title="Advanced Options">
        <div className='flex  items-center gap-8'>
        <Toggle label="Enable Web Search" />
        <Toggle label="Enable Deep Reasoning" />
        </div>
        <Slider label="Spark Intensity" min={0} max={100} />
      </Accordion>
      {/* Integrations */}
      <Accordion title="Integrations">
        <Input label="Slack Webhook URL" />
        <Input label="Notion API Key" />
      </Accordion>
      {/* VISUAL Theme */}
      <Accordion title="VISUAL AI Theme">
        <div className='flex items-center gap-8'>
        <ColorPicker label="Primary Color" />
        <ColorPicker label="Ring Color" />
        </div>
        <Slider label="Animation Speed" min={0} max={10} />
      </Accordion>
      {/* Disclaimer */}
      <p className="text-zinc-400 text-xs mt-4 text-center">
        Note: Custom models built here use for VISUAL AI model only.
      </p>
    </div>
  );
}