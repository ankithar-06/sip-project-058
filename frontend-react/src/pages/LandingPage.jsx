import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Building2,
  Sparkles,
  Search,
  Users,
  Award,
  BarChart3,
  Globe,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MapPin,
  MessageSquare,
  Share2
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900 to-slate-900 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Mission Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Next-Gen Platform for Informal MSMEs</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Empowering Informal MSMEs with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">AI & Hyperlocal</span> Growth
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Bridge the digital divide. Build your verified digital identity, get discovered by nearby customers, generate professional marketing content in seconds, and collaborate directly with fellow Indian enterprises.
            </p>

            {/* Main Action CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
              >
                <span>Register Your Business Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/explore"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
              >
                <Search className="w-4 h-4 text-blue-400" />
                <span>Explore Nearby MSMEs</span>
              </Link>
            </div>

            {/* Quick Trust Highlights */}
            <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-white">100%</p>
                <p className="text-xs text-slate-400 mt-1">Free Digital Presence</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-400">Hyperlocal</p>
                <p className="text-xs text-slate-400 mt-1">PIN & City Discovery</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">AI Powered</p>
                <p className="text-xs text-slate-400 mt-1">Instant Marketing Copy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">Verified</p>
                <p className="text-xs text-slate-400 mt-1">Govt Scheme Directory</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Statement */}
      <section className="py-20 bg-slate-950/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-xs uppercase tracking-widest text-blue-400 font-bold">The Challenge We Solve</h2>
            <p className="text-2xl sm:text-3xl font-bold text-white mt-2">
              Why Informal MSMEs Need More Than Just Another Directory
            </p>
            <p className="text-sm text-slate-400 mt-3">
              Over 90% of India's micro-enterprises operate without a digital footprint, missing high-margin customers, government grants, and B2B partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-bold mb-4">
                ✕
              </div>
              <h3 className="text-base font-bold text-white">The Old Struggle</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Costly digital agencies, complex website builders, zero local footfall visibility, and missing out on lucrative government subsidies due to lack of information.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-blue-500/40 shadow-lg shadow-blue-500/5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-4">
                ✦
              </div>
              <h3 className="text-base font-bold text-white">MSME Connect AI</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                An integrated platform: Auto-generated web presence, AI social marketing, local neighborhood discovery, and peer-to-peer business collaboration.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-4">
                ✓
              </div>
              <h3 className="text-base font-bold text-white">Real Economic Impact</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Expanded market reach, higher profit margins, direct B2B supplier networking, and direct access to schemes like PMEGP, Mudra, and CGTMSE.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Features Section */}
      <section id="features" className="py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-xs uppercase tracking-widest text-amber-400 font-bold">Platform Capabilities</h2>
            <p className="text-2xl sm:text-3xl font-bold text-white mt-2">
              6 Built-In Engines Powering Your Business
            </p>
            <p className="text-sm text-slate-400 mt-3">
              Everything an informal business needs to succeed in the digital economy without expensive technical consultants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">1. Hyperlocal Discovery</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Enables nearby customers to find your store, workshop, or service by city and PIN code with direct WhatsApp and phone connections.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">2. AI Marketing Assistant</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Generates high-converting social media captions, WhatsApp broadcast offers, viral hashtags, and catchy slogans tailored to your products.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">3. Instant Webpage Generator</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Automatically builds a professional public microsite from your profile. Shareable on WhatsApp, Instagram, or business cards.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">4. MSME Collaboration Hub</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Connect with local suppliers, packaging partners, and distributors. Send and manage formal collaboration proposals with ease.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-rose-500/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">5. Government Opportunity Hub</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Verified directory of MSME subsidies, PMEGP loans, ZED quality certifications, and credit guarantees with official application links.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">6. Smart Business Analytics</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Track real profile visits, customer inquiries, product popularity, and collaboration metrics with clean interactive visual charts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-slate-950/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-xs uppercase tracking-widest text-blue-400 font-bold">Simple 4-Step Process</h2>
            <p className="text-2xl sm:text-3xl font-bold text-white mt-2">
              From Informal Shop to Digital Enterprise in 5 Minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center relative">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-3 text-xs">
                1
              </div>
              <h4 className="text-sm font-bold text-white">Create Account</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Register as an MSME owner with your email and basic details.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center relative">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-3 text-xs">
                2
              </div>
              <h4 className="text-sm font-bold text-white">Add Profile & Items</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Enter your location, city, PIN code, and list your core products and services.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center relative">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center mx-auto mb-3 text-xs">
                3
              </div>
              <h4 className="text-sm font-bold text-white">Generate Copy & Site</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Use AI marketing generator and share your live public business webpage.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center relative">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto mb-3 text-xs">
                4
              </div>
              <h4 className="text-sm font-bold text-white">Grow & Collaborate</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Receive local customer inquiries, network with suppliers, and apply for subsidies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-10 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 shadow-2xl">
            <h2 className="text-3xl font-bold text-white">
              Ready to Give Your Business the Digital Advantage?
            </h2>
            <p className="text-slate-300 text-sm mt-3 max-w-xl mx-auto">
              Join local entrepreneurs, manufacturers, and artisans building their future with MSME Connect AI.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
              >
                Register Your MSME Now
              </Link>
              <Link
                to="/explore"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
              >
                Browse Business Directory
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
