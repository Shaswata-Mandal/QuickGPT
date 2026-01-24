import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets';
import Message from './Message';
import { useParams } from 'react-router-dom';
import PromptBox from './PromptBox';

const ChatBox = () => {

  const { chatId } = useParams();
  const { fetchChatMessages, messages, responseLoading, messagesLoading, setSelectedChatId, messagesChatId } = useAppContext();

  const containerRef = useRef(null);

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
    <div className='relative h-full w-full flex flex-col gap-2 overflow-y-scroll'>

      <div className='flex-1 flex flex-col justify-between max-md:pt-5 p-5 sm:px-20 md:px-5 lg:px-30 xl:px-50 w-full pb-6 max-sm:pb-2 '>

        {/* Chat Messages */}
        {messagesLoading ? (

          <div className='flex justify-center'>
            <img src={assets.loading_icon} className='w-5 h-5 mt-10 animate-spin' alt="" />
          </div>

        ) : (

          <div className='flex-1'>

            <div ref={containerRef}>
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

          </div>

        )}

      </div>

      {/* Prompt Box Wrapper */}
      <PromptBox />

    </div>
  )
}

export default ChatBox