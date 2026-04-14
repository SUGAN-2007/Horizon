import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import Nav from '../Components/Nav';
import Footer from '../Components/Footer';
import { supabase } from '../lib/supabase';
import '../css/Profile.css';

function Profile({ products }) {
    const { user, profile, isAdmin, logout } = useUser();
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState('');

    // Update local state when profile/user data is loaded
    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setPhone(profile.phone || '');
            setAddress(profile.address || '');
        }
        if (user) {
            setEmail(user.email || '');
        }
    }, [profile, user]);
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setMessage('');
        try {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    phone: phone,
                    address: address
                })
                .eq('id', user.id);
            if (profileError) throw profileError;

            if (email !== user.email) {
                const { error: authError } = await supabase.auth.updateUser({ email });
                if (authError) throw authError;
                setMessage('Profile updated! A verification email has been sent to your new email.');
            } else {
                setMessage('Profile updated successfully!');
            }
        } catch (err) {
            setMessage('Error: ' + err.message);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <>
            <Nav products={products} />
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-header-info">
                            <h2>My Profile</h2>
                            <p>Welcome back, {profile?.full_name || 'User'}</p>
                        </div>
                    </div>

                    <div className="profile-body">
                        <form onSubmit={handleUpdate}>
                            <div className="profile-section">
                                <h3 className="profile-section-title">Personal Information</h3>
                                <div className="grid-form">
                                    <div className="form-group">
                                        <label className="profile-label">Full Name</label>
                                        <input
                                            className='profile-input'
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="profile-label">Phone Number</label>
                                        <input
                                            className='profile-input'
                                            type="text"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Enter your phone"
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label className="profile-label">Shipping Address</label>
                                        <textarea
                                            className='profile-input profile-textarea'
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Street, City, Zip Code"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="profile-section">
                                <h3 className="profile-section-title">Account Security</h3>
                                <div className="grid-form">
                                    <div className="form-group full-width">
                                        <label className="profile-label">Email Address</label>
                                        <input
                                            className='profile-input'
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email Address"
                                        />
                                        <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                                            Verification required after change.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {message && (
                                <div className={`status-message ${message.includes('Error') ? 'error' : 'success'}`} style={{
                                    padding: '16px',
                                    borderRadius: '12px',
                                    marginBottom: '25px',
                                    background: message.includes('Error') ? '#fff0f0' : '#f0fff4',
                                    color: message.includes('Error') ? '#d32f2f' : '#2e7d32',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}>
                                    {message}
                                </div>
                            )}

                            <div className="profile-actions">
                                <button className='btn-save' type="submit" disabled={updating}>
                                    {updating ? 'Saving Changes...' : 'Save Settings'}
                                </button>
                                <button className='btn-logout' type="button" onClick={logout}>
                                    Sign Out
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Profile;
