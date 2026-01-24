import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";

//Disclaimer: This component was coded with the assistance of AI for implementing advanced features.

const CooldownTimer = ({ seconds, provider }) => {

    const { cooldownInfo } = useAppContext();
    const [remaining, setRemaining] = useState(seconds);

    useEffect(() => {

        setRemaining(seconds);

    }, [seconds]);

    useEffect(() => {

        const interval = setInterval(() => {
            setRemaining(prev => Math.max(prev - 1, 0));
        }, 1000);

        return () => clearInterval(interval);

    }, [remaining]);

    const total = cooldownInfo[provider].retryAfter;
    const progress = total > 0 ? (remaining / total) * 100 : 0;

    const minutes = Math.floor(remaining / 60);
    const secs = remaining % 60;

    return (
        <div className="flex items-center w-full max-w-2xl gap-3 px-4 py-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700">

            {/* Circular Progress */}
            <div
                className="relative w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                    background: `conic-gradient(
                        #facc15 ${progress}%,
                        rgba(0,0,0,0.1) ${progress}% 100%
                    )`
                }}
            >

                <div className="absolute w-7 h-7 rounded-full bg-white dark:bg-gray-900" />
                
            </div>

            {/* Text */}
            <div className="text-sm">

                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    {provider.toUpperCase()} cooldown
                </p>

                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                    Retry in {minutes}:{secs.toString().padStart(2, "0")}
                </p>

            </div>

        </div>
    );
};

export default CooldownTimer;
