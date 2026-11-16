import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Edit,
  Share2,
  ExternalLink,
  PlusCircle,
  ShieldCheck,
  Package,
  Eye,
  CheckCircle,
} from 'lucide-react';

const BusinessProfilePage = () => {
  const { business, user } = useAuth();
  const [copied, setCopied] = useState(false);

  const publicUrl = business ? `${window.location.origin}/biz/${business.id}` : '';

  const handleCopyLink = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!business) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center max-w-xl mx-auto border border-slate-200 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Business Profile Found</h2>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
          Create your verified MSME profile to generate your shareable public webpage, unlock hyperlocal customer search, and start collaborating.
        </p>
        <Link
          to="/dashboard/profile/edit"
          className="mt-6 inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Business Profile</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-blue-600/20 shrink-0">
            {business.logo_url ? (
              <img src={business.logo_url} alt={business.name} className="w-full h-full rounded-2xl object-cover" />
            ) : (
              business.name.charAt(0)
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h1 className="text-2xl font-bold text-slate-900">{business.name}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Verified MSME
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 capitalize">
                {business.category}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{business.location}, {business.city} — PIN {business.pin_code}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Link
            to="/dashboard/profile/edit"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            <Edit className="w-3.5 h-3.5 text-slate-600" />
            <span>Edit Profile</span>
          </Link>
          <Link
            to={`/biz/${business.id}`}
            target="_blank"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Live Public Site</span>
            <ExternalLink className="w-3 h-3 text-blue-200" />
          </Link>
        </div>
      </div>

      {/* Shareable Public Webpage Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white border border-blue-800/60 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Public Business Microsite</span>
          <h3 className="text-base font-bold text-white mt-0.5">Your Auto-Generated Shareable URL</h3>
          <p className="text-xs text-slate-300 mt-1 font-mono break-all">{publicUrl}</p>
        </div>
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all shrink-0"
        >
          {copied ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
              <span>Copied Link!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Copy Share Link</span>
            </>
          )}
        </button>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Business Description & Overview */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About the Business</h3>
            <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line">
              {business.description || 'No description provided yet. Edit your profile to describe your craft, manufacturing facilities, or retail services.'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Enterprise Details</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Owner / Proprietor</span>
                <span className="font-semibold text-slate-800">{business.owner_name || user?.name || 'MSME Owner'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Business Category</span>
                <span className="font-semibold text-slate-800 capitalize">{business.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">City / Region</span>
                <span className="font-semibold text-slate-800">{business.city}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Postal PIN Code</span>
                <span className="font-semibold text-slate-800">{business.pin_code}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Hours Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Contact Channels</h3>

          <div className="space-y-3 text-xs">
            {business.phone && (
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Phone</p>
                  <a href={`tel:${business.phone}`} className="font-semibold text-slate-800 hover:text-blue-600">
                    {business.phone}
                  </a>
                </div>
              </div>
            )}

            {business.whatsapp && (
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">WhatsApp</p>
                  <a
                    href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-slate-800 hover:text-emerald-600"
                  >
                    {business.whatsapp}
                  </a>
                </div>
              </div>
            )}

            {business.contact_email && (
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <p className="text-[10px] text-slate-400">Email</p>
                  <a href={`mailto:${business.contact_email}`} className="font-semibold text-slate-800 hover:text-blue-600 truncate block">
                    {business.contact_email}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 pt-2 border-t border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Operating Hours</p>
                <p className="font-semibold text-slate-800">{business.operating_hours || '9:00 AM - 7:00 PM'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfilePage;
