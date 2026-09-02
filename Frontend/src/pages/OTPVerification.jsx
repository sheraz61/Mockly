import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOTP, clearError, clearPendingEmail } from '../store/slices/authSlice';
import OTPInput from '../components/OTPInput';
import { toast } from 'react-hot-toast';
import { FiMail, FiShield, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    loading,
    error,
    isAuthenticated,
    pendingEmail,
    activationToken: reduxActivationToken,
  } = useSelector((state) => state.auth);

  const email = location.state?.email || pendingEmail;
  const activationToken = location.state?.activationToken || reduxActivationToken;

  useEffect(() => {
    dispatch(clearError());

    if (!activationToken) {
      navigate('/register', {
        replace: true,
        state: { error: 'Please complete registration first' },
      });
      return;
    }

    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [dispatch, isAuthenticated, navigate, activationToken]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleOTPComplete = (enteredOTP) => {
    setOtp(enteredOTP);
    handleVerifyOTP(enteredOTP);
  };

  const handleVerifyOTP = async (enteredOTP = otp) => {
    if (enteredOTP.length !== 4 || !activationToken) {
      dispatch(clearError());
      return;
    }

    try {
      const result = await dispatch(
        verifyOTP({
          activationToken: activationToken,
          activationCode: enteredOTP,
        })
      ).unwrap();

      if (result.success) {
        dispatch(clearPendingEmail());
        toast.success('Account activated successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
    }
  };

  const handleBackToRegister = () => {
    dispatch(clearError());
    navigate('/register');
  };

  if (!email) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-sm w-full text-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="text-rose-600" size={22} />
          </div>
          <p className="text-slate-700 text-sm mb-6">
            No email found. Please complete registration first.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="w-full bg-slate-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-teal-700 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <FiShield className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Verify your email</h1>
          <p className="mt-2 text-sm text-slate-500 flex items-center justify-center gap-1.5 flex-wrap">
            <FiMail size={14} className="text-slate-400" />
            Code sent to <span className="font-medium text-slate-700">{email}</span>
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          {location.state?.message && (
            <div className="mb-6 bg-teal-50 border border-teal-200 text-teal-800 px-4 py-3 rounded-lg text-sm">
              {location.state.message}
            </div>
          )}

          <label className="block text-sm font-medium text-slate-700 mb-4 text-center">
            Enter the 4-digit verification code
          </label>

          <OTPInput onOTPComplete={handleOTPComplete} />

          <p className="text-center text-xs text-slate-400 mt-5">
            Didn&apos;t get a code? Check your spam folder or go back to try registering again.
          </p>

          <div className="flex gap-3 mt-7">
            <button
              type="button"
              onClick={handleBackToRegister}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 disabled:opacity-50 transition-colors duration-200"
            >
              <FiArrowLeft size={15} />
              Back
            </button>
            <button
              type="button"
              onClick={() => handleVerifyOTP()}
              disabled={otp.length !== 4 || loading}
              className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Verify email'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;