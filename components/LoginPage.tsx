import React, { useState, useEffect } from 'react';
import { UserIcon, TherapistIcon, EyeIcon, EyeOffIcon } from './common/icons';
import Logo from './layout/Logo';
import type { Role } from '../types';
import { useAuth } from '../hooks/useAuth';
import VerifyOTP from './VerifyOTP';

interface LoginPageProps {
    onLoginSuccess: (email: string, password: string, role: Role, rememberMe: boolean) => Promise<any>;
}

// --- Local Icon Component ---
const InstitutionIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v2h18V5L12 1zM4 9v11h16V9H4zm2 2h2v7H6v-7zm4 0h2v7h-2v-7zm4 0h2v7h-2v-7z" />
    </svg>
);

// --- Mock Data ---
const MOCK_INSTITUTIONS = ['University of Wellness', 'Mindful Learning College', 'Serenity Institute of Technology'];
const MOCK_THERAPISTS = ['Dr. Ananya Sharma', 'Rohan Verma', 'Priya Desai', 'Dr. Meera Krishnan'];

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const { signup, verify, resendOTP, role, setRole } = useAuth();
    const [formType, setFormType] = useState<'login' | 'signup' | 'verify'>('login');

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [institution, setInstitution] = useState(MOCK_INSTITUTIONS[0]);
    const [isVolunteer, setIsVolunteer] = useState(false);
    const [supervisor, setSupervisor] = useState(MOCK_THERAPISTS[0]);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; password?: boolean }>({});

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setRememberMe(true);
        setInstitution(MOCK_INSTITUTIONS[0]);
        setIsVolunteer(false);
        setSupervisor(MOCK_THERAPISTS[0]);
        setError(null);
        setFieldErrors({});
        setTouched({});
        setIsFormValid(false);
    };

    const validateForm = (currentValues?: { name: string; email: string; password: string }): boolean => {
        const vName = currentValues ? currentValues.name : name;
        const vEmail = currentValues ? currentValues.email : email;
        const vPassword = currentValues ? currentValues.password : password;

        const errors: { name?: string; email?: string; password?: string } = {};

        if (formType === 'signup' && !vName.trim()) {
            errors.name = 'Full name is required.';
        }

        if (!vEmail.trim()) {
            errors.email = 'Email is required.';
        } else if (!EMAIL_REGEX.test(vEmail)) {
            errors.email = 'Invalid email format (e.g. test@gmail.com).';
        }

        if (!vPassword.trim()) {
            errors.password = 'Password is required.';
        } else if (formType === 'signup' && !PASSWORD_REGEX.test(vPassword)) {
            errors.password = 'Weak password: Must be 8+ chars with uppercase, lowercase, digit, and special char (@$!%*?&).';
        } else if (formType === 'login' && !PASSWORD_REGEX.test(vPassword)) {
            errors.password = 'Invalid password format.';
        }

        setFieldErrors(errors);
        const valid = Object.keys(errors).length === 0;
        setIsFormValid(valid);
        return valid;
    };

    // Real-time validation
    useEffect(() => {
        validateForm();
    }, [name, email, password, formType, role]);

    useEffect(() => {
        if (formType !== 'verify') {
            resetForm();
        }
    }, [role, formType]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!role) return;

        // Client-side validation — stay on page and show errors if fields empty
        if (!validateForm()) return;

        setLoading(true);
        setError(null);

        try {
            if (formType === 'login') {
                await onLoginSuccess(email, password, role, rememberMe);
            } else {
                await signup({
                    email,
                    password,
                    role,
                    institution_id: institution,
                    phone: null
                });
                setFormType('verify');
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'An error occurred during authentication.');
        } finally {
            setLoading(false);
        }
    };

    const renderFormFields = () => {
        return (
            <form onSubmit={handleAuth} className="space-y-4" noValidate>
                {formType === 'signup' && (
                    <div>
                        <InputField
                            label={role === 'institution' ? "Principal's Name" : "Full Name"}
                            type="text"
                            value={name}
                            onChange={e => { setName(e.target.value); setTouched(t => ({ ...t, name: true })); }}
                            onBlur={() => setTouched(t => ({ ...t, name: true }))}
                            aria-describedby={fieldErrors.name ? "name-error" : undefined}
                            aria-invalid={!!fieldErrors.name}
                        />
                        {touched.name && fieldErrors.name && <p id="name-error" className="text-red-500 text-xs mt-1 pl-2" role="alert">{fieldErrors.name}</p>}
                    </div>
                )}
                <div>
                    <InputField
                        label={role === 'institution' ? "Official Email" : "Email"}
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setTouched(t => ({ ...t, email: true })); }}
                        onBlur={() => setTouched(t => ({ ...t, email: true }))}
                        aria-describedby={fieldErrors.email ? "email-error" : undefined}
                        aria-invalid={!!fieldErrors.email}
                    />
                    {touched.email && fieldErrors.email && <p id="email-error" className="text-red-500 text-xs mt-1 pl-2" role="alert">{fieldErrors.email}</p>}
                </div>
                <div>
                    <InputField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => { setPassword(e.target.value); setTouched(t => ({ ...t, password: true })); }}
                        onBlur={() => setTouched(t => ({ ...t, password: true }))}
                        aria-describedby={fieldErrors.password ? "password-error" : undefined}
                        aria-invalid={!!fieldErrors.password}
                        onTogglePassword={() => setShowPassword(!showPassword)}
                        isPasswordVisible={showPassword}
                        isPasswordField
                    />
                    {touched.password && fieldErrors.password && <p id="password-error" className="text-red-500 text-xs mt-1 pl-2" role="alert">{fieldErrors.password}</p>}
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                {formType === 'login' && (
                    <div className="py-2">
                        <CheckboxField label="Remember Me" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} id="remember-me" />
                    </div>
                )}

                {formType === 'signup' && role === 'student' && (
                    <SelectField label="Select your Institution" value={institution} onChange={e => setInstitution(e.target.value)}>
                        {MOCK_INSTITUTIONS.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                    </SelectField>
                )}

                {formType === 'signup' && role === 'therapist' && (
                    <>
                        <SelectField label="Select your Institution" value={institution} onChange={e => setInstitution(e.target.value)}>
                            <option value="N/A">N/A (Independent)</option>
                            {MOCK_INSTITUTIONS.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                        </SelectField>
                        <CheckboxField label="I am a volunteer" checked={isVolunteer} onChange={e => setIsVolunteer(e.target.checked)} />
                        {isVolunteer && (
                            <SelectField label="Select Supervising Therapist" value={supervisor} onChange={e => setSupervisor(e.target.value)}>
                                {MOCK_THERAPISTS.map(ther => <option key={ther} value={ther}>{ther}</option>)}
                            </SelectField>
                        )}
                    </>
                )}

                <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className="w-full bg-brand-dark-green text-white font-semibold py-3 px-6 rounded-full hover:bg-brand-light-green hover:text-brand-dark-green transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    {loading ? (formType === 'login' ? 'Logging in...' : 'Signing up...') : (formType === 'login' ? 'Login' : 'Sign Up')}
                </button>
            </form>
        );
    }

    if (formType === 'verify') {
        return (
            <div className="bg-brand-background min-h-screen font-sans text-brand-dark-green flex items-center justify-center p-4">
                <VerifyOTP
                    email={email}
                    onVerifySuccess={async (code) => {
                        await verify(email, code);
                        alert('Verification successful! You can now log in.');
                        setFormType('login');
                    }}
                    onResend={() => resendOTP(email)}
                    onCancel={() => setFormType('signup')}
                />
            </div>
        );
    }

    return (
        <div className="bg-brand-background min-h-screen font-sans text-brand-dark-green flex items-center justify-center p-4">
            {!role ? (
                <RoleSelection onSelectRole={setRole} />
            ) : (
                <div className="w-full max-w-md bg-white/70 backdrop-blur-sm rounded-[2rem] shadow-xl p-6 sm:p-8 animate-fade-in-down relative">
                    <button onClick={() => setRole(null)} aria-label="Back to role selection" className="absolute top-4 left-4 p-2 w-12 h-12 flex items-center justify-center text-3xl rounded-full text-brand-dark-green/60 hover:text-brand-dark-green hover:bg-black/10 transition-colors">&larr;</button>
                    <h2 className="text-3xl font-bold text-center text-brand-dark-green mb-2 capitalize">{role} Portal</h2>

                    <div className="flex justify-center border-b border-brand-light-green/50 mb-6">
                        <TabButton title="Login" isActive={formType === 'login'} onClick={() => setFormType('login')} />
                        <TabButton title="Sign Up" isActive={formType === 'signup'} onClick={() => setFormType('signup')} />
                    </div>

                    {renderFormFields()}
                </div>
            )}
        </div>
    );
};

