import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAnalytics } from '../store/slices/profileSlice';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line 
} from 'recharts';
import { FiTrendingUp, FiActivity } from 'react-icons/fi';

const AnalyticsTab = () => {
  const dispatch = useDispatch();
  const { analytics, analyticsLoading } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getUserAnalytics());
  }, [dispatch]);

  if (analyticsLoading || !analytics) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-teal-700"></div>
      </div>
    );
  }

  // Custom tooltip to mimic Shadcn UI style
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm text-sm">
          <p className="font-semibold text-slate-900 mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: payload[0].color || payload[0].fill }}
            />
            <span className="text-slate-600">
              Score: <span className="font-medium text-slate-900">{payload[0].value}</span>
            </span>
          </div>
          {payload[0].payload.count && (
            <p className="text-xs text-slate-500 mt-1">Based on {payload[0].payload.count} interviews</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Chart 1: Performance Trend */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
            <FiTrendingUp className="text-teal-600" size={16} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 leading-none">Performance Trend</h3>
            <p className="text-xs text-slate-500 mt-1">Average score over the last 30 days</p>
          </div>
        </div>

        {analytics.performanceTrend?.length > 0 ? (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.performanceTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis 
                  domain={[0, 10]} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <Tooltip content={<CustomTooltip />} />
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
        ) : (
          <div className="h-[200px] flex items-center justify-center border border-dashed border-slate-200 rounded-lg bg-slate-50">
            <p className="text-sm text-slate-500">Not enough data to show trends.</p>
          </div>
        )}
      </div>

      {/* Chart 2: Strengths by Technology */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
            <FiActivity className="text-slate-600" size={16} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 leading-none">Technical Strengths</h3>
            <p className="text-xs text-slate-500 mt-1">Average score categorized by technology</p>
          </div>
        </div>

        {analytics.techStrengths?.length > 0 ? (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.techStrengths} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="technology" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis 
                  domain={[0, 10]} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar 
                  dataKey="score" 
                  fill="#0f172a" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center border border-dashed border-slate-200 rounded-lg bg-slate-50">
            <p className="text-sm text-slate-500">Complete interviews to see your strengths.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default AnalyticsTab;
