import React, { useState } from 'react'
import Sidebar from './components/common/Sidebar'
import ChatBox from './components/chatComponents/ChatBox'
import { CreditsPage } from './pages/Credits'
import Community from './pages/Community'
import { Route, Routes, useLocation } from 'react-router-dom'
import './assets/prism.css'
import Loading from './pages/Loading'
import LandingPage from './components/loggedOutComponents/LandingPage'
import { useUser } from '@clerk/clerk-react' // Using Clerk hook directly
import { Toaster } from 'react-hot-toast'
import Navbar from './components/common/Navbar'
import SharedChatDisplayBox from './components/chatComponents/SharedChatDisplayBox'
import SlideModal from './components/common/SlideModal'
import { useAppContext } from './context/AppContext'
import PopOverModal from './components/common/PopOverModal'

const App = () => {

  const { isSignedIn, isLoaded } = useUser() // Get auth state directly from Clerk
  const { slideModal, closeSlideModal, popOverModal, closePopOverModal } = useAppContext();

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

      <PopOverModal/>

      <Routes>

        {/* ================= PUBLIC SHARED CHAT ================= */}
        <Route
          path="/chat/share/:shareId"
          element={

            isSignedIn ? (

              // Logged-in users see full app layout
              <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">

                <div className="flex h-screen w-screen">

                  <Sidebar />

                  <div className="flex flex-col flex-1">

                    <Navbar />

                    <div className='flex-1 flex justify-center overflow-y-scroll'>
                      <SharedChatDisplayBox />
                    </div>

                  </div>

                </div>

              </div>
            ) : (

              // Logged-out users see shared chat only
              <div className='flex-1 flex justify-center overflow-y-scroll'>
                <SharedChatDisplayBox />
              </div> 

            )

          }
        />

        {/* ================= AUTHENTICATED APP ================= */}
        {isSignedIn && (

          <Route
            path="/*"
            element={

              <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">

                <div className="flex h-screen w-screen">

                  <Sidebar />

                  <div className="flex flex-col flex-1">

                    <Navbar />

                    <div className="flex-1 flex justify-center overflow-y-scroll">

                      <Routes>
                        <Route path="/" element={<ChatBox />} />
                        <Route path="/credits" element={<CreditsPage />} />
                        <Route path="/community" element={<Community />} />
                      </Routes>

                    </div>

                  </div>

                </div>

              </div>

            }
          />
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