

import React, { useState } from 'react';
import { BreathingIcon, PuzzleIcon, BookOpenIcon } from '../common/icons';
import BreathingExercise from './BreathingExercise';

interface CopingToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tools = [
  {
    name: 'Guided Breathing',
    description: 'Follow simple exercises to calm your mind and body.',
    icon: <BreathingIcon className="w-8 h-8 text-brand-dark-green" />,
  },
  {
    name: 'Mindfulness Games',
    description: 'Engage in fun activities designed to improve focus and reduce stress.',
    icon: <PuzzleIcon className="w-8 h-8 text-brand-dark-green" />,
  },
  {
    name: 'Journaling Prompts',
    description: 'Explore your thoughts and feelings with guided writing exercises.',
    icon: <BookOpenIcon className="w-8 h-8 text-brand-dark-green" />,
  },
];

const CopingToolsModal: React.FC<CopingToolsModalProps> = ({ isOpen, onClose }) => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [activeGameUrl, setActiveGameUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToolClick = (toolName: string) => {
    if (toolName === 'Guided Breathing' || toolName === 'Mindfulness Games') {
      setActiveTool(toolName);
    } else {
      alert(`Tool selected: ${toolName}. This feature is coming soon!`);
    }
  };

  const handleClose = () => {
    setActiveTool(null);
    setActiveGameUrl(null);
    onClose();
  }

  const handleBack = () => {
    if (activeGameUrl) {
      setActiveGameUrl(null);
    } else {
      setActiveTool(null);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`bg-brand-background shadow-2xl flex flex-col transition-all duration-300 ${activeGameUrl ? 'w-[95vw] h-[95vh] rounded-2xl' : 'w-full max-w-2xl min-h-[500px] h-auto max-h-[90vh] rounded-[2rem]'}`}>
        <header className="flex items-center justify-between p-4 border-b border-brand-light-green/50">
          <div className="flex items-center gap-2">
            {activeTool && (
              <button onClick={handleBack} aria-label="Back to tools list" className="p-1 rounded-full text-brand-dark-green/60 hover:text-brand-dark-green hover:bg-black/10 transition-colors">
                <span className="text-2xl font-bold">&larr;</span>
              </button>
            )}
            <h2 className="text-xl font-bold text-brand-dark-green">
              {activeTool ? activeTool : 'Coping Tools'}
            </h2>
          </div>
          <button onClick={handleClose} aria-label="Close coping tools" className="text-brand-dark-green/70 hover:text-brand-dark-green text-3xl font-light leading-none">&times;</button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeGameUrl ? (
            <div className="w-full h-full min-h-[500px] border-2 border-brand-light-green/50 rounded-2xl overflow-hidden bg-white">
              <iframe
                src={activeGameUrl}
                className="w-full h-full border-none"
                title={activeTool || "Embedded Game"}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          ) : activeTool === 'Guided Breathing' ? (
            <BreathingExercise onBack={handleBack} />
          ) : activeTool === 'Mindfulness Games' ? (
            <div className="space-y-4">
              <p className="text-brand-dark-green/80 mb-6 text-center">
                Select a game to help center your thoughts and relax.
              </p>
              <button
                onClick={() => setActiveGameUrl('/games/zensnap/index.html')}
                className="w-full flex flex-col p-6 border rounded-3xl text-left bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-md hover:border-indigo-200 transition-all duration-300"
              >
                <div className="font-bold text-lg text-indigo-900 mb-2">ZenSnap</div>
                <div className="text-sm text-indigo-700/80">A soothing puzzle game that encourages concentration and pattern recognition in a peaceful environment.</div>
              </button>
              <button
                onClick={() => setActiveGameUrl('/games/mindful-tales/index.html')}
                className="w-full flex flex-col p-6 border rounded-3xl text-left bg-gradient-to-br from-sage-50 to-emerald-50 hover:shadow-md hover:border-emerald-200 transition-all duration-300"
                style={{ backgroundImage: 'linear-gradient(to bottom right, #f0fdf4, #ecfdf5)' }}
              >
                <div className="font-bold text-lg text-emerald-900 mb-2">Mindful Tales</div>
                <div className="text-sm text-emerald-700/80">Drag and arrange characters to untangle relaxing stories and discover mindful journeys.</div>
              </button>
            </div>
          ) : (
            <>
              <p className="text-brand-dark-green/80 mb-6 text-center">
                Explore a library of guided exercises, mindfulness games, and journaling prompts to help you manage stress and find your calm.
              </p>
              <div className="space-y-4">
                {tools.map((tool) => (
                  <button
                    key={tool.name}
                    onClick={() => handleToolClick(tool.name)}
                    aria-label={`Open ${tool.name} tool`}
                    className="w-full flex items-center p-4 border rounded-3xl text-left hover:bg-brand-light-green/20 hover:border-brand-dark-green/50 transition-all duration-200"
                  >
                    <div className="bg-brand-light-green/30 p-3 rounded-full mr-4">
                      {tool.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-dark-green">{tool.name}</h3>
                      <p className="text-sm text-brand-dark-green/70">{tool.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <footer className="p-4 border-t border-brand-light-green/50 text-right">
          <button
            onClick={handleClose}
            aria-label="Close coping tools"
            className="bg-brand-dark-green text-white font-semibold py-2 px-8 rounded-full hover:bg-brand-dark-green/90 transition-colors"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CopingToolsModal;