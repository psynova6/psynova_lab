import React, { useState } from 'react';
import { ALL_CHAPTERS } from './data/puzzleData';
import type { PuzzleChapter } from './types';
import { PuzzleBoard } from './components/PuzzleBoard';
import { Book, Heart, Info, Sparkles } from 'lucide-react';

type AppView = { mode: 'library' } | { mode: 'puzzle'; chapter: PuzzleChapter };

const App: React.FC = () => {
  const [view, setView] = useState<AppView>({ mode: 'library' });

  if (view.mode === 'library') {
    return (
      <div className="min-h-screen p-4 md:p-12 flex flex-col items-center">
        <header className="mb-10 text-center max-w-2xl">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles size={24} className="text-sage" />
            <h1 className="font-serif text-4xl md:text-5xl text-ink tracking-tight">Mindful Tales</h1>
            <Sparkles size={24} className="text-sage" />
          </div>
          <p className="text-base text-stone-600 font-serif italic">
            "Arrange the characters to discover the story within."
          </p>
          <p className="text-xs text-stone-400 mt-2 font-sans">
            Drag characters into panels • Stack objects • Watch stories unfold • {ALL_CHAPTERS.length} stories to explore
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full max-w-6xl">
          {ALL_CHAPTERS.map((ch, idx) => (
            <button key={ch.id} onClick={() => setView({ mode: 'puzzle', chapter: ch })}
              className="group flex flex-col bg-paper rounded-xl p-5 shadow-sm border border-stone-200 hover:shadow-lg hover:border-sage transition-all text-left book-shadow relative overflow-hidden"
            >
              {/* Gradient accent */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{ backgroundImage: ch.backgrounds[0]?.gradient || 'none' }} />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center group-hover:bg-sage group-hover:text-white transition-colors text-sm font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 bg-stone-50 px-2 py-0.5 rounded">
                    {ch.theme}
                  </span>
                </div>

                <h3 className="font-serif text-xl text-ink mb-1.5 group-hover:text-sage transition-colors leading-tight">
                  {ch.title}
                </h3>

                <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed mb-3">
                  {ch.blurb}
                </p>

                {/* Character avatars */}
                <div className="flex items-center gap-1.5 mb-3">
                  {ch.characters.map(c => (
                    <div key={c.id}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
                      style={{ backgroundColor: c.color }} title={c.name}>
                      {c.name.charAt(0)}
                    </div>
                  ))}
                  {ch.tokens.length > 0 && (
                    <span className="text-stone-300 text-[10px]">+{ch.tokens.length} 🎯</span>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center gap-2 text-[10px] text-stone-400">
                  <Info size={12} />
                  <span>{ch.panelCount} Panels</span>
                  <span>•</span>
                  <span>{ch.outcomes.filter(o => o.id !== ch.defaultOutcomeId).length} Endings</span>
                  {ch.allowStacking && (
                    <><span>•</span><span>⬆ Stacking</span></>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <footer className="mt-14 text-center text-stone-400 text-xs flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            Made with <Heart size={10} className="text-red-400" fill="currentColor" /> for mindfulness
          </div>
        </footer>
      </div>
    );
  }

  if (view.mode === 'puzzle') {
    return <PuzzleBoard chapter={view.chapter} onBack={() => setView({ mode: 'library' })} />;
  }

  return null;
};

export default App;
