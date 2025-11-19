import React, { useEffect, useState, useRef } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets';
import Message from './Message';

const ChatBox = () => {

  const { selectedChat, theme } = useAppContext();
  const containerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('text');
  const [isPublished, setIsPublished] = useState(false);

  const onSubmit = async (e) => {

    e.preventDefault();

  }

  useEffect(() => {

    if (selectedChat) {
      setMessages(selectedChat.messages);
    }

  }, [selectedChat]);

  useEffect(() => {

    if (containerRef.current) {

      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behaviour: "smooth",
      });

    }

  }, [messages]);

  return (
    <div className='relative flex flex-col gap-2 overflow-y-scroll w-full mt-12 md:mt-10'>

      <div className='flex-1 flex flex-col justify-between max-md:pt-0 p-5 sm:px-20 w-full pb-6 max-sm:pb-2 '>

        {/* Chat Messages */}
        <div ref={containerRef} className='flex-1'>

          {messages.length === 0 && (
            <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
              <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} className='w-full max-w-56 sm:max-w-68' alt="" />
              <p className='mt-5 text-3xl sm:text-5xl text-center text-gray-400 dark:text-white'>Ask me anything.</p>
            </div>
          )}

          {messages.map((message, index) => <Message key={index} message={message} />)}

          {/* Three Dots Loading */}
          {
            loading && <div className='loader flex items-center gap-1.5'>

              <img src={assets.logo} className='w-8 rounded-full my-4' alt="" />
              <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
              <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
              <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>

            </div>
          }

        </div>

      </div>

      <div className='sticky bottom-0 w-full flex flex-col items-center p-3 sm:pb-6 justify-center bg-white dark:bg-[#000000] dark:text-white z-20 dark:shadow-[0_-5px_15px_10px_rgba(0,0,0)] shadow-[0_-5px_15px_10px_rgba(255,255,255)]'>

        {/* Publish image to community checkbox */}
        {
          mode === 'image' && (

            <label className='inline-flex items-center gap-2 mb-3 text-sm mx-auto'>
              <p className='text-xs'>Publish Generated Image to Community</p>
              <input type="checkbox" className='cursor-pointer' checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            </label>

          )
        }

        {/* Prompt Input Box */}
        <form className='bg-primary/20 dark:bg-[#583c79]/30 border border-primary dark:border-[#80609f]/30 rounded-full w-full max-w-2xl p-3 pl-4 flex gap-4 items-center'>

          <select onChange={(e) => setMode(e.target.value)} value={mode} className='text-sm pl-3 pr-2 outline-none' id="">

            <option className='dark:bg-purple-900' value="text">Text</option>
            <option className='dark:bg-purple-900' value="image">Image</option>

          </select>

          <input onChange={(e) => setPrompt(e.target.value)} value={prompt} type="text" placeholder='Type your promt here...' className='flex-1 w-full text-sm outline-none' required />

          <button disabled={loading}>
            <img src={loading ? assets.stop_icon : assets.send_icon} className='w-8 cursor-pointer' alt="" />
          </button>

        </form>

      </div>

    </div>
  )
}

export default ChatBox