
import DefaultPage from '../components/HomePages/DefaultPage';
import Auth from '../components/Auth';
import Settings from '../components/Settings/Settings';
import TheVISAI from '../components/TheVISAI';
import Structure from '../components/Structure';



export default function Core({isAuthOpen, home, selectedModel, width, isSideBarOpen, profOpen, user, toggleAuth, setUser, modalOpen, settingsSections, activeSection, setActiveSection, setModalOpen, SetHome}) {

    
  return (
    <div>
     {home && <DefaultPage aiModel={selectedModel} width={width} isSideBarOpen={isSideBarOpen} profOpen={profOpen}/>}

     
      
       
      {/* Auth */}
      {(!user && isAuthOpen) && <Auth closeAuth={toggleAuth} setUser={setUser} />}


      {/* Main Structure */}

      
      {modalOpen && <Settings modalOpen={modalOpen} settingsSections={settingsSections} activeSection={activeSection} setActiveSection={setActiveSection} setModalOpen={setModalOpen}/> }
      <Structure currentWidth={width} aiModel={selectedModel}  SetHome={SetHome}/>

       {/* Conditionally Render TheVISAI */}
       {selectedModel === "VISUAL-AI" && <TheVISAI width={width} />}
    </div>
  )
}
