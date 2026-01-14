import React, { Children } from 'react';
import { useAppContext } from '../../context/AppContext';
import { UserButton } from '@clerk/clerk-react';
import ArchivedChatsDisplay, { UnarchiveAllChats } from '../chatComponents/ArchivedChatsDisplay';
import SharedChatsDisplay from '../chatComponents/SharedChatsDisplay';
import { assets } from '../../assets/assets';

const CustomUserMenu = () => {

    const { openSlideModal } = useAppContext();

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

            </UserButton.MenuItems>

        </UserButton>

    );
};

export default CustomUserMenu;
