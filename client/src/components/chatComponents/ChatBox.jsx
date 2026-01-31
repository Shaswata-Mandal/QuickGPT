import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets, AVATAR_IMAGES } from '../../assets/assets';
import Message from './Message';
import { useParams } from 'react-router-dom';
import PromptBox from './PromptBox';
import NotificationBar from '../common/NotificationBar';

const ChatBox = () => {

  const { chatId } = useParams();
  const { llmWarning, selectedModel, selectedChatAvatar, fetchChatMessages, messages, responseLoading, messagesLoading, setSelectedChatId, messagesChatId } = useAppContext();

  const containerRef = useRef(null);

  const llmWarningMessage = llmWarning ? `You are close to your ${llmWarning.limitWindow} usage limit for ${llmWarning.provider}. Remaining requests left: ${llmWarning.remaining}.` : null;

  // Smooth scroll for new messages
  useEffect(() => {

    if (containerRef.current && messages.length > 0) {

      const timer = setTimeout(() => {

        containerRef?.current?.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: "smooth",
        });

      }, 100);

      return () => clearTimeout(timer);

    }

  }, [messages]);

  //Setting selected chatId and messages whenever the chatId changes in the url
  useEffect(() => {

    if (!chatId) return;

    setSelectedChatId(chatId);

    if (messagesChatId !== chatId) {

      fetchChatMessages(chatId);

    }

  }, [chatId]);

  return (
    <div className='relative h-full w-full flex flex-col'>

      {!messagesLoading && llmWarning && (

        <div className="mx-3 mt-3">

          <NotificationBar
            variant='warning'
            key={selectedModel}
            message={llmWarningMessage}
            duration={5000}
          />

        </div>

      )}


      {/* Notification */}
      {
        !messagesLoading && selectedChatAvatar &&
        <div className='mx-3 mt-3'>
          <NotificationBar key={chatId} message={`You are now talking to ${selectedChatAvatar?.name}`} duration={10000} />
        </div>
      }

      {
        selectedChatAvatar &&
        <div className='pointer-events-none absolute inset-0 flex max-sm:pt-30 pt-25 md:pt-35 justify-center z-0'>

          <img src={AVATAR_IMAGES[selectedChatAvatar.key]} className='w-55 h-55 sm:w-65 sm:h-65 rounded-full object-cover ring-2 ring-gray-200 opacity-40' alt="" />

        </div>
      }

      <div className='relative z-10 flex-1 overflow-y-auto p-5 sm:px-20 md:px-5 lg:px-30 xl:px-50' ref={containerRef}>

        {/* Chat Messages */}
        {messagesLoading ? (

          <div className='flex justify-center'>
            <img src={assets.loading_icon} className='w-5 h-5 mt-10 animate-spin dark:invert' alt="" />
          </div>

        ) : (

          <div className='flex-1'>


            {messages.map((message, index) => <Message key={index} message={message} />)}

            {/* Three Dots Loading */}
            {
              responseLoading && <div className='loader flex items-center gap-1.5'>

                <img src={assets.logo} className='w-8 rounded-full my-4' alt="" />
                <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
                <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
                <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>

              </div>
            }


          </div>

        )}

      </div>

      {/* Prompt Box Wrapper */}
      <PromptBox />

    </div >
  )
}

export default ChatBox