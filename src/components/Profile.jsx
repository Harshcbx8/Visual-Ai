
const Profile = ({userDetails, settingsSections, setActiveSection,
  setModalOpen}) => {

  if (!userDetails) return (
    <div className="loading-container">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="loading-row">
          <div className="loading-bar" style={{ "--bar-index": index }}></div>
        </div>
      ))}
    </div>
  );

  const { name, email } = userDetails;

  return (
    <div className="flex flex-col justify-evenly gap-1 sm:text-sm text-xs border-b-2 theme-border mb-2 theme-bg-comp z-99">
      <div className="flex items-center justify-between">
        <p className='text-sm' >Welcome</p>
        <p>{name}</p>
      </div>
      <p >{email}</p>
      <div className="border-t-2 theme-border flex flex-col py-1 gap-1">
        {settingsSections.map(section => (
          <button
            key={section.key}
            onClick={() => {
              setActiveSection(section.key);
              setModalOpen(true);
            }}
            className="flex items-center h-auto w-full px-3 py-1 rounded-md theme-button2 transition  duration-300 cursor-pointer"
          >
            {section.icon}
            <p className="w-fit">{section.key.replace(" Settings", "")}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Profile;
