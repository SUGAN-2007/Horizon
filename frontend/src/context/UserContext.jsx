import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLogin, setShowLogin] = useState(false);

    const fetchProfile = async (auth_user) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', auth_user.id)
            .single();
        if (!error) {
            setProfile(data);
        } else {
            // If profile doesn't exist, create one
            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert([{ id: auth_user.id, email: auth_user.email }])
                .select()
                .single();
            if (!createError) setProfile(newProfile);
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) fetchProfile(session.user);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user);
            } else {
                setProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    };

    const signup = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: 'https://horizon-e-com.vercel.app/'
            }
        });
        if (error) throw error;
        
        // Trigger welcome email via our backend
        try {
            await fetch('http://localhost:5000/api/auth/welcome', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
        } catch (err) {
            console.error("Failed to send welcome email request:", err);
        }

        return data;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const isAdmin = profile?.role === 'admin' || user?.email === 'e.com.hori@gmail.com';

    return (
        <UserContext.Provider value={{ session, user, profile, login, signup, logout, loading, isAdmin, showLogin, setShowLogin }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
