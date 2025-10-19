import { NavLink, useNavigate } from 'react-router';

import { constants } from '../constants';
import { useAuth } from '../contexts';

export interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, clearToken } = useAuth();

  const handleLogoutClick = () => {
    clearToken();
    void navigate('/');
  };

  return (
    <div className="navbar bg-base-100 shadow-md">
      {/* Left side */}
      <div className="flex-none md:hidden">
        <button
          className="btn btn-square btn-ghost"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1">
        <NavLink className="btn btn-ghost text-xl" to="/">
          {constants.AppName}
        </NavLink>
      </div>

      {/* Right side */}
      {!isAuthenticated && (
        <div className="flex gap-2">
          <NavLink className="btn btn-outline btn-sm" to="/login">
            Login
          </NavLink>
          <NavLink className="btn btn-primary btn-sm" to="/register">
            Register
          </NavLink>
        </div>
      )}

      {isAuthenticated && (
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src="https://i.pravatar.cc/300" alt="avatar" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-secondary rounded-box w-52"
            >
              <li>
                <button className="btn btn-link" onClick={handleLogoutClick}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
