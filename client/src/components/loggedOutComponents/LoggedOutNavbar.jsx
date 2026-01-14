import { useClerk } from '@clerk/clerk-react';
import React from 'react'
import { assets } from '../../assets/assets';

const LoggedOutNavbar = () => {

    const { openSignIn } = useClerk();

    const handleSignInClick = ()=>{

        openSignIn({});

    }

    return (
        <div className='fixed top-0 w-full'>

            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex justify-between items-center h-16">

                        <img src={assets.logo_full_dark} className='w-45' alt="" />

                        <div className="ml-4 flex items-center md:ml-6 space-x-3">
                            <button onClick={()=>handleSignInClick()} className="cursor-pointer text-gray-600 hover:text-gray-900 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors">Sign In</button>
                            <button onClick={()=>handleSignInClick()} className="cursor-pointer hidden md:block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">Get Started Free</button>
                        </div>

                    </div>

                </div>

            </nav>

        </div>
    )
}

export default LoggedOutNavbar