import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-5 lg:col-span-4">
            <Link to="/" className="flex items-center space-x-2.5 group shrink-0 mb-6">
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
            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-sm">
              Master your interview skills with AI-powered practice sessions, real-time feedback, and comprehensive preparation tools built for serious candidates.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/hsheraz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 border border-slate-100"
              >
                <FaLinkedin size={18} />
              </a>
              <a
                href="https://github.com/sheraz61"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-200 border border-slate-100"
              >
                <FaGithub size={18} />
              </a>
              <a
                href="https://leetcode.com/u/Sheraz6_1/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200 border border-slate-100"
              >
                <SiLeetcode size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 lg:col-span-2 lg:col-start-7">
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-5">
              Platform
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-slate-500 hover:text-teal-700 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/interview" className="text-sm text-slate-500 hover:text-teal-700 transition-colors duration-200">
                  Practice Interview
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-slate-500 hover:text-teal-700 transition-colors duration-200">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/#features" className="text-sm text-slate-500 hover:text-teal-700 transition-colors duration-200">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-slate-500">
                <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <span>hsheraz271@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-500">
                <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <span>+92 (305) 2094845</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-500">
                <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </span>
                <span>Sahiwal Sargodha</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Ascend. All rights reserved. Crafted with ❤️ for job seekers worldwide.
          </p>
          <div className="flex space-x-6 text-sm text-slate-500">
            <a href="#" className="hover:text-teal-700 transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-teal-700 transition-colors duration-200">Terms of Service</a>
            <a href="#" className="hover:text-teal-700 transition-colors duration-200">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;