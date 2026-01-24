import React, { useState } from 'react'
import ChatBox from './components/chatComponents/ChatBox'
import { CreditsPage } from './pages/Credits'
import Community from './pages/Community'
import { Route, Routes, useLocation } from 'react-router-dom'
import './assets/prism.css'
import Loading from './pages/Loading'
import LandingPage from './components/loggedOutComponents/LandingPage'
import { useUser } from '@clerk/clerk-react' // Using Clerk hook directly
import { Toaster } from 'react-hot-toast'
import SlideModal from './components/common/SlideModal'
import { useAppContext } from './context/AppContext'
import PopOverModal from './components/common/PopOverModal'
import EmptyChat from './components/chatComponents/EmptyChat'
import SharedChatRoute from './routes/SharedChatRoute'
import MainAppRouteLayout from './components/common/MainAppRouteLayout'
import AvatarDisplayBox from './components/avatarComponents/AvatarDisplayBox'
import AvatarChatEmptyBox from './components/avatarComponents/AvatarChatEmptyBox'

const App = () => {

  const { isSignedIn, isLoaded } = useUser() // Get auth state directly from Clerk
  const { slideModal, closeSlideModal } = useAppContext();

  // Show loading state while auth is being checked
  if (!isLoaded) {

    return (
      <div className='flex min-h-screen min-w-screen items-center justify-center'>
        <Loading />
      </div>
    )

  }

  return (
    <div>

      <Toaster />

      <SlideModal isOpen={slideModal.isOpen} onClose={closeSlideModal}>
        {slideModal.content}
      </SlideModal>

      <PopOverModal />

      <Routes>

        {/* ================= PUBLIC SHARED CHAT ================= */}
        <Route
          path="/share/:shareId"
          element={<SharedChatRoute/>}
        />

        {/* ================= AUTHENTICATED APP ================= */}
        {isSignedIn && (

          <Route element={<MainAppRouteLayout />}>
            <Route path="/" element={<EmptyChat />} />
            <Route path="/chat/:chatId" element={<ChatBox />} />
            <Route path="/avatars" element={<AvatarDisplayBox />} />
            <Route path='/avatars/chat/:avatarKey' element={<AvatarChatEmptyBox />} />
            <Route path="/credits" element={<CreditsPage />} />
            <Route path="/community" element={<Community />} />
          </Route>

        )}

        {/* ================= GUEST FALLBACK ================= */}
        {!isSignedIn && (

          <Route path="*" element={<LandingPage />} />
          
        )}

      </Routes>

    </div>
  )
}

export default App