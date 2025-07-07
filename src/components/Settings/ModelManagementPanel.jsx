export default function ModelManagementPanel() {

const Toggle = ({ label }) => (
  <label className="flex items-center space-x-2 sm:text-sm  text-xs">
    <input type="checkbox" className="form-checkbox cursor-pointer" />
    <span>{label}</span>
  </label>
);

  return (
    <div className="space-y-4 ">
      <h2 className="sm:text-xl text-lg font-bold text-center border-b py-1 theme-border theme-bg">Model Management</h2>
      {/* Model selector */}
      <div className="border theme-border rounded p-4 theme-bg">
        <label className="block sm:text-sm text-xs font-medium mb-2">Select Model</label>
        <select className="w-full themeInp p-2 rounded cursor-pointer border theme-border  ">
          <option>Visual-AI  v2.0</option>
          <option>Assistant v1.0</option>
          <option>Summarizer v2.2</option>
          {/* … */}
        </select>
      </div>
      {/* Toggles */}
      <div className="flex flex-wrap gap-4">
        {[
          { label: "Enabled", key: "enabled" },
          { label: "Voice", key: "voice" },
          { label: "Context Memory", key: "memory" },
        ].map((t) => (
          <Toggle key={t.key} label={t.label} />
        ))}
      </div>
      {/* Diagnostics */}
      <button className=" px-4 py-2 theme-button rounded cursor-pointer">
        Run Health Check
      </button>
    </div>
  );
}
