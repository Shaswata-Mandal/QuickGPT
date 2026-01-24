import React, { Children } from 'react';
import { useAppContext } from '../../context/AppContext';
import { UserButton } from '@clerk/clerk-react';
import ArchivedChatsDisplay, { UnarchiveAllChats } from '../chatComponents/ArchivedChatsDisplay';
import SharedChatsDisplay from '../chatComponents/SharedChatsDisplay';
import { assets } from '../../assets/assets';
import AiModelOptions from '../common/AiModelOptions';
import Settings from '../settingsComponents/Settings';

const CustomUserMenu = () => {

    const { openSlideModal, openPopOverModal } = useAppContext();

    return (

        <UserButton>

            <UserButton.MenuItems>

                {/* Archived Chats */}
                <UserButton.Action
                    label="Archived chats"
                    labelIcon={
                        <img
                            src={assets.archived_chats_icon}
                            alt=""
                            className="w-4 h-4"
                        />
                    }
                    onClick={() => {
                        openSlideModal({
                            title: "Archived Chats",
                            content: <ArchivedChatsDisplay />,
                            titleFeature: <UnarchiveAllChats/>
                        });
                    }}
                />

                {/* Shared Chats */}
                <UserButton.Action
                    label='Shared chats'
                    labelIcon={
                        <img
                            src={assets.shared_chats_icon}
                            className='w-4 h-4'
                            alt=''
                        />
                    }
                    onClick={() => {
                        openSlideModal({
                            title: "Shared Chats",
                            content: <SharedChatsDisplay />,
                        });
                    }}
                />

                {/* AI Model preference */}
                <UserButton.Action
                    label='Model Preference'
                    labelIcon={
                        <img
                            src={assets.model_preference_icon}
                            className='w-4 h-4'
                            alt=''
                        />
                    }
                    onClick={() => {
                        openSlideModal({
                            title: "Model Preference",
                            content: <AiModelOptions />,
                        });
                    }}
                />

                {/* Settings */}
                <UserButton.Action
                    label='Settings'
                    labelIcon={
                        <img
                            src={assets.settings_icon}
                            className='w-4 h-4'
                            alt=''
                        />
                    }
                    onClick={() => {
                        openPopOverModal({
                            title: "Settings", 
                            size: "xxl", 
                            content: (
                                <Settings/>
                            )
                        });
                    }}
                />

            </UserButton.MenuItems>

        </UserButton>

    );
};

export default CustomUserMenu;
