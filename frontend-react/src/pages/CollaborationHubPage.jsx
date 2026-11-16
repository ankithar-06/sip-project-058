import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collaborationApi } from '../api/client';
import {
  Users,
  Send,
  Inbox,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  Search,
  Building2,
  ArrowRight,
  Handshake,
  AlertCircle,
} from 'lucide-react';

const CollaborationHubPage = () => {
  const { business } = useAuth();
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  const [collaborations, setCollaborations] = useState({ received: [], sent: [] });
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  const fetchCollaborations = async () => {
    if (!business) {
      setLoading(false);
      return;
    }
    try {
      const res = await collaborationApi.getMy();
      setCollaborations(res.data);
    } catch (err) {
      console.error('Failed to load collaborations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborations();
  }, [business]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await collaborationApi.updateStatus(id, status);
      setActionMessage(`Collaboration request ${status}!`);
      setTimeout(() => setActionMessage(''), 3000);
      await fetchCollaborations();
    } catch (err) {
      console.error(err);
      alert('Failed to update collaboration status.');
    }
  };

  if (!business) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center max-w-xl mx-auto border border-slate-200 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <Handshake className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Setup Business Profile First</h2>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
          You need an active business profile to send and receive collaboration proposals with other enterprises.
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

  const currentList = activeTab === 'received' ? collaborations.received : collaborations.sent;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white border border-slate-700/60 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold uppercase tracking-wider mb-2">
            <Handshake className="w-3.5 h-3.5" />
            <span>B2B Growth & Networking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">MSME Collaboration Hub</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Partner with raw material suppliers, packaging workshops, retail distributors, and logistics partners to scale your operations.
          </p>
        </div>

        <Link
          to="/explore"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>Find Potential Partners</span>
        </Link>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'received'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Received Inquiries</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
            {collaborations.received.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'sent'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent Proposals</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
            {collaborations.sent.length}
          </span>
        </button>
      </div>

      {/* Collaboration Cards List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading collaboration network...</div>
      ) : currentList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            {activeTab === 'received' ? 'No Collaboration Inquiries Received' : 'No Proposals Sent Yet'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {activeTab === 'received'
              ? 'When other MSMEs discover your profile in hyperlocal search and want to partner, their requests will appear here.'
              : 'Browse nearby enterprises in the directory and click "Collaborate" on their profile to send a proposal.'}
          </p>
          <Link
            to="/explore"
            className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            <span>Explore Enterprises</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {currentList.map((collab) => {
            const isReceived = activeTab === 'received';
            const partnerName = isReceived ? collab.sender_business_name : collab.receiver_business_name;

            return (
              <div
                key={collab.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-slate-900">{partnerName}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            collab.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : collab.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {collab.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-blue-600 mt-0.5">
                        Purpose: {collab.purpose}
                      </p>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      {collab.created_at ? new Date(collab.created_at).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 leading-relaxed">
                    "{collab.message}"
                  </p>
                </div>

                {/* Contact details revealed if accepted */}
                {collab.status === 'accepted' && (
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-900 flex flex-wrap items-center gap-4">
                    <span className="font-bold text-emerald-800">Partner Contact Details:</span>
                    {collab.contact_phone && (
                      <a href={`tel:${collab.contact_phone}`} className="flex items-center space-x-1 font-semibold hover:underline">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{collab.contact_phone}</span>
                      </a>
                    )}
                    {collab.contact_email && (
                      <a href={`mailto:${collab.contact_email}`} className="flex items-center space-x-1 font-semibold hover:underline">
                        <Mail className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{collab.contact_email}</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Actions for Pending Received Requests */}
                {isReceived && collab.status === 'pending' && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(collab.id, 'rejected')}
                      className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Decline</span>
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(collab.id, 'accepted')}
                      className="inline-flex items-center space-x-1 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Accept & Connect</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CollaborationHubPage;
