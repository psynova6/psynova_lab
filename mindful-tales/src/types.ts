// ============================================================
// Mindful Tales — Storyteller-style Puzzle Types (v2)
// ============================================================

export interface GameCharacter {
  id: string;
  name: string;
  /** Prefix for SVG sprite rendering */
  spritePrefix: string;
  /** Theme color for the character card */
  color: string;
  /** Short description */
  description: string;
}

/** Objects/tokens that can be placed in panels alongside characters */
export interface GameToken {
  id: string;
  name: string;
  /** Emoji or icon identifier */
  icon: string;
  color: string;
  description: string;
}

export interface PanelBackground {
  id: string;
  name: string;
  /** CSS gradient for the panel */
  gradient: string;
  /** Emoji icon for background picker */
  icon: string;
}

export interface PanelSlot {
  index: number;
  /** Primary character ID */
  characterId: string | null;
  /** Secondary/supporting character or token ID (stacking) */
  secondaryId: string | null;
  /** Whether the secondary is a token (true) or character (false) */
  secondaryIsToken: boolean;
  /** Background ID */
  backgroundId: string | null;
}

export type Expression = 'neutral' | 'happy' | 'worried';

export type OutcomeType = 'success' | 'partial' | 'failure' | 'secret';

export interface PanelNarration {
  text: string;
  expression: Expression;
  /** VFX cue */
  vfx: 'hearts' | 'question' | 'exclamation' | 'sparkle' | 'stars' | 'wisps' | 'none';
  /** Speaker name */
  speaker?: string;
}

export interface Outcome {
  id: string;
  type: OutcomeType;
  title: string;
  panelNarrations: PanelNarration[];
  goalMet: boolean;
  feedback: string;
  badge: string;
}

export interface Combination {
  /** Format: "charId+secondaryId:bgId|charId:bgId|..." */
  key: string;
  outcomeId: string;
}

export interface PuzzleChapter {
  id: string;
  title: string;
  theme: string;
  goal: string;
  /** Mindful blurb for the library card */
  blurb: string;
  panelCount: number;
  characters: GameCharacter[];
  /** Optional tokens/objects for this chapter */
  tokens: GameToken[];
  backgrounds: PanelBackground[];
  /** Whether backgrounds are locked per slot (index → bgId) */
  lockedBackgrounds?: Record<number, string>;
  combinations: Combination[];
  outcomes: Outcome[];
  defaultOutcomeId: string;
  hint: string;
  /** Whether stacking is enabled for this chapter */
  allowStacking: boolean;
}

// Progress tracking
export interface UserPuzzleProgress {
  chapterId: string;
  discoveredOutcomeIds: string[];
  solved: boolean;
  updatedAt: string;
}
