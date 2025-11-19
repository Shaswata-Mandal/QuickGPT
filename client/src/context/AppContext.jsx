import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {dummyUserData, dummyChats} from '../assets/assets'
import {useUser} from '@clerk/clerk-react'

const AppContext = createContext();

export const AppContextProvider = ({children})=>{

    const { isSignedIn, user } = useUser();
    console.log(user)

    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState( localStorage.getItem('theme') || 'light' );

    const [credit, setCredit] = useState(false);
    const [freeCredits, setFreeCredits] = useState(5);
    const [lastPurchasedPlan, setLastPurchasedPlan] = useState(null);

    const fetchUserChats = async () => {

        setChats(dummyChats);
        setSelectedChat();

    }

    useEffect(()=>{

        if(theme === 'dark'){
            document.documentElement.classList.add('dark');
        }
        else{
            document.documentElement.classList.remove('dark');
        }

        localStorage.setItem('theme', theme);

    }, [theme]);

    useEffect(()=>{

        if(user){
            fetchUserChats();
        }
        else{
            setChats([]);
            setSelectedChat(null);
        }

    }, [user]);

    const value = {

        navigate,
        user, isSignedIn,
        chats, setChats, selectedChat, setSelectedChat,
        theme, setTheme,
        credit, setCredit,
        freeCredits, setFreeCredits, 
        lastPurchasedPlan, setLastPurchasedPlan,

    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}

export const useAppContext = ()=> useContext(AppContext);