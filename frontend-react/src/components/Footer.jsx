import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/60">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base">MSME Connect AI</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              AI-powered digital growth, hyperlocal discovery and B2B collaboration platform designed specifically for informal MSMEs, artisans, and rural enterprises.
            </p>
            <div className="flex items-center space-x-2 text-xs text-amber-400/90 bg-amber-950/40 border border-amber-900/40 p-2.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Supporting Vocal For Local & Atmanirbhar Bharat</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Core Ecosystem</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/explore" className="hover:text-blue-400 transition-colors">Hyperlocal Business Search</Link>
              </li>
              <li>
                <Link to="/dashboard/marketing" className="hover:text-blue-400 transition-colors">AI Marketing Studio</Link>
              </li>
              <li>
                <Link to="/dashboard/collaborations" className="hover:text-blue-400 transition-colors">MSME Collaboration Hub</Link>
              </li>
              <li>
                <Link to="/opportunities" className="hover:text-blue-400 transition-colors">Government Schemes & Subsidies</Link>
              </li>
              <li>
                <Link to="/dashboard/analytics" className="hover:text-blue-400 transition-colors">Smart Business Analytics</Link>
              </li>
            </ul>
          </div>

          {/* Quick Business Actions */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">For Entrepreneurs</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/register" className="hover:text-blue-400 transition-colors">Claim Your Digital Identity</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition-colors">Owner Login</Link>
              </li>
              <li>
                <Link to="/dashboard/products" className="hover:text-blue-400 transition-colors">Product & Catalog Manager</Link>
              </li>
              <li>
                <Link to="/dashboard/profile" className="hover:text-blue-400 transition-colors">Instant Webpage Generator</Link>
              </li>
            </ul>
          </div>

          {/* Verified Resources */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Official Portals</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="https://udyamregistration.gov.in" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                  <span>Udyam Registration Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://msme.gov.in" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                  <span>Ministry of MSME</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.kviconline.gov.in/pmegp/" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                  <span>PMEGP Subsidy Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://champions.gov.in" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                  <span>MSME Champions Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MSME Connect AI. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Built for empowering India's informal & micro enterprise sector</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
