import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const EnableShare = ({ chatId, onShareChange }) => {

    const { axios, getToken, customConfirm } = useAppContext();

    const [sharingLink, setSharingLink] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchSharingLink = async (chatId) => {

        if(isProcessing) {
            toast.error("Please wait, an action is already in progress.");
            return;
        }

        setIsProcessing(true);

        try {
            
            const token = await getToken();

            const {data} = await axios.get(
                "/api/chat/get-share-status-and-link", 
                {
                    params: {chatId},
                    headers: {Authorization: token}
                }
            );

            if(data.success) {
                setSharingLink(data.shareLink);
            }

        } catch (error) {
            console.log(error.message);
            toast.error(error.response?.data?.message || "Failed to fetch sharing status.");
        } finally {
            setIsProcessing(false);
        }

    }

    const handleGenerateRevokeButtonClick = async (chatId, action) => {

        if(isProcessing) {
            toast.error("Please wait, an action is already in progress.");
            return;
        }

        if(action === "revoke") {
            const confirmed = await customConfirm({ title: "Confirm action", message: "Are you sure you want to revoke the shared link?" });
            if (!confirmed) return;
        }

        setIsProcessing(true);

        try {

            const token = await getToken();

            const { data } = await axios.post(
                '/api/chat/share-unshare-chat',
                { chatId, share: action === "generate" },
                { headers: { Authorization: token } }
            );

            if (data.success) {

                setSharingLink(action === "generate" ? data.shareLink : "");

                if(onShareChange) {
                    await onShareChange();
                }
                
                if(action === "revoke") {
                    toast.success("Link revoked successfully.")
                }

            }

        } catch (error) {
            console.log(error.response?.data?.message || error.message)
            toast.error(action === "generate" ? "Failed to generate link" : "Failed to revoke link");
        } finally {
            setIsProcessing(false);
        }

    }

    //Manual link copy handler
    const handleCopyClick = async () => {

        if (!sharingLink) return;

        try {

            await navigator.clipboard.writeText(sharingLink);
            toast.success("Link copied!");

        } catch (error) {
            toast.error("Failed to copy link");
        }

    }

    useEffect(() => {

        if(chatId) {
            fetchSharingLink(chatId);
        }

    }, []);

    return (
        <div className="flex flex-col gap-5">

            <div className="relative flex border rounded-md py-2 px-2 dark:border-white">

                <input
                    type="text"
                    className={`outline-none flex-1 min-w-0 pr-10 text-sm ${sharingLink ? "" : "text-gray-500"} dark:text-white`}
                    value={sharingLink ? sharingLink : "Link will appear here!"}
                    readOnly
                />

                <button
                    className="absolute bg-blue-300 w-10 h-full rounded-r-md top-0 right-0 flex justify-center items-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={() => handleCopyClick()}
                    disabled={!sharingLink || isProcessing}
                >
                    <img src={assets.copy_icon} className="w-5 h-5 dark:invert active:scale-95" alt="" />
                </button>

            </div>

            <button
                className="flex justify-center items-center w-full py-2 text-white bg-gradient-to-r from-[#A456f7] to-[#3d81f6] text-sm rounded-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={() => handleGenerateRevokeButtonClick(chatId, sharingLink ? "revoke" : "generate")}
                disabled={isProcessing}
            >
                {isProcessing ?
                    (
                        <div>
                            <img src={assets.loading_icon} className='h-5 w-5 animate-spin' alt="" />
                        </div>
                    )
                    :
                    (
                        sharingLink ?
                            (
                                <p>Revoke Link</p>
                            )
                            :
                            (
                                <p>Generate Link</p>
                            )
                    )
                }
            </button>

            {/* Info text */}
            <ul className="list-disc pl-5 text-xs text-gray-500 space-y-1">

                <li>
                    The chat will be shared with anyone who has the link.
                </li>

                <li>
                    You can revoke access at any time from the <span className="font-medium">Shared Chats</span>.
                </li>

                <li>
                    Shared users will only have read-only access until they save a copy in their account.
                </li>

            </ul>

        </div>
    )
}

export default EnableShare
