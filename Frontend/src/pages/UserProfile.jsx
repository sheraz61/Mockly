import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyProfile, updateProfile, clearProfileError } from '../store/slices/profileSlice';
import ProfileForm from '../components/ProfileForm';
import InterviewHistory from '../components/InterviewHistory';
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
    const completedInterviews = interviews.length;
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
        {/* Header Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-teal-700 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">{user?.name}</h1>
                <p className="text-slate-500 text-sm">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${isEditing
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

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 px-5 py-3.5 rounded-lg mb-6 text-sm">
            <FiAlertCircle className="shrink-0 mt-0.5" size={16} />
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
          <div className="flex gap-6 border-b border-slate-200">
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
          <div className="pt-7">
            {activeTab === 'overview' && (
              <div>
                {isEditing ? (
                  <ProfileForm
                    profile={myProfile}
                    onSave={handleSaveProfile}
                    onCancel={() => setIsEditing(false)}
                    loading={updating}
                  />
                ) : (
                  <ProfileOverview profile={myProfile} />
                )}
              </div>
            )}

            {activeTab === 'interviews' && <InterviewHistory interviews={interviews} />}
          </div>
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

// Profile Overview Component
const ProfileOverview = ({ profile }) => (
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