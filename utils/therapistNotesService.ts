import type { TherapistNote } from '../types';

const NOTES_KEY_PREFIX = 'therapist_notes_';

// Get all notes for a specific therapist-student pair
export const getNotes = (therapistId: number, studentId: number): TherapistNote[] => {
    const key = `${NOTES_KEY_PREFIX}${therapistId}_${studentId}`;
    const stored = localStorage.getItem(key);
    if (!stored) return [];

    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
};

// Add a new note
export const addNote = (therapistId: number, studentId: number, content: string): TherapistNote => {
    const notes = getNotes(therapistId, studentId);
    const newNote: TherapistNote = {
        id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        studentId,
        therapistId,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    notes.push(newNote);
    saveNotes(therapistId, studentId, notes);
    return newNote;
};

// Update an existing note
export const updateNote = (therapistId: number, studentId: number, noteId: string, content: string): TherapistNote | null => {
    const notes = getNotes(therapistId, studentId);
    const noteIndex = notes.findIndex(n => n.id === noteId);

    if (noteIndex === -1) return null;

    notes[noteIndex] = {
        ...notes[noteIndex],
        content,
        updatedAt: new Date().toISOString(),
    };

    saveNotes(therapistId, studentId, notes);
    return notes[noteIndex];
};

// Delete a note
export const deleteNote = (therapistId: number, studentId: number, noteId: string): boolean => {
    const notes = getNotes(therapistId, studentId);
    const filtered = notes.filter(n => n.id !== noteId);

    if (filtered.length === notes.length) return false; // Note not found

    saveNotes(therapistId, studentId, filtered);
    return true;
};

// Helper to save notes to localStorage
const saveNotes = (therapistId: number, studentId: number, notes: TherapistNote[]): void => {
    const key = `${NOTES_KEY_PREFIX}${therapistId}_${studentId}`;
    localStorage.setItem(key, JSON.stringify(notes));
};
