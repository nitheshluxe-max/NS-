import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Filter, 
  ArrowUpDown, 
  Search, 
  MapPin, 
  Heart, 
  Scale, 
  Sparkles, 
  SlidersHorizontal, 
  ShieldCheck, 
  PlusCircle, 
  Home, 
  ChevronRight, 
  MessageSquare, 
  Settings, 
  Crown, 
  Terminal, 
  ShieldAlert,
  Users,
  Phone,
  Lock
} from 'lucide-react';
import { 
  Property, 
  FilterState, 
  PropertyPurpose, 
  PropertyCategory, 
  PropertyType, 
  SiteVisitRequest,
  VisitorLead,
  UserAccount,
  LocationMapConfig,
  SubscriptionPlan,
  InvoiceRecord,
  BugTicket,
  Offer,
  OfferEnquiry
} from './types';
import { INITIAL_PROPERTIES, TOP_CITIES } from './data/properties';
import { 
  INITIAL_USERS, 
  INITIAL_LOCATIONS, 
  INITIAL_SUBSCRIPTION_PLANS, 
  INITIAL_INVOICES, 
  INITIAL_BUG_TICKETS 
} from './data/ownerDeveloperData';
import { 
  INITIAL_OFFERS, 
  INITIAL_OFFER_ENQUIRIES, 
  logOfferActivity 
} from './data/plansOffersData';
import { STORAGE_KEYS } from './utils/formatters';
import { openWhatsAppChat, DISPLAY_CONTACT_PHONE, DEFAULT_CONTACT_PHONE } from './utils/whatsapp';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { FilterSidebar } from './components/FilterSidebar';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { PostPropertyModal } from './components/PostPropertyModal';
import { EmiCalculatorModal } from './components/EmiCalculatorModal';
import { CompareModal } from './components/CompareModal';
import { MarketTrendsModal } from './components/MarketTrendsModal';
import { SiteVisitModal } from './components/SiteVisitModal';
import { SavedDrawer } from './components/SavedDrawer';
import { DownloadAppModal } from './components/DownloadAppModal';
import { ShareAppModal } from './components/ShareAppModal';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { LeadsAdminModal } from './components/LeadsAdminModal';
import { SettingsModal } from './components/SettingsModal';
import { OwnerMasterConsole } from './components/OwnerMasterConsole';
import { DeveloperDashboard } from './components/DeveloperDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { AuthModal } from './components/AuthModal';
import { ContactUsModal } from './components/ContactUsModal';
import { UserAccountHubModal } from './components/UserAccountHubModal';
import { ProjectBrochureModal } from './components/ProjectBrochureModal';
import { OffersSection } from './components/OffersSection';
import { OfferDetailModal } from './components/OfferDetailModal';
import { SubscriptionPlansModal } from './components/SubscriptionPlansModal';
import { 
  CategoryQuickNav, 
  FeaturedPropertiesShowcase, 
  PropertiesByLocation, 
  PropertiesByBudget, 
  ContactNSPropertiesBanner 
} from './components/PublicHomeSections';
import { 
  getActiveSession, 
  clearActiveSession, 
  AppUserSession 
} from './utils/appAuthService';
import { 
  isDeveloperModeActive, 
  setDeveloperModeActive, 
  getDeveloperEmail 
} from './utils/developerConfig';

