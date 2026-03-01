import { useState, useRef, useCallback, useEffect } from 'react';
import type { PuzzlePiece } from '../types';
import { playSnap } from '../data/audio';

/* ─── Constants ─── */
// GRID is now dynamic
const SNAP_THRESHOLD = 32; // px tolerance for snapping

/* ─── Hook ─── */
export interface UseJigsawConfig {
    imageSrc: string;
    boardSize: number; // px (width & height of the square board)
    trayWidth: number; // px width of the tray area below / right of the board
    trayHeight: number;
    gridSize: number;
}

export interface UseJigsawReturn {
    pieces: PuzzlePiece[];
    loading: boolean;
    progress: number;           // 0 – 100
    completed: boolean;
    elapsedSeconds: number;
    cellSize: number;
    handleDragStart: (id: number) => void;
    handleDragMove: (id: number, x: number, y: number) => void;
    handleDragEnd: (id: number) => void;
    handleRotate: (id: number) => void;
    restart: () => void;
}

export function useJigsaw({
    imageSrc,
    boardSize,
    trayWidth,
    trayHeight,
    gridSize,
}: UseJigsawConfig): UseJigsawReturn {
    const TOTAL = gridSize * gridSize;
    const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
    const [loading, setLoading] = useState(true);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const hasInteracted = useRef(false);
    const zCounter = useRef(TOTAL + 1);
    const cellSize = boardSize / gridSize;

    /* ─── Slice image into tiles ─── */
    const sliceImage = useCallback(
        async (src: string): Promise<string[]> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    const tiles: string[] = [];
                    const sw = img.naturalWidth / gridSize;
                    const sh = img.naturalHeight / gridSize;
                    for (let r = 0; r < gridSize; r++) {
                        for (let c = 0; c < gridSize; c++) {
                            const canvas = document.createElement('canvas');
                            canvas.width = cellSize;
                            canvas.height = cellSize;
                            const ctx = canvas.getContext('2d')!;
                            ctx.drawImage(img, c * sw, r * sh, sw, sh, 0, 0, cellSize, cellSize);
                            tiles.push(canvas.toDataURL('image/webp', 0.85));
                        }
                    }
                    resolve(tiles);
                };
                img.onerror = reject;
                img.src = src;
            });
        },
        [cellSize, gridSize],
    );

    /* ─── Shuffle pieces into the tray area ─── */
    const shufflePieces = useCallback(
        (tiles: string[]): PuzzlePiece[] => {
            const trayTop = boardSize + 20; // below the board
            return tiles.map((dataUrl, i) => {
                const row = Math.floor(i / gridSize);
                const col = i % gridSize;
                return {
                    id: i,
                    correctRow: row,
                    correctCol: col,
                    x: Math.random() * (trayWidth - cellSize),
                    y: trayTop + Math.random() * (trayHeight - cellSize - 20),
                    rotation: [0, 90, 180, 270][Math.floor(Math.random() * 4)],
                    locked: false,
                    imageData: dataUrl,
                    zIndex: i,
                };
            });
        },
        [boardSize, cellSize, trayWidth, trayHeight, gridSize],
    );

    /* ─── Init / Restart ─── */
    const init = useCallback(async () => {
        setLoading(true);
        setElapsedSeconds(0);
        hasInteracted.current = false;
        zCounter.current = TOTAL + 1;
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;

        try {
            const tiles = await sliceImage(imageSrc);
            setPieces(shufflePieces(tiles));
        } catch (e) {
            console.error('Failed to slice image', e);
        }
        setLoading(false);
    }, [imageSrc, sliceImage, shufflePieces, TOTAL]);

    useEffect(() => {
        init();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [init]);

    /* ─── Timer ─── */
    const startTimerIfNeeded = useCallback(() => {
        if (!hasInteracted.current) {
            hasInteracted.current = true;
            timerRef.current = setInterval(() => {
                setElapsedSeconds((s) => s + 1);
            }, 1000);
        }
    }, []);

    /* ─── Drag handlers ─── */
    const handleDragStart = useCallback(
        (id: number) => {
            startTimerIfNeeded();
            setPieces((prev) =>
                prev.map((p) =>
                    p.id === id ? { ...p, zIndex: zCounter.current++ } : p,
                ),
            );
        },
        [startTimerIfNeeded],
    );

    const handleDragMove = useCallback((id: number, x: number, y: number) => {
        setPieces((prev) =>
            prev.map((p) => (p.id === id && !p.locked ? { ...p, x, y } : p)),
        );
    }, []);

    const handleDragEnd = useCallback(
        (id: number) => {
            setPieces((prev) =>
                prev.map((p) => {
                    if (p.id !== id || p.locked) return p;
                    const targetX = p.correctCol * cellSize;
                    const targetY = p.correctRow * cellSize;
                    const dx = Math.abs(p.x - targetX);
                    const dy = Math.abs(p.y - targetY);
                    if (dx < SNAP_THRESHOLD && dy < SNAP_THRESHOLD && p.rotation === 0) {
                        playSnap();
                        return { ...p, x: targetX, y: targetY, locked: true };
                    }
                    return p;
                }),
            );
        },
        [cellSize],
    );

    /* ─── Rotate ─── */
    const handleRotate = useCallback((id: number) => {
        setPieces((prev) =>
            prev.map((p) =>
                p.id === id && !p.locked
                    ? { ...p, rotation: (p.rotation + 90) % 360 }
                    : p,
            ),
        );
    }, []);

    /* ─── Derived state ─── */
    const lockedCount = pieces.filter((p) => p.locked).length;
    const progress = TOTAL > 0 ? Math.round((lockedCount / TOTAL) * 100) : 0;
    const completed = lockedCount === TOTAL && TOTAL > 0;

    /* Stop timer on completion */
    useEffect(() => {
        if (completed && timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, [completed]);

    return {
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
        restart: init,
    };
}
