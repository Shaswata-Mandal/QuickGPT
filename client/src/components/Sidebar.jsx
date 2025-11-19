import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import moment from 'moment'
import { assets } from '../assets/assets';
import { useClerk, UserButton } from '@clerk/clerk-react';

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {

  const {signOut} = useClerk();
  const { chats, setSelectedChat, theme, setTheme, user, navigate } = useAppContext();
  const [search, setSearch] = useState('');

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

  const handleCommunityClick = () => {

    navigate('/community');
    handleCloseSidebar();

  }

  const handleCreditsClick = () => {

    navigate('/credits');
    handleCloseSidebar();

  }

  return (

    <>

      {/* Black Transparent Overlay for Mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-500"
          onClick={handleOverlayClick}
        />
      )}

      <div className={`flex flex-col h-screen min-w-72 p-5 dark:bg-gradient-to-b from-[#242124] to-[#000000]/30 
        border-r border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 overflow-y-scroll bg-white dark:bg-transparent
        max-md:fixed max-md:top-0 max-md:left-0 max-md:h-full max-md:z-50 ${!isMenuOpen && 'max-md:-translate-x-full'}`}
      >

        <img className='w-full max-w-48' src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="" />

        {/* New Chat Button */}
        <button className='flex justify-center items-center w-full py-2 mt-8 text-white bg-gradient-to-r from-[#A456f7] to-[#3d81f6] text-sm rounded-md cursor-pointer'>

          <span className='mr-2 text-xl'>+</span> New Chat

        </button>

        {/* Search Conversations */}
        <div className='flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md'>

          <img src={assets.search_icon} className='w-4 not-dark:invert' alt="" />
          <input onChange={(e) => setSearch(e.target.value)} value={search} placeholder='Search Conversations' className='text-xs placeholder:text-gray-400 outline-none' type="text" />

        </div>

        {/* Recent Chats */}
        {chats.length > 0 && <p className='mt-4 text-sm'>Recent Chats</p>}

        <div className='flex-1 overflow-y-scroll mt-3 text-sm space-y-3 min-h-50 md:min-h-40'>

          {
            chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) : chat.name.toLowerCase().includes(search.toLowerCase())).map((chat) => (

              <div onClick={() => handleChatClick(chat)} key={chat._id} className='p-2 px-4 dark:bg-[#57317c]/10 border border-gray-300 dark:border-[#80609f]/15 rounded-md cursor-pointer flex justify-between group'>

                <div>

                  <p className='truncate w-full'>
                    {chat.messages.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name}
                  </p>

                  <p>{moment(chat.updatedAt).fromNow()}</p>

                </div>

                <img src={assets.bin_icon} className='hidden group-hover:block w-4 cursor-pointer not-dark:invert' alt="" />

              </div>

            ))
          }

        </div>

        {/* Community Images */}
        <div onClick={() => handleCommunityClick()} className='flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all'>

          <img src={assets.gallery_icon} className='w-4.5 not-dark:invert' alt="" />
          <div className='flex flex-col text-sm'>
            <p>Community Images</p>
          </div>

        </div>

        {/* Credits Purchase */}
        <div onClick={() => handleCreditsClick()} className='flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all'>

          <img src={assets.diamond_icon} className='w-4.5 dark:invert' alt="" />
          <div className='flex flex-col text-sm'>
            <p>Credits: {user?.credits}</p>
            <p className='text-xs text-gray-400'>Purchase credits to use quickgpt</p>
          </div>

        </div>

        {/* Dark Mode Toggle */}
        <div className='flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md'>

          <div className='flex items-center gap-2 text-sm'>
            <img src={assets.theme_icon} className='w-4 not-dark:invert' alt="" />
            <p>Dark Mode</p>
          </div>

          <label className='relative inline-flex cursor-pointer'>

            <input onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} type="checkbox" className='sr-only peer' checked={theme === 'dark'} />

            <div className='w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all'></div>

            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4'></span>

          </label>

        </div>

        {/* User Account */}
        <div className='flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group'>

          <UserButton/>
          <p className='flex-1 text-sm dark:text-primary truncate'>Hi, {user?.firstName}</p>

          {user && <img onClick={()=>signOut()} src={assets.logout_icon} className='h-5 cursor-pointer md:hidden not-dark:invert md:group-hover:block' />}

        </div>

        <img onClick={() => setIsMenuOpen(false)} src={assets.close_icon} className='absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert' alt="" />

      </div>

    </>

  )
}

export default Sidebar