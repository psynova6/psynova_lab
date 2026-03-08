import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UserIcon, HistoryIcon, CheckIcon } from '../common/icons';
import {
    getConnection,
    setConnection,
    updateConnection,
    subscribeToConnection,
    generateAvailableSlots,
    type ConnectionRecord,
    type ConnectionSlot,
} from '../../utils/connectionStore';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TherapistSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBookSession: (therapistName: string, scheduledTime?: string) => void;
    onConnectionNotification: (message: string) => void;
}

interface Therapist {
    name: string;
    specialization: string;
    experience: string;
    approach: string;
    languages: string[];
    rating: number;
    reviewCount: number;
}

interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'therapist';
    timestamp: Date;
    replyTo?: number;
    image?: string;
}

type ModalView = 'list' | 'slotSelection' | 'waiting' | 'booked';
type ContactMethod = 'chat' | 'voice' | 'video' | null;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const therapists: Therapist[] = [
    {
        name: 'Dr. Ananya Sharma',
        specialization: 'Cognitive Behavioral Therapy (CBT)',
        experience: '8+ years',
        approach: 'Client-centered, focusing on practical coping strategies and thought patterns.',
        languages: ['English', 'Hindi'],
        rating: 4.8,
        reviewCount: 124,
    },
    {
        name: 'Rohan Verma',
        specialization: 'Anxiety & Stress Management',
        experience: '5 years',
        approach: 'Integrates mindfulness techniques with solution-focused therapy to build resilience.',
        languages: ['English'],
        rating: 4.5,
        reviewCount: 87,
    },
    {
        name: 'Priya Desai',
        specialization: 'Student Life & Academic Pressure',
        experience: '6 years',
        approach: 'Empathetic and supportive guidance tailored to the unique challenges students face.',
        languages: ['English', 'Gujarati'],
        rating: 4.7,
        reviewCount: 102,
    },
];

const previousTherapists: Therapist[] = [
    {
        name: 'Dr. Meera Krishnan',
        specialization: 'Trauma & Recovery',
        experience: '12+ years',
        approach: 'Compassionate, trauma-informed care to foster healing and empowerment.',
        languages: ['English', 'Tamil'],
        rating: 4.9,
        reviewCount: 215,
    },
    {
        name: 'Vikram Singh',
        specialization: 'Relationship Counseling',
        experience: '10 years',
        approach: 'Focuses on communication skills and understanding relational dynamics.',
        languages: ['English', 'Punjabi'],
        rating: 4.6,
        reviewCount: 148,
    },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const StarIcon = ({ className, filled }: { className?: string; filled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);
const ChatIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);
const PhoneIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
);
const VideoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
);
const SendIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
);
const ImageIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
);
const ClockIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

const StarRating: React.FC<{ rating: number; reviewCount: number }> = ({ rating, reviewCount }) => (
    <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map(star => (
            <StarIcon key={star} className={`w-4 h-4 ${star <= Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`} filled={star <= rating} />
        ))}
        <span className="text-sm font-semibold text-brand-dark-green ml-1">{rating}</span>
        <span className="text-xs text-brand-dark-green/60">({reviewCount} reviews)</span>
    </div>
);

const TherapistCard: React.FC<{
    therapist: Therapist;
    isDetailsVisible: boolean;
    isPending: boolean;
    onViewDetails: (name: string) => void;
    onConnect: (name: string) => void;
}> = ({ therapist, isDetailsVisible, isPending, onViewDetails, onConnect }) => (
    <div className="bg-white/80 p-4 sm:p-6 rounded-3xl flex flex-col items-center text-center shadow-md transition-all duration-300 h-full">
        <div className="w-20 h-20 rounded-full bg-brand-light-green/40 flex items-center justify-center mb-4">
            <UserIcon className="w-12 h-12 text-brand-dark-green" />
        </div>
        <h4 className="font-bold text-lg sm:text-xl text-brand-dark-green mb-2">{therapist.name}</h4>
        <p className="text-sm sm:text-base text-brand-dark-green/70 mb-4">{therapist.specialization}</p>

        {isDetailsVisible && (
            <div className="text-left w-full border-t border-brand-light-green/50 pt-3 mt-2 mb-4 animate-fade-in-down">
                <StarRating rating={therapist.rating} reviewCount={therapist.reviewCount} />
                <div className="text-sm text-brand-dark-green/80 space-y-1 mb-4">
                    <p><strong>Experience:</strong> {therapist.experience}</p>
                    <p><strong>Approach:</strong> {therapist.approach}</p>
                    <p><strong>Languages:</strong> {therapist.languages.join(', ')}</p>
                </div>
                <button
                    onClick={() => onConnect(therapist.name)}
                    disabled={isPending}
                    aria-label={`Connect with ${therapist.name}`}
                    className="w-full bg-brand-dark-green text-white font-semibold py-2.5 px-4 rounded-full hover:bg-brand-light-green hover:text-brand-dark-green transition-colors duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Request Sent...' : 'Connect'}
                </button>
            </div>
        )}

        <div className="flex w-full gap-2 mt-auto">
            <button
                onClick={() => onViewDetails(therapist.name)}
                aria-label={`${isDetailsVisible ? 'Hide' : 'View'} details for ${therapist.name}`}
                className="w-full bg-white border border-brand-dark-green text-brand-dark-green font-semibold py-2 px-4 rounded-full hover:bg-brand-light-green/30 transition-colors duration-300 text-sm"
            >
                {isDetailsVisible ? 'Hide Details' : 'Details'}
            </button>
        </div>
    </div>
);

