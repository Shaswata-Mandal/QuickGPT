import React, { useEffect, useState } from 'react'
import CustomSelect from '../common/CustomSelect';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const DEFAULT_SETTINGS = {
  tone: {
    warm: "default",
    enthusiastic: "default"
  },
  formatting: {
    headerLists: "default",
    emoji: "default"
  },
  baseStyle: "default",
  customInstruction: "",
  nickname: "",
  occupation: "Doctor",
  moreAboutYou: ""
};

const PERSONALIZATION_FIELDS = [
  {
    id: "warm",
    label: "Warm",
    path: ["tone", "warm"],
    options: ["default", "more", "less"],
  },
  {
    id: "enthusiastic",
    label: "Enthusiastic",
    path: ["tone", "enthusiastic"],
    options: ["default", "more", "less"],
  },
  {
    id: "headerLists",
    label: "Headers & Lists",
    path: ["formatting", "headerLists"],
    options: ["more", "default", "less"],
  },
  {
    id: "emoji",
    label: "Emoji",
    path: ["formatting", "emoji"],
    options: ["more", "default", "less"],
  },
];

const Personalization = ({ name }) => {

  const { axios, getToken } = useAppContext();

  const [savedSettings, setSavedSettings] = useState(DEFAULT_SETTINGS);
  const [draftSettings, setDraftSettings] = useState(DEFAULT_SETTINGS);
  const [processing, setProcessing] = useState(false);

  const hasChanges = JSON.stringify(savedSettings) !== JSON.stringify(draftSettings);

  const fetchPersonalizationData = async () => {

    if (processing) {
      return;
    }

    setProcessing(true);

    try {

      const token = await getToken();

      const { data } = await axios.get("/api/user/get-personalization-data", { headers: { Authorization: token } });

      if (data.success) {

        setSavedSettings(data.personalizationData);
        setDraftSettings(data.personalizationData);

      }
      else {
        toast.error("Failed to fetch personalization data");
      }

    } catch (error) {

      toast.error(error.response?.data?.message || "Failed to fetch saved personalization data");

    } finally {
      setProcessing(false);
    }

  }

  const handleSaveChangesClick = async () => {

    if (!hasChanges) {
      return;
    }

    if (processing) {
      toast.error("Action in progress. Please wait!");
      return;
    }

    setProcessing(true);

    try {

      const token = await getToken();

      const { data } = await axios.patch("/api/user/update-personalization-data", { payload: draftSettings }, { headers: { Authorization: token } });

      if (data.success) {

        setSavedSettings(draftSettings);
        toast.success(data.message);

      }
      else {
        toast.error("Failed to save personalization data");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch saved personalization data");
    } finally {
      setProcessing(false);
    }

  }

  const updateDraft = (path, value) => {

    setDraftSettings(prev => {

      const updated = structuredClone(prev);
      let ref = updated;

      for (let i = 0; i < path.length - 1; i++) {
        ref = ref[path[i]];
      }

      ref[path[path.length - 1]] = value;

      return updated;

    });

  }

  useEffect(() => {

    fetchPersonalizationData();

  }, []);

  if (processing) {
    return (
      <div className='flex-1 mt-6 flex justify-center text-sm space-y-3 min-h-50 md:min-h-40'>

        <img src={assets.loading_icon} className='w-5 h-5 dark:invert animate-spin' alt="" />

      </div>
    )
  }

  return (

    <div className="flex flex-col px-4 pb-2 w-full max-h-100">

      <div className='flex justify-between py-3 border-b dark:invert'>

        <p className='text-md font-medium'>{name}</p>

        <div className='flex gap-3'>

          {hasChanges && (
            <span className='text-xs text-orange-500 ml-auto bg-orange-200 rounded-md px-2 flex items-center justify-center'>Unsaved changes</span>
          )}

          <button
            onClick={() => setDraftSettings(savedSettings)}
            disabled={!hasChanges}
            className={`disabled:opacity-50 disabled:cursor-not-allowed ml-auto active:scale-95 cursor-pointer`}
          >
            <img src={assets.reset_icon} className='w-5 h-5 dark:invert' alt="" />
          </button>

        </div>

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
              options={["default", "professional", "friendly", "candid", "quirky", "efficient", "nerdy", "cynical"]}
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
              value={draftSettings.customInstruction}
              onChange={(e) => updateDraft(["customInstruction"], e.target.value)}
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
                disabled={!hasChanges || processing}
                onClick={() => handleSaveChangesClick()}
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