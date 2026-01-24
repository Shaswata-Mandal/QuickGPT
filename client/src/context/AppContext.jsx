import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import toast from "react-hot-toast";

//Making the backend url as the base url for any axios api call
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

// also include error message in the chat - done
// update ui - done
//name and rename - done
//archive - done
// delete all archived chats, archive all chats backend logic - done
//share chat ui -done, backend logic for shared chat feature - done
//context saving, summary - done
//ai model choose option - done
//ai avatars - with memories - half done - show the avatar memory in popover modal,  details of avatar in avatars page, show image and header so that user knows to which avatar he is talking 
//expert team - career coach, finance advisor, etc - pending

//llm-warning toast
//search box shift it to popover modal - half done - pin chat left
//don't give the error replies to the summarization and context building. add replyType in chat model to the message

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
    const [avatarsLoading, setAvatarsLoading] = useState(false);

    const [llmWarning, setLlmWarning] = useState(null);
    const [cooldownInfo, setCooldownInfo] = useState(JSON.parse(localStorage.getItem("llmCooldownInfo")) || {});

    //-----------------------------------------------------------------------------------------------------------

    const getRemaningCooldown = (provider) => {

        const data = cooldownInfo[provider];

        if (!data) return null;

        const elapsed = Math.floor((Date.now() - data.startedAt) / 1000);
        const remaining = data.retryAfter - elapsed;

        return remaining > 0 ? remaining : null;

    };

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

        try {

            const token = await getToken();

            const { data } = await axios.get(`/api/chat/get-chat-messages?chatId=${chatId}`, { headers: { Authorization: token } });

            if (data.success) {
                setMessages(data.chatMessages);
                setMessagesChatId(chatId);
            }
            else {
                navigate("/")
                toast.error(data.message);
            }

        } catch (error) {

            navigate("/");
            // console.log(error);
            toast.error(error.response?.data?.message);

        } finally {
            setMessagesLoading(false);
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
            console.log(error.message);
        } finally {
            setIsCreditsLoading(false);
        }

    }

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

    useEffect(() => {
        console.log(cooldownInfo);
    }, [cooldownInfo]);

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
        availableAvatars, setAvailableAvatars, avatarsLoading, setAvatarsLoading, fetchAvatarDetails,
        llmWarning, setLlmWarning, cooldownInfo, setCooldownInfo, getRemaningCooldown,

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