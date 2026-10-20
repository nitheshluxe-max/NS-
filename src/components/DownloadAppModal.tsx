import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Laptop, 
  FileCode2, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  Sparkles,
  ArrowRight,
  Loader2,
  FolderArchive,
  MessageCircle,
  Send,
  Mail,
  QrCode,
  Zap,
  RefreshCw
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { downloadProjectZip } from '../utils/projectDownloader';
import { generatePlayStoreProjectZip, downloadListingMetadataTextFile } from '../utils/playstoreProjectGenerator';
import { openWhatsAppShare } from '../utils/whatsapp';
import { getPublicShareUrl } from '../utils/shareUrl';

interface DownloadAppModalProps {
  onClose: () => void;
  onOpenShare?: () => void;
  onOpenPlayStorePublish?: () => void;
  initialTab?: 'install' | 'code' | 'share' | 'playstore';
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ 
  onClose, 
  onOpenShare,
  onOpenPlayStorePublish,
  initialTab = 'code'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'install' | 'code' | 'share' | 'playstore'>(initialTab);
  const [copied, setCopied] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [isPackagingPlayStore, setIsPackagingPlayStore] = useState(false);

  const publicShareUrl = getPublicShareUrl();

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Hey! Check out this real estate app for buying, renting, and listing verified properties across India:\n${publicShareUrl}`
  )}`;

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(publicShareUrl)}&text=${encodeURIComponent(
    'Check out NS Properties - Verified Homes, Flats & Plots in India'
  )}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicShareUrl)}`;

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      setZipProgress(15);
      await downloadProjectZip((progress) => {
        setZipProgress(progress);
      });
      setIsZipping(false);
    } catch (err) {
      console.error('Failed to download project zip:', err);
      setIsZipping(false);
    }
  };

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstalledSuccess(true);
    }
  };

  const copyCommands = () => {
    navigator.clipboard.writeText('npm install\nnpm run dev');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-xl bg-[#fdfcf9] border-[1.5px] border-[#1a1a1a] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1a1a1a] p-5 text-[#fdfcf9] flex items-start justify-between border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[#c4a47c] flex items-center justify-center text-[#c4a47c] font-serif-luxury font-bold text-lg">
              NS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-xl font-bold tracking-tight">Download & Export NS Properties</h3>
                <span className="editorial-badge bg-[#c4a47c] text-[#1a1a1a] border-0 text-[10px]">
                  PWA Ready
                </span>
              </div>
              <p className="editorial-label text-[#fdfcf9]/70 text-xs normal-case mt-0.5">
                Install as a mobile app, download the complete source code, or prepare for Google Play Store
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white border border-white/20 hover:border-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1a1a1a] bg-[#fdfcf9] px-3 pt-2 text-xs font-mono-luxury uppercase font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'code'
                ? 'border-[#1a1a1a] text-[#1a1a1a] bg-white'
                : 'border-transparent text-[#1a1a1a]/60 hover:text-[#1a1a1a]'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5 text-[#c4a47c]" />
            Source Code (ZIP)
          </button>
          <button
            onClick={() => setActiveTab('install')}
            className={`flex items-center gap-2 px-3 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'install'
                ? 'border-[#1a1a1a] text-[#1a1a1a] bg-white'
                : 'border-transparent text-[#1a1a1a]/60 hover:text-[#1a1a1a]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#c4a47c]" />
            Install App
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={`flex items-center gap-2 px-3 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'share'
                ? 'border-[#1a1a1a] text-[#1a1a1a] bg-white'
                : 'border-transparent text-[#1a1a1a]/60 hover:text-[#1a1a1a]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-[#c4a47c]" />
            Share App
          </button>
          <button
            onClick={() => setActiveTab('playstore')}
            className={`flex items-center gap-2 px-3 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'playstore'
                ? 'border-[#1a1a1a] text-[#1a1a1a] bg-white'
                : 'border-transparent text-[#1a1a1a]/60 hover:text-[#1a1a1a]'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-[#c4a47c]" />
            Play Store / APK
          </button>
        </div>

        {/* Quick Action Direct Download Banner */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2.5 text-xs">
            <FolderArchive className="w-5 h-5 text-[#c4a47c] shrink-0" />
            <div>
              <span className="font-mono-luxury font-bold block text-xs uppercase tracking-wider text-[#c4a47c]">Download Full Source Code (.ZIP)</span>
              <span className="editorial-label text-[#fdfcf9]/70 text-[10px] normal-case">All React & TypeScript source files ready to extract & launch</span>
            </div>
          </div>
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="w-full sm:w-auto px-4 py-2 bg-[#c4a47c] hover:bg-[#b09066] text-[#1a1a1a] font-mono-luxury font-bold text-xs uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-60 border border-[#1a1a1a]"
          >
            {isZipping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#1a1a1a]" />
                <span>Downloading {zipProgress}%...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#1a1a1a]" />
                <span>Download ZIP</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-slate-700 text-sm">
          {activeTab === 'install' && (
            <div className="space-y-4">
              {/* Status Banner */}
              {isInstalled || installedSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-800">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">NS Properties is Installed!</h4>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      You can launch it anytime directly from your device home screen or app launcher.
                    </p>
                  </div>
                </div>
              ) : isInstallable ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-[#005CA8] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      1-Click Instant Installation Ready
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      No app store account required. Uses 0 MB storage, works offline with instant load times.
                    </p>
                  </div>
                  <button
                    onClick={handleInstallClick}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#005CA8] hover:bg-[#004780] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    Install Now
                  </button>
                </div>
              ) : isIOS ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2.5">
                  <h4 className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-amber-600" />
                    Install on iPhone / iPad (iOS Safari)
                  </h4>
                  <ol className="text-xs text-amber-800 space-y-1.5 list-decimal list-inside">
                    <li>Tap the <strong>Share</strong> button (box with an upward arrow) in the Safari toolbar.</li>
                    <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                    <li>Tap <strong>Add</strong> in the top right corner.</li>
                  </ol>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-[#005CA8]" />
                    How to Install on Android / Chrome / Edge
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    If viewing in an embedded iframe preview, click <strong>"Open in New Tab"</strong> at the top of your preview screen, then:
                  </p>
                  <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                    <li><strong>On Android (Chrome)</strong>: Tap the <strong>⋮ (three dots)</strong> menu in the top right, then select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                    <li><strong>On Windows / Mac (Chrome/Edge)</strong>: Click the <strong>Install icon (monitor with down arrow)</strong> inside your browser address bar.</li>
                  </ul>
                </div>
              )}

              {/* Benefits Box */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="border border-slate-200 rounded-xl p-3 text-center bg-slate-50/50 flex flex-col items-center">
                  <Zap className="w-5 h-5 text-amber-500 mb-1" />
                  <h5 className="font-bold text-xs text-slate-900 mt-1">Instant Speed</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">Loads offline with zero lag</p>
                </div>
                <div className="border border-slate-200 rounded-xl p-3 text-center bg-slate-50/50 flex flex-col items-center">
                  <Smartphone className="w-5 h-5 text-blue-500 mb-1" />
                  <h5 className="font-bold text-xs text-slate-900 mt-1">Native Feel</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">Runs fullscreen with no browser bars</p>
                </div>
                <div className="border border-slate-200 rounded-xl p-3 text-center bg-slate-50/50 flex flex-col items-center">
                  <RefreshCw className="w-5 h-5 text-emerald-500 mb-1" />
                  <h5 className="font-bold text-xs text-slate-900 mt-1">Auto-Updates</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">Always runs the latest listings</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              {/* Primary Download Button */}
              <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4.5 space-y-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <FolderArchive className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-emerald-950">
                      1-Click Instant Download (.ZIP)
                    </h4>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Download the full codebase directly from your browser without opening any menus.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadZip}
                  disabled={isZipping}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isZipping ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Packaging ZIP ({zipProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Download NS-Properties-App.zip</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-[#005CA8]" />
                  Alternative: Export from AI Studio Menu
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You can also export and download using the AI Studio top toolbar:
                </p>
                <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside bg-white p-3 rounded-lg border border-slate-200">
                  <li>Look at the <strong>top-right corner</strong> of your Google AI Studio browser window.</li>
                  <li>Click on the <strong>Settings</strong> icon or the <strong>"..." (Menu)</strong>.</li>
                  <li>Click <strong>"Download as ZIP"</strong> (or <strong>"Export to GitHub"</strong>).</li>
                  <li>Extract the downloaded ZIP file to any folder on your computer.</li>
                </ol>
              </div>

              <div className="bg-slate-900 text-slate-100 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">Run Locally in Terminal:</span>
                  <button
                    onClick={copyCommands}
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="text-xs font-mono bg-slate-950 p-3 rounded-lg text-emerald-400 overflow-x-auto">
                  npm install{'\n'}npm run dev
                </pre>
                <p className="text-[11px] text-slate-400">
                  Your local dev server will start at <span className="text-white font-mono">http://localhost:3000</span>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'share' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-bold text-sm text-[#005CA8] flex items-center gap-1.5">
                  <Share2 className="w-4 h-4" />
                  Send App Link to Friends & Family
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Your friends can open this link on any smartphone (Android or iPhone) or desktop browser. No app store installation required!
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Shareable URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publicShareUrl}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 select-all focus:outline-hidden"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(publicShareUrl);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                      copied ? 'bg-emerald-600 text-white' : 'bg-[#005CA8] hover:bg-[#004885] text-white'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Direct share icons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => openWhatsAppShare(`Hey! Check out this real estate app for buying, renting, and listing verified properties across India:\n${publicShareUrl}`, publicShareUrl)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 transition-colors text-center cursor-pointer"
                >
                  <MessageCircle className="w-6 h-6 text-emerald-600 mb-1" />
                  <span className="text-xs font-bold">WhatsApp</span>
                  <span className="text-[10px] text-emerald-600">Send to Chat</span>
                </button>

                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 transition-colors text-center cursor-pointer"
                >
                  <Send className="w-6 h-6 text-sky-600 mb-1" />
                  <span className="text-xs font-bold">Telegram</span>
                  <span className="text-[10px] text-sky-600">Share Post</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowQR(!showQR)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-colors text-center cursor-pointer ${
                    showQR ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'
                  }`}
                >
                  <QrCode className="w-6 h-6 text-amber-600 mb-1" />
                  <span className="text-xs font-bold">QR Code</span>
                  <span className="text-[10px] text-amber-600">{showQR ? 'Hide' : 'Show'}</span>
                </button>
              </div>

              {showQR && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                  <p className="text-xs font-bold text-slate-800 mb-2">Scan with Camera to Open App:</p>
                  <img src={qrCodeUrl} alt="QR Code" className="w-36 h-36 mx-auto bg-white p-2 rounded-lg border border-slate-300" />
                </div>
              )}
            </div>
          )}

          {activeTab === 'playstore' && (
            <div className="space-y-4">
              <div className="bg-[#1a1a1a] border border-[#c4a47c]/40 text-[#fdfcf9] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif-luxury text-base font-bold text-[#c4a47c] flex items-center gap-2">
                    <Laptop className="w-4 h-4" />
                    Publish to Google Play Store (TWA / .AAB)
                  </h4>
                  <span className="bg-[#c4a47c] text-[#1a1a1a] text-[10px] font-mono-luxury font-bold uppercase px-2 py-0.5">
                    Trusted Web Activity
                  </span>
                </div>
                <p className="font-mono-luxury text-xs text-[#fdfcf9]/80 leading-relaxed">
                  Google officially allows publishing web apps to Google Play using <strong>Trusted Web Activity (TWA)</strong>. NS Properties is configured with an Android-ready Web App Manifest, 512×512 maskable icons, and service worker.
                </p>
              </div>

              {/* Live URL for packaging */}
              <div className="p-3 bg-white border border-[#1a1a1a] space-y-1.5 font-mono-luxury">
                <label className="text-[11px] font-bold text-[#1a1a1a] uppercase block">
                  Your Live URL for Play Store Packaging:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publicShareUrl}
                    className="w-full px-2.5 py-1.5 bg-[#fdfcf9] border border-[#1a1a1a]/30 text-xs font-mono text-[#1a1a1a] select-all focus:outline-hidden"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(publicShareUrl);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] text-xs font-bold uppercase shrink-0 flex items-center gap-1 cursor-pointer border border-[#1a1a1a] transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#c4a47c]" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* 5 Step Comprehensive Roadmap */}
              <div className="space-y-2.5 text-xs text-[#1a1a1a] font-mono-luxury">
                <div className="flex items-start gap-3 p-3 border border-[#1a1a1a]/30 bg-white">
                  <div className="w-6 h-6 bg-[#1a1a1a] text-[#c4a47c] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#1a1a1a]">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1a1a1a] uppercase text-xs">Register Google Play Developer Account</h5>
                    <p className="text-[#1a1a1a]/70 text-[11px] mt-0.5 normal-case font-sans">
                      Sign up at <a href="https://play.google.com/console/signup" target="_blank" rel="noreferrer" className="text-[#1a1a1a] font-bold underline inline-flex items-center gap-0.5">play.google.com/console <ExternalLink className="w-3 h-3 text-[#c4a47c]" /></a> with your Google Account ($25 one-time developer registration fee paid directly to Google).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border border-[#1a1a1a]/30 bg-white">
                  <div className="w-6 h-6 bg-[#1a1a1a] text-[#c4a47c] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#1a1a1a]">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1a1a1a] uppercase text-xs">Generate Android App Bundle (.aab) on PWABuilder</h5>
                    <p className="text-[#1a1a1a]/70 text-[11px] mt-0.5 normal-case font-sans">
                      Visit <a href={`https://www.pwabuilder.com?url=${encodeURIComponent(publicShareUrl)}`} target="_blank" rel="noreferrer" className="text-[#1a1a1a] font-bold underline inline-flex items-center gap-0.5">PWABuilder.com <ExternalLink className="w-3 h-3 text-[#c4a47c]" /></a>, click <strong>"Package for Stores"</strong> &gt; choose <strong>"Android"</strong>. Set your Package ID (e.g. <code className="bg-[#fdfcf9] border px-1 py-0.5 font-mono text-[10px]">in.nsproperties.app</code>) and click <strong>Download Package</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border border-[#1a1a1a]/30 bg-white">
                  <div className="w-6 h-6 bg-[#1a1a1a] text-[#c4a47c] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#1a1a1a]">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1a1a1a] uppercase text-xs">Domain Verification (assetlinks.json)</h5>
                    <p className="text-[#1a1a1a]/70 text-[11px] mt-0.5 normal-case font-sans">
                      PWABuilder provides a digital fingerprint file (<code className="bg-[#fdfcf9] border px-1 py-0.5 font-mono text-[10px]">.well-known/assetlinks.json</code>). Hosting this file proves to Google that you own the application domain, allowing the app to run completely fullscreen with zero browser address bars.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border border-[#1a1a1a]/30 bg-white">
                  <div className="w-6 h-6 bg-[#1a1a1a] text-[#c4a47c] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#1a1a1a]">
                    4
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1a1a1a] uppercase text-xs">Prepare Play Store Listing Graphics</h5>
                    <ul className="text-[#1a1a1a]/70 text-[11px] mt-1 space-y-0.5 list-disc list-inside normal-case font-sans">
                      <li><strong>App Icon:</strong> 512×512 PNG (ready in <code className="font-mono text-[10px]">/public/pwa-512x512.png</code>)</li>
                      <li><strong>Feature Graphic:</strong> 1024×500 PNG banner</li>
                      <li><strong>Phone Screenshots:</strong> 2 to 8 screenshots of property search & detail views</li>
                      <li><strong>Privacy Policy URL:</strong> Hosted link or standard real estate privacy page</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border border-[#1a1a1a]/30 bg-white">
                  <div className="w-6 h-6 bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-emerald-800">
                    5
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1a1a1a] uppercase text-xs">Create Production Release & Launch</h5>
                    <p className="text-[#1a1a1a]/70 text-[11px] mt-0.5 normal-case font-sans">
                      In Google Play Console, go to <strong>Production &gt; Create new release</strong>. Upload the signed <code className="bg-[#fdfcf9] border px-1 py-0.5 font-mono text-[10px]">.aab</code> bundle file, review details, and click <strong>Start Rollout to Production</strong>. Google will review and approve within 24 to 48 hours!
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1 font-mono-luxury">
                {onOpenPlayStorePublish && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPlayStorePublish();
                    }}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white uppercase font-bold text-xs border border-emerald-900 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Laptop className="w-4 h-4 text-[#c4a47c]" />
                    <span>Launch Google Play Store Publishing Console &amp; .AAB Hub</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#c4a47c]" />
                  </button>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        setIsPackagingPlayStore(true);
                        await generatePlayStoreProjectZip();
                        setIsPackagingPlayStore(false);
                      } catch (e) {
                        console.error(e);
                        setIsPackagingPlayStore(false);
                      }
                    }}
                    disabled={isPackagingPlayStore}
                    className="flex-1 py-2.5 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] uppercase font-bold text-xs border border-[#1a1a1a] transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    {isPackagingPlayStore ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c4a47c]" />
                        <span>Packaging Project...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-[#c4a47c]" />
                        <span>Download Android Studio ZIP</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://www.pwabuilder.com?url=${encodeURIComponent(publicShareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 bg-white hover:bg-slate-100 text-[#1a1a1a] uppercase font-bold text-xs border border-[#1a1a1a] transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#c4a47c]" />
                    <span>1-Click PWABuilder</span>
                  </a>

                  <a
                    href="https://play.google.com/console"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 bg-white hover:bg-slate-100 text-[#1a1a1a] uppercase font-bold text-xs border border-[#1a1a1a] transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <span>Play Console</span>
                    <ExternalLink className="w-3 h-3 text-[#1a1a1a]" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#fdfcf9] border-t border-[#1a1a1a] flex items-center justify-between text-xs font-mono-luxury text-[#1a1a1a]">
          <span className="editorial-label text-[#1a1a1a]/60">NS Properties • Version 1.0.0</span>
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-mono-luxury uppercase font-bold text-xs border border-[#1a1a1a] cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
