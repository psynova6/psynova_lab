import React, { useState, useEffect } from 'react';
import type { NotificationSettings } from '../../types';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: NotificationSettings;
  onSave: (settings: NotificationSettings) => void;
}

const ToggleSwitch: React.FC<{
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}> = ({ id, label, description, enabled, onChange }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl">
    <div className="flex-grow pr-4">
      <p id={`${id}-label`} className="font-semibold text-brand-dark-green">{label}</p>
      <p id={`${id}-desc`} className="text-sm text-brand-dark-green/70">{description}</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-labelledby={`${id}-label`}
      aria-describedby={`${id}-desc`}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors flex-shrink-0 ${enabled ? 'bg-brand-dark-green' : 'bg-gray-300'
        }`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
      />
    </button>
  </div>
);


const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onSave,
}) => {
  const [settings, setSettings] = useState(currentSettings);

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings, isOpen]);

  if (!isOpen) return null;

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = () => {
    onSave(settings);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4">
      <div className="bg-brand-background rounded-[2rem] shadow-2xl w-full max-w-md flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-brand-light-green/50">
          <h2 className="text-xl font-bold text-brand-dark-green">Notification Preferences</h2>
          <button onClick={onClose} aria-label="Close notification preferences" className="text-brand-dark-green/70 hover:text-brand-dark-green text-3xl font-light leading-none">&times;</button>
        </header>

        <div className="p-6 space-y-2">
          <ToggleSwitch
            id="quarterly-checkin-toggle"
            label="Quarterly Check-in"
            description="Receive a notification when it's time for your check-in."
            enabled={settings.enableQuarterlyCheckin}
            onChange={value => handleSettingChange('enableQuarterlyCheckin', value)}
          />
          <ToggleSwitch
            id="task-reminders-toggle"
            label="Task Reminders"
            description="Get alerts for your upcoming scheduled tasks."
            enabled={settings.enableTaskReminders}
            onChange={value => handleSettingChange('enableTaskReminders', value)}
          />
        </div>

        <footer className="p-4 border-t border-brand-light-green/50 flex items-center justify-end gap-4">
          <button onClick={onClose} aria-label="Cancel notification settings changes" className="px-6 py-2 rounded-full hover:bg-gray-200/50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            aria-label="Save notification settings"
            className="bg-brand-dark-green text-white font-semibold py-2 px-8 rounded-full hover:bg-brand-dark-green/90 transition-colors"
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  );
};

export default NotificationSettingsModal;