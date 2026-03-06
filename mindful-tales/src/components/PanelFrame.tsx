// PanelFrame.tsx — Comic panel with auto-background, stacking, and enhanced animations
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import type { GameCharacter, GameToken, PanelBackground, PanelNarration } from '../types';
import CharacterSprite from './CharacterSprite';

interface PanelFrameProps {
    index: number;
    character: GameCharacter | null;
    secondary: GameCharacter | GameToken | null;
    secondaryIsToken: boolean;
    background: PanelBackground | null;
    onClear: () => void;
    onClearSecondary: () => void;
    narration?: PanelNarration | null;
    isPlaying?: boolean;
    isDone?: boolean;
}

const VFX_EMOJI: Record<string, string> = {
    hearts: '❤️', question: '❓', exclamation: '❗', sparkle: '✨', stars: '⭐', wisps: '🌀', none: '',
};

// Particle overlay during playback
const Particles: React.FC<{ vfx: string }> = ({ vfx }) => {
    if (vfx === 'none') return null;
    const emoji = VFX_EMOJI[vfx] || '✨';
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
            {[0, 1, 2].map(i => (
                <motion.span
                    key={i}
                    className="absolute text-lg"
                    style={{ left: `${20 + i * 25}%`, bottom: '40%' }}
                    initial={{ opacity: 0, y: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 1, 0], y: -40, scale: [0.5, 1.2, 0.8] }}
                    transition={{ duration: 1.5, delay: i * 0.3, ease: 'easeOut' }}
                >
                    {emoji}
                </motion.span>
            ))}
        </div>
    );
};

export const PanelFrame: React.FC<PanelFrameProps> = ({
    index, character, secondary, secondaryIsToken, background,
    onClear, onClearSecondary, narration, isPlaying, isDone,
}) => {
    const { isOver, setNodeRef } = useDroppable({ id: `panel-${index}` });

    const bgStyle: React.CSSProperties = background
        ? { backgroundImage: background.gradient, backgroundSize: 'cover' }
        : { backgroundColor: '#f5f0eb' };

    return (
        <motion.div
            ref={setNodeRef}
            className={`
        panel-frame relative flex flex-col
        w-full md:w-56 lg:w-64
        rounded-xl overflow-hidden
        border-[3px] transition-all duration-300
        ${isPlaying ? 'border-amber-400 shadow-xl shadow-amber-200/40 panel-highlight z-10' : ''}
        ${isDone ? 'border-sage/50 opacity-80' : ''}
        ${!isPlaying && !isDone ? (isOver ? 'border-sage border-dashed scale-[1.03]' : 'border-stone-300/80') : ''}
        shadow-lg
      `}
            style={{ minHeight: '300px' }}
            layout
            // Squash-and-stretch on placement
            animate={isOver ? { scaleY: 1.02, scaleX: 0.98 } : { scaleY: 1, scaleX: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
            {/* Panel Number */}
            <div className="absolute top-2 left-2 z-20 w-7 h-7 rounded-full bg-ink/70 text-paper text-xs font-bold flex items-center justify-center backdrop-blur-sm">
                {index + 1}
            </div>

            {/* Clear Button */}
            {character && !isPlaying && (
                <button onClick={onClear}
                    className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-red-400/80 text-white text-xs flex items-center justify-center hover:bg-red-500 transition-colors"
                >✕</button>
            )}

            {/* Background Name Badge */}
            {background && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 text-[9px] font-bold uppercase tracking-widest text-white/60 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    {background.icon} {background.name}
                </div>
            )}

            {/* Visual Stage */}
            <div className="flex-1 relative flex items-end justify-center overflow-hidden pb-2" style={bgStyle}>
                {/* Zoom/pan during playback */}
                {isPlaying && (
                    <motion.div className="absolute inset-0" style={bgStyle}
                        animate={{ scale: [1, 1.05, 1], x: [0, 3, -2, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    />
                )}

                {/* Empty state */}
                {!character && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`font-serif italic text-sm text-center px-4 ${isOver ? 'text-sage font-bold' : 'text-stone-400'}`}>
                            {isOver ? '✦ Drop here! ✦' : 'Drag character here'}
                        </span>
                    </div>
                )}

                {/* Stacked secondary (behind/below primary) */}
                <AnimatePresence>
                    {secondary && (
                        <motion.div
                            className="absolute bottom-2 right-2 z-10"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            {secondaryIsToken ? (
                                <div className="w-10 h-10 rounded-lg bg-paper/80 backdrop-blur-sm flex items-center justify-center text-xl shadow-md border border-white/30">
                                    {(secondary as GameToken).icon}
                                </div>
                            ) : (
                                <div className="opacity-70">
                                    <CharacterSprite spritePrefix={(secondary as GameCharacter).spritePrefix}
                                        expression={narration?.expression || 'neutral'} size={48} />
                                </div>
                            )}
                            {!isPlaying && (
                                <button onClick={onClearSecondary}
                                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-400 text-white text-[8px] flex items-center justify-center hover:bg-red-500"
                                >✕</button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Primary Character */}
                <AnimatePresence mode="wait">
                    {character && (
                        <motion.div
                            key={`${character.id}-${narration?.expression || 'idle'}`}
                            className="relative z-10"
                            initial={{ scale: 0.3, opacity: 0, y: 20, scaleY: 0.7 }}
                            animate={{ scale: 1, opacity: 1, y: 0, scaleY: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                        >
                            <div className={!isPlaying ? 'idle-bob' : ''}>
                                <CharacterSprite
                                    spritePrefix={character.spritePrefix}
                                    expression={narration?.expression || 'neutral'}
                                    size={100}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Particles */}
                <AnimatePresence>
                    {narration && isPlaying && narration.vfx !== 'none' && (
                        <Particles vfx={narration.vfx} />
                    )}
                </AnimatePresence>

                {/* Speech Bubble during playback */}
                <AnimatePresence>
                    {narration && isPlaying && (
                        <motion.div
                            className="absolute bottom-1 left-1.5 right-1.5 z-30 bg-paper/95 backdrop-blur-sm rounded-xl p-2.5 shadow-lg border border-white/30"
                            initial={{ scale: 0.5, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        >
                            {narration.speaker && (
                                <span className="text-[9px] font-bold uppercase tracking-widest text-sage block mb-0.5">
                                    {narration.speaker}
                                </span>
                            )}
                            <p className="font-serif text-[11px] leading-snug text-ink">{narration.text}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Character Name (when not playing) */}
            {character && !isPlaying && (
                <div className="text-center py-1.5 bg-paper/90 backdrop-blur-sm text-xs font-bold uppercase tracking-widest text-stone-500 border-t border-stone-100">
                    {character.name}
                    {secondary && <span className="text-stone-300"> + {secondary.name}</span>}
                </div>
            )}
        </motion.div>
    );
};