export default function App() {
  // All properties (initial + user posted)
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PROPERTIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_PROPERTIES];
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PROPERTIES;
  });

  // Shortlisted property IDs
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_PROPERTIES);
      return saved ? JSON.parse(saved) : ['prop-1', 'prop-3'];
    } catch {
      return ['prop-1', 'prop-3'];
    }
  });

  // Compare property IDs
  const [compareIds, setCompareIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPARE_PROPERTIES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Site visits list
  const [siteVisits, setSiteVisits] = useState<SiteVisitRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SITE_VISITS);
      return saved ? JSON.parse(saved) : [
        {
          id: 'visit-demo',
          propertyId: 'prop-1',
          propertyTitle: '3 BHK Luxury Apartment in Godrej Splendour',
          name: 'Nithesh',
          phone: '+91 80732 66325',
          email: 'nitheshluxe@gmail.com',
          date: '2026-09-22',
          timeSlot: '11:00 AM - 01:00 PM',
          notes: 'Looking for 14th floor garden facing unit',
          status: 'Confirmed',
          createdAt: '2026-09-19'
        }
      ];
    } catch {
      return [];
    }
  });

  // Client leads & visitor contact submissions
  const [visitorLeads, setVisitorLeads] = useState<VisitorLead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VISITOR_LEADS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'lead-init-1',
        name: 'Rahul Sharma',
        phone: '+91 98451 98234',
        email: 'rahul.sharma@techcorp.in',
        purpose: 'Buy',
        preferredCity: 'Bangalore',
        budget: '₹ 1.5 Cr - ₹ 3.0 Crore',
        propertyTitle: '3 BHK Luxury Apartment in Godrej Splendour',
        propertyId: 'prop-1',
        timestamp: '21 Sep 2026, 11:30 AM',
        source: 'Auto-Trigger Popup',
        status: 'New'
      },
      {
        id: 'lead-init-2',
        name: 'Priya Narayanan',
        phone: '+91 97422 11098',
        email: 'priya.n@consulting.com',
        purpose: 'Buy',
        preferredCity: 'Bangalore',
        budget: '₹ 80 L - ₹ 1.5 Crore',
        propertyTitle: 'Prestige Falcon City 2 BHK',
        timestamp: '20 Sep 2026, 04:15 PM',
        source: 'Property Detail Enquiry',
        status: 'Contacted'
      }
    ];
  });

  // Daily Owner Contact Unlock Tracking (Limit: 10 per day)
  const DAILY_OWNER_CONTACT_LIMIT = 10;
  const [unlockedPropertyIds, setUnlockedPropertyIds] = useState<string[]>(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const raw = localStorage.getItem(STORAGE_KEYS.OWNER_CONTACT_VIEWS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.date === today && Array.isArray(parsed.unlockedIds)) {
          return parsed.unlockedIds;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Persist unlocked property IDs with today's date
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(
      STORAGE_KEYS.OWNER_CONTACT_VIEWS,
      JSON.stringify({ date: today, unlockedIds: unlockedPropertyIds })
    );
  }, [unlockedPropertyIds]);

  const handleRecordOwnerContactView = (propertyId: string, client: { name: string; phone: string; email: string }) => {
    if (!unlockedPropertyIds.includes(propertyId)) {
      if (unlockedPropertyIds.length >= DAILY_OWNER_CONTACT_LIMIT) {
        return false;
      }
      setUnlockedPropertyIds((prev) => [...prev, propertyId]);
    }
    return true;
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_PROPERTIES, JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPARE_PROPERTIES, JSON.stringify(compareIds));
  }, [compareIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SITE_VISITS, JSON.stringify(siteVisits));
  }, [siteVisits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VISITOR_LEADS, JSON.stringify(visitorLeads));
  }, [visitorLeads]);

  // Primary Filters State
  const [filters, setFilters] = useState<FilterState>({
    purpose: 'buy',
    category: 'residential',
    city: 'All India',
    searchQuery: '',
    propertyTypes: [],
    bhk: [],
    budgetMin: 0,
    budgetMax: 0,
    postedBy: [],
    furnishing: [],
    possession: [],
    verifiedOnly: false,
    withPhotosOnly: false,
    selectedAmenities: [],
    sortBy: 'relevance'
  });

  // User Accounts (Buyers, Sellers, Agents, Staff, Developer)
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('NS_USERS_ACCOUNTS');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USERS;
  });

  // Locations and Google Maps
  const [locations, setLocations] = useState<LocationMapConfig[]>(() => {
    try {
      const saved = localStorage.getItem('NS_LOCATIONS_MAP');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_LOCATIONS;
  });

  // Subscriptions & Plans
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(() => {
    try {
      const saved = localStorage.getItem('NS_SUBSCRIPTIONS');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SUBSCRIPTION_PLANS;
  });

  // Payment Invoices
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('NS_INVOICES');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_INVOICES;
  });

  // Bug Tickets / Issues for Developer
  const [bugTickets, setBugTickets] = useState<BugTicket[]>(() => {
    try {
      const saved = localStorage.getItem('NS_BUG_TICKETS');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BUG_TICKETS;
  });

  // Plans & Offers Module State (Requirement 1, 2, 3, 6)
  const [offers, setOffers] = useState<Offer[]>(() => {
    try {
      const saved = localStorage.getItem('NS_PROPERTIES_OFFERS');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_OFFERS;
  });

  const [offerEnquiries, setOfferEnquiries] = useState<OfferEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem('NS_OFFER_ENQUIRIES');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_OFFER_ENQUIRIES;
  });

  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);

  // Modals & Drawers state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [visitTargetProperty, setVisitTargetProperty] = useState<Property | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isMarketTrendsOpen, setIsMarketTrendsOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLeadCaptureOpen, setIsLeadCaptureOpen] = useState(false);
  const [isLeadsAdminOpen, setIsLeadsAdminOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOwnerConsoleOpen, setIsOwnerConsoleOpen] = useState(false);
  const [isDeveloperConsoleOpen, setIsDeveloperConsoleOpen] = useState(false);
  const [isStaffConsoleOpen, setIsStaffConsoleOpen] = useState(false);
  const [isUserHubOpen, setIsUserHubOpen] = useState(false);
  const [userHubTab, setUserHubTab] = useState<'activity' | 'profile' | 'service' | 'feedback' | 'security' | 'communication'>('activity');
  const [userHubSubTab, setUserHubSubTab] = useState<'contacted' | 'shortlisted' | 'viewed'>('contacted');
  const [viewedPropertyHistory, setViewedPropertyHistory] = useState<{ propertyId: string; viewedAt: string }[]>(() => {
    try {
      const raw = localStorage.getItem('NS_VIEWED_PROPERTIES_HISTORY');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const handleTrackViewProperty = (prop: Property) => {
    setSelectedProperty(prop);
    const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    setViewedPropertyHistory((prev) => {
      const filtered = prev.filter((p) => p.propertyId !== prop.id);
      const updated = [{ propertyId: prop.id, viewedAt: nowStr }, ...filtered].slice(0, 40);
      try {
        localStorage.setItem('NS_VIEWED_PROPERTIES_HISTORY', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleClearViewedHistory = () => {
    setViewedPropertyHistory([]);
    try {
      localStorage.removeItem('NS_VIEWED_PROPERTIES_HISTORY');
    } catch {}
  };

  const [brochureProperty, setBrochureProperty] = useState<Property | null>(null);
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);

  const handleOpenBrochure = (prop: Property) => {
    setBrochureProperty(prop);
    setIsBrochureModalOpen(true);
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => !getActiveSession());
  const [authModalTab, setAuthModalTab] = useState<'public' | 'private'>('public');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<AppUserSession | null>(() => getActiveSession());
  const [activeCategoryNav, setActiveCategoryNav] = useState<'apartments' | 'plots' | 'commercial' | 'projects'>('apartments');
  const [activeBudgetLabel, setActiveBudgetLabel] = useState<string>('');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem('NS_DEV_MAINTENANCE_CONFIG');
      if (raw) return JSON.parse(raw).enabled;
    } catch {}
    return false;
  });
  const [savedDrawerTab, setSavedDrawerTab] = useState<'saved' | 'visits'>('saved');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isDeveloperMode, setIsDeveloperMode] = useState<boolean>(() => isDeveloperModeActive());

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      apartments: properties.filter(p => p.category === 'residential' && (p.type === 'apartment' || p.type === 'penthouse' || p.type === 'villa' || p.type === 'independent-house')).length,
      plots: properties.filter(p => p.category === 'plots' || p.type === 'plot').length,
      commercial: properties.filter(p => p.category === 'commercial' || p.type.startsWith('commercial')).length,
      projects: properties.filter(p => p.isFeatured || p.isExclusive || p.builderName).length
    };
  }, [properties]);

  const handleSelectCategoryNav = (cat: 'apartments' | 'plots' | 'commercial' | 'projects') => {
    setActiveCategoryNav(cat);
    if (cat === 'apartments') {
      setFilters(prev => ({
        ...prev,
        category: 'residential',
        propertyTypes: ['apartment', 'penthouse']
      }));
    } else if (cat === 'plots') {
      setFilters(prev => ({
        ...prev,
        category: 'plots',
        propertyTypes: ['plot']
      }));
    } else if (cat === 'commercial') {
      setFilters(prev => ({
        ...prev,
        category: 'commercial',
        propertyTypes: ['commercial-office', 'commercial-shop']
      }));
    } else if (cat === 'projects') {
      setFilters(prev => ({
        ...prev,
        category: 'residential',
        propertyTypes: [],
        verifiedOnly: true
      }));
    }
    const element = document.getElementById('listings-feed');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectLocality = (locality: string, city: string) => {
    setFilters(prev => ({
      ...prev,
      city: city,
      searchQuery: locality
    }));
    const element = document.getElementById('listings-feed');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectBudget = (min: number, max: number, label: string) => {
    setActiveBudgetLabel(label);
    setFilters(prev => ({
      ...prev,
      budgetMin: min,
      budgetMax: max
    }));
    const element = document.getElementById('listings-feed');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenAuth = (tab: 'public' | 'private' = 'public') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (session: AppUserSession, openDashboardType?: 'owner' | 'developer' | 'staff') => {
    setActiveSession(session);
    setIsAuthModalOpen(false);
    if (openDashboardType === 'owner' || session.role === 'owner') {
      setIsOwnerConsoleOpen(true);
    } else if (openDashboardType === 'developer' || session.role === 'developer') {
      setDeveloperModeActive(true);
      setIsDeveloperMode(true);
      setIsDeveloperConsoleOpen(true);
    } else if (openDashboardType === 'staff' || session.role === 'staff') {
      setIsStaffConsoleOpen(true);
    }
  };

  const handleLogout = () => {
    clearActiveSession();
    setActiveSession(null);
    setIsOwnerConsoleOpen(false);
    setIsDeveloperConsoleOpen(false);
    setIsStaffConsoleOpen(false);
    setDeveloperModeActive(false);
    setIsDeveloperMode(false);
  };

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem('NS_USERS_ACCOUNTS', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('NS_LOCATIONS_MAP', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('NS_SUBSCRIPTIONS', JSON.stringify(subscriptionPlans));
  }, [subscriptionPlans]);

  useEffect(() => {
    localStorage.setItem('NS_INVOICES', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('NS_BUG_TICKETS', JSON.stringify(bugTickets));
  }, [bugTickets]);

  useEffect(() => {
    localStorage.setItem('NS_PROPERTIES_OFFERS', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('NS_OFFER_ENQUIRIES', JSON.stringify(offerEnquiries));
  }, [offerEnquiries]);

  // Listen for shortcuts: Ctrl+Shift+O (Owner Console) & Ctrl+Shift+D (Developer Console)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        if (activeSession?.role === 'owner') {
          setIsOwnerConsoleOpen((prev) => !prev);
        } else {
          handleOpenAuth('private');
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (activeSession?.role === 'developer') {
          setIsDeveloperConsoleOpen((prev) => !prev);
        } else {
          handleOpenAuth('private');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSession]);

  // Auto-trigger polite lead capture popup after 12 seconds if not dismissed
  useEffect(() => {
    const isDismissed = sessionStorage.getItem(STORAGE_KEYS.LEAD_POPUP_DISMISSED);
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsLeadCaptureOpen(true);
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseLeadCapture = () => {
    setIsLeadCaptureOpen(false);
    sessionStorage.setItem(STORAGE_KEYS.LEAD_POPUP_DISMISSED, 'true');
  };

  const handleLeadCaptureSubmit = (newLead: VisitorLead) => {
    setVisitorLeads((prev) => [newLead, ...prev]);
    sessionStorage.setItem(STORAGE_KEYS.LEAD_POPUP_DISMISSED, 'true');
  };

  const handleUpdateLeadStatus = (id: string, status: VisitorLead['status']) => {
    setVisitorLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
  };

  const handleDeleteLead = (id: string) => {
    setVisitorLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const handleClearAllLeads = () => {
    setVisitorLeads([]);
  };

  // Submit Enquiry for an Offer (Requirement 1, 2, 6, 8)
  const handleOfferEnquirySubmit = (lead: VisitorLead) => {
    handleLeadCaptureSubmit(lead);

    if (selectedOffer) {
      const newEnquiry: OfferEnquiry = {
        id: `enq-${Date.now()}`,
        offerId: selectedOffer.id,
        offerTitle: selectedOffer.title,
        customerName: lead.name,
        customerPhone: lead.phone,
        customerEmail: lead.email,
        status: 'New',
        assignedStaffName: 'Vikram Aditya',
        createdAt: new Date().toISOString(),
        notes: lead.notes || `Claiming discount: ${selectedOffer.discountType === 'percentage' ? `${selectedOffer.discountValue}%` : `₹${selectedOffer.discountValue}`}`
      };

      setOfferEnquiries((prev) => [newEnquiry, ...prev]);

      setOffers((prevOffers) =>
        prevOffers.map((o) =>
          o.id === selectedOffer.id
            ? {
                ...o,
                enquiriesCount: (o.enquiriesCount || 0) + 1,
                usageCount: Math.min(o.usageLimit || 999, (o.usageCount || 0) + 1)
              }
            : o
        )
      );

      logOfferActivity({
        action: 'ENQUIRY_RECEIVED',
        entityType: 'offer',
        entityId: selectedOffer.id,
        title: selectedOffer.title,
        performedBy: lead.name,
        userRole: 'customer',
        details: `Customer enquiry submitted for "${selectedOffer.title}" by ${lead.phone}`
      });
    }
  };

  // Property Selection and Toggle Handlers
  const handleToggleSave = (prop: Property) => {
    setSavedIds((prev) =>
      prev.includes(prop.id) ? prev.filter((id) => id !== prop.id) : [...prev, prop.id]
    );
  };

  const handleToggleCompare = (prop: Property) => {
    setCompareIds((prev) => {
      if (prev.includes(prop.id)) {
        return prev.filter((id) => id !== prop.id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 properties at a time.');
        return prev;
      }
      return [...prev, prop.id];
    });
  };

  const handlePropertyAdded = (newProp: Property) => {
    const updated = [newProp, ...properties];
    setProperties(updated);
    try {
      const existingUser = localStorage.getItem(STORAGE_KEYS.USER_PROPERTIES);
      const parsed = existingUser ? JSON.parse(existingUser) : [];
      localStorage.setItem(STORAGE_KEYS.USER_PROPERTIES, JSON.stringify([newProp, ...parsed]));
    } catch (e) {
      console.error(e);
    }
    // Switch filter city and select newly posted property
    setFilters((prev) => ({ ...prev, city: newProp.city, searchQuery: '' }));
    setSelectedProperty(newProp);
  };

  const handleConfirmVisit = (visit: SiteVisitRequest) => {
    setSiteVisits((prev) => [visit, ...prev]);

    // Automatically record client lead in Admin dashboard
    const visitLead: VisitorLead = {
      id: `lead-visit-${visit.id}`,
      name: visit.name,
      phone: visit.phone,
      email: visit.email || `${visit.phone.replace(/\D/g, '')}@visit.nsproperties.in`,
      purpose: 'Site Visit',
      preferredCity: filters.city !== 'All India' ? filters.city : 'Bangalore',
      propertyTitle: visit.propertyTitle,
      propertyId: visit.propertyId,
      timestamp: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      source: 'Schedule Visit',
      status: 'Visit Scheduled',
      notes: `Scheduled date: ${visit.date} (${visit.timeSlot}). ${visit.notes || ''}`
    };

    setVisitorLeads((prev) => [visitLead, ...prev]);
  };

  const handleCancelVisit = (id: string) => {
    setSiteVisits((prev) => prev.filter((v) => v.id !== id));
  };

  // Filter properties logic
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Purpose
      if (filters.purpose && prop.purpose !== filters.purpose) return false;

      // Category
      if (filters.category && prop.category !== filters.category) return false;

      // City
      if (filters.city && filters.city !== 'All India' && prop.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }

      // Search Query (Locality, Project, Builder, Description)
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesLocality = prop.locality.toLowerCase().includes(q);
        const matchesCity = prop.city.toLowerCase().includes(q);
        const matchesProject = prop.projectName?.toLowerCase().includes(q);
        const matchesBuilder = prop.builderName?.toLowerCase().includes(q);
        const matchesTitle = prop.title.toLowerCase().includes(q);
        const matchesDesc = prop.description.toLowerCase().includes(q);
        const matchesPosted = prop.postedBy.toLowerCase().includes(q);
        const matchesPossession = prop.possession.toLowerCase().includes(q);

        if (
          !matchesLocality &&
          !matchesCity &&
          !matchesProject &&
          !matchesBuilder &&
          !matchesTitle &&
          !matchesDesc &&
          !matchesPosted &&
          !matchesPossession
        ) {
          return false;
        }
      }

      // Property Types
      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(prop.type)) {
        return false;
      }

      // BHK
      if (filters.bhk.length > 0) {
        const matchesBhk = filters.bhk.some((b) => (b >= 5 ? prop.bhk >= 5 : prop.bhk === b));
        if (!matchesBhk) return false;
      }

      // Budget Max
      if (filters.budgetMax > 0 && prop.price > filters.budgetMax) {
        return false;
      }

      // Posted By
      if (filters.postedBy.length > 0 && !filters.postedBy.includes(prop.postedBy)) {
        return false;
      }

      // Furnishing
      if (filters.furnishing.length > 0 && !filters.furnishing.includes(prop.furnishing)) {
        return false;
      }

      // Possession
      if (filters.possession.length > 0 && !filters.possession.includes(prop.possession)) {
        return false;
      }

      // Verified Only
      if (filters.verifiedOnly && !prop.isVerified) {
        return false;
      }

      // With Photos Only
      if (filters.withPhotosOnly && (!prop.images || prop.images.length === 0)) {
        return false;
      }

      // Amenities
      if (filters.selectedAmenities.length > 0) {
        const hasAllAmenities = filters.selectedAmenities.every((a) =>
          prop.amenities.some((pa) => pa.toLowerCase().includes(a.toLowerCase()))
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'area_desc') return b.areaSqFt - a.areaSqFt;
      if (filters.sortBy === 'recent') return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      return 0; // relevance
    });
  }, [properties, filters]);

  const savedPropertyList = useMemo(() => {
    return properties.filter((p) => savedIds.includes(p.id));
  }, [properties, savedIds]);

  const comparePropertyList = useMemo(() => {
    return properties.filter((p) => compareIds.includes(p.id));
  }, [properties, compareIds]);

  const resetFilters = () => {
    setFilters({
      purpose: 'buy',
      category: 'residential',
      city: 'All India',
      searchQuery: '',
      propertyTypes: [],
      bhk: [],
      budgetMin: 0,
      budgetMax: 0,
      postedBy: [],
      furnishing: [],
      possession: [],
      verifiedOnly: false,
      withPhotosOnly: false,
      selectedAmenities: [],
      sortBy: 'relevance'
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Maintenance Mode Public Notification Banner */}
      {isMaintenanceMode && (
        <div className="bg-amber-500 text-black px-4 py-2 font-mono-luxury text-xs flex flex-wrap items-center justify-between gap-3 shadow-md border-b-2 border-black z-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-black animate-ping" />
            <span className="font-bold">
              ⚠️ SCHEDULED SYSTEM MAINTENANCE ENGAGED: Engineering team is performing database and read-replica index upgrades.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDeveloperConsoleOpen(true)}
              className="px-2.5 py-1 bg-black text-amber-300 hover:bg-neutral-800 uppercase text-[10px] font-bold tracking-wider cursor-pointer"
            >
              Developer Console
            </button>
            <button
              onClick={() => setIsMaintenanceMode(false)}
              className="px-2 py-0.5 bg-black/20 hover:bg-black/30 text-black text-[10px] uppercase font-bold cursor-pointer"
              title="Dismiss banner"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <Header
        selectedCity={filters.city}
        onSelectCity={(city) => setFilters((prev) => ({ ...prev, city }))}
        savedCount={savedIds.length}
        compareCount={compareIds.length}
        onOpenSaved={() => {
          setSavedDrawerTab('saved');
          setIsSavedDrawerOpen(true);
        }}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onOpenPostProperty={() => setIsPostModalOpen(true)}
        onOpenEmiCalc={() => setIsEmiModalOpen(true)}
        onOpenMarketTrends={() => setIsMarketTrendsOpen(true)}
        onOpenVisits={() => {
          setSavedDrawerTab('visits');
          setIsSavedDrawerOpen(true);
        }}
        scheduledVisitsCount={siteVisits.length}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        onOpenAuthModal={(tab) => handleOpenAuth(tab || 'public')}
        activeSession={activeSession}
        onLogout={handleLogout}
        onOpenOwnerConsole={() => setIsOwnerConsoleOpen(true)}
        onOpenDeveloperConsole={() => setIsDeveloperConsoleOpen(true)}
        onOpenStaffConsole={() => setIsStaffConsoleOpen(true)}
        onOpenUserHub={(tab, subTab) => {
          if (tab) setUserHubTab(tab);
          if (subTab) setUserHubSubTab(subTab);
          setIsUserHubOpen(true);
        }}
        activeCategory={activeCategoryNav}
        onSelectCategory={handleSelectCategoryNav}
        onOpenPlansModal={() => setIsPlansModalOpen(true)}
        onOpenOffers={() => {
          const el = document.getElementById('offers-deals-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Hero Banner Search Bar */}
      <HeroSearch
        purpose={filters.purpose}
        onSelectPurpose={(p) => setFilters((prev) => ({ ...prev, purpose: p }))}
        category={filters.category || 'residential'}
        onSelectCategory={(c) => setFilters((prev) => ({ ...prev, category: c }))}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
        selectedBhk={filters.bhk}
        onToggleBhk={(bhk) =>
          setFilters((prev) => ({
            ...prev,
            bhk: prev.bhk.includes(bhk) ? prev.bhk.filter((b) => b !== bhk) : [...prev.bhk, bhk]
          }))
        }
        budgetMax={filters.budgetMax}
        onSelectBudgetMax={(v) => setFilters((prev) => ({ ...prev, budgetMax: v }))}
        propertyType={filters.propertyTypes[0] || 'all'}
        onSelectPropertyType={(type) =>
          setFilters((prev) => ({
            ...prev,
            propertyTypes: type === 'all' ? [] : [type]
          }))
        }
        onSearchSubmit={() => {}}
        totalResultsCount={filteredProperties.length}
      />

      {/* 1. Category Quick Nav: Apartments • Plots & Land • Commercial Properties • Projects */}
      <CategoryQuickNav
        activeCategory={activeCategoryNav}
        onSelectCategory={handleSelectCategoryNav}
        counts={categoryCounts}
      />

      {/* 2. Featured Properties Section */}
      <FeaturedPropertiesShowcase
        properties={properties}
        onSelectProperty={(p) => handleTrackViewProperty(p)}
        onScheduleVisit={(p) => setVisitTargetProperty(p)}
        onToggleSave={handleToggleSave}
        onOpenBrochure={handleOpenBrochure}
        savedIds={savedIds}
      />

      {/* 2.5 Luxury Plans & Special Offers Section (Requirement 2) */}
      <OffersSection
        offers={offers}
        properties={properties}
        onOpenOfferDetails={(offer) => setSelectedOffer(offer)}
        onSelectProperty={(p) => handleTrackViewProperty(p)}
        onOpenPlansModal={() => setIsPlansModalOpen(true)}
      />

      {/* 3. Properties by Location */}
      <PropertiesByLocation
        currentCity={filters.city}
        onSelectCity={(city) => setFilters((prev) => ({ ...prev, city, searchQuery: '' }))}
        onSelectLocality={handleSelectLocality}
      />

      {/* 4. Properties by Budget */}
      <PropertiesByBudget
        activeBudgetLabel={activeBudgetLabel}
        onSelectBudget={handleSelectBudget}
      />

      {/* 5. Contact NS Properties Banner */}
      <ContactNSPropertiesBanner
        onOpenContactModal={() => setIsContactModalOpen(true)}
      />

      {/* Main App Feed Section */}
      <main id="listings-feed" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header result row */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 pb-4 mb-6 border-b border-[#1a1a1a]">
          <div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1a1a1a]">
              Found {filteredProperties.length} Properties {filters.city !== 'All India' ? `in ${filters.city}` : 'in Metros'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="editorial-label text-[#1a1a1a]/60">
                {filters.purpose === 'buy' ? 'Sale' : 'Rent'}
              </span>
              <span className="text-[#1a1a1a]/40">•</span>
              <span className="editorial-label text-[#c4a47c] font-bold">
                Curated Luxury & Verified
              </span>
            </div>
          </div>

          {/* Sort & Mobile Filter trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[#fdfcf9] border border-[#1a1a1a] text-xs font-mono-luxury uppercase text-[#1a1a1a] cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter ({filteredProperties.length})
            </button>

            <div className="flex items-center gap-2 text-xs font-mono-luxury uppercase border border-[#1a1a1a] px-3 py-1.5 bg-[#fdfcf9]">
              <span className="text-[#1a1a1a]/60">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))
                }
                className="font-bold text-[#1a1a1a] bg-transparent focus:outline-hidden cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="area_desc">Area: Largest First</option>
                <option value="recent">Recently Added</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout Grid: Sidebar + Listings */}
        <div className="flex items-start gap-8">
          {/* Left Desktop Filters Sidebar */}
          <FilterSidebar
            filters={filters}
            onUpdateFilters={(updates) => setFilters((prev) => ({ ...prev, ...updates }))}
            onResetFilters={resetFilters}
            isOpenMobile={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
            totalMatches={filteredProperties.length}
          />

          {/* Right Listings Column */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Active filters badges banner */}
            {(filters.city !== 'All India' ||
              filters.searchQuery ||
              filters.bhk.length > 0 ||
              filters.budgetMax > 0 ||
              filters.verifiedOnly ||
              filters.postedBy.length > 0) && (
              <div className="bg-[#fdfcf9] p-3 border border-[#1a1a1a] flex flex-wrap items-center gap-2 text-xs font-mono-luxury">
                <span className="text-[#1a1a1a]/60 uppercase text-[10px] font-bold">Active:</span>
                {filters.city !== 'All India' && (
                  <span className="editorial-badge bg-[#1a1a1a] text-[#fdfcf9] flex items-center gap-1.5">
                    City: {filters.city}
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, city: 'All India' }))}
                      className="hover:text-red-400 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.searchQuery && (
                  <span className="editorial-badge bg-[#1a1a1a] text-[#fdfcf9] flex items-center gap-1.5">
                    "{filters.searchQuery}"
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                      className="hover:text-red-400 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.bhk.length > 0 && (
                  <span className="editorial-badge bg-[#1a1a1a] text-[#fdfcf9] flex items-center gap-1.5">
                    BHK: {filters.bhk.join(', ')}
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, bhk: [] }))}
                      className="hover:text-red-400 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.verifiedOnly && (
                  <span className="editorial-badge bg-[#e2f4ea] text-[#1e4620] border-0 flex items-center gap-1.5">
                    RERA Verified
                    <button
                      onClick={() => setFilters((prev) => ({ ...prev, verifiedOnly: false }))}
                      className="hover:text-red-600 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="editorial-label text-[10px] text-[#1a1a1a]/70 hover:text-red-600 underline underline-offset-2 ml-auto cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Results Header Count */}
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm sm:text-base font-bold text-slate-800">
                {filteredProperties.length}{' '}
                {filteredProperties.length === 1 ? 'Property' : 'Properties'} Available in{' '}
                {filters.city === 'All India' ? 'Top Indian Metros' : filters.city}
              </h2>
              <span className="text-xs text-slate-500">
                Showing genuine owner & verified builder listings
              </span>
            </div>

            {/* Property Cards List */}
            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No Matching Properties Found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your budget, BHK configuration, or search for a broader locality.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-[#005CA8] hover:bg-[#004780] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    isSaved={savedIds.includes(prop.id)}
                    isCompared={compareIds.includes(prop.id)}
                    onToggleSave={handleToggleSave}
                    onToggleCompare={handleToggleCompare}
                    onSelectProperty={(p) => handleTrackViewProperty(p)}
                    onScheduleVisit={(p) => setVisitTargetProperty(p)}
                    onOpenBrochure={handleOpenBrochure}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Compare Banner when properties are selected */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-full px-5 py-2.5 shadow-2xl flex items-center gap-4 border border-slate-700 animate-in slide-in-from-bottom">
          <div className="flex items-center gap-2 text-xs">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="font-bold">{compareIds.length}</span> of 3 Properties Selected
          </div>
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-3.5 py-1 bg-[#005CA8] hover:bg-[#004780] text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
          >
            Compare Now
          </button>
          <button
            onClick={() => setCompareIds([])}
            className="text-slate-400 hover:text-white text-xs cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {/* Footer in Variation 2 Luxury Architectural Style */}
      <footer className="mt-16 bg-[#fdfcf9] border-t-[1.5px] border-[#1a1a1a] text-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="font-mono-luxury w-7 h-7 bg-[#1a1a1a] text-[#fdfcf9] flex items-center justify-center font-bold text-xs">
                  NS
                </div>
                <span className="font-serif-luxury font-bold text-xl text-[#1a1a1a]">NS Properties</span>
              </div>
              <p className="editorial-label text-[#1a1a1a]/60 text-[11px] normal-case leading-relaxed">
                India's premier real estate platform connecting home buyers, tenants, owners and verified builders. 
                Experience transparent pricing and RERA compliant homes.
              </p>
              <div className="mt-3 font-mono-luxury text-xs text-[#c4a47c] font-bold">
                +91 80732 66325
              </div>
            </div>

            <div>
              <span className="editorial-label font-bold text-[#1a1a1a] mb-2.5 uppercase tracking-wider text-[11px] block">
                Top Cities
              </span>
              <ul className="space-y-1.5 font-mono-luxury text-xs">
                {['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai'].map((c) => (
                  <li key={c}>
                    <button
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, city: c }));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-[#c4a47c] cursor-pointer text-[#1a1a1a]/70"
                    >
                      Properties in {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="editorial-label font-bold text-[#1a1a1a] mb-2.5 uppercase tracking-wider text-[11px] block">
                Calculators & Tools
              </span>
              <ul className="space-y-1.5 font-mono-luxury text-xs">
                <li>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('offers-deals-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }} 
                    className="hover:text-[#c4a47c] cursor-pointer text-[#1a1a1a] font-bold flex items-center gap-1.5"
                  >
                    <span>Special Offers & Festive Deals</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setIsPlansModalOpen(true)} 
                    className="hover:text-[#c4a47c] cursor-pointer text-[#1a1a1a] font-bold flex items-center gap-1.5"
                  >
                    <span>Agent & Builder Plans</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsEmiModalOpen(true)} className="hover:text-[#c4a47c] cursor-pointer text-[#1a1a1a]/70">
                    Home Loan EMI Calculator
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsMarketTrendsOpen(true)} className="hover:text-[#c4a47c] cursor-pointer text-[#1a1a1a]/70">
                    City Price Trends & Heatmaps
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsCompareModalOpen(true)} className="hover:text-[#c4a47c] cursor-pointer text-[#1a1a1a]/70">
                    Property Comparison Engine
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setUserHubTab('activity');
                      setIsUserHubOpen(true);
                    }} 
                    className="hover:text-[#c4a47c] cursor-pointer text-[#1a1a1a]/70"
                  >
                    My Activity (Contacted & Viewed)
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setUserHubTab('service');
                      setIsUserHubOpen(true);
                    }} 
                    className="hover:text-[#c4a47c] cursor-pointer text-[#1a1a1a]/70"
                  >
                    24/7 Customer Service Desk
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setUserHubTab('feedback');
                      setIsUserHubOpen(true);
                    }} 
                    className="hover:text-[#c4a47c] cursor-pointer text-[#1a1a1a]/70"
                  >
                    Give App Feedback & Ratings
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setUserHubTab('profile');
                      setIsUserHubOpen(true);
                    }} 
                    className="hover:text-[#c4a47c] cursor-pointer text-[#1a1a1a]/70"
                  >
                    Manage Profile & Preferences
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsPostModalOpen(true)} className="hover:text-[#c4a47c] cursor-pointer text-[#1a1a1a]/70">
                    Post Free Property Ad
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsDownloadModalOpen(true)} className="hover:text-[#c4a47c] cursor-pointer font-bold text-[#1a1a1a]">
                    Download & Install App (PWA)
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsShareModalOpen(true)} className="hover:text-[#c4a47c] cursor-pointer font-bold text-[#c4a47c]">
                    Share App with Friends
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setIsSettingsOpen(true)} 
                    className="hover:text-[#c4a47c] cursor-pointer text-[#1a1a1a]/70 flex items-center gap-1.5"
                  >
                    <Settings className="w-3 h-3 text-[#c4a47c]" />
                    <span>App Preferences & Settings</span>
                  </button>
                </li>
                {/* Authorized Owner Console */}
                {activeSession?.role === 'owner' && (
                  <li>
                    <button 
                      onClick={() => setIsOwnerConsoleOpen(true)} 
                      className="hover:text-black cursor-pointer font-bold text-amber-950 bg-[#c4a47c]/20 hover:bg-[#c4a47c]/30 border border-[#c4a47c] px-2 py-1 flex items-center gap-1.5"
                    >
                      <Crown className="w-3.5 h-3.5 text-[#c4a47c]" />
                      <span>App Owner Master Console</span>
                    </button>
                  </li>
                )}

                {/* Authorized Developer Dashboard */}
                {activeSession?.role === 'developer' && (
                  <li>
                    <button 
                      onClick={() => setIsDeveloperConsoleOpen(true)} 
                      className="hover:text-cyan-900 cursor-pointer font-bold text-cyan-900 bg-cyan-50 border border-cyan-300 px-2 py-1 flex items-center gap-1.5"
                    >
                      <Terminal className="w-3.5 h-3.5 text-cyan-700" />
                      <span>Developer Dashboard (9 Tools)</span>
                    </button>
                  </li>
                )}

                {/* Authorized Staff Dashboard */}
                {activeSession?.role === 'staff' && (
                  <li>
                    <button 
                      onClick={() => setIsStaffConsoleOpen(true)} 
                      className="hover:text-emerald-900 cursor-pointer font-bold text-emerald-900 bg-emerald-50 border border-emerald-300 px-2 py-1 flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5 text-emerald-700" />
                      <span>👔 Staff & Agent Dashboard</span>
                    </button>
                  </li>
                )}

                {/* Contact NS Properties */}
                <li>
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="hover:text-[#c4a47c] cursor-pointer font-bold text-[#1a1a1a] flex items-center gap-1.5"
                  >
                    <Phone className="w-3 h-3 text-[#c4a47c]" />
                    <span>Contact NS Properties Support</span>
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => {
                      const msg = `Hello NS Properties team, I need help finding a verified property.`;
                      openWhatsAppChat(DEFAULT_CONTACT_PHONE, msg);
                    }}
                    className="hover:text-emerald-700 cursor-pointer font-bold text-emerald-600 flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Chat on WhatsApp ({DISPLAY_CONTACT_PHONE})</span>
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <span className="editorial-label font-bold text-[#1a1a1a] mb-2.5 uppercase tracking-wider text-[11px] block">
                RERA Compliance & Trust
              </span>
              <p className="editorial-label text-[#1a1a1a]/60 text-[11px] normal-case leading-relaxed">
                All RERA registered projects display registration numbers in accordance with respective State RERA authorities.
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-emerald-700 font-bold font-mono-luxury text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                100% Genuine Listing Assurance
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#1a1a1a]/15 flex flex-wrap items-center justify-between gap-2 text-[#1a1a1a]/50 font-mono-luxury text-[11px]">
            <span>© {new Date().getFullYear()} NS Properties. All rights reserved.</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsContactModalOpen(true)}
                className="text-[#1a1a1a]/60 hover:text-[#c4a47c] transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
              >
                <Phone className="w-3 h-3 text-[#c4a47c]" />
                <span>Contact Support</span>
              </button>
              <span className="text-[#1a1a1a]/20">•</span>
              <span className="text-[#1a1a1a]/40">Verified Real Estate Portal</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Dialogs */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          isSaved={savedIds.includes(selectedProperty.id)}
          isCompared={compareIds.includes(selectedProperty.id)}
          dailyViewsUsed={unlockedPropertyIds.length}
          dailyLimit={DAILY_OWNER_CONTACT_LIMIT}
          isOwnerUnlocked={unlockedPropertyIds.includes(selectedProperty.id)}
          onRecordOwnerContactView={handleRecordOwnerContactView}
          onToggleSave={handleToggleSave}
          onToggleCompare={handleToggleCompare}
          onOpenBrochure={(p) => handleOpenBrochure(p)}
          onScheduleVisit={(p) => {
            setSelectedProperty(null);
            setVisitTargetProperty(p);
          }}
          onCaptureLead={(leadData) => {
            const newLead: VisitorLead = {
              id: `lead-enq-${Date.now()}`,
              name: leadData.name,
              phone: leadData.phone,
              email: leadData.email,
              purpose: leadData.purpose || 'Buy',
              preferredCity: selectedProperty.city || 'Bangalore',
              propertyTitle: leadData.propertyTitle || selectedProperty.title,
              propertyId: leadData.propertyId || selectedProperty.id,
              timestamp: new Date().toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              source: leadData.source || 'Property Detail Enquiry',
              status: 'New'
            };
            handleLeadCaptureSubmit(newLead);
          }}
        />
      )}

      {/* Visitor Lead Capture Popup */}
      <LeadCaptureModal
        isOpen={isLeadCaptureOpen}
        onClose={handleCloseLeadCapture}
        onSubmitLead={handleLeadCaptureSubmit}
        selectedCity={filters.city !== 'All India' ? filters.city : 'Bangalore'}
      />

      {/* Admin Leads Management Dashboard (Developer & Owner Only) */}
      <LeadsAdminModal
        isOpen={isLeadsAdminOpen}
        onClose={() => setIsLeadsAdminOpen(false)}
        leads={visitorLeads}
        onUpdateLeadStatus={handleUpdateLeadStatus}
        onDeleteLead={handleDeleteLead}
        onClearAllLeads={handleClearAllLeads}
        onDeveloperModeChange={(active) => setIsDeveloperMode(active)}
      />

      {visitTargetProperty && (
        <SiteVisitModal
          property={visitTargetProperty}
          onClose={() => setVisitTargetProperty(null)}
          onConfirmVisit={handleConfirmVisit}
        />
      )}

      {isPostModalOpen && (
        <PostPropertyModal
          onClose={() => setIsPostModalOpen(false)}
          onPropertyAdded={handlePropertyAdded}
        />
      )}

      {isEmiModalOpen && (
        <EmiCalculatorModal
          onClose={() => setIsEmiModalOpen(false)}
        />
      )}

      {isCompareModalOpen && (
        <CompareModal
          properties={comparePropertyList}
          onClose={() => setIsCompareModalOpen(false)}
          onRemove={(id) => setCompareIds((prev) => prev.filter((i) => i !== id))}
          onSelectProperty={(p) => {
            setIsCompareModalOpen(false);
            setSelectedProperty(p);
          }}
        />
      )}

      {isMarketTrendsOpen && (
        <MarketTrendsModal
          onClose={() => setIsMarketTrendsOpen(false)}
        />
      )}

      {isDownloadModalOpen && (
        <DownloadAppModal
          onClose={() => setIsDownloadModalOpen(false)}
        />
      )}

      {isShareModalOpen && (
        <ShareAppModal
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {/* Settings & Leads Customer Option Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenCustomerLeads={() => {
          setIsSettingsOpen(false);
          setIsLeadsAdminOpen(true);
        }}
        leads={visitorLeads}
        selectedCity={filters.city !== 'All India' ? filters.city : 'Bangalore'}
        onSelectCity={(city) => setFilters((prev) => ({ ...prev, city }))}
        isDeveloperMode={isDeveloperMode}
        onToggleDeveloperMode={(active) => setIsDeveloperMode(active)}
        dailyViewsUsed={unlockedPropertyIds.length}
        dailyLimit={DAILY_OWNER_CONTACT_LIMIT}
        onResetDailyLimit={() => setUnlockedPropertyIds([])}
        onOpenOwnerConsole={() => {
          setIsSettingsOpen(false);
          setIsOwnerConsoleOpen(true);
        }}
        onOpenDeveloperConsole={() => {
          setIsSettingsOpen(false);
          setIsDeveloperConsoleOpen(true);
        }}
      />

      {/* App Owner Master Control Console (Full Access Superadmin) */}
      <OwnerMasterConsole
        isOpen={isOwnerConsoleOpen}
        onClose={() => setIsOwnerConsoleOpen(false)}
        properties={properties}
        onUpdateProperties={setProperties}
        leads={visitorLeads}
        onUpdateLeads={setVisitorLeads}
        users={users}
        onUpdateUsers={setUsers}
        locations={locations}
        onUpdateLocations={setLocations}
        subscriptionPlans={subscriptionPlans}
        onUpdateSubscriptionPlans={setSubscriptionPlans}
        invoices={invoices}
        onUpdateInvoices={setInvoices}
        bugTickets={bugTickets}
        onAddBugTicket={(ticket) => setBugTickets((prev) => [ticket, ...prev])}
        onOpenDeveloperConsole={() => {
          setIsOwnerConsoleOpen(false);
          setIsDeveloperConsoleOpen(true);
        }}
        offers={offers}
        onUpdateOffers={setOffers}
        offerEnquiries={offerEnquiries}
        onUpdateOfferEnquiries={setOfferEnquiries}
      />

      {/* Developer Dashboard (9 Subsystems & Restricted Technical Access) */}
      <DeveloperDashboard
        isOpen={isDeveloperConsoleOpen}
        onClose={() => setIsDeveloperConsoleOpen(false)}
        bugTickets={bugTickets}
        onUpdateBugTicketStatus={(id, status) => {
          setBugTickets((prev) =>
            prev.map((t) => (t.id === id ? { ...t, status } : t))
          );
        }}
        onOpenOwnerConsole={() => {
          setIsDeveloperConsoleOpen(false);
          setIsOwnerConsoleOpen(true);
        }}
        onMaintenanceModeChange={(active) => {
          setIsMaintenanceMode(active);
        }}
      />

      {/* Staff & Relationship Manager Dashboard */}
      <StaffDashboard
        isOpen={isStaffConsoleOpen}
        onClose={() => setIsStaffConsoleOpen(false)}
        leads={visitorLeads}
        onUpdateLeadStatus={handleUpdateLeadStatus}
        onAddLead={handleLeadCaptureSubmit}
        siteVisits={siteVisits}
        onConfirmVisit={handleConfirmVisit}
        properties={properties}
        onSelectProperty={(p) => setSelectedProperty(p)}
        staffName={activeSession?.name || 'Vikram Aditya'}
        onLogout={handleLogout}
        offers={offers}
        offerEnquiries={offerEnquiries}
      />

      {/* Normal User Account, Activity & Options Hub */}
      <UserAccountHubModal
        isOpen={isUserHubOpen}
        onClose={() => setIsUserHubOpen(false)}
        activeSession={activeSession}
        onUpdateSession={(updated) => setActiveSession(updated)}
        onLogout={handleLogout}
        properties={properties}
        savedPropertyIds={savedIds}
        onToggleSaveProperty={handleToggleSave}
        viewedPropertyHistory={viewedPropertyHistory}
        onClearViewedHistory={handleClearViewedHistory}
        visitorLeads={visitorLeads}
        onSelectProperty={(p) => handleTrackViewProperty(p)}
        onOpenScheduleVisit={(p) => setVisitTargetProperty(p)}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        initialTab={userHubTab}
        initialActivitySubTab={userHubSubTab}
        offers={offers}
        offerEnquiries={offerEnquiries}
      />

      {/* Official Project Brochure Download & Lead Modal */}
      <ProjectBrochureModal
        isOpen={isBrochureModalOpen}
        onClose={() => setIsBrochureModalOpen(false)}
        property={brochureProperty}
        activeSession={activeSession}
        onCaptureLead={(leadData) => {
          const newLead: VisitorLead = {
            id: `lead-brochure-${Date.now()}`,
            name: leadData.name,
            phone: leadData.phone,
            email: leadData.email,
            purpose: 'Brochure',
            preferredCity: brochureProperty?.city || 'Bangalore',
            propertyTitle: leadData.propertyTitle || brochureProperty?.title || 'Project Brochure',
            propertyId: leadData.propertyId || brochureProperty?.id || '',
            timestamp: new Date().toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            source: 'Brochure Download',
            status: 'New'
          };
          handleLeadCaptureSubmit(newLead);
        }}
      />

      {/* User Login / Register & Private Dashboards Gateway */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        usersList={users}
        initialTab={authModalTab}
      />

      {/* Contact NS Properties Modal */}
      <ContactUsModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSubmitInquiry={handleLeadCaptureSubmit}
        selectedCity={filters.city !== 'All India' ? filters.city : 'Bangalore'}
      />

      {/* Curated Offer Detail & Booking Enquiries Modal (Requirement 1, 2) */}
      <OfferDetailModal
        isOpen={!!selectedOffer}
        onClose={() => setSelectedOffer(null)}
        offer={selectedOffer}
        properties={properties}
        onSelectProperty={(p) => {
          setSelectedOffer(null);
          handleTrackViewProperty(p);
        }}
        onSubmitEnquiry={handleOfferEnquirySubmit}
      />

      {/* Subscription Plans Modal (Agents & Builders) (Requirement 3) */}
      <SubscriptionPlansModal
        isOpen={isPlansModalOpen}
        onClose={() => setIsPlansModalOpen(false)}
        plans={subscriptionPlans}
        currentUser={users.find((u) => u.email === activeSession?.email) || null}
      />

      {/* Saved / Shortlist & Visits Drawer */}
      <SavedDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedProperties={savedPropertyList}
        onRemoveSaved={(id) => setSavedIds((prev) => prev.filter((i) => i !== id))}
        onSelectProperty={(p) => setSelectedProperty(p)}
        siteVisits={siteVisits}
        onCancelVisit={handleCancelVisit}
        activeTab={savedDrawerTab}
        onTabChange={setSavedDrawerTab}
      />

      {/* Floating Instant WhatsApp Help Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => {
            const msg = `Hello NS Properties Team! I have a question about properties / scheduling a visit on your portal.`;
            openWhatsAppChat(DEFAULT_CONTACT_PHONE, msg);
          }}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 cursor-pointer group"
          title="Chat with property advisor on WhatsApp"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-bold pr-1">WhatsApp Chat</span>
        </button>
      </div>

      {/* Floating Developer Indicator ONLY when logged in as Developer or Owner */}
      {(activeSession?.role === 'developer' || activeSession?.role === 'owner') && isDeveloperMode && (
        <div className="fixed bottom-5 left-5 z-40">
          <div className="bg-[#1a1a1a] text-[#fdfcf9] border border-[#c4a47c] shadow-2xl px-3 py-2 flex items-center gap-2.5 font-mono-luxury text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#c4a47c] font-bold uppercase tracking-wider">Dev Mode Active</span>
              <span className="text-[9px] text-[#fdfcf9]/70">{getDeveloperEmail()}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOwnerConsoleOpen(true)}
              className="px-2 py-1 bg-[#c4a47c] text-black font-bold text-[10px] uppercase hover:bg-[#b09066] transition-colors cursor-pointer border border-black"
              title="Open App Owner Master Console"
            >
              👑 Owner
            </button>
            <button
              type="button"
              onClick={() => setIsDeveloperConsoleOpen(true)}
              className="px-2 py-1 bg-cyan-900 text-cyan-200 font-bold text-[10px] uppercase hover:bg-cyan-800 transition-colors cursor-pointer border border-cyan-400/40"
              title="Open Developer Technical Console"
            >
              💻 Dev Tech
            </button>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="px-2 py-1 bg-white/10 text-white font-bold text-[10px] uppercase hover:bg-white/20 transition-colors cursor-pointer border border-white/20"
              title="Open Settings & Leads Customer Option"
            >
              Settings
            </button>
            <button
              type="button"
              onClick={() => setIsLeadsAdminOpen(true)}
              className="px-2 py-1 bg-[#c4a47c] text-[#1a1a1a] font-bold text-[10px] uppercase hover:bg-[#b09066] transition-colors cursor-pointer"
            >
              Leads ({visitorLeads.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setDeveloperModeActive(false);
                setIsDeveloperMode(false);
                sessionStorage.removeItem('NS_LEADS_OWNER_AUTH');
              }}
              className="text-[#fdfcf9]/60 hover:text-white p-1 cursor-pointer text-xs"
              title="Exit Dev Mode (hide leads from this screen)"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
