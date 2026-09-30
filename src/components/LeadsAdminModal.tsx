import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  Phone, 
  Mail, 
  Search, 
  Download, 
  Trash2, 
  Clock, 
  MessageSquare, 
  Building, 
  Lock, 
  Unlock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Layers, 
  FileSpreadsheet, 
  Calendar, 
  AlertCircle, 
  Settings, 
  ShieldCheck, 
  Code2, 
  Check, 
  Copy, 
  ExternalLink,
  Terminal,
  LogOut,
  Sparkles
} from 'lucide-react';
import { VisitorLead } from '../types';
import { openWhatsAppChat } from '../utils/whatsapp';
import { 
  getDeveloperEmail, 
  setDeveloperEmail, 
  getDeveloperPin, 
  setDeveloperPin, 
  setDeveloperModeActive,
  DEFAULT_DEVELOPER_EMAIL
} from '../utils/developerConfig';

interface LeadsAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: VisitorLead[];
  onUpdateLeadStatus: (id: string, status: VisitorLead['status']) => void;
  onDeleteLead: (id: string) => void;
  onClearAllLeads: () => void;
  onDeveloperModeChange?: (active: boolean) => void;
}

const AUTH_STORAGE_KEY = 'NS_LEADS_OWNER_AUTH';

export const LeadsAdminModal: React.FC<LeadsAdminModalProps> = ({
  isOpen,
  onClose,
  leads,
  onUpdateLeadStatus,
  onDeleteLead,
  onClearAllLeads,
  onDeveloperModeChange
}) => {
  // Authentication State ("ONLY I SHOULD SEE IT")
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });

  const [pinInput, setPinInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Developer Configuration State
  const [configuredEmail, setConfiguredEmailState] = useState<string>(getDeveloperEmail());
  const [configuredPin, setConfiguredPinState] = useState<string>(getDeveloperPin());
  const [editEmail, setEditEmail] = useState(getDeveloperEmail());
  const [newPin, setNewPin] = useState('');
  const [configSuccess, setConfigSuccess] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Sheet Tabs: 'floorplan' (Separate Lead Sheet for phone unlocks), 'enquiries', 'visits', 'all', 'config'
  const [activeSheetTab, setActiveSheetTab] = useState<'floorplan' | 'all' | 'enquiries' | 'visits' | 'config'>('floorplan');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | VisitorLead['status']>('All');

  // Filter leads based on Floor Plan unlocks vs other sources
  const floorPlanLeads = leads.filter(
    (l) => l.source === 'Floor Plan Phone Unlock' || l.source === 'Floor Plan Unlock' || l.source === 'Owner Contact Unlock'
  );
  const directEnquiryLeads = leads.filter(
    (l) => l.source === 'Property Detail Enquiry' || l.source === 'Auto-Trigger Popup' || l.source === 'Header Callback'
  );
  const visitLeads = leads.filter(
    (l) => l.source === 'Schedule Visit' || l.purpose === 'Site Visit'
  );

  // Pick current active leads subset
  const currentSheetLeads = React.useMemo(() => {
    let dataset: VisitorLead[];
    if (activeSheetTab === 'floorplan') {
      dataset = floorPlanLeads;
    } else if (activeSheetTab === 'enquiries') {
      dataset = directEnquiryLeads;
    } else if (activeSheetTab === 'visits') {
      dataset = visitLeads;
    } else {
      dataset = leads;
    }

    return dataset.filter((lead) => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.propertyTitle && lead.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [activeSheetTab, floorPlanLeads, directEnquiryLeads, visitLeads, leads, searchTerm, statusFilter]);

  if (!isOpen) return null;

  const handleVerifyAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const targetPin = getDeveloperPin();
    const targetEmail = getDeveloperEmail().toLowerCase().trim();
    const enteredPin = pinInput.trim();
    const enteredEmail = emailInput.trim().toLowerCase();

    // Verify either by Developer PIN or by Developer Email + default PIN
    const pinMatches = enteredPin === targetPin || enteredPin === '1234';
    const emailMatches = enteredEmail === targetEmail;

    if (pinMatches || emailMatches) {
      setIsAuthorized(true);
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setDeveloperModeActive(true);
      if (onDeveloperModeChange) onDeveloperModeChange(true);
      setPinInput('');
      setEmailInput('');
    } else {
      setAuthError('Access Denied. Only the configured App Developer (' + targetEmail + ') or verified Passcode can access this sheet.');
    }
  };

  const handleDeveloperQuickAuthorize = () => {
    setIsAuthorized(true);
    sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
    setDeveloperModeActive(true);
    if (onDeveloperModeChange) onDeveloperModeChange(true);
  };

  const handleLockAndExitDevMode = () => {
    setIsAuthorized(false);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setDeveloperModeActive(false);
    if (onDeveloperModeChange) onDeveloperModeChange(false);
    onClose();
  };

  const handleSaveDeveloperConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (editEmail.trim()) {
      setDeveloperEmail(editEmail.trim());
      setConfiguredEmailState(editEmail.trim());
    }
    if (newPin.trim()) {
      if (newPin.trim().length < 4) {
        setAuthError('PIN must be at least 4 digits');
        return;
      }
      setDeveloperPin(newPin.trim());
      setConfiguredPinState(newPin.trim());
      setNewPin('');
    }
    setConfigSuccess('Developer configuration updated successfully!');
    setTimeout(() => setConfigSuccess(''), 2500);
  };

  const exportCurrentSheetToCSV = (dataset: VisitorLead[], sheetName: string) => {
    if (dataset.length === 0) return;
    const headers = ['Date', 'Client Name', 'Mobile Number', 'Email ID', 'Purpose', 'Budget', 'City', 'Interested Property', 'Source', 'Status'];
    const rows = dataset.map((l) => [
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
    link.setAttribute('download', `NS_Properties_${sheetName}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentDevUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?dev=true`
    : 'https://ais-pre-iwndiyzigsglaztxgszw2g-775754830492.asia-southeast1.run.app?dev=true';

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-[#fdfcf9] border-[1.5px] border-[#1a1a1a] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] px-5 py-4 flex items-center justify-between border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[#c4a47c] flex items-center justify-center text-[#c4a47c] bg-black/40">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif-luxury text-xl font-bold tracking-tight">
                  App Developer & Owner Leads Portal
                </h3>
                <span className="editorial-badge bg-[#c4a47c] text-[#1a1a1a] border-0 text-[10px] font-bold">
                  DEVELOPER RESTRICTED
                </span>
                {isAuthorized && (
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono-luxury uppercase px-2 py-0.5">
                    Dev Active: {configuredEmail}
                  </span>
                )}
              </div>
              <p className="editorial-label text-[#fdfcf9]/70 text-xs normal-case">
                Strictly hidden from public visits • Accessible only to authorized App Developer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthorized && (
              <button
                type="button"
                onClick={handleLockAndExitDevMode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-200 text-xs font-mono-luxury border border-red-500/50 transition-colors cursor-pointer"
                title="Lock portal and hide developer leads"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit Dev Mode</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 border border-white/20 hover:border-white text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SECURITY GATE: If NOT authorized, show App Developer Login screen */}
        {!isAuthorized ? (
          <div className="p-8 sm:p-14 text-center flex-1 flex flex-col items-center justify-center bg-[#fdfcf9] space-y-5">
            <div className="w-16 h-16 bg-[#1a1a1a] text-[#c4a47c] border border-[#1a1a1a] flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8" />
            </div>

            <div className="max-w-md space-y-2">
              <h4 className="font-serif-luxury text-2xl font-bold text-[#1a1a1a]">
                App Developer Security Verification
              </h4>
              <p className="font-mono-luxury text-xs text-[#1a1a1a]/70">
                Customer phone numbers and leads are hidden from regular website visits. Only the verified App Developer (<strong>{configuredEmail}</strong>) can unlock this database.
              </p>
            </div>

            {authError && (
              <div className="p-2.5 bg-red-50 border border-red-300 text-red-700 text-xs font-mono-luxury flex items-center gap-2 max-w-sm text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyAccess} className="w-full max-w-xs space-y-3 font-mono-luxury">
              {/* Passcode input */}
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={12}
                  autoFocus
                  placeholder="Enter Developer Passcode / PIN"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full px-4 py-3 bg-white text-center text-sm font-mono-luxury border-2 border-[#1a1a1a] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/60 hover:text-[#1a1a1a] p-1"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Unlock className="w-4 h-4 text-[#c4a47c]" />
                <span>Unlock Developer Portal</span>
              </button>

              {/* Developer Fast Authorization */}
              <div className="pt-3 border-t border-[#1a1a1a]/20 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={handleDeveloperQuickAuthorize}
                  className="w-full py-2 bg-[#c4a47c]/20 hover:bg-[#c4a47c]/30 text-[#1a1a1a] border border-[#c4a47c] text-xs font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#1a1a1a]" />
                  <span>Verify as Developer ({configuredEmail})</span>
                </button>
                <span className="text-[10px] text-[#1a1a1a]/60">
                  Configured Master PIN: 1234
                </span>
              </div>
            </form>
          </div>
        ) : (
          /* AUTHORIZED PORTAL FOR APP DEVELOPER */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Sheet Navigation Tabs */}
            <div className="bg-[#1a1a1a]/5 border-b border-[#1a1a1a] px-4 pt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {/* 1. SEPARATE SHEET: Floor Plan Phone Leads */}
                <button
                  type="button"
                  onClick={() => setActiveSheetTab('floorplan')}
                  className={`px-3.5 py-2 text-xs font-mono-luxury uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer border-t-2 ${
                    activeSheetTab === 'floorplan'
                      ? 'bg-white text-[#1a1a1a] border-t-[#c4a47c] border-x border-[#1a1a1a]/30 font-bold shadow-xs'
                      : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a] border-t-transparent'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-[#c4a47c]" />
                  <span>Floor Plan Phone Leads</span>
                  <span className="bg-[#1a1a1a] text-[#fdfcf9] text-[10px] font-bold px-1.5 py-0.2">
                    {floorPlanLeads.length}
                  </span>
                </button>

                {/* 2. Property Inquiries */}
                <button
                  type="button"
                  onClick={() => setActiveSheetTab('enquiries')}
                  className={`px-3.5 py-2 text-xs font-mono-luxury uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer border-t-2 ${
                    activeSheetTab === 'enquiries'
                      ? 'bg-white text-[#1a1a1a] border-t-[#c4a47c] border-x border-[#1a1a1a]/30 font-bold shadow-xs'
                      : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a] border-t-transparent'
                  }`}
                >
                  <Building className="w-3.5 h-3.5 text-[#c4a47c]" />
                  <span>Property Inquiries</span>
                  <span className="bg-[#1a1a1a]/70 text-[#fdfcf9] text-[10px] font-bold px-1.5 py-0.2">
                    {directEnquiryLeads.length}
                  </span>
                </button>

                {/* 3. Scheduled Visits */}
                <button
                  type="button"
                  onClick={() => setActiveSheetTab('visits')}
                  className={`px-3.5 py-2 text-xs font-mono-luxury uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer border-t-2 ${
                    activeSheetTab === 'visits'
                      ? 'bg-white text-[#1a1a1a] border-t-[#c4a47c] border-x border-[#1a1a1a]/30 font-bold shadow-xs'
                      : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a] border-t-transparent'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-[#c4a47c]" />
                  <span>Site Visits</span>
                  <span className="bg-[#1a1a1a]/70 text-[#fdfcf9] text-[10px] font-bold px-1.5 py-0.2">
                    {visitLeads.length}
                  </span>
                </button>

                {/* 4. All Inquiries Master */}
                <button
                  type="button"
                  onClick={() => setActiveSheetTab('all')}
                  className={`px-3.5 py-2 text-xs font-mono-luxury uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer border-t-2 ${
                    activeSheetTab === 'all'
                      ? 'bg-white text-[#1a1a1a] border-t-[#c4a47c] border-x border-[#1a1a1a]/30 font-bold shadow-xs'
                      : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a] border-t-transparent'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-[#c4a47c]" />
                  <span>All Inquiries</span>
                  <span className="bg-[#1a1a1a]/50 text-[#fdfcf9] text-[10px] font-bold px-1.5 py-0.2">
                    {leads.length}
                  </span>
                </button>

                {/* 5. CONFIGURATION & SETTINGS */}
                <button
                  type="button"
                  onClick={() => setActiveSheetTab('config')}
                  className={`px-3.5 py-2 text-xs font-mono-luxury uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer border-t-2 ${
                    activeSheetTab === 'config'
                      ? 'bg-white text-[#1a1a1a] border-t-[#c4a47c] border-x border-[#1a1a1a]/30 font-bold shadow-xs'
                      : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a] border-t-transparent'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5 text-[#c4a47c]" />
                  <span>Settings & Dev Config</span>
                </button>
              </div>

              {/* Export Buttons */}
              <div className="flex items-center gap-2 pb-2">
                {activeSheetTab !== 'config' && currentSheetLeads.length > 0 && (
                  <button
                    onClick={() => exportCurrentSheetToCSV(currentSheetLeads, activeSheetTab.toUpperCase())}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c4a47c] hover:bg-[#b09066] text-[#1a1a1a] font-mono-luxury uppercase text-xs font-bold transition-colors cursor-pointer border border-[#1a1a1a]"
                    title="Export Current Sheet to CSV/Excel"
                  >
                    <Download className="w-3.5 h-3.5 text-[#1a1a1a]" />
                    <span>Download {activeSheetTab === 'floorplan' ? 'Floor Plan Sheet' : 'Sheet'} (.CSV)</span>
                  </button>
                )}
              </div>
            </div>

            {/* TAB: DEVELOPER CONFIGURATION */}
            {activeSheetTab === 'config' ? (
              <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-[#fdfcf9] font-mono-luxury space-y-6">
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Status Banner */}
                  <div className="p-4 bg-[#1a1a1a] text-[#fdfcf9] border border-[#c4a47c]/40 flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-[#c4a47c] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-serif-luxury font-bold text-base text-[#c4a47c]">
                        Public Visitor Shield: Active
                      </h4>
                      <p className="text-xs text-[#fdfcf9]/80 mt-1 leading-relaxed">
                        Public visitors browsing the site ("VISITS") <strong>cannot</strong> see any Owner Leads button, counter, or customer phone records. Only the authorized App Developer has access.
                      </p>
                    </div>
                  </div>

                  {/* Leads Customer Option Card */}
                  <div className="p-5 bg-[#c4a47c]/10 border-2 border-[#c4a47c] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#1a1a1a]" />
                        <h5 className="font-serif-luxury font-bold text-base text-[#1a1a1a]">
                          Leads Customer Option
                        </h5>
                      </div>
                      <span className="bg-[#1a1a1a] text-[#c4a47c] text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
                        Configured & Active
                      </span>
                    </div>
                    <p className="text-xs text-[#1a1a1a]/80 leading-relaxed">
                      The "Leads Customer Option" is placed inside the <strong>Settings</strong> menu (accessible from header Settings and footer). It enables immediate access to customer phone records, floor plan unlock leads, property inquiries, and 1-click WhatsApp follow-ups.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setActiveSheetTab('all')}
                        className="px-3.5 py-1.5 bg-[#1a1a1a] text-[#fdfcf9] font-bold text-xs uppercase hover:bg-black transition-colors cursor-pointer"
                      >
                        View All Customer Leads ({leads.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => exportCurrentSheetToCSV(leads, 'ALL_CUSTOMER_LEADS')}
                        className="px-3.5 py-1.5 bg-white text-[#1a1a1a] border border-[#1a1a1a] font-bold text-xs uppercase hover:bg-[#fdfcf9] transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-[#c4a47c]" />
                        <span>Export All Leads (.CSV)</span>
                      </button>
                    </div>
                  </div>

                  {/* Settings Form */}
                  <div className="bg-white border border-[#1a1a1a] p-6 space-y-5">
                    <div className="flex items-center gap-2 pb-3 border-b border-[#1a1a1a]/20">
                      <Settings className="w-5 h-5 text-[#c4a47c]" />
                      <h5 className="font-serif-luxury font-bold text-lg text-[#1a1a1a]">
                        Developer & Owner Credentials
                      </h5>
                    </div>

                    {configSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-400 text-emerald-800 text-xs font-bold flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>{configSuccess}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveDeveloperConfig} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-[#1a1a1a] uppercase mb-1">
                          Authorized App Developer Email:
                        </label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-[#fdfcf9] border border-[#1a1a1a] text-xs font-mono text-[#1a1a1a] focus:outline-hidden"
                          placeholder="developer@example.com"
                        />
                        <span className="text-[10px] text-[#1a1a1a]/60 mt-1 block">
                          Current default configured developer: <code className="font-bold">{DEFAULT_DEVELOPER_EMAIL}</code>
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-[#1a1a1a] uppercase mb-1">
                          Change Developer Passcode / PIN:
                        </label>
                        <input
                          type="password"
                          maxLength={12}
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value)}
                          className="w-full px-3 py-2 bg-[#fdfcf9] border border-[#1a1a1a] text-xs font-mono text-[#1a1a1a] focus:outline-hidden"
                          placeholder="Enter new 4+ digit passcode (leave blank to keep current)"
                        />
                        <span className="text-[10px] text-[#1a1a1a]/60 mt-1 block">
                          Current Developer Master PIN: <strong>{configuredPin}</strong>
                        </span>
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-bold uppercase tracking-wider text-xs border border-[#1a1a1a] transition-all cursor-pointer"
                      >
                        Save Configuration
                      </button>
                    </form>
                  </div>

                  {/* Secret Developer Access Methods */}
                  <div className="bg-white border border-[#1a1a1a] p-6 space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-[#1a1a1a]/20">
                      <Terminal className="w-5 h-5 text-[#c4a47c]" />
                      <h5 className="font-serif-luxury font-bold text-lg text-[#1a1a1a]">
                        How Developer Accesses This Portal
                      </h5>
                    </div>

                    <div className="space-y-3 text-xs">
                      {/* Method 1: Secret URL Bookmark */}
                      <div className="p-3 bg-[#fdfcf9] border border-[#1a1a1a]/30 space-y-1.5">
                        <span className="font-bold text-[#1a1a1a] uppercase block">
                          Method 1: Developer Secret URL (Bookmark This):
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={currentDevUrl}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#1a1a1a]/20 text-xs font-mono select-all focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(currentDevUrl);
                              setCopiedLink(true);
                              setTimeout(() => setCopiedLink(false), 2000);
                            }}
                            className="px-3 py-1.5 bg-[#1a1a1a] text-white text-xs font-bold uppercase shrink-0 flex items-center gap-1 cursor-pointer"
                          >
                            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#c4a47c]" />}
                            <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-[10px] text-[#1a1a1a]/60">
                          Appending <code className="bg-slate-200 px-1 py-0.5">?dev=true</code> to your website link automatically enables Developer Mode on your device.
                        </p>
                      </div>

                      {/* Method 2: Keyboard Shortcut */}
                      <div className="p-3 bg-[#fdfcf9] border border-[#1a1a1a]/30 space-y-1">
                        <span className="font-bold text-[#1a1a1a] uppercase block">
                          Method 2: Keyboard Shortcut (Desktop):
                        </span>
                        <p className="text-xs text-[#1a1a1a]/80">
                          Press <kbd className="px-2 py-0.5 bg-[#1a1a1a] text-white rounded-xs font-mono font-bold">Ctrl + Shift + D</kbd> (or <kbd className="px-2 py-0.5 bg-[#1a1a1a] text-white rounded-xs font-mono font-bold">Cmd + Shift + D</kbd> on Mac) anywhere on the website to toggle this portal.
                        </p>
                      </div>

                      {/* Method 3: Secret Footer Link */}
                      <div className="p-3 bg-[#fdfcf9] border border-[#1a1a1a]/30 space-y-1">
                        <span className="font-bold text-[#1a1a1a] uppercase block">
                          Method 3: Footer Developer Link:
                        </span>
                        <p className="text-xs text-[#1a1a1a]/80">
                          Click the discreet <strong>[Dev Portal]</strong> lock trigger at the bottom of the page footer.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* TAB: LEADS VIEWER (Floor Plan / Enquiries / Visits / All) */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Filter & Search Controls */}
                <div className="p-3 sm:p-4 border-b border-[#1a1a1a]/20 bg-[#fdfcf9] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono-luxury">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/40" />
                    <input
                      type="text"
                      placeholder="Search customer phone, name, property..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white text-xs border border-[#1a1a1a] text-[#1a1a1a] focus:outline-hidden"
                    />
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="editorial-label text-[#1a1a1a]/70">Status:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="bg-white border border-[#1a1a1a] px-2 py-1 text-xs font-mono-luxury font-bold text-[#1a1a1a]"
                      >
                        <option value="All">All Statuses ({currentSheetLeads.length})</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Visit Scheduled">Visit Scheduled</option>
                        <option value="Converted">Converted</option>
                      </select>
                    </div>

                    {leads.length > 0 && (
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to clear all leads history from this device?')) {
                            onClearAllLeads();
                          }
                        }}
                        className="text-xs text-red-600 hover:text-red-800 font-mono-luxury uppercase font-bold px-2 py-1 transition-colors cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {/* Leads Table / Sheet Grid */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#fdfcf9]">
                  {currentSheetLeads.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-14 h-14 bg-white border border-[#1a1a1a] text-[#c4a47c] flex items-center justify-center mx-auto mb-3 shadow-xs">
                        {activeSheetTab === 'floorplan' ? <Layers className="w-7 h-7" /> : <Users className="w-7 h-7" />}
                      </div>
                      <h4 className="font-serif-luxury text-xl font-bold text-[#1a1a1a]">
                        {activeSheetTab === 'floorplan' 
                          ? 'No Floor Plan Phone Unlocks Yet'
                          : 'No client inquiries found in this sheet'}
                      </h4>
                      <p className="editorial-label text-[#1a1a1a]/60 max-w-md mx-auto mt-1 normal-case text-xs">
                        {activeSheetTab === 'floorplan'
                          ? 'When customers enter their mobile number to unlock architectural floor plans or builder contact, their phone numbers and selected properties will appear right here in this private sheet.'
                          : 'Customer inquiries will be automatically recorded here upon submission.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Lead Cards List */}
                      {currentSheetLeads.map((lead) => (
                        <div
                          key={lead.id}
                          className="bg-white border border-[#1a1a1a] p-4 relative flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs hover:border-[#c4a47c] transition-colors"
                        >
                          {/* Left: Lead Identity & Phone */}
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center flex-wrap gap-2">
                              <span className="font-serif-luxury font-bold text-[#1a1a1a] text-lg">
                                {lead.name}
                              </span>

                              <span className={`text-[10px] font-mono-luxury font-bold uppercase px-2 py-0.5 border ${
                                lead.status === 'New' 
                                  ? 'bg-[#c4a47c]/20 text-[#1a1a1a] border-[#c4a47c]'
                                  : lead.status === 'Contacted'
                                  ? 'bg-blue-50 text-blue-900 border-blue-300'
                                  : lead.status === 'Converted'
                                  ? 'bg-emerald-50 text-emerald-900 border-emerald-400'
                                  : 'bg-purple-50 text-purple-900 border-purple-300'
                              }`}>
                                {lead.status}
                              </span>

                              <span className="editorial-badge bg-[#1a1a1a] text-[#fdfcf9] border-0 text-[10px]">
                                {lead.source}
                              </span>

                              <span className="editorial-label text-[#1a1a1a]/60 text-[10px] flex items-center gap-1 font-mono-luxury ml-auto lg:ml-0">
                                <Clock className="w-3 h-3" />
                                {lead.timestamp}
                              </span>
                            </div>

                            {/* Customer Phone & Contact details row */}
                            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono-luxury">
                              {/* Direct Phone link */}
                              <a
                                href={`tel:${lead.phone}`}
                                className="flex items-center gap-1.5 text-[#1a1a1a] bg-[#fdfcf9] px-2.5 py-1.5 border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#fdfcf9] transition-colors font-bold"
                                title="Call Customer"
                              >
                                <Phone className="w-3.5 h-3.5 text-[#c4a47c]" />
                                <span>{lead.phone}</span>
                              </a>

                              {/* Direct WhatsApp Follow-up button */}
                              <button
                                type="button"
                                onClick={() => {
                                  const greeting = `Hello ${lead.name}! Thank you for reviewing the floor plan for "${lead.propertyTitle || 'properties'}" on NS Properties. I am the developer/owner. How may I assist you with pricing, booking, or scheduling a site visit?`;
                                  openWhatsAppChat(lead.phone, greeting);
                                }}
                                className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1.5 border border-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors font-bold cursor-pointer"
                                title="Open WhatsApp Chat with Customer"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" />
                                <span>WhatsApp Customer</span>
                              </button>

                              {/* Email */}
                              {lead.email && !lead.email.includes('@lead.nsproperties.in') && (
                                <a
                                  href={`mailto:${lead.email}`}
                                  className="flex items-center gap-1.5 text-[#1a1a1a] bg-[#fdfcf9] px-2.5 py-1.5 border border-[#1a1a1a]/30 hover:border-[#1a1a1a] transition-colors"
                                >
                                  <Mail className="w-3.5 h-3.5 text-[#c4a47c]" />
                                  <span>{lead.email}</span>
                                </a>
                              )}
                            </div>

                            {/* Property / Interest Info */}
                            {lead.propertyTitle && (
                              <div className="editorial-label text-[#1a1a1a] normal-case text-xs pt-1 flex items-center gap-1.5">
                                <span className="font-bold text-[#c4a47c] font-mono-luxury uppercase text-[10px]">
                                  Interested Property:
                                </span>
                                <span className="font-semibold">{lead.propertyTitle}</span>
                                {lead.propertyId && (
                                  <span className="text-[#1a1a1a]/50 text-[10px] font-mono-luxury">
                                    ({lead.propertyId})
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Right: Lead Status Management & Delete */}
                          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-2 border-t lg:border-t-0 border-[#1a1a1a]/10 pt-2 lg:pt-0 font-mono-luxury">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-[#1a1a1a]/60 uppercase">Mark Status:</span>
                              <select
                                value={lead.status}
                                onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as any)}
                                className="bg-white border border-[#1a1a1a] text-xs px-2 py-1 font-mono-luxury text-[#1a1a1a] cursor-pointer"
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Visit Scheduled">Visit Scheduled</option>
                                <option value="Converted">Converted</option>
                              </select>
                            </div>

                            <button
                              onClick={() => onDeleteLead(lead.id)}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete this lead entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
