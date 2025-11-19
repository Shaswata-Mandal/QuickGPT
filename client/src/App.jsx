import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatBox from './components/ChatBox'
import { CreditsPage } from './pages/Credits'
import Community from './pages/Community'
import { Route, Routes, useLocation } from 'react-router-dom'
import { assets } from './assets/assets'
import './assets/prism.css'
import Loading from './pages/Loading'
import Login from './pages/Login'
import LandingPage from './components/LandingPage'
import { useUser } from '@clerk/clerk-react' // Using Clerk hook directly

const App = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const { isSignedIn, isLoaded } = useUser() // Get auth state directly from Clerk

  if (pathname === '/loading') {
    return <Loading />
  }

  // Show loading state while auth is being checked
  if (!isLoaded) {

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className='border-4 border-violet-600  rounded-full h-12 w-12 border-t-transparent animate-spin'></div>
      </div>
    )

  }

  return (
    <div>

      {!isMenuOpen && isSignedIn && (

        <div className='fixed w-full top-0 left-0 bg-white dark:bg-gradient-to-b from-[#000000] to-[#242124] md:hidden z-20 px-3 py-2'>

          <img onClick={() => setIsMenuOpen(true)} src={assets.menu_icon} className='w-8 h-8 cursor-pointer md:hidden not-dark:invert' alt="" />

        </div>

      )}

      {isSignedIn ?
        (

          <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>

            <div className='flex h-screen w-screen'>

              <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

              <Routes>

                <Route path='/' element={<ChatBox />} />
                <Route path='/credits' element={<CreditsPage />} />
                <Route path='/community' element={<Community />} />

              </Routes>

            </div>

          </div>

        )
        :
        (

          <div>
            <LandingPage />
          </div>

        )
      }

    </div>
  )
}

export default App