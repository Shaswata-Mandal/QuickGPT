import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets, AVAILABLE_MODELS } from '../../assets/assets';
import AiModelOptions from './AiModelOptions';

const Navbar = () => {

  const { setIsMenuOpen, isMenuOpen, isSignedIn, theme, setTheme, navigate, credits, freeCredits, isCreditsLoading, selectedModel, openSlideModal } = useAppContext();

  const selectedModelData = AVAILABLE_MODELS.find(model => model.id === selectedModel);

  const handleCommunityClick = () => {

    navigate('/community');

  }

  const handleCreditsClick = () => {

    navigate('/credits');

  }

  return (
    <nav className="border-b border-gray-200 dark:border-white/30 px-4 py-2 sm:py-3 shadow-sm flex items-center justify-between gap-3">

      {!isMenuOpen && isSignedIn && (

        <img onClick={() => setIsMenuOpen(true)} src={assets.menu_icon} className='w-8 h-8 cursor-pointer md:hidden not-dark:invert' alt="" />

      )}

      <div className='flex flex-1 max-sm:justify-end justify-between'>

        {/* Selected Model icon display */}
        <div 
          className='max-sm:hidden cursor-pointer hover:scale-105 transition-all'
          onClick={() => {
            openSlideModal({
              title: "Model Preference", 
              content: <AiModelOptions/>,
            })
          }}
        >
          <img src={selectedModelData.icon} className='w-8 h-8 rounded-md border border-black/80 dark:border-gray-400 bg-white' alt="" />
        </div>

        <div className='flex gap-1.5 sm:gap-2'>

          {/* Credits Purchase */}
          <button 
            disabled={isCreditsLoading}
            onClick={() => handleCreditsClick()} className='disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 px-2 py-1 border min-w-fit rounded hover:border-gray-300 cursor-pointer hover:scale-103 transition-all'
          >

            <img src={assets.diamond_icon} className='w-4.5 dark:invert' alt="" />

            <div className='flex gap-1 items-center text-sm'>

              <span>Credits:</span>

              {isCreditsLoading ?
                (
                  <div className='loader flex items-center ml-1 gap-1'>

                    <div className='w-1 h-1 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
                    <div className='w-1 h-1 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
                    <div className='w-1 h-1 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>

                  </div>
                )
                :
                (
                  <span>{credits + freeCredits}</span>
                )
              }

            </div>

          </button>


          {/* Community Images */}
          <div onClick={() => handleCommunityClick()} className='flex items-center justify-center border rounded border-gray-300 w-8 h-8 cursor-pointer hover:scale-105 transition-all'>

            <img src={assets.gallery_icon} className='w-5 not-dark:invert' alt="" />

          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative cursor-pointer w-8 h-8 border rounded border-gray-300 flex items-center justify-center transition-transform duration-300 hover:scale-105"
          >

            <img
              src={assets.dark_mode}
              className={`w-4 h-4 absolute transition-all duration-300 ${theme === 'light'
                ? 'opacity-100 rotate-0'
                : 'opacity-0 -rotate-90'
                }`}
              alt="Light mode"
            />

            <img
              src={assets.light_mode} // You might want to use a different icon for moon
              className={`w-5 h-5 absolute transition-all duration-300 ${theme === 'dark'
                ? 'opacity-100 rotate-0 dark:invert'
                : 'opacity-0 rotate-90'
                }`}
              alt="Dark mode"
            />

          </button>

        </div>

      </div>

    </nav>
  );
};

export default Navbar;