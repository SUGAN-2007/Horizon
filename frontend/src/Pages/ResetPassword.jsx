import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Nav from '../Components/Nav';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // Supabase redirects here with a session via hash params — wait for it
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                // User is now in recovery session — they can update password
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleReset = async (e) => {
        e.preventDefault();
        if (password !== confirm) { setError('Passwords do not match.'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

        setLoading(true);
        setError('');
        const { error: err } = await supabase.auth.updateUser({ password });
        setLoading(false);

        if (err) {
            setError(err.message);
        } else {
            setSuccess(true);
            setTimeout(() => navigate('/'), 2500);
        }
    };

    const EyeIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
    );
    const EyeOffIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );

    return (
        <>
            <Nav />
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', padding: '0 20px' }}>
                <div style={{ background: '#fff', padding: '40px', borderRadius: '28px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>

                    {success ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                            <h2 style={{ fontFamily: 'var(--mont)', margin: '0 0 8px', fontSize: '24px' }}>Password Updated!</h2>
                            <p style={{ color: '#888', fontFamily: 'var(--inter)', fontSize: '14px' }}>Redirecting you to the homepage...</p>
                        </div>
                    ) : (
                        <>
                            <h2 style={{ fontFamily: 'var(--mont)', fontSize: '28px', margin: '0 0 8px', color: '#333' }}>New Password</h2>
                            <p style={{ color: '#888', fontFamily: 'var(--inter)', fontSize: '14px', marginBottom: '28px' }}>Choose a strong password for your account.</p>
                            <form onSubmit={handleReset}>
                                <div className="input-group password-group">
                                    <input
                                        className="pop-input"
                                        type={showPw ? 'text' : 'password'}
                                        placeholder="New password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <button type="button" className="toggle-pw-btn" onClick={() => setShowPw(p => !p)}>
                                        {showPw ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                                <div className="input-group password-group">
                                    <input
                                        className="pop-input"
                                        type={showConfirm ? 'text' : 'password'}
                                        placeholder="Confirm new password"
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        required
                                    />
                                    <button type="button" className="toggle-pw-btn" onClick={() => setShowConfirm(p => !p)}>
                                        {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                                {error && <p className="inline-error">{error}</p>}
                                <button className="pop-log" type="submit" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default ResetPassword;
