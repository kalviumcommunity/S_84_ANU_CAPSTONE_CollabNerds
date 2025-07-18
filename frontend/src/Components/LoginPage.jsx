import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import socket from '../socket';
import "../Styles/LoginPage.css";
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? '/login' : '/signup';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        socket.auth = { token: data.token };
        socket.connect();
        navigate('/dashboard');
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Network error:', err.message);
      setError('Network error. Please check your connection.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          googleId: user.uid,
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        socket.auth = { token: data.token };
        socket.connect();
        navigate('/dashboard');
      } else {
        setError(data.message || 'Google Sign-in failed.');
      }
    } catch (err) {
      console.error('Google Sign-in Error:', err.message);
      setError('Google Sign-in failed. Try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay"></div>
      <div className="login-modal">
        <h2>{isLogin ? 'Welcome Back' : 'Join CollabNerds – it’s free!'}</h2>
        <p className="login-subtext">
          {isLogin
            ? 'Log in to collaborate and innovate with fellow students.'
            : 'Sign up to start pitching ideas and building projects together.'}
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              required
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a strong password"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            required
          />
          <button type="submit" className="submit-btn">
            {isLogin ? 'Let’s Go 🚀' : 'Create Account'}
          </button>
        </form>

        <div className="form-toggle">
          {isLogin ? (
            <>
              <p>
                New to CollabNerds?{' '}
                <span onClick={() => setIsLogin(false)}>Create an account</span>
              </p>
              <p>
                <a href="/forgot-password">
                  <span>Forgot your password?</span>
                </a>
              </p>
            </>
          ) : (
            <p>
              Already a member?{' '}
              <span onClick={() => setIsLogin(true)}>Log in instead</span>
            </p>
          )}
        </div>

        <button className="google-login" onClick={handleGoogleLogin}>
          <FcGoogle />
          {isLogin ? ' Continue with Google' : ' Sign up with Google'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
