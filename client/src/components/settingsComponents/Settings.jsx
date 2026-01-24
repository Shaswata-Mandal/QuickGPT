import React, { useState } from 'react'
import Personalization from './Personalization'
import DataControls from './DataControls'
import MemoryControls from './MemoryControls';

const SETTINGS = [
  {
    id: "personalization",
    label: "Personalization",
    render: (props) => <Personalization {...props} name="Personalization" />,
  },
  {
    id: "data",
    label: "Data Controls",
    render: (props) => <DataControls {...props} name="Data Controls" />,
  },
  {
    id: "memory",
    label: "Memory",
    render: (props) => <MemoryControls {...props} name="Memory" />,
  },
];


const Settings = () => {

  const [activeTab, setActiveTab] = useState("personalization");

  const handleTabClick = (tab) => {

    setActiveTab(tab);

  }

  const activeItem = SETTINGS.find(item => item.id === activeTab);

  return (
    <div className='flex max-sm:flex-col min-h-100'>

      {/* Left div */}
      <div
        className='
          p-3 flex shrink-0 overflow-y-* 
          max-sm:border-b border-gray-200 max-sm:overflow-x-scroll dark:border-white
          max-sm:flex-row max-sm:gap-3 flex-col gap-1 sm:border-r 
        '
      >

        {SETTINGS.map(item => (

          <button
            onClick={() => handleTabClick(item.id)}
            className={`min-w-fit px-4 py-2 max-sm:bg-gray-100 dark:max-sm:bg-primary/20 ${activeTab === item.id ? "bg-gray-100 max-sm:bg-gray-200 dark:bg-primary/40" : "dark:hover:bg-primary/50 hover:bg-gray-200"} rounded-md text-xs text-left  cursor-pointer active:scale-95 dark:text-white`}
            key={item.id}
          >
            {item.label}
          </button>

        ))}

      </div>

      {/* Right div */}
      <div className='flex flex-1'>

        {activeItem.render({
          onTabChange: handleTabClick, 
          activeTab,
        })}

      </div>

    </div>
  )
}

export default Settings