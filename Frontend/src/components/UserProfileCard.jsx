import { Link } from 'react-router-dom';
import { FiAward, FiCode, FiBarChart2, FiBriefcase, FiMapPin } from 'react-icons/fi';

const getScoreColor = (score) => {
  if (score >= 8) return 'text-teal-700 bg-teal-50';
  if (score >= 6) return 'text-slate-700 bg-slate-100';
  if (score >= 4) return 'text-amber-700 bg-amber-50';
  return 'text-rose-700 bg-rose-50';
};

const scoreBarColor = (score) => {
  if (score >= 8) return 'bg-teal-600';
  if (score >= 6) return 'bg-slate-600';
  if (score >= 4) return 'bg-amber-500';
  return 'bg-rose-500';
};

const rankBadgeStyle = (rank) => {
  if (rank === 1) return 'bg-amber-100 text-amber-700';
  if (rank === 2) return 'bg-slate-200 text-slate-700';
  if (rank === 3) return 'bg-orange-100 text-orange-700';
  return 'bg-slate-100 text-slate-500';
};

const UserProfileCard = ({ profile, rank }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
      {/* Header with Rank and Basic Info */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full bg-teal-700 flex items-center justify-center text-white font-semibold text-base shrink-0">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 text-sm truncate">{profile.name}</h3>
              <p className="text-xs text-slate-500 truncate">{profile.email}</p>
            </div>
          </div>
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${rankBadgeStyle(
              rank
            )}`}
          >
            {rank <= 3 && <FiAward size={11} />}
            {`#${rank}`}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="flex items-center gap-2 mb-1.5">
          <FiCode className="text-slate-400 shrink-0" size={13} />
          <span className="text-xs text-slate-600 font-medium truncate">{profile.techStack}</span>
        </div>

        {/* Experience */}
        <div className="flex items-center gap-2">
          <FiBarChart2 className="text-slate-400 shrink-0" size={13} />
          <span className="text-xs text-slate-600">{profile.experience}</span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-5">
        {/* Score Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-slate-500">Interview score</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getScoreColor(profile.averageScore)}`}>
              {profile.averageScore}/10
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${scoreBarColor(profile.averageScore)}`}
              style={{ width: `${profile.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="text-center p-2.5 bg-slate-50 rounded-lg">
            <div className="text-base font-bold text-slate-900">{profile.totalInterviews}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Interviews</div>
          </div>
          <div className="text-center p-2.5 bg-slate-50 rounded-lg">
            <div className="text-base font-bold text-slate-900">{profile.percentage}%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Success rate</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 space-y-1.5">
          {profile.currentRole !== 'Not specified' && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <FiBriefcase size={12} className="text-slate-400 shrink-0" />
              <span className="truncate">{profile.currentRole}</span>
            </div>
          )}
          {profile.location !== 'Not specified' && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <FiMapPin size={12} className="text-slate-400 shrink-0" />
              <span>{profile.location}</span>
            </div>
          )}
        </div>

        {/* Join Date */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <p className="text-[11px] text-slate-400">
            Joined{' '}
            {new Date(profile.joinedDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
            })}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-5 pb-5">
        <Link
          to={`/profile/${profile.id}`}
          className="block w-full bg-slate-900 text-white py-2.5 rounded-lg hover:bg-slate-800 transition-colors duration-200 text-xs font-semibold text-center"
        >
          View full profile
        </Link>
      </div>
    </div>
  );
};

export default UserProfileCard;