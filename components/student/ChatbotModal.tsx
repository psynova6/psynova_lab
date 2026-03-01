

import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Message } from '../../types';
import { synaAiService } from '../../services/synaAiService';
import { UserIcon, SendIcon } from '../common/icons';

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatHistory: Message[];
  onNewMessage: (messages: Message[]) => void;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose, chatHistory, onNewMessage }) => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (isOpen && chatHistory.length === 0) {
        setIsLoading(true);
        try {
          const data = await synaAiService.getChatHistory();
          if (data.history && data.history.length > 0) {
            const formattedHistory: Message[] = data.history.map((item: any) => ({
              role: item.role === 'bot' ? 'model' : 'user',
              text: item.message
            }));
            onNewMessage(formattedHistory);
          } else {
            // Initial greeting if history is truly empty
            onNewMessage([
              {
                role: 'model',
                text: "Hello! I'm Syna, your personal support assistant. How are you feeling today?",
              },
            ]);
          }
        } catch (error) {
          console.error("Failed to fetch chat history:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchHistory();
  }, [isOpen, chatHistory.length, onNewMessage]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: userInput };
    const newMessages = [...chatHistory, userMessage];
    onNewMessage(newMessages);

    const currentInput = userInput;
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await synaAiService.sendMessage(currentInput);
      const modelMessage: Message = {
        role: 'model',
        text: response.reply
      };
      onNewMessage([...newMessages, modelMessage]);
    } catch (error) {
      console.error("Syna AI Error:", error);
      const errorMessage: Message = {
        role: 'model',
        text: "I'm having a little trouble connecting right now, but I'm still here with you. Please try again in a moment."
      };
      onNewMessage([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-brand-background rounded-[2rem] shadow-2xl w-full max-w-lg h-full max-h-[700px] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-brand-light-green/50">
          <h2 className="text-xl font-bold text-brand-dark-green">Chat with Syna</h2>
          <button onClick={onClose} aria-label="Close chat" className="text-brand-dark-green/70 hover:text-brand-dark-green text-3xl font-light leading-none">&times;</button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-brand-light-green flex items-center justify-center text-brand-dark-green font-bold text-lg flex-shrink-0">S</div>
              )}
              <div className={`max-w-[80%] rounded-3xl px-4 py-2 ${msg.role === 'user' ? 'bg-brand-dark-green text-white rounded-br-none' : 'bg-white text-brand-dark-green rounded-bl-none'}`}>
                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 flex-shrink-0">
                  <UserIcon className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-light-green flex items-center justify-center text-brand-dark-green font-bold text-lg">S</div>
              <div className="max-w-[80%] rounded-3xl px-4 py-2 bg-white text-brand-dark-green rounded-bl-none">
                <div className="flex items-center space-x-1">
                  <span className="h-2 w-2 bg-brand-light-green rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-brand-light-green rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-brand-light-green rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <footer className="p-4 border-t border-brand-light-green/50">
          <div className="flex items-center bg-white rounded-full p-1">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              aria-label="Your message to Syna"
              className="flex-1 bg-transparent px-4 py-2 text-brand-dark-green focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !userInput.trim()}
              aria-label="Send message"
              className="bg-brand-dark-green rounded-full p-2 text-white hover:bg-brand-light-green hover:text-brand-dark-green disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatbotModal;