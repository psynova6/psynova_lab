/* ─── Puzzle piece state ─── */
export interface PuzzlePiece {
    id: number;
    /** Correct grid position (0-based) */
    correctRow: number;
    correctCol: number;
    /** Current pixel position (in the combined board+tray coordinate space) */
    x: number;
    y: number;
    /** Rotation in degrees: 0, 90, 180, or 270 */
    rotation: number;
    /** Whether the piece has been snapped into its correct position */
    locked: boolean;
    /** Data-URL of the sliced tile image */
    imageData: string;
    /** z-index for layering while dragging */
    zIndex: number;
}

/* ─── Level System ─── */
export type Category = 'Nature' | 'Animals' | 'Travel' | 'Art' | 'Food' | 'Architecture';

export interface LevelConfig {
    id: number;          // 1, 2, 3...
    gridSize: number;    // 3, 4, 5, 6...
    category: Category;
    imageSrc: string;
    difficultyLabel: string;
}

export interface UserProgress {
    highestLevel: number;      // 1-based, default 1
    stars: Record<number, number>; // levelId -> 1..3
}

/* ─── Persisted puzzle session ─── */
export interface PuzzleSession {
    levelId: number;
    pieces: Array<{
        id: number;
        x: number;
        y: number;
        rotation: number;
        locked: boolean;
        zIndex: number;
    }>;
    elapsedSeconds: number;
}
