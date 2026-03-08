import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../../types';
import { synaAiService } from '../../services/synaAiService';
import { UserIcon, SendIcon } from '../common/icons';

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Syna glowing orb avatar — from Stitch chatbot design
const SynaOrb = () => (
  <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
    <div className="absolute inset-0 rounded-full blur-[6px] animate-pulse" style={{ background: 'rgba(35,83,39,0.30)' }} />
    <div
      className="relative w-6 h-6 rounded-full border border-white/40 shadow-sm"
      style={{ background: 'linear-gradient(to top right, #235328, #4a8a4f)' }}
    />
  </div>
);

const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose }) => {
  const [localHistory, setLocalHistory] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { scrollToBottom(); }, [localHistory]);

  useEffect(() => {
    if (isOpen) loadHistory();
  }, [isOpen]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await synaAiService.getPrimaryHistory();
      let formatted: Message[] = data.history.map((item: any) => ({
        role: item.role === 'bot' || item.role === 'model' ? 'model' : 'user',
        text: item.message,
        timestamp: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      if (formatted.length === 0) {
        formatted = [{ role: 'model', text: "Hello! I'm Syna, your AI wellness companion. How are you feeling today?" }];
      }
      setLocalHistory(formatted);
    } catch { }
    finally { setIsLoading(false); }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;
    const userMessage: Message = {
      role: 'user', text: userInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updatedHistory = [...localHistory, userMessage];
    setLocalHistory(updatedHistory);
    const currentInput = userInput;
    setUserInput('');
    setIsLoading(true);
    try {
      const response = await synaAiService.sendMessage(currentInput);
      setLocalHistory([...updatedHistory, { role: 'model', text: response.reply, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch {
      setLocalHistory([...updatedHistory, { role: 'model', text: "I'm having a little trouble connecting right now, but I'm still here with you. Please try again in a moment." }]);
    } finally { setIsLoading(false); }
  };

  if (!isOpen) return null;

  return (
    // Frosted glass backdrop — from Stitch chatbot design
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-md" onClick={onClose} />

      {/* Bottom-sheet modal — from Stitch design */}
      <div className="animate-scale-in relative w-full max-w-lg h-[88%] flex flex-col rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.12)] border-t border-white/50 overflow-hidden"
        style={{ background: '#f2ede4' }}>

        {/* Drag handle */}
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="h-1.5 w-12 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-bold tracking-tight text-brand-dark-green">Chat with Syna</h2>
          <button
            onClick={onClose}
            aria-label="Close chat"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-brand-dark-green hover:rotate-90 transition-all duration-200"
          >
            <span className="text-2xl font-light leading-none">&times;</span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-5 custom-scrollbar">
          {localHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end gap-3 w-full ${msg.role === 'user' ? 'justify-end msg-in-right' : 'msg-in-left'}`}
              style={{ animationDelay: `${Math.min(index * 40, 200)}ms` }}
            >
              {msg.role === 'model' && <SynaOrb />}

              <div className={`flex flex-col gap-1 max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <span className="text-xs font-medium text-brand-dark-green/50 mx-1">
                  {msg.role === 'model' ? 'Syna' : 'You'}
                </span>
                <div className={`px-5 py-3.5 leading-relaxed text-sm ${msg.role === 'user'
                    ? 'bg-brand-dark-green text-white rounded-2xl rounded-br-none'
                    : 'text-brand-dark-green rounded-2xl rounded-bl-none border border-brand-dark-green/10'
                  }`}
                  style={msg.role === 'model' ? { background: 'linear-gradient(to bottom right, #ffffff, #f8f5f0)' } :
                    { boxShadow: 'inset 1px 2px 4px rgba(255,255,255,0.15), 0 2px 4px rgba(35,83,39,0.2)' }}
                >
                  <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                  {msg.timestamp && (
                    <span className={`block text-[9px] mt-1 text-right opacity-40 font-bold uppercase`}>
                      {msg.timestamp}
                    </span>
                  )}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-10 h-10 shrink-0 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                  <UserIcon className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {/* Waveform typing indicator — from Stitch design */}
          {isLoading && (
            <div className="flex items-end gap-3 msg-in-left">
              <SynaOrb />
              <div className="rounded-2xl rounded-bl-none px-4 py-3 border border-brand-dark-green/10 flex items-center gap-1.5 h-[42px]"
                style={{ background: 'linear-gradient(to bottom right, #ffffff, #f8f5f0)' }}>
                <div className="w-1.5 h-1.5 bg-brand-dark-green/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-2.5 bg-brand-dark-green/80 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-brand-dark-green/60 rounded-full animate-bounce" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area — from Stitch design */}
        <div className="p-4 pt-2 pb-6">
          <div className="flex items-center gap-2 bg-white rounded-full p-1.5 border border-slate-200 focus-within:border-brand-light-green focus-within:ring-2 focus-within:ring-brand-light-green/20 shadow-sm transition-all duration-200">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Message Syna..."
              aria-label="Your message to Syna"
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-sm text-brand-dark-green placeholder-slate-400 outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !userInput.trim()}
              aria-label="Send message"
              className="w-10 h-10 bg-brand-dark-green rounded-full flex items-center justify-center text-white shrink-0
                         shadow-[0_2px_8px_rgba(35,83,39,0.3)] hover:bg-brand-light-green hover:text-brand-dark-green
                         disabled:bg-gray-300 disabled:cursor-not-allowed
                         transition-all duration-200 active:scale-95 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <SendIcon className="w-4 h-4 relative z-10" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal;
