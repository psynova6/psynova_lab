import { motion } from 'framer-motion';

const RULES = [
    { icon: '🧩', title: 'Drag & Drop', desc: 'Drag pieces from the tray onto the board.' },
    { icon: '🔄', title: 'Rotate', desc: 'Tap a piece, then hit the rotate button to turn it.' },
    { icon: '✨', title: 'Snap', desc: 'Pieces snap into place when positioned correctly & rotated to 0°.' },
    { icon: '⏱️', title: 'Beat the Clock', desc: 'Finish faster for more stars!' },
];

interface Props {
    onStart: () => void;
    buttonLabel?: string;
}

export default function RulesModal({ onStart, buttonLabel = 'Start Puzzle 🚀' }: Props) {
    return (
        <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-brand-card border border-brand-border rounded-brand-lg p-8 max-w-md mx-4 shadow-brand text-center"
                initial={{ scale: 0.85, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -20 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
                {/* Header */}
                <motion.div
                    className="text-5xl mb-3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                >
                    🧩
                </motion.div>
                <motion.h2
                    className="font-display text-3xl font-bold text-white mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    How to Play
                </motion.h2>
                <p className="text-brand-muted text-sm mb-6">Master the jigsaw in 4 simple steps</p>

                {/* Rules Grid */}
                <div className="grid grid-cols-1 gap-3 mb-8">
                    {RULES.map((rule, i) => (
                        <motion.div
                            key={rule.title}
                            className="flex items-start gap-3 bg-brand-surface/60 border border-brand-border/50 rounded-brand p-3 text-left"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.08 }}
                        >
                            <span className="text-2xl shrink-0 mt-0.5">{rule.icon}</span>
                            <div>
                                <p className="text-white font-semibold text-sm">{rule.title}</p>
                                <p className="text-brand-muted text-xs leading-relaxed">{rule.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Start Button */}
                <motion.button
                    onClick={onStart}
                    className="w-full py-3.5 rounded-brand bg-gradient-to-r from-brand-accent to-brand-accentAlt text-brand-bg font-bold text-lg hover:shadow-brand-glow transition-shadow active:scale-95"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                >
                    {buttonLabel}
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
