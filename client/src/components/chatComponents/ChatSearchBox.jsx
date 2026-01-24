import React, { useEffect, useMemo, useRef, useState } from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import moment from 'moment';
import NothingHere from '../common/NothingHere';

//New Concept Learned: useMemo() is used where heavy calulations are done, like filtering, sorting, gouping, etc. It caches the values/results and works on it, 
//preventing unecessary re-renders on evry minor change in the dependency fields. 
//useCallback is used to cache a function.

const ChatSearchBox = () => {

    const dropdownRef = useRef();
    const { chats, navigate, closeTopPopOverModal, userChatsLoading } = useAppContext();
    const [search, setSearch] = useState('');
    const [chatType, setChatType] = useState("all");
    const [sortOrder, setSortOrder] = useState("desc");
    const [showChatTypeOptions, setShowChatTypeOptions] = useState(false);

    useEffect(() => {

        const handleOutsideClick = (e) => {

            if (!dropdownRef.current) return;

            if (!dropdownRef.current.contains(e.target)) {
                setShowChatTypeOptions(false);
            }

        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => document.removeEventListener("mousedown", handleOutsideClick);

    }, []);

    //Helper function to get the date group based on the given chat date
    const getDateGroup = (date) => {

        const now = new Date();
        const chatDate = new Date(date);

        const diffDays = Math.floor((now - chatDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays <= 7) return "Past 7 Days";
        if (diffDays <= 30) return "Past 30 Days";
        return "Older";

    }

    //Using useMemo hook to do the filtering, sorting and grouping task inside it, to avoid unnecessary re-renders
    const processedChats = useMemo(() => {

        if (!chats) return {};

        let filtered = chats;

        //Search
        if (search.trim()) {

            filtered = filtered.filter(chat =>
                chat?.name?.toLowerCase().includes(search?.toLowerCase())
            );

        }

        //Chat type filter
        if (chatType !== "all") {

            filtered = filtered.filter(chat => chat.chatMode === chatType);

        }

        //Sorting by updated At
        filtered = [...filtered].sort((a, b) => {

            const aTime = new Date(a.updatedAt).getTime();
            const bTime = new Date(b.updatedAt).getTime();

            return sortOrder === "asc" ? aTime - bTime : bTime - aTime;

        });

        return filtered.reduce((groups, chat) => {

            const group = getDateGroup(chat.updatedAt);

            if (!groups[group]) {
                groups[group] = [];
            }

            groups[group].push(chat);

            return groups;

        }, {});

    }, [chats, search, chatType, sortOrder]);

    const hasChats = Object.values(processedChats).some(
        group => group.length > 0
    );

    if (userChatsLoading) {
        return (
            <div className='p-5 flex-1 mt-6 flex justify-center text-sm space-y-3 min-h-50'>

                <img src={assets.loading_icon} className='w-5 h-5 dark:invert animate-spin' alt="" />

            </div>
        )
    }

    return (
        <div className='w-full flex flex-col gap-5 min-h-[60vh] p-5'>

            {/* Search input box, sort, chatType and new chat buttons */}
            <div className='flex flex-col gap-3'>

                <div className='flex flex-row gap-2'>

                    <div className='flex flex-1 gap-2 items-center border dark:border-white rounded-md py-2 px-2'>

                        <img src={assets.search_icon} className='w-5 h-5 not-dark:invert' alt="" />

                        <input
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                            placeholder='Search Chats...'
                            className='w-full text-sm bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-none'
                            type="text"
                        />

                    </div>

                    <button
                        onClick={() => {
                            navigate("/");
                            closeTopPopOverModal();
                        }}
                        title='Start a new chat'
                        className='p-2 cursor-pointer bg-gray-200 dark:bg-primary/40 rounded-md sm:hover:bg-gray-300 dark:sm:hover:bg-primary/50 active:scale-95'
                    >
                        <img src={assets.new_chat_icon} className='w-5 h-5 dark:invert' alt="" />
                    </button>

                </div>

                <div className='flex gap-2 justify-end'>

                    <div className='relative' ref={dropdownRef}>

                        {/* Trigger */}
                        <div onClick={() => setShowChatTypeOptions(prev => !prev)} className='w-full flex gap-1 items-center border dark:border-white rounded-md p-2'>

                            <input
                                value={chatType === "default" ? "Normal chats" : chatType === "avatar" ? "Avatar chats" : "All chats"}
                                placeholder='Select Chat Type'
                                className='max-w-23 text-sm bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-none'
                                type="text"
                                readOnly
                            />

                            <img
                                src={assets.down_arrow_icon}
                                className={`w-5 h-5 cursor-pointer transition-transform dark:invert ${showChatTypeOptions ? "rotate-180" : ""}`}
                                alt=""
                            />

                        </div>

                        {/* Drop Down */}
                        {showChatTypeOptions && (
                            <div className={`absolute top-11 w-full border rounded-md flex flex-col gap-2 p-2 bg-white z-1`}>

                                {["all", "default", "avatar"].map((type, index) => (

                                    <div
                                        onClick={() => { setChatType(type); setShowChatTypeOptions(false) }}
                                        className='text-sm p-1 pl-2 max-md:bg-gray-200 hover:bg-gray-200 rounded-md cursor-pointer'
                                    >
                                        {type === "default" ? "Normal chats" : type === "avatar" ? "Avatar chats" : "All chats"}
                                    </div>

                                ))}

                            </div>
                        )}

                    </div>

                    <button
                        onClick={() => {
                            setSortOrder(prev => (prev === "asc" ? "desc" : "asc"))
                        }}
                        title='Sort by date'
                        className='p-2 cursor-pointer bg-gray-200 dark:bg-primary/40 rounded-md sm:hover:bg-gray-300 dark:sm:hover:bg-primary/50 active:scale-95'
                    >
                        <img src={assets.sort_icon} className={`${sortOrder === "asc" ? "rotate-180" : "rotate-0"} transition-transform w-5 h-5 dark:invert`} alt="" />
                    </button>

                </div>

            </div>

            {/* Displaying filtered chats */}
            <div className={`flex-1 flex ${!hasChats ? "items-center" : ""} overflow-y-auto`}>

                {!hasChats ?
                    (
                        <NothingHere />

                    )
                    :
                    (
                        Object.entries(processedChats).map(([group, chats]) => (

                            <div className='w-full' key={group}>

                                <p className="text-xs font-medium text-gray-500 mb-3">
                                    {group}
                                </p>

                                <div className='flex flex-col gap-3'>

                                    {
                                        chats?.map(chat => (

                                            <div
                                                className={`flex items-center justify-between py-1 md:py-2 px-2 md:px-3 dark:bg-[#57317c]/30 border border-gray-300 dark:border-[#80609f]/15 rounded-md cursor-pointer`}
                                                key={chat._id}
                                            >

                                                <div className='flex gap-2 items-center'>

                                                    <img src={assets.chat_icon} className='w-6 h-6 dark:invert' alt="" />

                                                    <div className='dark:invert'>

                                                        <p className='truncate w-full text-sm'>
                                                            {chat.name ? (chat.name?.length < 22 ? chat.name : `${chat.name?.slice(0, 22)}...`) : "New Chat"}
                                                        </p>

                                                        <p className='text-xs'>{moment(chat.updatedAt).fromNow()}</p>

                                                    </div>

                                                </div>

                                                <div className='flex gap-1'>

                                                    <img
                                                        onClick={() => {
                                                            navigate(`/chat/${chat._id}`);
                                                            closeTopPopOverModal();
                                                        }}
                                                        src={assets.new_tab_icon}
                                                        className='max-sm:hidden w-6 h-6 dark:invert active:scale-95'
                                                        alt=""
                                                    />

                                                    <img
                                                        onClick={() => {

                                                        }}
                                                        src={assets.pin_icon}
                                                        className='w-6 h-6 dark:invert active:scale-95'
                                                        alt=""
                                                    />

                                                </div>

                                            </div>

                                        ))
                                    }

                                </div>

                            </div>

                        ))
                    )
                }

            </div>

        </div>
    )
}

export default ChatSearchBox