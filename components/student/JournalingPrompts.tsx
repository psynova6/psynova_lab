import React, { useState, useEffect, useRef } from 'react';
import { usePersistentState } from '../../hooks/usePersistentState';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../layout/Logo';

// Icons
const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 sm:w-24 sm:h-24 opacity-20">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

// Max lines per page before user can flip to a new page
const LINES_PER_PAGE = 20;
const LINE_HEIGHT_PX = 36;
const MAX_TEXT_HEIGHT_PX = LINES_PER_PAGE * LINE_HEIGHT_PX; // 720px

interface JournalEntry {
  id: string;
  title: string;
  text: string;
  timestamp: string;
  // continuation pages share the same logical 'day'. parentId links them.
  parentId?: string;
}

const notebookCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Caveat:wght@400..700&display=swap');

  /* Global Wrapper: Vignette Background */
  .notebook-fullscreen {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100dvh;
    background: radial-gradient(circle at center, #ffffff 40%, #c4d6ee 100%);
    box-shadow: inset 0 0 150px rgba(118, 153, 206, 0.4);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 2rem 0;
  }

  /* Two-Page Spread Layout */
  .spread-container {
    display: flex;
    width: 95%;
    max-width: 1200px;
    height: 85vh;
    min-height: 850px;
    margin: auto; /* centers vertically inside flex parent if viewport is taller than min-height */
    box-shadow: 
      0 20px 50px rgba(0,0,0,0.15),
      0 5px 15px rgba(0,0,0,0.05);
    background: transparent; /* Base transparency for glassmorphism */
    border-radius: 8px;
    perspective: 2000px; /* Enhanced 3D perspective for flips */
    position: relative;
  }

  /* Left & Right Pages */
  .page-side {
    flex: 1;
    position: relative;
    height: 100%;
  }

  .left-page {
    border-radius: 8px 0 0 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    z-index: 10;
    gap: 1.5rem;
    /* Premium Glassmorphism Refined */
    background: rgba(255, 255, 255, 0.02) !important;
    backdrop-filter: blur(40px) saturate(200%);
    -webkit-backdrop-filter: blur(40px) saturate(200%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-right: none;
  }

  .cover-logo {
    width: 95%;
    max-width: 550px;
    height: auto;
    max-height: 80%;
    object-fit: contain;
    opacity: 1;
    filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
  }
  
  .right-page-container {
    flex: 1;
    position: relative;
    perspective: 2000px;
  }

  .right-page {
    position: absolute;
    inset: 0;
    border-radius: 0 8px 8px 0;
    box-shadow: inset 20px 0 30px rgba(0,0,0,0.02);
    display: flex;
    flex-direction: column;
    padding: 2.5rem 3rem 1.5rem 4rem;
    background-color: #f2f2eb;
    transform-origin: left center;
    backface-visibility: hidden;
    /* Critical: clip content to the page bounds */
    overflow: hidden;
  }

  /* Mirrored Decorative Content */
  .mirrored-container {
    transform: scaleX(-1);
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #a39e93;
    font-family: 'Playfair Display', serif;
    opacity: 0.6;
    text-align: center;
  }

  .journal-bg-text {
    font-size: 5rem;
    font-weight: 700;
    letter-spacing: -2px;
    margin-top: 1rem;
    color: #d8d3c7;
    text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
  }

  .quote-text {
    font-size: 1.1rem;
    font-style: italic;
    max-width: 280px;
    margin-top: 1.5rem;
    line-height: 1.6;
    color: #b5b0a3;
  }

  .open-book-btn {
    margin-top: 4rem;
    transform: scaleX(-1); /* Un-mirror the button relative to container */
    background: #e6e3d8;
    color: #2b4522;
    padding: 10px 30px;
    border-radius: 30px;
    font-family: 'Lora', serif;
    font-size: 1.1rem;
    font-weight: 500;
    box-shadow: 
      inset 2px 2px 5px rgba(255,255,255,0.8),
      inset -2px -2px 5px rgba(0,0,0,0.05),
      2px 4px 10px rgba(0,0,0,0.05);
    transition: all 0.2s ease;
  }
  
  .open-book-btn:hover {
    background: #dfdbce;
    box-shadow: 
      inset 2px 2px 5px rgba(255,255,255,0.8),
      inset -2px -2px 5px rgba(0,0,0,0.05),
      1px 2px 5px rgba(0,0,0,0.05);
  }

  /* The Spine and Binder Rings */
  .animate-bounce-in {
    animation: bounceIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  }

  /* --- Responsive Design Overrides --- */
  @media (max-width: 1024px) {
    .spread-container {
      width: 95%;
    }
    .left-page {
      padding: 2rem;
    }
    .right-page {
      padding: 2rem 2rem 1.5rem 3rem;
    }
  }

  @media (max-width: 768px) {
    .spread-container {
      width: 95%;
      height: 90vh;
      min-height: 880px;
      flex-direction: column;
    }
    
    /* Hide the left cover page and spine on mobile to maximize writing area */
    .left-page {
      display: none !important;
    }
    
    .spine-container {
      display: none !important;
    }
    
    .right-page-container {
      width: 100%;
      height: 100%;
    }
    
    .right-page {
      border-radius: 16px; /* Round all corners since it's a standalone page now */
      padding: 4rem 1.5rem 1.5rem 1.5rem; /* Extra top padding for the back button */
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    
    .journal-bg-text {
      font-size: 3rem;
    }

    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .time-text {
      align-self: flex-start;
    }

    .title-input {
      font-size: 1.5rem;
    }
  }

  @media (max-height: 600px) {
    /* Prevent the notebook from looking too massive on landscape mobile */
    .spread-container {
      min-height: 120vh;
    }
  }

  @media (max-width: 480px) {
    .right-page {
      padding: 4rem 1rem 1rem 1rem;
    }
    .page-footer {
      flex-direction: column;
      gap: 1rem;
    }
    .pagination-controls {
      width: 100%;
      justify-content: space-between;
    }
    .action-btn {
      width: 100%;
      justify-content: center;
    }
  }
  .spine-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    z-index: 50;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    padding: 2% 0;
    pointer-events: none;
  }
  
  /* Central shadow line for depth */
  .spine-container::before {
    content: '';
    position: absolute;
    top: 0; bottom: 0; left: 50%;
    width: 2px;
    background: rgba(0,0,0,0.05);
    transform: translateX(-50%);
  }

  .binder-coil {
    width: 46px;
    height: 12px;
    background: linear-gradient(180deg, 
      #dcdcdc 0%, 
      #ffffff 30%, 
      #a6a6a6 50%, 
      #8c8c8c 60%, 
      #e2e2e2 100%
    );
    border-radius: 8px;
    box-shadow: 
      2px 4px 6px rgba(0,0,0,0.25),
      inset 0 2px 4px rgba(255,255,255,0.9),
      inset 0 -1px 2px rgba(0,0,0,0.4);
    position: relative;
    /* Simulate perspective winding */
    transform: rotateX(15deg) rotateZ(-3deg);
  }

  /* Holes punched in paper behind coils */
  .binder-coil::before, .binder-coil::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 14px;
    background: #e8e6df; /* slightly darker than paper */
    border-radius: 50%;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: inset 2px 2px 5px rgba(0,0,0,0.3);
    z-index: -1;
  }
  
  .binder-coil::before { left: -8px; }
  .binder-coil::after { right: -8px; }


  /* Right Page Functional Typography & Layout */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(0,0,0,0.06);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    padding: 0.75rem 0;
    margin-bottom: 2rem;
    font-family: 'Lora', serif;
  }

  .date-group {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    color: #2b4522; /* Dark green theme */
  }

  .date-num {
    font-size: 2.2rem;
    font-weight: 700;
    line-height: 1;
  }

  .date-text {
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    opacity: 0.8;
  }

  .time-text {
    font-size: 0.85rem;
    color: #83857e;
    font-family: monospace;
    letter-spacing: 0.5px;
  }

  .title-input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-family: 'Caveat', cursive;
    font-size: 2.5rem;
    font-weight: 700;
    color: #2b4522;
    margin-bottom: 0.5rem;
  }
  
  .title-input::placeholder {
    color: rgba(43, 69, 34, 0.3);
    font-family: 'Playfair Display', serif;
    font-weight: 500;
    font-size: 2rem;
  }

  /* Content Wrapper: fills the available flex space, clips overflow */
  .content-scroll-wrapper {
    flex: 1;
    min-height: 0; /* Critical for flex children - allows shrinking */
    width: 100%;
    overflow: hidden; /* Clip text that overflows the 20-line boundary */
    position: relative;
    /* Background ruled lines */
    background-image: linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px);
    background-size: 100% 36px;
  }

  .content-textarea {
    /* Fill the wrapper completely */
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    /* Allow typing and backspace freely, clip visually at wrapper boundary */
    overflow: hidden;
    
    font-family: 'Caveat', cursive;
    font-size: 1.6rem;
    font-weight: 500;
    color: #21321b;
    line-height: 36px;
    padding-top: 6px;
  }
  
  .content-textarea::placeholder {
    color: rgba(0,0,0,0.2);
    font-family: 'Lora', serif;
    font-style: italic;
    font-weight: 400;
    font-size: 1.15rem;
  }

  .page-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid rgba(0,0,0,0.03);
    color: #a39e93;
    font-family: monospace;
    font-size: 0.85rem;
  }

  .nav-arrows {
    display: flex;
    gap: 1.5rem;
  }

  .footer-btn {
    cursor: pointer;
    transition: color 0.2s;
  }
  
  .footer-btn:hover {
    color: #2b4522;
  }

  /* Hidden Scrollbars */
  .hide-scroll::-webkit-scrollbar { width: 5px; }
  .hide-scroll::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.08); border-radius: 10px; }
  .hide-scroll::-webkit-scrollbar-track { background: transparent; }