const WaitingView: React.FC<{ therapistName: string; selectedSlot?: ConnectionSlot | null }> = ({ therapistName, selectedSlot }) => (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in-down px-4 py-16 text-center">
        <div className="w-24 h-24 bg-brand-light-green/30 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <UserIcon className="w-14 h-14 text-brand-dark-green" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-brand-dark-green mb-3">Request Sent!</h3>
        <p className="text-base text-brand-dark-green/80 max-w-md mb-2">
            Your session request has been sent to <span className="font-semibold">{therapistName}</span>. Waiting for their confirmation.
        </p>
        {selectedSlot && (
            <div className="bg-white/80 rounded-2xl px-6 py-3 mb-5 shadow-sm">
                <p className="text-sm text-brand-dark-green/60">Requested slot</p>
                <p className="font-bold text-brand-dark-green">{selectedSlot.date} at {selectedSlot.time}</p>
            </div>
        )}
        <p className="text-xs text-brand-dark-green/50 mb-6">
            Tip: Switch to the <strong>Therapist</strong> view in another tab to accept this request.
        </p>
        <div className="flex gap-2">
            {[0, 0.2, 0.4].map((delay, i) => (
                <div key={i} className="w-3 h-3 bg-brand-dark-green rounded-full animate-bounce" style={{ animationDelay: `${delay}s` }} />
            ))}
        </div>
    </div>
);

