import React, { useState } from 'react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
  userType: 'student' | 'therapist';
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAdd, userType }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!name.trim()) {
            setError(`Please enter the ${userType}'s name.`);
            return;
        }
        onAdd(name);
        setName('');
        setError('');
    };

    const title = userType === 'student' ? 'Add New Student' : 'Add New Therapist';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-brand-background rounded-[2rem] shadow-2xl w-full max-w-md flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-brand-light-green/50">
                    <h2 className="text-xl font-bold text-brand-dark-green">{title}</h2>
                    <button onClick={onClose} aria-label="Close modal" className="text-brand-dark-green/70 hover:text-brand-dark-green text-3xl font-light leading-none">&times;</button>
                </header>

                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="user-name" className="block text-sm font-medium text-brand-dark-green/80 mb-1">
                            {userType === 'student' ? "Student's Full Name" : "Therapist's Full Name"}
                        </label>
                        <input
                            type="text"
                            id="user-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter full name"
                            className="w-full px-3 py-2 border border-brand-light-green/50 rounded-2xl focus:ring-brand-dark-green focus:border-brand-dark-green bg-white/50"
                        />
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                </div>
                
                <footer className="p-4 border-t border-brand-light-green/50 flex items-center justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-2 rounded-full hover:bg-gray-200/50 transition-colors">Cancel</button>
                    <button onClick={handleSubmit} className="bg-brand-dark-green text-white font-semibold py-2 px-8 rounded-full hover:bg-brand-dark-green/90 transition-colors">
                        Add {userType === 'student' ? 'Student' : 'Therapist'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AddUserModal;
