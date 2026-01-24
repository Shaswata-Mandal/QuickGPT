import React, { useState } from 'react'
import CustomSelect from '../common/CustomSelect';

const DEFAULT_SETTINGS = {
  baseStyle: "default",
  tone: {
    warm: "default",
    enthusiastic: "default",
  }, 
  formatting: {
    headersLists: "default",
    emoji: "default",
  },
  customInstructions: "",
  nickname: "", 
  occupation: "", 
  moreAboutYou: "",
};

const PERSONALIZATION_FIELDS = [
  {
    id: "warm",
    label: "Warm",
    path: ["tone", "warm"],
    options: ["default", "low", "medium", "high"],
  },
  {
    id: "enthusiastic",
    label: "Enthusiastic",
    path: ["tone", "enthusiastic"],
    options: ["default", "low", "medium", "high"],
  },
  {
    id: "headersLists",
    label: "Headers & Lists",
    path: ["formatting", "headersLists"],
    options: ["default", "compact", "expanded"],
  },
  {
    id: "emoji",
    label: "Emoji",
    path: ["formatting", "emoji"],
    options: ["default", "never", "sometimes", "often"],
  },
];

const Personalization = ({ name }) => {

  const [savedSettings, setSavedSettings] = useState(DEFAULT_SETTINGS);
  const [draftSettings, setDraftSettings] = useState(DEFAULT_SETTINGS);

  const hasChanges = JSON.stringify(savedSettings) !== JSON.stringify(draftSettings);

  const updateDraft = (path, value) => {

    setDraftSettings(prev => {

      const updated = structuredClone(prev);
      let ref = updated;

      for(let i=0; i<path.length-1; i++) {
        ref = ref[path[i]];
      }

      ref[path[path.length-1]] = value;

      return updated;

    });

  }

  return (

    <div className="flex flex-col px-4 pb-2 w-full max-h-100">

      <div className='flex py-3 border-b dark:invert'>

        <p className='text-md font-medium'>{name}</p>

        {hasChanges && (
          <span className='text-xs text-orange-500 ml-auto bg-orange-200 rounded-md px-2 flex items-center justify-center'>Unsaved changes</span>
        )}

      </div>

      {/* Personalization options */}
      <div className='flex-1 mt-4 max-sm:max-h-69 w-full overflow-y-scroll'>

        {/* Base style and tone */}
        <div className='flex justify-between gap-3 pb-3 border-b border-gray-200 dark:border-primary/30'>

          <div className='dark:invert'>

            <p className='text-sm font-medium'>Base style and tone</p>
            <p className='text-xs text-gray-400'>Set the style and tone of how the assistant responds to you.</p>

          </div>

          <div className='min-w-23'>

            <CustomSelect
              value={draftSettings.baseStyle}
              options={["more", "default", "less"]}
              placeholder='Select Base style and tone'
              onChange={(value) => updateDraft(["baseStyle"], value)}
            />

          </div>

        </div>

        {/* Characteristics */}
        <div className='flex flex-col mt-3 gap-3 pb-3 border-b border-gray-200 dark:border-primary/30'>

          <div className='dark:invert'>

            <p className='text-sm font-medium'>Characteristics</p>
            <p className='text-xs text-gray-400'>Choose additional customizations on top of your base style and tone</p>

          </div>

          <div className='flex flex-col gap'>

            {PERSONALIZATION_FIELDS.map((item) => (

              <div className='py-2 flex justify-between items-center gap-3' key={item.id}>

                <p className='dark:invert text-sm'>{item.label}</p>

                <div className='min-w-23'>
                  <CustomSelect
                    value={draftSettings[item.path[0]][item.path[1]]}
                    options={item.options}
                    placeholder={item.label}
                    onChange={(value) => updateDraft(item.path, value)}
                  />
                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Custom Instruction */}
        <div className='flex flex-col mt-3 dark:invert pb-5 border-b dark:border-white '>

            <p className='text-sm font-medium mb-2'>Custom Instruction</p>

            <div className='border rounded-md py-2'>

              <input 
                value={draftSettings.customInstructions}
                onChange={(e) => updateDraft(["customInstructions"], e.target.value)}
                className='text-sm outline-none w-full px-3' 
                placeholder='Additional behaviour, style and tone preference' 
                type="text" 
              />

            </div>

        </div>

        {/* --------------------------------------------------------------------------------------------------- */}
        <div className='flex py-3 border-b border-gray-200 dark:border-primary/30 dark:invert'>
          <p className='text-md font-medium'>About you</p>
        </div>

        {/* About you */}
        <div className="flex flex-col">

          {/* Nickname */}
          <div className='flex flex-col dark:invert mt-3  pb-3 border-b border-gray-200 dark:border-primary/30 dark:border-white '>

            <p className='text-sm font-medium mb-2'>Nickname</p>

            <div className='border rounded-md py-2'>

              <input 
                value={draftSettings.nickname}
                onChange={(e) => updateDraft(["nickname"], e.target.value)}
                className='text-sm outline-none w-full px-3' 
                placeholder='What should quickgpt call you?' 
                type="text" 
              />

            </div>

          </div>

          {/* Occupation */}
          <div className='flex flex-col dark:invert mt-3 pb-3 border-b border-gray-200 dark:border-primary/30 dark:border-white '>

            <p className='text-sm font-medium mb-2'>Occupation</p>

            <div className='border rounded-md py-2'>

              <input 
                value={draftSettings.occupation}
                onChange={(e) => updateDraft(["occupation"], e.target.value)}
                className='text-sm outline-none w-full px-3' 
                placeholder='Doctor, Engineer, Lawyer, Manager...' 
                type="text" 
              />

            </div>

          </div>

          {/* More about you */}
          <div className='flex flex-col mt-3 pb-5'>

            <div className='flex flex-col dark:invert'>

              <p className='text-sm font-medium mb-2'>More about you</p>

              <div className='border rounded-md py-2'>

                <input 
                  value={draftSettings.moreAboutYou}
                  onChange={(e) => updateDraft(["moreAboutYou"], e.target.value)}
                  className='text-sm outline-none w-full px-3' 
                  placeholder='Interest, values or preferences to keep in mind' 
                  type="text"
                />

              </div>

              <button
                disabled={!hasChanges}
                onClick={() => handleSaveClick()}
                className={`disabled:opacity-30 disabled:cursor-not-allowed py-2 px-3 text-sm cursor-pointer border max-w-fit rounded-md mt-5 ml-auto`}
              >
                Save All Above Changes
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Personalization