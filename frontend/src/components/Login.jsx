import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            console.log('Attempting to:', isLogin ? 'login' : 'signup');
            console.log('Email:', email);

            if (isLogin) {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                navigate('/');
            } else {
                const { data, error } = await supabase.auth.signUp({ 
                    email, 
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/login`
                    }
                });
                if (error) throw error;
                setSuccess('Signup successful! You can now log in.');
                setIsLogin(true);
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email,
            });
            if (error) throw error;
            setSuccess('Verification email sent! Please check your inbox.');
        } catch (err) {
            console.error('Resend error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar placeholder */}
            {/* <Sidebar /> */}

            {/* Main content */}
            <div style={{
                margin: 'auto',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    background: '#fff',
                    padding: '32px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                }}>
                    <h2 style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        marginBottom: '16px',
                        textAlign: 'center'
                    }}>
                        {isLogin ? 'Login' : 'Sign Up'}
                    </h2>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <input
                            type="email"
                            placeholder="Email"
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                background: '#2563eb',
                                color: '#fff',
                                padding: '10px',
                                border: 'none',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
                        </button>
                    </form>
                    {!isLogin && (
                        <p style={{ marginTop: '16px', fontSize: '0.9rem', textAlign: 'center', color: '#666' }}>
                            Note: You can log in immediately after signing up. Email verification is optional.
                        </p>
                    )}
                    <p style={{ marginTop: '16px', fontSize: '0.9rem', textAlign: 'center' }}>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            style={{
                                marginLeft: '8px',
                                color: '#2563eb',
                                background: 'none',
                                border: 'none',
                                textDecoration: 'underline',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                padding: 0,
                                fontSize: 'inherit'
                            }}
                            onClick={() => setIsLogin(!isLogin)}
                            disabled={loading}
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                    {!isLogin && (
                        <button
                            onClick={handleResendVerification}
                            style={{
                                width: '100%',
                                marginTop: '16px',
                                background: 'none',
                                color: '#2563eb',
                                border: '1px solid #2563eb',
                                padding: '8px',
                                borderRadius: '4px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                            disabled={loading}
                        >
                            Resend Verification Email
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}