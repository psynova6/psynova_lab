import React from 'react';
import { CalendarIcon } from '../common/icons';
import type { Session } from '../../types';

interface SessionHistoryProps {
  sessionHistory: Session[];
}

const SessionHistory: React.FC<SessionHistoryProps> = React.memo(({ sessionHistory }) => (
  <div className="bg-white/60 rounded-[2rem] shadow-lg p-6 w-full">
    <h4 className="font-bold text-brand-dark-green mb-4">Recent Sessions</h4>
    {sessionHistory.length > 0 ? (
      <ul className="space-y-3">
        {sessionHistory.map((session, index) => (
          <li key={index} className="flex items-center justify-between p-2 rounded-2xl hover:bg-brand-light-green/20">
            <div className="flex items-center">
              <CalendarIcon className="w-5 h-5 mr-3 text-brand-dark-green/70" />
              <span className="font-medium text-brand-dark-green">{session.date} - with {session.therapistName}</span>
            </div>
            <span className="text-sm text-brand-dark-green/80 font-semibold">{session.status}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-center text-brand-dark-green/70 py-4">You have no recent sessions.</p>
    )}
  </div>
));

interface ProgressTrackerProps {
  sessionHistory: Session[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = React.memo(({ sessionHistory }) => {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark-green">Your Session History</h2>
        <p className="text-lg text-brand-dark-green/80 mt-2 max-w-2xl mx-auto">
          Review your recent therapy sessions to track your journey.
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        <SessionHistory sessionHistory={sessionHistory} />
      </div>
    </section>
  );
});

export default ProgressTracker;