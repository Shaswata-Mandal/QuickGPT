import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext';
import SharedChatsDisplay from '../chatComponents/SharedChatsDisplay';
import ArchivedChatsDisplay, { UnarchiveAllChats } from '../chatComponents/ArchivedChatsDisplay';
import { useConfirm } from '../../hooks/useConfirm'
import toast from 'react-hot-toast';

const DataControls = ({ name }) => {

  const customConfirm = useConfirm();
  const { openSlideModal, closeTopPopOverModal, chats, navigate, getToken, axios, userChatsLoading, setUserChatsLoading, fetchUserChats } = useAppContext();
  const [processing, setProcessing] = useState(false);

  const handleArchiveAllChatsClick = async () => {

    if (processing || userChatsLoading) {
      toast.error("Please wait, an action is already in progress.");
      return;
    }

    if (chats.length === 0) {
      toast.error("No chats to archive!");
      return;
    }

    const confirmed = await customConfirm({ title: "Confirm action", message: "Are you sure you want to archive all the chats" });
    if (!confirmed) return;

    setProcessing(true);
    setUserChatsLoading(true);

    try {

      const token = await getToken();

      const { data } = await axios.post('/api/chat/archive-unarchive-chat',
        { archive: true },
        {
          headers: { Authorization: token }
        }
      );

      if (data.success) {

        await fetchUserChats();
        navigate("/");
        toast.success("All chats archived successfully!");

      }
      else {
        toast.error("We were not able to archive chats successfully!");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to archive all chats!");
    } finally {
      setUserChatsLoading(false);
      setProcessing(false);
    }

  }

  const handleDeleteAllClick = async () => {

    if (processing || userChatsLoading) {
      toast.error("Please wait, an action is already in progress.");
      return;
    }

    if (chats.length === 0) {
      toast.error("No chats to delete!");
      return;
    }

    const confirmed = await customConfirm({ title: "Confirm action", message: "Are you sure you want to delete all the chats?" });
    if (!confirmed) return;

    setProcessing(true);
    setUserChatsLoading(true);

    try {

      const token = await getToken();

      const { data } = await axios.post('/api/chat/delete',
        {},
        {
          headers: { Authorization: token }
        }
      );

      if (data.success) {

        await fetchUserChats();
        navigate("/");
        toast.success("All chats deleted successfully!");

      }
      else {
        toast.error("We were not able to delete chats successfully!");
      }

    } catch (error) {
      toast.error(error.messages);
    } finally {
      setUserChatsLoading(false);
      setProcessing(false);
    }

  }

  const openSharedLinks = () => {

    closeTopPopOverModal();

    openSlideModal({
      title: "Shared Chats",
      content: <SharedChatsDisplay />,
    });

  }

  const openArchivedChats = () => {

    closeTopPopOverModal();

    openSlideModal({
      title: "Archived Chats",
      content: <ArchivedChatsDisplay />,
      titleFeature: <UnarchiveAllChats />
    });

  }

  const archiveAllChats = () => {

    handleArchiveAllChatsClick();

  }

  const deleteAllChats = () => {

    handleDeleteAllClick();

  }

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
              disabled={processing}
              onClick={item.action}
              className={`
              px-4 py-1.5 disabled:opacity-50 text-sm rounded-full border dark:invert dark:hover:bg-primary/40 dark:text-white cursor-pointer
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
