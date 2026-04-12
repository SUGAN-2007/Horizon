import { useState } from 'react';
import { useUser } from '../context/UserContext';
import '../css/Login.css'

function Login() {
    const { user, login, logout, signup, setShowLogin } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isSignup) {
                const data = await signup(email, password);
                if (data.session) {
                    setShowLogin(false);
                } else if (data.user && data.user.identities && data.user.identities.length === 0) {
                    setError("Email already exists. Please login instead.");
                } else {
                    alert("Signup successful! Please check your email to verify your account.");
                    setShowLogin(false);
                }
            } else {
                await login(email, password);
                setShowLogin(false);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="popup-overlay" onClick={() => setShowLogin(false)}>
            <div className="popup-box" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <h2 className='pop-head'>{user ? 'Account' : (isSignup ? 'Sign Up' : 'Login')}</h2>
                    <button className="pop-close" onClick={() => setShowLogin(false)}>✕</button>
                </div>
                {user ? (
                    <div className='pop-info'>
                        <p className='pop-email'>{user.email}</p>
                        <button className='pop-log' onClick={() => { logout(); setShowLogin(false); }}>Logout</button>
                    </div>
                ) : (
                    <form onSubmit={handleAuth}>
                        <div className="input-group">
                            <input
                                className='pop-input'
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {error && (error.toLowerCase().includes('email') || error.toLowerCase().includes('user') || error.toLowerCase().includes('registered')) && (
                                <p className='inline-error'>{error}</p>
                            )}
                        </div>
                        <div className="input-group">
                            <input
                                className='pop-input'
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {error && !(error.toLowerCase().includes('email') || error.toLowerCase().includes('user') || error.toLowerCase().includes('registered')) && (
                                <p className='inline-error'>{error}</p>
                            )}
                        </div>
                        <button className='pop-log' type="submit">
                            {isSignup ? 'Create Account' : 'Login'}
                        </button>
                        <p className='pop-toggle' onClick={() => setIsSignup(!isSignup)}>
                            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
                        </p>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Login