import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LevelMap from './LevelMap';
import type { UserProgress } from '../types';

export default function HomeScreen() {
    // Load progress from localStorage or default to Level 1
    const [progress, setProgress] = useState<UserProgress>(() => {
        const saved = localStorage.getItem('zenSnapProgress');
        return saved ? JSON.parse(saved) : { highestLevel: 1, stars: {} };
    });

    return (
        <motion.div
            className="min-h-screen bg-brand-bg relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <LevelMap progress={progress} />
        </motion.div>
    );
}
