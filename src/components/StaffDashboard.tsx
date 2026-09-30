import React, { useState } from 'react';
import { 
  Users, 
  CalendarCheck, 
  Building2, 
  UserPlus, 
  Search, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ChevronRight, 
  X, 
  ShieldCheck, 
  Filter, 
  FileText,
  AlertCircle,
  ExternalLink,
  PhoneCall,
  Tag,
  Percent,
  Share2,
  Copy,
  Lock,
  Sparkles
} from 'lucide-react';
import { VisitorLead, Property, SiteVisitRequest, Offer, OfferEnquiry } from '../types';
import { openWhatsAppChat, DEFAULT_CONTACT_PHONE } from '../utils/whatsapp';
import { formatIndianCurrency } from '../utils/formatters';
import { isOfferActiveAndValid, calculateOfferPrice } from '../data/plansOffersData';

interface StaffDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  leads: VisitorLead[];
  onUpdateLeadStatus: (id: string, status: VisitorLead['status']) => void;
  onAddLead: (lead: VisitorLead) => void;
  siteVisits: SiteVisitRequest[];
  onConfirmVisit: (visit: SiteVisitRequest) => void;
  properties: Property[];
  onSelectProperty?: (property: Property) => void;
  staffName?: string;
  onLogout?: () => void;
  offers?: Offer[];
  offerEnquiries?: OfferEnquiry[];
  onUpdateOfferEnquiryStatus?: (id: string, status: OfferEnquiry['status']) => void;
  onViewOfferDetails?: (offer: Offer) => void;
}

