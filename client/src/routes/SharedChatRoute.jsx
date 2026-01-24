import { useUser } from '@clerk/clerk-react'
import React from 'react'
import SharedChatDisplayBox from '../components/chatComponents/SharedChatDisplayBox';
import MainAppWrapper from "../components/common/MainAppWrapper";

const SharedChatRoute = () => {

    const { isSignedIn, isLoaded } = useUser();

    if(!isLoaded) return null;

    if(isSignedIn) {

        return (
            <MainAppWrapper>
                <SharedChatDisplayBox/>
            </MainAppWrapper>
        )

    }

    return <SharedChatDisplayBox/>
    
}

export default SharedChatRoute