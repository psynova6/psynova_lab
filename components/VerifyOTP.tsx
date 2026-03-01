import React, { useState } from 'react';

interface VerifyOTPProps {
    email: string;
    onVerifySuccess: (code: string) => Promise<void>;
    onResend: () => Promise<void>;
    onCancel: () => void;
}

const VerifyOTP: React.FC<VerifyOTPProps> = ({ email, onVerifySuccess, onResend, onCancel }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== '') {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            if (otp[index] === '' && (e.currentTarget.previousSibling as HTMLInputElement)) {
                (e.currentTarget.previousSibling as HTMLInputElement).focus();
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length !== 6) {
            setError('Please enter a 6-digit code.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await onVerifySuccess(code);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError(null);
        try {
            await onResend();
            alert('Verification code resent successfully!');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to resend code.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white/70 backdrop-blur-sm rounded-[2rem] shadow-xl p-6 sm:p-8 animate-fade-in-down relative">
            <button
                onClick={onCancel}
                aria-label="Back"
                className="absolute top-4 left-4 p-2 w-12 h-12 flex items-center justify-center text-3xl rounded-full text-brand-dark-green/60 hover:text-brand-dark-green hover:bg-black/10 transition-colors"
            >
                &larr;
            </button>

            <h2 className="text-3xl font-bold text-center text-brand-dark-green mb-2">Verify Email</h2>
            <p className="text-center text-brand-dark-green/70 mb-8">
                We've sent a 6-digit code to <span className="font-semibold">{email}</span>.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-between gap-2">
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={data}
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-brand-light-green/50 rounded-xl focus:border-brand-dark-green focus:ring-1 focus:ring-brand-dark-green bg-white/50"
                        />
                    ))}
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-dark-green text-white font-semibold py-3 px-6 rounded-full hover:bg-brand-light-green hover:text-brand-dark-green transition-all duration-300 disabled:opacity-50"
                >
                    {loading ? 'Verifying...' : 'Verify Email'}
                </button>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resending}
                        className="text-brand-dark-green font-medium hover:underline disabled:opacity-50"
                    >
                        {resending ? 'Resending...' : "Didn't receive a code? Resend"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VerifyOTP;
