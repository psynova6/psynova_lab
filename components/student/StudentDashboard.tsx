
import React, { useState, useCallback, useEffect, useMemo, Suspense, lazy } from 'react';
import Header from '../layout/Header';
import WelcomeBanner from './WelcomeBanner';
import FeatureCard from '../common/FeatureCard';
import ProgressTracker from './ProgressTracker';
import Footer from '../layout/Footer';
import QuarterlyCheckinBanner from './QuarterlyCheckinBanner';
import DailyAffirmation from './DailyAffirmation';
import { usePersistentState } from '../../hooks/usePersistentState';
import { RobotIcon, ToolsIcon, TherapistIcon, AlarmClockIcon } from '../common/icons';
import { affirmations } from '../../utils/affirmations';
import type { UserProfile, Session, Message, Notification, Reminder, NotificationSettings } from '../../types';

// --- Lazy-loaded Modal Components ---
const ChatbotModal = lazy(() => import('./ChatbotModal'));
const AssessmentModal = lazy(() => import('./AssessmentModal'));
const TermsOfServiceModal = lazy(() => import('../common/TermsOfServiceModal'));
const CopingToolsModal = lazy(() => import('./CopingToolsModal'));
const TherapistSelectionModal = lazy(() => import('./TherapistSelectionModal'));
const ProfileSettingsModal = lazy(() => import('../common/ProfileSettingsModal'));
const AllNotificationsModal = lazy(() => import('./AllNotificationsModal'));
const ReminderModal = lazy(() => import('./ReminderModal'));
const RemindersList = lazy(() => import('./RemindersList'));
const SubscriptionModal = lazy(() => import('./SubscriptionModal'));


const getTimeString = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

// --- Suspense Fallback Component ---
const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-black bg-opacity-25 z-[100] flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-white border-t-brand-dark-green rounded-full animate-spin"></div>
  </div>
);

interface StudentDashboardProps {
  userProfile: UserProfile;
  onLogout: () => void;
  onProfileUpdate: (newProfile: UserProfile) => void;
}

