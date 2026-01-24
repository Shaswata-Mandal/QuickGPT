import React from 'react'
import { assets } from '../../assets/assets'

const NothingHere = () => {
    return (
        <div className='w-full h-full flex flex-col justify-center items-center'>

            <img src={assets.planet_icon} className='h-50 w-50' alt="" />
            <p className='text-sm font-medium dark:invert'>There's nothing to show here!</p>

        </div>
    )
}

export default NothingHere