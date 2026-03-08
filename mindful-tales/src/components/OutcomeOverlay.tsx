// OutcomeOverlay.tsx — Slide-up result display after story playback
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Outcome } from '../types';

interface OutcomeOverlayProps {
    outcome: Outcome | null;
    visible: boolean;
    discoveredCount: number;
    totalOutcomes: number;
    onTryAgain: () => void;
    onBackToLibrary: () => void;
}

export const OutcomeOverlay: React.FC<OutcomeOverlayProps> = ({
    outcome,
    visible,
    discoveredCount,
    totalOutcomes,
    onTryAgain,
    onBackToLibrary,
}) => {
    if (!outcome) return null;

    const typeColors: Record<string, string> = {
        success: 'from-emerald-500/20 to-emerald-600/10',
        partial: 'from-amber-500/20 to-amber-600/10',
        failure: 'from-red-500/20 to-red-600/10',
        secret: 'from-purple-500/20 to-purple-600/10',
    };

    const typeLabels: Record<string, string> = {
        success: 'SUCCESS',
        partial: 'PARTIAL',
        failure: 'FAILURE',
        secret: 'SECRET',
    };

    const typeBorderColors: Record<string, string> = {
        success: 'border-emerald-300',
        partial: 'border-amber-300',
        failure: 'border-red-300',
        secret: 'border-purple-300',
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 pointer-events-none"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <div
                        className={`
              pointer-events-auto max-w-lg w-full
              bg-paper/95 backdrop-blur-md rounded-2xl p-6
              border-2 ${typeBorderColors[outcome.type] || 'border-stone-300'}
              shadow-2xl
            `}
                    >
                        {/* Badge & Title */}
                        <div className="text-center mb-4">
                            <motion.div
                                className="text-4xl mb-2"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                {outcome.badge}
                            </motion.div>
                            <h3 className="font-serif text-2xl text-ink font-semibold">
                                {outcome.title}
                            </h3>
                            <span className={`
                inline-block mt-1 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full
                bg-gradient-to-r ${typeColors[outcome.type]}
              `}>
                                {typeLabels[outcome.type] || outcome.type}
                            </span>
                        </div>

                        {/* Feedback */}
                        <p className="font-serif text-sm text-stone-600 text-center mb-4 leading-relaxed">
                            {outcome.feedback}
                        </p>

                        {/* Goal Status */}
                        <div className={`
              text-center py-2 px-4 rounded-lg mb-4
              ${outcome.goalMet
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }
            `}>
                            <span className="text-sm font-bold">
                                {outcome.goalMet ? '✅ Goal Achieved!' : '🔄 Goal Not Met — Try a different arrangement!'}
                            </span>
                        </div>

                        {/* Progress */}
                        <div className="text-center text-xs text-stone-400 mb-4">
                            Endings discovered: {discoveredCount} / {totalOutcomes}
                            <div className="mt-1 w-full bg-stone-100 rounded-full h-1.5">
                                <div
                                    className="h-full bg-sage rounded-full transition-all duration-500"
                                    style={{ width: `${(discoveredCount / totalOutcomes) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={onTryAgain}
                                className="px-6 py-2.5 bg-ink text-paper rounded-full font-sans text-sm font-bold hover:bg-stone-800 transition-all hover:scale-105 active:scale-95"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={onBackToLibrary}
                                className="px-6 py-2.5 bg-stone-200 text-stone-700 rounded-full font-sans text-sm font-bold hover:bg-stone-300 transition-all hover:scale-105 active:scale-95"
                            >
                                Library
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
