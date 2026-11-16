import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsApi } from '../api/client';
import {
  BarChart3,
  Eye,
  Package,
  Users,
  Sparkles,
  PhoneCall,
  Activity,
  Calendar,
  RotateCcw,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

const AnalyticsPage = () => {
  const { business } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await analyticsApi.getOverview();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [business]);

  if (!business) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center max-w-xl mx-auto border border-slate-200 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Setup Business Profile First</h2>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
          Analytics are recorded once you create your business profile and visitors start viewing your public webpage.
        </p>
        <Link
          to="/dashboard/profile/edit"
          className="mt-6 inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md"
        >
          <span>Create Business Profile</span>
        </Link>
      </div>
    );
  }

  const weeklyData = data?.weekly_timeline?.length > 0
    ? data.weekly_timeline
    : [
        { day: 'Mon', views: 0, activities: 0 },
        { day: 'Tue', views: 0, activities: 0 },
        { day: 'Wed', views: 0, activities: 0 },
        { day: 'Thu', views: 0, activities: 0 },
        { day: 'Fri', views: 0, activities: 0 },
        { day: 'Sat', views: 0, activities: 0 },
        { day: 'Sun', views: 0, activities: 0 },
      ];

  const breakdownData = [
    { name: 'Profile Views', count: data?.profile_views || 0, fill: '#2563eb' },
    { name: 'Product Items', count: data?.product_count || 0, fill: '#4f46e5' },
    { name: 'Direct Inquiries', count: data?.inquiries_count || 0, fill: '#10b981' },
    { name: 'Collaborations', count: data?.collaboration_requests || 0, fill: '#f59e0b' },
    { name: 'AI Marketing', count: data?.marketing_generations || 0, fill: '#ec4899' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900">Enterprise Growth Analytics</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Real Data
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Actual recorded footfall, customer inquiries, and engagement metrics for {business.name}.
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Profile Views */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Webpage Views</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{data?.profile_views || 0}</p>
          <p className="text-[10px] text-slate-400 mt-1">Verified unique visits</p>
        </div>

        {/* Customer Inquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Customer Inquiries</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{data?.inquiries_count || 0}</p>
          <p className="text-[10px] text-slate-400 mt-1">WhatsApp & Call clicks</p>
        </div>

        {/* Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Catalog Items</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{data?.product_count || 0}</p>
          <p className="text-[10px] text-slate-400 mt-1">Active listed products</p>
        </div>

        {/* Collaborations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Partnerships</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{data?.collaboration_requests || 0}</p>
          <p className="text-[10px] text-slate-400 mt-1">B2B requests received</p>
        </div>

        {/* AI Content */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">AI Marketing</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{data?.marketing_generations || 0}</p>
          <p className="text-[10px] text-slate-400 mt-1">Copy kits generated</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Visitor Trajectory */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Weekly Visitor Trajectory</h3>
            <p className="text-xs text-slate-500">Day-by-day recorded visits from local customers</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaViews" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="views" name="Visits" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#areaViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Engagement Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Platform Engagement Breakdown</h3>
            <p className="text-xs text-slate-500">Distribution across business activities</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdownData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" name="Total Actions" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Audit Trail */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Audit Trail & Action Log</h3>
        <p className="text-xs text-slate-500 mb-4">Chronological log of verified user and visitor events</p>

        {data?.activity_log?.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {data.activity_log.map((act, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <div>
                    <span className="font-semibold text-slate-800">{act.action}</span>
                    <span className="text-slate-500 text-[11px] ml-2">— {act.details}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {act.timestamp ? new Date(act.timestamp).toLocaleString() : 'Recent'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-6">No events recorded yet.</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