const SlotSelectionView: React.FC<{
    therapistName: string;
    slots: ConnectionSlot[];
    onSelectSlot: (slot: ConnectionSlot) => void;
}> = ({ therapistName, slots, onSelectSlot }) => {
    const grouped: Record<string, ConnectionSlot[]> = {};
    slots.forEach(s => { if (!grouped[s.date]) grouped[s.date] = []; grouped[s.date].push(s); });

    return (
        <div className="animate-fade-in-down px-4 py-8">
            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-brand-light-green/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClockIcon className="w-10 h-10 text-brand-dark-green" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-brand-dark-green mb-2">Pick Your Slot</h3>
                <p className="text-base text-brand-dark-green/80 max-w-md mx-auto">
                    Choose a convenient time with <span className="font-semibold">{therapistName}</span>. Your request will be sent once you confirm a slot.
                </p>
            </div>
            <div className="max-w-lg mx-auto space-y-6">
                {Object.entries(grouped).map(([date, dateSlots]) => (
                    <div key={date}>
                        <h4 className="font-semibold text-brand-dark-green mb-3 flex items-center gap-2">
                            <ClockIcon className="w-4 h-4" /> {date}
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                            {dateSlots.map(slot => (
                                <button
                                    key={slot.id}
                                    onClick={() => slot.available && onSelectSlot(slot)}
                                    disabled={!slot.available}
                                    className={`py-3 px-4 rounded-2xl text-sm font-semibold transition-all duration-200 ${slot.available
                                        ? 'bg-white border-2 border-brand-dark-green/20 text-brand-dark-green hover:border-brand-dark-green hover:bg-brand-light-green/20 hover:scale-105 cursor-pointer'
                                        : 'bg-gray-100 text-gray-400 line-through cursor-not-allowed'}`}
                                >
                                    {slot.time}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BookedView: React.FC<{
    therapistName: string;
    selectedSlot: ConnectionSlot;
    onContactMethodSelect: (method: ContactMethod) => void;
    showContactOptions: boolean;
    onToggleContactOptions: () => void;
}> = ({ therapistName, selectedSlot, onContactMethodSelect, showContactOptions, onToggleContactOptions }) => {
    const [isSessionSoon, setIsSessionSoon] = useState(false);
    const [showGateMsg, setShowGateMsg] = useState(false);

    // Also poll the store to detect therapist-initiated contact
    const [therapistContact, setTherapistContact] = useState<ContactMethod>(null);
    useEffect(() => {
        const check = () => {
            const conn = getConnection();
            if (conn?.initiatedBy === 'therapist' && conn.contactMethod) {
                setTherapistContact(conn.contactMethod as ContactMethod);
            }
        };
        check();
        const unsub = subscribeToConnection((conn) => {
            if (conn?.initiatedBy === 'therapist' && conn.contactMethod) {
                setTherapistContact(conn.contactMethod as ContactMethod);
            }
        });
        return unsub;
    }, []);

    const handleContactClick = () => {
        if (!isSessionSoon) { setShowGateMsg(true); return; }
        setShowGateMsg(false);
        onToggleContactOptions();
    };

    // If therapist initiated contact, show that
    if (therapistContact) {
        return (
            <div className="flex flex-col items-center justify-center h-full px-4 py-8 text-center animate-fade-in-down">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                    {therapistContact === 'video' ? <VideoIcon className="w-10 h-10 text-yellow-600" /> : <PhoneIcon className="w-10 h-10 text-yellow-600" />}
                </div>
                <h3 className="text-2xl font-bold text-brand-dark-green mb-2">Therapist is calling...</h3>
                <p className="text-base text-brand-dark-green/80 mb-6">
                    <span className="font-semibold">{therapistName}</span> has initiated a {therapistContact} session.
                </p>
                <div className="flex gap-4">
                    <button onClick={() => onContactMethodSelect(therapistContact)} className="bg-green-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-green-600 transition-colors">
                        Answer
                    </button>
                    <button onClick={() => { updateConnection({ contactMethod: null, initiatedBy: undefined }); setTherapistContact(null); }} className="bg-red-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-red-600 transition-colors">
                        Decline
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full animate-fade-in-down px-4 py-8 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-brand-light-green rounded-full flex items-center justify-center mb-6">
                <CheckIcon className="w-12 h-12 sm:w-16 sm:h-16 text-brand-dark-green" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-brand-dark-green mb-3">Session Booked!</h3>
            <p className="text-base text-brand-dark-green/80 mb-2 max-w-md">
                Your session with <span className="font-semibold">{therapistName}</span> is scheduled.
            </p>
            <div className="bg-white/80 rounded-2xl px-6 py-3 mb-5 shadow-sm">
                <p className="text-sm text-brand-dark-green/60">Scheduled for</p>
                <p className="font-bold text-brand-dark-green text-lg">{selectedSlot.date} at {selectedSlot.time}</p>
            </div>

            {/* Simulation toggle for demo */}
            <label className="flex items-center gap-2 text-xs text-brand-dark-green/60 cursor-pointer mb-4 bg-white/60 rounded-full px-4 py-2">
                <input
                    type="checkbox"
                    checked={isSessionSoon}
                    onChange={(e) => { setIsSessionSoon(e.target.checked); setShowGateMsg(false); }}
                    className="h-3 w-3 text-brand-dark-green border-gray-300 rounded"
                />
                Simulate: Session starts in &lt;10 min
            </label>

            {!showContactOptions && (
                <button
                    onClick={handleContactClick}
                    aria-label="Contact therapist"
                    className="bg-brand-dark-green text-white font-semibold py-3 px-8 rounded-full hover:bg-brand-dark-green/90 transition-colors mb-4"
                >
                    Contact Therapist
                </button>
            )}

            {showGateMsg && !showContactOptions && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 max-w-sm animate-fade-in-down">
                    <p className="text-sm text-yellow-800">
                        <strong>Session not started yet.</strong> Voice and video calls are available 10 minutes before your session on <strong>{selectedSlot.date} at {selectedSlot.time}</strong>.
                    </p>
                </div>
            )}

            {showContactOptions && (
                <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-fade-in-down">
                    {(['chat', 'voice', 'video'] as ContactMethod[]).map(method => (
                        <button
                            key={method}
                            onClick={() => {
                                updateConnection({ contactMethod: method!, initiatedBy: 'student' });
                                onContactMethodSelect(method);
                            }}
                            aria-label={`${method} with therapist`}
                            className="flex flex-col items-center gap-2 bg-white/80 p-4 rounded-2xl hover:bg-brand-light-green/30 transition-colors min-w-[100px]"
                        >
                            {method === 'chat' && <ChatIcon className="w-8 h-8 text-brand-dark-green" />}
                            {method === 'voice' && <PhoneIcon className="w-8 h-8 text-brand-dark-green" />}
                            {method === 'video' && <VideoIcon className="w-8 h-8 text-brand-dark-green" />}
                            <span className="text-sm font-semibold text-brand-dark-green capitalize">{method}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// Voice/Video call placeholder
const CallPlaceholder: React.FC<{ type: 'voice' | 'video'; therapistName: string; onEndCall: () => void }> = ({ type, therapistName, onEndCall }) => (
    <div className="fixed inset-0 bg-brand-dark-green/95 flex flex-col items-center justify-center z-50 text-white animate-fade-in-down">
        <div className="w-32 h-32 rounded-full bg-brand-light-green/40 flex items-center justify-center mb-6 animate-pulse">
            <UserIcon className="w-20 h-20 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-2">{therapistName}</h3>
        <p className="text-lg mb-8">{type === 'voice' ? 'Voice call connected...' : 'Video call connected...'}</p>
        <div className="flex gap-2 mb-4">
            {[0, 0.2, 0.4].map((delay, i) => (
                <div key={i} className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: `${delay}s` }} />
            ))}
        </div>
        <button onClick={onEndCall} aria-label="End call" className="mt-8 bg-red-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-red-600 transition-colors">
            End Call
        </button>
    </div>
);

// Full chat interface
const ChatInterface: React.FC<{ therapistName: string; onClose: () => void }> = ({ therapistName, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([{ id: 1, text: "Hello! I'm here to support you. How are you feeling today?", sender: 'therapist', timestamp: new Date() }]);
    const [inputText, setInputText] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;
        if (editingId) {
            setMessages(msgs => msgs.map(m => m.id === editingId ? { ...m, text: inputText } : m));
            setEditingId(null);
        } else {
            setMessages(msgs => [...msgs, { id: Date.now(), text: inputText, sender: 'user', timestamp: new Date(), replyTo: replyingTo || undefined }]);
            setReplyingTo(null);
        }
        setInputText('');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setMessages(msgs => [...msgs, { id: Date.now(), text: '', sender: 'user', timestamp: new Date(), image: reader.result as string }]);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-brand-background flex flex-col z-50">
            <div className="bg-brand-dark-green text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-light-green/40 flex items-center justify-center"><UserIcon className="w-6 h-6 text-white" /></div>
                    <h3 className="font-bold text-lg">{therapistName}</h3>
                </div>
                <button onClick={onClose} aria-label="Close chat" className="text-white text-3xl font-light leading-none">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-background/50">
                {messages.map(message => {
                    const replied = message.replyTo ? messages.find(m => m.id === message.replyTo) : null;
                    return (
                        <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[70%] ${message.sender === 'user' ? 'bg-brand-dark-green text-white' : 'bg-white text-brand-dark-green'} rounded-2xl p-3 shadow-md`}
                                onContextMenu={(e) => { if (message.sender === 'user') { e.preventDefault(); setEditingId(message.id); setInputText(message.text); } }}
                            >
                                {replied && <div className={`${message.sender === 'user' ? 'bg-white/20 border-white/40' : 'bg-brand-dark-green/10 border-brand-dark-green/30'} rounded-lg p-2 mb-2 text-sm border-l-4`}><p className="font-semibold text-xs mb-1">{replied.sender === 'user' ? 'You' : therapistName}</p><p className="truncate opacity-80">{replied.text || '[Image]'}</p></div>}
                                {message.image && <img src={message.image} alt="Sent" className="rounded-lg mb-2 max-w-full" />}
                                {message.text && <p className="break-words">{message.text}</p>}
                                <div className="flex items-center justify-between gap-2 mt-1">
                                    <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <button onClick={() => setReplyingTo(message.id)} className="text-xs underline opacity-70 hover:opacity-100">Reply</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            {replyingTo && (
                <div className="bg-white border-t border-brand-light-green/30 p-3 px-4 flex items-center justify-between">
                    <div className="flex-1 border-l-4 border-brand-dark-green pl-3">
                        <p className="text-xs font-semibold text-brand-dark-green mb-1">{messages.find(m => m.id === replyingTo)?.sender === 'user' ? 'You' : therapistName}</p>
                        <p className="text-sm text-brand-dark-green/70 truncate">{messages.find(m => m.id === replyingTo)?.text || '[Image]'}</p>
                    </div>
                    <button onClick={() => setReplyingTo(null)} className="text-brand-dark-green/70 hover:text-brand-dark-green ml-3">✕</button>
                </div>
            )}
            {editingId && (
                <div className="bg-yellow-100 p-2 px-4 flex items-center justify-between">
                    <p className="text-sm text-brand-dark-green font-semibold">Editing message...</p>
                    <button onClick={() => { setEditingId(null); setInputText(''); }} className="text-brand-dark-green/70 hover:text-brand-dark-green">✕</button>
                </div>
            )}
            <div className="bg-white p-4 flex items-center gap-2">
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} aria-label="Attach image" className="p-2 text-brand-dark-green hover:bg-brand-light-green/30 rounded-full transition-colors"><ImageIcon className="w-6 h-6" /></button>
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="flex-1 px-4 py-2 border border-brand-light-green/50 rounded-full focus:ring-brand-dark-green focus:border-brand-dark-green bg-white/50" />
                <button onClick={handleSend} aria-label="Send message" disabled={!inputText.trim()} className="p-2 bg-brand-dark-green text-white rounded-full hover:bg-brand-dark-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><SendIcon className="w-6 h-6" /></button>
            </div>
        </div>
    );
};

// ─── Main Modal ───────────────────────────────────────────────────────────────

const TherapistSelectionModal: React.FC<TherapistSelectionModalProps> = ({ isOpen, onClose, onBookSession, onConnectionNotification }) => {
    const [showHistory, setShowHistory] = useState(false);
    const [detailedTherapist, setDetailedTherapist] = useState<string | null>(null);
    const [connectedTherapist, setConnectedTherapist] = useState<string | null>(null);
    const [modalView, setModalView] = useState<ModalView>('list');
    const [availableSlots, setAvailableSlots] = useState<ConnectionSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<ConnectionSlot | null>(null);
    const [showContactOptions, setShowContactOptions] = useState(false);
    const [contactMethod, setContactMethod] = useState<ContactMethod>(null);
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Poll connectionStore when in waiting state
    const startPolling = useCallback((therapistName: string) => {
        pollingRef.current = setInterval(() => {
            const conn = getConnection();
            if (!conn) return;
            if (conn.therapistName === therapistName && conn.status === 'accepted') {
                clearInterval(pollingRef.current!);
                // Slot was already chosen before request — go straight to booked
                setModalView('booked');
                onConnectionNotification(`Connection confirmed! ${therapistName} has accepted your session request.`);
                if (conn.selectedSlot) {
                    onBookSession(therapistName, conn.selectedSlot.date + ' ' + conn.selectedSlot.time);
                }
            }
            if (conn.status === 'rejected') {
                clearInterval(pollingRef.current!);
                setConnectedTherapist(null);
                setSelectedSlot(null);
                setModalView('list');
                alert(`${therapistName} has declined your request. Please choose another therapist.`);
            }
        }, 500);

        const unsub = subscribeToConnection((conn) => {
            if (!conn) return;
            if (conn.therapistName === therapistName && conn.status === 'accepted') {
                if (pollingRef.current) clearInterval(pollingRef.current);
                setModalView('booked');
                onConnectionNotification(`Connection confirmed! ${therapistName} has accepted your session request.`);
                if (conn.selectedSlot) {
                    onBookSession(therapistName, conn.selectedSlot.date + ' ' + conn.selectedSlot.time);
                }
            }
        });
        return unsub;
    }, [onConnectionNotification, onBookSession]);

    useEffect(() => {
        if (!isOpen) {
            if (pollingRef.current) clearInterval(pollingRef.current);
            setShowHistory(false);
            setDetailedTherapist(null);
            setConnectedTherapist(null);
            setModalView('list');
            setAvailableSlots([]);
            setSelectedSlot(null);
            setShowContactOptions(false);
            setContactMethod(null);
        }
    }, [isOpen]);

    const handleViewDetails = (name: string) => {
        setDetailedTherapist(prev => prev === name ? null : name);
    };

    const handleConnect = (name: string) => {
        setConnectedTherapist(name);
        // Show slot picker FIRST, before sending request to therapist
        setAvailableSlots(generateAvailableSlots());
        setModalView('slotSelection');
    };

    const handleSlotSelect = (slot: ConnectionSlot) => {
        setSelectedSlot(slot);
        // NOW send the connection request to therapist with the chosen slot
        const record: ConnectionRecord = {
            studentName: 'Student',
            therapistName: connectedTherapist!,
            status: 'pending',
            requestedAt: new Date().toISOString(),
            selectedSlot: slot,
        };
        setConnection(record);
        setModalView('waiting');
        // Start polling for therapist acceptance
        startPolling(connectedTherapist!);
    };

    const handleContactMethodSelect = (method: ContactMethod) => {
        setContactMethod(method);
    };

    if (!isOpen) return null;

    if (contactMethod === 'voice' || contactMethod === 'video') {
        return <CallPlaceholder type={contactMethod} therapistName={connectedTherapist || ''} onEndCall={() => { setContactMethod(null); updateConnection({ contactMethod: null, initiatedBy: undefined }); }} />;
    }

    if (contactMethod === 'chat') {
        return <ChatInterface therapistName={connectedTherapist || ''} onClose={() => { setContactMethod(null); updateConnection({ contactMethod: null, initiatedBy: undefined }); }} />;
    }

    const currentList = showHistory ? previousTherapists : therapists;

    const getModalTitle = () => {
        switch (modalView) {
            case 'slotSelection': return 'Pick a Time Slot';
            case 'waiting': return 'Request Sent';
            case 'booked': return 'Session Confirmed';
            default: return 'Choose a Therapist';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-brand-background rounded-2xl sm:rounded-[2rem] shadow-2xl w-full max-w-6xl min-h-[400px] sm:min-h-[500px] max-h-[95vh] flex flex-col">
                <header className="flex items-center justify-between p-3 sm:p-4 border-b border-brand-light-green/50">
                    <h2 className="text-lg sm:text-xl font-bold text-brand-dark-green">{getModalTitle()}</h2>
                    <div className="flex items-center gap-2 sm:gap-4">
                        {modalView === 'list' && (
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                aria-label={showHistory ? 'Show available therapists' : 'Show previously connected therapists'}
                                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-brand-dark-green font-semibold p-2 rounded-2xl hover:bg-brand-light-green/30"
                            >
                                <HistoryIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="hidden sm:inline">{showHistory ? 'Available' : 'History'}</span>
                            </button>
                        )}
                        <button onClick={onClose} aria-label="Close therapist selection" className="text-brand-dark-green/70 hover:text-brand-dark-green text-3xl font-light leading-none">&times;</button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    {modalView === 'list' && (
                        <>
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-brand-dark-green mb-2">
                                    {showHistory ? 'Previously Connected' : 'Available for You'}
                                </h3>
                                <p className="text-brand-dark-green/80 max-w-2xl mx-auto">
                                    {showHistory
                                        ? 'Here are the therapists you have connected with in the past.'
                                        : 'Click Details to learn more, then Connect to send a request to your chosen therapist.'}
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-8">
                                {currentList.map(therapist => (
                                    <div key={therapist.name} className="w-full max-w-xs">
                                        <TherapistCard
                                            therapist={therapist}
                                            isDetailsVisible={detailedTherapist === therapist.name}
                                            isPending={connectedTherapist === therapist.name}
                                            onViewDetails={handleViewDetails}
                                            onConnect={handleConnect}
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {modalView === 'waiting' && connectedTherapist && (
                        <WaitingView therapistName={connectedTherapist} selectedSlot={selectedSlot} />
                    )}

                    {modalView === 'slotSelection' && connectedTherapist && (
                        <SlotSelectionView
                            therapistName={connectedTherapist}
                            slots={availableSlots}
                            onSelectSlot={handleSlotSelect}
                        />
                    )}

                    {modalView === 'booked' && connectedTherapist && selectedSlot && (
                        <BookedView
                            therapistName={connectedTherapist}
                            selectedSlot={selectedSlot}
                            onContactMethodSelect={handleContactMethodSelect}
                            showContactOptions={showContactOptions}
                            onToggleContactOptions={() => setShowContactOptions(!showContactOptions)}
                        />
                    )}
                </div>

                {modalView === 'list' && (
                    <footer className="p-4 border-t border-brand-light-green/50 text-right">
                        <button onClick={onClose} aria-label="Close therapist selection" className="bg-brand-dark-green text-white font-semibold py-2 px-8 rounded-full hover:bg-brand-dark-green/90 transition-colors">
                            Close
                        </button>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default TherapistSelectionModal;