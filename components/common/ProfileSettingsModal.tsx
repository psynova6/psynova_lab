
import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { UserIcon } from './icons';
import type { UserProfile, NotificationSettings } from '../../types';

const NotificationSettingsModal = lazy(() => import('./NotificationSettingsModal'));

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
  notificationSettings: NotificationSettings;
  onNotificationSettingsUpdate: (settings: NotificationSettings) => void;
}

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ isOpen, onClose, userProfile, onProfileUpdate, notificationSettings, onNotificationSettingsUpdate }) => {
  const [name, setName] = useState(userProfile.name);
  const [avatar, setAvatar] = useState<string | null>(userProfile.avatar);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(userProfile.name);
    setAvatar(userProfile.avatar);
  }, [userProfile]);

  if (!isOpen) return null;

  const handleSaveChanges = () => {
    onProfileUpdate({ name, avatar });
    alert('Profile updated successfully!');
    onClose();
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        event.target.value = ''; // Reset the file input
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveNotificationSettings = (newSettings: NotificationSettings) => {
    onNotificationSettingsUpdate(newSettings);
    setIsNotificationSettingsOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-brand-background rounded-[2rem] shadow-2xl w-full max-w-lg flex flex-col">
          <header className="flex items-center justify-between p-4 border-b border-brand-light-green/50">
            <h2 className="text-xl font-bold text-brand-dark-green">Profile Settings</h2>
            <button onClick={onClose} aria-label="Close profile settings" className="text-brand-dark-green/70 hover:text-brand-dark-green text-3xl font-light leading-none">&times;</button>
          </header>

          <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-h-[60vh]">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-brand-light-green/30 flex items-center justify-center overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-12 h-12 text-brand-dark-green" />
                  )}
                </div>
                <button onClick={handleAvatarClick} aria-label="Change profile picture" className="absolute -bottom-1 -right-1 bg-brand-dark-green text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-brand-background hover:bg-brand-light-green hover:text-brand-dark-green transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"></path></svg>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-brand-dark-green/80 mb-1">Full Name</label>
              <input type="text" id="fullName" aria-label="Your full name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-brand-light-green/50 rounded-2xl focus:ring-brand-dark-green focus:border-brand-dark-green bg-white/50" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-dark-green/80 mb-1">Email Address</label>
              <input type="email" id="email" value="warrior@university.edu" readOnly className="w-full px-3 py-2 border border-brand-light-green/50 rounded-2xl bg-gray-200/50 text-gray-500 cursor-not-allowed" />
            </div>

            {/* Notification & Password Sections */}
            <div className="border-t border-brand-light-green/50 pt-4 space-y-4">
              <div>
                <button onClick={() => setIsNotificationSettingsOpen(true)} aria-label="Open notification preferences" className="text-sm font-semibold text-brand-dark-green hover:underline">Notification Preferences</button>
              </div>
              {!showPasswordFields ? (
                <button onClick={() => setShowPasswordFields(true)} aria-label="Open password change fields" className="text-sm font-semibold text-brand-dark-green hover:underline">Change Password</button>
              ) : (
                <div className="space-y-4 animate-fade-in-down">
                  <h4 className="font-semibold">Reset Password</h4>
                  <div>
                    <label htmlFor="oldPassword" className="block text-sm font-medium text-brand-dark-green/80 mb-1">Old Password</label>
                    <input type="password" id="oldPassword" aria-label="Your old password" className="w-full px-3 py-2 border border-brand-light-green/50 rounded-2xl focus:ring-brand-dark-green focus:border-brand-dark-green bg-white/50" />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-brand-dark-green/80 mb-1">New Password</label>
                    <input type="password" id="newPassword" aria-label="Your new password" className="w-full px-3 py-2 border border-brand-light-green/50 rounded-2xl focus:ring-brand-dark-green focus:border-brand-dark-green bg-white/50" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <footer className="p-4 border-t border-brand-light-green/50 flex items-center justify-end gap-4">
            <button
              onClick={onClose}
              aria-label="Cancel profile changes"
              className="px-6 py-2 rounded-full hover:bg-gray-200/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              aria-label="Save profile changes"
              className="bg-brand-dark-green text-white font-semibold py-2 px-8 rounded-full hover:bg-brand-dark-green/90 transition-colors"
            >
              Save Changes
            </button>
          </footer>
        </div>
      </div>
      <Suspense fallback={null}>
        {isNotificationSettingsOpen && <NotificationSettingsModal
          isOpen={isNotificationSettingsOpen}
          onClose={() => setIsNotificationSettingsOpen(false)}
          currentSettings={notificationSettings}
          onSave={handleSaveNotificationSettings}
        />}
      </Suspense>
    </>
  );
};

export default ProfileSettingsModal;