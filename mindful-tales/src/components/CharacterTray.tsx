// CharacterTray.tsx — Netflix Storyteller-style card tray with characters + tokens
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import type { GameCharacter, GameToken } from '../types';
import CharacterSprite from './CharacterSprite';

// ─── Character Card ───
const CharacterCard: React.FC<{ character: GameCharacter; isPlaced: boolean }> = ({ character, isPlaced }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `char-${character.id}`,
        data: { character, type: 'character' },
    });
    const style: React.CSSProperties = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(${isDragging ? 3 : 0}deg)`, zIndex: isDragging ? 100 : 1 }
        : {};

    return (
        <motion.div
            ref={setNodeRef} {...listeners} {...attributes}
            className={`
        relative flex flex-col items-center justify-end
        w-[72px] h-[92px] md:w-[84px] md:h-[108px]
        rounded-xl cursor-grab active:cursor-grabbing
        overflow-hidden select-none
        ${isDragging ? 'shadow-2xl ring-2 ring-sage/50' : 'shadow-md'}
        ${isPlaced ? 'opacity-35 grayscale pointer-events-none' : ''}
      `}
            style={{
                ...style,
                background: `linear-gradient(180deg, ${character.color}15 0%, ${character.color}35 100%)`,
                border: `2px solid ${character.color}40`,
            }}
            whileHover={!isPlaced ? { scale: 1.1, rotate: 2, y: -6, boxShadow: `0 8px 30px ${character.color}30` } : {}}
            whileTap={!isPlaced ? { scale: 0.92 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        >
            {/* Character SVG */}
            <div className="flex-1 flex items-center justify-center pt-1">
                <CharacterSprite spritePrefix={character.spritePrefix} expression="neutral" size={56} />
            </div>
            {/* Name label */}
            <div className="w-full text-center py-1 bg-white/40 backdrop-blur-sm border-t border-white/20">
                <span className="text-[9px] md:text-[10px] uppercase tracking-wider font-bold leading-none"
                    style={{ color: character.color }}>
                    {character.name}
                </span>
            </div>
        </motion.div>
    );
};

// ─── Token Card ───
const TokenCard: React.FC<{ token: GameToken; isPlaced: boolean }> = ({ token, isPlaced }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `token-${token.id}`,
        data: { token, type: 'token' },
    });
    const style: React.CSSProperties = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(${isDragging ? -2 : 0}deg)`, zIndex: isDragging ? 100 : 1 }
        : {};

    return (
        <motion.div
            ref={setNodeRef} {...listeners} {...attributes}
            className={`
        relative flex flex-col items-center justify-center
        w-[56px] h-[72px] md:w-[64px] md:h-[80px]
        rounded-lg cursor-grab active:cursor-grabbing
        overflow-hidden select-none
        ${isDragging ? 'shadow-2xl' : 'shadow-md'}
        ${isPlaced ? 'opacity-35 grayscale pointer-events-none' : ''}
      `}
            style={{
                ...style,
                background: `linear-gradient(180deg, ${token.color}20 0%, ${token.color}40 100%)`,
                border: `2px solid ${token.color}30`,
            }}
            whileHover={!isPlaced ? { scale: 1.1, y: -4, boxShadow: `0 6px 20px ${token.color}25` } : {}}
            whileTap={!isPlaced ? { scale: 0.9 } : {}}
        >
            <span className="text-2xl">{token.icon}</span>
            <span className="text-[8px] md:text-[9px] uppercase tracking-wider font-bold mt-1"
                style={{ color: token.color }}>
                {token.name}
            </span>
        </motion.div>
    );
};

// ─── Background Picker ───
const BackgroundPicker: React.FC<{
    backgrounds: PanelBackground[];
    onSelect: (bgId: string, panelIndex: number) => void;
    panelCount: number;
    currentSlots: { index: number; backgroundId: string | null }[];
}> = ({ backgrounds, onSelect, currentSlots }) => {
    return (
        <div className="flex flex-wrap gap-2 justify-center">
            {currentSlots.map(slot => (
                <div key={slot.index} className="flex flex-col items-center gap-1">
                    <span className="text-[9px] font-bold text-stone-400 uppercase">Panel {slot.index + 1}</span>
                    <div className="flex gap-1">
                        {backgrounds.map(bg => (
                            <button key={bg.id} onClick={() => onSelect(bg.id, slot.index)}
                                className={`w-7 h-7 rounded-md transition-all ${slot.backgroundId === bg.id ? 'ring-2 ring-sage ring-offset-1 scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'
                                    }`}
                                style={{ backgroundImage: bg.gradient }}
                                title={bg.name}
                            >
                                <span className="text-[10px]">{bg.icon}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// Need this import for the type
import type { PanelBackground } from '../types';

// ─── Main Tray ───
interface CharacterTrayProps {
    characters: GameCharacter[];
    tokens: GameToken[];
    placedCharacterIds: string[];
    placedTokenIds: string[];
    backgrounds: PanelBackground[];
    panelSlots: { index: number; backgroundId: string | null }[];
    onBackgroundSelect: (bgId: string, panelIndex: number) => void;
}

export const CharacterTray: React.FC<CharacterTrayProps> = ({
    characters, tokens, placedCharacterIds, placedTokenIds,
    backgrounds, panelSlots, onBackgroundSelect,
}) => {
    return (
        <div className="w-full bg-paper/80 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 shadow-inner space-y-3">
            {/* Characters */}
            <div>
                <div className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-2 text-center">
                    ✦ Characters ✦
                </div>
                <div className="flex flex-wrap gap-2.5 justify-center">
                    {characters.map(char => (
                        <CharacterCard key={char.id} character={char} isPlaced={placedCharacterIds.includes(char.id)} />
                    ))}
                </div>
            </div>

            {/* Tokens (if any) */}
            {tokens.length > 0 && (
                <div>
                    <div className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-2 text-center">
                        ✦ Objects ✦
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {tokens.map(token => (
                            <TokenCard key={token.id} token={token} isPlaced={placedTokenIds.includes(token.id)} />
                        ))}
                    </div>
                </div>
            )}

            {/* Background Picker */}
            <div>
                <div className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-2 text-center">
                    ✦ Backgrounds ✦
                </div>
                <BackgroundPicker
                    backgrounds={backgrounds}
                    onSelect={onBackgroundSelect}
                    panelCount={panelSlots.length}
                    currentSlots={panelSlots}
                />
            </div>
        </div>
    );
};
