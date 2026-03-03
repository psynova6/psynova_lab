// sharedData.ts — Character, Background, and Token definitions used across all chapters
import type { GameCharacter, PanelBackground, GameToken } from '../types';

export const C: Record<string, GameCharacter> = {
    elias: { id: 'elias', name: 'Elias', spritePrefix: 'elias', color: '#5b7b6f', description: 'A gentle soul seeking peace' },
    mina: { id: 'mina', name: 'Mina', spritePrefix: 'mina', color: '#6b8cae', description: 'A kind-hearted girl with wisdom' },
    maya: { id: 'maya', name: 'Maya', spritePrefix: 'maya', color: '#7ba05b', description: 'An optimist with a green thumb' },
    professor: { id: 'professor', name: 'Professor', spritePrefix: 'professor', color: '#8b6f5e', description: 'A wise scholar' },
    dracula: { id: 'dracula', name: 'Dracula', spritePrefix: 'dracula', color: '#7b3f5e', description: 'A misunderstood loner' },
    night: { id: 'night', name: 'Night', spritePrefix: 'night', color: '#3f4a7b', description: 'The personified night sky' },
    sam: { id: 'sam', name: 'Sam', spritePrefix: 'sam', color: '#ae6b3f', description: 'A scrappy adventurer kid' },
    rowan: { id: 'rowan', name: 'Rowan', spritePrefix: 'rowan', color: '#6b8b6b', description: 'A shy artist who paints feelings' },
    noor: { id: 'noor', name: 'Noor', spritePrefix: 'noor', color: '#c09040', description: 'A curious explorer of the world' },
    asha: { id: 'asha', name: 'Asha', spritePrefix: 'asha', color: '#8b6bb0', description: 'A calm mentor and guide' },
    leo: { id: 'leo', name: 'Leo', spritePrefix: 'leo', color: '#5078a0', description: 'An anxious student' },
    kiran: { id: 'kiran', name: 'Kiran', spritePrefix: 'kiran', color: '#d4a030', description: 'A jokester who hides pain' },
    luna: { id: 'luna', name: 'Luna', spritePrefix: 'luna', color: '#4a4a7e', description: 'A dreamy stargazer' },
    iris: { id: 'iris', name: 'Iris', spritePrefix: 'iris', color: '#8b6b9b', description: 'A bookworm who lives in stories' },
    theo: { id: 'theo', name: 'Theo', spritePrefix: 'theo', color: '#5e7b5e', description: 'A protective older sibling' },
};

export const B: Record<string, PanelBackground> = {
    castle: { id: 'castle', name: 'Castle', gradient: 'linear-gradient(135deg, #8d99ae 0%, #5c677d 50%, #4a4e69 100%)', icon: '🏰' },
    crypt: { id: 'crypt', name: 'Crypt', gradient: 'linear-gradient(135deg, #4a4e69 0%, #2b2d42 50%, #1a1a2e 100%)', icon: '⚰️' },
    house: { id: 'house', name: 'Cozy House', gradient: 'linear-gradient(135deg, #f0d9b5 0%, #dbb78f 50%, #c49a6c 100%)', icon: '🏠' },
    garden: { id: 'garden', name: 'Garden', gradient: 'linear-gradient(135deg, #c8e6c9 0%, #81c784 50%, #66bb6a 100%)', icon: '🌿' },
    bridge: { id: 'bridge', name: 'Bridge', gradient: 'linear-gradient(135deg, #b0c4de 0%, #87a5c4 50%, #6b8db0 100%)', icon: '🌉' },
    study: { id: 'study', name: 'Study', gradient: 'linear-gradient(135deg, #d4a574 0%, #b8834a 50%, #8b6538 100%)', icon: '📚' },
    forest: { id: 'forest', name: 'Forest', gradient: 'linear-gradient(135deg, #a8d5a2 0%, #6b9b6b 50%, #3e6b3e 100%)', icon: '🌲' },
    lake: { id: 'lake', name: 'Moonlit Lake', gradient: 'linear-gradient(135deg, #4a6fa5 0%, #2d4a7a 50%, #1a2f5a 100%)', icon: '🌙' },
    classroom: { id: 'classroom', name: 'Classroom', gradient: 'linear-gradient(135deg, #e8dcc8 0%, #d4c4a8 50%, #c0a880 100%)', icon: '🏫' },
    hallway: { id: 'hallway', name: 'Hallway', gradient: 'linear-gradient(135deg, #c4b8a8 0%, #a89880 50%, #8c7860 100%)', icon: '🚪' },
    nightSky: { id: 'nightSky', name: 'Night Sky', gradient: 'linear-gradient(135deg, #1a1a3e 0%, #0d0d2b 50%, #050518 100%)', icon: '🌟' },
    meadow: { id: 'meadow', name: 'Meadow', gradient: 'linear-gradient(135deg, #e8f5a0 0%, #c8e680 50%, #a8d760 100%)', icon: '🌻' },
    cliff: { id: 'cliff', name: 'Clifftop', gradient: 'linear-gradient(135deg, #a0b0c0 0%, #78909c 50%, #546e7a 100%)', icon: '⛰️' },
    mirror: { id: 'mirror', name: 'Mirror Room', gradient: 'linear-gradient(135deg, #d4d4e8 0%, #b8b8d0 50%, #9898b8 100%)', icon: '🪞' },
};

export const T: Record<string, GameToken> = {
    lantern: { id: 'lantern', name: 'Lantern', icon: '🏮', color: '#e8a040', description: 'A light in the dark' },
    compass: { id: 'compass', name: 'Compass', icon: '🧭', color: '#a08060', description: 'Finds the way' },
    letter: { id: 'letter', name: 'Letter', icon: '✉️', color: '#c0a080', description: 'Words unsaid' },
    book: { id: 'book', name: 'Journal', icon: '📖', color: '#8b6f4e', description: 'A place for thoughts' },
    flower: { id: 'flower', name: 'Flower', icon: '🌸', color: '#e88ba0', description: 'A token of care' },
    star: { id: 'star', name: 'Star', icon: '⭐', color: '#ffe066', description: 'Hope and wonder' },
    phone: { id: 'phone', name: 'Phone', icon: '📱', color: '#6090b0', description: 'Connection or distraction' },
    blanket: { id: 'blanket', name: 'Blanket', icon: '🧣', color: '#c0a0c0', description: 'Comfort and safety' },
};

// Narration helper
export type NarrationDef = { text: string; expression: 'neutral' | 'happy' | 'worried'; vfx: 'hearts' | 'question' | 'exclamation' | 'sparkle' | 'stars' | 'wisps' | 'none'; speaker?: string };
export const n = (text: string, expression: NarrationDef['expression'], vfx: NarrationDef['vfx'], speaker?: string): NarrationDef => ({ text, expression, vfx, speaker });
