import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import moment from 'moment';
import NothingHere from '../common/NothingHere';
import EnableShare from './EnableShare';
import { useConfirm } from '../../hooks/useConfirm';

//Title feature buttons component
export const SharedChatsTitleFeatures = ({ onDeleteAllSharedChatsClick, onUnshareAllChatsClick, loading }) => {

  return (
    <div className='flex gap-3 sm:gap-2'>

      <button
        disabled={loading}
        onClick={onDeleteAllSharedChatsClick}
        className='disabled:opacity-50'
        title='Delete all shared chats'
      >
        <img src={assets.delete_icon} className='w-5 h-5 cursor-pointer dark:invert' alt="" />
      </button>

      <button
        disabled={loading}
        onClick={onUnshareAllChatsClick}
        className='disabled:opacity-50'
        title='Unshare all chats'
      >
        <img src={assets.unshare_chats_icon} className='w-5 h-5 transform scale-x-[-1] cursor-pointer dark:invert' alt="" />
      </button>

    </div>
  )

}

const SharedChatsDisplay = () => {

  const customConfirm = useConfirm();
  const { axios, getToken, fetchUserChats, setChats, navigate, setSlideModal, openPopOverModal, closeTopPopOverModal } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [sharedChats, setSharedChats] = useState([]);
  const [processing, setProcessing] = useState(false);

  const fetchAllSharedChats = async () => {

    setLoading(true);

    try {

      const token = await getToken();

      const { data } = await axios.get('/api/chat/get-all-shared-chats', { headers: { Authorization: token } });

      if (data.success) {
        setSharedChats(data.sharedChats);
      }

    } catch (error) {
      toast.error(data.message || "Failed to fetch shared chats!");
    } finally {
      setLoading(false);
    }

  }

  const handleUnshareAllChats = async () => {

    if (processing) {
      toast.error("Please wait, an action is already in progress.");
      return;
    }

    if (sharedChats.length === 0) {
      toast.error("There are no chats to be unshared");
      return;
    }

    const confirmed = await customConfirm({ title: "Confirm action", message: "Unshare all chats?" });
    if (!confirmed) return;

    setProcessing(true);

    try {

      const token = await getToken();

      const { data } = await axios.post(
        '/api/chat/share-unshare-chat',
        { share: false },
        { headers: { Authorization: token } }
      );

      if (data.success) {

        await fetchAllSharedChats();
        await fetchUserChats();
        toast.success("All chats unshared!");

      }

    } catch (error) {
      // console.log(error)
      toast.error("Failed to unshare chats");
    } finally {
      setProcessing(false);
    }

  };

  const handleDeleteAllSharedChats = async () => {

    if (processing) {
      toast.error("Please wait, an action is already in progress.");
      return;
    }

    if (sharedChats.length === 0) {
      toast.error("There are no shared chats to be deleted!");
      return;
    }

    const confirmed = await customConfirm({ title: "Confirm action", message: "Are you sure you want to permanently delete all shared chats?" });
    if (!confirmed) return;

    setProcessing(true);

    try {

      const token = await getToken();

      const { data } = await axios.post(
        '/api/chat/delete-all-shared-chats',
        {},
        {
          headers: { Authorization: token }
        }
      );

      if (data.success) {

        await fetchAllSharedChats();
        await fetchUserChats();
        navigate("/");
        toast.success(data?.message || "All shared chats deleted successfully!");

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete shared chats");
    } finally {
      setProcessing(false);
    }

  }

  const handleUnshareChatClick = async (chatId, chatName) => {

    if (processing) {
      toast.error("Please wait, an action is already in progress.");
      return;
    }

    openPopOverModal({
      title: chatName,
      size: "md",
      content: (
        <EnableShare
          chatId={chatId}
          onShareChange={async () => {
            await fetchAllSharedChats();
            await fetchUserChats();
            closeTopPopOverModal();
          }}
        />
      )
    });

  }

  const handleDeleteChat = async (e, chatId) => {

    if (processing) {
      toast.error("Please wait, an action is already in progress.");
      return;
    }

    const confirmed = await customConfirm({ title: "Confirm action", message: "Are you sure you want to delete this chat?" });
    if (!confirmed) return;

    setProcessing(true);

    try {

      const token = await getToken();

      e.stopPropagation();

      const { data } = await axios.post('/api/chat/delete', { chatId },
        {
          headers: {
            Authorization: token
          }
        }
      );

      if (data.success) {

        setChats(prev => prev.filter(chat => chat._id !== chatId));
        await fetchAllSharedChats();
        await fetchUserChats();
        navigate('/');

        toast.success(data.message);

      } else {
        toast.error(data.message || 'Failed to delete chat');
      }

    } catch (error) {

      console.error('Delete chat error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to delete chat');

    } finally {
      setProcessing(false);
    }

  }

  //Mounting the title feature buttons
  useEffect(() => {

    setSlideModal(prev => ({
      ...prev,
      titleFeature: (
        <SharedChatsTitleFeatures
          loading={processing}
          onUnshareAllChatsClick={handleUnshareAllChats}
          onDeleteAllSharedChatsClick={handleDeleteAllSharedChats}
        />
      ),
    }));

    // cleanup on unmount
    return () => {
      setSlideModal(prev => ({
        ...prev,
        titleFeature: null,
      }));
    };

  }, [processing, sharedChats.length]);

  useEffect(() => {

    fetchAllSharedChats();

  }, []);

  if (loading) {
    return (
      <div className='flex-1 mt-6 flex justify-center text-sm space-y-3 min-h-50 md:min-h-40'>

        <img src={assets.loading_icon} className='w-5 h-5 dark:invert animate-spin' alt="" />

      </div>
    )
  }

  return (
    <div className='flex flex-col gap-3 w-full'>

      {sharedChats.length > 0 && <p className='text-xs text-center px-2 py-2 bg-gray-200 border border-gray-300 rounded-md'>Showing {sharedChats.length} shared chats</p>}

      {sharedChats.length === 0 ?
        (
          <NothingHere />
        )
        :
        (
          <div className='flex-1 overflow-y-scroll mt-3 text-sm space-y-3 min-h-50 md:min-h-40'>

            {
              sharedChats.map((chat, index) => (

                <div key={index} className={`relative py-2 px-4 dark:bg-[#57317c]/10 border border-gray-300 dark:border-[#80609f]/15 rounded-md cursor-pointer flex justify-between items-center group`}>

                  <div className='dark:invert'>

                    <p className='truncate w-full'>
                      {chat.name?.length < 25 ? chat.name : `${chat.name?.slice(0, 25)}...` || "New Chat"}
                    </p>

                    <p>{moment(chat.updatedAt).fromNow()}</p>

                  </div>

                  <div className='flex items-center gap-3 sm:gap-2'>

                    <button
                      disabled={loading}
                      onClick={(e) => handleDeleteChat(e, chat._id)}
                      className='disabled:opacity-50'
                      title='Delete this chat'
                    >
                      <img src={assets.bin_icon} className='md:hidden group-hover:block w-5 h-5 cursor-pointer not-dark:invert' alt="" />
                    </button>

                    <button
                      disabled={loading}
                      onClick={() => handleUnshareChatClick(chat._id, chat.name)}
                      className='disabled:opacity-50'
                      title='Unshare this chat'
                    >
                      <img src={assets.share_icon} className='w-4.5 h-4.5 cursor-pointer dark:invert transform scale-x-[-1]' alt="" />
                    </button>

                  </div>

                </div>

              ))
            }

          </div>
        )
      }

    </div>
  )
}

export default SharedChatsDisplay