import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import toast from "react-hot-toast";

//Making the backend url as the base url for any axios api call
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

//Upcoming Weekly Features to be added: 
//1) Pin chat, Group the sidebar chats by date, chatMode (avatar or default) and pinned chats
//2) Expert Avatars
//3) Create your own avatar
//4) Summarize the whole chat in one click
//5) Scroll down button
//6) Advanced search feature - avatar filter
//7) Show loading on Purchase button click in credits page
//8) "Ask me anything" writing animation

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const { isSignedIn, user } = useUser();
    const { getToken } = useAuth();

    const navigate = useNavigate();

    const [chats, setChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messagesChatId, setMessagesChatId] = useState(null);
    const [selectedModel, setSelectedModel] = useState("groq");
    const [responseLoading, setResponseLoading] = useState(false);
    const [userChatsLoading, setUserChatsLoading] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    const [availableAvatars, setAvailableAvatars] = useState(null);
    const [avatarsLoading, setAvatarsLoading] = useState(true);
    const [selectedChatAvatar, setSelectedChatAvatar] = useState(null);
    const [selectedChatAvatarId, setSelectedChatAvatarId] = useState(null);

    const [llmWarning, setLlmWarning] = useState(null);
    const [cooldownInfo, setCooldownInfo] = useState(JSON.parse(localStorage.getItem("llmCooldownInfo")) || {});

    //-----------------------------------------------------------------------------------------------------------

    const fetchAvatarDetails = async () => {

        setAvatarsLoading(true);

        try {

            const token = await getToken();

            const { data } = await axios.get("/api/avatars/get", { headers: { Authorization: token } });

            if (data.success) {
                setAvailableAvatars(data.availableAvatars);
            }

        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            setAvatarsLoading(false);
        }

    }

    //-----------------------------------------------------------------------------------------------------------

    const fetchChatMessages = async (chatId) => {

        setMessagesLoading(true);
        setSelectedChatAvatarId(null);

        try {

            const token = await getToken();

            const { data } = await axios.get(`/api/chat/get-chat-messages?chatId=${chatId}`, { headers: { Authorization: token } });

            if (data.success) {
                
                setMessages(data.chatMessages);
                setMessagesChatId(chatId);
                setSelectedChatAvatarId(data.avatarId);

            }
            else {
                navigate("/")
                toast.error(data.message || "Failed to fetch chat messages");
            }

        } catch (error) {

            navigate("/");
            // console.log(error);
            toast.error(error.response?.data?.message || "Failed to fetch chat messages");

        } finally {
            setMessagesLoading(false);
        }

    }

    //-----------------------------------------------------------------------------------------------------------

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
            // console.log(error.message);
        } finally {
            setIsCreditsLoading(false);
        }

    }

    //Function to fetch all the user chats
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

    //-----------------------------------------------------------------------------------------------------------

    const openSlideModal = ({ content, title }) => {
        setSlideModal({ isOpen: true, content, title, titleFeature: null });
    }

    const closeSlideModal = () => {
        setSlideModal({ isOpen: false, content: null, title: "", titleFeature: null });
    };

    const openPopOverModal = ({ content, title, size = "md" }) => {

        setPopOverStack(prev => [
            ...prev,
            { id: crypto.randomUUID(), content, title, size }
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

    //-----------------------------------------------------------------------------------------------------------

    const getRemaningCooldown = (provider) => {

        const data = cooldownInfo[provider];

        if (!data) return null;

        const elapsed = Math.floor((Date.now() - data.startedAt) / 1000);
        const remaining = data.retryAfter - elapsed;

        return remaining > 0 ? remaining : null;

    };

    //Function to create a new chat
    const createNewChat = async (chatMode, avatarId) => {

        try {

            const token = await getToken();

            if (!user) {
                return toast("Login to create a new chat");
            }

            const { data } = await axios.post('/api/chat/create', { chatMode, avatarId }, {
                headers: { Authorization: token }
            });

            if (data.success && data.chat) {

                setMessagesChatId(data.chat._id);
                setChats(prev => [data.chat, ...prev]);
                navigate(`/chat/${data.chat._id}`);
                setSelectedChatAvatarId(avatarId);
                return data.chat;

            } else {

                return null;

            }

        } catch (error) {
            toast.error(error.message);
            return null;
        }

    }

    const updateChatName = (chatId, chatName) => {

        setChats(prevChats =>
            prevChats.map(chat =>
                chat._id === chatId
                    ? { ...chat, name: chatName }
                    : chat
            )
        );

    }

    //-----------------------------------------------------------------------------------------------------------

    //Fetching plans, credit details, user chats and available avatars on user sign in
    useEffect(() => {

        if (isSignedIn && user) {
            fetchPlans();
            fetchCreditDetails();
            fetchUserChats();
            fetchAvatarDetails();
        }

    }, [isSignedIn, user]);

    //Theme change logic
    useEffect(() => {

        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }

        localStorage.setItem('theme', theme);

    }, [theme]);

    //Storing the cooldown info in local storage on its change
    useEffect(() => {

        localStorage.setItem("llmCooldownInfo", JSON.stringify(cooldownInfo));

    }, [cooldownInfo]);

    useEffect(() => {

        const interval = setInterval(() => {

            setCooldownInfo(prev => {

                const updated = { ...prev };
                let changed = false;

                for (const provider in updated) {
                    const elapsed =
                        (Date.now() - updated[provider].startedAt) / 1000;

                    if (elapsed >= updated[provider].retryAfter) {
                        delete updated[provider];
                        changed = true;
                    }
                }

                return changed ? updated : prev;

            });

        }, 1000);

        return () => clearInterval(interval);

    }, []);

    //Setting the avatar for the avatar chat mode to show image in the chatbox
    useEffect(() => {

        if(!selectedChatAvatarId || !availableAvatars?.length) {
            setSelectedChatAvatar(null);
            return;
        }

        const avatar = availableAvatars.find((item) => item._id === selectedChatAvatarId) || null;

        setSelectedChatAvatar(avatar);

    }, [selectedChatAvatarId, availableAvatars]);

    //Setting the llmWarning to null whenever selected model changes
    useEffect(() => {
        setLlmWarning(null);
    }, [selectedModel]);

    const value = {

        navigate, axios,
        user, isSignedIn,
        chats, setChats, selectedChatId, setSelectedChatId,
        theme, setTheme,
        credits, setCredits,
        freeCredits, setFreeCredits,
        lastPurchasedPlan, setLastPurchasedPlan,
        createNewChat, fetchUserChats, getToken, updateChatName,
        fetchCreditDetails,
        isCreditsLoading, setIsCreditsLoading,
        isMenuOpen, setIsMenuOpen,
        plans, fetchPlans,
        userChatsLoading, setUserChatsLoading,
        slideModal, setSlideModal, closeSlideModal, openSlideModal,
        popOverStack, setPopOverStack, closeTopPopOverModal, openPopOverModal, closePopOverModalAt, popOverClosingIndex, setPopOverClosingIndex,
        fetchChatMessages, messages, setMessages, messagesLoading, setMessagesLoading, responseLoading, setResponseLoading,
        selectedModel, setSelectedModel, messagesChatId, setMessagesChatId,
        availableAvatars, setAvailableAvatars, avatarsLoading, setAvatarsLoading, fetchAvatarDetails, selectedChatAvatar, setSelectedChatAvatar,
        llmWarning, setLlmWarning, cooldownInfo, setCooldownInfo, getRemaningCooldown, selectedChatAvatarId, setSelectedChatAvatarId, 

    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}

export const useAppContext = () => {

    const ctx = useContext(AppContext);

    return ctx ?? {};

};