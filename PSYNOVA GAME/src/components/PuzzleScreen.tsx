import { useRef, useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useJigsaw } from '../hooks/useJigsaw';
import { getLevel, getStarRating } from '../data/levels';
import { playSnap } from '../data/audio';

/* ─── Layout constants ─── */
const BOARD_SIZE = 480;
const TRAY_W = BOARD_SIZE;
const TRAY_H = 200;
const GRID = 6;

/* ─── Helpers ─── */
function fmtTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

/* ─── Draggable puzzle piece ─── */
function Piece({
    piece,
    cellSize,
    onDragStart,
    onDragMove,
    onDragEnd,
    onRotate,
}: {
    piece: import('../types').PuzzlePiece;
    cellSize: number;
    onDragStart: (id: number) => void;
    onDragMove: (id: number, x: number, y: number) => void;
    onDragEnd: (id: number) => void;
    onRotate: (id: number) => void;
}) {
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });
    const parentRef = useRef<HTMLElement | null>(null);

    const getParentRect = useCallback(() => {
        if (!parentRef.current) {
            parentRef.current = document.getElementById('puzzle-area');
        }
        return parentRef.current?.getBoundingClientRect();
    }, []);

    const onPointerDown = useCallback(
        (e: React.PointerEvent) => {
            if (piece.locked) return;
            e.preventDefault();
            e.stopPropagation();
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            dragging.current = true;
            const rect = getParentRect();
            if (rect) {
                offset.current = {
                    x: e.clientX - rect.left - piece.x,
                    y: e.clientY - rect.top - piece.y,
                };
            }
            onDragStart(piece.id);
        },
        [piece.id, piece.x, piece.y, piece.locked, onDragStart, getParentRect],
    );

    const onPointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!dragging.current) return;
            const rect = getParentRect();
            if (rect) {
                const x = e.clientX - rect.left - offset.current.x;
                const y = e.clientY - rect.top - offset.current.y;
                onDragMove(piece.id, x, y);
            }
        },
        [piece.id, onDragMove, getParentRect],
    );

    const onPointerUp = useCallback(() => {
        if (!dragging.current) return;
        dragging.current = false;
        onDragEnd(piece.id);
    }, [piece.id, onDragEnd]);

    const onContextMenu = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            if (!piece.locked) onRotate(piece.id);
        },
        [piece.id, piece.locked, onRotate],
    );

    return (
        <div
            className={`puzzle-piece absolute ${piece.locked ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'}`}
            style={{
                width: cellSize,
                height: cellSize,
                left: piece.x,
                top: piece.y,
                zIndex: piece.locked ? 1 : piece.zIndex,
                transform: `rotate(${piece.rotation}deg)`,
                transition: piece.locked ? 'all 0.3s ease' : 'none',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onContextMenu={onContextMenu}
        >
            <img
                src={piece.imageData}
                alt=""
                draggable={false}
                className="w-full h-full select-none"
                style={{
                    filter: piece.locked ? 'none' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
                    borderRadius: 2,
                }}
            />
            {piece.locked && (
                <div className="absolute inset-0 border-2 border-brand-accent/40 rounded-sm pointer-events-none" />
            )}
        </div>
    );
}

/* ─── Progress ring ─── */
function ProgressRing({ progress }: { progress: number }) {
    const r = 32;
    const c = 2 * Math.PI * r;
    const offset = c - (progress / 100) * c;
    return (
        <svg width="80" height="80" className="mx-auto">
            <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
            <circle
                cx="40"
                cy="40"
                r={r}
                fill="none"
                stroke="url(#grad)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={c}
                strokeDashoffset={offset}
                transform="rotate(-90 40 40)"
                className="transition-all duration-300"
            />
            <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2dd4bf" />
                    <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
            </defs>
            <text x="40" y="44" textAnchor="middle" className="fill-white text-sm font-semibold">
                {progress}%
            </text>
        </svg>
    );
}

/* ─── Completion modal ─── */
/* ─── Completion modal ─── */
function CompletionModal({
    time,
    stars,
    onHome,
    onNext,
    onRestart,
}: {
    time: string;
    stars: number;
    onHome: () => void;
    onNext: () => void;
    onRestart: () => void;
}) {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-brand-card border border-brand-border rounded-brand-lg p-8 text-center max-w-sm mx-4 shadow-brand"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
                {/* Stars */}
                <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3].map((s) => (
                        <motion.span
                            key={s}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 + s * 0.1, type: 'spring' }}
                            className={`text-4xl ${s <= stars ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-gray-700'}`}
                        >
                            ★
                        </motion.span>
                    ))}
                </div>

                <h2 className="font-display text-2xl font-bold text-white mb-2">
                    Level Complete!
                </h2>
                <p className="text-brand-muted mb-6">
                    Time: <span className="text-brand-accent font-bold">{time}</span>
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onNext}
                        className="w-full py-3 rounded-brand bg-gradient-to-r from-brand-accent to-brand-accentAlt text-brand-bg font-bold text-lg hover:shadow-brand-glow transition-shadow"
                    >
                        Next Level →
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onHome}
                            className="flex-1 py-2 rounded-brand bg-brand-surface border border-brand-border text-brand-muted hover:text-white hover:border-brand-accent/40 transition-colors text-sm"
                        >
                            Map
                        </button>
                        <button
                            onClick={onRestart}
                            className="flex-1 py-2 rounded-brand bg-brand-surface border border-brand-border text-brand-muted hover:text-white hover:border-brand-accent/40 transition-colors text-sm"
                        >
                            Replay
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ═══════════════════════════ PUZZLE SCREEN ═══════════════════════════ */
export default function PuzzleScreen() {
    const { id } = useParams<{ id: string }>();
    const levelId = parseInt(id ?? '1', 10);
    const navigate = useNavigate();

    // Fetch level config
    const levelConfig = getLevel(levelId);

    const [soundOn, setSoundOn] = useState(true);
    const [starsEarned, setStarsEarned] = useState(0);

    const {
        pieces,
        loading,
        progress,
        completed,
        elapsedSeconds,
        cellSize,
        handleDragStart,
        handleDragMove,
        handleDragEnd,
        handleRotate,
        restart,
    } = useJigsaw({
        imageSrc: levelConfig.imageSrc,
        boardSize: BOARD_SIZE,
        trayWidth: TRAY_W,
        trayHeight: TRAY_H,
        gridSize: levelConfig.gridSize,
    });

    /* Handle Completion & Persistence */
    useEffect(() => {
        if (completed) {
            const stars = getStarRating(elapsedSeconds, levelConfig.gridSize);
            setStarsEarned(stars);

            // Save progress
            const saved = localStorage.getItem('zenSnapProgress');
            const userProgress: import('../types').UserProgress = saved
                ? JSON.parse(saved)
                : { highestLevel: 1, stars: {} };

            // Update highest level if we just finished the current highest
            if (levelId === userProgress.highestLevel) {
                userProgress.highestLevel = levelId + 1;
            }

            // Update stars if better
            const currentStars = userProgress.stars[levelId] || 0;
            if (stars > currentStars) {
                userProgress.stars[levelId] = stars;
            }

            localStorage.setItem('zenSnapProgress', JSON.stringify(userProgress));
            playSnap(); // Victory sound? We reused snap for now
        }
    }, [completed]);

    return (
        <motion.div
            className="min-h-screen flex flex-col lg:flex-row items-start justify-center gap-6 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* ───── LEFT SIDEBAR ───── */}
            <aside className="w-full lg:w-56 shrink-0 space-y-4">
                {/* Back button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-brand-muted hover:text-white transition-colors text-sm"
                >
                    <span>←</span> Map
                </button>

                {/* Level Info */}
                <div className="rounded-brand overflow-hidden border border-brand-border shadow-brand relative group">
                    <img src={levelConfig.imageSrc} alt={levelConfig.category} className="w-full aspect-square object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-3">
                        <p className="text-white font-display font-bold">Level {levelId}</p>
                        <p className="text-xs text-brand-accent uppercase tracking-wider">{levelConfig.difficultyLabel}</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="bg-brand-card/60 backdrop-blur-md rounded-brand border border-brand-border p-4">
                    <ProgressRing progress={progress} />
                </div>

                {/* Timer */}
                <div className="bg-brand-card/60 backdrop-blur-md rounded-brand border border-brand-border p-4 text-center">
                    <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">Time</p>
                    <p className="text-2xl font-display font-bold text-white tabular-nums">
                        {fmtTime(elapsedSeconds)}
                    </p>
                </div>

                {/* Controls */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setSoundOn(!soundOn)}
                        className="flex-1 py-2 rounded-brand bg-brand-surface border border-brand-border text-xs text-brand-muted hover:text-white transition-colors"
                    >
                        {soundOn ? '🔊' : '🔇'}
                    </button>
                    <button
                        onClick={restart}
                        className="flex-1 py-2 rounded-brand bg-brand-surface border border-brand-border text-xs text-brand-muted hover:text-white transition-colors"
                    >
                        🔄 Restart
                    </button>
                </div>
            </aside>

            {/* ───── PUZZLE AREA ───── */}
            <div className="flex-1 flex flex-col items-center select-none">
                {loading ? (
                    <div className="flex items-center justify-center" style={{ width: BOARD_SIZE, height: BOARD_SIZE }}>
                        <div className="w-10 h-10 border-3 border-brand-accent border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div
                        id="puzzle-area"
                        className="relative"
                        style={{ width: BOARD_SIZE, height: BOARD_SIZE + TRAY_H + 20 }}
                    >
                        {/* Board */}
                        <div
                            className="absolute top-0 left-0 bg-brand-surface/50 border border-brand-border rounded-brand-lg backdrop-blur-sm"
                            style={{ width: BOARD_SIZE, height: BOARD_SIZE }}
                        >
                            {/* Grid lines */}
                            {Array.from({ length: levelConfig.gridSize - 1 }).map((_, i) => (
                                <div key={`v-${i}`}>
                                    <div
                                        className="absolute top-0 bottom-0 border-l border-white/[0.04]"
                                        style={{ left: (i + 1) * cellSize }}
                                    />
                                    <div
                                        className="absolute left-0 right-0 border-t border-white/[0.04]"
                                        style={{ top: (i + 1) * cellSize }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Tray area */}
                        <div
                            className="absolute left-0 bg-brand-surface/30 border border-dashed border-brand-border/40 rounded-brand"
                            style={{
                                top: BOARD_SIZE + 20,
                                width: TRAY_W,
                                height: TRAY_H,
                            }}
                        />
                        <div
                            className="absolute left-0 text-[0.65rem] text-brand-muted/50 uppercase tracking-widest pointer-events-none"
                            style={{ top: BOARD_SIZE + 6 }}
                        >
                            Pieces Tray
                        </div>

                        {/* Pieces */}
                        {pieces.map((p) => (
                            <Piece
                                key={p.id}
                                piece={p}
                                cellSize={cellSize}
                                onDragStart={handleDragStart}
                                onDragMove={handleDragMove}
                                onDragEnd={handleDragEnd}
                                onRotate={handleRotate}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ───── COMPLETION MODAL ───── */}
            <AnimatePresence>
                {completed && (
                    <CompletionModal
                        time={fmtTime(elapsedSeconds)}
                        stars={starsEarned}
                        onHome={() => navigate('/')}
                        onNext={() => navigate(`/level/${levelId + 1}`)}
                        onRestart={restart}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
