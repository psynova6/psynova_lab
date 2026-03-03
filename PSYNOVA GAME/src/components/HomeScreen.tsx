import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LevelMap from './LevelMap';
import RulesModal from './RulesModal';
import type { UserProgress } from '../types';

export default function HomeScreen() {
    // Load progress from localStorage or default to Level 1
    const [progress, setProgress] = useState<UserProgress>(() => {
        const saved = localStorage.getItem('zenSnapProgress');
        return saved ? JSON.parse(saved) : { highestLevel: 1, stars: {} };
    });

    // Show rules on first visit or if user hasn't dismissed them yet this session
    const [showRules, setShowRules] = useState(() => {
        return !sessionStorage.getItem('zenSnapRulesSeen');
    });

    const handleDismissRules = () => {
        sessionStorage.setItem('zenSnapRulesSeen', 'true');
        setShowRules(false);
    };

    return (
        <motion.div
            className="min-h-screen bg-brand-bg relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <LevelMap progress={progress} onShowRules={() => setShowRules(true)} />

            {/* Rules Modal */}
            <AnimatePresence>
                {showRules && (
                    <RulesModal
                        onStart={handleDismissRules}
                        buttonLabel="Let's Go! 🚀"
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
