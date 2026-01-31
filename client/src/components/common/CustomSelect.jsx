import React, { useEffect, useRef, useState } from 'react'
import { assets } from '../../assets/assets'

const CustomSelect = ({ options = [], onChange, value, placeholder = "Select option" }) => {

    const dropdownRef = useRef();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {

        const handleOutsideClick = (e) => {

            if (!dropdownRef.current) return;

            if (!dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }

        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => document.removeEventListener("mousedown", handleOutsideClick);

    }, []);

    return (
        <div className='relative w-full' ref={dropdownRef}>

            {/* Trigger */}
            <button type='button' onClick={() => setIsOpen(prev => !prev)} className='cursor-pointer w-full flex justify-between items-center border dark:border-white rounded-md gap-1 px-2 py-1'>

                <span className='max-w-23 text-sm bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-none'>{value?.charAt(0).toUpperCase() + value?.slice(1)}</span>

                <img
                    src={assets.down_arrow_icon}
                    className={`w-5 h-5 transition-transform dark:invert ${isOpen ? "rotate-180" : ""}`}
                    alt=""
                />

            </button>

            {/* Drop Down */}
            {isOpen && (
                <div className={`absolute top-9 right-0 min-w-fit border rounded-md flex flex-col max-md:gap-2 p-2 bg-white dark:invert z-1`}>

                    {options.map((option) => (

                        <div
                            key={option}
                            onClick={() => { onChange(option); setIsOpen(false) }}
                            className='text-sm py-1 px-2 max-md:bg-gray-200 hover:bg-gray-200 rounded-md cursor-pointer'
                        >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </div>

                    ))}

                </div>
            )}

        </div>
    )
}

export default CustomSelect