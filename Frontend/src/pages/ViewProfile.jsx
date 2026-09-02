import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, clearUserProfile } from '../store/slices/profileSlice';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import InterviewHistory from '../components/InterviewHistory';
import {
  FiAlertCircle,
  FiGrid,
  FiClock,
  FiLinkedin,
  FiGithub,
  FiBriefcase,
  FiMapPin,
  FiLayers,
  FiAward,
  FiArrowLeft
} from 'react-icons/fi';

const ViewProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userProfile, interviews, loading, error } = useSelector((state) => state.profile);
  
  const [localLoading, setLocalLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProfile = async () => {
      setLocalLoading(true);
      try {
        if (userId) {
          await dispatch(getUserProfile(userId)).unwrap();
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLocalLoading(false);
      }
    };

    fetchProfile();

    return () => {
      dispatch(clearUserProfile());
    };
  }, [dispatch, userId]);

  if (localLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-teal-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-14 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="text-slate-400" size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Profile Not Found</h2>
            <p className="text-slate-500 text-sm mb-6">
              {error || 'The requested profile could not be found.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 bg-teal-700 text-white hover:bg-teal-800"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const calculateStats = () => {
    const totalInterviews = interviews.length;
    const completedInterviews = interviews.length;
    const averageScore = interviews.length > 0 
      ? Math.round((interviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / interviews.length) * 10) / 10
      : 0;
    
    return { totalInterviews, completedInterviews, averageScore };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-teal-700 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                {userProfile.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">{userProfile.name}</h1>
                <p className="text-slate-500 text-sm">{userProfile.email}</p>
                {userProfile.createdAt && (
                  <p className="text-slate-400 text-xs mt-1">Joined {new Date(userProfile.createdAt).toLocaleDateString()}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <FiArrowLeft size={15} /> Back to dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon={FiGrid}
            value={stats.totalInterviews}
            label="Total interviews"
            accent="bg-slate-900"
          />
          <StatCard
            icon={FiClock}
            value={stats.completedInterviews}
            label="Completed"
            accent="bg-teal-700"
          />
          <StatCard
            icon={FiAward}
            value={`${stats.averageScore}/10`}
            label="Average score"
            accent="bg-amber-600"
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
          <div className="flex gap-6 border-b border-slate-200 mb-7">
            <button
              onClick={() => setActiveTab('overview')}
              className={`relative pb-3.5 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'overview' ? 'text-teal-700' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Overview
              {activeTab === 'overview' && (
                <span className="absolute left-0 right-0 -bottom-[1px] h-0.5 bg-teal-700 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('interviews')}
              className={`relative pb-3.5 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'interviews' ? 'text-teal-700' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Interview history
              {activeTab === 'interviews' && (
                <span className="absolute left-0 right-0 -bottom-[1px] h-0.5 bg-teal-700 rounded-full" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div>
              <ProfileOverview profile={userProfile} interviews={interviews} />
            </div>
          )}

          {activeTab === 'interviews' && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Interview History</h2>
              <InterviewHistory interviews={interviews} isPublic={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, value, label, accent }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-lg ${accent} flex items-center justify-center shrink-0`}>
      <Icon className="text-white" size={18} />
    </div>
    <div>
      <div className="text-2xl font-bold text-slate-900 leading-none">{value}</div>
      <div className="text-slate-500 text-sm mt-1">{label}</div>
    </div>
  </div>
);

const PerformanceChart = ({ interviews }) => {
  const chartData = [...(interviews || [])]
    .filter(i => i.overallScore != null)
    .reverse()
    .map((i, index) => ({
      name: `Int ${index + 1}`,
      score: i.overallScore
    }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-10">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
          Performance Trend
        </h3>
        <div className="flex flex-col items-center justify-center py-10 text-slate-500">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <p className="text-sm font-medium">No performance data yet</p>
          <p className="text-xs mt-1">This user hasn't completed any tracked interviews</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-10">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4 flex items-center justify-between">
        Performance Trend
        <span className="text-xs text-teal-600 font-medium bg-teal-50 px-2 py-1 rounded-md lowercase tracking-normal">Recent</span>
      </h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <XAxis dataKey="name" hide />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#0f766e', fontWeight: 600 }}
              formatter={(value) => [`${value}/10`, 'Score']}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#0f766e" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#0f766e', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#0f766e', stroke: '#ccfbf1', strokeWidth: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ProfileOverview = ({ profile, interviews }) => (
  <div>
    <PerformanceChart interviews={interviews} />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
          Professional information
        </h3>
        <div className="space-y-1">
          <InfoItem icon={FiBriefcase} label="Current role" value={profile?.profile?.currentRole} />
          <InfoItem icon={FiLayers} label="Experience" value={profile?.profile?.experience} />
          <InfoItem icon={FiMapPin} label="Location" value={profile?.profile?.location} />
          <InfoItem icon={FiGrid} label="Tech stack" value={profile?.profile?.techStack} />
          <InfoItem icon={FiAward} label="Skills" value={profile?.profile?.skills} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
          About &amp; links
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Bio</label>
            <p className="text-slate-700 text-sm bg-slate-50 border border-slate-100 p-4 rounded-lg min-h-[100px] leading-relaxed">
              {profile?.profile?.bio || 'No bio provided yet.'}
            </p>
          </div>

          <div className="flex gap-3">
            {profile?.profile?.linkedin && (
              <a
                href={profile.profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-teal-700 border border-slate-200 hover:border-teal-200 px-3.5 py-2 rounded-lg transition-colors duration-200"
              >
                <FiLinkedin size={15} /> LinkedIn
              </a>
            )}
            {profile?.profile?.github && (
              <a
                href={profile.profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-teal-700 border border-slate-200 hover:border-teal-200 px-3.5 py-2 rounded-lg transition-colors duration-200"
              >
                <FiGithub size={15} /> GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
    <span className="flex items-center gap-2.5 text-slate-500 text-sm font-medium">
      <Icon size={15} className="text-slate-400" />
      {label}
    </span>
    <span className="text-slate-900 text-sm font-medium text-right">{value || 'Not specified'}</span>
  </div>
);

export default ViewProfile;