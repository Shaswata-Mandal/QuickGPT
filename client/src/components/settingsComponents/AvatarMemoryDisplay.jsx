import React, { useEffect, useState } from "react";
import { assets, AVATAR_IMAGES } from "../../assets/assets";
import NothingHere from "../common/NothingHere"
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useConfirm } from "../../hooks/useConfirm"
import NotificationBar from "../common/NotificationBar";

const AvatarMemoryDisplay = ({ avatarMemoryStatus }) => {

    const customConfirm = useConfirm();
    const { axios, getToken, availableAvatars } = useAppContext();
    const [avatarMemories, setAvatarMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const fetchAvatarMemories = async () => {

        setLoading(true);

        try {

            const token = await getToken();

            const { data } = await axios.get("/api/avatars/get-avatar-memories", { headers: { Authorization: token } });

            if (data.success) {

                setAvatarMemories(data.avatarMemories);

            }
            else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Failded to fetch avatar memories!");
        } finally {
            setLoading(false);
        }

    }

    const handleMemoryDeleteClick = async (avatarId) => {

        if (processing) return;

        const confirmed = await customConfirm({ title: "Confirm action", message: `Are you sure you want to delete ${avatarId ? "this avatar memory" : "these avatar memories"}?` });
        if (!confirmed) return;

        setProcessing(true);

        try {

            const token = await getToken();

            const { data } = await axios.post("/api/avatars/delete-avatar-memories", { avatarId }, { headers: { Authorization: token } });

            if (data.success) {

                toast.success(data.message);
                fetchAvatarMemories();

            }
            else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Failded to fetch avatar memories!");
        } finally {
            setProcessing(false);
        }

    }

    useEffect(() => {

        fetchAvatarMemories();

    }, []);

    if (loading) {
        return (
            <div className='flex w-full justify-center items-center min-h-79'>
                <img src={assets.loading_icon} className='w-5 h-5 dark:invert animate-spin' alt="" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 w-full p-4 overflow-y-scroll max-h-100">

            <NotificationBar duration={8000} message={`These memories help avatars understand you better across conversations. ${!avatarMemoryStatus ? "You have disabled this feature, so avatars will no longer use these memories in future conversations." : ""}`} />

            {/* Memory cards */}
            {avatarMemories.length > 0 ?
                (
                    <div className="flex flex-col gap-4">

                        {avatarMemories.map((memory) => {

                            const avatar = availableAvatars.find((item) => item._id === memory.avatarId) || null;

                            return (
                                < div
                                    key={memory.avatarId}
                                    className="border rounded-md p-4 bg-white dark:bg-primary/10 flex flex-col gap-3"
                                >

                                    {/* Avatar header */}
                                    <div className="flex justify-between gap-3" >

                                        <div className="flex gap-3 w-full">

                                            {avatar && (
                                                <img
                                                    src={AVATAR_IMAGES[avatar.key]}
                                                    alt=""
                                                    className="w-15 h-15 rounded-md object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
                                                />
                                            )}

                                            <div className="flex flex-col gap-1 sm:flex-row w-full flex-1">

                                                <p className="text-lg font-medium dark:invert">
                                                    {avatar?.name || "Unknown Avatar"}
                                                </p>

                                                <div className="text-xs max-sm:hidden h-fit w-fit sm:ml-auto border rounded-md px-3 py-1 bg-green-200 dark:border-white">{avatar.type}</div>

                                            </div>

                                        </div>

                                        <button
                                            disabled={processing}
                                            onClick={() => handleMemoryDeleteClick(memory.avatarId)}
                                            className="flex cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <img src={assets.bin_icon} className="w-5 h-5 not-dark:invert" alt="" />
                                        </button>

                                    </div>

                                    {/* User summary */}
                                    {memory.userSummary ? (
                                        <div>

                                            <p className="text-xs font-medium text-gray-500 mb-1">
                                                User summary
                                            </p>
                                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                                {memory.userSummary.charAt(0).toUpperCase() + memory.userSummary.slice(1)}
                                            </p>

                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">
                                                No memories are saved for this avatar. The more you talk, the more the avatar will know about you.
                                            </p>
                                        </div>
                                    )}

                                    {/* Facts */}
                                    {memory.facts?.length > 0 && (

                                        <div>

                                            <p className="text-xs font-medium text-gray-500 mb-1">
                                                Key facts
                                            </p>

                                            <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-200">
                                                {memory.facts.map((fact, index) => (
                                                    <li key={index}>{fact.charAt(0).toUpperCase() + fact.slice(1)}</li>
                                                ))}
                                            </ul>

                                        </div>

                                    )}

                                    {/* Emotional state */}
                                    {memory.emotionalState && (

                                        <div className="flex items-center gap-2">

                                            <p className="text-xs font-medium text-gray-500">
                                                Emotional state:
                                            </p>

                                            <span className="px-2 py-1 rounded-md text-center dark:text-white text-xs bg-gray-200 dark:bg-primary/30">
                                                {memory.emotionalState.charAt(0).toUpperCase() + memory.emotionalState.slice(1)}
                                            </span>

                                        </div>

                                    )}

                                    {/* Last memory updated */}
                                    {memory.lastMemoryUpdatedAt && (

                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-300">

                                            <p className="text-xs font-medium text-gray-500">
                                                {`Last Memory Updated At: ${ new Date(memory.lastMemoryUpdatedAt).toLocaleString() }`}
                                            </p>

                                        </div>

                                    )}

                                </div>
                            )


                        })}

                    </div >
                ) :
                (
                    <div className="flex items-center justify-center min-h-[40vh] text-sm text-gray-500 flex-col">
                        <NothingHere />
                        No avatar memories saved yet.
                    </div>
                )
            }

            {/* Danger zone */}
            {
                avatarMemories.length > 0 &&
                <div className="mt-2 border-t dark:border-white pt-4 flex justify-between gap-5 items-center">

                    <p className="text-xs text-gray-500">
                        This will permanently remove all avatar memories.
                    </p>

                    <button
                        disabled={processing}
                        onClick={() => handleMemoryDeleteClick()}
                        className="px-3 w-fit cursor-pointer py-1.5 text-xs rounded-md border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Delete all memories
                    </button>

                </div>
            }

        </div >
    );
};

export default AvatarMemoryDisplay;
