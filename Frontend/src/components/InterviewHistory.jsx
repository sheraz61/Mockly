import { FiInbox, FiCode, FiBarChart2 } from 'react-icons/fi';

const statusStyles = {
  completed: 'bg-teal-50 text-teal-700 border border-teal-100',
  'in-progress': 'bg-amber-50 text-amber-700 border border-amber-100',
  default: 'bg-slate-100 text-slate-600 border border-slate-200',
};

const scoreBarColor = (score) => {
  if (score >= 8) return 'bg-teal-600';
  if (score >= 6) return 'bg-slate-600';
  if (score >= 4) return 'bg-amber-500';
  return 'bg-rose-500';
};

const InterviewHistory = ({ interviews, isPublic = false }) => {
  if (interviews.length === 0) {
    return (
      <div className="text-center py-14">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <FiInbox className="text-slate-400" size={22} />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1.5">No interviews yet</h3>
        <p className="text-slate-500 text-sm">
          {isPublic
            ? 'This user has not completed any interviews yet.'
            : 'You have not completed any interviews yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {interviews.map((interview) => (
        <div
          key={interview._id}
          className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 transition-colors duration-200"
        >
          <div className="flex justify-between items-start gap-4 mb-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                <FiCode className="text-slate-500" size={15} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">
                  {interview.technology || 'General Interview'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {new Date(interview.createdAt).toLocaleDateString()} &middot;{' '}
                  {interview.difficulty || 'Not specified'}
                </p>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusStyles[interview.status] || statusStyles.default
                }`}
            >
              {interview.status}
            </span>
          </div>

          {interview.overallScore != null && (
            <div className="flex items-center gap-3 mt-3">
              <FiBarChart2 className="text-slate-400 shrink-0" size={15} />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-medium text-slate-500">Overall score</span>
                  <span className="text-xs font-bold text-slate-900">{interview.overallScore}/10</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${scoreBarColor(interview.overallScore)}`}
                    style={{ width: `${(interview.overallScore / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {interview.feedback && (
            <div className="mt-3 p-3.5 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-sm text-slate-600 leading-relaxed">{interview.feedback}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InterviewHistory;