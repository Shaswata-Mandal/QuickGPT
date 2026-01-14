import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets';
import Message from './Message';
import toast from 'react-hot-toast';
import Loading from '../../pages/Loading';

const ChatBox = () => {

  const { messages, setMessages, selectedChat, theme, user, axios, getToken, createNewChat, updateChatMessages, fetchCreditDetails, updateChatName, setPopOverModal } = useAppContext();

  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('text');
  const [isPublished, setIsPublished] = useState(false);

  const containerRef = useRef(null);

  // Smooth scroll for new messages
  useEffect(() => {

    if (containerRef.current && messages.length > 0) {
      const timer = setTimeout(() => {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);

      return () => clearTimeout(timer);
    }

  }, [messages]);

  const handleOnSubmit = async (e) => {

    try {

      e.preventDefault();

      if (!user) {
        return toast.error("Login to send message!");
      }

      if (!prompt.trim()) {
        return toast.error("Please enter a message!");
      }

      setLoading(true);
      const token = await getToken();
      const promptCopy = prompt;
      setPrompt('');

      // Create new chat if needed and get the chat object FIRST
      let currentChat = selectedChat;
      if (!currentChat) {
        currentChat = await createNewChat();
        if (!currentChat) {
          toast.error("Failed to create chat");
          setLoading(false);
          return;
        }
      }

      // Add user message - use currentChat.messages as source of truth
      const userMessage = {
        role: "user",
        content: prompt,
        timestamp: Date.now(),
        isImage: false
      };

      // Get current messages from the chat
      const currentMessages = currentChat.messages || [];
      const updatedMessagesWithUser = [...currentMessages, userMessage];

      // Update all states
      setMessages(updatedMessagesWithUser); // Update UI state
      updateChatMessages(currentChat._id, updatedMessagesWithUser); // Update context state

      const { data } = await axios.post(
        `/api/message/${mode}`,
        {
          chatId: currentChat._id,
          prompt: prompt.trim(),
          isPublished
        },
        {
          headers: { Authorization: token }
        }
      );

      if (data.success) {

        // Update with AI response
        const updatedMessagesWithAI = [...updatedMessagesWithUser, data.reply];
        setMessages(updatedMessagesWithAI);
        updateChatMessages(currentChat._id, updatedMessagesWithAI);
        fetchCreditDetails();

        if (data.chatName !== null) {

          updateChatName(currentChat._id, data.chatName);

        }

      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }

    } catch (error) {

      console.error('Send message error:', error);
      toast.error(error.response?.data?.message || error.message);

      // Restore prompt on error
      setPrompt(prompt);

    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {

    if (selectedChat) {
      setMessages(selectedChat.messages);
    }

  }, [selectedChat]);

  const autoResizeTextarea = (e) => {

    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';

  };

  return (
    <div className='relative h-full w-full flex flex-col gap-2 overflow-y-scroll'>

      <div className='flex-1 flex flex-col justify-between max-md:pt-5 p-5 sm:px-20 md:px-5 lg:px-30 xl:px-50 w-full pb-6 max-sm:pb-2 '>

        {/* Chat Messages */}
        <div ref={containerRef} className='flex-1'>

          {selectedChat === null ?
            (
              <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
                <img onClick={()=>setPopOverModal({isOpen: true, content: <Loading/>, title: "Loading Page"})} src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} className='w-full max-w-56 sm:max-w-68' alt="" />
                <p className='mt-5 text-3xl sm:text-5xl text-center text-gray-400 dark:text-white'>Ask me anything.</p>
              </div>
            )
            :
            (
              <div>
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
            )
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
        <form onSubmit={handleOnSubmit} className='bg-primary/20 dark:bg-[#583c79]/30 border border-primary dark:border-[#80609f]/30 rounded-2xl w-full max-w-2xl py-3 px-4  flex flex-col gap-1 justify-center items-center'>

          <div className='flex-1 relative min-h-10 max-h-25 w-full overflow-y-auto '>

            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!loading && prompt.trim()) {
                    handleOnSubmit(e);
                  }
                }
              }}
              onInput={autoResizeTextarea}
              placeholder='Type your prompt here... (Shift + Enter for new line)'
              className='w-full text-sm outline-none bg-transparent resize-y min-h-10 max-h-25'
              rows={1}
              required
            />

          </div>

          <div className='flex w-full justify-between'>

            <div
              onClick={() => setMode(mode === "text" ? "image" : "text")}
              className='relative cursor-pointer gap-8 pr-2 h-8 border rounded-md border-gray-300 flex items-center transition-transform duration-300'
            >

              <div className='flex items-center justify-center'>

                <img
                  src={assets.font_icon}
                  className={`w-5 h-5 absolute left-2 dark:invert transition-all duration-300 ${mode === 'text'
                    ? 'opacity-100 rotate-0'
                    : 'opacity-0 -rotate-90'
                    }`}
                  alt="Text mode"
                />

                <img
                  src={assets.image_icon} // You might want to use a different icon for moon
                  className={`w-5 h-5 absolute left-2 transition-all duration-300 ${mode === 'image'
                    ? 'opacity-100 rotate-0 dark:invert'
                    : 'opacity-0 rotate-90'
                    }`}
                  alt="Image mode"
                />

              </div>

              <p className='text-sm'>{mode === "text" ? "Text" : "Image"}</p>

            </div>

            <button disabled={loading} className={`rounded-full transition-colors ${loading || !prompt.trim()
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-primary/20 dark:hover:bg-[#80609f]/30'
              }`}
            >

              <img src={loading ? assets.stop_icon : assets.send_icon} className='w-8 cursor-pointer' alt="" />

            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default ChatBox