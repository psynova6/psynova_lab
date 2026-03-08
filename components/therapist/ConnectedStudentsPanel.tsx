import React, { useState, useEffect } from 'react';
import StudentAnalysisModal from './StudentAnalysisModal';
import {
    getConnection,
    setConnection,
    updateConnection,
    subscribeToConnection,
    type ConnectionRecord,
} from '../../utils/connectionStore';

// ─── Icons ─────────────────────────────────────────────────────────────────────

const UserIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

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
        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const XIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const BellIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

// ─── Voice/Video Call Placeholder ─────────────────────────────────────────────

const CallScreen: React.FC<{ type: 'voice' | 'video'; studentName: string; onEndCall: () => void }> = ({ type, studentName, onEndCall }) => (
    <div className="fixed inset-0 bg-brand-dark-green/95 flex flex-col items-center justify-center z-[200] text-white">
        <div className="w-32 h-32 rounded-full bg-brand-light-green/40 flex items-center justify-center mb-6 animate-pulse">
            <UserIcon className="w-20 h-20 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-2">{studentName}</h3>
        <p className="text-lg mb-8">{type === 'voice' ? 'Voice call connected...' : 'Video call connected...'}</p>
        <div className="flex gap-2 mb-4">
            {[0, 0.2, 0.4].map((d, i) => <div key={i} className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />)}
        </div>
        <button onClick={onEndCall} className="mt-8 bg-red-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-red-600 transition-colors">
            End Call
        </button>
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

type PanelTab = 'requests' | 'connected';

const ConnectedStudentsPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<PanelTab>('requests');
    const [connection, setConn] = useState<ConnectionRecord | null>(null);
    const [showContactOptions, setShowContactOptions] = useState(false);
    const [activeCall, setActiveCall] = useState<{ type: 'voice' | 'video'; studentName: string } | null>(null);
    const [isSessionSoon, setIsSessionSoon] = useState(false);
    const [showGateMsg, setShowGateMsg] = useState(false);
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

    // Load initial state and subscribe to changes
    useEffect(() => {
        let currentConn = getConnection();
        // Inject mock data if no connection exists
        if (!currentConn) {
            currentConn = {
                studentName: 'Alex Mercer',
                therapistName: 'Dr. Therapist',
                status: 'accepted',
                requestedAt: new Date().toISOString(),
                selectedSlot: {
                    id: 999,
                    date: 'Today',
                    time: '10:00 AM',
                    available: false
                }
            };
            setConnection(currentConn);
        }
        setConn(currentConn);
        // Automatically set tab to 'connected' since we just injected one
        if (currentConn?.status === 'accepted') {
            setActiveTab('connected');
        }

        const unsub = subscribeToConnection((conn) => setConn(conn));
        // Also poll every second for same-tab updates
        const interval = setInterval(() => setConn(getConnection()), 1000);
        return () => { unsub(); clearInterval(interval); };
    }, []);

    const handleAccept = () => {
        if (!connection) return;
        // Student already chose the slot — just confirm acceptance
        updateConnection({ status: 'accepted' });
        setActiveTab('connected');
    };

    const handleReject = () => {
        if (!connection) return;
        updateConnection({ status: 'rejected' });
    };

    const handleInitiateContact = (method: 'chat' | 'voice' | 'video') => {
        if (!connection) return;
        if (!isSessionSoon) { setShowGateMsg(true); return; }
        setShowGateMsg(false);
        updateConnection({ contactMethod: method, initiatedBy: 'therapist' });
        if (method === 'voice' || method === 'video') {
            setActiveCall({ type: method, studentName: connection.studentName });
        }
    };

    const handleEndCall = () => {
        setActiveCall(null);
        updateConnection({ contactMethod: null, initiatedBy: undefined });
    };

    // Detect when student initiates a call
    const studentInitiatedContact = connection?.initiatedBy === 'student' && connection?.contactMethod && connection?.status === 'accepted';

    // Count pending requests
    const pendingCount = connection?.status === 'pending' ? 1 : 0;
    const acceptedCount = connection?.status === 'accepted' ? 1 : 0;

    if (activeCall) {
        return <CallScreen type={activeCall.type} studentName={activeCall.studentName} onEndCall={handleEndCall} />;
    }

    return (
        <div className="bg-white/90 rounded-3xl shadow-premium p-6 sm:p-8 border border-brand-light-green/20 animate-fade-in-down h-full">
            <h2 className="text-xl sm:text-2xl font-bold text-brand-dark-green mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-light-green/20 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-brand-dark-green" />
                </div>
                Student Connections
            </h2>

            {/* Tabs */}
            <div className="flex gap-1.5 flex-wrap bg-brand-background/50 border border-brand-light-green/20 rounded-2xl sm:rounded-full p-1.5 mb-6 w-fit">
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all ${activeTab === 'requests' ? 'bg-white text-brand-dark-green shadow-sm border border-brand-light-green/30' : 'text-brand-dark-green/60 hover:text-brand-dark-green hover:bg-white/50 border border-transparent'}`}
                >
                    <BellIcon className="w-4 h-4" />
                    Connection Requests
                    {pendingCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {pendingCount}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('connected')}
                    className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all ${activeTab === 'connected' ? 'bg-white text-brand-dark-green shadow-sm border border-brand-light-green/30' : 'text-brand-dark-green/60 hover:text-brand-dark-green hover:bg-white/50 border border-transparent'}`}
                >
                    <CheckIcon className="w-4 h-4" />
                    Connected Students
                    {acceptedCount > 0 && (
                        <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {acceptedCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Connection Requests Tab */}
            {activeTab === 'requests' && (
                <div>
                    {connection?.status === 'pending' ? (
                        <div className="flex items-start gap-4 p-5 bg-brand-background/30 border border-brand-light-green/30 rounded-2xl shadow-sm animate-fade-in-down hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-brand-light-green/20 flex items-center justify-center flex-shrink-0">
                                <UserIcon className="w-6 h-6 text-brand-dark-green" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-brand-dark-green">{connection.studentName}</p>
                                <p className="text-sm text-brand-dark-green/70">Requested connection</p>
                                {connection.selectedSlot && (
                                    <div className="mt-2 bg-white rounded-xl px-3 py-2 inline-block border border-brand-light-green/40">
                                        <p className="text-xs text-brand-dark-green/60">Requested slot</p>
                                        <p className="text-sm font-bold text-brand-dark-green">{connection.selectedSlot.date} at {connection.selectedSlot.time}</p>
                                    </div>
                                )}
                                <p className="text-xs text-brand-dark-green/50 mt-2">
                                    {new Date(connection.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap gap-2 flex-shrink-0 w-full sm:w-auto mt-3 sm:mt-0">
                                <button
                                    onClick={handleAccept}
                                    aria-label="Accept connection request"
                                    className="flex items-center gap-1.5 bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                                >
                                    <CheckIcon className="w-4 h-4" /> Accept
                                </button>
                                <button
                                    onClick={handleReject}
                                    aria-label="Reject connection request"
                                    className="flex items-center gap-1.5 bg-red-100 text-red-600 text-sm font-semibold px-4 py-2 rounded-full hover:bg-red-200 transition-colors"
                                >
                                    <XIcon className="w-4 h-4" /> Decline
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-brand-dark-green/50">
                            <BellIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No pending connection requests.</p>
                            <p className="text-xs mt-1">New requests from students will appear here.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Connected Students Tab */}
            {activeTab === 'connected' && (
                <div>
                    {connection?.status === 'accepted' ? (
                        <div className="space-y-4">
                            <div className="p-5 bg-brand-background/30 border border-brand-light-green/30 rounded-2xl shadow-sm animate-fade-in-down hover:shadow-md transition-shadow">
                                <div className="flex flex-wrap md:flex-nowrap items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-brand-light-green/20 flex items-center justify-center shadow-inner">
                                        <UserIcon className="w-6 h-6 text-brand-dark-green" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-brand-dark-green">{connection.studentName}</p>
                                        {connection.selectedSlot ? (
                                            <p className="text-sm text-brand-dark-green/70">
                                                Session: <strong>{connection.selectedSlot.date}</strong> at <strong>{connection.selectedSlot.time}</strong>
                                            </p>
                                        ) : (
                                            <p className="text-sm text-brand-dark-green/50 italic">No slot scheduled yet</p>
                                        )}
                                    </div>
                                    <span className="md:ml-auto w-full md:w-auto text-center md:text-left bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Connected</span>
                                </div>

                                {/* Incoming call from student */}
                                {studentInitiatedContact && (
                                    <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-3 mb-3 animate-fade-in-down flex items-center justify-between">
                                        <p className="text-sm font-semibold text-yellow-800">
                                            📞 {connection.studentName} is initiating a {connection.contactMethod} session...
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setActiveCall({ type: connection.contactMethod as 'voice' | 'video', studentName: connection.studentName })}
                                                className="bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-green-600 transition-colors"
                                            >Answer</button>
                                            <button
                                                onClick={() => updateConnection({ contactMethod: null, initiatedBy: undefined })}
                                                className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-red-200 transition-colors"
                                            >Decline</button>
                                        </div>
                                    </div>
                                )}

                                {/* Simulation toggle */}
                                <label className="flex items-center gap-2 text-xs text-brand-dark-green/60 cursor-pointer mb-3 w-fit">
                                    <input type="checkbox" checked={isSessionSoon} onChange={(e) => { setIsSessionSoon(e.target.checked); setShowGateMsg(false); }} className="h-3 w-3" />
                                    Simulate: Session starts in &lt;10 min
                                </label>

                                {/* Contact buttons (therapist initiating) */}
                                {!showContactOptions ? (
                                    <div className="flex flex-col sm:flex-row gap-3 w-full animate-fade-in-down">
                                        <button
                                            onClick={() => { if (!isSessionSoon) { setShowGateMsg(true); return; } setShowGateMsg(false); setShowContactOptions(true); }}
                                            className="flex-1 bg-brand-dark-green text-white font-semibold py-2.5 rounded-full hover:bg-brand-dark-green/90 transition-colors text-sm"
                                        >
                                            Connect
                                        </button>
                                        <button
                                            onClick={() => setIsAnalysisOpen(true)}
                                            className="flex-1 bg-white border border-brand-dark-green text-brand-dark-green font-semibold py-2.5 rounded-full hover:bg-brand-light-green/30 transition-colors text-sm"
                                        >
                                            Analysis
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-fade-in-down w-full">
                                        {(['chat', 'voice', 'video'] as const).map(method => (
                                            <button
                                                key={method}
                                                onClick={() => handleInitiateContact(method)}
                                                className="flex-1 flex flex-col items-center gap-2 bg-white/80 p-4 rounded-2xl hover:bg-brand-light-green/30 transition-colors border border-brand-light-green/30"
                                            >
                                                {method === 'chat' && <ChatIcon className="w-8 h-8 text-brand-dark-green" />}
                                                {method === 'voice' && <PhoneIcon className="w-8 h-8 text-brand-dark-green" />}
                                                {method === 'video' && <VideoIcon className="w-8 h-8 text-brand-dark-green" />}
                                                <span className="text-sm font-semibold text-brand-dark-green capitalize">{method}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {showGateMsg && !showContactOptions && (
                                    <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl p-3 mt-3 w-full">
                                        Contact options are available only 10 minutes before the scheduled session.
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-brand-dark-green/50">
                            <CheckIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No connected students yet.</p>
                            <p className="text-xs mt-1">Accept a request from the "Connection Requests" tab.</p>
                        </div>
                    )}
                </div>
            )}

            {connection && activeTab === 'connected' && (
                <StudentAnalysisModal
                    isOpen={isAnalysisOpen}
                    onClose={() => setIsAnalysisOpen(false)}
                    studentName={connection.studentName}
                    sessions={[]} // Use empty or mock data for now
                    severityLevel="mild" // Based on connected student mock structure
                    sessionsCompleted={5}
                />
            )}
        </div>
    );
};

export default ConnectedStudentsPanel;
