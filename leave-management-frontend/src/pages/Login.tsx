import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/hero-office.png';
import '../styles/shared.css';
import './AuthForm.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await loginApi({ email, password });
      login(response);

      if (response.role === 'MANAGER') {
        navigate('/manager');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div
        className="auth-visual"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="auth-visual-overlay">
          <div className="auth-visual-text">
            <h2>Time off, made simple</h2>
            <p>Track requests, balances, and approvals in one place.</p>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <p className="auth-subtitle">Log in to manage your leave</p>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Log In'}
          </button>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;