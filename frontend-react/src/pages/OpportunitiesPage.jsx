import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { opportunityApi } from '../api/client';
import {
  Award,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Building,
  Coins,
  Filter,
  Info,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Credit & Subsidy',
  'Collateral-Free Loans',
  'Quality & Technology',
  'Micro Credit',
  'Market Access',
  'Inclusion & Startup',
  'Incubation & Rural',
];

const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (search.trim()) params.search = search.trim();
      const res = await opportunityApi.list(params);
      setOpportunities(res.data);
    } catch (err) {
      console.error('Failed to load government schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOpportunities();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Government Schemes</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              MSME Subsidies & Schemes Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Official credit-linked subsidies, zero-collateral loans, and technology grants from the Ministry of MSME and Government of India.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <form
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search scheme name, eligibility, or keywords (e.g. PMEGP, Mudra, Subsidy)..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors"
            >
              Search Schemes
            </button>
          </form>

          {/* Category Chips */}
          <div className="mt-6 flex items-center justify-center space-x-2 overflow-x-auto pb-2 text-xs scrollbar-none max-w-4xl mx-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium shrink-0 transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {loading ? (
          <div className="text-center py-20 text-slate-400 text-xs">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading official schemes...
          </div>
        ) : opportunities.length === 0 ? (
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto">
            <Award className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">No Schemes Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try searching for different keywords or select "All" categories.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {opportunities.map((scheme, idx) => (
              <div
                key={scheme.id || idx}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-md hover:border-amber-500/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h2 className="text-lg font-bold text-white tracking-tight">{scheme.name}</h2>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {scheme.category}
                      </span>
                    </div>
                    {scheme.ministry && (
                      <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        <span>{scheme.ministry}</span>
                      </p>
                    )}
                  </div>

                  <a
                    href={scheme.official_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition-all shrink-0"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                  {scheme.description}
                </p>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Benefits */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1 mb-1.5">
                      <Coins className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Financial Benefits & Subsidies</span>
                    </span>
                    <p className="text-slate-300 leading-relaxed">{scheme.benefits}</p>
                  </div>

                  {/* Eligibility */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center space-x-1 mb-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Who is Eligible?</span>
                    </span>
                    <p className="text-slate-300 leading-relaxed">{scheme.eligibility}</p>
                  </div>

                  {/* How to Apply */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1 mb-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Application Process</span>
                    </span>
                    <p className="text-slate-300 leading-relaxed">{scheme.application_info}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OpportunitiesPage;
