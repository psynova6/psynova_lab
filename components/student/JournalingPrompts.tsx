import React, { useState, useEffect, useRef } from 'react';
import { usePersistentState } from '../../hooks/usePersistentState';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
    </svg>
);
const LeftArrow = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);
const RightArrow = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

interface JournalEntry {
    id: string;
    text: string;
    timestamp: string;
}

const notebookCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&display=swap');

  .notebook-wrapper {
    background: radial-gradient(circle at center, #2b3940 0%, #1a2226 100%);
    box-shadow: inset 0 0 100px rgba(0,0,0,0.5);
  }

  .notebook-book-cover {
    background: #d4c2b0;
    border-radius: 4px 20px 20px 4px;
    padding: 3px 6px 3px 18px;
    box-shadow: 
      15px 20px 30px rgba(0,0,0,0.4),
      inset -2px 0 5px rgba(0,0,0,0.1),
      inset 4px 0 10px rgba(255,255,255,0.4);
    position: relative;
  }
  
  .notebook-book-cover::before {
    content: '';
    position: absolute;
    top: 0; bottom: 0; left: 16px; width: 4px;
    background: rgba(0,0,0,0.05); /* Subtle crease for the binding */
  }

  .notebook-container {
    perspective: 2500px;
    position: relative;
    width: 100%;
    height: 100%;
  }

  .notebook-paper {
    background-color: #fcfbfa; /* Extremely clean, warm off-white */
    border-radius: 0 16px 16px 0;
    box-shadow: 
      inset 12px 0 20px rgba(0,0,0,0.04), /* Binding shadow */
      inset -1px 0 3px rgba(0,0,0,0.02); /* Right edge hint */
    transform-origin: left center;
    border-right: 1px solid rgba(0,0,0,0.05);
    overflow-y: auto;
    overflow-x: hidden;
  }
  
  .notebook-content {
    min-height: 100%;
    width: 100%;
    background-image: 
      linear-gradient(90deg, transparent 68px, rgba(239, 68, 68, 0.4) 68px, rgba(239, 68, 68, 0.4) 70px, transparent 70px), /* Red Margin */
      linear-gradient(rgba(148, 163, 184, 0.35) 1px, transparent 1px); /* Blue horizontal lines */
    background-size: auto, 100% 40px;
    background-position: 0 0, 0 40px;
    background-repeat: repeat;
    position: relative;
    padding-left: 88px; 
    padding-top: 40px; 
    padding-right: 28px;
    padding-bottom: 40px;
  }

  .notebook-text-layer {
    line-height: 40px; /* Must perfectly match the background line height (40px) */
    font-size: 28px;
    font-family: 'Caveat', cursive;
    color: #1e293b;
    width: 100%;
    background: transparent;
    border: none;
    resize: none;
    outline: none;
    overflow: hidden; /* No internal scrollbar! */
    transform: translateY(-9px); /* Magic number to align 'Caveat' baseline to the ruled line */
    letter-spacing: 0.5px;
    white-space: pre-wrap;
    word-break: break-word;
    display: block;
  }
  
  /* Photorealistic Binding Rings */
  .binder-rings {
    position: absolute;
    top: 5%;
    bottom: 5%;
    left: 2px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    z-index: 50;
    pointer-events: none;
  }
  .binder-ring-hole {
    position: relative;
    width: 16px;
    height: 16px;
    background: #e4ddd1; /* Color of the cover peeking through */
    border-radius: 50%;
    box-shadow: 
      inset 3px 3px 6px rgba(0,0,0,0.6), 
      inset -1px -1px 2px rgba(255,255,255,0.8),
      0 1px 1px rgba(255,255,255,0.8);
    margin-bottom: 2px;
  }
  .binder-metal-coil {
    position: absolute;
    left: -14px;
    top: 50%;
    width: 28px;
    height: 10px;
    background: linear-gradient(to bottom, #ffffff 0%, #cbd5e1 30%, #64748b 60%, #e2e8f0 100%);
    border-radius: 6px;
    transform: translateY(-50%) rotate(-12deg);
    box-shadow: 
      2px 2px 4px rgba(0,0,0,0.4), 
      inset 0 2px 2px rgba(255,255,255,0.8),
      inset 0 -1px 2px rgba(0,0,0,0.2);
    z-index: 50;
  }

  /* Sticky Note Styling */
  .sticky-note {
    background: #fef08a;
    box-shadow: 2px 4px 10px rgba(0,0,0,0.1), inset 0 20px 20px rgba(255,255,255,0.4);
    transform: rotate(2deg);
    font-family: 'Caveat', cursive;
  }

  /* Hidden Scrollbars */
  .hide-scroll::-webkit-scrollbar { width: 6px; }
  .hide-scroll::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
  .hide-scroll::-webkit-scrollbar-track { background: transparent; }
`;

const JournalingPrompts: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [entries, setEntries] = usePersistentState<JournalEntry[]>('journalEntries', []);
    const [currentPage, setCurrentPage] = useState(0);
    const [direction, setDirection] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea logic
    const resizeTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    // Initialize today's entry on mount
    useEffect(() => {
        setEntries(prev => {
            if (prev.length === 0) {
                return [{ id: Date.now().toString(), text: '', timestamp: new Date().toISOString() }];
            }
            const today = new Date().toLocaleDateString('en-US');
            const latestEntryDate = new Date(prev[0].timestamp).toLocaleDateString('en-US');
            if (today !== latestEntryDate) {
                return [{ id: Date.now().toString(), text: '', timestamp: new Date().toISOString() }, ...prev];
            }
            return prev;
        });
    }, [setEntries]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (currentPage < 0 || currentPage >= entries.length) return;
        setEntries(prev => {
            const updated = [...prev];
            updated[currentPage] = {
                ...updated[currentPage],
                text: e.target.value
            };
            return updated;
        });
        resizeTextarea();
    };

    // Re-adjust height if page turns
    useEffect(() => {
        resizeTextarea();
    }, [currentPage, entries]);

    const goToPage = (newIndex: number) => {
        if (newIndex < 0 || newIndex >= entries.length) return;
        setDirection(newIndex > currentPage ? 1 : -1);
        setCurrentPage(newIndex);
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };
    const formatTime = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const pageVariants = {
        enter: (direction: number) => ({
            rotateY: direction > 0 ? 110 : -110,
            opacity: 0,
            boxShadow: "0px 0px 30px rgba(0,0,0,0.4)"
        }),
        center: {
            zIndex: 1,
            rotateY: 0,
            opacity: 1,
            boxShadow: "inset 12px 0 20px rgba(0,0,0,0.04), inset -1px 0 3px rgba(0,0,0,0.02)"
        },
        exit: (direction: number) => ({
            zIndex: 0,
            rotateY: direction < 0 ? 110 : -110,
            opacity: 0,
            boxShadow: "0px 0px 30px rgba(0,0,0,0.4)"
        })
    };

    return (
        <>
            <style>{notebookCSS}</style>
            <div className="relative w-full h-full min-h-[600px] flex items-center justify-center p-4 sm:p-8 overflow-hidden notebook-wrapper rounded-[2.5rem]">

                {/* Navigation Floating UI */}
                <div className="absolute top-6 left-6 right-6 flex justify-between z-50 pointer-events-none">
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={entries.length === 0 || currentPage >= entries.length - 1}
                        className="pointer-events-auto bg-white/90 backdrop-blur-sm p-3.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.2)] text-brand-dark-green disabled:opacity-0 disabled:scale-95 transition-all hover:bg-white hover:scale-105 active:scale-95 focus:outline-none"
                        aria-label="Previous Page (Older Entries)"
                        title="Older Entries"
                    >
                        <LeftArrow />
                    </button>

                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={entries.length === 0 || currentPage <= 0}
                        className="pointer-events-auto bg-white/90 backdrop-blur-sm p-3.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.2)] text-brand-dark-green disabled:opacity-0 disabled:scale-95 transition-all hover:bg-white hover:scale-105 active:scale-95 focus:outline-none"
                        aria-label="Next Page (Newer Entries)"
                        title="Newer Entries"
                    >
                        <RightArrow />
                    </button>
                </div>

                {/* The Notebook Cover (Base) */}
                <div className="notebook-book-cover w-full max-w-xl h-[500px] sm:h-[580px]">

                    {/* Static Binder Rings Overlay */}
                    <div className="binder-rings">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="binder-ring-hole">
                                <div className="binder-metal-coil" />
                            </div>
                        ))}
                    </div>

                    <div className="notebook-container">
                        {/* Animating Pages */}
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={currentPage}
                                custom={direction}
                                variants={pageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.75, type: "spring", stiffness: 90, damping: 18 }}
                                className="absolute inset-0 notebook-paper"
                                style={{ backfaceVisibility: 'hidden' }}
                            >
                                {/* Date Stamp */}
                                <div className="absolute top-4 right-8 z-20 font-[Caveat] text-[22px] font-bold text-slate-700/80 tracking-wide select-none pointer-events-none rotate-[-2deg]">
                                    {entries.length > 0 && entries[currentPage] ? (
                                        currentPage === 0 ? (
                                            `Today, ${formatTime(new Date().toISOString())}`
                                        ) : (
                                            `${formatDate(entries[currentPage].timestamp)} - ${formatTime(entries[currentPage].timestamp)}`
                                        )
                                    ) : ''}
                                </div>

                                {/* Content Area Wrapper */}
                                <div className="notebook-content">
                                    {entries.length > 0 && entries[currentPage] && (
                                        currentPage === 0 ? (
                                            <textarea
                                                ref={textareaRef}
                                                value={entries[currentPage].text}
                                                onChange={handleTextChange}
                                                placeholder="My thoughts today..."
                                                className="notebook-text-layer"
                                                autoFocus
                                            />
                                        ) : (
                                            <div className="notebook-text-layer">
                                                {entries[currentPage].text}
                                            </div>
                                        )
                                    )}
                                </div>

                                {/* Edge Page Numbering */}
                                <div className="absolute bottom-4 right-6 text-sm text-slate-400 font-[Caveat] font-bold select-none pointer-events-none">
                                    - {entries.length > 0 && entries[currentPage] ? entries.length - currentPage : 1} -
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </>
    );
};

export default JournalingPrompts;
