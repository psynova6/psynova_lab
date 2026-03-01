import React, { useState, useEffect, useRef } from 'react';
import { UserIcon, HistoryIcon, CheckIcon } from '../common/icons';

interface TherapistSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBookSession: (therapistName: string) => void;
}

interface Therapist {
    name: string;
    specialization: string;
    experience: string;
    approach: string;
    languages: string[];
}

interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'therapist';
    timestamp: Date;
    replyTo?: number;
    image?: string;
}

type ContactMethod = 'chat' | 'voice' | 'video' | null;

const therapists: Therapist[] = [
    {
        name: 'Dr. Ananya Sharma',
        specialization: 'Cognitive Behavioral Therapy (CBT)',
        experience: '8+ years',
        approach: 'Client-centered, focusing on practical coping strategies and thought patterns.',
        languages: ['English', 'Hindi'],
    },
    {
        name: 'Rohan Verma',
        specialization: 'Anxiety & Stress Management',
        experience: '5 years',
        approach: 'Integrates mindfulness techniques with solution-focused therapy to build resilience.',
        languages: ['English'],
    },
    {
        name: 'Priya Desai',
        specialization: 'Student Life & Academic Pressure',
        experience: '6 years',
        approach: 'Empathetic and supportive guidance tailored to the unique challenges students face.',
        languages: ['English', 'Gujarati'],
    },
];

const previousTherapists: Therapist[] = [
    {
        name: 'Dr. Meera Krishnan',
        specialization: 'Trauma & Recovery',
        experience: '12+ years',
        approach: 'Compassionate, trauma-informed care to foster healing and empowerment.',
        languages: ['English', 'Tamil'],
    },
    {
        name: 'Vikram Singh',
        specialization: 'Relationship Counseling',
        experience: '10 years',
        approach: 'Focuses on communication skills and understanding relational dynamics.',
        languages: ['English', 'Punjabi'],
    },
];

// Icons
const ChatIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const VideoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
);

const SendIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const ImageIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);

const TherapistCard: React.FC<{
    therapist: Therapist;
    isDetailsVisible: boolean;
    onViewDetails: (name: string) => void;
    onConnect: (name: string) => void;
}> = ({ therapist, isDetailsVisible, onViewDetails, onConnect }) => {
    return (
        <div className="bg-white/80 p-4 sm:p-6 rounded-3xl flex flex-col items-center text-center shadow-md transition-all duration-300 h-full">
            <div className="w-20 h-20 rounded-full bg-brand-light-green/40 flex items-center justify-center mb-4">
                <UserIcon className="w-12 h-12 text-brand-dark-green" />
            </div>
            <h4 className="font-bold text-lg sm:text-xl text-brand-dark-green mb-2">{therapist.name}</h4>
            <p className="text-sm sm:text-base text-brand-dark-green/70 mb-4">{therapist.specialization}</p>

            {isDetailsVisible && (
                <div className="text-left w-full text-sm sm:text-base text-brand-dark-green/80 border-t border-brand-light-green/50 pt-3 mt-2 mb-4 animate-fade-in-down">
                    <p><strong>Experience:</strong> {therapist.experience}</p>
                    <p><strong>Approach:</strong> {therapist.approach}</p>
                    <p><strong>Languages:</strong> {therapist.languages.join(', ')}</p>
                </div>
            )}

            <div className="flex w-full gap-2 mt-auto">
                <button
                    onClick={() => onViewDetails(therapist.name)}
                    aria-label={`${isDetailsVisible ? 'Hide' : 'View'} details for ${therapist.name}`}
                    className="w-full bg-white border border-brand-dark-green text-brand-dark-green font-semibold py-2 px-4 rounded-full hover:bg-brand-light-green/30 transition-colors duration-300 text-sm"
                >
                    {isDetailsVisible ? 'Hide' : 'Details'}
                </button>
                <button
                    onClick={() => onConnect(therapist.name)}
                    aria-label={`Connect with ${therapist.name}`}
                    className="w-full bg-brand-dark-green text-white font-semibold py-2 px-4 rounded-full hover:bg-brand-light-green hover:text-brand-dark-green transition-colors duration-300 text-sm"
                >
                    Connect
                </button>
            </div>
        </div>
    );
};

