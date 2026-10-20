import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Heart,
  Eye,
  Phone,
  MessageSquare,
  Lock,
  Bell,
  Star,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Building,
  KeyRound,
  Headphones,
  Sliders,
  Send,
  LogOut,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Trash2,
  Scale,
  CalendarCheck,
  ArrowRight,
  ShieldAlert,
  Smartphone,
  FileText,
  Download,
  Tag
} from 'lucide-react';
import { Property, VisitorLead, Offer, OfferEnquiry } from '../types';
import { AppUserSession, saveActiveSession } from '../utils/appAuthService';
import { DEFAULT_CONTACT_PHONE, DISPLAY_CONTACT_PHONE, openWhatsAppChat } from '../utils/whatsapp';
import { generateProjectBrochurePdf } from '../utils/brochurePdfGenerator';
import { AppProfileLogo } from './AppProfileLogo';

export interface UserAccountHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSession: AppUserSession | null;
  onUpdateSession: (updatedSession: AppUserSession) => void;
  onLogout: () => void;
  properties: Property[];
  savedPropertyIds: string[];
  onToggleSaveProperty: (property: Property) => void;
  viewedPropertyHistory: { propertyId: string; viewedAt: string }[];
  onClearViewedHistory: () => void;
  visitorLeads: VisitorLead[];
  onSelectProperty: (property: Property) => void;
  onOpenScheduleVisit?: (property: Property) => void;
  onOpenCompare?: () => void;
  initialTab?: 'activity' | 'profile' | 'service' | 'feedback' | 'security' | 'communication';
  initialActivitySubTab?: 'contacted' | 'shortlisted' | 'viewed' | 'brochures' | 'offers';
  offers?: Offer[];
  offerEnquiries?: OfferEnquiry[];
}

