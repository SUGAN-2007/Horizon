import { useState } from 'react';
import { useUser } from '../context/UserContext';
import '../css/Login.css'; // Reusing login styles for consistency

function AuthPage() {
    const { user, login, signup } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isSignup) {
                await signup(email, password);
                alert("Check your email for confirmation!");
            } else {
                await login(email, password);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-page-container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            background: 'hsl(0, 0%, 98%)'
        }}>
            <div className="popup-box" style={{ width: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <h1 className='pop-head' style={{ fontSize: '24px', textAlign: 'center', marginBottom: '20px' }}>
                    Horizon {isSignup ? 'Sign Up' : 'Login'}
                </h1>
                <form onSubmit={handleAuth}>
                    <input
                        className='pop-input'
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className='pop-input'
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className='pop-error'>{error}</p>}
                    <button className='pop-log' type="submit" style={{ backgroundColor: 'black', color: 'white' }}>
                        {isSignup ? 'Create Your Account' : 'Sign In'}
                    </button>
                    <p className='pop-toggle' onClick={() => setIsSignup(!isSignup)} style={{ textAlign: 'center', cursor: 'pointer', marginTop: '15px' }}>
                        {isSignup ? 'Already have an account? Login' : "New to Horizon? Join us"}
                    </p>
                </form>
            </div>
        </div>
    );
}

export default AuthPage;
