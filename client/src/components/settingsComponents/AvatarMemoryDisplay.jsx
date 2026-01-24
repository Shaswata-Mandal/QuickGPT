import React from "react";
import { assets } from "../../assets/assets";


const AvatarMemoryDisplay = ({ onDeleteAvatar, onDeleteAll }) => {

    const avatarMemories = [
        {
            avatarId: "avatar_1",
            avatarName: "Mentor AI",
            userSummary: "User is a final year CS student preparing for interviews.",
            facts: [
                "Prefers concise explanations",
                "Interested in system design",
                "Practices daily coding",
                "Dislikes excessive emojis",
                "Often asks follow-up questions"
            ],
            emotionalState: "Focused & Motivated",
        },
        {
            avatarId: "avatar_1",
            avatarName: "Mentor AI",
            userSummary: "User is a final year CS student preparing for interviews.",
            facts: [
                "Prefers concise explanations",
                "Interested in system design",
                "Practices daily coding",
                "Dislikes excessive emojis",
                "Often asks follow-up questions"
            ],
            emotionalState: "Focused & Motivated",
        },
    ];

    if (!avatarMemories.length) {
        return (
            <div className="flex items-center justify-center min-h-[40vh] text-sm text-gray-500">
                No avatar memories saved yet.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full px-4 py-3">

            {/* Header */}
            <div className="flex flex-col gap-1 border-b pb-3">
                <h2 className="text-md font-medium">Avatar Memory</h2>
                <p className="text-xs text-gray-500">
                    These memories help avatars understand you better across conversations.
                </p>
            </div>

            {/* Memory cards */}
            <div className="flex flex-col gap-4">
                {avatarMemories.map((memory) => (
                    <div
                        key={memory.avatarId}
                        className="border rounded-md p-4 bg-white dark:bg-primary/10 flex flex-col gap-3"
                    >
                        {/* Avatar header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <img
                                    src={assets.avatar_icon}
                                    alt=""
                                    className="w-6 h-6"
                                />
                                <p className="text-sm font-medium">
                                    {memory.avatarName}
                                </p>
                            </div>

                            <button
                                onClick={() => onDeleteAvatar(memory.avatarId)}
                                className="text-xs text-red-500 hover:underline"
                            >
                                Delete memory
                            </button>
                        </div>

                        {/* User summary */}
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">
                                User summary
                            </p>
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                {memory.userSummary}
                            </p>
                        </div>

                        {/* Facts */}
                        {memory.facts?.length > 0 && (
                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">
                                    Key facts
                                </p>
                                <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-200">
                                    {memory.facts.map((fact, index) => (
                                        <li key={index}>{fact}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Emotional state */}
                        {memory.emotionalState && (
                            <div className="flex items-center gap-2">
                                <p className="text-xs font-medium text-gray-500">
                                    Emotional state:
                                </p>
                                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-200 dark:bg-primary/30">
                                    {memory.emotionalState}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Danger zone */}
            <div className="mt-6 border-t pt-4 flex justify-between items-center">
                <p className="text-xs text-gray-500">
                    This will permanently remove all avatar memories.
                </p>
                <button
                    onClick={onDeleteAll}
                    className="px-3 py-1.5 text-xs rounded-md border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                    Delete all memories
                </button>
            </div>
        </div>
    );
};

export default AvatarMemoryDisplay;