// Enhanced Booking Confirmation with Contact Options
const BookingConfirmation: React.FC<{
    therapistName: string;
    onClose: () => void;
    onContactMethodSelect: (method: ContactMethod) => void;
    showContactOptions: boolean;
    onToggleContactOptions: () => void;
}> = ({ therapistName, onClose, onContactMethodSelect, showContactOptions, onToggleContactOptions }) => (
    <div className="relative text-center flex flex-col items-center justify-center h-full animate-fade-in-down px-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-brand-light-green rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <CheckIcon className="w-12 h-12 sm:w-16 sm:h-16 text-brand-dark-green" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-brand-dark-green mb-3 sm:mb-4">Session Booked!</h3>
        <p className="text-base sm:text-lg text-brand-dark-green/80 mb-6 sm:mb-8 max-w-md">
            Your session with <span className="font-semibold">{therapistName}</span> is confirmed and added to your history.
        </p>

        {!showContactOptions && (
            <button
                onClick={onToggleContactOptions}
                aria-label="Contact therapist"
                className="bg-brand-dark-green text-white font-semibold py-3 px-8 rounded-full hover:bg-brand-dark-green/90 transition-colors mb-4"
            >
                Contact
            </button>
        )}

        {showContactOptions && (
            <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-fade-in-down">
                <button
                    onClick={() => onContactMethodSelect('chat')}
                    aria-label="Chat with therapist"
                    className="flex flex-col items-center gap-2 bg-white/80 p-4 rounded-2xl hover:bg-brand-light-green/30 transition-colors min-w-[100px]"
                >
                    <ChatIcon className="w-8 h-8 text-brand-dark-green" />
                    <span className="text-sm font-semibold text-brand-dark-green">Chat</span>
                </button>
                <button
                    onClick={() => onContactMethodSelect('voice')}
                    aria-label="Voice call with therapist"
                    className="flex flex-col items-center gap-2 bg-white/80 p-4 rounded-2xl hover:bg-brand-light-green/30 transition-colors min-w-[100px]"
                >
                    <PhoneIcon className="w-8 h-8 text-brand-dark-green" />
                    <span className="text-sm font-semibold text-brand-dark-green">Voice</span>
                </button>
                <button
                    onClick={() => onContactMethodSelect('video')}
                    aria-label="Video call with therapist"
                    className="flex flex-col items-center gap-2 bg-white/80 p-4 rounded-2xl hover:bg-brand-light-green/30 transition-colors min-w-[100px]"
                >
                    <VideoIcon className="w-8 h-8 text-brand-dark-green" />
                    <span className="text-sm font-semibold text-brand-dark-green">Video</span>
                </button>
            </div>
        )}
    </div>
);

// Voice/Video Call Placeholder
const CallPlaceholder: React.FC<{
    type: 'voice' | 'video';
    therapistName: string;
    onEndCall: () => void;
}> = ({ type, therapistName, onEndCall }) => (
    <div className="fixed inset-0 bg-brand-dark-green/95 flex flex-col items-center justify-center z-50 text-white animate-fade-in-down">
        <div className="w-32 h-32 rounded-full bg-brand-light-green/40 flex items-center justify-center mb-6 animate-pulse">
            <UserIcon className="w-20 h-20 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-2">{therapistName}</h3>
        <p className="text-lg mb-8">
            {type === 'voice' ? 'Connecting via voice call...' : 'Connecting via video...'}
        </p>
        <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <button
            onClick={onEndCall}
            aria-label="End call"
            className="mt-8 bg-red-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-red-600 transition-colors"
        >
            End Call
        </button>
    </div>
);

