import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiPieChart, 
  FiZap, 
  FiBook, 
  FiTarget, 
  FiClock, 
  FiArrowRight, 
  FiRotateCcw,
  FiHome,
  FiAward
} from 'react-icons/fi';

const InterviewResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results;

  if (!results) {
    navigate('/interview');
    return null;
  }

  const getScoreTheme = (score) => {
    if (score >= 8) return {
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      ring: 'ring-teal-600/20'
    };
    if (score >= 6) return {
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      ring: 'ring-blue-600/20'
    };
    if (score >= 4) return {
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      ring: 'ring-amber-600/20'
    };
    return {
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      ring: 'ring-rose-600/20'
    };
  };

  const theme = getScoreTheme(results.overallScore);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <FiPieChart className="text-teal-600" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Interview Analysis</h1>
          <p className="text-slate-500 text-base">
            Your performance report for the {results.difficulty} {results.technology} session.
          </p>
        </div>

        {/* Primary Results Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {/* Score Overview (Left Side) */}
            <div className="md:col-span-5 p-8 flex flex-col items-center justify-center bg-slate-50/50">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">Overall Score</h2>
              
              <div className={`relative flex items-center justify-center w-40 h-40 rounded-full ${theme.bg} ${theme.border} border-4 shadow-inner mb-6`}>
                <div className="absolute inset-0 rounded-full ring-8 ring-white"></div>
                <div className="text-center z-10">
                  <span className={`text-5xl font-bold tracking-tight ${theme.color}`}>
                    {results.overallScore}
                  </span>
                  <span className={`text-xl font-bold ${theme.color} opacity-50`}>/10</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-full shadow-sm">
                  {results.technology}
                </span>
                <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-full shadow-sm capitalize">
                  {results.difficulty}
                </span>
              </div>
            </div>

            {/* AI Feedback (Right Side) */}
            <div className="md:col-span-7 p-8">
              <div className="flex items-center gap-2 mb-4">
                <FiAward className="text-teal-600" size={20} />
                <h3 className="text-lg font-semibold text-slate-900">AI Evaluation Feedback</h3>
              </div>
              
              <div className={`p-5 rounded-xl border ${theme.bg} ${theme.border} ${theme.color} mb-8`}>
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                  {results.feedback}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border border-slate-100 bg-slate-50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-slate-800 mb-1">{results.percentage}%</div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Accuracy</div>
                </div>
                <div className="p-4 border border-slate-100 bg-slate-50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-slate-800 mb-1">{results.totalQuestions}</div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Questions</div>
                </div>
                <div className="p-4 border border-slate-100 bg-slate-50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-slate-800 mb-1 capitalize">{results.difficulty.charAt(0)}</div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Level</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons Bar */}
          <div className="p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/interview')}
              className="flex-1 bg-teal-600 hover:bg-teal-500 text-white py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20"
            >
              <FiRotateCcw size={16} className="opacity-80" />
              Try Another Session
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FiHome size={16} className="opacity-80" />
              Return to Dashboard
            </button>
          </div>
        </div>

        {/* Tips for Improvement */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-2 mb-6">
            <FiZap className="text-amber-500" size={20} />
            <h3 className="text-lg font-semibold text-slate-900">Recommended Next Steps</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <FiBook size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-1">Study Fundamentals</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Focus on core principles and language specifications to build a stronger foundation.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FiTarget size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-1">Target Weak Areas</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Identify specific concepts you struggled with today and dedicate focused practice to them.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <FiRotateCcw size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-1">Practice Regularly</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Consistent daily practice improves concept retention and reduces interview anxiety.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <FiClock size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-1">Time Management</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Practice structuring your thoughts and delivering clear answers within a reasonable time limit.</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default InterviewResults;