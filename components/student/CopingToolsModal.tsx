

import React, { useState } from 'react';
import { BreathingIcon, PuzzleIcon, BookOpenIcon } from '../common/icons';
import BreathingExercise from './BreathingExercise';
import MindfulGames from './MindfulGames';

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
    onClose();
  }

  const handleBack = () => {
    setActiveTool(null);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-brand-background rounded-[2rem] shadow-2xl w-full max-w-2xl min-h-[500px] h-auto max-h-[90vh] flex flex-col">
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

        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          {activeTool === 'Guided Breathing' ? (
            <BreathingExercise onBack={handleBack} />
          ) : activeTool === 'Mindfulness Games' ? (
            <MindfulGames onBack={handleBack} />
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