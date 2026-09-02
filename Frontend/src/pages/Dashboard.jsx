import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserProfileCard from '../components/UserProfileCard';
import { getAllUserProfiles } from '../store/slices/dashboardSlice';
import { FiAlertCircle, FiSearch, FiUsers } from 'react-icons/fi';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profiles, loading, error, totalUsers } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getAllUserProfiles());
  }, [dispatch]);

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-slate-900 rounded-2xl p-7 md:p-9 mb-8 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Welcome back, {user?.name}
              </h1>
              <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                Discover talented professionals across the community and see how their interview
                performance compares.
              </p>
            </div>
            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 shrink-0">
              <FiUsers className="text-teal-400" size={16} />
              <span className="text-white text-sm font-semibold">{totalUsers ?? profiles.length}</span>
              <span className="text-slate-400 text-sm">profiles</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 px-5 py-3.5 rounded-lg mb-6 text-sm">
            <FiAlertCircle className="shrink-0 mt-0.5" size={16} />
            {error}
          </div>
        )}

        {/* User Profiles Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-900">User profiles</h2>
          </div>

          {profiles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-14 text-center">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <FiSearch className="text-slate-400" size={22} />
              </div>
              <h3 className="text-base font-semibold text-slate-900">No profiles found</h3>
              <p className="text-slate-500 text-sm mt-1">Check back later as more members join.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {profiles.map((profile, index) => (
                <UserProfileCard key={profile.id} profile={profile} rank={index + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;