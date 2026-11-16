import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { businessApi } from '../api/client';
import {
  Search,
  MapPin,
  Building2,
  Package,
  Phone,
  MessageCircle,
  ExternalLink,
  Filter,
  RotateCcw,
  ShieldCheck,
  Eye,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Handicrafts & Artisans',
  'Textiles & Garments',
  'Food Processing & Agro',
  'Small Manufacturing',
  'Retail & Local Trade',
  'Engineering & Fabrication',
  'Electronics & Repairs',
  'Packaging & Printing',
  'Services & Consulting',
  'Eco-Friendly & Sustainable Products',
];

const ExplorePage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (city.trim()) params.city = city.trim();
      if (pinCode.trim()) params.pin_code = pinCode.trim();

      const res = await businessApi.list(params);
      setBusinesses(res.data);
    } catch (err) {
      console.error('Failed to load businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBusinesses();
  };

  const handleReset = () => {
    setSearch('');
    setSelectedCategory('All');
    setCity('');
    setPinCode('');
    businessApi.list({}).then((res) => setBusinesses(res.data));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs uppercase font-bold tracking-widest text-blue-400">Hyperlocal Search Engine</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Discover Local MSMEs & Artisans
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Find verified small manufacturers, trade suppliers, and skilled craftsmen in your city or postal PIN code.
            </p>
          </div>

          {/* Search & Filter Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Keyword Search */}
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Business name, products, keywords..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* City Filter */}
              <div className="sm:col-span-3 relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City (e.g. Jaipur)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* PIN Code Filter */}
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="PIN Code"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-2 flex items-center space-x-1">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset Filters"
                  className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center space-x-2 overflow-x-auto pb-1 text-xs scrollbar-none">
              <span className="text-slate-400 font-medium text-[11px] shrink-0">Category:</span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium shrink-0 transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* Businesses Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-slate-400">
            Showing <span className="font-semibold text-white">{businesses.length}</span> verified enterprise{businesses.length === 1 ? '' : 's'}
          </p>
          <div className="flex items-center space-x-1 text-xs text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Local Micro-Enterprises</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 text-xs">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Searching hyperlocal directory...
          </div>
        ) : businesses.length === 0 ? (
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto">
            <Building2 className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">No Businesses Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try broadening your search keywords or reset the city and category filters.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((biz) => (
              <div
                key={biz.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-md flex flex-col justify-between hover:border-blue-500/50 transition-all hover:-translate-y-1 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-base font-bold shadow-md shadow-blue-600/20">
                        {biz.logo_url ? (
                          <img src={biz.logo_url} alt={biz.name} className="w-full h-full rounded-xl object-cover" />
                        ) : (
                          biz.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                          {biz.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 capitalize">{biz.category}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {biz.description || 'Quality local enterprise offering verified goods and services.'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 space-y-2 text-xs text-slate-400">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">{biz.location}, {biz.city} ({biz.pin_code})</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center space-x-1 text-slate-400">
                        <Package className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{biz.product_count ?? 0} Listed Items</span>
                      </span>
                      <span className="flex items-center space-x-1 text-slate-400">
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{biz.views_count ?? 0} Views</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5">
                    {biz.phone && (
                      <a
                        href={`tel:${biz.phone}`}
                        title="Call Business"
                        className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {biz.whatsapp && (
                      <a
                        href={`https://wa.me/${biz.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Chat on WhatsApp"
                        className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <Link
                    to={`/biz/${biz.id}`}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
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

export default ExplorePage;
