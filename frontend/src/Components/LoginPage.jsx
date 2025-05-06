import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import "../Styles/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.token) {
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Network error:', err.message);
    }
  };

  return (
    <div className="login-page">
      {/* Overlay */}
      <div className="login-overlay"></div>

      {/* Modal Container */}
      <div className="login-modal">
        <h2>{isLogin ? 'Welcome Back ' : 'Join CollabNerds – it’s free!'}</h2>
        <p className="login-subtext">
          {isLogin
            ? 'Log in to collaborate and innovate with fellow students.'
            : 'Sign up to start pitching ideas and building projects together.'}
        </p>

        {/* Error message */}
        {error && <div className="error-message">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a strong password"
            required
          />
          <button type="submit" className="submit-btn">
            {isLogin ? 'Let’s Go 🚀' : 'Create Account'}
          </button>
        </form>

        {/* Toggle */}
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

        {/* Google Auth */}
        <button className="google-login">
          <FcGoogle />
          {isLogin ? ' Continue with Google' : ' Sign up with Google'}
        </button>
      </div>

    </div>
  );
};

export default LoginPage;
