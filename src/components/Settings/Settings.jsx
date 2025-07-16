
import ModelManagementPanel from './ModelManagementPanel';
import GeneralSettingsPanel from './GeneralSettingsPanel';
import CustomizeModelPanel from './CustomizeModelPanel';
import { IoCloseSharp } from "react-icons/io5";

export default function Settings({
  modalOpen,
  activeSection,
  setActiveSection,
  settingsSections,
  setModalOpen,
}) {
  return (
    <>
      {modalOpen && (
        <div className="absolute m-auto inset-0 flex items-center justify-center h-fit lg:w-4xl ">
          <div className="theme-bg theme-text rounded-md shadow-xl w-full ml-2 mr-2 sm:text-sm theme-border border text-xs flex">
            
            {/* Sidebar */}
            <aside className="theme-bg-comp p-4 space-y-2 rounded-l-md border-r theme-border sm:text-sm text-xs" >
              {settingsSections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`flex items-center sm:justify-start justify-center p-2 rounded cursor-pointer sm:text-sm text-lg w-full ${
                    activeSection === section.key
                      ? "theme-button font-semibold scale-105"
                      : "theme-button2 "
                  }`}
                > 
                  {section.icon}
                  <span className="sm:ml-2 sm:text-sm sm:block hidden text-xs">{section.key}</span>
                </button>
              ))}
            </aside>

            {/* Content */}
            <div className="flex-1 p-6 h-96 overflow-y-scroll custom-scrollbar theme-bg-2 space-y-6  sm:text-sm  text-xs">
              {activeSection === "My Model" && (
                <ModelManagementPanel />
              )}
              {activeSection === "Customize Model" && (
                <CustomizeModelPanel />
              )}
              {activeSection === "General" && (
                <GeneralSettingsPanel />
              )}
            </div>
            {/* Close */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-1 right-3 text-white themebot px-2 py-1 rounded cursor-pointer theme-button3 text-sm "
            >
             <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </>
  );
}




