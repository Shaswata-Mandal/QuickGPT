import React, { useEffect, useRef } from 'react'
import { assets } from '../../assets/assets'
import PromptBox from './PromptBox'
import { useAppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'

const EmptyChat = () => {

    const { chatId } = useParams();
    const { theme, setMessages, setSelectedChatId, setMessagesChatId, setSelectedChatAvatar } = useAppContext();

    useEffect(() => {

        if (!chatId) {
            setMessages([]);
            setSelectedChatId(null);
            setMessagesChatId(null);
        }

    }, [chatId]);

    const containerRef = useRef(null);

    return (
        <div className='relative h-full w-full flex flex-col gap-2 overflow-y-scroll'>

            <div className='flex-1 flex flex-col justify-between max-md:pt-5 p-5 sm:px-20 md:px-5 lg:px-30 xl:px-50 w-full pb-6 max-sm:pb-2 '>

                {/* Chat Messages */}
                <div ref={containerRef} className='flex-1'>

                    <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
                        <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} className='w-full max-w-56 sm:max-w-68' alt="" />
                        <p className='mt-5 text-3xl sm:text-5xl text-center text-gray-400 dark:text-white'>Ask me anything.</p>
                    </div>

                </div>

            </div>

            {/* Prompt Box Wrapper */}
            <PromptBox chatMode={"default"}/>

        </div>
    )
}

export default EmptyChat