import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';
import EnableShare from './EnableShare';

const ChatOptions = ({ chatId, onClose, onRename, setRenameInput, chatName }) => {

    const { setChats, fetchUserChats, setSelectedChat, navigate, axios, getToken, customConfirm, openPopOverModal } = useAppContext();
    const [isArchiving, setIsArchiving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleRenameChat = async (e) => {

        if (onRename) {
            e.stopPropagation()
            onRename();
            setRenameInput();
            onClose();
        }

    };

    const handleArchiveChat = async () => {

        if(isArchiving){
            toast.error("Already a chat is being archived. Please try later!");
            return;
        }
        
        const confirmed = await customConfirm({ title: "Confirm action", message: "Are you sure you want to archive this chat?" });
        if (!confirmed) return;

        setIsArchiving(true);

        try {

            const token = await getToken();

            const { data } = await axios.post('/api/chat/archive-unarchive-chat',
                { chatId, archive: true },
                {
                    headers: { Authorization: token }
                }
            );

            if (data.success) {

                await fetchUserChats();

                if (onClose) {
                    onClose();
                }

                toast.success("Chat Archived Successfully!");

            }
            else{
                toast.error("Failed to archive chat!");
            }

        } catch (error) {
            toast.error(error.message);
        } finally{
            setIsArchiving(false);
        }

    };

    const handleShareChat = async () => {

        openPopOverModal({
            title: chatName, 
            content: (
                <EnableShare
                    chatId={chatId}
                />
            )
        });

    };

    const handleDeleteChat = async (e, chatId) => {

        if(isDeleting){
            toast.error("Already a chat is being deleted. Please try later!");
            return;
        }

        const confirmed = await customConfirm({ title: "Confirm action", message: "Are you sure you want to delete this chat?" });
        if (!confirmed) {
            onClose();
            return;
        }

        setIsDeleting(true);

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
                await fetchUserChats();
                setSelectedChat(null);
                navigate('/');

                toast.success(data.message);

            } else {
                // Handle API success: false case
                toast.error(data.message || 'Failed to delete chat');
            }

            if (onClose) {
                onClose();
            }

        } catch (error) {

            console.error('Delete chat error:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to delete chat');

        } finally {
            setIsDeleting(false);
        }

    };

    return (
        <div className='border rounded-md border-gray-500 p-1 flex flex-col gap-1 bg-white dark:bg-[#57317c] dark:border-[#80609f]/15 shadow-lg min-w-30'>

            <button
                onClick={(e) => handleRenameChat(e)}
                className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
            >

                <img src={assets.rename_icon} className='w-4 h-4 dark:invert' alt="Rename" />
                <p className="text-sm">Rename</p>

            </button>

            <button
                onClick={handleArchiveChat}
                className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
            >

                <img src={assets.archive_icon} className='w-4.5 h-5 dark:invert' alt="Rename" />
                <p className="text-sm">Archive</p>

            </button>

            <button
                onClick={handleShareChat}
                className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
            >

                <img src={assets.share_icon} className='w-4 h-4 dark:invert' alt="Rename" />
                <p className="text-sm">Share</p>

            </button>

            <button
                onClick={(e) => handleDeleteChat(e, chatId)}
                className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
            >

                <img src={assets.bin_icon} className='w-4 h-4 not-dark:invert' alt="Rename" />
                <p className="text-sm">Delete</p>

            </button>


        </div>
    )
}

export default ChatOptions