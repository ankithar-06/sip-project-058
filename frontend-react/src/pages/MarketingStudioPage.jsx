import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { marketingApi } from '../api/client';
import {
  Sparkles,
  Copy,
  Check,
  Send,
  History,
  Tag,
  Share2,
  Megaphone,
  MessageSquare,
  FileText,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

const OBJECTIVES = [
  'Festive Discount & Direct Sales',
  'Brand Awareness & Local Footfall',
  'WhatsApp Order Inquiries',
  'B2B Wholesale & Bulk Supply',
  'New Product Launch',
];

const MarketingStudioPage = () => {
  const { business } = useAuth();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    product_name: searchParams.get('product') || '',
    product_description: searchParams.get('desc') || '',
    target_audience: 'Local families, homeowners, and conscious shoppers',
    marketing_objective: OBJECTIVES[0],
  });

  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [copiedKey, setCopiedKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Load generation history
    marketingApi.getHistory()
      .then((res) => setHistory(res.data))
      .catch((err) => console.warn('Could not load history:', err));
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setGenerating(true);

    try {
      const res = await marketingApi.generate(formData);
      setResults(res.data);
      // Refresh history
      marketingApi.getHistory().then((hRes) => setHistory(hRes.data));
    } catch (err) {
      console.error(err);
      setError('Marketing generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-700/60 shadow-md">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Growth Accelerator for MSMEs</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          AI Marketing Studio
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Instantly generate professional, conversion-focused promotional copy, slogans, broadcast messages, and hashtags tailored for your local products.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs h-fit">
          <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center space-x-2">
            <span>Product & Campaign Details</span>
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Provide details about what you are promoting
          </p>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Product / Item Name *
              </label>
              <input
                type="text"
                required
                value={formData.product_name}
                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                placeholder="e.g. Pure Brass Puja Bell, Organic Cotton Sari"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Product Description & Highlights *
              </label>
              <textarea
                rows={3}
                required
                value={formData.product_description}
                onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
                placeholder="Handmade by local artisans, durable, 100% natural, festive gift packaging included."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Audience *
              </label>
              <input
                type="text"
                required
                value={formData.target_audience}
                onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                placeholder="e.g. Local homemakers, wedding shoppers, B2B retailers"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Marketing Objective
              </label>
              <select
                value={formData.marketing_objective}
                onChange={(e) => setFormData({ ...formData, marketing_objective: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              >
                {OBJECTIVES.map((obj) => (
                  <option key={obj} value={obj}>
                    {obj}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-600/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Marketing Kit...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Marketing Copy</span>
                </>
              )}
            </button>
          </form>

          {/* Tips Card */}
          <div className="mt-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="flex items-center space-x-1 font-bold text-amber-800">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>Pro Tip for MSMEs</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-700">
              Copy these messages directly into your WhatsApp Status, Instagram reels, and customer broadcast lists to increase direct orders without paid ads.
            </p>
          </div>
        </div>

        {/* Right Output: Generated Copy Kit */}
        <div className="lg:col-span-7 space-y-6">
          {results ? (
            <div className="space-y-6">
              {/* Slogans & Taglines */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                    <Megaphone className="w-4 h-4 text-blue-600" />
                    <span>Brand Slogans & Catchy Taglines</span>
                  </h3>
                </div>
                <div className="space-y-2">
                  {results.slogans?.map((slogan, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 flex items-center justify-between text-xs transition-colors"
                    >
                      <span className="font-semibold text-slate-800 italic">"{slogan}"</span>
                      <button
                        onClick={() => copyToClipboard(slogan, `slogan-${idx}`)}
                        className="ml-2 text-slate-400 hover:text-blue-600 p-1"
                        title="Copy slogan"
                      >
                        {copiedKey === `slogan-${idx}` ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media Captions */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>Social Media Captions (Instagram, Facebook & WhatsApp)</span>
                  </h3>
                </div>
                <div className="space-y-3">
                  {results.captions?.map((cap, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 relative group"
                    >
                      <p className="pr-8 leading-relaxed">{cap}</p>
                      <button
                        onClick={() => copyToClipboard(cap, `caption-${idx}`)}
                        className="absolute right-3 top-3 p-1 rounded-lg text-slate-400 hover:text-blue-600 bg-white border border-slate-200 shadow-2xs"
                        title="Copy caption"
                      >
                        {copiedKey === `caption-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promotional Broadcasts (WhatsApp / SMS) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>Direct WhatsApp & SMS Broadcast Messages</span>
                  </h3>
                </div>
                <div className="space-y-3">
                  {results.promotional_messages?.map((msg, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/70 text-xs text-slate-800 relative"
                    >
                      <p className="pr-8 leading-relaxed font-mono text-[11px]">{msg}</p>
                      <button
                        onClick={() => copyToClipboard(msg, `msg-${idx}`)}
                        className="absolute right-3 top-3 p-1 rounded-lg text-slate-400 hover:text-emerald-700 bg-white border border-emerald-200 shadow-2xs"
                        title="Copy message"
                      >
                        {copiedKey === `msg-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ad Copy Box */}
              {results.ad_copy && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                      <Megaphone className="w-4 h-4 text-amber-600" />
                      <span>Ready Advertisement Copy</span>
                    </h3>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Headline</span>
                      <p className="font-bold text-slate-900 mt-0.5">{results.ad_copy.headline}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Hook</span>
                      <p className="text-slate-700 mt-0.5">{results.ad_copy.hook}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Call To Action</span>
                      <p className="text-blue-600 font-semibold mt-0.5">{results.ad_copy.call_to_action}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Hashtags */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                    <Tag className="w-4 h-4 text-blue-600" />
                    <span>Trending & Hyperlocal Hashtags</span>
                  </h3>
                  <button
                    onClick={() => copyToClipboard(results.hashtags?.join(' '), 'all-tags')}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center space-x-1"
                  >
                    <span>{copiedKey === 'all-tags' ? 'Copied All!' : 'Copy All'}</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {results.hashtags?.map((tag, idx) => (
                    <span
                      key={idx}
                      onClick={() => copyToClipboard(tag, `tag-${idx}`)}
                      className="cursor-pointer text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                      title="Click to copy"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Your AI Copy Will Appear Here</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Fill in your product details on the left and click Generate to produce complete marketing kits ready to paste anywhere.
              </p>
            </div>
          )}

          {/* Previous Generations History */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center space-x-2 mb-4">
                <History className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Recent Generated Kits
                </h3>
              </div>
              <div className="space-y-2">
                {history.slice(0, 5).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setResults(item)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{item.product_name}</p>
                      <p className="text-[10px] text-slate-500">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Previous'}
                      </p>
                    </div>
                    <span className="text-blue-600 text-[11px] font-semibold hover:underline">
                      View Kit &rarr;
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketingStudioPage;
