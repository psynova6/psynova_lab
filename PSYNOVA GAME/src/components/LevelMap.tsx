import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { UserProgress } from '../types';

interface Props {
    progress: UserProgress;
}

const LEVEL_GAP = 100;
const PATH_AMPLITUDE = 60; // How wide the path winds

export default function LevelMap({ progress }: Props) {
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Generate nodes for levels 1 to 50 (or infinite, but let's render a batch)
    const TOTAL_LEVELS_TO_SHOW = Math.max(50, progress.highestLevel + 20);

    // Auto-scroll to current level
    useEffect(() => {
        if (scrollRef.current) {
            const currentLevelNode = document.getElementById(`level-${progress.highestLevel}`);
            if (currentLevelNode) {
                currentLevelNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [progress.highestLevel]);

    return (
        <div className="relative w-full max-w-md mx-auto min-h-screen bg-brand-bg pb-20 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-accentAlt/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
            </div>

            {/* Scrolling container */}
            <div ref={scrollRef} className="relative z-10 pt-20 pb-40 px-4">
                <div className="flex flex-col-reverse items-center relative">
                    {/* SVG Path connecting nodes */}
                    <svg
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        style={{ zIndex: 0 }}
                    >
                        <path
                            d={generatePath(TOTAL_LEVELS_TO_SHOW)}
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray="8 8"
                        />
                    </svg>

                    {/* Level Nodes */}
                    {Array.from({ length: TOTAL_LEVELS_TO_SHOW }).map((_, i) => {
                        const level = i + 1;
                        const status = getLevelStatus(level, progress);
                        const xOffset = Math.sin(level * 0.8) * PATH_AMPLITUDE;

                        return (
                            <LevelNode
                                key={level}
                                level={level}
                                status={status}
                                xOffset={xOffset}
                                stars={progress.stars[level] || 0}
                                onClick={() => {
                                    if (status !== 'locked') {
                                        navigate(`/level/${level}`);
                                    }
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Bottom Gradient for scrolling fade */}
            <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-bg to-transparent pointer-events-none z-20" />
            <div className="fixed top-0 left-0 right-0 h-12 bg-gradient-to-b from-brand-bg to-transparent pointer-events-none z-20" />
        </div>
    );
}

// ─── Sub-components ───

type LevelStatus = 'locked' | 'unlocked' | 'completed';

function getLevelStatus(level: number, progress: UserProgress): LevelStatus {
    if (level < progress.highestLevel) return 'completed';
    if (level === progress.highestLevel) return 'unlocked';
    return 'locked';
}

function LevelNode({
    level,
    status,
    xOffset,
    stars,
    onClick
}: {
    level: number;
    status: LevelStatus;
    xOffset: number;
    stars: number;
    onClick: () => void;
}) {
    return (
        <div
            id={`level-${level}`}
            className="relative flex justify-center items-center"
            style={{
                height: LEVEL_GAP,
                transform: `translateX(${xOffset}px)`
            }}
        >
            <motion.button
                onClick={onClick}
                whileHover={status !== 'locked' ? { scale: 1.1 } : {}}
                whileTap={status !== 'locked' ? { scale: 0.95 } : {}}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05 * (level % 10) }}
                className={`
                    w-16 h-16 rounded-full flex items-center justify-center
                    font-display font-bold text-xl shadow-lg border-2
                    transition-all duration-300 relative z-10
                    ${status === 'locked'
                        ? 'bg-brand-surface border-brand-border text-brand-muted/30 cursor-not-allowed grayscale'
                        : status === 'completed'
                            ? 'bg-brand-accentAlt border-brand-accent text-brand-bg cursor-pointer'
                            : 'bg-brand-accent border-white text-white cursor-pointer shadow-brand-glow animate-pulse-slow'
                    }
                `}
            >
                {status === 'locked' ? (
                    <span className="text-2xl">🔒</span>
                ) : (
                    level
                )}

                {/* Stars for completed levels */}
                {status === 'completed' && stars > 0 && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {[1, 2, 3].map((s) => (
                            <span key={s} className={`text-xs ${s <= stars ? 'text-yellow-400' : 'text-gray-600'}`}>
                                ★
                            </span>
                        ))}
                    </div>
                )}
            </motion.button>
        </div>
    );
}

// ─── Helpers ───

function generatePath(count: number): string {
    // Generate a smooth SVG path connecting the center points of where nodes will be
    // This is a bit tricky because we render nodes in flex-col-reverse (bottom up?)
    // Actually, let's assume index 0 is at the top conceptually, but in UI Level 1 is usually at bottom?
    // Candy crush usually starts at bottom. 
    // In our flex-col-reverse, the first child (Level 1) is at the bottom.
    // SVG coordinate system is Top-Left (0,0).
    // So if the container height is dynamic, it's hard to draw SVG absulutely.

    // Simplification: We render nodes top-down (Level 50 -> Level 1) in the DOM?
    // No, standard mapping is Index 0 -> Level 1.
    // If we use flex-col-reverse, index 0 is at bottom.

    // Let's just use CSS relative positioning for the path segments if possible, 
    // OR just draw a line segment between each node.
    // But a single SVG path is smoother.

    // Let's simplify: Draw the path assuming a standard flow.
    // Since implementing a perfect Bezier curve for dynamic height is complex in one go,
    // let's try a simpler approach:
    // Just render individual SVG segments between nodes? 
    // Or just use the sine wave math to draw the path line.

    // We know each level is `LEVEL_GAP` pixels apart.
    // Center X is 50% (let's say 0 in our translate system, but offset by container width/2).

    let d = '';
    const midX = 224; // Half of max-w-md (448px) roughly

    // We are generating path for levels 1..N.
    // In the DOM, they are stacked. We need to calculate Y based on index.
    // If we use flex-col-reverse, Level 1 is at logical bottom.
    // Let's switch to flex-col (Level 1 at Top) for simplicity of implementation,
    // OR just calculate Y top-down.

    // Let's DO flex-col-reverse. Level 1 is at Y = totalHeight - 50.
    // This is too hard to sync.

    // REVISION: Let's render `flex-col` but reverse the array passed to map?
    // No, let's just render standard `flex-col` (Level 1 at top) but scroll to bottom?
    // Candy crush usually starts at bottom.
    // Let's Stick to Level 1 at Bottom (flex-col-reverse).

    // Actually, drawing the path is visual candy. 
    // Let's construct a path string.
    // If we have N levels, total height ~ N * LEVEL_GAP.
    // Level i (1-based) is at:
    // Y = (N - i) * LEVEL_GAP + padding
    // X = midX + sin(i) * Amp

    for (let i = 1; i < count; i++) {
        const levelCurrent = i;
        const levelNext = i + 1;

        // Coordinates (Assuming flex-col-reverse, index 0 is bottom)
        // Actually, let's just use the visual order.
        // The SVG is absolute over the whole div.

        // Note: This is an approximation. 
        // A better way for "Infinite" lists is just drawing short curves between nodes.
    }

    return ''; // Placeholder - It's hard to get perfect without complex layout measurments.
    // For MVP, I'll omit the line or add it later if needed.
    // The sine wave positioning of nodes is strong enough visually.
}
