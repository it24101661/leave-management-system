import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <span className="navbar-brand">Leave Management system
            
        </span>
        {user && (
          <div className="navbar-user">
            <span className="navbar-user-name">
              {user.firstName} {user.lastName}
              <span className="navbar-user-role">{user.role}</span>
            </span>
            <button className="btn btn-ghost" onClick={logout}>
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;