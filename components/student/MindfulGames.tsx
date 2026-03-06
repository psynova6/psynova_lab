import React, { useState } from 'react';

interface Game {
    id: string;
    name: string;
    description: string;
    path: string;
    thumbnailColor: string;
}

const GAMES: Game[] = [
    {
        id: 'zensnap',
        name: 'ZenSnap',
        description: 'A mindful jigsaw puzzle game for relaxation.',
        path: '/games/zensnap/index.html',
        thumbnailColor: 'bg-teal-500/20'
    },
    {
        id: 'mindful-tales',
        name: 'Mindful Tales',
        description: 'Interactive stories to help you unwind and reflect.',
        path: '/games/mindful-tales/index.html',
        thumbnailColor: 'bg-purple-500/20'
    }
];

interface MindfulGamesProps {
    onBack?: () => void;
}

const MindfulGames: React.FC<MindfulGamesProps> = ({ onBack }) => {
    const [activeGame, setActiveGame] = useState<Game | null>(null);

    // If a game is active, render it full size in an iframe
    if (activeGame) {
        return (
            <div className="flex flex-col h-[100vh] w-[100vw] fixed inset-0 bg-brand-background z-[100] animate-fade-in">
                {/* Header for navigating back out of the game */}
                <header className="flex items-center justify-between p-4 border-b border-brand-light-green/50 bg-brand-background/90 backdrop-blur-sm z-10 shrink-0">
                    <div className="flex items-center gap-3 w-full">
                        <button
                            onClick={() => setActiveGame(null)}
                            aria-label="Back to games list"
                            className="p-2 rounded-full text-brand-dark-green hover:bg-black/10 transition-colors flex items-center gap-2 group"
                        >
                            <span className="text-xl font-bold group-hover:-translate-x-1 transition-transform">&larr;</span>
                            <span className="font-medium hidden sm:inline">Back to Games</span>
                        </button>
                        <h2 className="text-lg font-bold text-brand-dark-green flex-1 text-center pr-12">
                            {activeGame.name}
                        </h2>
                    </div>
                </header>

                {/* The Game Iframe */}
                <div className="flex-1 w-full bg-black relative">
                    {/* Placeholder while loading (optional, but good UX) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 border-4 border-brand-light-green border-t-brand-dark-green rounded-full animate-spin"></div>
                    </div>

                    <iframe
                        src={activeGame.path}
                        title={activeGame.name}
                        className="w-full h-full border-none relative z-10 bg-white"
                        allow="fullscreen; autoplay; document-domain; encrypted-media; execution-while-not-rendered; execution-while-out-of-viewport; xr-spatial-tracking"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups opacity"
                    ></iframe>
                </div>
            </div>
        );
    }

    // List view of games
    return (
        <div className="flex flex-col h-full animate-fade-in-down">
            <p className="text-brand-dark-green/80 mb-6 text-center">
                Engage in calming activities designed to improve focus, reduce stress, and promote a sense of inner peace.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GAMES.map((game) => (
                    <button
                        key={game.id}
                        onClick={() => setActiveGame(game)}
                        className="flex flex-col items-center p-6 border rounded-[2rem] text-center hover:bg-brand-light-green/10 hover:border-brand-dark-green/30 hover:shadow-md transition-all duration-300 group bg-white/50"
                    >
                        <div className={`w-20 h-20 rounded-2xl ${game.thumbnailColor} mb-4 flex items-center justify-center text-brand-dark-green group-hover:scale-110 transition-transform duration-300`}>
                            {/* Generic icon placeholder based on name, could map specific icons if we had them */}
                            <span className="text-3xl font-bold opacity-80">{game.name.charAt(0)}</span>
                        </div>
                        <h3 className="font-bold text-lg text-brand-dark-green mb-2">{game.name}</h3>
                        <p className="text-sm text-brand-dark-green/70 line-clamp-2">{game.description}</p>

                        <div className="mt-4 px-6 py-2 bg-brand-dark-green text-white text-sm font-medium rounded-full opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                            Play Now
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MindfulGames;
