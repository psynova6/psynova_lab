// CharacterSprite.tsx — SVG-based character illustrations with expressions
// Each character is a unique, distinctive SVG with consistent proportions
import React from 'react';
import type { Expression } from '../types';

interface CharacterSpriteProps {
    spritePrefix: string;
    expression?: Expression;
    size?: number;
    className?: string;
}

// Face expression helpers
const eyeVariants = {
    neutral: { ry: 3, oy: 0 },
    happy: { ry: 1.5, oy: 1 },
    worried: { ry: 4, oy: -1 },
};

const mouthVariants = {
    neutral: 'M-4,4 Q0,6 4,4',
    happy: 'M-5,3 Q0,8 5,3',
    worried: 'M-4,6 Q0,3 4,6',
};

// Character definition type
interface CharDef {
    hairColor: string;
    skinColor: string;
    outfitColor: string;
    outfitAccent: string;
    hairPath: string;
    accessory?: React.ReactNode;
    bodyVariant?: 'default' | 'robes' | 'cape' | 'vest';
}

const CHAR_DEFS: Record<string, CharDef> = {
    elias: {
        hairColor: '#8B6E4E', skinColor: '#F5D0A9', outfitColor: '#7B8F6B', outfitAccent: '#5C6B4E',
        hairPath: 'M-14,-18 Q-16,-26 -8,-30 Q0,-34 8,-30 Q16,-26 14,-18 Q10,-22 0,-24 Q-10,-22 -14,-18Z',
    },
    mina: {
        hairColor: '#5C3D2E', skinColor: '#EDCBA8', outfitColor: '#7BAED0', outfitAccent: '#5A8FB5',
        hairPath: 'M-15,-16 Q-18,-28 -6,-32 Q0,-34 6,-32 Q18,-28 15,-16 Q16,-20 14,-28 Q8,-24 0,-26 Q-8,-24 -14,-28 Q-16,-20 -15,-16Z M-16,-14 Q-18,-10 -16,-4 M16,-14 Q18,-10 16,-4',
        accessory: <circle cx="6" cy="-28" r="2.5" fill="#FF69B4" opacity="0.8" />,
    },
    maya: {
        hairColor: '#2C1810', skinColor: '#D4A06A', outfitColor: '#E8C84A', outfitAccent: '#5C8B3E',
        hairPath: 'M-14,-17 Q-14,-30 -4,-32 Q0,-33 4,-32 Q14,-30 14,-17 Q12,-25 6,-28 Q0,-30 -6,-28 Q-12,-25 -14,-17Z',
        accessory: <><ellipse cx="0" cy="-33" rx="10" ry="4" fill="#5C8B3E" /><ellipse cx="0" cy="-35" rx="8" ry="3" fill="#6BA34E" /></>,
    },
    professor: {
        hairColor: '#D4D4D4', skinColor: '#F0D4B8', outfitColor: '#8B3A3A', outfitAccent: '#6B2A2A',
        hairPath: 'M-12,-18 Q-14,-28 -4,-30 Q0,-32 4,-30 Q14,-28 12,-18 Q10,-22 0,-24 Q-10,-22 -12,-18Z',
        bodyVariant: 'robes',
        accessory: <><rect x="-8" y="-10" width="16" height="5" rx="2" fill="#C0A060" opacity="0.3" /><circle cx="-6" cy="-8" r="5" fill="none" stroke="#C0A060" strokeWidth="1" /><circle cx="6" cy="-8" r="5" fill="none" stroke="#C0A060" strokeWidth="1" /></>,
    },
    dracula: {
        hairColor: '#1A1A2E', skinColor: '#E8DDD4', outfitColor: '#2D1B4E', outfitAccent: '#8B0000',
        hairPath: 'M-14,-17 Q-16,-30 -6,-32 Q0,-35 6,-32 Q16,-30 14,-17 Q12,-24 6,-28 Q0,-30 -6,-28 Q-12,-24 -14,-17Z M-14,-17 L-16,-22 M14,-17 L16,-22',
        bodyVariant: 'cape',
    },
    night: {
        hairColor: '#1A1A3E', skinColor: '#B8C4E0', outfitColor: '#1A1A3E', outfitAccent: '#2A2A5E',
        hairPath: 'M-14,-17 Q-14,-30 0,-34 Q14,-30 14,-17 Q10,-24 0,-28 Q-10,-24 -14,-17Z',
        accessory: <><circle cx="-4" cy="-30" r="1" fill="#FFE066" /><circle cx="6" cy="-28" r="0.8" fill="#FFE066" /><circle cx="2" cy="-32" r="1.2" fill="#FFE066" /></>,
    },
    sam: {
        hairColor: '#C4641D', skinColor: '#F0C8A0', outfitColor: '#D4734A', outfitAccent: '#A85830',
        hairPath: 'M-13,-18 Q-12,-28 -4,-30 Q0,-32 4,-30 Q12,-28 13,-18 Q11,-22 8,-26 Q4,-22 0,-24 Q-4,-22 -8,-26 Q-11,-22 -13,-18Z',
    },
    rowan: {
        hairColor: '#A0522D', skinColor: '#F5D0A9', outfitColor: '#6B9B6B', outfitAccent: '#4A7A4A',
        hairPath: 'M-14,-16 Q-16,-28 -6,-32 Q0,-34 6,-32 Q16,-28 14,-16 Q14,-22 10,-28 Q4,-26 0,-28 Q-4,-26 -10,-28 Q-14,-22 -14,-16Z',
        accessory: <rect x="8" y="-6" width="4" height="8" rx="1" fill="#D4A06A" opacity="0.6" />,
    },
    noor: {
        hairColor: '#1A0A00', skinColor: '#C8956C', outfitColor: '#E8A040', outfitAccent: '#8B7355',
        hairPath: 'M-13,-18 Q-14,-30 -4,-32 Q0,-34 4,-32 Q14,-30 13,-18 L14,-16 Q16,-22 12,-30 Q6,-28 0,-30 Q-6,-28 -12,-30 Q-16,-22 -14,-16Z',
        bodyVariant: 'vest',
        accessory: <circle cx="0" cy="24" r="3" fill="none" stroke="#C0A060" strokeWidth="1.5" />,
    },
    asha: {
        hairColor: '#0A0A1A', skinColor: '#C8A882', outfitColor: '#9B7BC0', outfitAccent: '#7B5BA0',
        hairPath: 'M-16,-14 Q-18,-28 -6,-32 Q0,-36 6,-32 Q18,-28 16,-14 Q16,-20 14,-28 Q8,-26 0,-28 Q-8,-26 -14,-28 Q-16,-20 -16,-14Z M-16,-14 Q-18,-8 -16,0 M16,-14 Q18,-8 16,0',
        bodyVariant: 'robes',
        accessory: <path d="M-3,-30 L0,-34 L3,-30" fill="none" stroke="#FFE066" strokeWidth="1" />,
    },
    leo: {
        hairColor: '#4A3728', skinColor: '#E8C8A0', outfitColor: '#5078A0', outfitAccent: '#3A5A80',
        hairPath: 'M-12,-18 Q-12,-28 -4,-30 Q0,-32 4,-30 Q12,-28 12,-18 Q10,-22 6,-26 Q2,-24 0,-26 Q-2,-24 -6,-26 Q-10,-22 -12,-18Z',
    },
    kiran: {
        hairColor: '#2C1810', skinColor: '#D4A878', outfitColor: '#E0A030', outfitAccent: '#C08020',
        hairPath: 'M-13,-18 Q-10,-30 -2,-32 Q0,-33 2,-32 Q10,-30 13,-18 Q12,-22 8,-28 Q4,-24 0,-28 Q-4,-24 -8,-28 Q-12,-22 -13,-18Z',
        accessory: <circle cx="0" cy="-20" r="1.5" fill="#FFD700" />,
    },
    luna: {
        hairColor: '#4A4A6E', skinColor: '#F0E0D4', outfitColor: '#2A2A5E', outfitAccent: '#4A4A8E',
        hairPath: 'M-16,-14 Q-18,-30 -6,-34 Q0,-36 6,-34 Q18,-30 16,-14 Q16,-20 12,-30 Q6,-28 0,-30 Q-6,-28 -12,-30 Q-16,-20 -16,-14Z M-16,-12 Q-20,-6 -18,2 M16,-12 Q20,-6 18,2',
        accessory: <><path d="M6,-32 Q10,-34 8,-30" fill="#FFE066" /><circle cx="-6" cy="-34" r="1" fill="#FFE088" /></>,
    },
    iris: {
        hairColor: '#6B3A2A', skinColor: '#F0D0B0', outfitColor: '#8B6B9B', outfitAccent: '#6B4B7B',
        hairPath: 'M-14,-16 Q-16,-28 -6,-32 Q0,-34 6,-32 Q16,-28 14,-16 Q12,-24 6,-28 Q0,-30 -6,-28 Q-12,-24 -14,-16Z',
        accessory: <rect x="-10" y="20" width="8" height="10" rx="1" fill="#8B6F4E" opacity="0.5" />,
    },
    theo: {
        hairColor: '#6B4E2E', skinColor: '#E8C4A0', outfitColor: '#5E7B5E', outfitAccent: '#3E5B3E',
        hairPath: 'M-14,-18 Q-14,-30 -4,-32 Q0,-34 4,-32 Q14,-30 14,-18 Q12,-24 6,-28 Q0,-30 -6,-28 Q-12,-24 -14,-18Z',
        bodyVariant: 'vest',
    },
};

