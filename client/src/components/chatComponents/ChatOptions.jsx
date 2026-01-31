import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';
import EnableShare from './EnableShare';
import { useConfirm } from '../../hooks/useConfirm';

const ChatOptions = ({ chatId, onClose, onRename, setRenameInput, chatName }) => {

    const customConfirm = useConfirm();
    const { setChats, fetchUserChats, navigate, axios, getToken, openPopOverModal } = useAppContext();
    const [isArchiving, setIsArchiving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleRenameChat = async (e) => {

        if (onRename) {
            e.stopPropagation();
            onRename();
            setRenameInput();
            onClose();
        }

    };

    const handleArchiveChat = async (e) => {

        e.preventDefault();
        e.stopPropagation();

        if (isArchiving) {
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
                navigate("/");

                if (onClose) {
                    onClose();
                }

                toast.success("Chat Archived Successfully!");

            }
            else {
                toast.error("Failed to archive chat!");
            }

        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsArchiving(false);
        }

    };

    const handleShareChat = async (e) => {

        e.preventDefault();
        e.stopPropagation();

        openPopOverModal({
            title: chatName,
            size: "md",
            content: (
                <EnableShare
                    chatId={chatId}
                />
            )
        });

    };

    const handleDeleteChat = async (e, chatId) => {

        e.preventDefault();
        e.stopPropagation();

        if (isDeleting) {
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
        <div className='border rounded-md border-gray-500 p-1 flex flex-col gap-1 bg-white dark:bg-[#57317c] dark:border-[#80609f]/15 shadow-lg min-w-30 mb-10'>

            <div className='flex flex-col gap-1 pb-1 border-b'>

                <button
                    onClick={(e) => handleRenameChat(e)}
                    className="flex items-center gap-2 w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
                >

                    <img src={assets.rename_icon} className='w-4 h-4 dark:invert' alt="Rename" />
                    <p className="text-sm">Rename</p>

                </button>

                <button
                    onClick={(e) => handleArchiveChat(e)}
                    className="flex items-center gap-2 w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
                >

                    <img src={assets.archive_icon} className='w-4.5 h-5 dark:invert' alt="Rename" />
                    <p className="text-sm">Archive</p>

                </button>

                <button
                    onClick={(e) => handleShareChat(e)}
                    className="flex items-center gap-2 w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
                >

                    <img src={assets.share_icon} className='w-4 h-4 dark:invert' alt="Rename" />
                    <p className="text-sm">Share</p>

                </button>

            </div>

            <button
                onClick={(e) => handleDeleteChat(e, chatId)}
                className="flex items-center gap-2 w-full px-2 py-1 border border-red-500 max-sm:bg-red-300 max-sm:dark:bg-red-500 hover:bg-red-300 dark:hover:bg-red-500 rounded-md transition-colors cursor-pointer"
            >

                <img src={assets.bin_icon} className='w-4 h-4 not-dark:invert' alt="Rename" />
                <p className="text-sm">Delete</p>

            </button>


        </div>
    )
}

export default ChatOptions