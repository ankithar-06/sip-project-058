import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Package,
  Sparkles,
  Users,
  BarChart3,
  Globe,
  Award,
  Search,
  LogOut,
  Menu,
  X,
  ExternalLink,
  PlusCircle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, business, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Business Profile', path: '/dashboard/profile', icon: Building2 },
    { name: 'Product Catalog', path: '/dashboard/products', icon: Package },
    { name: 'AI Marketing Studio', path: '/dashboard/marketing', icon: Sparkles, badge: 'AI' },
    { name: 'Collaboration Hub', path: '/dashboard/collaborations', icon: Users },
    { name: 'Business Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Hyperlocal Discovery', path: '/explore', icon: Search },
    { name: 'Govt Schemes & Grants', path: '/opportunities', icon: Award },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-tight">MSME Connect AI</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo Area */}
        <div className="p-5 border-b border-slate-800/80">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-white text-base">MSME Connect</span>
                <span className="px-1 py-0.2 text-[9px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">AI</span>
              </div>
              <p className="text-[10px] text-slate-400">Owner Workspace</p>
            </div>
          </Link>
        </div>

        {/* Business Identity Card in Sidebar */}
        <div className="p-3 mx-3 my-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
          {business ? (
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white truncate max-w-[140px]">{business.name}</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 capitalize">{business.category} • {business.city}</p>
              
              <Link
                to={`/biz/${business.id}`}
                target="_blank"
                className="mt-2.5 flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-[11px] font-medium border border-blue-500/30 transition-colors"
              >
                <span className="flex items-center space-x-1">
                  <Globe className="w-3 h-3" />
                  <span>Public Webpage</span>
                </span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="text-center py-1">
              <p className="text-xs text-amber-300 font-medium">Business Profile Pending</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Setup profile to activate public site</p>
              <Link
                to="/dashboard/profile/edit"
                className="mt-2 inline-flex items-center justify-center w-full px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors"
              >
                <PlusCircle className="w-3 h-3 mr-1" />
                <span>Create Business</span>
              </Link>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                    active ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-xs font-semibold uppercase">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-medium text-white truncate">{user?.name || 'MSME Owner'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Breadcrumb Header for Desktop */}
        <header className="hidden md:flex items-center justify-between bg-white border-b border-slate-200 px-8 py-3.5 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Link to="/dashboard" className="hover:text-blue-600 font-medium">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold capitalize">
              {location.pathname.replace('/dashboard', '').replace('/', '') || 'Overview'}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {business && (
              <Link
                to={`/biz/${business.id}`}
                target="_blank"
                className="inline-flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>View Public Webpage</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>
            )}
            <Link
              to="/dashboard/marketing"
              className="inline-flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Studio</span>
            </Link>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 z-30 md:hidden backdrop-blur-xs"
        />
      )}
    </div>
  );
};

export default DashboardLayout;
