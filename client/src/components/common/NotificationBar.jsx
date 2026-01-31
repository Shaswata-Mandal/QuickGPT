import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets';

const VARIANTS = {
    info: "bg-blue-100 border-blue-300 text-blue-700",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-700",
    success: "bg-green-100 border-green-300 text-green-700",
    error: "bg-red-100 border-red-300 text-red-700",
};

const NotificationBar = ({ message, variant = "info", autoHide = true, duration = 6000 }) => {

    const [visible, setVisible] = useState(true);

    const handleClose = () => {

        setVisible(false);

    }

    useEffect(() => {

        if(!autoHide) return;

        const timer = setTimeout(() => {
            handleClose();
        }, duration);

    }, []);

    if(!visible) return null;

    return (
        <div
            className={`flex gap-2 px-3 py-2 border rounded-md items-center animate-fade-in ${VARIANTS[variant]}`}
        >
            <img src={assets.info_icon} className="w-5 h-5" alt="" />

            <p className="text-xs flex-1">{message}</p>

            <button
                onClick={handleClose}
                className="text-sm font-bold opacity-70 hover:opacity-100 cursor-pointer"
            >
                <img src={assets.close_icon} className='w-5 h-5 not-dark:invert dark:invert' alt="" />
            </button>
        </div>
    )
}

export default NotificationBar