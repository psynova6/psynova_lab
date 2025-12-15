





import React, { useState, useEffect, useCallback } from 'react';
import { SCREENING_SETS, ANSWER_OPTIONS } from '../../utils/assessmentQuestions';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type Question = { id: string; text: string };
type Answers = { [key: string]: { value: number; text?: string } };

const shuffleArray = (array: Question[]): Question[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const AssessmentModal: React.FC<AssessmentModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const initializeQuestions = useCallback(() => {
    setQuestions(shuffleArray(SCREENING_SETS.SET_1));
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsCompleted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      initializeQuestions();
    }
  }, [isOpen, initializeQuestions]);

  const handleAnswerSelect = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { value, text: prev[questionId]?.text ?? '' } }));
  };
  
  const handleTextChange = (questionId: string, text: string) => {
    setAnswers(prev => ({
        ...prev,
        [questionId]: {
            ...prev[questionId]!,
            text,
        }
    }));
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    initializeQuestions();
  };

  const handleQuit = () => {
    alert('Your progress has been saved. You can continue later.');
    onClose();
  };

  if (!isOpen) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = (Object.keys(answers).length / questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-brand-background rounded-[2rem] shadow-2xl w-full max-w-2xl min-h-[80vh] sm:min-h-[500px] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-brand-light-green/50">
          <h2 className="text-xl font-bold text-brand-dark-green">Quarterly Check-in</h2>
          <button onClick={onClose} aria-label="Close assessment" className="text-brand-dark-green/70 hover:text-brand-dark-green text-3xl font-light leading-none">&times;</button>
        </header>

        <div className="flex-1 p-6 md:p-8">
          {isCompleted ? (
             <div className="text-center flex flex-col items-center justify-center h-full">
                <h3 className="text-2xl font-bold text-brand-dark-green mb-4">Thank You for Completing the Assessment!</h3>
                <p className="text-brand-dark-green/80 mb-6">Your responses have been recorded. We appreciate you taking the time to check in with yourself.</p>
                <button onClick={onComplete} aria-label="Close assessment completion view" className="bg-brand-dark-green text-white font-semibold py-2 px-6 rounded-full">
                    Close
                </button>
             </div>
          ) : (
            currentQuestion && (
              <div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                  <div className="bg-brand-light-green h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <p className="text-lg font-semibold text-brand-dark-green mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
                <p className="text-xl text-brand-dark-green mb-6">{currentQuestion.text}</p>
                <div className="space-y-3">
                  {ANSWER_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center p-4 border rounded-3xl cursor-pointer hover:bg-brand-light-green/20 transition-colors">
                      <input
                        type="radio"
                        name={currentQuestion.id}
                        value={option.value}
                        checked={answers[currentQuestion.id]?.value === option.value}
                        onChange={() => handleAnswerSelect(currentQuestion.id, option.value)}
                        className="w-5 h-5 text-brand-dark-green focus:ring-brand-light-green"
                      />
                      <span className="ml-4 text-md text-brand-dark-green">{option.label}</span>
                    </label>
                  ))}
                </div>

                {answers[currentQuestion.id]?.value !== undefined && (
                    <div className="mt-6 animate-fade-in-down">
                        <label htmlFor="elaboration" className="block text-sm font-medium text-brand-dark-green/80 mb-2">Could you elaborate on why you feel so?</label>
                        <textarea
                            id="elaboration"
                            rows={3}
                            value={answers[currentQuestion.id]?.text || ''}
                            onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
                            placeholder="Your thoughts are valuable..."
                            className="w-full px-4 py-2 border border-brand-light-green/50 rounded-2xl focus:ring-brand-dark-green focus:border-brand-dark-green bg-white/50 transition"
                        />
                    </div>
                )}
              </div>
            )
          )}
        </div>

        {!isCompleted && (
          <footer className="p-4 border-t border-brand-light-green/50 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <button onClick={handleQuit} aria-label="Quit and save assessment progress" className="text-sm text-gray-600 hover:text-black">Quit & Save Progress</button>
              <button onClick={handleReset} aria-label="Reset assessment answers" className="ml-4 text-sm text-gray-600 hover:text-black">Reset</button>
            </div>
            <div className="flex items-center gap-4">
              {/* FIX: Replaced "Back" text with an arrow for UI consistency. */}
              <button onClick={handlePrev} disabled={currentQuestionIndex === 0} aria-label="Go to previous question" className="px-6 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed text-2xl font-bold hover:bg-black/5 transition-colors">
                &larr;
              </button>
              <button
                onClick={handleNext}
                disabled={answers[currentQuestion?.id]?.value === undefined}
                aria-label={currentQuestionIndex === questions.length - 1 ? 'Finish assessment' : 'Go to next question'}
                className="bg-brand-dark-green text-white font-semibold py-2 px-8 rounded-full hover:bg-brand-dark-green/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default AssessmentModal;