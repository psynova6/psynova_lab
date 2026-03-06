/**
 * Centralised audio paths – edit this file to change sound assets
 * without touching any component code.
 */

export const SOUNDS = {
    /** Played when a piece snaps into place */
    snap: '/sounds/snap.mp3',
} as const;

/** Preload audio so it plays instantly on first snap */
let snapAudio: HTMLAudioElement | null = null;

export function playSnap(): void {
    try {
        if (!snapAudio) {
            snapAudio = new Audio(SOUNDS.snap);
            snapAudio.volume = 0.5;
        }
        snapAudio.currentTime = 0;
        snapAudio.play().catch(() => {
            /* User hasn't interacted yet – swallow error silently */
        });
    } catch {
        /* Audio not supported */
    }
}
