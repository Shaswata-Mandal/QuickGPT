import React, { useEffect, useState } from 'react'
import MemoryControlCard from './MemoryControlCard'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import AvatarMemoryDisplay from './AvatarMemoryDisplay'
import toast from 'react-hot-toast'

const MemoryControls = ({ name, onTabChange }) => {

    const { openPopOverModal, axios, getToken } = useAppContext();
    const [avatarMemoryStatus, setAvatarMemoryStatus] = useState(false);
    const [personalizationMemoryStatus, setPersonalizationMemoryStatus] = useState(false);
    const [loading, setLoading] = useState(true);
    const [avatarProcessing, setAvatarProcessing] = useState(false);
    const [personalizationProcessing, setPersonalizationProcessing] = useState(false);

    const fetchMemorySettings = async () => {

        setLoading(true);

        try {

            const token = await getToken();

            const { data } = await axios.get(
                "/api/user/memory-settings",
                { headers: { Authorization: token } }
            );

            if (data.success) {

                setAvatarMemoryStatus(data.memorySettings.avatarMemoryEnabled);

                setPersonalizationMemoryStatus(
                    data.memorySettings.personalizationMemoryEnabled
                );

            }

        } catch (err) {
            toast.error("Failed to load memory settings");
        } finally {
            setLoading(false);
        }

    };

    const handleToggle = async (type) => {

        if (avatarProcessing || personalizationProcessing) return;

        const isAvatar = type === "avatar";

        const newValue = isAvatar ? !avatarMemoryStatus : !personalizationMemoryStatus;

        isAvatar ? setAvatarProcessing(prev => !prev) : setPersonalizationProcessing(prev => !prev);
        isAvatar ? setAvatarMemoryStatus(newValue) : setPersonalizationMemoryStatus(newValue);

        try {

            const token = await getToken();

            await axios.patch(
                "/api/user/memory-settings",
                {
                    updates: { [isAvatar ? "avatarMemoryEnabled" : "personalizationMemoryEnabled"]: newValue },
                },
                { headers: { Authorization: token } }
            );

        } catch (err) {

            isAvatar ? setAvatarMemoryStatus(!newValue) : setPersonalizationMemoryStatus(!newValue);

            toast.error("Failed to update memory setting");

        } finally {
            isAvatar ? setAvatarProcessing(prev => !prev) : setPersonalizationProcessing(prev => !prev);
        }

    };

    const handleAvatarMemoryManageClick = () => {

        openPopOverModal({
            title: "Avatar Memories",
            size: "lg",
            content: (
                <AvatarMemoryDisplay avatarMemoryStatus={avatarMemoryStatus}/>
            )
        });

    }

    useEffect(() => {

        fetchMemorySettings();

    }, []);

    if(loading) {
        return (
            <div className='flex w-full justify-center items-center'>
                <img src={assets.loading_icon} className='w-5 h-5 dark:invert animate-spin' alt="" />
            </div>
        )
    }

    return (
        <div className="flex flex-col px-4 pb-2 w-full max-h-90 dark:invert bg-transparent">

            <div className='flex py-3 border-b'>
                <p className='text-md font-medium'>{name}</p>
            </div>

            <div className='flex-1 mt-5 pb-5 flex gap-4 flex-col w-full max-h-full overflow-y-scroll'>

                <MemoryControlCard
                    icon={assets.avatars_icon}
                    title="Avatar memory"
                    description="Remembers user summaries, emotional patterns, and facts separately for each avatar."
                    enabled={avatarMemoryStatus}
                    onToggle={() => handleToggle("avatar")}
                    onManage={handleAvatarMemoryManageClick}
                    processing={avatarProcessing}
                />

                <MemoryControlCard
                    icon={assets.settings_icon}
                    title="Personalization memory"
                    description="Saves your tone, style, and preference settings across chats."
                    enabled={personalizationMemoryStatus}
                    onToggle={() => handleToggle("personalization")}
                    onManage={() => onTabChange("personalization")}
                    processing={personalizationProcessing}
                />

            </div>

        </div>
    )
}

export default MemoryControls