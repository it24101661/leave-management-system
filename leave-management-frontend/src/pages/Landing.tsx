import { Link } from 'react-router-dom';
import heroImage from '../assets/hero-office.png';
import './Landing.css';

function Landing() {
  return (
    <div className="landing">
      <div
        className="landing-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="landing-overlay" />
        <div className="landing-content">
          <span className="landing-eyebrow">Leave management, easily</span>
          <h1 className="landing-title">Staff Ease</h1>
          <p className="landing-subtitle">
            Apply for leave, track approvals, and see your team's calendar 
            all in one place. No spreadsheets, no email chains.
          </p>
          <div className="landing-actions">
            <Link to="/login" className="btn btn-primary btn-lg">
              Log In
            </Link>
            <Link to="/signup" className="btn btn-ghost-light btn-lg">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;