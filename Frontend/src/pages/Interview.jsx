import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { startInterview, clearInterviewError } from '../store/slices/interviewSlice';
import {
  FiCode,
  FiBarChart2,
  FiCheckCircle,
  FiMessageSquare,
  FiClock,
  FiBookOpen,
  FiPlay,
  FiAlertCircle,
  FiSearch,
  FiLayout,
  FiServer,
  FiDatabase,
  FiCloud,
  FiTrendingUp,
  FiStar,
  FiShield,
  FiAward,
  FiZap
} from 'react-icons/fi';

const Interview = () => {
  const [formData, setFormData] = useState({
    technology: '',
    difficulty: 'beginner'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isCustomTech, setIsCustomTech] = useState(false);
  const [customTechValue, setCustomTechValue] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.interview);

  const techCategories = [
    {
      name: 'Frontend',
      icon: <FiLayout size={16} className="text-blue-500" />,
      techs: ['JavaScript', 'React', 'HTML/CSS', 'TypeScript', 'Vue.js', 'Angular', 'Next.js']
    },
    {
      name: 'Backend',
      icon: <FiServer size={16} className="text-emerald-500" />,
      techs: ['Node.js', 'Python', 'Java', 'Express.js', 'PHP', 'Laravel', 'Spring Boot']
    },
    {
      name: 'Database',
      icon: <FiDatabase size={16} className="text-amber-500" />,
      techs: ['MongoDB', 'SQL', 'MySQL', 'PostgreSQL', 'Redis', 'GraphQL']
    },
    {
      name: 'Cloud & Mobile',
      icon: <FiCloud size={16} className="text-purple-500" />,
      techs: ['AWS', 'Docker', 'React Native', 'Redux']
    }
  ];

  const difficultyOptions = [
    {
      value: 'beginner',
      label: 'Beginner',
      icon: <FiStar size={24} />,
      desc: 'Fundamentals & basic syntax',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200 ring-emerald-600'
    },
    {
      value: 'intermediate',
      label: 'Intermediate',
      icon: <FiTrendingUp size={24} />,
      desc: 'Architecture & practical scenarios',
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200 ring-blue-600'
    },
    {
      value: 'advanced',
      label: 'Advanced',
      icon: <FiShield size={24} />,
      desc: 'Complex algorithms & performance',
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200 ring-amber-500'
    },
    {
      value: 'expert',
      label: 'Expert',
      icon: <FiAward size={24} />,
      desc: 'System design & scalable patterns',
      color: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200 ring-rose-600'
    }
  ];

  const handleTechSelect = (tech) => {
    setIsCustomTech(false);
    setCustomTechValue('');
    setFormData(prev => ({ ...prev, technology: tech }));
    dispatch(clearInterviewError());
  };

  const handleDifficultySelect = (difficulty) => {
    setFormData(prev => ({ ...prev, difficulty }));
    dispatch(clearInterviewError());
  };

  const handleStartInterview = async (e) => {
    e.preventDefault();

    if (!formData.technology) {
      dispatch(clearInterviewError());
      // The button is disabled anyway if no tech is selected
      return;
    }

    try {
      const result = await dispatch(startInterview(formData)).unwrap();

      if (result.success) {
        navigate('/interview-session', {
          state: {
            interviewId: result.data.interviewId,
            currentQuestion: result.data.question,
            questionNumber: result.data.questionNumber,
            totalQuestions: result.data.totalQuestions,
            technology: result.data.technology,
            difficulty: result.data.difficulty
          }
        });
      }
    } catch (error) {
      console.error('Failed to start interview:', error);
    }
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return techCategories;
    const query = searchQuery.toLowerCase();

    return techCategories.map(cat => ({
      ...cat,
      techs: cat.techs.filter(tech => tech.toLowerCase().includes(query))
    })).filter(cat => cat.techs.length > 0);
  }, [searchQuery]);

  const activeDifficulty = difficultyOptions.find(d => d.value === formData.difficulty);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="mb-10 max-w-3xl">
          <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
            Create Interview Session
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            Select your target technology and desired difficulty level to generate a custom, AI-evaluated technical interview tailored to your expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Setup Form */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {error && (
              <div className="mx-8 mt-8 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-start gap-3">
                <FiAlertCircle className="mt-0.5 shrink-0" size={18} />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleStartInterview} className="divide-y divide-slate-100">

              {/* Technology Selection Section */}
              <div className="p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <FiCode className="text-teal-600" size={20} />
                      1. Choose Technology
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Select the primary framework or language.</p>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-slate-400" size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search technologies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-colors bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <div key={category.name}>
                        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
                          {category.icon}
                          {category.name}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {category.techs.map((tech) => (
                            <button
                              key={tech}
                              type="button"
                              onClick={() => handleTechSelect(tech)}
                              className={`px-3 py-2.5 border rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group ${formData.technology === tech
                                ? 'border-teal-600 bg-teal-50 text-teal-800 ring-1 ring-teal-600'
                                : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                              <span className="truncate">{tech}</span>
                              {formData.technology === tech && (
                                <FiCheckCircle size={14} className="text-teal-600 shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-slate-500 text-sm">No technologies found matching "{searchQuery}"</p>
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="text-teal-600 text-sm font-medium hover:underline mt-2"
                      >
                        Clear search
                      </button>
                    </div>
                  )}
                </div>

                {isCustomTech ? (
                  <div className="mt-6 p-5 border border-teal-200 bg-teal-50/50 rounded-xl">
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Enter Custom Topic</label>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        autoFocus
                        placeholder="e.g., System Design, Kubernetes, Cyber Security..."
                        value={customTechValue}
                        onChange={(e) => {
                          setCustomTechValue(e.target.value);
                          setFormData(prev => ({...prev, technology: e.target.value}));
                        }}
                        className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 bg-white"
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsCustomTech(false);
                          setFormData(prev => ({...prev, technology: ''}));
                          setCustomTechValue('');
                        }}
                        className="px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 text-slate-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => { 
                      setIsCustomTech(true); 
                      setFormData(prev => ({...prev, technology: ''})); 
                      setSearchQuery('');
                      dispatch(clearInterviewError()); 
                    }}
                    className="mt-6 w-full py-3.5 border-2 border-dashed border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:border-teal-300 hover:bg-teal-50/50 hover:text-teal-700 transition-all flex items-center justify-center gap-2 group"
                  >
                    <span className="w-6 h-6 rounded-md bg-slate-100 group-hover:bg-teal-100 flex items-center justify-center text-slate-400 group-hover:text-teal-600 transition-colors">+</span>
                    Don't see your topic? Enter a custom one
                  </button>
                )}
              </div>

              {/* Difficulty Selection Section */}
              <div className="p-8 bg-slate-50/50">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <FiBarChart2 className="text-teal-600" size={20} />
                    2. Select Difficulty
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Tailor the questions to your experience level.</p>
                </div>

                <div className="flex flex-col sm:flex-row w-full bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm gap-1 sm:gap-0">
                  {difficultyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleDifficultySelect(option.value)}
                      className={`flex-1 flex flex-col items-center justify-center py-4 px-2 rounded-lg transition-all duration-300 ${formData.difficulty === option.value
                        ? `${option.bg} ${option.color} shadow-sm ring-1 ring-black/5 scale-[1.02]`
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      <span className="mb-2">{option.icon}</span>
                      <span className="font-semibold text-sm mb-1">{option.label}</span>
                      <span className="text-[11px] text-center px-2 opacity-80 hidden md:block">
                        {option.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </form>
          </div>

          {/* Right Column - Dynamic Preview Panel */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">

            {/* Session Overview Card */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-sm font-medium text-slate-400 tracking-wide uppercase mb-6">
                  Session Overview
                </h3>

                <div className="space-y-6">
                  <div>
                    <p className="text-slate-400 text-xs font-medium mb-1.5">Selected Technology</p>
                    <div className="flex items-center gap-2">
                      {formData.technology ? (
                        <>
                          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
                            <FiCode size={16} />
                          </div>
                          <span className="text-lg font-semibold text-white">{formData.technology}</span>
                        </>
                      ) : (
                        <span className="text-sm text-slate-500 italic">None selected</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-400 text-xs font-medium mb-1.5">Target Difficulty</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${activeDifficulty.value === 'expert' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                        activeDifficulty.value === 'advanced' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                          activeDifficulty.value === 'intermediate' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}>
                        {activeDifficulty.icon}
                      </div>
                      <div>
                        <span className="text-base font-semibold text-white block leading-tight">{activeDifficulty.label}</span>
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-800" />

                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-slate-300">
                      <FiCheckCircle className="text-teal-500 shrink-0" size={16} />
                      5 dynamic questions
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-300">
                      <FiCheckCircle className="text-teal-500 shrink-0" size={16} />
                      Instant AI evaluation
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-300">
                      <FiCheckCircle className="text-teal-500 shrink-0" size={16} />
                      Actionable feedback
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-800/50 border-t border-slate-800">
                <button
                  onClick={handleStartInterview}
                  disabled={loading || !formData.technology}
                  className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-500 text-white py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Preparing Session...
                    </>
                  ) : (
                    <>
                      <FiPlay size={16} className={formData.technology ? 'text-teal-100' : ''} />
                      Start Interview
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Preparation Tips */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FiBookOpen className="text-teal-600" size={16} />
                Pro Tips
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Treat this like a real interview. Speak your thoughts clearly and structure your answers before submitting.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    If asked to write code, focus on readability and time complexity first.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;