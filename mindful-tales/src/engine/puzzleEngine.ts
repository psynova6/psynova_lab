// ============================================================
// puzzleEngine.ts — Evaluates panel combinations → outcomes (v2: stacking)
// ============================================================
import type { PanelSlot, PuzzleChapter, Outcome } from '../types';

/**
 * Build a combination key from panel slots.
 * Format with stacking: "charId+secondaryId:bgId|charId:bgId|..."
 */
export function buildCombinationKey(slots: PanelSlot[]): string {
    return slots
        .sort((a, b) => a.index - b.index)
        .map(s => {
            const primary = s.characterId || '_';
            const secondary = s.secondaryId ? `+${s.secondaryId}` : '';
            const bg = s.backgroundId || '_';
            return `${primary}${secondary}:${bg}`;
        })
        .join('|');
}

/**
 * Evaluate the current panel arrangement against a chapter's combinations.
 */
export function evaluatePanels(
    slots: PanelSlot[],
    chapter: PuzzleChapter
): Outcome {
    const key = buildCombinationKey(slots);

    // Exact match
    const combo = chapter.combinations.find(c => c.key === key);
    if (combo) {
        const outcome = chapter.outcomes.find(o => o.id === combo.outcomeId);
        if (outcome) return outcome;
    }

    // Partial match: ignore secondaries (check primary char + bg only)
    const primaryKey = slots
        .sort((a, b) => a.index - b.index)
        .map(s => `${s.characterId || '_'}:${s.backgroundId || '_'}`)
        .join('|');

    for (const c of chapter.combinations) {
        const comboPrimaryKey = c.key
            .split('|')
            .map(pair => {
                const [charPart, bg] = pair.split(':');
                const primary = charPart.split('+')[0];
                return `${primary}:${bg}`;
            })
            .join('|');
        if (comboPrimaryKey === primaryKey) {
            const outcome = chapter.outcomes.find(o => o.id === c.outcomeId);
            if (outcome) return outcome;
        }
    }

    // Character-only match (ignore backgrounds)
    const charOnlyKey = slots
        .sort((a, b) => a.index - b.index)
        .map(s => s.characterId || '_')
        .join('|');

    for (const c of chapter.combinations) {
        const comboCharKey = c.key
            .split('|')
            .map(pair => pair.split(':')[0].split('+')[0])
            .join('|');
        if (comboCharKey === charOnlyKey) {
            const outcome = chapter.outcomes.find(o => o.id === c.outcomeId);
            if (outcome) return outcome;
        }
    }

    // Default outcome
    return (
        chapter.outcomes.find(o => o.id === chapter.defaultOutcomeId) || {
            id: 'default',
            type: 'failure',
            title: 'Try Again',
            panelNarrations: slots.map(() => ({
                text: 'The story feels incomplete...',
                expression: 'neutral' as const,
                vfx: 'question' as const,
            })),
            goalMet: false,
            feedback: chapter.hint,
            badge: '❓',
        }
    );
}

export function hasAnyCharacter(slots: PanelSlot[]): boolean {
    return slots.some(s => s.characterId !== null);
}
