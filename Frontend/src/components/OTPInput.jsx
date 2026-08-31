import { useState, useRef, useEffect } from 'react';

const OTPInput = ({ length = 4, onOTPComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;

    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (newOtp.every((digit) => digit !== '')) {
      onOTPComplete(newOtp.join(''));
    }

    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, length);
    if (!isNaN(pasteData)) {
      const newOtp = pasteData.split('').concat(new Array(length - pasteData.length).fill(''));
      setOtp(newOtp);
      onOTPComplete(pasteData);
    }
  };

  return (
    <div className="flex justify-center gap-3" onPaste={handlePaste}>
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          ref={(ref) => (inputRefs.current[index] = ref)}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className={`w-14 h-14 text-2xl text-center font-semibold rounded-lg border-2 outline-none transition-all duration-150 ${digit
              ? 'border-teal-600 text-slate-900 bg-teal-50/40'
              : 'border-slate-200 text-slate-900 bg-white'
            } focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10`}
        />
      ))}
    </div>
  );
};

export default OTPInput;