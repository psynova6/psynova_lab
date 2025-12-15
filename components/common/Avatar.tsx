import React from 'react';

interface AvatarProps {
    name: string;
    type?: 'student' | 'assistant' | 'volunteer';
    size?: 'sm' | 'md' | 'lg';
}

const Avatar: React.FC<AvatarProps> = ({ name, type = 'student', size = 'md' }) => {
    // Get initials from name
    const getInitials = (name: string): string => {
        const words = name.trim().split(' ');
        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        }
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    };

    // Colors based on type
    const getColors = (type: string) => {
        switch (type) {
            case 'student':
                return {
                    bg: 'bg-gradient-to-br from-blue-400 to-blue-600',
                    text: 'text-white',
                    ring: 'ring-blue-300'
                };
            case 'assistant':
                return {
                    bg: 'bg-gradient-to-br from-purple-400 to-purple-600',
                    text: 'text-white',
                    ring: 'ring-purple-300'
                };
            case 'volunteer':
                return {
                    bg: 'bg-gradient-to-br from-pink-400 to-pink-600',
                    text: 'text-white',
                    ring: 'ring-pink-300'
                };
            default:
                return {
                    bg: 'bg-gradient-to-br from-gray-400 to-gray-600',
                    text: 'text-white',
                    ring: 'ring-gray-300'
                };
        }
    };

    // Size classes
    const getSizeClasses = (size: string) => {
        switch (size) {
            case 'sm':
                return 'w-8 h-8 text-xs';
            case 'md':
                return 'w-10 h-10 text-sm';
            case 'lg':
                return 'w-12 h-12 text-base';
            default:
                return 'w-10 h-10 text-sm';
        }
    };

    const colors = getColors(type);
    const sizeClasses = getSizeClasses(size);
    const initials = getInitials(name);

    return (
        <div
            className={`${sizeClasses} ${colors.bg} ${colors.text} rounded-full flex items-center justify-center font-bold ring-2 ${colors.ring} ring-offset-1 shadow-md transition-transform hover:scale-105`}
            title={name}
        >
            {initials}
        </div>
    );
};

export default Avatar;
