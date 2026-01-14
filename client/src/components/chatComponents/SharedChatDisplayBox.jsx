import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets';
import Message from './Message';
import LoggedOutNavbar from '../loggedOutComponents/LoggedOutNavbar';
import Loading from '../../pages/Loading';

const SharedChatDisplayBox = ({ }) => {

  const { shareId } = useParams();
  const { axios, navigate, isSignedIn, getToken, fetchUserChats, setSelectedChat } = useAppContext();
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);

  useEffect(() => {

    if (!shareId) return;

    const fetchSharedChat = async () => {

      try {

        const { data } = await axios.get(`/api/chat/share/${shareId}`);

        setChat(data.chat);

      } catch (error) {

        navigate('/');
        toast.error("Shared chat not found!");

      } finally {
        setLoading(false);
      }

    }

    fetchSharedChat();

  }, [shareId]);

  const handleSaveCopyClick = async () => {

    setCopying(true);

    try {
      
      const token = await getToken();

      const {data} = await axios.post(`/api/chat/share/${shareId}/save`, {}, { headers: {Authorization: token} });

      if(data.success) {

        await fetchUserChats();
        navigate("/");
        setSelectedChat(data.chat);
        toast.success(data.message);

      }

    } catch (error) {
      toast.error(error.message);
    } finally {
      setCopying(false);
    }

  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="relative h-full w-full flex flex-col gap-2 overflow-y-scroll">

      {/* Navigation */}
      {!isSignedIn && <LoggedOutNavbar />}

      <div className={`max-md:pt-5 flex-1 flex flex-col justify-between ${isSignedIn ? "mb-0" : "mb-20 mt-16"} p-5 sm:px-20 md:px-5 lg:px-30 xl:px-50 w-full pb-6 max-sm:pb-2`}>

        <div className="text-center text-xs p-2 bg-gray-200 rounded-lg mb-5 dark:bg-white/20">
          {`Read-only shared chat. ${isSignedIn ? "Save a copy using 10 credits to continue here!" : "Sign In and Save a copy using 10 credits to continue here!"}`}
        </div>

        {chat?.messages.map((msg, i) => (
          <Message key={i} message={msg} isPublic={true} />
        ))}

      </div>

      <div className={`${isSignedIn ? "sticky" : "fixed"} bottom-0 w-full flex flex-col items-center p-3 justify-center bg-white dark:bg-[#000000] dark:text-white z-20 dark:shadow-[0_-5px_15px_10px_rgba(0,0,0)] shadow-[0_-5px_15px_10px_rgba(255,255,255)]`}>

        {/* New Chat Button */}
        <button 
          onClick={()=>handleSaveCopyClick()}
          disabled={copying}
          className={`${copying ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20 dark:hover:bg-[#80609f]/30'} transition-colors flex justify-center items-center px-5 py-3 text-white bg-gradient-to-r from-[#A456f7] to-[#3d81f6] text-sm rounded-md cursor-pointer gap-3`}
        >

          <img src={assets.save_icon} className='w-5 not-dark:invert' alt="" /> 
          <span className='dark:invert'>Save a copy</span>

        </button>

      </div>

    </div>
  );

};


export default SharedChatDisplayBox