import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsApi, businessApi } from '../api/client';
import {
  Building2,
  Package,
  Eye,
  Users,
  Sparkles,
  ArrowUpRight,
  PlusCircle,
  Globe,
  Share2,
  Calendar,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Activity,
  CheckCircle,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

const DashboardPage = () => {
  const { user, business } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await analyticsApi.getOverview();
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to load analytics overview:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const copyPublicLink = () => {
    if (!business) return;
    const url = `${window.location.origin}/biz/${business.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const chartData = analytics?.weekly_timeline?.length > 0
    ? analytics.weekly_timeline
    : [
        { day: 'Mon', views: 0, activities: 0 },
        { day: 'Tue', views: 0, activities: 0 },
        { day: 'Wed', views: 0, activities: 0 },
        { day: 'Thu', views: 0, activities: 0 },
        { day: 'Fri', views: 0, activities: 0 },
        { day: 'Sat', views: 0, activities: 0 },
        { day: 'Sun', views: 0, activities: 0 },
      ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-md border border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-medium mb-2">
            <span>MSME Growth Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name || 'Entrepreneur'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {business
              ? `Managing ${business.name} (${business.category} in ${business.city})`
              : 'Complete your business profile setup to generate your public webpage and start hyperlocal discovery.'}
          </p>
        </div>

        {business ? (
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={copyPublicLink}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-600 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-400" />
              <span>{copiedLink ? 'Copied Public URL!' : 'Share Public Link'}</span>
            </button>
            <Link
              to={`/biz/${business.id}`}
              target="_blank"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>View Webpage</span>
            </Link>
          </div>
        ) : (
          <Link
            to="/dashboard/profile/edit"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Setup Business Profile</span>
          </Link>
        )}
      </div>

      {/* Warning prompt if business profile is not yet created */}
      {!business && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">Action Required</h4>
            <p className="text-xs text-amber-700 mt-0.5">
              Your business is not yet listed in the Hyperlocal Directory. Click below to add your business name, location, and city.
            </p>
            <Link
              to="/dashboard/profile/edit"
              className="mt-2 inline-flex items-center text-xs font-semibold text-amber-900 underline hover:text-amber-800"
            >
              Create Business Profile Now &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* 4 Core Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Profile Views</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-3">
            {analytics?.profile_views ?? 0}
          </p>
          <div className="flex items-center space-x-1 mt-2 text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>Actual verified visitor counts</span>
          </div>
        </div>

        {/* Listed Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Listed Products</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-3">
            {analytics?.product_count ?? 0}
          </p>
          <div className="flex items-center space-x-1 mt-2 text-[11px] text-slate-500">
            <Link to="/dashboard/products" className="text-blue-600 hover:underline font-medium">
              Manage product catalog &rarr;
            </Link>
          </div>
        </div>

        {/* Collaboration Requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Collaboration Requests</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-3">
            {analytics?.collaboration_requests ?? 0}
          </p>
          <div className="flex items-center space-x-1 mt-2 text-[11px] text-slate-500">
            <Link to="/dashboard/collaborations" className="text-blue-600 hover:underline font-medium">
              View network inquiries &rarr;
            </Link>
          </div>
        </div>

        {/* AI Marketing Generations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Marketing Created</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-3">
            {analytics?.marketing_generations ?? 0}
          </p>
          <div className="flex items-center space-x-1 mt-2 text-[11px] text-slate-500">
            <Link to="/dashboard/marketing" className="text-amber-600 hover:underline font-medium">
              Generate new copy &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Weekly Business Engagement</h3>
              <p className="text-xs text-slate-500">Recorded visitor traffic and owner activity over time</p>
            </div>
            <Link to="/dashboard/analytics" className="text-xs font-semibold text-blue-600 hover:underline flex items-center">
              <span>Full Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="views" name="Profile Visits" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="activities" name="Platform Actions" stroke="#f59e0b" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Quick Actions</h3>
            <p className="text-xs text-slate-500 mb-4">Fast shortcuts for daily business growth</p>

            <div className="space-y-2.5">
              <Link
                to="/dashboard/products"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Add New Product</p>
                    <p className="text-[10px] text-slate-500">Expand your online catalog</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </Link>

              <Link
                to="/dashboard/marketing"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200/80 hover:border-amber-200 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Generate AI Copy</p>
                    <p className="text-[10px] text-slate-500">Social posts, slogans & ads</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
              </Link>

              <Link
                to="/explore"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Find Collaboration Partners</p>
                    <p className="text-[10px] text-slate-500">Connect with nearby MSMEs</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </Link>

              <Link
                to="/opportunities"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Explore Govt Schemes</p>
                    <p className="text-[10px] text-slate-500">PMEGP, ZED, Mudra subsidies</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Business Activities</h3>
            <p className="text-xs text-slate-500">Real recorded audit events for your enterprise</p>
          </div>
          <Activity className="w-4 h-4 text-slate-400" />
        </div>

        {analytics?.activity_log?.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {analytics.activity_log.map((act, index) => (
              <div key={index} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <div>
                    <p className="font-semibold text-slate-800">{act.action}</p>
                    <p className="text-slate-500 text-[11px]">{act.details}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">
                  {act.timestamp ? new Date(act.timestamp).toLocaleDateString() : 'Recent'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            No activities recorded yet. Start by listing a product or generating marketing content!
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
