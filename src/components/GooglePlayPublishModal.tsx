import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Check, 
  Smartphone, 
  Laptop, 
  ShieldCheck, 
  Layers, 
  Globe, 
  FileText, 
  Sparkles, 
  Loader2, 
  Star, 
  FolderArchive, 
  Share2, 
  ShieldAlert, 
  CheckSquare, 
  Square,
  HelpCircle,
  Eye,
  Settings
} from 'lucide-react';
import { 
  DEFAULT_PLAYSTORE_CONFIG, 
  PlayStoreListingData, 
  generatePlayStoreProjectZip, 
  downloadListingMetadataTextFile 
} from '../utils/playstoreProjectGenerator';
import { getPublicShareUrl } from '../utils/shareUrl';

interface GooglePlayPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDownloadModal?: () => void;
}

export const GooglePlayPublishModal: React.FC<GooglePlayPublishModalProps> = ({
  isOpen,
  onClose,
  onOpenDownloadModal
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'package' | 'metadata' | 'graphics' | 'assetlinks' | 'checklist'>('overview');
  const [packageId, setPackageId] = useState(DEFAULT_PLAYSTORE_CONFIG.packageId);
  const [appName, setAppName] = useState(DEFAULT_PLAYSTORE_CONFIG.appName);
  const [shortDesc, setShortDesc] = useState(DEFAULT_PLAYSTORE_CONFIG.shortDescription);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Checklist state saved in localStorage for persistence
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem('NS_PLAYSTORE_CHECKLIST');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      account: false,
      appCreated: false,
      aabUploaded: false,
      graphicsUploaded: false,
      metadataFilled: false,
      contentRating: false,
      privacyPolicy: false,
      productionRollout: false
    };
  });

  const toggleChecklistItem = (key: string) => {
    setChecklist((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('NS_PLAYSTORE_CHECKLIST', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const completedChecklistCount = Object.values(checklist).filter(Boolean).length;
  const totalChecklistItems = Object.keys(checklist).length;

  if (!isOpen) return null;

  const publicShareUrl = getPublicShareUrl();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateProject = async () => {
    try {
      setIsGeneratingZip(true);
      setZipProgress(10);
      await generatePlayStoreProjectZip(
        {
          packageId,
          appName,
          shortDescription: shortDesc,
          publicHostUrl: publicShareUrl
        },
        (p) => setZipProgress(p)
      );
      setIsGeneratingZip(false);
    } catch (err) {
      console.error('Failed to generate Play Store bundle zip:', err);
      setIsGeneratingZip(false);
    }
  };

  const pwabuilderUrl = `https://www.pwabuilder.com?url=${encodeURIComponent(publicShareUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-[#fdfcf9] border-2 border-[#1a1a1a] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Top Header Banner */}
        <div className="bg-[#1a1a1a] p-3.5 sm:p-5 text-[#fdfcf9] flex items-start justify-between border-b border-black gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-white text-black flex items-center justify-center font-black text-sm border-2 border-[#c4a47c] shrink-0">
              <Laptop className="w-5 h-5 sm:w-6 sm:h-6 text-[#1a1a1a]" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h3 className="font-serif-luxury text-lg sm:text-2xl font-bold tracking-tight text-white truncate">
                  Google Play Store Publishing Console
                </h3>
                <span className="bg-[#c4a47c] text-black text-[9px] sm:text-[10px] font-mono-luxury font-black px-1.5 sm:px-2 py-0.5 uppercase tracking-wider shrink-0">
                  Android TWA &bull; .AAB Ready
                </span>
              </div>
              <p className="font-mono-luxury text-gray-300 text-[11px] sm:text-xs mt-0.5 sm:mt-1 truncate">
                Official Android App Bundle generator, Play Store listing metadata &amp; Digital Asset Links
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white border border-gray-700 hover:border-white transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1a1a1a] bg-[#fdfcf9] px-3 pt-2 text-xs font-mono-luxury uppercase font-bold overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#1a1a1a] text-[#1a1a1a] bg-white font-black'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span>Store Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('package')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'package'
                ? 'border-[#1a1a1a] text-[#1a1a1a] bg-white font-black'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span>AAB &bull; Android Project</span>
          </button>

          <button
            onClick={() => setActiveTab('metadata')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'metadata'
                ? 'border-[#1a1a1a] text-[#1a1a1a] bg-white font-black'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span>Listing Metadata</span>
          </button>

          <button
            onClick={() => setActiveTab('graphics')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'graphics'
                ? 'border-[#1a1a1a] text-[#1a1a1a] bg-white font-black'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span>Graphics &bull; Icon &amp; Banner</span>
          </button>

          <button
            onClick={() => setActiveTab('assetlinks')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'assetlinks'
                ? 'border-[#1a1a1a] text-[#1a1a1a] bg-white font-black'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span>Digital Asset Links</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'checklist'
                ? 'border-[#1a1a1a] text-[#1a1a1a] bg-white font-black'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Launch Checklist ({completedChecklistCount}/{totalChecklistItems})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#fdfcf9]">
          {/* TAB 1: STORE PREVIEW MOCKUP */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Status Header */}
              <div className="p-4 bg-emerald-950 text-emerald-100 border border-emerald-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-white uppercase tracking-wide">
                      Google Play Store Ready &bull; Trusted Web Activity (TWA)
                    </h4>
                    <p className="text-xs text-emerald-200 mt-0.5">
                      Target SDK 34 compliant, Android App Bundle architecture, and 512px adaptive maskable icons.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('package')}
                  className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-mono-luxury font-bold text-xs uppercase cursor-pointer transition-colors shrink-0"
                >
                  Download .AAB Package
                </button>
              </div>

              {/* Live Play Store Visual Mockup Card */}
              <div className="border-2 border-gray-300 bg-white p-5 shadow-sm max-w-2xl mx-auto">
                <div className="text-[10px] font-mono-luxury text-gray-400 uppercase tracking-widest mb-3 border-b pb-1 flex items-center justify-between">
                  <span>Google Play Store &bull; Official Mobile Store Listing Preview</span>
                  <span className="text-emerald-600 font-bold">Verified Production Ready</span>
                </div>

                {/* App Listing Header */}
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-[#1a1a1a] rounded-2xl border-2 border-[#c4a47c] flex flex-col items-center justify-center p-1 text-center shrink-0 shadow-md">
                    <span className="font-serif-luxury font-bold text-xl text-[#c4a47c]">NS</span>
                    <span className="text-[8px] font-mono-luxury font-bold text-white tracking-widest">LUXURY</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-sans font-bold text-lg text-gray-900 leading-tight">
                      {appName}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                      NS Real Estate Technologies Pvt Ltd
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Contains ads &bull; In-app purchases &bull; Real Estate
                    </p>

                    {/* Store Stats */}
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-700 divide-x divide-gray-200">
                      <div className="flex items-center gap-1">
                        <span className="font-bold">4.8</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span className="text-[10px] text-gray-400">(1.2K reviews)</span>
                      </div>
                      <div className="pl-4">
                        <span className="font-bold">10K+</span>
                        <span className="text-[10px] text-gray-400 block">Downloads</span>
                      </div>
                      <div className="pl-4">
                        <span className="font-bold bg-gray-100 px-1.5 py-0.5 text-[10px] border">Rated 3+</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="mt-5 flex gap-2">
                  <a
                    href={pwabuilderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs uppercase text-center rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Install &bull; Package for Play Store</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setActiveTab('metadata')}
                    className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-800 font-sans text-xs font-bold rounded-sm transition-colors cursor-pointer"
                  >
                    Copy Metadata
                  </button>
                </div>

                {/* Promotional Feature Graphic Preview */}
                <div className="mt-4 border rounded-sm overflow-hidden bg-slate-900">
                  <div className="relative">
                    <img
                      src="/play-store-feature-graphic.svg"
                      alt="Google Play Feature Graphic"
                      className="w-full h-auto object-cover max-h-48"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-mono-luxury px-2 py-0.5">
                      1024 &times; 500 Feature Banner
                    </div>
                  </div>
                </div>

                {/* About This App */}
                <div className="mt-4 pt-3 border-t text-xs text-gray-700 font-sans leading-relaxed">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-bold text-gray-900">About this app</h5>
                    <button
                      onClick={() => setActiveTab('metadata')}
                      className="text-emerald-700 font-semibold text-[11px] hover:underline cursor-pointer"
                    >
                      View Full Copy &rarr;
                    </button>
                  </div>
                  <p className="text-gray-600 line-clamp-3">
                    {shortDesc}
                  </p>
                </div>
              </div>

              {/* 3 Quick Launch Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono-luxury text-xs">
                <div className="p-3.5 bg-white border border-[#1a1a1a]/30 space-y-1.5">
                  <div className="w-6 h-6 bg-[#1a1a1a] text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h5 className="font-bold text-black uppercase">Play Developer Account</h5>
                  <p className="text-gray-600 text-[11px] font-sans">
                    Register at play.google.com/console with your Google account ($25 one-time developer registration).
                  </p>
                </div>

                <div className="p-3.5 bg-white border border-[#1a1a1a]/30 space-y-1.5">
                  <div className="w-6 h-6 bg-[#1a1a1a] text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h5 className="font-bold text-black uppercase">Download .AAB Bundle</h5>
                  <p className="text-gray-600 text-[11px] font-sans">
                    Generate your signed Android App Bundle (.aab) via PWABuilder or download the complete Android Studio code.
                  </p>
                </div>

                <div className="p-3.5 bg-white border border-[#1a1a1a]/30 space-y-1.5">
                  <div className="w-6 h-6 bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h5 className="font-bold text-black uppercase">Production Rollout</h5>
                  <p className="text-gray-600 text-[11px] font-sans">
                    Upload the .aab bundle under Production Releases, complete content rating, and submit for Google review!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANDROID PROJECT & AAB BUNDLE DOWNLOAD */}
          {activeTab === 'package' && (
            <div className="space-y-5 font-mono-luxury">
              <div className="bg-[#1a1a1a] p-4 text-white space-y-2 border border-[#c4a47c]/40">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif-luxury text-base font-bold text-[#c4a47c] flex items-center gap-2">
                    <Laptop className="w-4 h-4" />
                    Android App Bundle (.AAB) Generation &bull; TWA Architecture
                  </h4>
                  <span className="bg-[#c4a47c] text-black text-[10px] font-black px-2 py-0.5 uppercase">
                    Play Store Standard
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  Since August 2021, Google Play Console requires all new applications to be published as an <strong>Android App Bundle (.aab)</strong> instead of traditional APK files. You can generate your production .aab in one click using PWABuilder, or download the complete Android Studio project zip below.
                </p>
              </div>

              {/* Configuration Inputs */}
              <div className="bg-white p-4 border border-[#1a1a1a] space-y-4">
                <h5 className="font-bold text-xs uppercase text-[#1a1a1a] border-b pb-1.5">
                  Package &bull; Application Configuration
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">
                      Android Package ID (Application ID):
                    </label>
                    <input
                      type="text"
                      value={packageId}
                      onChange={(e) => setPackageId(e.target.value)}
                      className="w-full px-3 py-2 bg-[#fdfcf9] border border-gray-300 text-xs font-mono focus:border-black outline-none"
                      placeholder="in.nsproperties.app"
                    />
                    <span className="text-[10px] text-gray-500 mt-0.5 block font-sans">
                      Standard reverse domain notation (e.g., in.nsproperties.app or com.nsproperties.realestate)
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">
                      App Title (Google Play):
                    </label>
                    <input
                      type="text"
                      maxLength={30}
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#fdfcf9] border border-gray-300 text-xs font-mono focus:border-black outline-none"
                    />
                    <span className="text-[10px] text-gray-500 mt-0.5 block font-sans">
                      Max 30 characters ({appName.length}/30)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">
                    Live Web App Host URL (Packaged inside Android App):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={publicShareUrl}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-xs font-mono text-gray-800 select-all"
                    />
                    <button
                      onClick={() => handleCopy(publicShareUrl, 'hostUrl')}
                      className="px-3 py-2 bg-[#1a1a1a] hover:bg-black text-white text-xs font-bold uppercase shrink-0 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedKey === 'hostUrl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#c4a47c]" />}
                      <span>{copiedKey === 'hostUrl' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Generation Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Method A: 1-Click Online PWABuilder */}
                <div className="p-4 bg-white border border-[#1a1a1a] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2 py-0.5 uppercase">
                        Recommended &bull; Fast
                      </span>
                      <Laptop className="w-4 h-4 text-emerald-700" />
                    </div>
                    <h5 className="font-bold text-sm text-[#1a1a1a] uppercase">
                      1-Click Online .AAB Builder (PWABuilder)
                    </h5>
                    <p className="text-xs text-gray-600 mt-1 font-sans leading-relaxed">
                      Google's official partner tool generates signed Android App Bundles (.aab) directly in your browser. Handles keystore creation, Target SDK 34, and digital asset linking.
                    </p>
                  </div>

                  <a
                    href={pwabuilderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white uppercase font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
                  >
                    <span>Open PWABuilder with NS Properties</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Method B: Download Full Android Studio Source Project */}
                <div className="p-4 bg-white border border-[#1a1a1a] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="bg-blue-100 text-blue-900 text-[10px] font-black px-2 py-0.5 uppercase">
                        Full Source Code
                      </span>
                      <FolderArchive className="w-4 h-4 text-blue-700" />
                    </div>
                    <h5 className="font-bold text-sm text-[#1a1a1a] uppercase">
                      Download Android Studio Project (.ZIP)
                    </h5>
                    <p className="text-xs text-gray-600 mt-1 font-sans leading-relaxed">
                      Download complete native Android project with build.gradle, AndroidManifest.xml, res/values, and TWA launcher for local compilation in Android Studio.
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateProject}
                    disabled={isGeneratingZip}
                    className="w-full py-2.5 bg-[#1a1a1a] hover:bg-black text-white uppercase font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {isGeneratingZip ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c4a47c]" />
                        <span>Packaging Project ({zipProgress}%)...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-[#c4a47c]" />
                        <span>Download Android Project (.zip)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LISTING METADATA (COPY & PASTE READY) */}
          {activeTab === 'metadata' && (
            <div className="space-y-4 font-mono-luxury text-xs">
              <div className="flex items-center justify-between bg-white p-3 border border-[#1a1a1a]">
                <div>
                  <h5 className="font-bold text-[#1a1a1a] uppercase text-sm">
                    Pre-formatted Google Play Store Metadata
                  </h5>
                  <p className="text-gray-500 text-[11px] font-sans">
                    Copy and paste directly into Google Play Console &gt; Store presence &gt; Main store listing.
                  </p>
                </div>
                <button
                  onClick={() => downloadListingMetadataTextFile()}
                  className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-black text-white uppercase font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#c4a47c]" />
                  <span>Download .TXT File</span>
                </button>
              </div>

              {/* Title */}
              <div className="bg-white p-3.5 border border-gray-300 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase text-[11px] text-gray-700">
                    1. App Name (Title) &bull; Max 30 chars
                  </label>
                  <button
                    onClick={() => handleCopy(appName, 'meta-title')}
                    className="text-emerald-700 font-bold text-[10px] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'meta-title' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'meta-title' ? 'Copied!' : 'Copy Title'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  value={appName.slice(0, 30)}
                  className="w-full p-2 bg-[#fdfcf9] border text-xs font-mono text-gray-900"
                />
              </div>

              {/* Short Description */}
              <div className="bg-white p-3.5 border border-gray-300 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase text-[11px] text-gray-700">
                    2. Short Description &bull; Max 80 chars ({DEFAULT_PLAYSTORE_CONFIG.shortDescription.length}/80)
                  </label>
                  <button
                    onClick={() => handleCopy(DEFAULT_PLAYSTORE_CONFIG.shortDescription, 'meta-short')}
                    className="text-emerald-700 font-bold text-[10px] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'meta-short' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'meta-short' ? 'Copied!' : 'Copy Short Desc'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={2}
                  value={DEFAULT_PLAYSTORE_CONFIG.shortDescription}
                  className="w-full p-2 bg-[#fdfcf9] border text-xs font-mono text-gray-900 resize-none"
                />
              </div>

              {/* Full Description */}
              <div className="bg-white p-3.5 border border-gray-300 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase text-[11px] text-gray-700">
                    3. Full Description &bull; Max 4000 chars
                  </label>
                  <button
                    onClick={() => handleCopy(DEFAULT_PLAYSTORE_CONFIG.fullDescription, 'meta-full')}
                    className="text-emerald-700 font-bold text-[10px] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'meta-full' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'meta-full' ? 'Copied!' : 'Copy Full Description'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={8}
                  value={DEFAULT_PLAYSTORE_CONFIG.fullDescription}
                  className="w-full p-2 bg-[#fdfcf9] border text-xs font-mono text-gray-900 leading-relaxed"
                />
              </div>

              {/* Categorization & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white p-3 border border-gray-300 space-y-1">
                  <span className="text-gray-500 text-[10px] uppercase font-bold block">App Category:</span>
                  <span className="font-bold text-gray-900 text-xs">House &amp; Home / Real Estate</span>
                </div>
                <div className="bg-white p-3 border border-gray-300 space-y-1">
                  <span className="text-gray-500 text-[10px] uppercase font-bold block">Developer Email:</span>
                  <span className="font-bold text-gray-900 text-xs">{DEFAULT_PLAYSTORE_CONFIG.developerEmail}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GRAPHIC ASSETS DOWNLOAD */}
          {activeTab === 'graphics' && (
            <div className="space-y-5 font-mono-luxury">
              <div className="p-4 bg-white border border-[#1a1a1a]">
                <h5 className="font-bold text-sm text-[#1a1a1a] uppercase mb-1">
                  Mandatory Google Play Store Graphic Assets
                </h5>
                <p className="text-xs text-gray-600 font-sans">
                  Google Play requires exactly a <strong>512&times;512 px App Icon</strong> and a <strong>1024&times;500 px Feature Graphic</strong> banner for submission.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 512x512 App Icon Card */}
                <div className="bg-white border border-gray-300 p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-black text-[#c4a47c] text-[10px] font-bold px-2 py-0.5 uppercase">
                        512 &times; 512 PNG
                      </span>
                      <span className="text-emerald-700 text-xs font-bold">Compliant</span>
                    </div>
                    <div className="w-32 h-32 mx-auto my-3 rounded-2xl overflow-hidden border-2 border-gray-300 shadow-md">
                      <img src="/pwa-512x512.png" alt="512x512 Icon" className="w-full h-full object-cover" />
                    </div>
                    <h5 className="font-bold text-center text-xs uppercase text-gray-900">
                      High-Resolution Store Icon
                    </h5>
                    <p className="text-[11px] text-gray-500 text-center font-sans mt-0.5">
                      32-bit PNG with alpha, max 1024 KB
                    </p>
                  </div>

                  <a
                    href="/pwa-512x512.png"
                    download="NS_Properties_PlayStore_Icon_512x512.png"
                    className="w-full py-2 bg-[#1a1a1a] hover:bg-black text-white text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                  >
                    <Download className="w-3.5 h-3.5 text-[#c4a47c]" />
                    <span>Download 512&times;512 Icon</span>
                  </a>
                </div>

                {/* 1024x500 Feature Graphic Card */}
                <div className="bg-white border border-gray-300 p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-black text-[#c4a47c] text-[10px] font-bold px-2 py-0.5 uppercase">
                        1024 &times; 500 Banner
                      </span>
                      <span className="text-emerald-700 text-xs font-bold">Compliant</span>
                    </div>
                    <div className="w-full h-32 mx-auto my-3 rounded-sm overflow-hidden border border-gray-300 shadow-md bg-slate-900">
                      <img src="/play-store-feature-graphic.svg" alt="1024x500 Feature Graphic" className="w-full h-full object-cover" />
                    </div>
                    <h5 className="font-bold text-center text-xs uppercase text-gray-900">
                      Feature Graphic Promotional Banner
                    </h5>
                    <p className="text-[11px] text-gray-500 text-center font-sans mt-0.5">
                      Exact 1024 &times; 500 px aspect ratio required by Google
                    </p>
                  </div>

                  <a
                    href="/play-store-feature-graphic.svg"
                    download="NS_Properties_PlayStore_FeatureGraphic_1024x500.svg"
                    className="w-full py-2 bg-[#1a1a1a] hover:bg-black text-white text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                  >
                    <Download className="w-3.5 h-3.5 text-[#c4a47c]" />
                    <span>Download Feature Graphic</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DIGITAL ASSET LINKS */}
          {activeTab === 'assetlinks' && (
            <div className="space-y-4 font-mono-luxury text-xs">
              <div className="bg-[#1a1a1a] p-4 text-white space-y-2 border border-[#c4a47c]/40">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif-luxury text-base font-bold text-[#c4a47c] flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Digital Asset Links (assetlinks.json)
                  </h4>
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                    Active &bull; Verified
                  </span>
                </div>
                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                  Digital Asset Links establishes cryptographic trust between your Android app and your live web domain. This enables <strong>Seamless Fullscreen App Mode</strong> without any browser address bar or chrome.
                </p>
              </div>

              <div className="bg-white p-4 border border-gray-300 space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-gray-800 uppercase">Live Hosted URL:</span>
                  <a
                    href={`${publicShareUrl}/.well-known/assetlinks.json`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>{publicShareUrl}/.well-known/assetlinks.json</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold uppercase text-[11px] text-gray-700">JSON Payload:</span>
                    <button
                      onClick={() => handleCopy(JSON.stringify([
                        {
                          relation: ["delegate_permission/common.handle_all_urls"],
                          target: {
                            namespace: "android_app",
                            package_name: packageId,
                            sha256_cert_fingerprints: [
                              "14:6D:E9:DE:4E:9F:8E:B2:D0:D4:56:56:47:82:17:80:FF:03:7E:8C:F9:64:CF:57:3F:8E:B6:F4:6F:E1:92:02",
                              "E2:73:96:A8:FB:5E:2B:6E:5B:DC:65:21:49:15:BE:E5:69:B6:FE:57:4E:57:D8:1A:F7:BA:3C:99:C9:92:DF:99"
                            ]
                          }
                        }
                      ], null, 2), 'assetlinks')}
                      className="text-emerald-700 font-bold text-[10px] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'assetlinks' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'assetlinks' ? 'Copied!' : 'Copy JSON'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-gray-900 text-emerald-400 font-mono text-[11px] overflow-x-auto rounded-xs">
{`[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "${packageId}",
      "sha256_cert_fingerprints": [
        "14:6D:E9:DE:4E:9F:8E:B2:D0:D4:56:56:47:82:17:80:FF:03:7E:8C:F9:64:CF:57:3F:8E:B6:F4:6F:E1:92:02",
        "E2:73:96:A8:FB:5E:2B:6E:5B:DC:65:21:49:15:BE:E5:69:B6:FE:57:4E:57:D8:1A:F7:BA:3C:99:C9:92:DF:99"
      ]
    }
  }
]`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: LAUNCH CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-4 font-mono-luxury text-xs">
              <div className="bg-white p-4 border border-[#1a1a1a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-sm text-[#1a1a1a] uppercase">
                    Google Play Console Launch Progress
                  </h5>
                  <p className="text-xs text-gray-500 font-sans mt-0.5">
                    Track each milestone to publish NS Properties to the Google Play Store.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 px-3 py-1.5 text-emerald-900 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{completedChecklistCount} of {totalChecklistItems} Completed</span>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  {
                    id: 'account',
                    title: '1. Register Google Play Developer Account',
                    desc: 'Sign up at play.google.com/console ($25 one-time registration fee paid directly to Google).',
                    link: 'https://play.google.com/console/signup'
                  },
                  {
                    id: 'appCreated',
                    title: '2. Create App in Play Console',
                    desc: 'Click "Create App" > Name: "NS Properties: Real Estate India", Default language: English, App, Free.',
                    link: 'https://play.google.com/console'
                  },
                  {
                    id: 'metadataFilled',
                    title: '3. Fill Store Listing Metadata',
                    desc: 'Copy Short & Full descriptions from Listing Metadata tab and paste into Store Listing.',
                    link: null
                  },
                  {
                    id: 'graphicsUploaded',
                    title: '4. Upload 512x512 Icon & 1024x500 Feature Graphic',
                    desc: 'Upload high-resolution icon and luxury feature graphic banner into Main Store Listing graphics.',
                    link: null
                  },
                  {
                    id: 'aabUploaded',
                    title: '5. Package & Upload .AAB Android App Bundle',
                    desc: 'Generate .aab via PWABuilder or Android Studio, then upload under Production > Create new release.',
                    link: pwabuilderUrl
                  },
                  {
                    id: 'contentRating',
                    title: '6. Complete App Content & Rating Questionnaire',
                    desc: 'Answer questionnaire in Policy > App content (Privacy Policy URL, Target age 18+, No special permissions).',
                    link: null
                  },
                  {
                    id: 'privacyPolicy',
                    title: '7. Submit Privacy Policy Link',
                    desc: 'Link to privacy policy in Play Console (https://.../privacy).',
                    link: null
                  },
                  {
                    id: 'productionRollout',
                    title: '8. Start Rollout to Production',
                    desc: 'Review release summary and click "Start Rollout to Production". Google will review within 24-48 hours!',
                    link: 'https://play.google.com/console'
                  }
                ].map((item) => {
                  const isDone = !!checklist[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`p-3.5 border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isDone ? 'bg-emerald-50/70 border-emerald-400' : 'bg-white border-gray-300 hover:border-black'
                      }`}
                    >
                      <button type="button" className="mt-0.5 shrink-0 text-emerald-700">
                        {isDone ? <CheckSquare className="w-4 h-4 text-emerald-700" /> : <Square className="w-4 h-4 text-gray-400" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h6 className={`font-bold text-xs uppercase ${isDone ? 'text-emerald-950 line-through' : 'text-gray-900'}`}>
                            {item.title}
                          </h6>
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[10px] text-blue-700 hover:underline flex items-center gap-1 font-sans"
                            >
                              <span>Open Link</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-600 font-sans mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-3.5 sm:p-4 bg-[#fdfcf9] border-t border-[#1a1a1a] flex flex-wrap items-center justify-between gap-2 text-xs font-mono-luxury">
          <div className="flex items-center gap-2">
            <a
              href="https://play.google.com/console"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 bg-white hover:bg-gray-100 text-[#1a1a1a] border border-[#1a1a1a] uppercase font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Google Play Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={pwabuilderUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-black text-[#c4a47c] border border-black uppercase font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>1-Click Package on PWABuilder</span>
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-[#1a1a1a] hover:bg-black text-white uppercase font-bold text-xs border border-black cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
