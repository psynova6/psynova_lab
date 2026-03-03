// StoryPlayback.tsx — Sequential in-panel animated story playback
import React, { useState, useEffect, useCallback } from 'react';
import type { Outcome, PanelSlot } from '../types';

interface StoryPlaybackProps {
    outcome: Outcome;
    slots: PanelSlot[];
    panelCount: number;
    /** Called with the currently active panel index (-1 when done) */
    onPanelChange: (index: number) => void;
    /** Called when playback completes */
    onComplete: () => void;
}

const PANEL_HOLD_MS = 2500; // How long each panel plays
const TRANSITION_MS = 300;  // Transition between panels

export const StoryPlayback: React.FC<StoryPlaybackProps> = ({
    outcome,
    panelCount,
    onPanelChange,
    onComplete,
}) => {
    const [currentPanel, setCurrentPanel] = useState(-1);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const playNextPanel = useCallback(() => {
        setCurrentPanel(prev => {
            const next = prev + 1;
            if (next >= panelCount) {
                // Playback complete
                onPanelChange(-1);
                setTimeout(onComplete, TRANSITION_MS);
                return prev;
            }
            onPanelChange(next);
            return next;
        });
    }, [panelCount, onPanelChange, onComplete]);

    // Start playback
    useEffect(() => {
        const startTimer = setTimeout(() => {
            playNextPanel();
        }, 300);
        return () => clearTimeout(startTimer);
    }, []);

    // Auto-advance panels
    useEffect(() => {
        if (currentPanel < 0 || currentPanel >= panelCount) return;

        const holdTimer = setTimeout(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setIsTransitioning(false);
                playNextPanel();
            }, TRANSITION_MS);
        }, PANEL_HOLD_MS);

        return () => clearTimeout(holdTimer);
    }, [currentPanel, panelCount, playNextPanel]);

    // This component is invisible — it just drives timing
    // The visual output happens in PanelFrame via isPlaying prop
    return null;
};