function StudentDashboard({ userProfile, onLogout, onProfileUpdate }: StudentDashboardProps) {
  // --- STATE MANAGEMENT ---
  // Modal visibility state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isCopingToolsOpen, setIsCopingToolsOpen] = useState(false);
  const [isTherapistModalOpen, setIsTherapistModalOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isAllNotificationsOpen, setIsAllNotificationsOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

  // Persistent state using our custom hook for localStorage synchronization
  const [selectedPlan, setSelectedPlan] = usePersistentState<string | null>('selectedPlan', null);
  const [sessionHistory, setSessionHistory] = usePersistentState<Session[]>('sessionHistory', []);
  const [chatHistory, setChatHistory] = usePersistentState<Message[]>('chatHistory', []);
  const [notifications, setNotifications] = usePersistentState<Notification[]>('notifications', []);
  const [lastCheckinCompleted, setLastCheckinCompleted] = usePersistentState<string | null>('lastCheckinCompleted', null);
  const [reminders, setReminders] = usePersistentState<Reminder[]>('reminders', []);
  const [triggeredReminderIds, setTriggeredReminderIds] = usePersistentState<number[]>('triggeredReminderIds', []);
  const [notificationSettings, setNotificationSettings] = usePersistentState<NotificationSettings>('notificationSettings', {
    enableQuarterlyCheckin: true,
    enableTaskReminders: true,
  });
  const [dismissedCheckinPeriod, setDismissedCheckinPeriod] = usePersistentState<string | 'initial' | null>('dismissedCheckinPeriod', null);

  // UI-specific state
  const [isCheckinAvailable, setIsCheckinAvailable] = useState(false);
  const [dailyAffirmation, setDailyAffirmation] = useState('');

  // --- EVENT HANDLERS (memoized with useCallback for performance) ---

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'time' | 'read'>) => {
    // Respect user's notification preferences
    if (notification.title === "Quarterly Check-in" && !notificationSettings.enableQuarterlyCheckin) {
      return;
    }
    if (notification.title === "Task Reminder" && !notificationSettings.enableTaskReminders) {
      return;
    }

    setNotifications(prev => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now(),
        time: getTimeString(),
        read: false,
      };
      // Prevent duplicate unread notifications
      const filteredPrev = prev.filter(n => !(n.title === notification.title && !n.read));
      return [newNotification, ...filteredPrev];
    });
  }, [setNotifications, notificationSettings]);

  const handleProfileUpdate = useCallback((newProfile: UserProfile) => {
    onProfileUpdate(newProfile);
  }, [onProfileUpdate]);

  const handlePlanSelect = useCallback((planName: string) => {
    setSelectedPlan(planName);
  }, [setSelectedPlan]);

  const handleBookSession = useCallback((therapistName: string) => {
    const newSession: Session = {
      therapistName,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Completed',
    };
    setSessionHistory(prev => [newSession, ...prev]);
    addNotification({
      icon: 'CalendarIcon',
      title: "Session Booked",
      description: `Your session with ${therapistName} is confirmed.`,
    });
  }, [setSessionHistory, addNotification]);

  const handleNewMessage = useCallback((messages: Message[]) => {
    setChatHistory(messages);
  }, [setChatHistory])

  const handleAssessmentComplete = useCallback(() => {
    setIsAssessmentOpen(false);
    setLastCheckinCompleted(new Date().toISOString());
    setNotifications(prev => prev.map(n => n.title === "Quarterly Check-in" ? { ...n, read: true } : n));
  }, [setLastCheckinCompleted, setNotifications])

  const handleClearNotifications = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, [setNotifications]);

  const handleMarkAsRead = useCallback((id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, [setNotifications]);

  const handleSetReminder = useCallback((newReminder: Omit<Reminder, 'id'>) => {
    setReminders(prev => [...prev, { ...newReminder, id: Date.now() }]);
    addNotification({
      icon: 'AlarmClockIcon',
      title: "Reminder Set!",
      description: `We'll remind you about: ${newReminder.task.substring(0, 30)}...`,
    });
  }, [setReminders, addNotification]);

  const handleDeleteReminder = useCallback((id: number) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    setTriggeredReminderIds(prev => prev.filter(triggeredId => triggeredId !== id));
  }, [setReminders, setTriggeredReminderIds]);

  const handleNotificationSettingsUpdate = useCallback((newSettings: NotificationSettings) => {
    setNotificationSettings(newSettings);
  }, [setNotificationSettings]);


  // --- SIDE EFFECTS ---

  // Manages the daily affirmation
  useEffect(() => {
    const getTodaysDateString = () => new Date().toISOString().split('T')[0];

    try {
      const storedAffirmation = localStorage.getItem('dailyAffirmation');
      const today = getTodaysDateString();

      if (storedAffirmation) {
        const { date, text } = JSON.parse(storedAffirmation);
        if (date === today) {
          setDailyAffirmation(text);
          return;
        }
      }

      // If no stored affirmation or it's from a past day, get a new one.
      const newAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
      localStorage.setItem('dailyAffirmation', JSON.stringify({ date: today, text: newAffirmation }));
      setDailyAffirmation(newAffirmation);

    } catch (error) {
      console.error("Failed to read or set daily affirmation from localStorage:", error);
      // Fallback to a random affirmation without persisting if storage fails
      const fallbackAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
      setDailyAffirmation(fallbackAffirmation);
    }
  }, []);

  // Manages the quarterly check-in logic and notification
  useEffect(() => {
    const ninetyDaysInMs = 90 * 24 * 60 * 60 * 1000;
    const checkinIsDue = !lastCheckinCompleted || (new Date().getTime() - new Date(lastCheckinCompleted).getTime()) > ninetyDaysInMs;

    if (checkinIsDue) {
      setIsCheckinAvailable(true);
      // Change: Check if ANY Check-in notification exists, regardless of read status.
      // This prevents the notification from being re-added immediately after the user reads it.
      const hasCheckinNotification = notifications.some(n => n.title === "Quarterly Check-in");
      if (!hasCheckinNotification) {
        addNotification({
          icon: 'CheckIcon',
          title: "Quarterly Check-in",
          description: "It's time for your assessment to track your progress.",
        });
      }
    } else {
      setIsCheckinAvailable(false);
    }
  }, [lastCheckinCompleted, addNotification, notifications]);

  // Checks for due reminders periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const upcomingReminders = reminders.filter(r => !triggeredReminderIds.includes(r.id));

      upcomingReminders.forEach(reminder => {
        const reminderTime = new Date(reminder.dueDate).getTime() - (reminder.reminderTiming * 60 * 1000);
        if (now >= reminderTime) {
          addNotification({
            icon: 'AlarmClockIcon',
            title: "Task Reminder",
            description: `It's time for: ${reminder.task}`,
          });
          setTriggeredReminderIds(prev => [...prev, reminder.id]);
        }
      });

      // Cleanup reminders that are more than a day past due
      const oneDayInMs = 24 * 60 * 60 * 1000;
      setReminders(prev => prev.filter(r => new Date(r.dueDate).getTime() > (now - oneDayInMs)));
      setTriggeredReminderIds(prev => prev.filter(id => {
        const reminder = reminders.find(r => r.id === id);
        return reminder ? new Date(reminder.dueDate).getTime() > (now - oneDayInMs) : false;
      }));

    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [reminders, triggeredReminderIds, addNotification, setReminders, setTriggeredReminderIds]);

  // --- MEMOIZED VALUES (for performance optimization) ---

  // Dynamically adds onClick handlers to notifications without storing functions in localStorage
  const notificationsWithHandlers = useMemo(() => {
    return notifications.map(n => {
      if (n.title === "Quarterly Check-in" && !n.onClick) {
        return {
          ...n, onClick: () => {
            setIsAssessmentOpen(true);
            const activeElement = document.activeElement as HTMLElement;
            if (activeElement) activeElement.blur(); // Close dropdown if open
          }
        };
      }
      return n;
    }).sort((a, b) => b.id - a.id); // Ensure latest notifications are first
  }, [notifications]);

  // Derived state to check for premium plan
  const hasPremiumPlan = selectedPlan === 'Premium';

  const lastCheckinValue = lastCheckinCompleted || 'initial';
  const isCurrentPeriodDismissed = dismissedCheckinPeriod === lastCheckinValue;

  return (
    <div className="bg-brand-background min-h-screen font-sans text-brand-dark-green flex flex-col">
      <Header
        userProfile={userProfile}
        notifications={notificationsWithHandlers}
        onOpenProfileSettings={() => setIsProfileSettingsOpen(true)}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
        onLogout={onLogout}
        onClearNotifications={handleClearNotifications}
        onViewAllNotifications={() => setIsAllNotificationsOpen(true)}
        onMarkAsRead={handleMarkAsRead}
      />
      <main className="flex-grow">
        {isCheckinAvailable && !isCurrentPeriodDismissed && (
          <QuarterlyCheckinBanner
            onStart={() => setIsAssessmentOpen(true)}
            onDismiss={() => setDismissedCheckinPeriod(lastCheckinValue)}
          />
        )}

        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <WelcomeBanner userName={userProfile.name} />
          <DailyAffirmation affirmation={dailyAffirmation} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16 items-stretch">
            <div className="animate-fade-up [animation-delay:100ms]">
              <FeatureCard
                icon={<RobotIcon className="w-8 h-8 text-brand-dark-green" />}
                title="AI Chatbot 'Syna'"
                description="Talk about what's on your mind in a safe, confidential space. Our AI is here to listen 24/7."
                actionText="Start Chatting"
                onClick={() => setIsChatOpen(true)}
              />
            </div>
            <div className="animate-fade-up [animation-delay:200ms]">
              <FeatureCard
                icon={<ToolsIcon className="w-8 h-8 text-brand-dark-green" />}
                title="Coping Tools"
                description="Access a library of guided exercises, mindfulness games, and journaling prompts to help you manage stress."
                actionText="Explore Tools"
                onClick={() => setIsCopingToolsOpen(true)}
              />
            </div>
            <div className="animate-fade-up [animation-delay:300ms]">
              <FeatureCard
                icon={<TherapistIcon className="w-8 h-8 text-brand-dark-green" />}
                title="Connect with Therapists"
                description="Ready for the next step? Upgrade to connect with professional therapists for personalized guidance."
                actionText={hasPremiumPlan ? 'CONNECT' : 'View Plans'}
                onClick={hasPremiumPlan ? () => setIsTherapistModalOpen(true) : () => setIsSubscriptionOpen(true)}
              />
            </div>
            <div className="animate-fade-up [animation-delay:400ms]">
              <FeatureCard
                icon={<AlarmClockIcon className="w-8 h-8 text-brand-dark-green" />}
                title="Set a Reminder"
                description="Create reminders for tasks, appointments, or self-care moments to stay on track with your goals."
                actionText="Add Reminder"
                onClick={() => setIsReminderModalOpen(true)}
              />
            </div>
          </div>

          <Suspense fallback={<div className="h-96" />}>
            <RemindersList reminders={reminders} onDelete={handleDeleteReminder} />
          </Suspense>

          <ProgressTracker sessionHistory={sessionHistory} />
        </div>
      </main>
      <Footer onTermsClick={() => setIsTermsOpen(true)} />

      {/* --- MODALS (Rendered within a Suspense boundary for lazy loading) --- */}
      <Suspense fallback={<LoadingSpinner />}>
        {isChatOpen && <ChatbotModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          chatHistory={chatHistory}
          onNewMessage={handleNewMessage}
        />}
        {isAssessmentOpen && <AssessmentModal
          isOpen={isAssessmentOpen}
          onClose={() => setIsAssessmentOpen(false)}
          onComplete={handleAssessmentComplete}
        />}
        {isTermsOpen && <TermsOfServiceModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />}
        {isCopingToolsOpen && <CopingToolsModal isOpen={isCopingToolsOpen} onClose={() => setIsCopingToolsOpen(false)} />}
        {isTherapistModalOpen && <TherapistSelectionModal
          isOpen={isTherapistModalOpen}
          onClose={() => setIsTherapistModalOpen(false)}
          onBookSession={handleBookSession}
        />}
        {isProfileSettingsOpen && <ProfileSettingsModal
          isOpen={isProfileSettingsOpen}
          onClose={() => setIsProfileSettingsOpen(false)}
          userProfile={userProfile}
          onProfileUpdate={handleProfileUpdate}
          notificationSettings={notificationSettings}
          onNotificationSettingsUpdate={handleNotificationSettingsUpdate}
        />}
        {isAllNotificationsOpen && <AllNotificationsModal
          isOpen={isAllNotificationsOpen}
          onClose={() => setIsAllNotificationsOpen(false)}
          notifications={notificationsWithHandlers}
          onMarkAllAsRead={handleClearNotifications}
        />}
        {isReminderModalOpen && <ReminderModal
          isOpen={isReminderModalOpen}
          onClose={() => setIsReminderModalOpen(false)}
          onSetReminder={handleSetReminder}
        />}
        {isSubscriptionOpen && <SubscriptionModal
          isOpen={isSubscriptionOpen}
          onClose={() => setIsSubscriptionOpen(false)}
          selectedPlan={selectedPlan}
          onPlanSelect={handlePlanSelect}
        />}
      </Suspense>
    </div>
  );
}

export default StudentDashboard;
