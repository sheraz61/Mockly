import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError, setPendingEmail } from '../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [dispatch, isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const result = await dispatch(loginUser(formData)).unwrap();

      if (result.success) {
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    } catch (err) {
      if (err?.includes('verify') || err?.includes('verified')) {
        dispatch(setPendingEmail(formData.email));
        toast.error('Please verify your email first');
        navigate('/verify', {
          state: {
            email: formData.email,
            message: 'Please verify your email before logging in.',
          },
        });
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-white">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-slate-900 flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '28px 28px'
        }} />
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 18L10 8L14 14L20 4" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Mockly</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Prepare with confidence. Interview without fear.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Structured mock interviews, actionable feedback, and progress tracking
            built for candidates who take their career seriously.
          </p>
          <ul className="space-y-3">
            {[
              'Role-specific interview simulations',
              'Detailed, actionable performance feedback',
              'Progress analytics across every session',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                <FiCheckCircle className="text-teal-400 shrink-0" size={16} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} Mockly. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Sign in to your account</h1>
            <p className="mt-2 text-sm text-slate-500">
              New to Mockly?{' '}
              <Link to="/register" className="font-medium text-teal-700 hover:text-teal-800">
                Create an account
              </Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm">
                <FiAlertCircle className="shrink-0 mt-0.5" size={16} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition duration-150"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-teal-700 hover:text-teal-800">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="block w-full pl-10 pr-11 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600/30"
              />
              <span className="text-sm text-slate-600">Keep me signed in</span>
            </label>

            <button
              type="submit"
              disabled={loading || !formData.email || !formData.password}
              className="group w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <FiArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;