// WhatsApp-style Chat Interface
const ChatInterface: React.FC<{
    therapistName: string;
    onClose: () => void;
}> = ({ therapistName, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 1,
            text: 'Hello! I\'m here to support you. How are you feeling today?',
            sender: 'therapist',
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        if (editingId) {
            // Edit message
            setMessages(messages.map(msg =>
                msg.id === editingId ? { ...msg, text: inputText } : msg
            ));
            setEditingId(null);
        } else {
            // Send new message
            const newMessage: ChatMessage = {
                id: Date.now(),
                text: inputText,
                sender: 'user',
                timestamp: new Date(),
                replyTo: replyingTo || undefined,
            };
            setMessages([...messages, newMessage]);
            setReplyingTo(null);
        }
        setInputText('');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newMessage: ChatMessage = {
                    id: Date.now(),
                    text: '',
                    sender: 'user',
                    timestamp: new Date(),
                    image: reader.result as string,
                };
                setMessages([...messages, newMessage]);
            };
            reader.readAsDataURL(file);
        }
    };

    const getRepliedMessage = (replyToId: number) => {
        return messages.find(msg => msg.id === replyToId);
    };

    return (
        <div className="fixed inset-0 bg-brand-background flex flex-col z-50">
            {/* Chat Header */}
            <div className="bg-brand-dark-green text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-light-green/40 flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg">{therapistName}</h3>
                </div>
                <button
                    onClick={onClose}
                    aria-label="Close chat"
                    className="text-white text-3xl font-light leading-none"
                >
                    &times;
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-background/50">
                {messages.map((message) => {
                    const repliedMsg = message.replyTo ? getRepliedMessage(message.replyTo) : null;
                    return (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] ${message.sender === 'user'
                                    ? 'bg-brand-dark-green text-white'
                                    : 'bg-white text-brand-dark-green'
                                    } rounded-2xl p-3 shadow-md`}
                                onContextMenu={(e) => {
                                    if (message.sender === 'user') {
                                        e.preventDefault();
                                        setEditingId(message.id);
                                        setInputText(message.text);
                                    }
                                }}
                            >
                                {repliedMsg && (
                                    <div className={`${message.sender === 'user'
                                        ? 'bg-white/20 border-white/40'
                                        : 'bg-brand-dark-green/10 border-brand-dark-green/30'
                                        } rounded-lg p-2 mb-2 text-sm border-l-4`}>
                                        <p className="font-semibold text-xs mb-1 opacity-90">
                                            {repliedMsg.sender === 'user' ? 'You' : therapistName}
                                        </p>
                                        <p className="truncate opacity-80">{repliedMsg.text || '[Image]'}</p>
                                    </div>
                                )}
                                {message.image && (
                                    <img src={message.image} alt="Sent" className="rounded-lg mb-2 max-w-full" />
                                )}
                                {message.text && <p className="break-words">{message.text}</p>}
                                <div className="flex items-center justify-between gap-2 mt-1">
                                    <span className="text-xs opacity-70">
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <button
                                        onClick={() => {
                                            setReplyingTo(message.id);
                                        }}
                                        className="text-xs underline opacity-70 hover:opacity-100"
                                    >
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Reply Preview */}
            {replyingTo && (
                <div className="bg-white border-t border-brand-light-green/30 p-3 px-4 flex items-center justify-between">
                    <div className="flex-1 border-l-4 border-brand-dark-green pl-3">
                        <p className="text-xs font-semibold text-brand-dark-green mb-1">
                            {getRepliedMessage(replyingTo)?.sender === 'user' ? 'You' : therapistName}
                        </p>
                        <p className="text-sm text-brand-dark-green/70 truncate">
                            {getRepliedMessage(replyingTo)?.text || '[Image]'}
                        </p>
                    </div>
                    <button
                        onClick={() => setReplyingTo(null)}
                        className="text-brand-dark-green/70 hover:text-brand-dark-green ml-3"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Edit Preview */}
            {editingId && (
                <div className="bg-yellow-100 p-2 px-4 flex items-center justify-between">
                    <p className="text-sm text-brand-dark-green font-semibold">Editing message...</p>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setInputText('');
                        }}
                        className="text-brand-dark-green/70 hover:text-brand-dark-green"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Input Area */}
            <div className="bg-white p-4 flex items-center gap-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Attach image"
                    className="p-2 text-brand-dark-green hover:bg-brand-light-green/30 rounded-full transition-colors"
                >
                    <ImageIcon className="w-6 h-6" />
                </button>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-brand-light-green/50 rounded-full focus:ring-brand-dark-green focus:border-brand-dark-green bg-white/50"
                />
                <button
                    onClick={handleSend}
                    aria-label="Send message"
                    disabled={!inputText.trim()}
                    className="p-2 bg-brand-dark-green text-white rounded-full hover:bg-brand-dark-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <SendIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

const TherapistSelectionModal: React.FC<TherapistSelectionModalProps> = ({ isOpen, onClose, onBookSession }) => {
    const [showHistory, setShowHistory] = useState(false);
    const [detailedTherapist, setDetailedTherapist] = useState<string | null>(null);
    const [bookedTherapist, setBookedTherapist] = useState<string | null>(null);
    const [showContactOptions, setShowContactOptions] = useState(false);
    const [contactMethod, setContactMethod] = useState<ContactMethod>(null);

    useEffect(() => {
        if (!isOpen) {
            // Reset states when modal is closed for a clean opening next time
            setShowHistory(false);
            setDetailedTherapist(null);
            setBookedTherapist(null);
            setShowContactOptions(false);
            setContactMethod(null);
        }
    }, [isOpen]);

    const handleViewDetails = (name: string) => {
        setDetailedTherapist(prev => prev === name ? null : name);
    };

    const handleConnect = (name: string) => {
        onBookSession(name);
        setBookedTherapist(name);
    };

    const handleContactMethodSelect = (method: ContactMethod) => {
        setContactMethod(method);
    };

    if (!isOpen) return null;

    // Show call placeholder
    if (contactMethod === 'voice' || contactMethod === 'video') {
        return (
            <CallPlaceholder
                type={contactMethod}
                therapistName={bookedTherapist || ''}
                onEndCall={() => setContactMethod(null)}
            />
        );
    }

    // Show chat interface
    if (contactMethod === 'chat') {
        return (
            <ChatInterface
                therapistName={bookedTherapist || ''}
                onClose={() => setContactMethod(null)}
            />
        );
    }

    const currentList = showHistory ? previousTherapists : therapists;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-brand-background rounded-2xl sm:rounded-[2rem] shadow-2xl w-full max-w-6xl min-h-[400px] sm:min-h-[500px] max-h-[95vh] flex flex-col">
                <header className="flex items-center justify-between p-3 sm:p-4 border-b border-brand-light-green/50">
                    <h2 className="text-lg sm:text-xl font-bold text-brand-dark-green">
                        {bookedTherapist ? 'Confirmation' : 'Choose a Therapist'}
                    </h2>
                    <div className="flex items-center gap-2 sm:gap-4">
                        {!bookedTherapist && (
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                aria-label={showHistory ? 'Show available therapists' : 'Show previously connected therapists'}
                                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-brand-dark-green font-semibold p-2 rounded-2xl hover:bg-brand-light-green/30"
                                title={showHistory ? 'Hide history' : 'Show history'}
                            >
                                <HistoryIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="hidden sm:inline">{showHistory ? 'Available' : 'History'}</span>
                            </button>
                        )}
                        <button onClick={onClose} aria-label="Close therapist selection" className="text-brand-dark-green/70 hover:text-brand-dark-green text-3xl font-light leading-none">&times;</button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    {bookedTherapist ? (
                        <BookingConfirmation
                            therapistName={bookedTherapist}
                            onClose={onClose}
                            onContactMethodSelect={handleContactMethodSelect}
                            showContactOptions={showContactOptions}
                            onToggleContactOptions={() => setShowContactOptions(!showContactOptions)}
                        />
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-brand-dark-green mb-2">
                                    {showHistory ? 'Previously Connected' : 'Available for You'}
                                </h3>
                                <p className="text-brand-dark-green/80 max-w-2xl mx-auto">
                                    {showHistory
                                        ? 'Here are the therapists you have connected with in the past.'
                                        : 'Our therapists are ready to support you. Choose someone you feel comfortable with to begin your session.'
                                    }
                                </p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-8">
                                {currentList.map((therapist) => (
                                    <div key={therapist.name} className="w-full max-w-xs">
                                        <TherapistCard
                                            therapist={therapist}
                                            isDetailsVisible={detailedTherapist === therapist.name}
                                            onViewDetails={handleViewDetails}
                                            onConnect={handleConnect}
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {!bookedTherapist && (
                    <footer className="p-4 border-t border-brand-light-green/50 text-right">
                        <button
                            onClick={onClose}
                            aria-label="Close therapist selection"
                            className="bg-brand-dark-green text-white font-semibold py-2 px-8 rounded-full hover:bg-brand-dark-green/90 transition-colors"
                        >
                            Close
                        </button>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default TherapistSelectionModal;