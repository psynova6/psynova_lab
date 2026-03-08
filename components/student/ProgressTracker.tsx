import React from 'react';
import { CalendarIcon } from '../common/icons';
import type { Session } from '../../types';

interface SessionHistoryProps {
  sessionHistory: Session[];
}

const SessionHistory: React.FC<SessionHistoryProps> = React.memo(({ sessionHistory }) => (
  <div
    className="rounded-[2rem] p-6 shadow-sm border border-white/50 animate-fade-in-down"
    style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
  >
    <div className="flex items-center justify-between mb-6">
      <h3 className="font-bold text-xl text-brand-dark-green">Session History</h3>
    </div>

    {sessionHistory.length > 0 ? (
      // Timeline container — gradient left border from Stitch design
      <div
        className="relative pl-5 space-y-6"
        style={{
          borderLeft: '2px solid transparent',
          backgroundImage: 'linear-gradient(white, white), linear-gradient(to bottom, #92bb80, transparent)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        {sessionHistory.map((session, index) => (
          <div
            key={index}
            className="relative flex items-center gap-4 animate-fade-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {/* Timeline dot — alternating primary/accent from Stitch */}
            <div
              className="absolute -left-[27px] w-3 h-3 rounded-full border-2 border-white"
              style={{ background: index % 2 === 0 ? '#235328' : '#92bb80' }}
              aria-hidden="true"
            />

            {/* Icon thumbnail */}
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-dark-green border border-slate-100 shrink-0">
              <CalendarIcon className="w-5 h-5" />
            </div>

            {/* Session info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-brand-dark-green text-sm truncate">
                {session.therapistName}
              </h4>
              <p className="text-xs text-brand-dark-green/50 font-medium mt-0.5">{session.date}</p>
            </div>

            {/* Status */}
            <div className="text-right shrink-0">
              <span className="block text-[10px] text-brand-dark-green/40 font-medium uppercase">{session.status}</span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-brand-dark-green/60 py-4 text-sm">No sessions yet. Book your first one!</p>
    )}
  </div>
));

interface ProgressTrackerProps {
  sessionHistory: Session[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = React.memo(({ sessionHistory }) => {
  return (
    <section className="py-8">
      <div className="max-w-2xl mx-auto">
        <SessionHistory sessionHistory={sessionHistory} />
      </div>
    </section>
  );
});

export default ProgressTracker;