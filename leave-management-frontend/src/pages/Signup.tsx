import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../api/authApi';
import heroImage from '../assets/hero-office.png';
import '../styles/shared.css';
import './AuthForm.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState<'EMPLOYEE' | 'MANAGER'>('EMPLOYEE');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await signup({ email, password, firstName, lastName, department, role });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create account');
      }
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
            <h2>Join your team on Staff Ease</h2>
            <p>Set up your account in under a minute.</p>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        {success ? (
          <div className="auth-card">
            <h1>Account Created!</h1>
            <p>Redirecting you to login...</p>
          </div>
        ) : (
          <form className="auth-card" onSubmit={handleSubmit}>
            <h1>Create your account</h1>
            <p className="auth-subtitle">Start managing your leave in minutes</p>

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

            <div className="field">
              <label>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'EMPLOYEE' | 'MANAGER')}
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="MANAGER">Manager</option>
              </select>
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating Account...' : 'Sign Up'}
            </button>

            <p className="auth-footer">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Signup;