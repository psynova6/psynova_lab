import React, { useState, useEffect } from 'react';
import { getNotes, addNote, updateNote, deleteNote } from '../../utils/therapistNotesService';
import type { TherapistNote } from '../../types';

interface TherapistNotesPanelProps {
    therapistId: number;
    studentId: number;
    studentName: string;
}

const TherapistNotesPanel: React.FC<TherapistNotesPanelProps> = ({ therapistId, studentId, studentName }) => {
    const [notes, setNotes] = useState<TherapistNote[]>([]);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');

    useEffect(() => {
        loadNotes();
    }, [therapistId, studentId]);

    const loadNotes = () => {
        const loadedNotes = getNotes(therapistId, studentId);
        setNotes(loadedNotes);
    };

    const handleAddNote = () => {
        if (!newNoteContent.trim()) return;

        addNote(therapistId, studentId, newNoteContent);
        setNewNoteContent('');
        loadNotes();
    };

    const handleStartEdit = (note: TherapistNote) => {
        setEditingNoteId(note.id);
        setEditContent(note.content);
    };

    const handleSaveEdit = (noteId: string) => {
        if (!editContent.trim()) return;

        updateNote(therapistId, studentId, noteId, editContent);
        setEditingNoteId(null);
        setEditContent('');
        loadNotes();
    };

    const handleCancelEdit = () => {
        setEditingNoteId(null);
        setEditContent('');
    };

    const handleDeleteNote = (noteId: string) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            deleteNote(therapistId, studentId, noteId);
            loadNotes();
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-brand-dark-green">Notes for {studentName}</h3>
                <span className="text-sm text-brand-dark-green/70">{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Add new note */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 shadow-md">
                <textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Write a new note..."
                    className="w-full bg-transparent border-none outline-none resize-none text-brand-dark-green placeholder-brand-dark-green/40 font-handwriting text-base md:text-sm"
                    rows={4}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="sentences"
                    spellCheck="true"
                />
                <div className="flex justify-end mt-2">
                    <button
                        onClick={handleAddNote}
                        disabled={!newNoteContent.trim()}
                        className="bg-brand-dark-green text-white font-semibold py-2 px-6 rounded-full hover:bg-brand-light-green hover:text-brand-dark-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                    >
                        Add Note
                    </button>
                </div>
            </div>

            {/* Notes grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map(note => (
                    <div key={note.id} className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow relative group">
                        {editingNoteId === note.id ? (
                            <>
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full bg-transparent border-none outline-none resize-none text-brand-dark-green mb-3"
                                    rows={4}
                                    autoFocus
                                />
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => handleSaveEdit(note.id)}
                                        className="text-xs bg-brand-dark-green text-white font-semibold py-1 px-3 rounded-full hover:bg-brand-light-green hover:text-brand-dark-green transition-colors"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="text-xs bg-gray-400 text-white font-semibold py-1 px-3 rounded-full hover:bg-gray-500 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="text-brand-dark-green whitespace-pre-wrap mb-3 min-h-[4rem]">{note.content}</p>
                                <div className="flex items-center justify-between text-xs text-brand-dark-green/60 border-t border-yellow-200 pt-2">
                                    <span>{formatDate(note.createdAt)}</span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleStartEdit(note)}
                                            className="text-brand-dark-green hover:underline font-semibold"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteNote(note.id)}
                                            className="text-red-600 hover:underline font-semibold"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {notes.length === 0 && (
                <div className="text-center py-12 text-brand-dark-green/70">
                    <p>No notes yet. Add your first note above!</p>
                </div>
            )}
        </div>
    );
};

export default TherapistNotesPanel;
