import { useParams } from "react-router-dom";
import { assets, AVATAR_IMAGES } from "../../assets/assets";
import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import PromptBox from "../chatComponents/PromptBox";

const AvatarChatEmptyBox = () => {

    const { avatarKey, chatId } = useParams();
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const { setMessages, setSelectedChatId, setMessagesChatId, availableAvatars, navigate } = useAppContext();

    useEffect(() => {

        if (!chatId) {
            setMessages([]);
            setSelectedChatId(null);
            setMessagesChatId(null);
        }

    }, [chatId]);

    useEffect(() => {

        if (!avatarKey || !availableAvatars?.length) return;

        const avatar = availableAvatars.find(a => a.key === avatarKey);

        if (!avatar) {
            navigate("/");
        } else {
            setSelectedAvatar(avatar);
        }

    }, [avatarKey, availableAvatars]);

    if (!selectedAvatar) {
        return (
            <div className="flex w-full justify-center mt-10">
                <img src={assets.loading_icon} className="w-5 h-5 animate-spin" alt="" />
            </div>
        )
    };

    return (
        <div className="relative h-full w-full flex flex-col overflow-y-scroll">

            <div className="flex-1 flex items-center justify-center p-5">

                <div className="flex flex-col items-center gap-4 text-center">

                    <img
                        src={AVATAR_IMAGES[selectedAvatar.key]}
                        className="w-60 h-60 sm:w-80 sm:h-80 border-2 border-gray-300 dark:border-white opacity-90 rounded-full object-cover"
                        alt={selectedAvatar.name}
                    />

                    <p className="text-3xl sm:text-5xl text-gray-400 dark:text-white">
                        Ask me anything.
                    </p>

                </div>

            </div>

            <PromptBox chatMode="avatar" avatarId={selectedAvatar._id} />

        </div>

    );
};

export default AvatarChatEmptyBox;