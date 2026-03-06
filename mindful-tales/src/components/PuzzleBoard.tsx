// PuzzleBoard.tsx — Main game view with stacking, tokens, auto-backgrounds
import React, { useState, useCallback, useMemo } from 'react';
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import type { PuzzleChapter, PanelSlot, Outcome, GameCharacter, GameToken } from '../types';
import { evaluatePanels, hasAnyCharacter } from '../engine/puzzleEngine';
import { PanelFrame } from './PanelFrame';
import { CharacterTray } from './CharacterTray';
import { StoryPlayback } from './StoryPlayback';
import { OutcomeOverlay } from './OutcomeOverlay';
import CharacterSprite from './CharacterSprite';
import { ArrowLeft, RotateCcw, Wand2 } from 'lucide-react';
import { gameApiService } from '../services/gameApiService';

interface PuzzleBoardProps {
    chapter: PuzzleChapter;
    onBack: () => void;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ chapter, onBack }) => {
    const [slots, setSlots] = useState<PanelSlot[]>(() =>
        Array.from({ length: chapter.panelCount }, (_, i) => ({
            index: i,
            characterId: null,
            secondaryId: null,
            secondaryIsToken: false,
            backgroundId: chapter.lockedBackgrounds?.[i] || chapter.backgrounds[0]?.id || null,
        }))
    );

    const [isPlaying, setIsPlaying] = useState(false);
    const [playingPanelIndex, setPlayingPanelIndex] = useState(-1);
    const [currentOutcome, setCurrentOutcome] = useState<Outcome | null>(null);
    const [showOutcome, setShowOutcome] = useState(false);
    const [discoveredOutcomeIds, setDiscoveredOutcomeIds] = useState<Set<string>>(new Set());
    const [activeDrag, setActiveDrag] = useState<{ type: 'character' | 'token'; data: GameCharacter | GameToken } | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
    );

    // Persistence: Load progress on mount
    React.useEffect(() => {
        const loadProgress = async () => {
            const progress = await gameApiService.getProgress('mindful-tales-chapter-' + chapter.id);
            if (progress && progress.completed_endings) {
                setDiscoveredOutcomeIds(new Set(progress.completed_endings));
            }
        };
        loadProgress();
    }, [chapter.id]);

    // Persistence: Save progress when discoveredOutcomeIds change
    React.useEffect(() => {
        if (discoveredOutcomeIds.size > 0) {
            gameApiService.updateProgress('mindful-tales-chapter-' + chapter.id, {
                current_scene_id: 'root',
                flags: {},
                history: [],
                completed_endings: Array.from(discoveredOutcomeIds)
            }).catch(err => console.error("Persistence failed", err));
        }
    }, [discoveredOutcomeIds, chapter.id]);

    // Placed IDs
    const placedCharacterIds = useMemo(() => {
        const ids: string[] = [];
        slots.forEach(s => {
            if (s.characterId) ids.push(s.characterId);
            if (s.secondaryId && !s.secondaryIsToken) ids.push(s.secondaryId);
        });
        return ids;
    }, [slots]);

    const placedTokenIds = useMemo(() => {
        return slots.filter(s => s.secondaryId && s.secondaryIsToken).map(s => s.secondaryId!);
    }, [slots]);

    // Lookups
    const findChar = useCallback((id: string) => chapter.characters.find(c => c.id === id) || null, [chapter]);
    const findToken = useCallback((id: string) => chapter.tokens.find(t => t.id === id) || null, [chapter]);
    const findBg = useCallback((id: string) => chapter.backgrounds.find(b => b.id === id) || null, [chapter]);

    const findSecondary = useCallback((slot: PanelSlot): GameCharacter | GameToken | null => {
        if (!slot.secondaryId) return null;
        return slot.secondaryIsToken ? findToken(slot.secondaryId) : findChar(slot.secondaryId);
    }, [findChar, findToken]);

    // Drag handlers
    const handleDragStart = useCallback((event: any) => {
        const id = event.active.id as string;
        if (id.startsWith('char-')) {
            const c = findChar(id.replace('char-', ''));
            if (c) setActiveDrag({ type: 'character', data: c });
        } else if (id.startsWith('token-')) {
            const t = findToken(id.replace('token-', ''));
            if (t) setActiveDrag({ type: 'token', data: t });
        }
    }, [findChar, findToken]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        setActiveDrag(null);
        const { active, over } = event;
        if (!over) return;

        const panelIndex = parseInt((over.id as string).replace('panel-', ''));
        if (isNaN(panelIndex)) return;

        const activeId = active.id as string;
        const isToken = activeId.startsWith('token-');
        const itemId = activeId.replace('char-', '').replace('token-', '');

        setSlots(prev => {
            const newSlots = prev.map(s => {
                // Remove this item from any previous slot
                if (s.characterId === itemId) return { ...s, characterId: null };
                if (s.secondaryId === itemId) return { ...s, secondaryId: null, secondaryIsToken: false };
                return s;
            });

            return newSlots.map(s => {
                if (s.index !== panelIndex) return s;

                if (isToken) {
                    // Tokens always go to secondary slot
                    return { ...s, secondaryId: itemId, secondaryIsToken: true };
                }

                // Characters: if primary is empty, fill primary. If primary is full and stacking allowed, fill secondary.
                if (!s.characterId) {
                    return { ...s, characterId: itemId };
                } else if (chapter.allowStacking && !s.secondaryId) {
                    return { ...s, secondaryId: itemId, secondaryIsToken: false };
                } else if (!chapter.allowStacking) {
                    // Replace primary
                    return { ...s, characterId: itemId };
                }
                return s;
            });
        });

        setShowOutcome(false);
        setCurrentOutcome(null);
    }, [chapter.allowStacking]);

    const handleBackgroundSelect = useCallback((bgId: string, panelIndex: number) => {
        if (chapter.lockedBackgrounds?.[panelIndex]) return; // locked
        setSlots(prev => prev.map(s => s.index === panelIndex ? { ...s, backgroundId: bgId } : s));
        setShowOutcome(false);
        setCurrentOutcome(null);
    }, [chapter.lockedBackgrounds]);

    const handleClearPanel = useCallback((panelIndex: number) => {
        setSlots(prev => prev.map(s => s.index === panelIndex ? { ...s, characterId: null, secondaryId: null, secondaryIsToken: false } : s));
        setShowOutcome(false); setCurrentOutcome(null);
    }, []);

    const handleClearSecondary = useCallback((panelIndex: number) => {
        setSlots(prev => prev.map(s => s.index === panelIndex ? { ...s, secondaryId: null, secondaryIsToken: false } : s));
        setShowOutcome(false); setCurrentOutcome(null);
    }, []);

    const handleReset = useCallback(() => {
        setSlots(prev => prev.map((s, i) => ({
            ...s, characterId: null, secondaryId: null, secondaryIsToken: false,
            backgroundId: chapter.lockedBackgrounds?.[i] || chapter.backgrounds[0]?.id || null,
        })));
        setIsPlaying(false); setPlayingPanelIndex(-1); setShowOutcome(false); setCurrentOutcome(null);
    }, [chapter]);

    const handleTellStory = useCallback(() => {
        if (!hasAnyCharacter(slots)) return;
        const outcome = evaluatePanels(slots, chapter);
        setCurrentOutcome(outcome);
        setIsPlaying(true); setShowOutcome(false); setPlayingPanelIndex(-1);
        setDiscoveredOutcomeIds(prev => new Set([...prev, outcome.id]));
    }, [slots, chapter]);

    const handlePlaybackComplete = useCallback(() => {
        setIsPlaying(false); setPlayingPanelIndex(-1); setShowOutcome(true);
    }, []);

    const canTellStory = hasAnyCharacter(slots) && !isPlaying;

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            <div className="flex flex-col min-h-screen max-w-6xl mx-auto p-4 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <button onClick={onBack} className="text-stone-500 hover:text-ink flex items-center gap-2 transition-colors">
                        <ArrowLeft size={20} /> Library
                    </button>
                    <div className="text-center flex-1 px-4">
                        <h2 className="font-serif text-2xl md:text-3xl text-ink font-semibold mb-0.5">{chapter.title}</h2>
                        <p className="text-sage font-medium italic text-sm">{chapter.goal}</p>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
                        {chapter.theme}
                    </span>
                </div>

                {/* Game Area */}
                <div className="flex-1 flex flex-col items-center gap-5">
                    {/* Panels */}
                    <motion.div className="flex flex-wrap justify-center gap-4 w-full" layout>
                        {slots.map(slot => (
                            <PanelFrame key={slot.index} index={slot.index}
                                character={slot.characterId ? findChar(slot.characterId) : null}
                                secondary={findSecondary(slot)}
                                secondaryIsToken={slot.secondaryIsToken}
                                background={slot.backgroundId ? findBg(slot.backgroundId) : null}
                                onClear={() => handleClearPanel(slot.index)}
                                onClearSecondary={() => handleClearSecondary(slot.index)}
                                narration={currentOutcome && playingPanelIndex === slot.index ? currentOutcome.panelNarrations[slot.index] || null : null}
                                isPlaying={isPlaying && playingPanelIndex === slot.index}
                                isDone={isPlaying && playingPanelIndex > slot.index}
                            />
                        ))}
                    </motion.div>

                    {/* Hint */}
                    <AnimatePresence>
                        {!isPlaying && !showOutcome && (
                            <motion.p className="text-stone-400 text-sm font-serif italic text-center max-w-md"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {chapter.allowStacking
                                    ? 'Drag characters & objects into panels. Stack two items in one panel for special combos!'
                                    : 'Drag characters into panels, pick backgrounds, and press "Tell Story"!'}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {/* Controls */}
                    <div className="flex items-center gap-4">
                        <motion.button onClick={handleReset} className="p-3 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-600 transition-colors"
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Reset">
                            <RotateCcw size={20} />
                        </motion.button>
                        <motion.button onClick={handleTellStory} disabled={!canTellStory}
                            className={`flex items-center gap-3 px-8 py-3 rounded-full font-serif text-lg shadow-md transition-all ${canTellStory ? 'bg-ink text-paper hover:bg-stone-800' : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                }`}
                            whileHover={canTellStory ? { scale: 1.05 } : {}} whileTap={canTellStory ? { scale: 0.95 } : {}}>
                            {isPlaying ? <span className="animate-pulse font-sans text-sm">Playing story...</span>
                                : <><Wand2 size={20} /> Tell Story</>}
                        </motion.button>
                    </div>

                    {/* Tray */}
                    <div className="w-full max-w-4xl mt-auto pb-4">
                        <CharacterTray characters={chapter.characters} tokens={chapter.tokens}
                            placedCharacterIds={placedCharacterIds} placedTokenIds={placedTokenIds}
                            backgrounds={chapter.backgrounds}
                            panelSlots={slots.map(s => ({ index: s.index, backgroundId: s.backgroundId }))}
                            onBackgroundSelect={handleBackgroundSelect}
                        />
                    </div>
                </div>

                {/* Playback */}
                {isPlaying && currentOutcome && (
                    <StoryPlayback outcome={currentOutcome} slots={slots} panelCount={chapter.panelCount}
                        onPanelChange={setPlayingPanelIndex} onComplete={handlePlaybackComplete} />
                )}

                {/* Outcome */}
                <OutcomeOverlay outcome={currentOutcome} visible={showOutcome}
                    discoveredCount={discoveredOutcomeIds.size}
                    totalOutcomes={chapter.outcomes.filter(o => o.id !== chapter.defaultOutcomeId).length}
                    onTryAgain={handleReset} onBackToLibrary={onBack} />

                {/* Drag Overlay */}
                <DragOverlay>
                    {activeDrag && activeDrag.type === 'character' && (
                        <motion.div className="opacity-80" initial={{ scale: 1.1, rotate: 3 }}>
                            <CharacterSprite spritePrefix={(activeDrag.data as GameCharacter).spritePrefix} size={64} />
                        </motion.div>
                    )}
                    {activeDrag && activeDrag.type === 'token' && (
                        <motion.div className="text-3xl opacity-80" initial={{ scale: 1.1, rotate: -3 }}>
                            {(activeDrag.data as GameToken).icon}
                        </motion.div>
                    )}
                </DragOverlay>
            </div>
        </DndContext>
    );
};
