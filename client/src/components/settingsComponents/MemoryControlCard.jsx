import React, { useState } from 'react'
import { assets } from '../../assets/assets'

const MemoryControlCard = ({ icon, title, description, enabled, onToggle, onManage }) => {

    return (
        <div className='flex flex-col gap-3 px-3 py-4 border rounded-md'>

            {/* Upper div */}
            <div className='flex gap-3 justify-between'>

                <div className='flex gap-2'>

                    <img src={icon} className='w-5 h-5' alt="" />

                    <div className='flex flex-col gap-2'>
                        <h2 className='text-md font-medium leading-none'>{title}</h2>
                        <p className='text-xs text-gray-400 md:max-w-92'>{description}</p>
                    </div>

                </div>

                <div className='dark:invert'>

                    <button className={`relative w-10 h-6 rounded-md transition-colors ${enabled ? "bg-primary " : "bg-gray-300 dark:bg-gray-600"}`}>

                        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-md transition-transform ${enabled ? "translate-x-4" : "translate-x-0"}`}></span>

                    </button>

                </div>

            </div>

            {/* Lower div */}
            <div className='flex justify-end'>

                <button onClick={onManage} type='button' className='cursor-pointer active:scale-95 border rounded-md px-3 py-1 text-sm'>Manage</button>

            </div>

        </div>
    )

}

export default MemoryControlCard