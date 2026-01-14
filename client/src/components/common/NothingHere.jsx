import React from 'react'
import { assets } from '../../assets/assets'

const NothingHere = () => {
    return (
        <div className='flex flex-1 justify-center items-center flex-col'>

            <img src={assets.planet_icon} className='h-50 w-50' alt="" />
            <p className='text-sm font-medium dark:invert'>There's nothing to show here!</p>

        </div>
    )
}

export default NothingHere