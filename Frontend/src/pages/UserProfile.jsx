import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMyProfile, getUserProfile, updateProfile, clearProfileError, clearUserProfile } from '../store/slices/profileSlice';
import ProfileForm from '../components/ProfileForm';
import InterviewHistory from '../components/InterviewHistory';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  FiEdit2,
  FiX,
  FiAlertCircle,
  FiGrid,
  FiClock,
  FiLinkedin,
  FiGithub,
  FiBriefcase,
  FiMapPin,
  FiLayers,
  FiAward,
} from 'react-icons/fi';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { myProfile, interviews, loading, updating, error } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(getMyProfile());

    return () => {
      dispatch(clearUserProfile());
    };
  }, [dispatch]);

  const handleSaveProfile = async (profileData) => {
    try {
      await dispatch(updateProfile(profileData)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };



  const calculateStats = () => {
    const totalInterviews = interviews.length;
    const completedInterviews = interviews.filter(i => i.overallScore != null).length;
    const averageScore =
      interviews.length > 0
        ? Math.round((interviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / interviews.length) * 10) / 10
        : 0;

    return { totalInterviews, completedInterviews, averageScore };
  };

  const stats = calculateStats();

  if (loading) {
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

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 sticky top-24">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-teal-700 flex items-center justify-center text-white font-bold text-3xl mb-4 shrink-0">
                  {(myProfile?.name || user?.name)?.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-xl font-bold text-slate-900 mb-1">{myProfile?.name || user?.name}</h1>
                {(myProfile?.email || user?.email) && <p className="text-slate-500 text-sm mb-5">{myProfile?.email || user?.email}</p>}
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`w-full inline-flex justify-center items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 shrink-0 ${isEditing
                    ? 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                >
                  {isEditing ? (
                    <>
                      <FiX size={15} /> Cancel editing
                    </>
                  ) : (
                    <>
                      <FiEdit2 size={15} /> Edit profile
                    </>
                  )}
                </button>
              </div>

              <div className="border-t border-slate-100 pt-6 space-y-4">
                <StatRow icon={FiGrid} label="Total interviews" value={stats.totalInterviews} />
                <StatRow icon={FiClock} label="Completed" value={stats.completedInterviews} />
                <StatRow icon={FiAward} label="Average score" value={`${stats.averageScore}/10`} />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            {error && (
              <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 px-5 py-3.5 rounded-lg mb-6 text-sm">
                <FiAlertCircle className="shrink-0 mt-0.5" size={16} />
                {error}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              {/* Tab Navigation */}
              <div className="flex gap-6 border-b border-slate-200 mb-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`relative pb-3.5 text-sm font-medium transition-colors duration-200 ${activeTab === 'overview' ? 'text-teal-700' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  Overview
                  {activeTab === 'overview' && (
                    <span className="absolute left-0 right-0 -bottom-[1px] h-0.5 bg-teal-700 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('interviews')}
                  className={`relative pb-3.5 text-sm font-medium transition-colors duration-200 ${activeTab === 'interviews' ? 'text-teal-700' : 'text-slate-500 hover:text-slate-700'
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
                <div className="animate-fade-in">
                  {isEditing ? (
                    <ProfileForm
                      profile={myProfile}
                      onSave={handleSaveProfile}
                      onCancel={() => setIsEditing(false)}
                      loading={updating}
                    />
                  ) : (
                    <ProfileOverview profile={myProfile} interviews={interviews} />
                  )}
                </div>
              )}

              {activeTab === 'interviews' && (
                <div className="animate-fade-in">
                  <InterviewHistory interviews={interviews} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3 text-slate-600">
      <div className="w-8 h-8 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center">
        <Icon size={14} className="text-teal-700" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
    <span className="font-bold text-slate-900">{value}</span>
  </div>
);

// Performance Chart Component
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
      <div className="mb-10">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
          Performance Trend
        </h3>
        <div className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm border border-slate-100">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <p className="text-sm font-medium">No performance data yet</p>
          <p className="text-xs mt-1">Complete an interview to see your trend</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-6 flex items-center justify-between">
        Performance Trend
        <span className="text-xs text-teal-600 font-medium bg-teal-50 px-2 py-1 rounded-md lowercase tracking-normal">Recent</span>
      </h3>
      <div className="h-56 w-full -ml-4">
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

// Profile Overview Component
const ProfileOverview = ({ profile, interviews }) => (
  <div>
    <PerformanceChart interviews={interviews} />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Personal Information */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
          Personal information
        </h3>
        <div className="space-y-1">
          <InfoItem icon={FiBriefcase} label="Current role" value={profile?.profile?.currentRole} />
          <InfoItem icon={FiLayers} label="Experience" value={profile?.profile?.experience} />
          <InfoItem icon={FiMapPin} label="Location" value={profile?.profile?.location} />
          <InfoItem icon={FiGrid} label="Tech stack" value={profile?.profile?.techStack} />
          <InfoItem icon={FiAward} label="Skills" value={profile?.profile?.skills} />
        </div>
      </div>

      {/* Bio & Links */}
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

// Reusable Info Item Component
const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
    <span className="flex items-center gap-2.5 text-slate-500 text-sm font-medium">
      <Icon size={15} className="text-slate-400" />
      {label}
    </span>
    <span className="text-slate-900 text-sm font-medium text-right">{value || 'Not specified'}</span>
  </div>
);

export default UserProfile;