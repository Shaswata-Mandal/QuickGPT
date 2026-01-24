import React from 'react'
import MemoryControlCard from './MemoryControlCard'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import AvatarMemoryDisplay from './AvatarMemoryDisplay'

const MemoryControls = ({ name, onTabChange }) => {

    const { openPopOverModal } = useAppContext();

    const handleAvatarMemoryManageClick = () => {

        openPopOverModal({
            title: "Avatar Memories", 
            size: "xxl", 
            content: (
                <AvatarMemoryDisplay/>
            )
        });

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
                    enabled={true}
                    onToggle={() => {}}
                    onManage={handleAvatarMemoryManageClick}
                />

                <MemoryControlCard
                    icon={assets.settings_icon}
                    title="Personalization memory"
                    description="Saves your tone, style, and preference settings across chats."
                    enabled={true}
                    onToggle={() => {}}
                    onManage={() => onTabChange("personalization")}
                />


            </div>

        </div>
    )
}

export default MemoryControls