type StaffTab = 'leads' | 'visits' | 'inventory' | 'offers' | 'register_client';

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  isOpen,
  onClose,
  leads,
  onUpdateLeadStatus,
  onAddLead,
  siteVisits,
  onConfirmVisit,
  properties,
  onSelectProperty,
  staffName = 'Vikram Aditya (Senior Relationship Manager)',
  onLogout,
  offers = [],
  offerEnquiries = [],
  onUpdateOfferEnquiryStatus = () => {},
  onViewOfferDetails
}) => {
  const [activeTab, setActiveTab] = useState<StaffTab>('leads');
  const [leadFilterStatus, setLeadFilterStatus] = useState<string>('all');
  const [leadSearch, setLeadSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');
  const [feedbackNotes, setFeedbackNotes] = useState<Record<string, string>>({});
  const [activeNoteLeadId, setActiveNoteLeadId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  // Walk-in Client Form State
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinEmail, setWalkinEmail] = useState('');
  const [walkinPurpose, setWalkinPurpose] = useState<'Buy' | 'Rent' | 'Invest'>('Buy');
  const [walkinBudget, setWalkinBudget] = useState('₹ 1.0 Cr - ₹ 2.0 Cr');
  const [walkinPropertyId, setWalkinPropertyId] = useState('');
  const [walkinNotes, setWalkinNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    if (leadFilterStatus !== 'all' && lead.status !== leadFilterStatus) return false;
    if (leadSearch) {
      const q = leadSearch.toLowerCase();
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        (lead.email && lead.email.toLowerCase().includes(q)) ||
        (lead.propertyTitle && lead.propertyTitle.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filtered Properties for inventory search
  const filteredProperties = properties.filter((prop) => {
    if (!inventorySearch) return true;
    const q = inventorySearch.toLowerCase();
    return (
      prop.title.toLowerCase().includes(q) ||
      prop.city.toLowerCase().includes(q) ||
      prop.locality.toLowerCase().includes(q) ||
      prop.type.toLowerCase().includes(q)
    );
  });

  const handleSaveNote = (leadId: string) => {
    if (!tempNote.trim()) return;
    setFeedbackNotes((prev) => ({
      ...prev,
      [leadId]: tempNote.trim()
    }));
    setActiveNoteLeadId(null);
    setTempNote('');
    setSuccessMessage('Lead interaction note saved successfully.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleWalkinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim() || !walkinPhone.trim()) return;

    const matchedProp = properties.find((p) => p.id === walkinPropertyId);

    const newLead: VisitorLead = {
      id: `lead-staff-${Date.now()}`,
      name: walkinName.trim(),
      phone: walkinPhone.trim(),
      email: walkinEmail.trim() || `${walkinPhone.replace(/\D/g, '')}@walkin.nsproperties.in`,
      purpose: walkinPurpose,
      preferredCity: matchedProp?.city || 'Bangalore',
      budget: walkinBudget,
      propertyTitle: matchedProp?.title || 'General Portfolio Walk-in',
      propertyId: matchedProp?.id,
      timestamp: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      source: 'Staff Walk-in Desk',
      status: 'Contacted',
      notes: walkinNotes.trim() ? `Staff Walk-in: ${walkinNotes.trim()}` : undefined
    };

    onAddLead(newLead);
    setWalkinName('');
    setWalkinPhone('');
    setWalkinEmail('');
    setWalkinNotes('');
    setSuccessMessage(`Client ${newLead.name} successfully registered in active lead pipeline!`);
    setTimeout(() => setSuccessMessage(''), 4000);
    setActiveTab('leads');
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-6xl bg-[#fdfcf9] border-2 border-[#1a1a1a] shadow-2xl overflow-hidden my-auto max-h-[96vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-emerald-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-emerald-400 bg-emerald-950/60 flex items-center justify-center text-emerald-400 font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-tight text-[#fdfcf9]">
                  Staff & Relationship Manager Dashboard
                </h2>
                <span className="bg-emerald-500 text-black font-mono-luxury text-[10px] font-black px-2 py-0.5 uppercase tracking-wider">
                  AUTHORIZED STAFF
                </span>
                <span className="bg-white/10 text-white/90 text-[10px] font-mono-luxury uppercase px-2 py-0.5 border border-white/20">
                  {staffName}
                </span>
              </div>
              <p className="font-mono-luxury text-white/60 text-xs">
                Operational Pipeline: Customer Inquiries • Site Visits • Property Inventory • Walk-in Registrations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-500/50 font-mono-luxury text-xs uppercase font-bold transition-all cursor-pointer"
                title="Log out from Staff session"
              >
                Logout Staff
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="bg-emerald-100 border-b border-emerald-300 text-emerald-900 px-6 py-2 text-xs font-mono-luxury flex items-center justify-between">
            <span className="font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {successMessage}
            </span>
            <button onClick={() => setSuccessMessage('')} className="text-emerald-700 hover:text-black font-bold">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* KPI Summary Strip */}
        <div className="bg-white border-b border-[#1a1a1a]/15 px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="border-l-2 border-emerald-500 pl-3">
            <span className="text-[10px] font-mono-luxury uppercase text-[#1a1a1a]/60 block">Assigned Leads</span>
            <span className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1a1a1a]">
              {leads.length}
            </span>
          </div>
          <div className="border-l-2 border-blue-500 pl-3">
            <span className="text-[10px] font-mono-luxury uppercase text-[#1a1a1a]/60 block">Site Visits Booked</span>
            <span className="font-serif-luxury text-xl sm:text-2xl font-bold text-blue-700">
              {siteVisits.length}
            </span>
          </div>
          <div className="border-l-2 border-amber-500 pl-3">
            <span className="text-[10px] font-mono-luxury uppercase text-[#1a1a1a]/60 block">Active Inventory</span>
            <span className="font-serif-luxury text-xl sm:text-2xl font-bold text-amber-700">
              {properties.length} Units
            </span>
          </div>
          <div className="border-l-2 border-purple-500 pl-3">
            <span className="text-[10px] font-mono-luxury uppercase text-[#1a1a1a]/60 block">Daily Status</span>
            <span className="font-mono-luxury text-xs font-bold text-emerald-700 flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              On Duty / Active
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#fdfcf9] border-b border-[#1a1a1a] px-6 flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2.5 font-mono-luxury text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'leads'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-[#1a1a1a]/70 hover:text-black hover:bg-[#1a1a1a]/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Assigned Leads ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('visits')}
            className={`px-4 py-2.5 font-mono-luxury text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'visits'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-[#1a1a1a]/70 hover:text-black hover:bg-[#1a1a1a]/5'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Site Visits ({siteVisits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 font-mono-luxury text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'inventory'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-[#1a1a1a]/70 hover:text-black hover:bg-[#1a1a1a]/5'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Property Catalog ({properties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2.5 font-mono-luxury text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'offers'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-[#1a1a1a]/70 hover:text-black hover:bg-[#1a1a1a]/5'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span>Active Offers & Share ({offers.filter(isOfferActiveAndValid).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('register_client')}
            className={`px-4 py-2.5 font-mono-luxury text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'register_client'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-[#1a1a1a]/70 hover:text-black hover:bg-[#1a1a1a]/5'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Register Walk-In Client</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: LEADS MANAGEMENT */}
          {activeTab === 'leads' && (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="bg-white p-3 border border-[#1a1a1a]/20 flex flex-wrap items-center justify-between gap-3 font-mono-luxury text-xs">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-[#1a1a1a]/40" />
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder="Search client by name, phone, email, or property..."
                    className="w-full bg-transparent border-0 focus:outline-hidden text-xs"
                  />
                  {leadSearch && (
                    <button onClick={() => setLeadSearch('')} className="text-gray-400 hover:text-black">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[#1a1a1a]/60 uppercase text-[10px] font-bold">Status:</span>
                  {['all', 'New', 'Contacted', 'Visit Scheduled', 'Converted'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setLeadFilterStatus(st)}
                      className={`px-2.5 py-1 text-[11px] font-bold uppercase cursor-pointer border ${
                        leadFilterStatus === st
                          ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                          : 'bg-white text-[#1a1a1a]/70 border-[#1a1a1a]/20 hover:border-black'
                      }`}
                    >
                      {st === 'all' ? 'All Leads' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leads List */}
              {filteredLeads.length === 0 ? (
                <div className="bg-white border border-[#1a1a1a]/20 p-12 text-center">
                  <Users className="w-12 h-12 text-[#1a1a1a]/30 mx-auto mb-3" />
                  <p className="font-serif-luxury text-base font-bold text-[#1a1a1a]">No matching client leads found</p>
                  <p className="font-mono-luxury text-xs text-[#1a1a1a]/60 mt-1">
                    Try adjusting your search criteria or register a new walk-in client.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredLeads.map((lead) => {
                    const clientMsg = `Hello ${lead.name}, this is ${staffName} from NS Properties. I am reaching out regarding your inquiry on ${lead.propertyTitle || 'properties with us'}. How may I assist you with details or a private site tour?`;
                    const hasNote = feedbackNotes[lead.id];

                    return (
                      <div 
                        key={lead.id} 
                        className="bg-white border border-[#1a1a1a]/20 p-4 hover:border-[#1a1a1a] transition-all shadow-xs"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                                {lead.name}
                              </h3>
                              <span className={`text-[10px] font-mono-luxury uppercase font-bold px-2 py-0.5 border ${
                                lead.status === 'New' 
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : lead.status === 'Contacted'
                                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                                  : lead.status === 'Visit Scheduled'
                                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                                  : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              }`}>
                                {lead.status}
                              </span>
                              <span className="text-[10px] font-mono-luxury text-[#1a1a1a]/50">
                                {lead.timestamp}
                              </span>
                            </div>

                            <p className="font-mono-luxury text-xs text-[#1a1a1a]/80 mt-1">
                              <strong>Property:</strong> {lead.propertyTitle || 'General Inquiry'} •{' '}
                              <strong>Budget:</strong> {lead.budget || 'Not specified'} •{' '}
                              <strong>Purpose:</strong> {lead.purpose}
                            </p>

                            <div className="flex items-center gap-4 mt-2 font-mono-luxury text-xs text-[#1a1a1a]/70">
                              <span className="flex items-center gap-1 font-bold text-black">
                                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                {lead.phone}
                              </span>
                              {lead.email && (
                                <span className="text-[#1a1a1a]/60">
                                  {lead.email}
                                </span>
                              )}
                              <span className="text-[10px] bg-[#1a1a1a]/5 px-2 py-0.5">
                                Source: {lead.source}
                              </span>
                            </div>

                            {(lead.notes || hasNote) && (
                              <div className="mt-2.5 p-2 bg-[#fdfcf9] border border-[#1a1a1a]/15 text-xs font-mono-luxury text-[#1a1a1a]/80">
                                <strong>Staff Notes:</strong> {hasNote || lead.notes}
                              </div>
                            )}
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => openWhatsAppChat(lead.phone, clientMsg)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono-luxury text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </button>

                            <a
                              href={`tel:${lead.phone}`}
                              className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-black text-white font-mono-luxury text-xs font-bold uppercase flex items-center gap-1.5 transition-colors"
                              title="Call Client"
                            >
                              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Call</span>
                            </a>

                            {/* Status Changer */}
                            <select
                              value={lead.status}
                              onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as VisitorLead['status'])}
                              className="px-2.5 py-1.5 bg-white border border-[#1a1a1a] text-xs font-mono-luxury font-bold uppercase cursor-pointer"
                            >
                              <option value="New">Mark New</option>
                              <option value="Contacted">Mark Contacted</option>
                              <option value="Visit Scheduled">Visit Scheduled</option>
                              <option value="Converted">Mark Converted</option>
                            </select>

                            <button
                              onClick={() => {
                                setActiveNoteLeadId(lead.id);
                                setTempNote(hasNote || lead.notes || '');
                              }}
                              className="px-2.5 py-1.5 bg-white border border-[#1a1a1a]/30 hover:border-black text-xs font-mono-luxury uppercase cursor-pointer"
                              title="Add Note"
                            >
                              + Note
                            </button>
                          </div>
                        </div>

                        {/* Interactive Note Drawer */}
                        {activeNoteLeadId === lead.id && (
                          <div className="mt-3 pt-3 border-t border-[#1a1a1a]/15 flex items-center gap-2">
                            <input
                              type="text"
                              value={tempNote}
                              onChange={(e) => setTempNote(e.target.value)}
                              placeholder="Enter follow-up conversation notes / requirements..."
                              className="flex-1 px-3 py-1.5 border border-[#1a1a1a] text-xs font-mono-luxury bg-white"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveNote(lead.id)}
                              className="px-3 py-1.5 bg-[#1a1a1a] text-white font-mono-luxury text-xs font-bold uppercase cursor-pointer"
                            >
                              Save Note
                            </button>
                            <button
                              onClick={() => setActiveNoteLeadId(null)}
                              className="px-2 py-1.5 text-gray-500 hover:text-black text-xs font-mono-luxury cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SITE VISITS MANAGEMENT */}
          {activeTab === 'visits' && (
            <div className="space-y-4">
              <div className="bg-white border border-[#1a1a1a]/20 p-4">
                <h3 className="font-serif-luxury text-lg font-bold text-[#1a1a1a] mb-1">
                  Scheduled Site Visits
                </h3>
                <p className="font-mono-luxury text-xs text-[#1a1a1a]/60">
                  Track client field tours, confirm property access with owners/security, and follow up post-tour.
                </p>
              </div>

              {siteVisits.length === 0 ? (
                <div className="bg-white border border-[#1a1a1a]/20 p-12 text-center">
                  <CalendarCheck className="w-12 h-12 text-[#1a1a1a]/30 mx-auto mb-3" />
                  <p className="font-serif-luxury text-base font-bold text-[#1a1a1a]">No scheduled visits recorded</p>
                  <p className="font-mono-luxury text-xs text-[#1a1a1a]/60 mt-1">
                    Clients requesting site tours through the portal will appear directly here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {siteVisits.map((visit) => {
                    const clientMsg = `Hello ${visit.name}, this is ${staffName} from NS Properties confirming your site visit for ${visit.propertyTitle} scheduled on ${visit.date} at ${visit.timeSlot}. Our field executive will receive you at the property.`;

                    return (
                      <div key={visit.id} className="bg-white border border-[#1a1a1a] p-4 flex flex-col justify-between shadow-xs">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-mono-luxury text-[10px] uppercase font-bold bg-[#1a1a1a] text-white px-2 py-0.5">
                              {visit.status}
                            </span>
                            <span className="font-mono-luxury text-xs text-[#1a1a1a]/60 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-emerald-600" />
                              {visit.date} ({visit.timeSlot})
                            </span>
                          </div>

                          <h4 className="font-serif-luxury font-bold text-base text-[#1a1a1a]">
                            {visit.propertyTitle}
                          </h4>

                          <div className="mt-2 space-y-1 font-mono-luxury text-xs text-[#1a1a1a]/80">
                            <p><strong>Client:</strong> {visit.name}</p>
                            <p><strong>Phone:</strong> {visit.phone}</p>
                            {visit.email && <p><strong>Email:</strong> {visit.email}</p>}
                            {visit.notes && (
                              <p className="bg-[#fdfcf9] p-2 border border-[#1a1a1a]/15 mt-2 italic text-[#1a1a1a]/70">
                                "{visit.notes}"
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#1a1a1a]/15 flex items-center justify-between gap-2 flex-wrap">
                          <button
                            onClick={() => openWhatsAppChat(visit.phone, clientMsg)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono-luxury text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp Tour Info</span>
                          </button>

                          <a
                            href={`tel:${visit.phone}`}
                            className="px-3 py-1.5 bg-[#1a1a1a] text-white font-mono-luxury text-xs font-bold uppercase flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-emerald-400" />
                            <span>Call</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROPERTY CATALOG */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="bg-white p-3 border border-[#1a1a1a]/20 flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="Quick search property inventory by title, city, or locality..."
                  className="w-full bg-transparent border-0 focus:outline-hidden font-mono-luxury text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProperties.map((prop) => (
                  <div key={prop.id} className="bg-white border border-[#1a1a1a] flex flex-col justify-between p-3 shadow-xs">
                    <div>
                      {prop.images && prop.images[0] && (
                        <div className="h-32 w-full overflow-hidden bg-gray-100 mb-2">
                          <img
                            src={prop.images[0]}
                            alt={prop.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between text-[10px] font-mono-luxury text-[#1a1a1a]/60 uppercase mb-1">
                        <span>{prop.city} • {prop.locality}</span>
                        <span className="font-bold text-emerald-700">{prop.purpose === 'buy' ? 'For Sale' : 'For Rent'}</span>
                      </div>
                      <h4 className="font-serif-luxury font-bold text-sm text-[#1a1a1a] line-clamp-1">
                        {prop.title}
                      </h4>
                      <p className="font-mono-luxury text-xs font-bold text-[#c4a47c] mt-1">
                        {prop.priceDisplay}
                      </p>
                      <p className="font-mono-luxury text-[11px] text-[#1a1a1a]/70 mt-1">
                        {prop.bhk > 0 ? `${prop.bhk} BHK • ` : ''}{prop.areaSqFt} Sq.Ft • {prop.furnishing}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#1a1a1a]/15 flex items-center justify-between">
                      <span className="text-[10px] font-mono-luxury text-emerald-700 font-bold">
                        {prop.isVerified ? 'Verified Listing' : 'Standard Listing'}
                      </span>
                      {onSelectProperty && (
                        <button
                          onClick={() => {
                            onClose();
                            onSelectProperty(prop);
                          }}
                          className="px-2 py-1 bg-[#1a1a1a] text-white text-[10px] font-mono-luxury uppercase font-bold hover:bg-black cursor-pointer"
                        >
                          View Details →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REGISTER WALK-IN CLIENT */}
          {activeTab === 'register_client' && (
            <div className="max-w-2xl mx-auto bg-white border-2 border-[#1a1a1a] p-6 shadow-md">
              <div className="border-b border-[#1a1a1a]/15 pb-4 mb-5">
                <h3 className="font-serif-luxury text-xl font-bold text-[#1a1a1a]">
                  Register Walk-in / Phone Client
                </h3>
                <p className="font-mono-luxury text-xs text-[#1a1a1a]/60 mt-1">
                  Add visiting clients or telephone inquiries directly into the NS Properties active pipeline.
                </p>
              </div>

              <form onSubmit={handleWalkinSubmit} className="space-y-4 font-mono-luxury text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#1a1a1a] mb-1 uppercase">Client Full Name *</label>
                    <input
                      type="text"
                      required
                      value={walkinName}
                      onChange={(e) => setWalkinName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full px-3 py-2 border border-[#1a1a1a] bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#1a1a1a] mb-1 uppercase">Mobile Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={walkinPhone}
                      onChange={(e) => setWalkinPhone(e.target.value)}
                      placeholder="+91 98450 12345"
                      className="w-full px-3 py-2 border border-[#1a1a1a] bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#1a1a1a] mb-1 uppercase">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={walkinEmail}
                      onChange={(e) => setWalkinEmail(e.target.value)}
                      placeholder="client@gmail.com"
                      className="w-full px-3 py-2 border border-[#1a1a1a] bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#1a1a1a] mb-1 uppercase">Requirement Type</label>
                    <select
                      value={walkinPurpose}
                      onChange={(e) => setWalkinPurpose(e.target.value as any)}
                      className="w-full px-3 py-2 border border-[#1a1a1a] bg-white font-bold cursor-pointer"
                    >
                      <option value="Buy">Looking to Buy Property</option>
                      <option value="Rent">Looking to Rent Home</option>
                      <option value="Invest">Commercial / Plot Investment</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#1a1a1a] mb-1 uppercase">Budget Range</label>
                    <select
                      value={walkinBudget}
                      onChange={(e) => setWalkinBudget(e.target.value)}
                      className="w-full px-3 py-2 border border-[#1a1a1a] bg-white font-bold cursor-pointer"
                    >
                      <option value="Under ₹ 50 Lakhs">Under ₹ 50 Lakhs</option>
                      <option value="₹ 50 Lakhs - ₹ 1.0 Crore">₹ 50 Lakhs - ₹ 1.0 Crore</option>
                      <option value="₹ 1.0 Cr - ₹ 2.5 Crore">₹ 1.0 Cr - ₹ 2.5 Crore</option>
                      <option value="₹ 2.5 Crore - ₹ 5.0 Crore">₹ 2.5 Crore - ₹ 5.0 Crore</option>
                      <option value="₹ 5.0 Crore+ Ultra Luxury">₹ 5.0 Crore+ Ultra Luxury</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-[#1a1a1a] mb-1 uppercase">Specific Property Interested (Optional)</label>
                    <select
                      value={walkinPropertyId}
                      onChange={(e) => setWalkinPropertyId(e.target.value)}
                      className="w-full px-3 py-2 border border-[#1a1a1a] bg-white cursor-pointer"
                    >
                      <option value="">General Portfolio / Open Requirement</option>
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.city}) - {p.priceDisplay}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#1a1a1a] mb-1 uppercase">Initial Conversation Notes</label>
                  <textarea
                    rows={3}
                    value={walkinNotes}
                    onChange={(e) => setWalkinNotes(e.target.value)}
                    placeholder="e.g. Needs high-floor East-facing unit with possession by Diwali 2026. Prefers Whitefield or Sarjapur..."
                    className="w-full px-3 py-2 border border-[#1a1a1a] bg-white focus:outline-hidden"
                  />
                </div>

                <div className="pt-3 border-t border-[#1a1a1a]/15 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('leads')}
                    className="px-4 py-2 border border-[#1a1a1a] text-[#1a1a1a] font-bold uppercase hover:bg-black/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider cursor-pointer shadow-sm"
                  >
                    Save & Add to Lead Pipeline
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: ACTIVE OFFERS & SHARE WITH CLIENTS (Requirement 4) */}
          {activeTab === 'offers' && (
            <div className="space-y-6">
              
              {/* Staff Security Restriction Banner (Requirement 4) */}
              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 flex items-start gap-3">
                <Lock className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif-luxury font-bold text-sm text-emerald-950">
                      Staff Access: Promotional Deal Catalog & Customer Sharing
                    </h4>
                    <span className="bg-emerald-200 text-emerald-900 text-[9px] font-black px-1.5 py-0.2 uppercase">
                      Read-Only Authority
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900 mt-1 font-sans leading-relaxed">
                    You have view and customer dispatch privileges for active offers. <strong>Staff cannot create, edit, or delete offers.</strong> Discount alterations and campaign terminations are strictly reserved for the App Owner.
                  </p>
                </div>
              </div>

              {/* Active Offers Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <h4 className="font-serif-luxury font-bold text-base text-[#1a1a1a]">
                    Active Promotional Campaigns Available to Pitch
                  </h4>
                  <span className="text-xs text-gray-500 font-mono-luxury">
                    {offers.filter(isOfferActiveAndValid).length} Active Campaigns
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offers.filter(isOfferActiveAndValid).map((offer) => {
                    const applicableList = properties.filter((p) => {
                      if (offer.applicablePropertyIds.includes('ALL')) return true;
                      return offer.applicablePropertyIds.includes(p.id);
                    });

                    const handleShareOfferWhatsApp = (customerPhone?: string) => {
                      const msg = `Hello! Exclusive luxury deal from NS Properties: "${offer.title}" - Save ${offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹ ${(offer.discountValue / 100000).toFixed(0)} Lakhs`} on luxury residences! Valid till ${offer.endDate}. View full details on our portal or reply to book a VIP site visit.`;
                      openWhatsAppChat(customerPhone || DEFAULT_CONTACT_PHONE, msg);
                    };

                    const handleCopyOfferLink = () => {
                      const url = `${window.location.origin}/?offer=${offer.id}`;
                      navigator.clipboard.writeText(`NS Properties Deal: ${offer.title}\nLink: ${url}`);
                      setSuccessMessage(`Copied share link for "${offer.title}"!`);
                      setTimeout(() => setSuccessMessage(''), 3000);
                    };

                    return (
                      <div
                        key={offer.id}
                        className="bg-white border-2 border-[#1a1a1a] p-4 flex flex-col justify-between shadow-xs font-mono-luxury"
                      >
                        <div>
                          <div className="relative h-40 w-full overflow-hidden bg-slate-900 border border-gray-200 mb-3">
                            <img
                              src={offer.bannerImage}
                              alt={offer.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-[#c4a47c] text-black font-black text-[9px] px-2 py-0.5 uppercase border border-black">
                              {offer.discountType === 'percentage'
                                ? `FLAT ${offer.discountValue}% OFF`
                                : `SAVE ₹ ${(offer.discountValue / 100000).toFixed(0)} LAKHS`}
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-0.5">
                              Exp: {offer.endDate}
                            </div>
                          </div>

                          <h5 className="font-serif-luxury font-bold text-base text-[#1a1a1a] line-clamp-1">
                            {offer.title}
                          </h5>

                          <p className="text-xs text-gray-600 mt-1 line-clamp-2 font-sans">
                            {offer.description}
                          </p>

                          <div className="mt-3 pt-2 border-t border-gray-100 text-xs space-y-1">
                            <div className="flex justify-between text-gray-600">
                              <span>Min Token:</span>
                              <strong>{offer.minBookingAmount ? formatIndianCurrency(offer.minBookingAmount) : 'Standard'}</strong>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>Eligible Listings:</span>
                              <strong>{applicableList.length} Properties</strong>
                            </div>
                          </div>
                        </div>

                        {/* Staff Action Buttons */}
                        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => onViewOfferDetails && onViewOfferDetails(offer)}
                            className="px-2.5 py-1.5 text-xs text-[#005CA8] hover:underline font-bold uppercase cursor-pointer"
                          >
                            View Details
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={handleCopyOfferLink}
                              className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer"
                              title="Copy Link"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleShareOfferWhatsApp()}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Share on WhatsApp</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Assigned Offer Enquiries Tracker (Requirement 4) */}
              <div className="bg-white border border-[#1a1a1a]/20 p-5 shadow-xs font-mono-luxury">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-serif-luxury font-bold text-sm uppercase tracking-wider text-[#1a1a1a]">
                      Assigned Offer Inquiries & Customer Follow-ups
                    </h4>
                  </div>
                  <span className="text-xs text-gray-500">
                    {offerEnquiries.length} Inquiries In Queue
                  </span>
                </div>

                {offerEnquiries.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-xs">
                    No offer enquiries currently assigned to your desk.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 text-xs">
                    {offerEnquiries.map((enq) => (
                      <div key={enq.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-black text-sm">{enq.customerName}</strong>
                            <span className="bg-[#c4a47c] text-black text-[9px] font-bold px-1.5 py-0.2 uppercase">
                              {enq.offerTitle}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(enq.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">
                            Phone: <strong className="text-black">{enq.customerPhone}</strong> {enq.customerEmail && `• ${enq.customerEmail}`}
                          </p>
                          <p className="text-[11px] text-gray-500 italic mt-0.5 font-sans">
                            "{enq.message}"
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <select
                            value={enq.status}
                            onChange={(e) => onUpdateOfferEnquiryStatus(enq.id, e.target.value as any)}
                            className="px-2 py-1 border border-gray-300 bg-white text-xs font-bold outline-none cursor-pointer"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Visit Scheduled">Visit Scheduled</option>
                            <option value="Converted">Converted</option>
                            <option value="Closed">Closed</option>
                          </select>

                          <a
                            href={`tel:${enq.customerPhone}`}
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-black cursor-pointer"
                            title="Call Lead"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              const msg = `Hello ${enq.customerName}, following up on your inquiry for "${enq.offerTitle}" on NS Properties. When would be a convenient time for a site visit?`;
                              openWhatsAppChat(enq.customerPhone, msg);
                            }}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                            title="WhatsApp Customer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
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

        {/* Security & Role Demarcation Footer */}
        <div className="bg-[#1a1a1a] text-white/70 px-6 py-3 border-t border-[#1a1a1a] text-[11px] font-mono-luxury flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              Staff Role Demarcation: Operational lead management & site visit logging. Financial books, developer technical console, and staff assignment rights are strictly restricted.
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:underline uppercase text-[10px] font-bold cursor-pointer"
          >
            Close Staff View
          </button>
        </div>
      </div>
    </div>
  );
};
