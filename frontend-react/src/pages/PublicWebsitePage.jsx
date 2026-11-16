import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { businessApi, collaborationApi, analyticsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  Package,
  Globe,
  Share2,
  ShieldCheck,
  CheckCircle,
  Handshake,
  X,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

const PublicWebsitePage = () => {
  const { id } = useParams();
  const { user, business: myBusiness, isAuthenticated } = useAuth();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Collaboration Modal State
  const [collabModalOpen, setCollabModalOpen] = useState(false);
  const [collabPurpose, setCollabPurpose] = useState('Supplier Partnership');
  const [collabMessage, setCollabMessage] = useState('');
  const [sendingCollab, setSendingCollab] = useState(false);
  const [collabSuccess, setCollabSuccess] = useState('');
  const [collabError, setCollabError] = useState('');

  useEffect(() => {
    const fetchPublicSite = async () => {
      try {
        const res = await businessApi.getPublic(id);
        setBusiness(res.data);
      } catch (err) {
        console.error('Failed to load business webpage:', err);
        setError('This business webpage is unavailable or does not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicSite();
  }, [id]);

  const handleInquiryAction = (channel) => {
    // Record real visitor inquiry in analytics
    analyticsApi.recordInquiry(id).catch((err) => console.warn(err));
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendCollaboration = async (e) => {
    e.preventDefault();
    setCollabError('');
    setCollabSuccess('');
    setSendingCollab(true);

    try {
      await collaborationApi.send({
        receiver_business_id: id,
        purpose: collabPurpose,
        message: collabMessage,
      });
      setCollabSuccess('Collaboration request sent successfully to the business owner!');
      setTimeout(() => {
        setCollabModalOpen(false);
        setCollabSuccess('');
        setCollabMessage('');
      }, 2000);
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setCollabError(typeof detail === 'string' ? detail : 'Failed to send collaboration request.');
    } finally {
      setSendingCollab(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400">Loading MSME Digital Webpage...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-white">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center">
          <Building2 className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h2 className="text-base font-bold text-white">Business Page Not Found</h2>
          <p className="text-xs text-slate-400 mt-1">{error || 'The requested MSME page does not exist.'}</p>
          <Link
            to="/explore"
            className="mt-6 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Banner Navigation */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-xs font-semibold hover:text-blue-400">
            <ArrowLeft className="w-4 h-4" />
            <span>MSME Connect AI Directory</span>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyShare}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Page</span>
                </>
              )}
            </button>

            {myBusiness?.id !== business.id && (
              <button
                onClick={() => setCollabModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-colors"
              >
                <Handshake className="w-3.5 h-3.5" />
                <span>Collaborate</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Showcase Section */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-750">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-xl shrink-0">
              {business.logo_url ? (
                <img src={business.logo_url} alt={business.name} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                business.name.charAt(0)
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{business.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Verified MSME
                </span>
              </div>

              <p className="text-sm text-slate-300 mt-1 capitalize font-medium">{business.category}</p>

              <div className="flex items-center space-x-4 mt-3 text-xs text-slate-400 flex-wrap gap-y-1">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{business.location}, {business.city} ({business.pin_code})</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{business.operating_hours || '9:00 AM - 7:00 PM'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contact Action Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-700/60 flex flex-wrap items-center gap-3">
            {business.whatsapp && (
              <a
                href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(business.name)},%20I%20found%20your%20business%20on%20MSME%20Connect%20AI%20and%20would%20like%20to%20inquire%20about%20your%20products.`}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleInquiryAction('whatsapp')}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            )}

            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                onClick={() => handleInquiryAction('phone')}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Call Business</span>
              </a>
            )}

            {business.contact_email && (
              <a
                href={`mailto:${business.contact_email}?subject=Inquiry%20via%20MSME%20Connect%20AI`}
                onClick={() => handleInquiryAction('email')}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content: About & Products Showcase */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10 flex-1">
        {/* About Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About Our Enterprise</h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {business.description || 'Welcome to our business! We are committed to delivering authentic, durable, and certified quality goods to our valued patrons.'}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Proprietor</span>
              <span className="font-semibold text-slate-900">{business.owner_name || 'Business Owner'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Category</span>
              <span className="font-semibold text-slate-900 capitalize">{business.category}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">City</span>
              <span className="font-semibold text-slate-900">{business.city}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">PIN Code</span>
              <span className="font-semibold text-slate-900">{business.pin_code}</span>
            </div>
          </div>
        </div>

        {/* Products Showcase */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Products & Catalog Items</h2>
              <p className="text-xs text-slate-500">Order directly from {business.name}</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-200/80 px-2.5 py-1 rounded-full">
              {business.products?.length || 0} Listed Items
            </span>
          </div>

          {!business.products || business.products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-xs text-slate-400">
              No products listed currently. Contact the business directly for custom orders!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {business.products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{prod.name}</h3>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                          prod.in_stock
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {prod.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                      {prod.description || 'Verified authentic MSME product.'}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-base font-extrabold text-slate-900">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>
                      {prod.category && (
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                          {prod.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {business.whatsapp && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <a
                        href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(business.name)},%20I%20am%20interested%20in%20ordering%20'${encodeURIComponent(prod.name)}'%20(₹${prod.price}).`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => handleInquiryAction('whatsapp')}
                        className="w-full inline-flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Inquire on WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Collaboration Proposal Modal */}
      {collabModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Handshake className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Collaborate with {business.name}
                </h3>
              </div>
              <button
                onClick={() => setCollabModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isAuthenticated ? (
              <div className="py-6 text-center text-xs">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="font-bold text-slate-800">Owner Sign In Required</p>
                <p className="text-slate-500 mt-1 max-w-xs mx-auto">
                  You need an active MSME Connect account to send business partnership requests.
                </p>
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs"
                  >
                    Register Business
                  </Link>
                </div>
              </div>
            ) : !myBusiness ? (
              <div className="py-6 text-center text-xs">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="font-bold text-slate-800">Create Business Profile First</p>
                <p className="text-slate-500 mt-1 max-w-xs mx-auto">
                  Setup your own business profile so {business.name} can review your enterprise details.
                </p>
                <Link
                  to="/dashboard/profile/edit"
                  className="mt-4 inline-block px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs"
                >
                  Setup Profile
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSendCollaboration} className="space-y-4 mt-4">
                {collabError && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                    {collabError}
                  </div>
                )}
                {collabSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
                    {collabSuccess}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Collaboration Purpose *
                  </label>
                  <select
                    value={collabPurpose}
                    onChange={(e) => setCollabPurpose(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    <option value="Raw Material Supply">Raw Material Supply</option>
                    <option value="Distributor / Wholesale Partner">Distributor / Wholesale Partner</option>
                    <option value="Packaging & Printing Partnership">Packaging & Printing Partnership</option>
                    <option value="Logistics & Delivery Partnership">Logistics & Delivery Partnership</option>
                    <option value="Co-Branding & Cross Promotion">Co-Branding & Cross Promotion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Proposal Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={collabMessage}
                    onChange={(e) => setCollabMessage(e.target.value)}
                    placeholder={`Hello ${business.name}, we are ${myBusiness.name} in ${myBusiness.city}. We would love to discuss a potential partnership regarding...`}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setCollabModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingCollab}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold disabled:opacity-50"
                  >
                    {sendingCollab ? 'Sending Proposal...' : 'Send Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center text-xs">
        <p>Powered by <span className="text-white font-bold">MSME Connect AI</span> — Empowering Informal Micro & Small Enterprises</p>
      </footer>
    </div>
  );
};

export default PublicWebsitePage;
