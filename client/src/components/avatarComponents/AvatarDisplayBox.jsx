import React from 'react'
import { useAppContext } from '../../context/AppContext'
import { AVATAR_IMAGES } from '../../assets/assets'

const AvatarDisplayBox = () => {

    const { availableAvatars, navigate } = useAppContext();

    return (
        <div className='w-full p-5 text-center flex flex-col gap-5 h-full overflow-y-scroll'>

            <h2 className="text-xl font-semibold">
                Talk to an Avatar
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {availableAvatars?.map((avatar, index) => (

                    <div
                        key={avatar._id}
                        className="flex flex-col gap-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm hover:shadow-md transition-all hover:scale-102"
                    >

                        {/* Avatar image */}
                        <div className="flex justify-between gap-3">

                            <img
                                src={AVATAR_IMAGES[avatar.key]}
                                alt={avatar.name}
                                className=" w-20 h-30 rounded-md object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
                            />

                            <div className='flex flex-1 flex-col gap-2 items-start'>

                                <h3 className="text-start font-semibold text-zinc-900 dark:text-zinc-100">
                                    {avatar.name}
                                </h3>

                                <div className='flex gap-2 justify-start flex-wrap items-center'>

                                    <p className="text-xs text-purple-500 bg-purple-200 px-2 py-1 rounded-md">
                                        {avatar.type === "PERSONALITY" ? "Personality" : "Expert"}
                                    </p>
                                    <p className='text-xs text-purple-500 bg-purple-200 px-2 py-1 rounded-md'>{avatar.category}</p>

                                </div>

                            </div>

                        </div>

                        {/* Content */}
                        <div className="">

                            <p className="text-sm text-zinc-600 dark:text-zinc-400 text-start line-clamp-4">
                                {avatar.description}
                            </p>

                        </div>

                        <div className='flex flex-1 gap-2 flex-wrap items-end'>

                            <button
                                className='h-fit cursor-pointer flex-1 rounded-xl border border-zinc-300 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 active:scale-98 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
                            >
                                Details
                            </button>

                            <button
                                onClick={()=> navigate(`/avatars/chat/${avatar.key}`)}
                                className='h-fit cursor-pointer flex-1 rounded-xl border bg-indigo-400 py-2 text-sm font-medium text-black dark:text-white transition hover:bg-indigo-500 active:scale-98 '
                            >
                                Start Chat
                            </button>

                        </div>

                    </div>

                ))}

                <div
                    className="max-sm:h-70 flex flex-col gap-3 rounded-2xl border-primary border-dashed bg-primary/20 border p-4"
                >

                    <div className="flex flex-1 flex-col items-center justify-center text-sm text-zinc-600">
                        <span className="text-lg font-semibold">＋</span>
                        <p>Create Avatar</p>
                        <p className="text-xs opacity-70">Coming soon!</p>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default AvatarDisplayBox