import React from 'react'

const DataControls = ({ name }) => {

  const BUTTONS = [
    {
      id: "shared-links",
      label: "Shared links",
      buttonText: "Manage",
      action: () => openSharedLinks(),
    },
    {
      id: "archived-chats",
      label: "Archived chats",
      buttonText: "Manage",
      action: () => openArchivedChats(),
    },
    {
      id: "archive-all",
      label: "Archive all chats",
      buttonText: "Archive all",
      action: () => archiveAllChats(),
    },
    {
      id: "delete-all",
      label: "Delete all chats",
      buttonText: "Delete all",
      variant: "danger",
      action: () => deleteAllChats(),
    },
  ];

  return (

    <div className="flex flex-col px-4 pb-2 w-full max-h-100 dark:invert">

      <div className='flex py-3 border-b'>
        <p className='text-md font-medium'>{name}</p>
      </div>

      <div className='flex-1 mt-2 max-sm:max-h-69 w-full overflow-y-scroll divide-y divide-gray-200 dark:divide-gray-300'>

        {BUTTONS.map(item => (

          <div
            key={item.id}
            className="flex items-center justify-between py-3 "
          >

            {/* Left text */}
            <p className="text-sm">
              {item.label}
            </p>

            {/* Right button */}
            <button
              onClick={item.action}
              className={`
              px-4 py-1.5 text-sm rounded-full border dark:invert dark:hover:bg-primary/40 dark:text-white cursor-pointer
              ${item.variant === "danger"
                  ? "border-red-500 text-red-500 hover:bg-red-50 "
                  : "border-gray-300 hover:bg-gray-100 "}
            `}
            >

              {item.buttonText}

            </button>

          </div>

        ))}

      </div>

    </div>

  );

};

export default DataControls;