export const UserAccountHubModal: React.FC<UserAccountHubModalProps> = ({
  isOpen,
  onClose,
  activeSession,
  onUpdateSession,
  onLogout,
  properties,
  savedPropertyIds,
  onToggleSaveProperty,
  viewedPropertyHistory,
  onClearViewedHistory,
  visitorLeads,
  onSelectProperty,
  onOpenScheduleVisit,
  onOpenCompare,
  initialTab = 'activity',
  initialActivitySubTab = 'contacted',
  offers = [],
  offerEnquiries = []
}) => {
  const [activeTab, setActiveTab] = useState<'activity' | 'profile' | 'service' | 'feedback' | 'security' | 'communication'>(initialTab);
  const [activitySubTab, setActivitySubTab] = useState<'contacted' | 'shortlisted' | 'viewed' | 'brochures' | 'offers'>(initialActivitySubTab);
  const [downloadedBrochures, setDownloadedBrochures] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('NS_DOWNLOADED_BROCHURES') || '[]');
    } catch {
      return [];
    }
  });

  // Reload downloaded brochures whenever modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        const raw = JSON.parse(localStorage.getItem('NS_DOWNLOADED_BROCHURES') || '[]');
        setDownloadedBrochures(raw);
      } catch {}
    }
  }, [isOpen]);

  // Manage Profile State
  const [profileName, setProfileName] = useState(activeSession?.name || 'Customer');
  const [profileEmail, setProfileEmail] = useState(activeSession?.email || 'user@example.com');
  const [profilePhone, setProfilePhone] = useState(activeSession?.phone || '+91 98450 00000');
  const [profileRole, setProfileRole] = useState<'buyer' | 'seller' | 'investor' | 'tenant'>(
    (activeSession?.role as any) || 'buyer'
  );
  const [profileCity, setProfileCity] = useState(activeSession?.city || 'Bangalore');
  const [profileBudget, setProfileBudget] = useState(activeSession?.budget || '₹ 1 Cr - ₹ 3 Cr');
  const [profileBhk, setProfileBhk] = useState(activeSession?.bhkPreference || '3 BHK');

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Customer Service Call Back Form
  const [callBackSubject, setCallBackSubject] = useState('Schedule Site Visit Assistance');
  const [callBackPreferredTime, setCallBackPreferredTime] = useState('Immediate (Next 15 mins)');
  const [callBackNotes, setCallBackNotes] = useState('');
  const [callBackRequested, setCallBackRequested] = useState(false);

  // Give Feedback State
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackCategory, setFeedbackCategory] = useState('Property Listing Accuracy');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRecommend, setFeedbackRecommend] = useState<'yes' | 'no'>('yes');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Communication Settings State
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [priceDropAlerts, setPriceDropAlerts] = useState(true);
  const [emailNewsletters, setEmailNewsletters] = useState(true);
  const [smsSiteVisits, setSmsSiteVisits] = useState(true);
  const [soundChimes, setSoundChimes] = useState(true);

  // Notification banners
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  useEffect(() => {
    if (activeSession) {
      setProfileName(activeSession.name);
      setProfileEmail(activeSession.email);
      setProfilePhone(activeSession.phone);
      if (activeSession.role === 'buyer' || activeSession.role === 'seller') {
        setProfileRole(activeSession.role);
      }
      if (activeSession.city) setProfileCity(activeSession.city);
      if (activeSession.budget) setProfileBudget(activeSession.budget);
      if (activeSession.bhkPreference) setProfileBhk(activeSession.bhkPreference);
    }
  }, [activeSession]);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
    if (initialActivitySubTab) setActivitySubTab(initialActivitySubTab);
  }, [initialTab, initialActivitySubTab, isOpen]);

  if (!isOpen) return null;

  // Filter Shortlisted properties
  const shortlistedProperties = properties.filter((p) => savedPropertyIds.includes(p.id));

  // Filter Viewed properties
  const viewedPropertiesList = viewedPropertyHistory
    .map((item) => {
      const prop = properties.find((p) => p.id === item.propertyId);
      return prop ? { property: prop, viewedAt: item.viewedAt } : null;
    })
    .filter(Boolean) as { property: Property; viewedAt: string }[];

  // Filter Contacted leads/properties
  const contactedLeads = visitorLeads.filter((l) => {
    if (!activeSession) return true;
    const sessionEmail = activeSession.email.toLowerCase();
    const sessionPhone = activeSession.phone.replace(/\D/g, '');
    const leadEmail = l.email.toLowerCase();
    const leadPhone = l.phone.replace(/\D/g, '');

    return (
      (sessionEmail && leadEmail.includes(sessionEmail)) ||
      (sessionPhone && leadPhone.includes(sessionPhone)) ||
      l.status === 'Contacted' ||
      l.source.includes('Owner Contact') ||
      l.source.includes('Site Visit')
    );
  });

  // Filter Customer's own Offer Enquiries (Requirement 8: "Customers can only view public offers and manage their own enquiries.")
  const myEnquiries = (offerEnquiries || []).filter((e) => {
    if (!activeSession) return true;
    const sessionEmail = (activeSession.email || '').toLowerCase();
    const sessionPhone = (activeSession.phone || '').replace(/\D/g, '');
    const enquiryEmail = (e.customerEmail || '').toLowerCase();
    const enquiryPhone = (e.customerPhone || '').replace(/\D/g, '');
    return (
      (sessionEmail && enquiryEmail === sessionEmail) ||
      (sessionPhone && enquiryPhone.includes(sessionPhone.slice(-6))) ||
      e.customerName.toLowerCase().includes(activeSession.name.toLowerCase())
    );
  });

  // Handle Save Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession) return;

    const updated: AppUserSession = {
      ...activeSession,
      name: profileName.trim() || activeSession.name,
      email: profileEmail.trim() || activeSession.email,
      phone: profilePhone.trim() || activeSession.phone,
      role: profileRole as any,
      city: profileCity,
      budget: profileBudget,
      bhkPreference: profileBhk
    };

    saveActiveSession(updated, true);
    onUpdateSession(updated);
    showToast('Profile preferences updated successfully!', 'success');
  };

  // Handle Change Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      showToast('New password/PIN must be at least 4 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match. Please verify.', 'error');
      return;
    }

    try {
      localStorage.setItem('NS_USER_CREDENTIAL_PIN', newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password / Security PIN successfully updated!', 'success');
    } catch {
      showToast('Failed to update credentials. Try again.', 'error');
    }
  };

  // Handle Submit Feedback
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      showToast('Please enter your feedback comments.', 'error');
      return;
    }

    const submission = {
      id: `fb-${Date.now()}`,
      userName: activeSession?.name || 'Verified Buyer',
      userEmail: activeSession?.email || 'user@example.com',
      rating: feedbackRating,
      category: feedbackCategory,
      comment: feedbackText.trim(),
      wouldRecommend: feedbackRecommend === 'yes',
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    };

    try {
      const existing = JSON.parse(localStorage.getItem('NS_USER_FEEDBACK_SUBMISSIONS') || '[]');
      existing.unshift(submission);
      localStorage.setItem('NS_USER_FEEDBACK_SUBMISSIONS', JSON.stringify(existing));
    } catch (err) {
      console.error(err);
    }

    setFeedbackSubmitted(true);
    showToast('Thank you! Your feedback has been received.', 'success');
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackText('');
    }, 4000);
  };

  // Handle Save Communication Settings
  const handleSaveCommunication = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = {
      whatsappAlerts,
      priceDropAlerts,
      emailNewsletters,
      smsSiteVisits,
      soundChimes,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('NS_USER_COMM_SETTINGS', JSON.stringify(settings));
    showToast('Communication alert preferences saved!', 'success');
  };

  // Handle Request Call Back
  const handleRequestCallBack = (e: React.FormEvent) => {
    e.preventDefault();
    setCallBackRequested(true);
    showToast('Call back request registered! An advisor will call you shortly.', 'success');
    setTimeout(() => {
      setCallBackRequested(false);
      setCallBackNotes('');
    }, 5000);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-[#fdfcf9] border-2 border-[#1a1a1a] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col font-mono-luxury"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b-2 border-[#c4a47c] gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#c4a47c] text-black font-black flex items-center justify-center text-sm shadow-md font-serif-luxury shrink-0">
              {profileName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h3 className="font-serif-luxury text-lg sm:text-xl font-bold tracking-tight text-white truncate">
                  {profileName}
                </h3>
                <span className="bg-[#c4a47c] text-black text-[9px] font-black px-1.5 sm:px-2 py-0.5 uppercase tracking-wider shrink-0">
                  {profileRole.toUpperCase()} • VERIFIED
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-white/70 flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5 truncate">
                <span>{profileEmail}</span>
                <span className="hidden xs:inline">•</span>
                <span>{profilePhone}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 border border-red-500/40 hover:border-red-400 hover:bg-red-950/40 transition-colors cursor-pointer uppercase font-bold"
              title="Logout Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Account Hub"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Toast Alert */}
        {toastMessage && (
          <div
            className={`px-6 py-2.5 text-xs font-bold flex items-center gap-2 border-b animate-in fade-in ${
              toastType === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-red-50 text-red-900 border-red-300'
            }`}
          >
            {toastType === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="bg-[#f4f1ea] border-b border-[#1a1a1a]/20 px-3 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-3 py-2.5 text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 cursor-pointer transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'activity'
                ? 'text-black border-black bg-white shadow-xs'
                : 'text-[#1a1a1a]/60 hover:text-black border-transparent'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span>Activity</span>
            <span className="bg-[#1a1a1a] text-[#fdfcf9] text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-1">
              {contactedLeads.length + shortlistedProperties.length + viewedPropertiesList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-2.5 text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 cursor-pointer transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'text-black border-black bg-white shadow-xs'
                : 'text-[#1a1a1a]/60 hover:text-black border-transparent'
            }`}
          >
            <User className="w-3.5 h-3.5 text-[#005CA8]" />
            <span>Manage Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('service')}
            className={`px-3 py-2.5 text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 cursor-pointer transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'service'
                ? 'text-black border-black bg-white shadow-xs'
                : 'text-[#1a1a1a]/60 hover:text-black border-transparent'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-emerald-600" />
            <span>Customer Service</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-3 py-2.5 text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 cursor-pointer transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'feedback'
                ? 'text-black border-black bg-white shadow-xs'
                : 'text-[#1a1a1a]/60 hover:text-black border-transparent'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-500" />
            <span>Give Feedback</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-2.5 text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 cursor-pointer transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'security'
                ? 'text-black border-black bg-white shadow-xs'
                : 'text-[#1a1a1a]/60 hover:text-black border-transparent'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-purple-600" />
            <span>Change Password</span>
          </button>

          <button
            onClick={() => setActiveTab('communication')}
            className={`px-3 py-2.5 text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 cursor-pointer transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'communication'
                ? 'text-black border-black bg-white shadow-xs'
                : 'text-[#1a1a1a]/60 hover:text-black border-transparent'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-rose-600" />
            <span>Communication Settings</span>
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#fdfcf9]">
          
          {/* ========================================================================= */}
          {/* TAB 1: ACTIVITY (CONTACTED, SHORTLISTED, VIEWED) */}
          {/* ========================================================================= */}
          {activeTab === 'activity' && (
            <div className="space-y-5">
              {/* Sub-Tabs Pills */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1a1a1a]/15 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActivitySubTab('contacted')}
                    className={`px-3.5 py-1.5 text-xs font-bold uppercase transition-all cursor-pointer border flex items-center gap-1.5 ${
                      activitySubTab === 'contacted'
                        ? 'bg-[#1a1a1a] text-[#c4a47c] border-[#1a1a1a] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                    }`}
                  >
                    <Phone className="w-3 h-3 text-[#c4a47c]" />
                    <span>Contacted ({contactedLeads.length})</span>
                  </button>

                  <button
                    onClick={() => setActivitySubTab('shortlisted')}
                    className={`px-3.5 py-1.5 text-xs font-bold uppercase transition-all cursor-pointer border flex items-center gap-1.5 ${
                      activitySubTab === 'shortlisted'
                        ? 'bg-[#1a1a1a] text-[#c4a47c] border-[#1a1a1a] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                    }`}
                  >
                    <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                    <span>Shortlisted ({shortlistedProperties.length})</span>
                  </button>

                  <button
                    onClick={() => setActivitySubTab('viewed')}
                    className={`px-3.5 py-1.5 text-xs font-bold uppercase transition-all cursor-pointer border flex items-center gap-1.5 ${
                      activitySubTab === 'viewed'
                        ? 'bg-[#1a1a1a] text-[#c4a47c] border-[#1a1a1a] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                    }`}
                  >
                    <Eye className="w-3 h-3 text-blue-500" />
                    <span>Viewed History ({viewedPropertiesList.length})</span>
                  </button>

                  <button
                    onClick={() => setActivitySubTab('brochures')}
                    className={`px-3.5 py-1.5 text-xs font-bold uppercase transition-all cursor-pointer border flex items-center gap-1.5 ${
                      activitySubTab === 'brochures'
                        ? 'bg-[#1a1a1a] text-[#c4a47c] border-[#1a1a1a] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                    }`}
                  >
                    <Download className="w-3 h-3 text-[#c4a47c]" />
                    <span>Brochures ({downloadedBrochures.length})</span>
                  </button>

                  <button
                    onClick={() => setActivitySubTab('offers')}
                    className={`px-3.5 py-1.5 text-xs font-bold uppercase transition-all cursor-pointer border flex items-center gap-1.5 ${
                      activitySubTab === 'offers'
                        ? 'bg-[#1a1a1a] text-[#c4a47c] border-[#1a1a1a] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                    }`}
                  >
                    <Tag className="w-3 h-3 text-[#c4a47c]" />
                    <span>My Offers ({myEnquiries.length})</span>
                  </button>
                </div>

                {activitySubTab === 'viewed' && viewedPropertiesList.length > 0 && (
                  <button
                    onClick={onClearViewedHistory}
                    className="text-[11px] text-gray-500 hover:text-red-600 flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear Viewed History</span>
                  </button>
                )}
              </div>

              {/* SUB-TAB 1: CONTACTED PROPERTIES */}
              {activitySubTab === 'contacted' && (
                <div className="space-y-3">
                  <div className="bg-amber-50/60 border border-amber-200/80 p-3 text-xs text-amber-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      All direct inquiries, owner contact unlocks, and scheduled visit requests are tracked here.
                    </span>
                    <span className="text-[11px] text-amber-800">Direct Owner Connection Guaranteed</span>
                  </div>

                  {contactedLeads.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-[#1a1a1a]/20 bg-white p-6">
                      <Phone className="w-10 h-10 mx-auto text-[#c4a47c] mb-2" />
                      <h4 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                        No Inquiries or Contact Unlocks Yet
                      </h4>
                      <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-4">
                        When you contact property owners, request callbacks, or unlock phone numbers, they will appear here with instant call and WhatsApp actions.
                      </p>
                      <button
                        onClick={onClose}
                        className="px-4 py-2 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] text-xs font-bold uppercase cursor-pointer"
                      >
                        Explore Verified Properties →
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {contactedLeads.map((lead) => {
                        const matchedProp = properties.find((p) => p.id === lead.propertyId || p.title === lead.propertyTitle);
                        return (
                          <div
                            key={lead.id}
                            className="bg-white border border-[#1a1a1a]/20 p-4 hover:border-[#1a1a1a] transition-all shadow-xs flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <span className="bg-[#1a1a1a] text-[#c4a47c] text-[10px] font-bold px-2 py-0.5 uppercase">
                                  {lead.source}
                                </span>
                                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {lead.timestamp}
                                </span>
                              </div>

                              <h4 className="font-serif-luxury font-bold text-sm text-[#1a1a1a] line-clamp-1 mb-1">
                                {lead.propertyTitle || 'Direct Luxury Property Inquiry'}
                              </h4>

                              <div className="text-xs text-gray-600 space-y-0.5 mb-3 font-mono-luxury">
                                <p className="flex items-center gap-1">
                                  <span className="text-gray-400">Target City:</span>
                                  <strong className="text-black">{lead.preferredCity || profileCity}</strong>
                                </p>
                                <p className="flex items-center gap-1">
                                  <span className="text-gray-400">Status:</span>
                                  <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 border border-emerald-200">
                                    {lead.status === 'Contacted' ? 'Owner Contacted' : 'Request Active'}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-[#1a1a1a]/10 flex items-center justify-between gap-2">
                              {matchedProp && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onClose();
                                    onSelectProperty(matchedProp);
                                  }}
                                  className="text-[11px] text-[#005CA8] hover:underline font-bold cursor-pointer"
                                >
                                  View Property →
                                </button>
                              )}

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const msg = `Hi, I had inquired about ${lead.propertyTitle || 'your property'} on NS Properties. Could you share latest pricing and availability?`;
                                    openWhatsAppChat(DEFAULT_CONTACT_PHONE, msg);
                                  }}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>WhatsApp</span>
                                </button>

                                <a
                                  href={`tel:${DEFAULT_CONTACT_PHONE}`}
                                  className="px-2.5 py-1 bg-[#1a1a1a] hover:bg-black text-[#c4a47c] text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>Call</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB 2: SHORTLISTED PROPERTIES */}
              {activitySubTab === 'shortlisted' && (
                <div>
                  {shortlistedProperties.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-[#1a1a1a]/20 bg-white p-6">
                      <Heart className="w-10 h-10 mx-auto text-red-400 mb-2" />
                      <h4 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                        Your Shortlist is Empty
                      </h4>
                      <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-4">
                        Save properties you love while browsing to monitor price drop alerts, compare configurations, and schedule priority site visits.
                      </p>
                      <button
                        onClick={onClose}
                        className="px-4 py-2 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] text-xs font-bold uppercase cursor-pointer"
                      >
                        Explore Homes to Shortlist →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>{shortlistedProperties.length} properties saved in your shortlist</span>
                        {onOpenCompare && shortlistedProperties.length >= 2 && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenCompare();
                            }}
                            className="text-[#005CA8] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>Compare Shortlisted Properties →</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {shortlistedProperties.map((prop) => (
                          <div
                            key={prop.id}
                            className="bg-white border border-[#1a1a1a]/20 p-3 hover:border-[#1a1a1a] transition-all flex gap-3 shadow-xs group"
                          >
                            <div className="w-28 h-24 shrink-0 overflow-hidden relative border border-[#1a1a1a]/15">
                              <img
                                src={prop.images[0]}
                                alt={prop.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <span className="absolute top-1 left-1 bg-black/80 text-[#c4a47c] text-[8px] font-bold px-1 uppercase">
                                {prop.type}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <h4 className="font-serif-luxury font-bold text-xs text-[#1a1a1a] truncate">
                                  {prop.title}
                                </h4>
                                <p className="text-[11px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 text-[#c4a47c]" />
                                  <span>{prop.locality}, {prop.city}</span>
                                </p>
                                <p className="font-serif-luxury text-sm font-bold text-[#1a1a1a] mt-1">
                                  {prop.priceDisplay}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onClose();
                                    onSelectProperty(prop);
                                  }}
                                  className="text-[10px] text-[#005CA8] font-bold uppercase hover:underline cursor-pointer"
                                >
                                  View Details
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onToggleSaveProperty(prop)}
                                  className="text-[10px] text-red-600 hover:text-red-700 font-bold uppercase cursor-pointer"
                                  title="Remove from shortlist"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB 3: VIEWED HISTORY */}
              {activitySubTab === 'viewed' && (
                <div>
                  {viewedPropertiesList.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-[#1a1a1a]/20 bg-white p-6">
                      <Eye className="w-10 h-10 mx-auto text-blue-400 mb-2" />
                      <h4 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                        No Viewing History Yet
                      </h4>
                      <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-4">
                        Properties you browse will automatically appear here with exact timestamps so you never lose track of a home.
                      </p>
                      <button
                        onClick={onClose}
                        className="px-4 py-2 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] text-xs font-bold uppercase cursor-pointer"
                      >
                        Start Browsing Homes →
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {viewedPropertiesList.map(({ property: prop, viewedAt }) => (
                        <div
                          key={`${prop.id}-${viewedAt}`}
                          className="bg-white border border-[#1a1a1a]/20 p-3 hover:border-[#1a1a1a] transition-all flex items-center justify-between gap-3 shadow-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={prop.images[0]}
                              alt={prop.title}
                              className="w-14 h-14 object-cover border border-[#1a1a1a]/20 shrink-0"
                            />
                            <div className="min-w-0">
                              <h5 className="font-serif-luxury font-bold text-xs text-[#1a1a1a] truncate">
                                {prop.title}
                              </h5>
                              <p className="text-[10px] text-gray-500 truncate">
                                {prop.locality}, {prop.city} • <strong className="text-black">{prop.priceDisplay}</strong>
                              </p>
                              <span className="text-[9px] text-blue-600 flex items-center gap-1 mt-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                {viewedAt}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onSelectProperty(prop);
                              }}
                              className="px-2.5 py-1 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] text-[10px] uppercase font-bold cursor-pointer"
                            >
                              Revisit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB 4: DOWNLOADED BROCHURES */}
              {activitySubTab === 'brochures' && (
                <div>
                  {downloadedBrochures.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-[#1a1a1a]/20 bg-white p-6">
                      <FileText className="w-10 h-10 mx-auto text-[#c4a47c] mb-2" />
                      <h4 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                        No Project Brochures Downloaded Yet
                      </h4>
                      <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-4">
                        Download official architectural dossiers, RERA certificates, and floor plan PDFs for any project to review offline or share with family.
                      </p>
                      <button
                        onClick={onClose}
                        className="px-4 py-2 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] text-xs font-bold uppercase cursor-pointer"
                      >
                        Explore Projects & Download Brochures →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>{downloadedBrochures.length} official project brochure(s) saved</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          RERA Approved Vector Dossiers
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {downloadedBrochures.map((item: any, idx: number) => {
                          const matchedProp = properties.find((p) => p.id === item.propertyId || p.title === item.propertyTitle);
                          return (
                            <div
                              key={`${item.propertyId}-${idx}`}
                              className="bg-white border border-[#1a1a1a]/20 p-4 hover:border-[#1a1a1a] transition-all shadow-xs flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <span className="bg-[#1a1a1a] text-[#c4a47c] text-[10px] font-bold px-2 py-0.5 uppercase">
                                    PDF BROCHURE
                                  </span>
                                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {item.downloadedAt}
                                  </span>
                                </div>

                                <h4 className="font-serif-luxury font-bold text-sm text-[#1a1a1a] line-clamp-1 mb-1">
                                  {item.propertyTitle}
                                </h4>

                                <p className="text-xs text-gray-600 mb-3 font-mono-luxury">
                                  {item.locality}, {item.city} • <strong className="text-black">{item.priceDisplay}</strong>
                                </p>
                              </div>

                              <div className="pt-3 border-t border-[#1a1a1a]/10 flex items-center justify-between gap-2">
                                {matchedProp ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onClose();
                                      onSelectProperty(matchedProp);
                                    }}
                                    className="text-[11px] text-[#005CA8] hover:underline font-bold cursor-pointer"
                                  >
                                    View Details →
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-gray-400">{item.fileName}</span>
                                )}

                                <div className="flex items-center gap-2">
                                  {matchedProp && (
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        await generateProjectBrochurePdf(matchedProp, profileName);
                                        showToast('Brochure PDF downloaded again!', 'success');
                                      }}
                                      className="px-2.5 py-1 bg-[#1a1a1a] hover:bg-black text-[#c4a47c] text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer"
                                      title="Download PDF again"
                                    >
                                      <Download className="w-3 h-3" />
                                      <span>PDF Again</span>
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const msg = `Hi, I downloaded the brochure for "${item.propertyTitle}" on NS Properties. Could you share latest payment schemes?`;
                                      openWhatsAppChat(DEFAULT_CONTACT_PHONE, msg);
                                    }}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                    <span>WhatsApp</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB 5: MY OFFER DEALS & CLAIMS (Requirement 8) */}
              {activitySubTab === 'offers' && (
                <div>
                  {myEnquiries.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-[#1a1a1a]/20 bg-white p-6">
                      <Tag className="w-10 h-10 mx-auto text-[#c4a47c] mb-2" />
                      <h4 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                        No Special Offers Claimed Yet
                      </h4>
                      <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-4 font-mono-luxury">
                        Explore our handpicked festive deals, stamp duty waivers, and developer rebates on luxury properties.
                      </p>
                      <button
                        onClick={onClose}
                        className="px-4 py-2 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] text-xs font-bold uppercase cursor-pointer"
                      >
                        Browse Exclusive Offers →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-amber-50/60 border border-amber-200/80 p-3 text-xs text-amber-900 flex items-center justify-between font-mono-luxury">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Tag className="w-4 h-4 text-[#c4a47c]" />
                          Tracking your claimed developer concessions, festival deals, and voucher codes.
                        </span>
                        <span className="text-[11px] text-amber-800 font-bold">{myEnquiries.length} Active Deals</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {myEnquiries.map((enq) => {
                          const matchedOffer = (offers || []).find((o) => o.id === enq.offerId);
                          return (
                            <div key={enq.id} className="bg-white border-2 border-[#1a1a1a] p-4 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <span className="bg-[#c4a47c] text-black text-[10px] font-black uppercase px-2 py-0.5 border border-black font-mono-luxury">
                                    {matchedOffer?.discountType === 'percentage'
                                      ? `FLAT ${matchedOffer.discountValue}% OFF`
                                      : matchedOffer?.discountValue ? `SAVE ₹ ${(matchedOffer.discountValue / 100000).toFixed(0)} LAKHS` : 'SPECIAL DEAL'}
                                  </span>
                                  <span className="text-[10px] px-2 py-0.5 font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono-luxury">
                                    Status: {enq.status}
                                  </span>
                                </div>

                                <h4 className="font-serif-luxury font-bold text-sm text-[#1a1a1a] line-clamp-1">
                                  {enq.offerTitle}
                                </h4>

                                {enq.propertyTitle && (
                                  <p className="text-xs text-gray-600 mt-1 font-mono-luxury">
                                    Property: <strong className="text-black">{enq.propertyTitle}</strong>
                                  </p>
                                )}

                                <p className="text-[11px] text-gray-500 mt-1 font-mono-luxury">
                                  Claimed: {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>

                                {enq.notes && (
                                  <p className="text-xs bg-gray-50 p-2 mt-2 border border-gray-200 text-gray-700 italic">
                                    "{enq.notes}"
                                  </p>
                                )}
                              </div>

                              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2 font-mono-luxury">
                                <span className="text-[11px] text-gray-500">
                                  Officer: <strong>{enq.assignedStaffName || 'Concierge'}</strong>
                                </span>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const msg = `Hi, I submitted an inquiry for "${enq.offerTitle}" on NS Properties. Could you share token status?`;
                                    openWhatsAppChat(DEFAULT_CONTACT_PHONE, msg);
                                  }}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>WhatsApp</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: MANAGE PROFILE */}
          {/* ========================================================================= */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="max-w-2xl mx-auto space-y-4">
              <div className="bg-white border border-[#1a1a1a]/20 p-5 shadow-xs">
                {/* Official App Profile Identity Card */}
                <div className="flex items-center gap-3.5 p-3.5 bg-[#0a1329] text-white border-l-4 border-blue-500 mb-4 shadow-xs">
                  <AppProfileLogo size="lg" showGlow={true} className="w-14 h-14 shrink-0 rounded-lg" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-serif-luxury font-bold text-sm text-white">
                        NS Properties Official Architectural Identity
                      </span>
                      <span className="bg-blue-600 text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider text-white">
                        4 BHK Luxe Edition
                      </span>
                    </div>
                    <p className="text-[11px] text-white/70 font-mono-luxury mt-0.5">
                      Flagship isometric architectural estate masterplan representing luxury real estate excellence across India.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#1a1a1a]/15">
                  <User className="w-4 h-4 text-[#005CA8]" />
                  <h4 className="font-serif-luxury font-bold text-sm text-[#1a1a1a] uppercase tracking-wider">
                    Personal Identity & Contact Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-luxury">
                  <div>
                    <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                      User Persona / Intent
                    </label>
                    <select
                      value={profileRole}
                      onChange={(e) => setProfileRole(e.target.value as any)}
                      className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none cursor-pointer"
                    >
                      <option value="buyer">Home Buyer (Searching properties)</option>
                      <option value="seller">Property Owner / Seller</option>
                      <option value="investor">HNW Real Estate Investor</option>
                      <option value="tenant">Luxury Rental Tenant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full pl-3 pr-20 py-2 border border-[#1a1a1a] bg-white text-xs outline-none"
                      />
                      <span className="absolute right-2 top-2 text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 border border-emerald-300">
                        VERIFIED
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full pl-3 pr-20 py-2 border border-[#1a1a1a] bg-white text-xs outline-none"
                      />
                      <span className="absolute right-2 top-2 text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 border border-emerald-300">
                        VERIFIED
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Search Preferences */}
              <div className="bg-white border border-[#1a1a1a]/20 p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#1a1a1a]/15">
                  <Sliders className="w-4 h-4 text-[#c4a47c]" />
                  <h4 className="font-serif-luxury font-bold text-sm text-[#1a1a1a] uppercase tracking-wider">
                    Property Search Preferences
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-luxury">
                  <div>
                    <label className="block uppercase font-bold text-gray-700 mb-1 text-[10px]">
                      Preferred Metro City
                    </label>
                    <select
                      value={profileCity}
                      onChange={(e) => setProfileCity(e.target.value)}
                      className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none cursor-pointer"
                    >
                      <option value="Bangalore">Bangalore</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Pune">Pune</option>
                      <option value="Goa">Goa</option>
                      <option value="Kolkata">Kolkata</option>
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase font-bold text-gray-700 mb-1 text-[10px]">
                      Budget Range
                    </label>
                    <select
                      value={profileBudget}
                      onChange={(e) => setProfileBudget(e.target.value)}
                      className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none cursor-pointer"
                    >
                      <option value="Under ₹ 50 L">Under ₹ 50 Lakhs</option>
                      <option value="₹ 50 L - ₹ 1 Cr">₹ 50 Lakhs - ₹ 1 Crore</option>
                      <option value="₹ 1 Cr - ₹ 3 Cr">₹ 1 Crore - ₹ 3 Crores</option>
                      <option value="₹ 3 Cr - ₹ 5 Cr">₹ 3 Crores - ₹ 5 Crores</option>
                      <option value="₹ 5 Cr+">₹ 5 Crores + Luxury</option>
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase font-bold text-gray-700 mb-1 text-[10px]">
                      Preferred BHK
                    </label>
                    <select
                      value={profileBhk}
                      onChange={(e) => setProfileBhk(e.target.value)}
                      className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none cursor-pointer"
                    >
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="4 BHK">4 BHK</option>
                      <option value="Villa / Penthouse">Luxury Villa / Penthouse</option>
                      <option value="Plot / Land">Plot / Land</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1a1a1a] hover:bg-black text-[#c4a47c] border border-[#c4a47c] font-bold uppercase text-xs cursor-pointer transition-colors shadow-sm tracking-wider"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: CUSTOMER SERVICE */}
          {/* ========================================================================= */}
          {activeTab === 'service' && (
            <div className="max-w-3xl mx-auto space-y-5">
              {/* Emergency Concierge Contacts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#1a1a1a] text-[#fdfcf9] p-4 border border-[#c4a47c] shadow-sm flex flex-col justify-between">
                  <div>
                    <Phone className="w-5 h-5 text-[#c4a47c] mb-2" />
                    <span className="font-bold uppercase text-[11px] block text-[#c4a47c]">Toll-Free Helpline</span>
                    <p className="text-xs text-white/70 mt-1">24/7 dedicated support for verified buyers & sellers.</p>
                  </div>
                  <a
                    href="tel:18002083344"
                    className="mt-3 block text-center py-1.5 bg-[#c4a47c] text-black font-bold uppercase text-xs hover:bg-[#b09066] transition-colors"
                  >
                    Call 1800-208-3344
                  </a>
                </div>

                <div className="bg-[#064e3b] text-white p-4 border border-emerald-400/50 shadow-sm flex flex-col justify-between">
                  <div>
                    <MessageSquare className="w-5 h-5 text-emerald-300 mb-2" />
                    <span className="font-bold uppercase text-[11px] block text-emerald-300">WhatsApp Concierge</span>
                    <p className="text-xs text-white/80 mt-1">Instant chat response, verified brochures, location pins.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const msg = `Hello NS Properties Concierge, I need customer service assistance for my account (${profileName}).`;
                      openWhatsAppChat(DEFAULT_CONTACT_PHONE, msg);
                    }}
                    className="mt-3 w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-xs transition-colors cursor-pointer"
                  >
                    Open WhatsApp Chat
                  </button>
                </div>

                <div className="bg-[#0f172a] text-white p-4 border border-blue-400/50 shadow-sm flex flex-col justify-between">
                  <div>
                    <Headphones className="w-5 h-5 text-blue-300 mb-2" />
                    <span className="font-bold uppercase text-[11px] block text-blue-300">Email Helpdesk</span>
                    <p className="text-xs text-white/80 mt-1">Written documentation, legal and title verification queries.</p>
                  </div>
                  <a
                    href="mailto:concierge@nsproperties.in"
                    className="mt-3 block text-center py-1.5 bg-blue-500 hover:bg-blue-400 text-black font-bold uppercase text-xs transition-colors"
                  >
                    Email Support
                  </a>
                </div>
              </div>

              {/* Request an Instant Call Back Form */}
              <div className="bg-white border border-[#1a1a1a]/20 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1a1a1a]/15">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-serif-luxury font-bold text-sm text-[#1a1a1a] uppercase tracking-wider">
                      Request an Instant Call Back
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    AVG. RESPONSE: 15 MINS
                  </span>
                </div>

                {callBackRequested ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                    <h5 className="font-serif-luxury font-bold text-sm text-emerald-900">
                      Call Back Request Confirmed
                    </h5>
                    <p className="text-xs text-emerald-800">
                      Our Senior Relationship Manager will dial your registered number ({profilePhone}) regarding "{callBackSubject}".
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRequestCallBack} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block uppercase font-bold text-gray-700 mb-1 text-[10px]">
                          Topic of Assistance *
                        </label>
                        <select
                          value={callBackSubject}
                          onChange={(e) => setCallBackSubject(e.target.value)}
                          className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none cursor-pointer"
                        >
                          <option value="Schedule Site Visit Assistance">Schedule Site Visit Assistance</option>
                          <option value="Price Negotiation with Property Owner">Price Negotiation with Property Owner</option>
                          <option value="Home Loan & EMI Documentation">Home Loan & EMI Documentation</option>
                          <option value="Legal & Title Deed Verification">Legal & Title Deed Verification</option>
                          <option value="Post Ad / Seller Consultation">Post Ad / Seller Consultation</option>
                          <option value="Report Listing Discrepancy">Report Listing Discrepancy</option>
                        </select>
                      </div>

                      <div>
                        <label className="block uppercase font-bold text-gray-700 mb-1 text-[10px]">
                          Preferred Call Time *
                        </label>
                        <select
                          value={callBackPreferredTime}
                          onChange={(e) => setCallBackPreferredTime(e.target.value)}
                          className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none cursor-pointer"
                        >
                          <option value="Immediate (Next 15 mins)">Immediate (Next 15 mins)</option>
                          <option value="Morning (10:00 AM - 12:00 PM)">Morning (10:00 AM - 12:00 PM)</option>
                          <option value="Afternoon (02:00 PM - 05:00 PM)">Afternoon (02:00 PM - 05:00 PM)</option>
                          <option value="Evening (06:00 PM - 08:30 PM)">Evening (06:00 PM - 08:30 PM)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block uppercase font-bold text-gray-700 mb-1 text-[10px]">
                        Additional Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={callBackNotes}
                        onChange={(e) => setCallBackNotes(e.target.value)}
                        placeholder="Mention property name or specific question..."
                        className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-bold uppercase text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors tracking-wider"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#c4a47c]" />
                      <span>Submit Call Back Request</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: GIVE FEEDBACK */}
          {/* ========================================================================= */}
          {activeTab === 'feedback' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="bg-white border border-[#1a1a1a]/20 p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#1a1a1a]/15">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <h4 className="font-serif-luxury font-bold text-sm text-[#1a1a1a] uppercase tracking-wider">
                    Share Your Feedback & Experience
                  </h4>
                </div>

                <p className="text-xs text-gray-600 mb-4 font-mono-luxury">
                  Your feedback directly shapes our platform improvements. All submissions are reviewed directly by the App Owner and Senior Leadership team.
                </p>

                {feedbackSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-300 p-6 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
                    <h5 className="font-serif-luxury font-bold text-base text-emerald-900">
                      Thank You For Your Feedback!
                    </h5>
                    <p className="text-xs text-emerald-800">
                      Your feedback has been logged in the system. We truly appreciate your contribution to making NS Properties better.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs font-mono-luxury">
                    {/* Star Rating Selector */}
                    <div>
                      <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                        Overall Experience Rating *
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFeedbackRating(star)}
                            className="p-1 cursor-pointer transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-7 h-7 ${
                                star <= feedbackRating
                                  ? 'text-amber-500 fill-amber-500'
                                  : 'text-gray-300 hover:text-amber-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 font-bold text-sm text-[#1a1a1a]">
                          {feedbackRating === 5 && 'Excellent (5/5)'}
                          {feedbackRating === 4 && 'Very Good (4/5)'}
                          {feedbackRating === 3 && 'Good (3/5)'}
                          {feedbackRating === 2 && 'Fair (2/5)'}
                          {feedbackRating === 1 && 'Needs Improvement (1/5)'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                        Feedback Category *
                      </label>
                      <select
                        value={feedbackCategory}
                        onChange={(e) => setFeedbackCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none cursor-pointer"
                      >
                        <option value="Property Listing Accuracy">Property Listing Accuracy & 4K Media</option>
                        <option value="Owner / Agent Response Time">Owner & Certified Agent Response Time</option>
                        <option value="Search & Property Comparison Engine">Search Filters & Comparison Engine</option>
                        <option value="Pricing Insights & Price Trends">Pricing Transparency & Market Trends</option>
                        <option value="Platform Speed & UI Experience">App Speed, Navigation & Design</option>
                        <option value="Other Suggestions">Other Feature Request</option>
                      </select>
                    </div>

                    <div>
                      <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                        Would you recommend NS Properties to friends & family?
                      </label>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="recommend"
                            checked={feedbackRecommend === 'yes'}
                            onChange={() => setFeedbackRecommend('yes')}
                            className="accent-black"
                          />
                          <span className="font-bold text-[#1a1a1a]">Yes, definitely</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="recommend"
                            checked={feedbackRecommend === 'no'}
                            onChange={() => setFeedbackRecommend('no')}
                            className="accent-black"
                          />
                          <span className="text-gray-600">No, not yet</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                        Your Comments & Detailed Experience *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Tell us what you liked about browsing or what we can enhance..."
                        className="w-full p-3 border border-[#1a1a1a] bg-white text-xs outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#1a1a1a] hover:bg-black text-[#c4a47c] border border-[#c4a47c] font-bold uppercase text-xs cursor-pointer transition-colors shadow-sm tracking-wider flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Verified Feedback</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: CHANGE PASSWORD / SECURITY PIN */}
          {/* ========================================================================= */}
          {activeTab === 'security' && (
            <div className="max-w-xl mx-auto space-y-4">
              <form onSubmit={handleChangePassword} className="bg-white border border-[#1a1a1a]/20 p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#1a1a1a]/15">
                  <KeyRound className="w-4 h-4 text-purple-600" />
                  <h4 className="font-serif-luxury font-bold text-sm text-[#1a1a1a] uppercase tracking-wider">
                    Update Account Password & Security PIN
                  </h4>
                </div>

                <div className="space-y-3 text-xs font-mono-luxury">
                  <div>
                    <label className="block uppercase font-bold text-gray-700 mb-1 text-[10px]">
                      Current Password or PIN
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password or OTP"
                      className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block uppercase font-bold text-gray-700 mb-1 text-[10px]">
                      New Password or PIN (Min 4 chars) *
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new secure password or PIN"
                      className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block uppercase font-bold text-gray-700 mb-1 text-[10px]">
                      Confirm New Password or PIN *
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password or PIN"
                      className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Two-Factor Authentication (2FA)</span>
                    <span className="text-[10px] text-gray-500">Require OTP code for new logins</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    className="w-4 h-4 accent-black cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-bold uppercase text-xs cursor-pointer transition-colors shadow-sm tracking-wider"
                >
                  Update Credentials & PIN
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: COMMUNICATION SETTINGS */}
          {/* ========================================================================= */}
          {activeTab === 'communication' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <form onSubmit={handleSaveCommunication} className="bg-white border border-[#1a1a1a]/20 p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#1a1a1a]/15">
                  <Bell className="w-4 h-4 text-rose-600" />
                  <h4 className="font-serif-luxury font-bold text-sm text-[#1a1a1a] uppercase tracking-wider">
                    Communication & Notification Preferences
                  </h4>
                </div>

                <div className="space-y-3 text-xs font-mono-luxury divide-y divide-gray-100">
                  <label className="flex items-center justify-between pt-2 cursor-pointer">
                    <div>
                      <span className="font-bold text-gray-900 block">WhatsApp Site Visit Alerts</span>
                      <span className="text-[11px] text-gray-500">
                        Receive site visit confirmations, owner direct contact updates on WhatsApp.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={whatsappAlerts}
                      onChange={(e) => setWhatsappAlerts(e.target.checked)}
                      className="w-4 h-4 accent-[#1a1a1a] cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between pt-3 cursor-pointer">
                    <div>
                      <span className="font-bold text-gray-900 block">Price Drop Alerts on Shortlist</span>
                      <span className="text-[11px] text-gray-500">
                        Instant notification when an owner reduces price on your shortlisted properties.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={priceDropAlerts}
                      onChange={(e) => setPriceDropAlerts(e.target.checked)}
                      className="w-4 h-4 accent-[#1a1a1a] cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between pt-3 cursor-pointer">
                    <div>
                      <span className="font-bold text-gray-900 block">Email Newsletters & Market Trends</span>
                      <span className="text-[11px] text-gray-500">
                        Weekly curated luxury projects, RERA reports, and locality price trend analysis.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNewsletters}
                      onChange={(e) => setEmailNewsletters(e.target.checked)}
                      className="w-4 h-4 accent-[#1a1a1a] cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between pt-3 cursor-pointer">
                    <div>
                      <span className="font-bold text-gray-900 block">SMS Site Visit & OTP Reminders</span>
                      <span className="text-[11px] text-gray-500">
                        SMS reminders 2 hours before your scheduled property site tour.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={smsSiteVisits}
                      onChange={(e) => setSmsSiteVisits(e.target.checked)}
                      className="w-4 h-4 accent-[#1a1a1a] cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between pt-3 cursor-pointer">
                    <div>
                      <span className="font-bold text-gray-900 block">In-App Sound Chimes</span>
                      <span className="text-[11px] text-gray-500">
                        Play subtle luxury audio chime when saving properties or confirming inquiries.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={soundChimes}
                      onChange={(e) => setSoundChimes(e.target.checked)}
                      className="w-4 h-4 accent-[#1a1a1a] cursor-pointer"
                    />
                  </label>
                </div>

                <div className="pt-3 border-t border-[#1a1a1a]/10 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1a1a1a] hover:bg-black text-[#c4a47c] border border-[#c4a47c] font-bold uppercase text-xs cursor-pointer transition-colors shadow-sm tracking-wider"
                  >
                    Save Preferences
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-[#1a1a1a] text-white/60 px-6 py-2.5 border-t border-[#1a1a1a] text-[10px] font-mono-luxury flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>NS Properties Certified Account • 256-bit Encrypted Session</span>
          </div>
          <button
            onClick={onClose}
            className="hover:text-white uppercase font-bold cursor-pointer"
          >
            Close Account Hub
          </button>
        </div>
      </div>
    </div>
  );
};