`;

const JournalingPrompts: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [entries, setEntries] = usePersistentState<JournalEntry[]>('journalEntries', []);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPageFull, setIsPageFull] = useState(false); // true when 20 lines are filled
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check if text fills 20 lines
  const checkPageOverflow = (text: string) => {
    // Create a temporary hidden textarea to measure the real scroll height
    const ta = textareaRef.current;
    if (!ta) return false;
    // scrollHeight vs MAX_TEXT_HEIGHT_PX determines if page is full
    // We save current value, set new value, measure, restore
    const oldValue = ta.value;
    ta.value = text;
    const full = ta.scrollHeight >= MAX_TEXT_HEIGHT_PX;
    ta.value = oldValue;
    return full;
  };

  // Initialize today's entry on mount
  useEffect(() => {
    setEntries(prev => {
      if (prev.length === 0) {
        return [{ id: Date.now().toString(), title: '', text: '', timestamp: new Date().toISOString() }];
      }
      const today = new Date().toLocaleDateString('en-US');
      const latestEntryDate = new Date(prev[0].timestamp).toLocaleDateString('en-US');
      if (today !== latestEntryDate) {
        return [{ id: Date.now().toString(), title: '', text: '', timestamp: new Date().toISOString() }, ...prev];
      }
      return prev;
    });
  }, [setEntries]);

  // Update isPageFull whenever the active entry changes
  useEffect(() => {
    // Use a microtask so the DOM has updated before measuring
    setTimeout(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      // scrollHeight / line-height = number of visual lines
      const visualLines = Math.round(ta.scrollHeight / LINE_HEIGHT_PX);
      setIsPageFull(visualLines >= LINES_PER_PAGE);
    }, 0);
  }, [currentPage, entries]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (currentPage < 0 || currentPage >= entries.length) return;
    const newText = e.target.value;
    setEntries(prev => {
      const updated = [...prev];
      updated[currentPage] = {
        ...updated[currentPage],
        text: newText
      };
      return updated;
    });
    // Measure visual lines via scrollHeight (handles word-wrap correctly)
    const ta = e.target;
    const visualLines = Math.round(ta.scrollHeight / LINE_HEIGHT_PX);
    setIsPageFull(visualLines >= LINES_PER_PAGE);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentPage < 0 || currentPage >= entries.length) return;
    setEntries(prev => {
      const updated = [...prev];
      updated[currentPage] = {
        ...updated[currentPage],
        title: e.target.value
      };
      return updated;
    });
  };

  const deleteEntry = () => {
    if (entries.length === 0) return;

    let confirmDelete = true;

    // Only ask for confirmation if the page has significant content (title or >10 chars text)
    if (activeEntry.title.trim().length > 0 || activeEntry.text.trim().length > 10) {
      confirmDelete = window.confirm("Are you sure you want to completely erase this page?");
    }

    if (!confirmDelete) return;

    setEntries(prev => {
      const newEntries = prev.filter((_, i) => i !== currentPage);

      // If we deleted the only entry, create a fresh empty one for today immediately
      if (newEntries.length === 0) {
        return [{ id: Date.now().toString(), title: '', text: '', timestamp: new Date().toISOString() }];
      }
      return newEntries;
    });

    // Ensure we navigate to a valid index on delete
    if (currentPage >= entries.length - 1) {
      setCurrentPage(Math.max(0, entries.length - 2));
    }
  };

  const handleOpenBook = () => {
    // If the 0th entry (today) is completely empty, just focus it
    if (entries.length > 0 && entries[0].title === '' && entries[0].text === '') {
      setCurrentPage(0);
      setTimeout(() => textareaRef.current?.focus(), 100);
      return;
    }

    // Ensure today is the 0th index before wiping it
    const today = new Date().toLocaleDateString('en-US');
    const latestEntryDate = entries.length > 0 ? new Date(entries[0].timestamp).toLocaleDateString('en-US') : '';

    if (today !== latestEntryDate) {
      setEntries(prev => [{ id: Date.now().toString(), title: '', text: '', timestamp: new Date().toISOString() }, ...prev]);
      setCurrentPage(0);
    } else {
      // Ask to start a new page today wiping the current day's text? Or just focus it.
      setCurrentPage(0);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  // Tracks flip direction for animation variants
  // direction = 1 means we go FORWARD (next page), page sweeps LEFT → flips right side away
  // direction = -1 means we go BACK (previous), page sweeps RIGHT → flips from left in
  const [pageDirection, setPageDirection] = useState(1);

  // ── "next" now CREATES a new continuation page (only when 20 lines filled) ──
  const goToNext = () => {
    if (!isPageFull) return;
    setPageDirection(1);
    // Check if a continuation page already exists right after this one
    const currentId = entries[currentPage]?.id;
    const nextEntry = entries[currentPage - 1]; // array is newest-first
    if (nextEntry && nextEntry.parentId === currentId) {
      // Already exists — just navigate to it
      setCurrentPage(currentPage - 1);
    } else {
      // Create new blank continuation page inserted BEFORE current (newest-first order)
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        title: '',
        text: '',
        timestamp: new Date().toISOString(),
        parentId: currentId,
      };
      setEntries(prev => {
        const updated = [...prev];
        updated.splice(currentPage, 0, newEntry); // insert before current
        return updated;
      });
      // After insert, current page index stays same and it now shows the new blank page
      // (because we inserted at `currentPage`, shifting current down to currentPage+1)
      // So we stay at currentPage — but the array shifted, so actually stay at the same idx.
      // The new entry is at currentPage, old one at currentPage+1. 
      // We want to navigate TO the new blank page.
      setCurrentPage(currentPage); // effectively refreshes to the newly inserted entry
    }
  };

  const goToPrev = () => {
    if (currentPage < entries.length - 1) {
      setPageDirection(-1);
      setCurrentPage(currentPage + 1);
    }
  };

  const activeEntry = entries[currentPage] || { title: '', text: '', timestamp: new Date().toISOString() };

  // Date formatting for the header
  const entryDate = new Date(activeEntry.timestamp);
  const dayNum = entryDate.getDate();
  const monthYear = entryDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const timeStr = entryDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

  // 3D Page flip Variants
  // Entering from "next" (going forward): new page slides in from the RIGHT side
  //   initial rotateY = 90 (page starts folded to the right), animates to 0
  // Entering from "prev" (going back): new page slides in from the LEFT side
  //   initial rotateY = -90 (page starts folded to the left), animates to 0
  const pageVariants = {
    initial: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
      filter: 'brightness(1.5)',
    }),
    animate: {
      rotateY: 0,
      opacity: 1,
      filter: 'brightness(1)',
      transition: { type: 'spring' as const, stiffness: 80, damping: 18 }
    },
    exit: (direction: number) => ({
      rotateY: direction > 0 ? -90 : 90,
      opacity: 0,
      filter: 'brightness(0.5)',
      transition: { duration: 0.25 }
    })
  };

  return (
    <>
      <style>{notebookCSS}</style>
      <div className="notebook-fullscreen animate-fade-in">

        {/* Back Button (Fixed to screen) */}
        <button
          onClick={onBack}
          className="fixed top-4 left-4 sm:top-6 sm:left-6 z-[100] bg-white/50 backdrop-blur-md p-3 rounded-full text-slate-600 hover:text-brand-dark-green hover:bg-white shadow-sm transition-all"
          aria-label="Close Journal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="spread-container">

          {/* Left Page — Logo Only */}
          <div className="page-side left-page">
            <Logo className="cover-logo" />
          </div>

          {/* Full Height Photorealistic Spine */}
          <div className="spine-container">
            {[...Array(14)].map((_, i) => (
              <div key={i} className="binder-coil" />
            ))}
          </div>

          {/* Right Page (Functional) */}
          <div className="right-page-container">
            <AnimatePresence mode="wait" custom={pageDirection}>
              <motion.div
                key={currentPage}
                custom={pageDirection}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="right-page"
              >
                {/* Header: Date and Time */}
                <div className="page-header">
                  <div className="date-group">
                    <span className="date-num">{dayNum}</span>
                    <span className="date-text">{monthYear}</span>
                  </div>
                  <div className="time-text">{timeStr}</div>
                </div>

                {/* Title Input */}
                <input
                  type="text"
                  className="title-input"
                  placeholder="Success Title"
                  value={activeEntry.title || ''}
                  onChange={handleTitleChange}
                />

                {/* Ruled Content Area — 20 lines visible, clips overflow at page boundary */}
                <div className="content-scroll-wrapper hide-scroll">
                  <textarea
                    ref={textareaRef}
                    className="content-textarea"
                    placeholder="Dear Journal..."
                    value={activeEntry.text || ''}
                    onChange={handleTextChange}
                    autoFocus={currentPage === 0}
                  />
                </div>

                {/* Footer Navigation */}
                <div className="page-footer">
                  <div className="nav-arrows">
                    <button
                      className="footer-btn transition-transform hover:-translate-x-1"
                      onClick={goToPrev}
                      style={{ opacity: currentPage < entries.length - 1 ? 1 : 0.2, pointerEvents: currentPage < entries.length - 1 ? 'auto' : 'none' }}
                      title="Previous page"
                    >
                      &larr; previous
                    </button>
                    <button
                      className="footer-btn transition-transform hover:translate-x-1"
                      onClick={goToNext}
                      style={{
                        opacity: isPageFull ? 1 : 0.2,
                        pointerEvents: isPageFull ? 'auto' : 'none',
                        color: isPageFull ? '#2b4522' : undefined,
                        fontWeight: isPageFull ? 700 : undefined,
                      }}
                      title={isPageFull ? 'Page full — flip to a new page' : 'Fill this page to continue'}
                    >
                      next &rarr;
                    </button>
                  </div>
                  <div className="flex gap-4">
                    {/* Focus text area to "edit" */}
                    <button className="footer-btn" onClick={() => textareaRef.current?.focus()}>
                      <EditIcon />
                    </button>
                    <button className="footer-btn hover:text-red-500" onClick={deleteEntry}>
                      <TrashIcon />
                    </button>
                  </div>
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
