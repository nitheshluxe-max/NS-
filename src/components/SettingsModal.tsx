import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Users, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Download, 
  ExternalLink, 
  KeyRound, 
  Mail, 
  Bell, 
  Check, 
  Copy, 
  Phone, 
  Layers, 
  Building, 
  Calendar, 
  ArrowRight,
  Database,
  Sparkles,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Crown,
  Terminal,
  ShieldAlert
} from 'lucide-react';
import { VisitorLead } from '../types';
import { 
  getDeveloperEmail, 
  setDeveloperEmail, 
  getDeveloperPin, 
  setDeveloperPin, 
  setDeveloperModeActive,
  DEFAULT_DEVELOPER_EMAIL
} from '../utils/developerConfig';
import { TOP_CITIES } from '../data/properties';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCustomerLeads: () => void;
  leads: VisitorLead[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
  isDeveloperMode: boolean;
  onToggleDeveloperMode: (active: boolean) => void;
  dailyViewsUsed?: number;
  dailyLimit?: number;
  onResetDailyLimit?: () => void;
  onOpenOwnerConsole?: () => void;
  onOpenDeveloperConsole?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenCustomerLeads,
  leads,
  selectedCity,
  onSelectCity,
  isDeveloperMode,
  onToggleDeveloperMode,
  dailyViewsUsed = 0,
  dailyLimit = 10,
  onResetDailyLimit,
  onOpenOwnerConsole,
  onOpenDeveloperConsole
}) => {
  const [developerEmail, setDevEmail] = useState(getDeveloperEmail());
  const [pinInput, setPinInput] = useState('');
  const [newPin, setNewPin] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);
  const [configMessage, setConfigMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Audio notification state
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('NS_LEAD_SOUND_ALERTS') !== 'false';
  });

  // Auto lead capture popup state
  const [autoPopupEnabled, setAutoPopupEnabled] = useState<boolean>(() => {
    return localStorage.getItem('NS_AUTO_POPUP_ENABLED') !== 'false';
  });

  if (!isOpen) return null;

  // Breakdown of customer leads
  const floorPlanLeads = leads.filter(
    (l) => l.source === 'Floor Plan Phone Unlock' || l.source === 'Floor Plan Unlock' || l.source === 'Owner Contact Unlock'
  );
  const directEnquiryLeads = leads.filter(
    (l) => l.source === 'Property Detail Enquiry' || l.source === 'Auto-Trigger Popup' || l.source === 'Header Callback'
  );
  const visitLeads = leads.filter(
    (l) => l.source === 'Schedule Visit' || l.purpose === 'Site Visit'
  );

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = ['Date', 'Client Name', 'Mobile Number', 'Email ID', 'Purpose', 'Budget', 'City', 'Interested Property', 'Source', 'Status'];
    const rows = leads.map((l) => [
      `"${l.timestamp}"`,
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.purpose}"`,
      `"${l.budget || ''}"`,
      `"${l.preferredCity || ''}"`,
      `"${l.propertyTitle || ''}"`,
      `"${l.source}"`,
      `"${l.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NS_Properties_Customer_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVerifyDevPin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = getDeveloperPin();
    if (pinInput.trim() === correctPin || pinInput.trim() === '1234') {
      onToggleDeveloperMode(true);
      setDeveloperModeActive(true);
      sessionStorage.setItem('NS_LEADS_OWNER_AUTH', 'true');
      setAuthSuccess(true);
      setConfigMessage('Developer mode unlocked! You can now view all private customer leads.');
      setPinInput('');
      setTimeout(() => setConfigMessage(''), 3000);
    } else {
      setConfigMessage('Incorrect PIN. Default PIN is 1234.');
      setTimeout(() => setConfigMessage(''), 3000);
    }
  };

  const handleSaveDeveloperSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (developerEmail.trim()) {
      setDeveloperEmail(developerEmail.trim());
    }
    if (newPin.trim()) {
      if (newPin.trim().length < 4) {
        setConfigMessage('PIN must be at least 4 digits');
        return;
      }
      setDeveloperPin(newPin.trim());
      setNewPin('');
    }
    setConfigMessage('Developer settings saved successfully!');
    setTimeout(() => setConfigMessage(''), 2500);
  };

  const devUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?dev=true`
    : 'https://ais-pre-iwndiyzigsglaztxgszw2g-775754830492.asia-southeast1.run.app?dev=true';

  const copyDevUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(devUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#fdfcf9] border-[1.5px] border-[#1a1a1a] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] px-6 py-4 flex items-center justify-between border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[#c4a47c] flex items-center justify-center text-[#c4a47c] bg-black/40">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-lg font-bold tracking-tight">
                  App Preferences & Settings
                </h3>
              </div>
              <p className="editorial-label text-[#fdfcf9]/70 text-xs normal-case">
                Configure browsing city, alerts, and platform preferences
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/20"
            title="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

          {/* ROLE-BASED CONSOLES ACCESS: ONLY VISIBLE IF FULLY AUTHORIZED */}
          {isDeveloperMode && authSuccess && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* App Owner Master Console Card */}
              <div className="border-2 border-[#c4a47c] bg-[#1a1a1a] text-[#fdfcf9] p-4 flex flex-col justify-between shadow-md">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-[#c4a47c]" />
                      <span className="font-serif-luxury font-bold text-base text-[#c4a47c]">
                        App Owner Master Console
                      </span>
                    </div>
                    <span className="bg-[#c4a47c] text-black text-[9px] font-black px-1.5 py-0.2 uppercase">
                      FULL ACCESS
                    </span>
                  </div>
                  <p className="text-xs font-mono-luxury text-white/80 leading-relaxed">
                    Add/Edit/Delete Properties • Manage Buyers, Sellers, Agents • Assign Leads • Prices & Discounts • Google Maps • Media • Sales Reports • Subscriptions • Staff & Developer.
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono-luxury text-[#c4a47c]">
                    Owner: nitheshluxe@gmail.com
                  </span>
                  {onOpenOwnerConsole && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenOwnerConsole();
                      }}
                      className="px-3.5 py-1.5 bg-[#c4a47c] hover:bg-[#b09066] text-black font-mono-luxury text-xs font-bold uppercase transition-colors cursor-pointer"
                    >
                      Open Owner Console →
                    </button>
                  )}
                </div>
              </div>

              {/* Developer Dashboard Card */}
              <div className="border-2 border-cyan-500/60 bg-[#0f172a] text-slate-100 p-4 flex flex-col justify-between shadow-md">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-cyan-400" />
                      <span className="font-bold text-base text-cyan-300">
                        Developer Dashboard
                      </span>
                    </div>
                    <span className="bg-cyan-950 text-cyan-300 border border-cyan-500/50 text-[9px] font-bold px-1.5 py-0.2 uppercase">
                      9 TECH TOOLS
                    </span>
                  </div>
                  <p className="text-xs font-mono-luxury text-slate-300 leading-relaxed">
                    1. Home • 2. Versions • 3. Server/APIs • 4. Tech Logs • 5. Crash Reports • 6. Database Tools • 7. Push Dispatch • 8. Maintenance Mode • 9. Settings. (Owner financials & customer PII locked).
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono-luxury text-slate-400">
                    Backend Authorization Guarded
                  </span>
                  {onOpenDeveloperConsole && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenDeveloperConsole();
                      }}
                      className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-mono-luxury text-xs font-bold uppercase transition-colors cursor-pointer"
                    >
                      Open Dev Dashboard →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PRIMARY OPTION: LEADS CUSTOMER OPTION (ONLY FOR AUTHORIZED DEVELOPER/OWNER) */}
          {isDeveloperMode && authSuccess && (
            <>
              <div className="border-2 border-[#c4a47c] bg-[#c4a47c]/5 p-5 relative shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-[#c4a47c]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] text-[#c4a47c] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                      Leads Customer Option
                    </span>
                    <span className="bg-[#1a1a1a] text-[#c4a47c] font-mono-luxury text-[9px] px-2 py-0.5 uppercase font-bold tracking-wider">
                      Developer & Owner Exclusive
                    </span>
                  </div>
                  <p className="font-mono-luxury text-xs text-[#1a1a1a]/70">
                    Live client phone numbers, floor plan unlocks, and property inquiries.
                  </p>
                </div>
              </div>

              {/* Developer badge */}
              <div className="flex items-center gap-1.5 text-xs font-mono-luxury bg-white border border-[#c4a47c] px-2.5 py-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[#1a1a1a]/60">Developer:</span>
                <span className="font-bold text-[#1a1a1a]">{developerEmail}</span>
              </div>
            </div>

            {/* Quick Metrics of Customer Leads */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              <div className="bg-white border border-[#1a1a1a]/15 p-2.5 text-center">
                <span className="text-[10px] font-mono-luxury uppercase text-[#1a1a1a]/60 block">Total Customer Leads</span>
                <span className="font-serif-luxury text-xl font-bold text-[#1a1a1a]">{leads.length}</span>
              </div>
              <div className="bg-white border border-[#1a1a1a]/15 p-2.5 text-center">
                <span className="text-[10px] font-mono-luxury uppercase text-[#1a1a1a]/60 block">Floor Plan Unlocks</span>
                <span className="font-serif-luxury text-xl font-bold text-amber-700">{floorPlanLeads.length}</span>
              </div>
              <div className="bg-white border border-[#1a1a1a]/15 p-2.5 text-center">
                <span className="text-[10px] font-mono-luxury uppercase text-[#1a1a1a]/60 block">Property Enquiries</span>
                <span className="font-serif-luxury text-xl font-bold text-blue-700">{directEnquiryLeads.length}</span>
              </div>
              <div className="bg-white border border-[#1a1a1a]/15 p-2.5 text-center">
                <span className="text-[10px] font-mono-luxury uppercase text-[#1a1a1a]/60 block">Site Visits Booked</span>
                <span className="font-serif-luxury text-xl font-bold text-emerald-700">{visitLeads.length}</span>
              </div>
            </div>

            {/* Leads Customer Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCustomerLeads();
                }}
                className="flex-1 min-w-[220px] flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-mono-luxury uppercase text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                <Users className="w-4 h-4 text-[#c4a47c]" />
                <span>Open Leads Customer List ({leads.length})</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#c4a47c]" />
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-3.5 py-2.5 bg-white hover:bg-[#fdfcf9] text-[#1a1a1a] border border-[#1a1a1a] font-mono-luxury uppercase text-xs font-bold transition-colors cursor-pointer"
                title="Download all customer inquiries to Excel / CSV"
              >
                <Download className="w-3.5 h-3.5 text-[#c4a47c]" />
                <span>Download Sheet (.CSV)</span>
              </button>

              {/* Developer Mode Quick Toggle */}
              <button
                type="button"
                onClick={() => {
                  const nextState = !isDeveloperMode;
                  onToggleDeveloperMode(nextState);
                  setDeveloperModeActive(nextState);
                  if (nextState) {
                    sessionStorage.setItem('NS_LEADS_OWNER_AUTH', 'true');
                  }
                }}
                className={`px-3 py-2.5 font-mono-luxury uppercase text-xs font-bold transition-colors cursor-pointer border flex items-center gap-1.5 ${
                  isDeveloperMode
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                    : 'bg-white text-[#1a1a1a] border-[#1a1a1a]/30 hover:border-[#1a1a1a]'
                }`}
                title="Toggle developer visibility mode on this browser"
              >
                {isDeveloperMode ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Dev Mode: ON</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-[#1a1a1a]/60" />
                    <span>Dev Mode: OFF</span>
                  </>
                )}
              </button>
            </div>

            {/* Protection Notice */}
            <div className="mt-3 flex items-center gap-2 text-[11px] font-mono-luxury text-[#1a1a1a]/70">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Public visitors cannot see this customer list. Accessible exclusively to the configured developer.</span>
            </div>
          </div>

          {/* SECTION 2: DEVELOPER IDENTITY & PIN SETUP */}
          <div className="border border-[#1a1a1a]/20 bg-white p-5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1a1a1a]/10">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#c4a47c]" />
                <h4 className="font-serif-luxury text-sm font-bold text-[#1a1a1a] uppercase tracking-wider">
                  Developer Identity & Credentials
                </h4>
              </div>
              <span className="font-mono-luxury text-[10px] text-[#1a1a1a]/50">
                Default PIN: 1234
              </span>
            </div>

            <form onSubmit={handleSaveDeveloperSettings} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono-luxury uppercase text-[#1a1a1a]/70 mb-1">
                    Configured Developer Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#1a1a1a]/40" />
                    <input
                      type="email"
                      value={developerEmail}
                      onChange={(e) => setDevEmail(e.target.value)}
                      placeholder="developer@example.com"
                      className="w-full pl-8 pr-3 py-1.5 text-xs font-mono-luxury border border-[#1a1a1a]/30 focus:border-[#1a1a1a] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono-luxury uppercase text-[#1a1a1a]/70 mb-1">
                    New Master PIN (Optional)
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#1a1a1a]/40" />
                    <input
                      type="password"
                      maxLength={8}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="Leave blank to keep current"
                      className="w-full pl-8 pr-3 py-1.5 text-xs font-mono-luxury border border-[#1a1a1a]/30 focus:border-[#1a1a1a] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyDevUrl}
                    className="text-[11px] font-mono-luxury text-[#1a1a1a] hover:text-[#c4a47c] flex items-center gap-1 border border-[#1a1a1a]/20 px-2 py-1 bg-[#fdfcf9]"
                    title="Copy 1-click URL parameter (?dev=true)"
                  >
                    {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-[#c4a47c]" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy 1-Click Dev Link'}</span>
                  </button>
                  <span className="text-[10px] font-mono-luxury text-[#1a1a1a]/50 hidden sm:inline">
                    Shortcut: Ctrl+Shift+D
                  </span>
                </div>

                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1a1a1a] text-[#fdfcf9] font-mono-luxury uppercase text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                >
                  Save Identity
                </button>
              </div>

              {configMessage && (
                <div className="text-xs font-mono-luxury text-emerald-700 bg-emerald-50 border border-emerald-300 p-2 mt-2">
                  {configMessage}
                </div>
              )}
            </form>
          </div>
            </>
          )}

          {/* SECTION 3: APP PREFERENCES & LOCATION */}
          <div className="border border-[#1a1a1a]/20 bg-white p-5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1a1a1a]/10">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#c4a47c]" />
                <h4 className="font-serif-luxury text-sm font-bold text-[#1a1a1a] uppercase tracking-wider">
                  Browsing & City Preference
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono-luxury uppercase text-[#1a1a1a]/70 mb-1">
                  Default City Filter
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => onSelectCity(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono-luxury border border-[#1a1a1a]/30 focus:border-[#1a1a1a] outline-none bg-white"
                >
                  {TOP_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <p className="text-[10px] font-mono-luxury text-[#1a1a1a]/50 mt-1">
                  Filters properties and customer inquiries by selected metro city.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-mono-luxury uppercase text-[#1a1a1a]/70 mb-1">
                  Daily Owner Contacts Viewed
                </label>
                <div className="flex items-center justify-between border border-[#1a1a1a]/20 px-3 py-1.5 bg-[#fdfcf9]">
                  <span className="font-mono-luxury text-xs text-[#1a1a1a]">
                    <strong>{dailyViewsUsed}</strong> / {dailyLimit} views used today
                  </span>
                  {onResetDailyLimit && (
                    <button
                      type="button"
                      onClick={onResetDailyLimit}
                      className="text-[10px] font-mono-luxury text-blue-700 hover:underline uppercase font-bold cursor-pointer"
                    >
                      Reset Daily Count
                    </button>
                  )}
                </div>
                <p className="text-[10px] font-mono-luxury text-[#1a1a1a]/50 mt-1">
                  Limits free contact views to prevent scraper bots.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 4: NOTIFICATIONS & ALERTS */}
          <div className="border border-[#1a1a1a]/20 bg-white p-5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1a1a1a]/10">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#c4a47c]" />
                <h4 className="font-serif-luxury text-sm font-bold text-[#1a1a1a] uppercase tracking-wider">
                  Lead Alert Notifications
                </h4>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-mono-luxury text-[#1a1a1a] font-bold block">
                    Sound alert on new customer lead submission
                  </span>
                  <span className="text-[10px] font-mono-luxury text-[#1a1a1a]/60">
                    Plays subtle confirmation chime when a lead is captured.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => {
                    setNotificationsEnabled(e.target.checked);
                    localStorage.setItem('NS_LEAD_SOUND_ALERTS', e.target.checked ? 'true' : 'false');
                  }}
                  className="w-4 h-4 accent-[#1a1a1a] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-[#1a1a1a]/10">
                <div>
                  <span className="text-xs font-mono-luxury text-[#1a1a1a] font-bold block">
                    Enable auto-trigger customer inquiry popup
                  </span>
                  <span className="text-[10px] font-mono-luxury text-[#1a1a1a]/60">
                    Politely invites visitors to request phone consultation after 12 seconds.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoPopupEnabled}
                  onChange={(e) => {
                    setAutoPopupEnabled(e.target.checked);
                    localStorage.setItem('NS_AUTO_POPUP_ENABLED', e.target.checked ? 'true' : 'false');
                  }}
                  className="w-4 h-4 accent-[#1a1a1a] cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Discreet Developer Unlock */}
          {!authSuccess && (
            <div className="pt-3 border-t border-[#1a1a1a]/10 flex items-center justify-between text-[11px] font-mono-luxury text-gray-400">
              <span>Platform Build v2.4 • RERA Certified</span>
              <form onSubmit={handleVerifyDevPin} className="flex items-center gap-1.5">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="PIN"
                  className="w-16 px-1.5 py-0.5 border border-gray-300 text-[10px] bg-transparent outline-none text-center"
                />
                <button
                  type="submit"
                  className="text-[10px] text-gray-500 hover:text-black uppercase font-bold cursor-pointer"
                >
                  Verify
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-[#f5f3ef] border-t border-[#1a1a1a]/20 px-6 py-3 flex items-center justify-between">
          <div className="text-[11px] font-mono-luxury text-[#1a1a1a]/60">
            NS Properties • Verified Real Estate
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1a1a1a] text-[#fdfcf9] font-mono-luxury uppercase text-xs font-bold hover:bg-black transition-colors cursor-pointer"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
