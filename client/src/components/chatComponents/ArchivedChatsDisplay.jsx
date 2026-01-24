import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import moment from 'moment';
import NothingHere from '../common/NothingHere';
import { useConfirm } from '../../hooks/useConfirm' 

//Title feature buttons component
export const UnarchiveAllChats = ({ onDeleteAllArchiveChatsClick, onArchiveAllChatsClick, loading }) => {

    return (
        <div className='flex gap-3 sm:gap-2'>

            <button
                disabled={loading}
                onClick={onDeleteAllArchiveChatsClick}
                className='disabled:opacity-50'
                title='Delete all archived chats'
            >
                <img src={assets.delete_icon} className='w-5 h-5 cursor-pointer dark:invert' alt="" />
            </button>

            <button
                disabled={loading}
                onClick={onArchiveAllChatsClick}
                className='disabled:opacity-50'
                title='Unarchive all chats'
            >
                <img src={assets.unarchive_icon} className='w-5 h-5 cursor-pointer dark:invert' alt="" />
            </button>

        </div>
    )

}

const ArchivedChatsDisplay = () => {

    const customConfirm = useConfirm();
    const { axios, getToken, fetchUserChats, setChats, navigate, setSlideModal } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [archivedChats, setArchivedChats] = useState([]);
    const [processing, setProcessing] = useState(false);

    const handleUnarchiveAllChats = async () => {

        if (processing) {
            toast.error("Please wait, an action is already in progress.");
            return;
        }

        if (archivedChats.length === 0) {
            toast.error("There are no chats to be unarchived");
            return;
        }

        const confirmed = await customConfirm({ title: "Confirm action", message: "Unarchive all chats?" });
        if (!confirmed) return;

        setProcessing(true);

        try {

            const token = await getToken();

            const { data } = await axios.post(
                '/api/chat/archive-unarchive-chat',
                { archive: false },
                { headers: { Authorization: token } }
            );

            if (data.success) {

                await fetchArchivedChats();
                await fetchUserChats();
                toast.success("All chats unarchived!");

            }

        } catch {
            toast.error("Failed to unarchive chats");
        } finally {
            setProcessing(false);
        }

    };

    const handleDeleteAllArchivedChats = async () => {

        if (processing) {
            toast.error("Please wait, an action is already in progress.");
            return;
        }

        if (archivedChats.length === 0) {
            toast.error("There are no archived chats to be deleted!");
            return;
        }

        const confirmed = await customConfirm({ title: "Confirm action", message: "Are you sure you want to permanently delete all archived chats?" });
        if (!confirmed) return;

        setProcessing(true);

        try {

            const token = await getToken();

            const { data } = await axios.post(
                '/api/chat/delete-all-archived-chats',
                {},
                {
                    headers: { Authorization: token }
                }
            );

            if (data.success) {

                await fetchArchivedChats();
                navigate("/");
                toast.success(data?.message || "All archived chats deleted successfully!");

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete archived chats");
        } finally {
            setProcessing(false);
        }

    }

    const fetchArchivedChats = async () => {

        setLoading(true);

        try {

            const token = await getToken();

            const { data } = await axios.get('/api/chat/get-archived-chats', { headers: { Authorization: token } });

            if (data.success) {
                setArchivedChats(data.archivedChats);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to fetch archived chat');
        } finally {
            setLoading(false);
        }

    }

    const handleUnarchiveChatClick = async (chatId) => {

        if (processing) {
            toast.error("Please wait, an action is already in progress.");
            return;
        }

        const confirmed = await customConfirm({ title: "Confirm action", message: "Are you sure you want to unarchive this chat?" });
        if (!confirmed) return;

        setProcessing(true);

        try {

            const token = await getToken();

            const { data } = await axios.post(
                '/api/chat/archive-unarchive-chat',
                { chatId, archive: false },
                {
                    headers: { Authorization: token }
                }
            );

            if (data.success) {
                await fetchArchivedChats();
                await fetchUserChats();
                toast.success("Chat Unarchived Successfully!");
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to unarchive chat');
        } finally {
            setProcessing(false);
        }

    }

    const handleDeleteChat = async (e, chatId) => {

        if (processing) {
            toast.error("Please wait, an action is already in progress.");
            return;
        }

        const confirmed = await customConfirm({ title: "Confirm action", message: "Are you sure you want to delete this chat?" });
        if (!confirmed) return;

        setProcessing(true);

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
                await fetchArchivedChats();
                await fetchUserChats();
                navigate('/');

                toast.success(data.message);

            } else {
                // Handle API success: false case
                toast.error(data.message || 'Failed to delete chat');
            }

        } catch (error) {

            console.error('Delete chat error:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to delete chat');

        } finally {
            setProcessing(false);
        }

    }

    //Mounting the title feature buttons
    useEffect(() => {

        setSlideModal(prev => ({
            ...prev,
            titleFeature: (
                <UnarchiveAllChats
                    loading={processing}
                    onArchiveAllChatsClick={handleUnarchiveAllChats}
                    onDeleteAllArchiveChatsClick={handleDeleteAllArchivedChats}
                />
            ),
        }));

        // cleanup on unmount
        return () => {
            setSlideModal(prev => ({
                ...prev,
                titleFeature: null,
            }));
        };

    }, [processing, archivedChats.length]);

    useEffect(() => {

        fetchArchivedChats();

    }, []);

    if (loading) {
        return (
            <div className='flex-1 mt-6 flex justify-center text-sm space-y-3 min-h-50 md:min-h-40'>

                <img src={assets.loading_icon} className='w-5 h-5 dark:invert animate-spin' alt="" />

            </div>
        )
    }

    return (
        <div className='flex flex-col gap-3 w-full'>

            {archivedChats.length > 0 && <p className='text-xs text-center px-2 py-2 bg-gray-200 border border-gray-300 rounded-md'>Showing {archivedChats.length} archived chats</p>}

            {archivedChats.length === 0 ?
                (
                    <NothingHere />
                )
                :
                (
                    <div className='flex-1 overflow-y-scroll mt-3 text-sm space-y-3 min-h-50 md:min-h-40'>

                        {
                            archivedChats.map((chat, index) => (

                                <div key={index} className={`relative py-2 px-4 dark:bg-[#57317c]/10 border border-gray-300 dark:border-[#80609f]/15 rounded-md cursor-pointer flex justify-between items-center group`}>

                                    <div className='dark:invert'>


                                        <p className='truncate w-full'>
                                            {chat.name?.length < 25 ? chat.name : `${chat.name?.slice(0, 25)}...` || "New Chat"}
                                        </p>

                                        <p>{moment(chat.updatedAt).fromNow()}</p>

                                    </div>

                                    <div className='flex items-center gap-3 sm:gap-2'>

                                        <button
                                            disabled={loading}
                                            onClick={(e) => handleDeleteChat(e, chat._id)}
                                            className='disabled:opacity-50'
                                            title='Delete all archived chats'
                                        >
                                            <img src={assets.bin_icon} className='md:hidden group-hover:block w-5 h-5 cursor-pointer not-dark:invert' alt="" />
                                        </button>

                                        <button
                                            disabled={loading}
                                            onClick={() => handleUnarchiveChatClick(chat._id)}
                                            className='disabled:opacity-50'
                                            title='Unarchive all chats'
                                        >
                                            <img src={assets.unarchive_chat_icon} className='w-6 h-6 cursor-pointer dark:invert' alt="" />
                                        </button>       
                                        
                                    </div>

                                </div>

                            ))
                        }

                    </div>
                )
            }

        </div>
    )
}

export default ArchivedChatsDisplay