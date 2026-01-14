import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import toast from "react-hot-toast";
import ConfirmDialog from '../components/common/ConfirmDialog';

//Making the backend url as the base url for any axios api call
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

// also include error message in the chat - done
// update ui - done
//name and rename - done
//archive - done
// delete all archived chats, archive all chats backend logic - done
//share chat ui -done, backend logic for shared chat feature - done
//context saving, summary - done but remove rate limiter and do it based on 429 gemini error
//ai avatars
//expert team - career coach, finance advisor, etc

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const { isSignedIn, user } = useUser();
    const { getToken } = useAuth();

    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userChatsLoading, setUserChatsLoading] = useState(false);
    const [messages, setMessages] = useState([]);

    const [slideModal, setSlideModal] = useState({
        isOpen: false,
        content: null,
        title: "",
        titleFeature: null,
    });

    const [popOverStack, setPopOverStack] = useState([]);
    const [popOverClosingIndex, setPopOverClosingIndex] = useState(null);

    const [credits, setCredits] = useState(false);
    const [freeCredits, setFreeCredits] = useState(null);
    const [lastPurchasedPlan, setLastPurchasedPlan] = useState(null);
    const [isCreditsLoading, setIsCreditsLoading] = useState(false);
    const [plans, setPlans] = useState([]);

    const openSlideModal = ({ content, title }) => {
        setSlideModal({ isOpen: true, content, title, titleFeature: null });
    }

    const closeSlideModal = () => {
        setSlideModal({ isOpen: false, content: null, title: "", titleFeature: null });
    };

    const openPopOverModal = ({ content, title }) => {

        setPopOverStack(prev => [
            ...prev,
            { id: crypto.randomUUID(), content, title }
        ]);

    }

    const closeTopPopOverModal = () => {

        setPopOverStack(prev => {

            if (!prev.length) return prev;

            const topIndex = prev.length - 1;
            closePopOverModalAt(topIndex);

            return prev;

        });;

    };

    const closePopOverModalAt = (index) => {

        setPopOverClosingIndex(index);

        setTimeout(() => {

            setPopOverStack(prev =>
                prev.filter((_, i) => i !== index)
            );
            setPopOverClosingIndex(null);

        }, 450);

    };

    const customConfirm = ({ title = "Confirm", message }) => {

        return new Promise((resolve) => {

            openPopOverModal({
                title,
                content: (
                    <ConfirmDialog
                        message={message}
                        onConfirm={() => {
                            resolve(true);
                            closeTopPopOverModal();
                        }}
                        onCancel={() => {
                            resolve(false);
                            closeTopPopOverModal();
                        }}
                    />
                ),
            });

        });

    }

    const fetchPlans = async () => {

        try {

            const token = await getToken();

            const { data } = await axios.get('/api/plans/get-plans', { headers: { Authorization: token } });

            if (data.success) {

                setPlans(data.plans);

            }
            else {
                toast.error(data.message || "Failed to fetch plans!");
            }

        } catch (error) {
            toast.error(error.message);
        }

    };

    useEffect(() => {

        if (isSignedIn) {
            fetchPlans();
        }

    }, [isSignedIn]);

    const fetchCreditDetails = async () => {

        if (!user) return;

        setIsCreditsLoading(true);

        try {

            const token = await getToken();

            const { data } = await axios.get('/api/user/get-credits', { headers: { Authorization: token } });

            if (data.success) {

                setCredits(data.credits);
                setFreeCredits(data.freeCredits)

            }
            else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error.message);
        } finally {
            setIsCreditsLoading(false);
        }

    }

    useEffect(() => {

        fetchCreditDetails();

    }, [user, isSignedIn]);

    const createNewChat = async () => {

        try {

            const token = await getToken();

            if (!user) {
                return toast("Login to create a new chat");
            }

            const { data } = await axios.post('/api/chat/create', {}, {
                headers: { Authorization: token }
            });

            if (data.success && data.chat) {

                setChats(prev => [data.chat, ...prev]);
                setSelectedChat(data.chat);
                navigate(`/`);
                return data.chat;

            } else {

                toast.error(data.message);
                return null;

            }

        } catch (error) {
            toast.error(error.message);
        }

    }

    const updateChatMessages = (chatId, newMessages) => {

        setChats(prevChats =>
            prevChats.map(chat =>
                chat._id === chatId
                    ? { ...chat, messages: newMessages }
                    : chat
            )
        );

        setSelectedChat(prev =>
            prev && prev._id === chatId
                ? { ...prev, messages: newMessages }
                : prev
        );

    };

    const updateChatName = (chatId, chatName) => {

        setChats(prevChats =>
            prevChats.map(chat =>
                chat._id === chatId
                    ? { ...chat, name: chatName }
                    : chat
            )
        );

        setSelectedChat(prev =>
            prev && prev._id === chatId
                ? { ...prev, name: chatName }
                : prev
        );

    }

    const fetchUserChats = async () => {

        setUserChatsLoading(true);

        try {

            const token = await getToken();

            const { data } = await axios.get('/api/chat/get', {
                headers: {
                    Authorization: token
                }
            });

            if (data.success) {

                setChats(data.chats);
                setSelectedChat(null);

            }
            else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        } finally {
            setUserChatsLoading(false);
        }

    }

    useEffect(() => {

        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }

        localStorage.setItem('theme', theme);

    }, [theme]);

    useEffect(() => {

        if (user) {
            fetchUserChats();
        }
        else {
            setChats([]);
            setSelectedChat(null);
        }

    }, [user]);

    const value = {

        navigate, axios, customConfirm,
        user, isSignedIn,
        chats, setChats, selectedChat, setSelectedChat,
        theme, setTheme,
        credits, setCredits,
        freeCredits, setFreeCredits,
        lastPurchasedPlan, setLastPurchasedPlan,
        createNewChat, fetchUserChats, getToken, updateChatMessages, updateChatName,
        fetchCreditDetails,
        isCreditsLoading, setIsCreditsLoading,
        isMenuOpen, setIsMenuOpen,
        plans, fetchPlans,
        userChatsLoading, setUserChatsLoading,
        messages, setMessages,
        slideModal, setSlideModal, closeSlideModal, openSlideModal,
        popOverStack, setPopOverStack, closeTopPopOverModal, openPopOverModal, closePopOverModalAt, popOverClosingIndex, setPopOverClosingIndex,

    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}

export const useAppContext = () => useContext(AppContext);