import React, { useState } from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import CooldownTimer from '../common/CooldownTimer';

const PromptBox = ({ chatMode, avatarId = null }) => {

    const { getRemaningCooldown, cooldownInfo, setCooldownInfo, setLlmWarning, axios, responseLoading, setResponseLoading, user, getToken, selectedChatId, setMessages, selectedModel, createNewChat, fetchCreditDetails, updateChatName } = useAppContext();

    const remainingCooldown = getRemaningCooldown(selectedModel);
    const showCooldown = cooldownInfo.hasOwnProperty(selectedModel) && remainingCooldown !== null;
    const isPromptDisabled = remainingCooldown > 0;

    const [prompt, setPrompt] = useState('');
    const [mode, setMode] = useState('text');
    const [isPublished, setIsPublished] = useState(false);

    const handleOnPromptSubmit = async (e) => {

        e.preventDefault();

        if (!user) {
            return toast.error("Login to send message!");
        }

        if (!prompt.trim()) {
            return toast.error("Please enter a message!");
        }

        setResponseLoading(true);

        const promptCopy = prompt;
        setPrompt('');

        let chatId = selectedChatId;

        // Create new chat if needed and get the chat object FIRST
        if (!selectedChatId) {

            const newChat = await createNewChat(chatMode, avatarId);

            if (!newChat) {
                toast.error("Failed to create chat");
                setResponseLoading(false);
                return;
            }

            chatId = newChat._id;

        }

        // Adding user message
        const userMessage = {
            role: "user",
            content: promptCopy,
            timestamp: Date.now(),
            isImage: false
        };

        // Updating messages with user message for UI
        setMessages(prev => [...prev, userMessage]);

        try {

            const token = await getToken();

            const response = await axios.post(
                `/api/message/${mode}`,
                {
                    chatId: chatId,
                    prompt: promptCopy.trim(),
                    aiModel: selectedModel,
                    isPublished
                },
                {
                    headers: { Authorization: token }
                }
            );

            const data = response.data;
            const headers = response.headers;

            //Setting chat name from headers
            const chatName = headers["x-chat-name"];
            if (chatName) {

                updateChatName(chatId, chatName);

            }

            //Near limit warning 
            if (response.headers["x-llm-warning"] === "NEAR-LIMIT") {
                setLlmWarning({
                    remaining: headers["x-llm-remaining"],
                    provider: headers["x-llm-locked-provider"]
                });
            }

            //Cooldown handling 
            if (headers["x-llm-locked"] === "true") {

                const provider = headers["x-llm-locked-provider"];
                const retryAfter = Number(headers["x-llm-cooldown"] || 60);

                if (provider) {

                    setCooldownInfo(prev => ({
                        ...prev,
                        [provider]: {
                            startedAt: Date.now(),
                            retryAfter
                        }
                    }));

                }

            }

            if (data.success) {

                // Update with AI response
                setMessages(prev => [...prev, data.reply]);
                fetchCreditDetails();

            } else {
                setMessages([]);
                toast.error(data.message);
                setPrompt(promptCopy);
            }

        } catch (error) {

            console.error('Send message error:', error);
            toast.error(error.response?.data?.message || error.message);

            // Restore prompt on error
            setPrompt(prompt);

        } finally {
            setResponseLoading(false);
        }

    }

    const autoResizeTextarea = (e) => {

        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';

    };

    return (
        <div className='sticky bottom-0 w-full flex flex-col items-center p-3 sm:pb-6 justify-center bg-white dark:bg-[#000000] dark:text-white z-20 dark:shadow-[0_-5px_15px_10px_rgba(0,0,0)] shadow-[0_-5px_15px_10px_rgba(255,255,255)]'>

            {showCooldown &&
                <div className='w-full flex justify-center items-center mb-3'>

                    <CooldownTimer seconds={remainingCooldown} provider={selectedModel} />

                </div>
            }

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
            <form onSubmit={handleOnPromptSubmit} className={`bg-primary/20 dark:bg-[#583c79]/30 border border-primary dark:border-[#80609f]/30 rounded-2xl w-full max-w-2xl py-3 px-4  flex flex-col gap-1 justify-center items-center ${isPromptDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>

                <div className='flex-1 relative min-h-10 max-h-25 w-full overflow-y-auto '>

                    <textarea
                        disabled={isPromptDisabled}
                        onChange={(e) => setPrompt(e.target.value)}
                        value={prompt}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (!responseLoading && prompt.trim()) {
                                    handleOnPromptSubmit(e);
                                }
                            }
                        }}
                        onInput={autoResizeTextarea}
                        placeholder='Type your prompt here... (Shift + Enter for new line)'
                        className={`w-full text-sm outline-none bg-transparent resize-y min-h-10 max-h-25 ${isPromptDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        rows={1}
                        required
                    />

                </div>

                <div className='flex w-full justify-between'>

                    <button
                        disabled={isPromptDisabled}
                        onClick={() => setMode(mode === "text" ? "image" : "text")}
                        className={`relative gap-8 pr-2 h-8 border rounded-md border-gray-300 flex items-center transition-transform duration-300 ${isPromptDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                    >

                        <div className={`flex items-center justify-center`}>

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

                    </button>

                    <button disabled={responseLoading || isPromptDisabled} className={`rounded-full transition-colors ${responseLoading || !prompt.trim() || isPromptDisabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-primary/20 dark:hover:bg-[#80609f]/30 cursor-pointer'
                        }`}
                    >

                        <img src={responseLoading ? assets.stop_icon : assets.send_icon} className='w-8' alt="" />

                    </button>

                </div>

            </form>

        </div>
    )
}

export default PromptBox