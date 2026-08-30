import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, logoutUser } from '../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import {
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiGrid,
  FiMic,
  FiChevronDown,
  FiHome,
  FiUsers,
} from 'react-icons/fi';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(logout());
      toast.success('Signed out successfully');
      navigate('/login');
    }
  };

  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/' && !location.hash;
    }
    return location.pathname + location.hash === path;
  };

  const handleNavClick = (e, path) => {
    if (path.startsWith('/#') && location.pathname === '/') {
      setTimeout(() => {
        const id = path.replace('/#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    }
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: FiHome },
    ...(isAuthenticated
      ? [
        { path: '/interview', label: 'Practice', icon: FiMic },
        { path: '/dashboard', label: 'Dashboard', icon: FiGrid },
      ]
      : [
        { path: '/#features', label: 'Features', icon: FiGrid },
        { path: '/#testimonials', label: 'Testimonials', icon: FiUsers },
      ]),
  ];

  const initials = user?.name
    ? user.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
    : '';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 18L10 8L14 14L20 4"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="leading-none">
              <span className="text-lg font-bold text-slate-900 tracking-tight block">
                Ascend
              </span>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                INTERVIEW COACHING
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={(e) => handleNavClick(e, path)}
                className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isActiveLink(path)
                  ? 'text-teal-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                {label}
                {isActiveLink(path) && (
                  <span className="absolute left-4 right-4 -bottom-[1px] h-0.5 bg-teal-700 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen((o) => !o)}
                  className="flex items-center space-x-2 pl-1.5 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center text-white text-xs font-semibold">
                    {initials || <FiUser size={14} />}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                  <FiChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <FiUser size={16} className="text-slate-400" />
                        My Profile
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <FiGrid size={16} className="text-slate-400" />
                        Dashboard
                      </Link>
                    </div>
                    <div className="border-t border-slate-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <FiLogOut size={16} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Single profile icon for logged-out users */
              <Link
                to="/login"
                aria-label="Sign in"
                className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-200"
              >
                <FiUser size={17} />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            onClick={() => setIsMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-5 border-t border-slate-100 animate-fade-in">
            <div className="pt-3 space-y-1">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={(e) => {
                    handleNavClick(e, path);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${isActiveLink(path)
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <Icon size={17} />
                  {label}
                </Link>
              ))}
            </div>

            {isAuthenticated ? (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-1">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-9 h-9 rounded-full bg-teal-700 flex items-center justify-center text-white text-xs font-semibold">
                    {initials || <FiUser size={14} />}
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <FiUser size={17} /> My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  <FiLogOut size={17} /> Sign out
                </button>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2 px-1">
                <Link
                  to="/login"
                  className="text-center w-full py-2.5 rounded-lg text-sm font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-center w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;