import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import moment from 'moment'
import { assets } from '../../assets/assets';
import { useClerk, UserButton } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import ChatOptions from '../chatComponents/ChatOptions';
import CustomUserMenu from './CustomUserMenu';

const Sidebar = () => {

  const { signOut } = useClerk();
  const { selectedChat, chats, setSelectedChat, theme, user, navigate, getToken, axios, isMenuOpen, setIsMenuOpen, updateChatName, userChatsLoading, setUserChatsLoading, fetchUserChats, customConfirm } = useAppContext();
  const [search, setSearch] = useState('');
  const [activeChatOptions, setActiveChatOptions] = useState(null);
  const [renamedChatName, setRenamedChatName] = useState(null);
  const [renameChatId, setRenameChatId] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleOptionsClick = (e, chatId) => {

    e.stopPropagation();
    setActiveChatOptions(activeChatOptions === chatId ? null : chatId);

  };

  useEffect(() => {

    const handleClickOutside = () => {
      setActiveChatOptions(null);
    }

    document.addEventListener('click', handleClickOutside);

    return () => document.removeEventListener('click', handleClickOutside);

  }, []);

  const handleCloseSidebar = () => {

    setIsMenuOpen(false);

  }

  const handleOverlayClick = () => {

    handleCloseSidebar();

  }

  const handleChatClick = (chat) => {

    navigate('/');
    setSelectedChat(chat);
    handleCloseSidebar();

  }

  const handleArchiveAllChatsClick = async () => {

    if (processing || userChatsLoading) {
      toast.error("Please wait, an action is already in progress.");
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

  const onRenameSubmit = async (e, chatName) => {

    e.preventDefault();

    if (!renamedChatName?.trim()) {
      toast.error("Chat name cannot be empty");
      return;
    }

    if (renamedChatName === chatName) {
      return;
    }

    try {

      const token = await getToken();

      const { data } = await axios.post('/api/chat/rename-chat',
        { chatId: renameChatId, newChatName: renamedChatName.trim() },
        {
          headers: { Authorization: token }
        }
      );

      if (data.success) {

        toast.success("Chat renamed successfully");

        setRenameChatId(null);
        setRenamedChatName(null);
        updateChatName(renameChatId, renamedChatName);

      }

    } catch (error) {

      toast.error("Failed to rename chat!");

    }

  }

  return (

    <>

      {/* Black Transparent Overlay for Mobile */}
      {isMenuOpen && (
        <div
          className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={handleOverlayClick}
        />
      )}

      <div className={`flex flex-col h-screen min-w-72 p-5 dark:bg-gradient-to-b from-[#242124] to-[#000000]/30 
        border-r border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 overflow-y-scroll bg-white dark:bg-transparent
        max-md:fixed max-md:top-0 max-md:left-0 max-md:h-full max-md:z-50 ${!isMenuOpen && 'max-md:-translate-x-full'}`}
      >

        <img className='w-full max-w-48' src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="" />

        {/* New Chat Button */}
        <button onClick={() => { navigate('/'); setSelectedChat(null); handleCloseSidebar(); }} className='flex justify-center items-center w-full py-2 mt-6 text-white bg-gradient-to-r from-[#A456f7] to-[#3d81f6] text-sm rounded-md cursor-pointer'>

          <span className='mr-2 text-xl'>+</span> New Chat

        </button>

        {/* Search Conversations */}
        <div className='flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md'>

          <img src={assets.search_icon} className='w-4 not-dark:invert' alt="" />
          <input onChange={(e) => setSearch(e.target.value)} value={search} placeholder='Search Conversations' className='text-xs placeholder:text-gray-400 outline-none' type="text" />

        </div>

        {/* Recent Chats */}
        <div className='mt-4 flex justify-between items-center'>

          <p className='text-sm'>Recent Chats</p>

          <div className='flex gap-3'>

            <button
              disabled={processing}
              className='disabled:opacity-50'
              onClick={() => handleArchiveAllChatsClick()}
              title='Archive all chats'
            >
              <img src={assets.archive_all_icon} className='cursor-pointer w-5 h-5 dark:invert' alt="" />
            </button>

            <button
              disabled={processing}
              className='disabled:opacity-50'
              onClick={() => handleDeleteAllClick()}
              title='Delete all chats'
            >
              <img src={assets.delete_icon} className='cursor-pointer w-5 h-5 dark:invert' alt="" />
            </button>

          </div>

        </div>

        {userChatsLoading ?
          (
            <div className='flex-1 mt-6 flex justify-center text-sm space-y-3 min-h-50 md:min-h-40'>

              <img src={assets.loading_icon} className='w-5 h-5 dark:invert animate-spin' alt="" />

            </div>
          )
          :
          (
            <div className='flex-1 overflow-y-scroll mt-3 text-sm space-y-3 min-h-50 md:min-h-40'>

              {
                chats.length > 0 ?
                  (
                    chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) : chat.name.toLowerCase().includes(search.toLowerCase())).map((chat) => (

                      <div onClick={() => handleChatClick(chat)} key={chat._id} className={`relative py-2 pl-4 pr-1 dark:bg-[#57317c]/10 border ${chat._id === selectedChat?._id ? "border-black dark:border-white" : "border-gray-300 dark:border-[#80609f]/15"} rounded-md cursor-pointer flex justify-between items-center group min-w-0`}>

                        <div>

                          {
                            renameChatId === chat._id ?
                              (

                                <form onClick={(e) => e.stopPropagation()} onSubmit={(e) => onRenameSubmit(e, chat.name)} className='my-1'>

                                  <div className='flex relative border rounded-md pl-2 w-full py-2'>

                                    <input
                                      className='outline-none flex-1 max-w-45 min-w-0'
                                      onChange={(e) => setRenamedChatName(e.target.value)}
                                      value={renamedChatName}
                                      type="text"
                                      autoFocus
                                      maxLength={32}
                                      onBlur={() => {
                                        setRenameChatId(null);
                                        setRenamedChatName(null);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                          setRenameChatId(null);
                                          setRenamedChatName(null);
                                        }
                                      }}
                                    />

                                    <button onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.preventDefault()} type='submit' className='absolute top-0 right-0 text-lg rounded-r-md px-1 py-2 cursor-pointer bg-green-200 shrink-0'>
                                      <img src={assets.check_icon} className='w-5 h-5' alt="" />
                                    </button>

                                  </div>

                                </form>

                              )
                              :
                              (
                                <p className='truncate w-full'>
                                  {chat.name?.slice(0, 32) ?? "New Chat"}
                                </p>
                              )
                          }

                          <p>{moment(chat.updatedAt).fromNow()}</p>

                        </div>

                        <img onClick={(e) => handleOptionsClick(e, chat._id)} src={assets.options_icon} className='md:hidden group-hover:block w-8 h-8 cursor-pointer pl- dark:invert' alt="" />

                        {activeChatOptions === chat._id && (
                          <div className={`absolute right-2 top-10 z-50`}>

                            <ChatOptions
                              chatId={chat._id}
                              onClose={() => setActiveChatOptions(null)}
                              onRename={() => setRenameChatId(chat._id)}
                              setRenameInput={() => setRenamedChatName(chat.name)}
                              chatName={chat.name}
                            />

                          </div>
                        )}

                      </div>

                    ))
                  )
                  :
                  (
                    <p>No chats to show!</p>
                  )
              }

            </div>
          )
        }

        {/* User Account */}
        <div className='fixed bottom-0 left-0 w-full flex items-center gap-2 px-3 py-2 mt-4 border-t border-gray-300 dark:border-white/15  cursor-pointer group'>

          <CustomUserMenu />
          <p className='flex-1 text-sm cursor-default dark:text-primary truncate'>Hi, {user?.firstName}</p>

          {user && <img onClick={() => signOut()} src={assets.logout_icon} className='h-5 md:hidden not-dark:invert md:group-hover:block' />}

        </div>

        <img onClick={() => setIsMenuOpen(false)} src={assets.close_icon} className='absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert' alt="" />

      </div>

    </>

  )
}

export default Sidebar