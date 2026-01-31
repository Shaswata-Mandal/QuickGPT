import React from 'react'
import { AVATAR_IMAGES, assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'

const AvatarDetails = ({ avatar }) => {

    const { navigate, closeTopPopOverModal } = useAppContext();

    return (
        <div className='h-80 overflow-y-scroll'>

            <div className='flex flex-col justify-center items-center gap-2 px-5 py-6'>

                <img src={AVATAR_IMAGES[avatar.key]} className='w-40 h-40 ring-2 dark:ring-white ring-black rounded-full' alt="" />

                <p className='text-xl sm:text-2xl mt-5 font-medium dark:invert'>{avatar.name}</p>

                <div className='flex gap-5'>

                    <p className="text-xs text-purple-500 bg-purple-200 px-2 py-1 rounded-md">
                        {avatar.type === "PERSONALITY" ? "Personality" : "Expert"}
                    </p>

                    <p className='text-xs text-purple-500 bg-purple-200 px-2 py-1 rounded-md'>{avatar.category}</p>

                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center mt-5">
                    {avatar.description}
                </p>

                <button
                    onClick={() => { navigate(`/avatars/chat/${avatar.key}`); closeTopPopOverModal(); }}
                    className='h-fit w-full mt-5 cursor-pointer flex-1 rounded-xl border bg-indigo-400 py-2 text-sm font-medium text-black dark:text-white transition hover:bg-indigo-500 active:scale-98 '
                >
                    Start Chat
                </button>

            </div>

        </div>
    )
}

export default AvatarDetails