export const CharacterSprite: React.FC<CharacterSpriteProps> = ({
    spritePrefix,
    expression = 'neutral',
    size = 100,
    className = '',
}) => {
    const def = CHAR_DEFS[spritePrefix];
    if (!def) {
        return (
            <div className={`flex items-center justify-center ${className}`}
                style={{ width: size, height: size, backgroundColor: '#ccc', borderRadius: '50%' }}
            >
                <span className="text-white text-xl font-bold">{spritePrefix.charAt(0).toUpperCase()}</span>
            </div>
        );
    }

    const eye = eyeVariants[expression];
    const mouth = mouthVariants[expression];
    const viewBox = "-30 -40 60 80";

    return (
        <svg
            viewBox={viewBox}
            width={size}
            height={size}
            className={`character-svg ${className}`}
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
        >
            {/* Body */}
            {def.bodyVariant === 'robes' ? (
                <path d="M-12,8 Q-16,20 -14,36 L14,36 Q16,20 12,8 Q8,6 0,6 Q-8,6 -12,8Z"
                    fill={def.outfitColor} />
            ) : def.bodyVariant === 'cape' ? (
                <>
                    <path d="M-18,6 Q-20,20 -16,36 L-10,36 L-10,8Z" fill={def.outfitAccent} opacity="0.7" />
                    <path d="M18,6 Q20,20 16,36 L10,36 L10,8Z" fill={def.outfitAccent} opacity="0.7" />
                    <path d="M-10,8 Q-12,20 -10,36 L10,36 Q12,20 10,8 Q6,6 0,6 Q-6,6 -10,8Z"
                        fill={def.outfitColor} />
                </>
            ) : def.bodyVariant === 'vest' ? (
                <>
                    <path d="M-10,8 Q-12,20 -10,36 L10,36 Q12,20 10,8 Q6,6 0,6 Q-6,6 -10,8Z"
                        fill={def.outfitColor} />
                    <path d="M-6,8 L-4,36 L4,36 L6,8Z" fill={def.outfitAccent} opacity="0.5" />
                </>
            ) : (
                <path d="M-10,8 Q-12,20 -10,36 L10,36 Q12,20 10,8 Q6,6 0,6 Q-6,6 -10,8Z"
                    fill={def.outfitColor} />
            )}

            {/* Neck */}
            <rect x="-3" y="4" width="6" height="6" rx="2" fill={def.skinColor} />

            {/* Head */}
            <ellipse cx="0" cy="-6" rx="14" ry="16" fill={def.skinColor} />

            {/* Hair */}
            <path d={def.hairPath} fill={def.hairColor} />

            {/* Eyes */}
            <ellipse cx="-5" cy={-6 + eye.oy} rx="2.5" ry={eye.ry} fill="#2D2A2E" />
            <ellipse cx="5" cy={-6 + eye.oy} rx="2.5" ry={eye.ry} fill="#2D2A2E" />
            {/* Eye highlights */}
            <circle cx="-4" cy={-7 + eye.oy} r="0.8" fill="white" opacity="0.8" />
            <circle cx="6" cy={-7 + eye.oy} r="0.8" fill="white" opacity="0.8" />

            {/* Eyebrows */}
            {expression === 'worried' && (
                <>
                    <line x1="-7" y1="-13" x2="-3" y2="-11" stroke={def.hairColor} strokeWidth="1.2" strokeLinecap="round" />
                    <line x1="3" y1="-11" x2="7" y2="-13" stroke={def.hairColor} strokeWidth="1.2" strokeLinecap="round" />
                </>
            )}

            {/* Blush */}
            {expression === 'happy' && (
                <>
                    <circle cx="-9" cy="-2" r="3" fill="#FFB4B4" opacity="0.3" />
                    <circle cx="9" cy="-2" r="3" fill="#FFB4B4" opacity="0.3" />
                </>
            )}

            {/* Mouth */}
            <path d={mouth} fill="none" stroke="#2D2A2E" strokeWidth="1.2" strokeLinecap="round" />

            {/* Accessory */}
            {def.accessory}
        </svg>
    );
};

export default CharacterSprite;
