import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { supabase } from '../lib/supabase';
import '../css/Login.css'

function Login() {
    const { user, login, logout, signup, setShowLogin } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [isForgot, setIsForgot] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isSignup) {
                const data = await signup(email, password);
                if (data.session) {
                    setShowLogin(false);
                } else if (data.user?.identities?.length === 0) {
                    setError("Email already registered. Please login instead.");
                } else {
                    setSuccess("Account created! Please check your email to verify.");
                }
            } else {
                await login(email, password);
                setShowLogin(false);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) { setError('Please enter your email address.'); return; }
        setError('');
        setLoading(true);
        const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        setLoading(false);
        if (err) {
            setError(err.message);
        } else {
            setSuccess(`Reset link sent to ${email}. Check your inbox!`);
        }
    };

    const switchMode = (mode) => {
        setError('');
        setSuccess('');
        setPassword('');
        setShowPassword(false);
        if (mode === 'forgot') { setIsForgot(true); setIsSignup(false); }
        else if (mode === 'signup') { setIsSignup(true); setIsForgot(false); }
        else { setIsSignup(false); setIsForgot(false); }
    };

    const getTitle = () => {
        if (user) return 'Account';
        if (isForgot) return 'Reset Password';
        return isSignup ? 'Create Account' : 'Welcome Back';
    };

    return (
        <div className="popup-overlay" onClick={() => setShowLogin(false)}>
            <div className="popup-box" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <h2 className='pop-head'>{getTitle()}</h2>
                    <button className="pop-close" onClick={() => setShowLogin(false)}>✕</button>
                </div>

                {user ? (
                    <div className='pop-info'>
                        <div className="pop-avatar">{user.email[0].toUpperCase()}</div>
                        <p className='pop-email'>{user.email}</p>
                        <button className='pop-log' onClick={() => { logout(); setShowLogin(false); }}>Logout</button>
                    </div>
                ) : isForgot ? (
                    /* --- Forgot Password View --- */
                    <form onSubmit={handleForgotPassword}>
                        <p className="form-hint">Enter your email and we'll send you a reset link.</p>
                        <div className="input-group">
                            <input
                                className='pop-input'
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        {error && <p className='inline-error'>{error}</p>}
                        {success && <p className='inline-success'>{success}</p>}
                        <button className='pop-log' type="submit" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                        <p className='pop-toggle' onClick={() => switchMode('login')}>← Back to Login</p>
                    </form>
                ) : (
                    /* --- Login / Signup View --- */
                    <form onSubmit={handleAuth}>
                        {!isSignup && (
                            <p className="form-hint">Sign in to your account to continue.</p>
                        )}
                        <div className="input-group">
                            <input
                                className='pop-input'
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <div className="input-group password-group">
                            <input
                                className='pop-input'
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-pw-btn"
                                onClick={() => setShowPassword(p => !p)}
                                tabIndex={-1}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    /* Eye-off icon */
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    /* Eye icon */
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {!isSignup && (
                            <p className='pop-forgot' onClick={() => switchMode('forgot')}>Forgot password?</p>
                        )}

                        {error && <p className='inline-error'>{error}</p>}
                        {success && <p className='inline-success'>{success}</p>}

                        <button className='pop-log' type="submit" disabled={loading}>
                            {loading ? (isSignup ? 'Creating...' : 'Signing in...') : (isSignup ? 'Create Account' : 'Login')}
                        </button>
                        <p className='pop-toggle' onClick={() => switchMode(isSignup ? 'login' : 'signup')}>
                            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Login;