// --- Helper Components ---

const RoleSelection: React.FC<{ onSelectRole: (role: Role) => void }> = ({ onSelectRole }) => (
    <div className="text-center animate-fade-in-down flex flex-col items-center">
        <div className="mb-6 sm:mb-8 text-center flex justify-center">
            <Logo className="h-52 sm:h-72 md:h-80 w-auto drop-shadow-2xl" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark-green mb-2 sm:mb-4">Welcome</h1>
        <p className="text-sm sm:text-base md:text-lg text-brand-dark-green/80 mb-6 sm:mb-8 md:mb-10">Select your role to continue</p>
        <div className="flex gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto w-full px-4">
            <RoleCard icon={<InstitutionIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />} title="Institution" onClick={() => onSelectRole('institution')} />
            <RoleCard icon={<UserIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />} title="Student" onClick={() => onSelectRole('student')} />
            <RoleCard icon={<TherapistIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />} title="Therapist" onClick={() => onSelectRole('therapist')} />
        </div>
    </div>
);

const RoleCard = ({ icon, title, onClick }: { icon: React.ReactNode, title: string, onClick: () => void }) => (
    <button onClick={onClick} className="group bg-white/50 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-h-[140px] sm:min-h-[160px]">
        <div className="text-brand-dark-green group-hover:text-brand-light-green transition-colors">{icon}</div>
        <h3 className="text-base sm:text-lg md:text-2xl font-semibold text-brand-dark-green">{title}</h3>
    </button>
);

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {
    label: string,
    isPasswordField?: boolean,
    onTogglePassword?: () => void,
    isPasswordVisible?: boolean
}> = ({ label, isPasswordField, onTogglePassword, isPasswordVisible, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-brand-dark-green/80 mb-1">{label}</label>
        <div className="relative">
            <input
                {...props}
                className="w-full px-4 py-2 border border-brand-light-green/50 rounded-full focus:ring-brand-dark-green focus:border-brand-dark-green bg-white/50 pr-12"
            />
            {isPasswordField && onTogglePassword && (
                <button
                    type="button"
                    onClick={onTogglePassword}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-dark-green/60 hover:text-brand-dark-green transition-colors"
                    aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                >
                    {isPasswordVisible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
            )}
        </div>
    </div>
);

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-brand-dark-green/80 mb-1">{label}</label>
        <select {...props} className="w-full px-4 py-2 border border-brand-light-green/50 rounded-full focus:ring-brand-dark-green focus:border-brand-dark-green bg-white/50 appearance-none">
            {children}
        </select>
    </div>
);

const CheckboxField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div className="flex items-center">
        <input type="checkbox" {...props} className="h-4 w-4 text-brand-dark-green border-gray-300 rounded focus:ring-brand-dark-green" />
        <label htmlFor={props.id || props.name} className="ml-2 block text-sm text-brand-dark-green/80">{label}</label>
    </div>
);

const TabButton: React.FC<{ title: string; isActive: boolean; onClick: () => void }> = ({ title, isActive, onClick }) => (
    <button onClick={onClick} className={`py-2 px-6 font-semibold transition-colors text-center ${isActive ? 'text-brand-dark-green border-b-2 border-brand-dark-green' : 'text-brand-dark-green/60 hover:text-brand-dark-green'}`}>
        {title}
    </button>
);

export default LoginPage;