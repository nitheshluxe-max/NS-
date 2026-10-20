import React, { useState, useMemo } from 'react';
import { 
  X, 
  Building2, 
  Users, 
  DollarSign, 
  MapPin, 
  Image, 
  Video, 
  BarChart3, 
  UserCheck, 
  ShieldAlert, 
  CreditCard, 
  Settings, 
  Bell, 
  Trash2, 
  Edit3, 
  Plus, 
  Check, 
  Search, 
  Copy,
  Download, 
  Phone, 
  Mail, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Lock, 
  Unlock, 
  Layers, 
  Tag, 
  Percent, 
  RefreshCw, 
  FileSpreadsheet, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  Globe,
  Navigation,
  Wrench,
  Send,
  MessageSquare
} from 'lucide-react';
import { 
  Property, 
  VisitorLead, 
  UserAccount, 
  LocationMapConfig, 
  SubscriptionPlan, 
  InvoiceRecord, 
  BugTicket,
  UserRole,
  Offer,
  OfferEnquiry,
  PropertyPublishStatus
} from '../types';
import { ROLE_PERMISSIONS } from '../data/ownerDeveloperData';
import { openWhatsAppChat } from '../utils/whatsapp';
import { PUBLIC_SHARED_APP_URL } from '../utils/shareUrl';
import { OwnerPlansOffersManager } from './OwnerPlansOffersManager';
import {
  createPropertyInCentralDb,
  updatePropertyInCentralDb,
  updatePropertyStatusInCentralDb,
  deletePropertyFromCentralDb,
  bulkPriceAdjustmentInCentralDb,
  addMediaToPropertyInCentralDb
} from '../services/propertyService';

interface OwnerMasterConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onUpdateProperties: (props: Property[]) => void;
  onRefreshProperties?: () => Promise<void> | void;
  isSyncingProperties?: boolean;
  leads: VisitorLead[];
  onUpdateLeads: (leads: VisitorLead[]) => void;
  users: UserAccount[];
  onUpdateUsers: (users: UserAccount[]) => void;
  locations: LocationMapConfig[];
  onUpdateLocations: (locs: LocationMapConfig[]) => void;
  subscriptionPlans: SubscriptionPlan[];
  onUpdateSubscriptionPlans: (plans: SubscriptionPlan[]) => void;
  invoices: InvoiceRecord[];
  onUpdateInvoices: (invs: InvoiceRecord[]) => void;
  bugTickets: BugTicket[];
  onAddBugTicket: (ticket: BugTicket) => void;
  onOpenDeveloperConsole: () => void;
  offers?: Offer[];
  onUpdateOffers?: (offers: Offer[]) => void;
  offerEnquiries?: OfferEnquiry[];
  onUpdateOfferEnquiries?: (enquiries: OfferEnquiry[]) => void;
}

type OwnerTab = 
  | 'properties'
  | 'plans_offers'
  | 'pricing'
  | 'media'
  | 'users'
  | 'leads'
  | 'locations'
  | 'reports'
  | 'staff'
  | 'permissions'
  | 'subscriptions'
  | 'domain'
  | 'settings';

export const OwnerMasterConsole: React.FC<OwnerMasterConsoleProps> = ({
  isOpen,
  onClose,
  properties,
  onUpdateProperties,
  onRefreshProperties,
  isSyncingProperties = false,
  leads,
  onUpdateLeads,
  users,
  onUpdateUsers,
  locations,
  onUpdateLocations,
  subscriptionPlans,
  onUpdateSubscriptionPlans,
  invoices,
  onUpdateInvoices,
  bugTickets,
  onAddBugTicket,
  onOpenDeveloperConsole,
  offers = [],
  onUpdateOffers = () => {},
  offerEnquiries = [],
  onUpdateOfferEnquiries = () => {}
}) => {
  const [activeTab, setActiveTab] = useState<OwnerTab>('properties');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Property modal / edit state
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Property>>({});
  const [isEditingSaving, setIsEditingSaving] = useState(false);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [isSubmittingProp, setIsSubmittingProp] = useState(false);
  const [newPropStatus, setNewPropStatus] = useState<PropertyPublishStatus>('published');
  const [newPropTitle, setNewPropTitle] = useState('');
  const [newPropCity, setNewPropCity] = useState('Bengaluru');
  const [newPropLocality, setNewPropLocality] = useState('Whitefield');
  const [newPropPrice, setNewPropPrice] = useState('12500000');
  const [newPropBhk, setNewPropBhk] = useState('3');
  const [newPropArea, setNewPropArea] = useState('1450');
  const [newPropType, setNewPropType] = useState<Property['type']>('apartment');
  const [newPropPurpose, setNewPropPurpose] = useState<'buy' | 'rent'>('buy');
  const [newPropImage, setNewPropImage] = useState('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80');

  // Price adjustment state
  const [priceHikePercent, setPriceHikePercent] = useState('5');
  const [discountTag, setDiscountTag] = useState('Owner Direct Deal: 5% Off');
  const [targetPropertyIdForDiscount, setTargetPropertyIdForDiscount] = useState('');

  // Media state
  const [selectedPropForMedia, setSelectedPropForMedia] = useState<string>(properties[0]?.id || '');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newTourUrl, setNewTourUrl] = useState('');

  // User management state
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | UserRole>('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('agent');
  const [newUserCompany, setNewUserCompany] = useState('');

  // Lead assignment state
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [assignAgentId, setAssignAgentId] = useState<string>('');

  // Location state
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [newLocCity, setNewLocCity] = useState('');
  const [newLocName, setNewLocName] = useState('');
  const [newLocLat, setNewLocLat] = useState('12.9716');
  const [newLocLng, setNewLocLng] = useState('77.5946');
  const [newLocAvgPrice, setNewLocAvgPrice] = useState('9500');

  // Problem / Task for Developer state ("WE PROBLEM APP")
  const [newDevProblemTitle, setNewDevProblemTitle] = useState('');
  const [newDevProblemSeverity, setNewDevProblemSeverity] = useState<'critical' | 'high' | 'medium' | 'low'>('high');
  const [newDevProblemDesc, setNewDevProblemDesc] = useState('');

  // Domain forwarding state
  const [purchasedDomainInput, setPurchasedDomainInput] = useState(() => {
    return localStorage.getItem('NS_PURCHASED_CUSTOM_DOMAIN') || 'nsproperties4.com';
  });
  const [savedPurchasedDomain, setSavedPurchasedDomain] = useState(() => {
    return localStorage.getItem('NS_PURCHASED_CUSTOM_DOMAIN') || 'nsproperties4.com';
  });
  const [copiedTargetUrl, setCopiedTargetUrl] = useState(false);
  const [activeRegistrarGuide, setActiveRegistrarGuide] = useState<'bigrock' | 'godaddy' | 'hostinger' | 'namecheap' | 'cloudflare'>('bigrock');
  const [isTestingDomain, setIsTestingDomain] = useState(false);
  const [testDomainResult, setTestDomainResult] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleSavePurchasedDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDomain = purchasedDomainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!cleanDomain) {
      showNotification('Please enter a valid domain name (e.g., nsproperties.in)');
      return;
    }
    localStorage.setItem('NS_PURCHASED_CUSTOM_DOMAIN', cleanDomain);
    setSavedPurchasedDomain(cleanDomain);
    showNotification(`Domain "${cleanDomain}" saved! Configure forwarding below.`);
  };

  const handleCopyTargetUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(PUBLIC_SHARED_APP_URL);
      setCopiedTargetUrl(true);
      setTimeout(() => setCopiedTargetUrl(false), 2000);
      showNotification('Target Destination URL copied to clipboard!');
    }
  };

  const handleTestDomainForwarding = () => {
    const domain = savedPurchasedDomain || purchasedDomainInput.trim();
    if (!domain) {
      showNotification('Please enter your purchased domain name first.');
      return;
    }
    const clean = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    setIsTestingDomain(true);
    setTestDomainResult(null);

    setTimeout(() => {
      setIsTestingDomain(false);
      setTestDomainResult(`Opening https://${clean} in a new tab... Verify your registrar forwarding status.`);
      window.open(`https://${clean}`, '_blank');
    }, 600);
  };

  // Agents list for assignment
  const agentList = useMemo(() => {
    return users.filter((u) => u.role === 'agent' && u.status === 'active');
  }, [users]);

  if (!isOpen) return null;

  // Handlers for Properties
  const handleDeleteProperty = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this property listing from the central database?')) {
      try {
        await deletePropertyFromCentralDb(id, 'owner');
        const updated = properties.filter((p) => p.id !== id);
        onUpdateProperties(updated);
        showNotification('Property listing permanently deleted from central database.');
        if (onRefreshProperties) await onRefreshProperties();
      } catch (err: any) {
        showNotification(`Delete failed: ${err.message || err}`);
      }
    }
  };

  const handleToggleDisableProperty = async (id: string) => {
    try {
      const target = properties.find((p) => p.id === id);
      if (!target) return;
      const nextState = !target.isDisabled;
      const nextStatus: PropertyPublishStatus = nextState ? 'inactive' : 'published';
      const updatedProp = await updatePropertyInCentralDb(id, { isDisabled: nextState, status: nextStatus }, 'owner');
      const updated = properties.map((p) => (p.id === id ? updatedProp : p));
      onUpdateProperties(updated);
      showNotification(`Listing ${nextState ? 'disabled (hidden from visitors)' : 'enabled (live for visitors)'} in central database.`);
      if (onRefreshProperties) await onRefreshProperties();
    } catch (err: any) {
      showNotification(`Status update failed: ${err.message || err}`);
    }
  };

  const handleToggleFeaturedProperty = async (id: string) => {
    try {
      const target = properties.find((p) => p.id === id);
      if (!target) return;
      const updatedProp = await updatePropertyInCentralDb(id, { isFeatured: !target.isFeatured }, 'owner');
      const updated = properties.map((p) => (p.id === id ? updatedProp : p));
      onUpdateProperties(updated);
      showNotification('Featured status updated in central database.');
      if (onRefreshProperties) await onRefreshProperties();
    } catch (err: any) {
      showNotification(`Update failed: ${err.message || err}`);
    }
  };

  const handleStatusChange = async (id: string, status: PropertyPublishStatus) => {
    try {
      const updatedProp = await updatePropertyStatusInCentralDb(id, status, 'owner');
      const updated = properties.map((p) => (p.id === id ? updatedProp : p));
      onUpdateProperties(updated);
      showNotification(`Property status set to "${status}" in central database.`);
      if (onRefreshProperties) await onRefreshProperties();
    } catch (err: any) {
      showNotification(`Status change failed: ${err.message || err}`);
    }
  };

  const handleOpenEdit = (prop: Property) => {
    setEditingProperty(prop);
    setEditFormData({
      title: prop.title,
      projectName: prop.projectName,
      builderName: prop.builderName,
      purpose: prop.purpose,
      category: prop.category,
      type: prop.type,
      bhk: prop.bhk,
      bathrooms: prop.bathrooms,
      price: prop.price,
      areaSqFt: prop.areaSqFt,
      city: prop.city,
      locality: prop.locality,
      address: prop.address,
      status: prop.status || (prop.isDisabled ? 'inactive' : 'published'),
      isVerified: prop.isVerified,
      isFeatured: prop.isFeatured,
      description: prop.description
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;
    setIsEditingSaving(true);
    try {
      const updatedProp = await updatePropertyInCentralDb(editingProperty.id, editFormData, 'owner');
      const updated = properties.map((p) => (p.id === editingProperty.id ? updatedProp : p));
      onUpdateProperties(updated);
      setEditingProperty(null);
      showNotification(`Property "${updatedProp.title}" updated in central database!`);
      if (onRefreshProperties) await onRefreshProperties();
    } catch (err: any) {
      showNotification(`Update failed: ${err.message || err}`);
    } finally {
      setIsEditingSaving(false);
    }
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropTitle.trim()) {
      showNotification('Property title is required.');
      return;
    }
    setIsSubmittingProp(true);
    const priceNum = parseFloat(newPropPrice) || 10000000;
    const areaNum = parseFloat(newPropArea) || 1200;
    const pricePerSqFt = Math.round(priceNum / areaNum);
    const crValue = (priceNum / 10000000).toFixed(2);

    const newPropertyData: Partial<Property> = {
      title: newPropTitle.trim(),
      projectName: newPropTitle.trim() || 'NS Luxury Residency',
      builderName: 'NS Properties Direct',
      purpose: newPropPurpose,
      category: 'residential',
      type: newPropType,
      bhk: parseInt(newPropBhk) || 3,
      bathrooms: parseInt(newPropBhk) || 3,
      balconies: 2,
      price: priceNum,
      priceDisplay: newPropPurpose === 'rent' ? `₹ ${(priceNum / 1000).toFixed(0)}k / mo` : `₹ ${crValue} Cr`,
      pricePerSqFt,
      areaSqFt: areaNum,
      carpetAreaSqFt: Math.round(areaNum * 0.78),
      city: newPropCity.trim() || 'Bengaluru',
      locality: newPropLocality.trim() || 'Whitefield',
      address: `${newPropLocality.trim() || 'Whitefield'}, ${newPropCity.trim() || 'Bengaluru'}`,
      furnishing: 'Semi-Furnished',
      possession: 'Ready to Move',
      status: newPropStatus,
      isVerified: true,
      isExclusive: true,
      isFeatured: true,
      isDisabled: newPropStatus === 'inactive',
      postedBy: 'Owner',
      postedDate: 'Just now',
      images: [newPropImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'],
      amenities: ['24/7 Security', 'Power Backup', 'Gym', 'Swimming Pool', 'EV Charging'],
      description: 'Listed directly by App Owner with verified documents and clear legal title.',
      landmarks: [
        { name: 'City Center', distance: '2.5 km', type: 'mall' },
        { name: 'Metro Station', distance: '1.2 km', type: 'metro' }
      ],
      seller: {
        name: 'Nithesh (App Owner)',
        phone: '+91 80732 66325',
        email: 'nitheshluxe@gmail.com',
        company: 'NS Properties Management'
      }
    };

    try {
      const saved = await createPropertyInCentralDb(newPropertyData, 'owner');
      onUpdateProperties([saved, ...properties]);
      setIsAddPropertyOpen(false);
      setNewPropTitle('');
      showNotification(`New property published live with ID #${saved.id}!`);
      if (onRefreshProperties) await onRefreshProperties();
    } catch (err: any) {
      showNotification(`Database error: ${err.message || err}`);
    } finally {
      setIsSubmittingProp(false);
    }
  };

  // Price adjustment handlers
  const handleApplyDiscountToProperty = async (propId: string) => {
    if (!propId) return;
    const percent = parseFloat(priceHikePercent) || 5;
    try {
      const updatedList = await bulkPriceAdjustmentInCentralDb({
        propId,
        percent,
        discountTag
      }, 'owner');
      if (updatedList[0]) {
        const updated = properties.map((p) => (p.id === propId ? updatedList[0] : p));
        onUpdateProperties(updated);
        showNotification(`Applied ${percent}% discount with tag "${discountTag}" in central database.`);
        if (onRefreshProperties) await onRefreshProperties();
      }
    } catch (err: any) {
      showNotification(`Discount failed: ${err.message || err}`);
    }
  };

  const handleBulkPriceAdjustment = async (increase: boolean) => {
    const percent = parseFloat(priceHikePercent) || 5;
    try {
      const updatedList = await bulkPriceAdjustmentInCentralDb({
        percent,
        increase
      }, 'owner');
      onUpdateProperties(updatedList);
      showNotification(`Bulk adjusted all property prices by ${increase ? '+' : '-'}${percent}% in central database.`);
      if (onRefreshProperties) await onRefreshProperties();
    } catch (err: any) {
      showNotification(`Bulk adjustment failed: ${err.message || err}`);
    }
  };

  // Media addition handler
  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropForMedia) return;
    try {
      const updatedProp = await addMediaToPropertyInCentralDb(selectedPropForMedia, {
        imageUrl: newImageUrl,
        videoUrl: newVideoUrl,
        virtualTourUrl: newTourUrl
      }, 'owner');
      const updated = properties.map((p) => (p.id === selectedPropForMedia ? updatedProp : p));
      onUpdateProperties(updated);
      setNewImageUrl('');
      setNewVideoUrl('');
      setNewTourUrl('');
      showNotification('Photos & video tour updated in central database.');
      if (onRefreshProperties) await onRefreshProperties();
    } catch (err: any) {
      showNotification(`Media update failed: ${err.message || err}`);
    }
  };

  // User management handlers
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim() || '+91 98000 00000',
      role: newUserRole,
      status: 'active',
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      company: newUserCompany.trim() || undefined
    };
    onUpdateUsers([newUser, ...users]);
    setIsAddUserOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    showNotification(`Added new ${newUserRole.toUpperCase()}: ${newUser.name}`);
  };

  const handleToggleUserStatus = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        if (u.role === 'owner') {
          alert('Cannot disable the primary App Owner account.');
          return u;
        }
        const nextStatus = u.status === 'active' ? 'disabled' : 'active';
        return { ...u, status: nextStatus as 'active' | 'disabled' };
      }
      return u;
    });
    onUpdateUsers(updated);
    showNotification('User status updated.');
  };

  const handleDeleteUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target?.role === 'owner') {
      alert('Cannot delete the primary App Owner account.');
      return;
    }
    if (confirm(`Are you sure you want to remove user "${target?.name}"?`)) {
      onUpdateUsers(users.filter((u) => u.id !== userId));
      showNotification('User removed from platform.');
    }
  };

  // Lead assignment handler
  const handleAssignLead = (leadId: string, agentId: string) => {
    const agent = users.find((u) => u.id === agentId);
    const updated = leads.map((l) => {
      if (l.id === leadId) {
        return {
          ...l,
          assignedToAgentId: agentId,
          assignedToAgentName: agent ? agent.name : undefined,
          status: 'Contacted' as VisitorLead['status']
        };
      }
      return l;
    });
    onUpdateLeads(updated);
    showNotification(`Assigned lead to ${agent?.name || 'Agent'}.`);
  };

  // Location handler
  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocCity.trim() || !newLocName.trim()) return;
    const newLoc: LocationMapConfig = {
      id: `loc-${Date.now()}`,
      city: newLocCity.trim(),
      locality: newLocName.trim(),
      state: 'India',
      pincode: '560001',
      lat: parseFloat(newLocLat) || 12.9716,
      lng: parseFloat(newLocLng) || 77.5946,
      avgPricePerSqFt: parseFloat(newLocAvgPrice) || 8500,
      isActive: true,
      landmarksCount: 12
    };
    onUpdateLocations([...locations, newLoc]);
    setIsAddLocationOpen(false);
    setNewLocName('');
    showNotification(`New Google Maps locality added: ${newLoc.locality}, ${newLoc.city}`);
  };

  // Log problem to developer ("WE PROBLEM APP")
  const handleReportProblemToDeveloper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevProblemTitle.trim()) return;
    const ticket: BugTicket = {
      id: `BUG-${Date.now().toString().slice(-4)}`,
      title: newDevProblemTitle.trim(),
      severity: newDevProblemSeverity,
      status: 'open',
      reportedBy: 'Nithesh (App Owner)',
      timestamp: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      description: newDevProblemDesc.trim() || 'Priority issue logged by App Owner for immediate technical fix.',
      component: 'Core Platform'
    };
    onAddBugTicket(ticket);
    setNewDevProblemTitle('');
    setNewDevProblemDesc('');
    showNotification(`Issue logged to Developer (${ticket.id}). Developer notified for immediate fix.`);
  };

  // Filtered properties
  const filteredProperties = properties.filter((p) => {
    if (!searchQuery) return true;
    return (
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.locality.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filtered users
  const filteredUsers = users.filter((u) => {
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
    if (!searchQuery) return true;
    return (
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery)
    );
  });

  // Calculate gross inventory metrics
  const totalInventoryValue = properties.reduce((acc, p) => acc + p.price, 0);
  const totalSubRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.amount, 0);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-7xl bg-[#fdfcf9] border-2 border-[#c4a47c] shadow-2xl overflow-hidden my-auto max-h-[96vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Master Header Bar */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#c4a47c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#c4a47c] bg-[#c4a47c]/10 flex items-center justify-center text-[#c4a47c]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-tight text-[#fdfcf9]">
                  App Owner Master Control Console
                </h2>
                <span className="bg-[#c4a47c] text-[#1a1a1a] font-mono-luxury text-[10px] font-black px-2 py-0.5 uppercase tracking-wider">
                  SUPERADMIN • FULL ACCESS
                </span>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono-luxury uppercase px-2 py-0.5">
                  Owner: nitheshluxe@gmail.com
                </span>
              </div>
              <p className="font-mono-luxury text-[#fdfcf9]/70 text-xs">
                Full authority: Add/Edit/Delete Properties • Manage Buyers/Sellers/Agents • Assign Leads • Pricing • Google Maps • Staff & Dev
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenDeveloperConsole}
              className="px-3 py-1.5 bg-[#c4a47c]/20 hover:bg-[#c4a47c]/30 text-[#c4a47c] border border-[#c4a47c] font-mono-luxury text-xs uppercase font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Open Technical Developer Console (Limited View)"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Inspect Developer Portal</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/20"
              title="Close Console"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Alert Notification Bar */}
        {statusMessage && (
          <div className="bg-emerald-600 text-white px-6 py-2 text-xs font-mono-luxury font-bold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{statusMessage}</span>
            </div>
            <button onClick={() => setStatusMessage('')} className="text-white hover:underline text-xs">Dismiss</button>
          </div>
        )}

        {/* Sub-header Navigation Tabs */}
        <div className="bg-[#111] px-4 sm:px-6 pt-2 overflow-x-auto border-b border-[#1a1a1a] flex items-center gap-1 scrollbar-none">
          {[
            { id: 'properties', label: 'Properties Master', icon: Building2, badge: properties.length },
            { id: 'plans_offers', label: 'Plans & Offers', icon: Tag, badge: offers.length },
            { id: 'pricing', label: 'Prices & Discounts', icon: DollarSign },
            { id: 'media', label: 'Photos & Videos', icon: Image },
            { id: 'users', label: 'Buyers, Sellers & Agents', icon: Users, badge: users.length },
            { id: 'leads', label: 'View & Assign Leads', icon: UserCheck, badge: leads.length },
            { id: 'locations', label: 'Google Maps & Locations', icon: MapPin, badge: locations.length },
            { id: 'reports', label: 'Sales & Leads Reports', icon: BarChart3 },
            { id: 'staff', label: 'Staff & Developer Control', icon: ShieldAlert },
            { id: 'permissions', label: 'Permissions (RBAC)', icon: Lock },
            { id: 'subscriptions', label: 'Subscriptions & Billing', icon: CreditCard },
            { id: 'domain', label: 'Domain & Forwarding', icon: Globe },
            { id: 'settings', label: 'App Settings & Alerts', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as OwnerTab)}
                className={`px-3 py-2 text-xs font-mono-luxury uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all border-b-2 ${
                  isActive
                    ? 'border-[#c4a47c] text-[#c4a47c] bg-[#1a1a1a] font-bold'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#c4a47c]' : 'text-white/40'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-xs ${isActive ? 'bg-[#c4a47c] text-black font-black' : 'bg-white/10 text-white/70'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Console Body Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#fdfcf9]">
          
          {/* TAB: PLANS & OFFERS MANAGEMENT (Requirement 1 & 3) */}
          {activeTab === 'plans_offers' && (
            <OwnerPlansOffersManager
              offers={offers}
              onUpdateOffers={onUpdateOffers}
              subscriptionPlans={subscriptionPlans}
              onUpdateSubscriptionPlans={onUpdateSubscriptionPlans}
              enquiries={offerEnquiries}
              onUpdateEnquiries={onUpdateOfferEnquiries}
              properties={properties}
            />
          )}

          {/* TAB 1: PROPERTIES MASTER (Add, Edit, Delete, Disable) */}
          {activeTab === 'properties' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1a1a1a]/15">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-[#1a1a1a]/40" />
                    <input
                      type="text"
                      placeholder="Search property by title, city, locality..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs font-mono-luxury border border-[#1a1a1a]/30 w-72 focus:outline-hidden bg-white"
                    />
                  </div>
                  <span className="text-xs font-mono-luxury text-[#1a1a1a]/60">
                    Showing {filteredProperties.length} of {properties.length} listings
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {onRefreshProperties && (
                    <button
                      onClick={() => onRefreshProperties()}
                      disabled={isSyncingProperties}
                      className="px-3 py-1.5 bg-white border border-[#1a1a1a]/30 hover:bg-[#fdfcf9] text-[#1a1a1a] font-mono-luxury uppercase text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      title="Fetch latest properties from Central Backend Database"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-[#c4a47c] ${isSyncingProperties ? 'animate-spin' : ''}`} />
                      <span>{isSyncingProperties ? 'Syncing...' : 'Sync Central DB'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsAddPropertyOpen(true)}
                    className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-mono-luxury uppercase text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-black"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#c4a47c]" />
                    <span>Add New Property</span>
                  </button>
                </div>
              </div>

              {/* Add Property Form Drawer / Card */}
              {isAddPropertyOpen && (
                <div className="bg-[#1a1a1a] text-white p-5 border-2 border-[#c4a47c] mb-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/20 pb-2">
                    <div className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-[#c4a47c]" />
                      <h4 className="font-serif-luxury text-lg font-bold text-[#c4a47c]">
                        Create New Verified Property (App Owner)
                      </h4>
                    </div>
                    <button onClick={() => setIsAddPropertyOpen(false)} className="text-white/60 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateProperty} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-luxury">
                    <div className="sm:col-span-2">
                      <label className="block text-white/70 mb-1">Property Title:</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 4 BHK Ultra Luxury Penthouse in Worli Sea Face"
                        value={newPropTitle}
                        onChange={(e) => setNewPropTitle(e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1">Purpose:</label>
                      <select
                        value={newPropPurpose}
                        onChange={(e) => setNewPropPurpose(e.target.value as any)}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      >
                        <option value="buy">For Sale (Buy)</option>
                        <option value="rent">For Rent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/70 mb-1">City:</label>
                      <input
                        type="text"
                        value={newPropCity}
                        onChange={(e) => setNewPropCity(e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1">Locality:</label>
                      <input
                        type="text"
                        value={newPropLocality}
                        onChange={(e) => setNewPropLocality(e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1">Price (₹ in Rupees):</label>
                      <input
                        type="number"
                        value={newPropPrice}
                        onChange={(e) => setNewPropPrice(e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 mb-1">Bedrooms (BHK):</label>
                      <input
                        type="number"
                        value={newPropBhk}
                        onChange={(e) => setNewPropBhk(e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1">Built-up Area (Sq.Ft):</label>
                      <input
                        type="number"
                        value={newPropArea}
                        onChange={(e) => setNewPropArea(e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1">Publish Status:</label>
                      <select
                        value={newPropStatus}
                        onChange={(e) => setNewPropStatus(e.target.value as PropertyPublishStatus)}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      >
                        <option value="published">🟢 Published (Live for all users)</option>
                        <option value="draft">🟡 Draft (Hidden from public users)</option>
                        <option value="inactive">🔴 Inactive (Archived)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-white/70 mb-1">Main Cover Photo URL:</label>
                      <input
                        type="text"
                        value={newPropImage}
                        onChange={(e) => setNewPropImage(e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>

                    <div className="sm:col-span-3 flex justify-end gap-2 pt-2 border-t border-white/20">
                      <button
                        type="button"
                        onClick={() => setIsAddPropertyOpen(false)}
                        className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingProp}
                        className="px-5 py-1.5 bg-[#c4a47c] text-black font-bold uppercase cursor-pointer hover:bg-[#b09066] disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {isSubmittingProp ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving to Central DB...</span>
                          </>
                        ) : (
                          <span>Publish to Central DB</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Edit Property Drawer / Modal */}
              {editingProperty && (
                <div className="bg-[#1a1a1a] text-white p-5 border-2 border-amber-500 mb-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/20 pb-2">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-amber-400" />
                      <h4 className="font-serif-luxury text-lg font-bold text-amber-400">
                        Edit Property Listing #{editingProperty.id}
                      </h4>
                    </div>
                    <button onClick={() => setEditingProperty(null)} className="text-white/60 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveEdit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-luxury">
                    <div className="sm:col-span-2">
                      <label className="block text-white/70 mb-1">Property Title:</label>
                      <input
                        type="text"
                        required
                        value={editFormData.title || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1">Publish Status:</label>
                      <select
                        value={editFormData.status || 'published'}
                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as PropertyPublishStatus })}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      >
                        <option value="published">🟢 Published (Live for all users)</option>
                        <option value="draft">🟡 Draft (Hidden from public)</option>
                        <option value="inactive">🔴 Inactive</option>
                        <option value="deleted">⚫ Deleted</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/70 mb-1">City:</label>
                      <input
                        type="text"
                        value={editFormData.city || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1">Locality:</label>
                      <input
                        type="text"
                        value={editFormData.locality || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, locality: e.target.value })}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1">Price (₹ in Rupees):</label>
                      <input
                        type="number"
                        value={editFormData.price || 0}
                        onChange={(e) => setEditFormData({ ...editFormData, price: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 mb-1">Bedrooms (BHK):</label>
                      <input
                        type="number"
                        value={editFormData.bhk || 0}
                        onChange={(e) => setEditFormData({ ...editFormData, bhk: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1">Area (Sq.Ft):</label>
                      <input
                        type="number"
                        value={editFormData.areaSqFt || 0}
                        onChange={(e) => setEditFormData({ ...editFormData, areaSqFt: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1">Project Name:</label>
                      <input
                        type="text"
                        value={editFormData.projectName || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, projectName: e.target.value })}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-white/70 mb-1">Description:</label>
                      <textarea
                        rows={2}
                        value={editFormData.description || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>

                    <div className="sm:col-span-3 flex justify-end gap-2 pt-2 border-t border-white/20">
                      <button
                        type="button"
                        onClick={() => setEditingProperty(null)}
                        className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isEditingSaving}
                        className="px-5 py-1.5 bg-amber-500 text-black font-bold uppercase cursor-pointer hover:bg-amber-400 disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {isEditingSaving ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Updating Central DB...</span>
                          </>
                        ) : (
                          <span>Save Changes to Central DB</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Property Table */}
              <div className="border border-[#1a1a1a] bg-white overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse text-xs font-mono-luxury">
                  <thead>
                    <tr className="bg-[#1a1a1a] text-[#fdfcf9] uppercase text-[11px] tracking-wider">
                      <th className="p-3">Cover</th>
                      <th className="p-3">Property Title</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Price & Rate</th>
                      <th className="p-3">Type & BHK</th>
                      <th className="p-3">Publish Status</th>
                      <th className="p-3 text-right">App Owner Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]/15">
                    {filteredProperties.map((p) => (
                      <tr key={p.id} className={`hover:bg-[#fdfcf9] transition-colors ${p.isDisabled ? 'opacity-60 bg-gray-50' : ''}`}>
                        <td className="p-3 w-16">
                          <img
                            src={p.images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'}
                            alt={p.title}
                            className="w-14 h-11 object-cover border border-[#1a1a1a]/20"
                          />
                        </td>
                        <td className="p-3 max-w-xs">
                          <div className="font-bold text-[#1a1a1a]">{p.title}</div>
                          <div className="text-[10px] text-[#1a1a1a]/50">ID: {p.id} • {p.postedBy}</div>
                          {p.discountPercentage && (
                            <span className="inline-block mt-1 bg-red-100 text-red-800 text-[9px] font-bold px-1.5 py-0.2 border border-red-300">
                              {p.discountPercentage}% Discount Active
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div>{p.locality}</div>
                          <div className="text-[10px] text-[#1a1a1a]/60">{p.city}</div>
                        </td>
                        <td className="p-3 font-bold text-[#1a1a1a]">
                          <div>{p.priceDisplay}</div>
                          <div className="text-[10px] text-[#1a1a1a]/50 font-normal">₹{p.pricePerSqFt}/sq.ft</div>
                        </td>
                        <td className="p-3">
                          <span className="capitalize">{p.type.replace('-', ' ')}</span>
                          <div className="text-[10px] text-[#1a1a1a]/60">{p.bhk} BHK • {p.areaSqFt} sq.ft</div>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col gap-1">
                            <select
                              value={p.status || (p.isDisabled ? 'inactive' : 'published')}
                              onChange={(e) => handleStatusChange(p.id, e.target.value as PropertyPublishStatus)}
                              className="bg-[#1a1a1a] text-white text-[10px] font-mono-luxury px-1.5 py-1 border border-[#1a1a1a]/30 cursor-pointer rounded-none focus:outline-hidden"
                            >
                              <option value="published">🟢 Published</option>
                              <option value="draft">🟡 Draft</option>
                              <option value="inactive">🔴 Inactive</option>
                              <option value="deleted">⚫ Deleted</option>
                            </select>
                            {p.isFeatured && (
                              <span className="bg-amber-100 text-amber-900 border border-amber-400 text-[9px] font-bold px-1 py-0.2 uppercase inline-block text-center">
                                Featured
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          {/* Edit in Central DB */}
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 bg-amber-50 text-amber-800 hover:bg-amber-500 hover:text-black border border-amber-300 cursor-pointer transition-colors"
                            title="Edit Listing in Central Database"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle Featured */}
                          <button
                            onClick={() => handleToggleFeaturedProperty(p.id)}
                            className={`p-1.5 border cursor-pointer ${
                              p.isFeatured ? 'bg-amber-100 text-amber-800 border-amber-400' : 'bg-white text-[#1a1a1a]/60 border-[#1a1a1a]/20 hover:text-black'
                            }`}
                            title={p.isFeatured ? 'Remove from Featured' : 'Mark as Featured on Homepage'}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>

                          {/* Disable / Enable */}
                          <button
                            onClick={() => handleToggleDisableProperty(p.id)}
                            className={`p-1.5 border cursor-pointer ${
                              p.isDisabled ? 'bg-red-50 text-red-600 border-red-300' : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            }`}
                            title={p.isDisabled ? 'Enable Listing for Visitors' : 'Disable / Hide Listing from Visitors'}
                          >
                            {p.isDisabled ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>

                          {/* Quick Price Discount */}
                          <button
                            onClick={() => {
                              setActiveTab('pricing');
                              setTargetPropertyIdForDiscount(p.id);
                            }}
                            className="p-1.5 bg-blue-50 text-blue-700 border border-blue-200 cursor-pointer"
                            title="Manage Price & Discount"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                          </button>

                          {/* Permanent Delete */}
                          <button
                            onClick={() => handleDeleteProperty(p.id)}
                            className="p-1.5 bg-red-100 text-red-700 hover:bg-red-700 hover:text-white border border-red-300 cursor-pointer transition-colors"
                            title="Permanently Delete Property from Central DB"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & DISCOUNTS */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#1a1a1a] text-[#fdfcf9] border-l-4 border-[#c4a47c] flex items-center justify-between">
                <div>
                  <h4 className="font-serif-luxury text-lg font-bold text-[#c4a47c]">
                    Property Price Control & Discount Engine
                  </h4>
                  <p className="text-xs font-mono-luxury text-white/70">
                    App Owner can execute single-listing price discounts or platform-wide bulk price updates.
                  </p>
                </div>
                <div className="text-right font-mono-luxury text-xs">
                  <span className="text-white/50 block">Total Portfolio Value</span>
                  <span className="font-serif-luxury text-xl font-bold text-[#c4a47c]">
                    ₹ {(totalInventoryValue / 10000000).toFixed(2)} Crore
                  </span>
                </div>
              </div>

              {/* Single Property Price Discount Card */}
              <div className="border border-[#1a1a1a] bg-white p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#1a1a1a]/15">
                  <Tag className="w-4 h-4 text-[#c4a47c]" />
                  <h5 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                    Apply Instant Festive Discount to Specific Property
                  </h5>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono-luxury">
                  <div>
                    <label className="block text-[#1a1a1a]/70 mb-1">Select Property:</label>
                    <select
                      value={targetPropertyIdForDiscount || (properties[0]?.id || '')}
                      onChange={(e) => setTargetPropertyIdForDiscount(e.target.value)}
                      className="w-full px-3 py-2 border border-[#1a1a1a]/30 bg-[#fdfcf9]"
                    >
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.priceDisplay})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#1a1a1a]/70 mb-1">Discount Percentage (%):</label>
                    <input
                      type="number"
                      value={priceHikePercent}
                      onChange={(e) => setPriceHikePercent(e.target.value)}
                      className="w-full px-3 py-2 border border-[#1a1a1a]/30 bg-[#fdfcf9]"
                      placeholder="e.g. 5 or 10"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1a1a1a]/70 mb-1">Promotional Offer Tag:</label>
                    <input
                      type="text"
                      value={discountTag}
                      onChange={(e) => setDiscountTag(e.target.value)}
                      className="w-full px-3 py-2 border border-[#1a1a1a]/30 bg-[#fdfcf9]"
                      placeholder="e.g. Festive Bonanza Direct Owner Deal"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleApplyDiscountToProperty(targetPropertyIdForDiscount || properties[0]?.id)}
                    className="px-5 py-2 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-mono-luxury uppercase text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border border-black"
                  >
                    <Percent className="w-3.5 h-3.5 text-[#c4a47c]" />
                    <span>Apply Discount to Property</span>
                  </button>
                </div>
              </div>

              {/* Bulk Platform Price Adjustment */}
              <div className="border border-[#1a1a1a] bg-white p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#1a1a1a]/15">
                  <DollarSign className="w-4 h-4 text-[#c4a47c]" />
                  <h5 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                    Platform-wide Bulk Price Adjustment
                  </h5>
                </div>

                <p className="text-xs font-mono-luxury text-[#1a1a1a]/70">
                  Bulk recalculates all listing prices based on market inflation or annual indexation.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-mono-luxury">
                    <span>Percentage Rate:</span>
                    <input
                      type="number"
                      value={priceHikePercent}
                      onChange={(e) => setPriceHikePercent(e.target.value)}
                      className="w-20 px-2 py-1.5 border border-[#1a1a1a]/30"
                    />
                    <span>%</span>
                  </div>

                  <button
                    onClick={() => handleBulkPriceAdjustment(true)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-mono-luxury text-xs uppercase font-bold cursor-pointer transition-colors"
                  >
                    Increase All Prices (+{priceHikePercent}%)
                  </button>

                  <button
                    onClick={() => handleBulkPriceAdjustment(false)}
                    className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-mono-luxury text-xs uppercase font-bold cursor-pointer transition-colors"
                  >
                    Reduce All Prices (-{priceHikePercent}%)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA (Photos & Videos) */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="border border-[#1a1a1a] bg-white p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#1a1a1a]/15">
                  <Video className="w-5 h-5 text-[#c4a47c]" />
                  <h4 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                    Attach Photos & Virtual Video Tour Embeds
                  </h4>
                </div>

                <form onSubmit={handleAddMedia} className="space-y-4 text-xs font-mono-luxury">
                  <div>
                    <label className="block text-[#1a1a1a]/70 mb-1">Target Property:</label>
                    <select
                      value={selectedPropForMedia}
                      onChange={(e) => setSelectedPropForMedia(e.target.value)}
                      className="w-full px-3 py-2 border border-[#1a1a1a]/30 bg-[#fdfcf9]"
                    >
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#1a1a1a]/70 mb-1">Add High-Res Photo URL:</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-[#1a1a1a]/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[#1a1a1a]/70 mb-1">YouTube Walkthrough Video URL:</label>
                      <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-[#1a1a1a]/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[#1a1a1a]/70 mb-1">360° Virtual Tour URL:</label>
                      <input
                        type="url"
                        placeholder="https://my.matterport.com/show/?m=..."
                        value={newTourUrl}
                        onChange={(e) => setNewTourUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-[#1a1a1a]/30"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#1a1a1a] text-[#fdfcf9] font-bold uppercase hover:bg-black transition-colors cursor-pointer"
                    >
                      Save Media Assets
                    </button>
                  </div>
                </form>
              </div>

              {/* Current Selected Property Photo Gallery Preview */}
              {selectedPropForMedia && (
                <div className="border border-[#1a1a1a] bg-white p-5 space-y-3">
                  <span className="font-mono-luxury uppercase text-xs font-bold text-[#1a1a1a]">
                    Current Photos for Listing: {properties.find((p) => p.id === selectedPropForMedia)?.title}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {properties.find((p) => p.id === selectedPropForMedia)?.images.map((img, i) => (
                      <div key={i} className="relative group border border-[#1a1a1a]/20">
                        <img src={img} alt="Property" className="w-full h-28 object-cover" />
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 font-mono-luxury">
                          Photo #{i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: USERS (Buyers, Sellers, Agents, Staff, Developer) */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1a1a1a]/15">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white border border-[#1a1a1a]/30 p-1 text-xs font-mono-luxury">
                    <span className="text-[#1a1a1a]/60 px-2">Filter Role:</span>
                    {(['all', 'buyer', 'seller', 'agent', 'developer'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setUserRoleFilter(r)}
                        className={`px-2.5 py-1 uppercase text-[10px] font-bold cursor-pointer transition-colors ${
                          userRoleFilter === r
                            ? 'bg-[#1a1a1a] text-white'
                            : 'text-[#1a1a1a]/70 hover:bg-[#1a1a1a]/10'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setIsAddUserOpen(true)}
                  className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-mono-luxury uppercase text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#c4a47c]" />
                  <span>Register New User / Staff</span>
                </button>
              </div>

              {/* Add User Modal / Inline */}
              {isAddUserOpen && (
                <div className="bg-[#1a1a1a] text-white p-5 border-2 border-[#c4a47c] mb-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/20 pb-2">
                    <h4 className="font-serif-luxury text-base font-bold text-[#c4a47c]">
                      Register New User / Staff / Agent Account
                    </h4>
                    <button onClick={() => setIsAddUserOpen(false)} className="text-white/60 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono-luxury">
                    <div>
                      <label className="block text-white/70 mb-1">Full Name:</label>
                      <input
                        type="text"
                        required
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder="e.g. Rahul Verma"
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1">Email ID:</label>
                      <input
                        type="email"
                        required
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="user@example.com"
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1">Phone Number:</label>
                      <input
                        type="tel"
                        value={newUserPhone}
                        onChange={(e) => setNewUserPhone(e.target.value)}
                        placeholder="+91 98450 00000"
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1">Account Role:</label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      >
                        <option value="agent">Certified Agent</option>
                        <option value="seller">Seller / Builder</option>
                        <option value="buyer">Verified Buyer</option>
                        <option value="manager">Operations Manager</option>
                        <option value="developer">App Developer (Technical)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-4 flex justify-end gap-2 pt-2 border-t border-white/20">
                      <button
                        type="button"
                        onClick={() => setIsAddUserOpen(false)}
                        className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-1.5 bg-[#c4a47c] text-black font-bold uppercase cursor-pointer hover:bg-[#b09066]"
                      >
                        Create Account
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Users Table */}
              <div className="border border-[#1a1a1a] bg-white overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse text-xs font-mono-luxury">
                  <thead>
                    <tr className="bg-[#1a1a1a] text-[#fdfcf9] uppercase text-[11px] tracking-wider">
                      <th className="p-3">User Name</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Joined Date</th>
                      <th className="p-3 text-right">Owner Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]/15">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className={`hover:bg-[#fdfcf9] ${u.status === 'disabled' ? 'bg-red-50/50 opacity-60' : ''}`}>
                        <td className="p-3">
                          <div className="font-bold text-[#1a1a1a]">{u.name}</div>
                          <div className="text-[10px] text-[#1a1a1a]/50">{u.company || 'Direct User'}</div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                            u.role === 'owner' ? 'bg-amber-100 text-amber-900 border-amber-400' :
                            u.role === 'developer' ? 'bg-cyan-100 text-cyan-900 border-cyan-400' :
                            u.role === 'agent' ? 'bg-purple-100 text-purple-900 border-purple-400' :
                            u.role === 'seller' ? 'bg-blue-100 text-blue-900 border-blue-400' :
                            'bg-gray-100 text-gray-900 border-gray-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3">
                          <div>{u.email}</div>
                          <div className="text-[10px] text-[#1a1a1a]/60">{u.phone}</div>
                        </td>
                        <td className="p-3">
                          {u.status === 'active' ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Active
                            </span>
                          ) : (
                            <span className="text-red-700 font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Disabled
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-[#1a1a1a]/70">{u.joinedDate}</td>
                        <td className="p-3 text-right space-x-1">
                          {/* Disable / Enable User */}
                          {u.role !== 'owner' && (
                            <button
                              onClick={() => handleToggleUserStatus(u.id)}
                              className={`px-2 py-1 text-[10px] font-bold uppercase border cursor-pointer ${
                                u.status === 'active'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              }`}
                            >
                              {u.status === 'active' ? 'Block / Disable' : 'Activate'}
                            </button>
                          )}

                          {/* Delete User */}
                          {u.role !== 'owner' && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1 bg-red-100 text-red-700 hover:bg-red-700 hover:text-white border border-red-300 cursor-pointer transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: LEADS MANAGEMENT & ASSIGNMENT */}
          {activeTab === 'leads' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1a1a1a]/15">
                <div>
                  <h4 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                    Customer Leads Routing & Agent Assignment
                  </h4>
                  <p className="text-xs font-mono-luxury text-[#1a1a1a]/60">
                    Assign incoming floor plan phone unlocks and property enquiries to dedicated real estate agents.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const csv = 'Date,Name,Phone,Email,Property,AssignedAgent,Status\n' + leads.map(l => `"${l.timestamp}","${l.name}","${l.phone}","${l.email}","${l.propertyTitle || ''}","${l.assignedToAgentName || 'Unassigned'}","${l.status}"`).join('\n');
                      const uri = encodeURI('data:text/csv;charset=utf-8,' + csv);
                      const link = document.createElement('a');
                      link.href = uri;
                      link.download = `Leads_Assignment_Report_${new Date().toISOString().slice(0, 10)}.csv`;
                      link.click();
                    }}
                    className="px-3.5 py-1.5 bg-[#c4a47c] text-black font-mono-luxury text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer border border-black"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Leads Sheet (.CSV)</span>
                  </button>
                </div>
              </div>

              {/* Leads Table with Assignment Selector */}
              <div className="border border-[#1a1a1a] bg-white overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse text-xs font-mono-luxury">
                  <thead>
                    <tr className="bg-[#1a1a1a] text-[#fdfcf9] uppercase text-[11px] tracking-wider">
                      <th className="p-3">Client Name</th>
                      <th className="p-3">Phone & WhatsApp</th>
                      <th className="p-3">Interested Property</th>
                      <th className="p-3">Lead Source</th>
                      <th className="p-3">Assigned Agent</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Quick Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]/15">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-[#fdfcf9]">
                        <td className="p-3 font-bold text-[#1a1a1a]">
                          {l.name}
                          <div className="text-[10px] text-[#1a1a1a]/50 font-normal">{l.timestamp}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold">{l.phone}</div>
                          <div className="text-[10px] text-[#1a1a1a]/60">{l.email}</div>
                        </td>
                        <td className="p-3 max-w-xs truncate">
                          {l.propertyTitle || 'General Inquiry'}
                        </td>
                        <td className="p-3">
                          <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 border border-amber-300">
                            {l.source}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={l.assignedToAgentId || ''}
                            onChange={(e) => handleAssignLead(l.id, e.target.value)}
                            className="px-2 py-1 border border-[#1a1a1a]/30 bg-[#fdfcf9] text-xs font-mono-luxury"
                          >
                            <option value="">-- Unassigned --</option>
                            {agentList.map((agent) => (
                              <option key={agent.id} value={agent.id}>
                                {agent.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                            {l.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              const msg = `Hello ${l.name}, this is from NS Properties regarding your inquiry for ${l.propertyTitle || 'properties in Bengaluru'}. How can we assist you?`;
                              openWhatsAppChat(l.phone, msg);
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: GOOGLE MAPS & LOCATIONS */}
          {activeTab === 'locations' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1a1a1a]/15">
                <div>
                  <h4 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                    Google Maps Geolocation & Metro Cities Manager
                  </h4>
                  <p className="text-xs font-mono-luxury text-[#1a1a1a]/60">
                    Define precise Latitude and Longitude coordinates for property discovery and map pins.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddLocationOpen(true)}
                  className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-mono-luxury uppercase text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#c4a47c]" />
                  <span>Add New Locality</span>
                </button>
              </div>

              {isAddLocationOpen && (
                <div className="bg-[#1a1a1a] text-white p-5 border-2 border-[#c4a47c] mb-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/20 pb-2">
                    <h5 className="font-serif-luxury text-base font-bold text-[#c4a47c]">
                      Register New Google Maps Location Coordinates
                    </h5>
                    <button onClick={() => setIsAddLocationOpen(false)} className="text-white/60 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateLocation} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono-luxury">
                    <div>
                      <label className="block text-white/70 mb-1">City:</label>
                      <input
                        type="text"
                        required
                        value={newLocCity}
                        onChange={(e) => setNewLocCity(e.target.value)}
                        placeholder="e.g. Bengaluru"
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1">Locality Name:</label>
                      <input
                        type="text"
                        required
                        value={newLocName}
                        onChange={(e) => setNewLocName(e.target.value)}
                        placeholder="e.g. HSR Layout"
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1">Latitude (Lat):</label>
                      <input
                        type="text"
                        value={newLocLat}
                        onChange={(e) => setNewLocLat(e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1">Longitude (Lng):</label>
                      <input
                        type="text"
                        value={newLocLng}
                        onChange={(e) => setNewLocLng(e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/30 text-white"
                      />
                    </div>

                    <div className="sm:col-span-4 flex justify-end gap-2 pt-2 border-t border-white/20">
                      <button
                        type="button"
                        onClick={() => setIsAddLocationOpen(false)}
                        className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-1.5 bg-[#c4a47c] text-black font-bold uppercase cursor-pointer hover:bg-[#b09066]"
                      >
                        Save Location
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Locations Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {locations.map((loc) => (
                  <div key={loc.id} className="border border-[#1a1a1a] bg-white p-4 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold font-serif-luxury text-base text-[#1a1a1a]">
                        <MapPin className="w-4 h-4 text-[#c4a47c]" />
                        <span>{loc.locality}</span>
                      </div>
                      <span className="text-[10px] font-mono-luxury bg-emerald-100 text-emerald-800 px-1.5 py-0.2 border border-emerald-300">
                        {loc.city}
                      </span>
                    </div>

                    <div className="text-xs font-mono-luxury text-[#1a1a1a]/70 space-y-0.5">
                      <div>GPS: {loc.lat.toFixed(4)}° N, {loc.lng.toFixed(4)}° E</div>
                      <div>Avg Rate: ₹{loc.avgPricePerSqFt.toLocaleString('en-IN')}/sq.ft</div>
                      <div>Landmarks Mapped: {loc.landmarksCount || 10}+ hubs</div>
                    </div>

                    <div className="pt-2 border-t border-[#1a1a1a]/10 flex items-center justify-between">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-mono-luxury text-blue-700 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Open in Google Maps</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SALES & LEADS REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Summary KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="border border-[#1a1a1a] bg-white p-4 text-center">
                  <span className="text-[10px] font-mono-luxury uppercase text-[#1a1a1a]/60 block">Total Inquiries & Leads</span>
                  <span className="font-serif-luxury text-2xl font-bold text-[#1a1a1a]">{leads.length}</span>
                  <span className="text-[10px] text-emerald-600 block mt-1">+18% this month</span>
                </div>
                <div className="border border-[#1a1a1a] bg-white p-4 text-center">
                  <span className="text-[10px] font-mono-luxury uppercase text-[#1a1a1a]/60 block">Properties for Sale / Rent</span>
                  <span className="font-serif-luxury text-2xl font-bold text-[#1a1a1a]">{properties.length}</span>
                  <span className="text-[10px] text-[#c4a47c] font-bold block mt-1">100% RERA Verified</span>
                </div>
                <div className="border border-[#1a1a1a] bg-white p-4 text-center">
                  <span className="text-[10px] font-mono-luxury uppercase text-[#1a1a1a]/60 block">Gross Inventory Value</span>
                  <span className="font-serif-luxury text-2xl font-bold text-amber-700">₹ {(totalInventoryValue / 10000000).toFixed(1)} Cr</span>
                  <span className="text-[10px] text-[#1a1a1a]/60 block mt-1">Bengaluru, Mumbai, Delhi</span>
                </div>
                <div className="border border-[#1a1a1a] bg-white p-4 text-center">
                  <span className="text-[10px] font-mono-luxury uppercase text-[#1a1a1a]/60 block">Subscription Revenue</span>
                  <span className="font-serif-luxury text-2xl font-bold text-emerald-700">₹ {totalSubRevenue.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-emerald-600 block mt-1">Active Recurring</span>
                </div>
              </div>

              {/* Lead Sources Breakdown */}
              <div className="border border-[#1a1a1a] bg-white p-5 space-y-3">
                <h5 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                  Leads Origin & Customer Channel Conversion
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-luxury">
                  <div className="p-3 bg-[#fdfcf9] border border-[#1a1a1a]/20">
                    <span className="font-bold text-[#1a1a1a] block">Floor Plan Phone Unlocks:</span>
                    <span className="text-xl font-bold text-amber-700">
                      {leads.filter(l => l.source.includes('Floor Plan')).length} Leads
                    </span>
                    <p className="text-[10px] text-[#1a1a1a]/60 mt-1">Highest buyer purchase intent.</p>
                  </div>
                  <div className="p-3 bg-[#fdfcf9] border border-[#1a1a1a]/20">
                    <span className="font-bold text-[#1a1a1a] block">Site Visits Scheduled:</span>
                    <span className="text-xl font-bold text-blue-700">
                      {leads.filter(l => l.source.includes('Visit') || l.purpose === 'Site Visit').length} Bookings
                    </span>
                    <p className="text-[10px] text-[#1a1a1a]/60 mt-1">In-person physical walkthroughs.</p>
                  </div>
                  <div className="p-3 bg-[#fdfcf9] border border-[#1a1a1a]/20">
                    <span className="font-bold text-[#1a1a1a] block">Direct WhatsApp & Inquiries:</span>
                    <span className="text-xl font-bold text-emerald-700">
                      {leads.filter(l => l.source.includes('Enquiry') || l.source.includes('Popup')).length} Chats
                    </span>
                    <p className="text-[10px] text-[#1a1a1a]/60 mt-1">Instant mobile phone consultation.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: STAFF & DEVELOPER CONTROL ("WE PROBLEM APP") */}
          {activeTab === 'staff' && (
            <div className="space-y-6">
              <div className="p-5 bg-red-950/20 border-2 border-red-700 text-[#1a1a1a] space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-700" />
                  <h4 className="font-serif-luxury text-base font-bold text-red-900">
                    Emergency App Problem & Developer Task Dispatch ("WE PROBLEM APP")
                  </h4>
                </div>
                <p className="text-xs font-mono-luxury text-red-800 leading-relaxed">
                  If there is an app crash, broken feature, or security concern, the App Owner can immediately log an emergency task directly to the Developer console, or revoke developer access if necessary.
                </p>
              </div>

              {/* Log problem form */}
              <div className="border border-[#1a1a1a] bg-white p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#1a1a1a]/15">
                  <Wrench className="w-4 h-4 text-[#c4a47c]" />
                  <h5 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                    Log Technical Bug / Task to Developer
                  </h5>
                </div>

                <form onSubmit={handleReportProblemToDeveloper} className="space-y-3 text-xs font-mono-luxury">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[#1a1a1a]/70 mb-1">Issue Headline:</label>
                      <input
                        type="text"
                        required
                        value={newDevProblemTitle}
                        onChange={(e) => setNewDevProblemTitle(e.target.value)}
                        placeholder="e.g. WhatsApp button on mobile viewport not opening correctly"
                        className="w-full px-3 py-2 border border-[#1a1a1a]/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[#1a1a1a]/70 mb-1">Severity Level:</label>
                      <select
                        value={newDevProblemSeverity}
                        onChange={(e) => setNewDevProblemSeverity(e.target.value as any)}
                        className="w-full px-3 py-2 border border-[#1a1a1a]/30"
                      >
                        <option value="critical">CRITICAL (System Blocker)</option>
                        <option value="high">HIGH (Feature Broken)</option>
                        <option value="medium">MEDIUM (UI Alignment)</option>
                        <option value="low">LOW (Minor Cosmetic)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#1a1a1a]/70 mb-1">Detailed Problem Description for Developer:</label>
                    <textarea
                      rows={3}
                      value={newDevProblemDesc}
                      onChange={(e) => setNewDevProblemDesc(e.target.value)}
                      placeholder="Explain what happened, what device or browser, and expected behavior..."
                      className="w-full px-3 py-2 border border-[#1a1a1a]/30"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-red-800 hover:bg-red-900 text-white font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Ticket to Developer Console</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Current Active Developer Tickets */}
              <div className="border border-[#1a1a1a] bg-white p-5 space-y-3">
                <h5 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                  Developer Task Queue & Fix Status
                </h5>

                <div className="space-y-2">
                  {bugTickets.map((t) => (
                    <div key={t.id} className="p-3 border border-[#1a1a1a]/20 bg-[#fdfcf9] flex flex-wrap items-center justify-between gap-2 text-xs font-mono-luxury">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                            t.severity === 'critical' ? 'bg-red-700 text-white' :
                            t.severity === 'high' ? 'bg-amber-600 text-white' :
                            'bg-blue-600 text-white'
                          }`}>
                            {t.severity}
                          </span>
                          <span className="font-bold text-[#1a1a1a]">{t.title}</span>
                          <span className="text-[10px] text-[#1a1a1a]/50">({t.id})</span>
                        </div>
                        <p className="text-[11px] text-[#1a1a1a]/70 mt-1">{t.description}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                          t.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          t.status === 'investigating' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: PERMISSIONS (RBAC) */}
          {activeTab === 'permissions' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#1a1a1a] text-[#fdfcf9] border-l-4 border-[#c4a47c]">
                <h4 className="font-serif-luxury text-base font-bold text-[#c4a47c]">
                  Role-Based Access Control (RBAC) Hierarchy
                </h4>
                <p className="text-xs font-mono-luxury text-white/70">
                  Enforces strict boundaries: App Owner has full system access, while App Developer is restricted strictly to technical tasks.
                </p>
              </div>

              <div className="border border-[#1a1a1a] bg-white overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse text-xs font-mono-luxury">
                  <thead>
                    <tr className="bg-[#1a1a1a] text-[#fdfcf9] uppercase text-[10px] tracking-wider">
                      <th className="p-3">Platform Capability</th>
                      <th className="p-3 text-center bg-amber-950/60 text-[#c4a47c]">App Owner</th>
                      <th className="p-3 text-center">Operations Manager</th>
                      <th className="p-3 text-center">Certified Agent</th>
                      <th className="p-3 text-center bg-cyan-950/60 text-cyan-300">App Developer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]/15">
                    {[
                      { cap: 'Add / Edit / Delete Properties', owner: true, mgr: true, agent: true, dev: false },
                      { cap: 'Manage Buyers, Sellers & Agents', owner: true, mgr: true, agent: false, dev: false },
                      { cap: 'View and Assign Customer Leads', owner: true, mgr: true, agent: false, dev: false },
                      { cap: 'Manage Property Prices & Discounts', owner: true, mgr: true, agent: false, dev: false },
                      { cap: 'Google Maps Locations & Lat/Lng', owner: true, mgr: true, agent: false, dev: false },
                      { cap: 'Upload Property Photos & Videos', owner: true, mgr: true, agent: true, dev: false },
                      { cap: 'View Sales & Financial Reports', owner: true, mgr: true, agent: false, dev: false },
                      { cap: 'Add/Remove Staff & Developer', owner: true, mgr: false, agent: false, dev: false },
                      { cap: 'Manage Payment Subscriptions', owner: true, mgr: false, agent: false, dev: false },
                      { cap: 'Server API & Technical Maintenance', owner: true, mgr: false, agent: false, dev: true },
                      { cap: 'Bug Tracker & Code Updates', owner: true, mgr: false, agent: false, dev: true }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-[#fdfcf9]">
                        <td className="p-3 font-bold text-[#1a1a1a]">{row.cap}</td>
                        <td className="p-3 text-center bg-amber-50/50">
                          {row.owner ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-red-500 mx-auto" />}
                        </td>
                        <td className="p-3 text-center">
                          {row.mgr ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-red-500 mx-auto" />}
                        </td>
                        <td className="p-3 text-center">
                          {row.agent ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-red-500 mx-auto" />}
                        </td>
                        <td className="p-3 text-center bg-cyan-50/50">
                          {row.dev ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-red-500 mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 10: SUBSCRIPTIONS & BILLING */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {subscriptionPlans.map((plan) => (
                  <div key={plan.id} className="border-2 border-[#1a1a1a] bg-white p-5 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-serif-luxury font-bold text-lg text-[#1a1a1a]">{plan.name}</span>
                      <span className="bg-[#c4a47c] text-black text-[9px] font-bold px-2 py-0.5 uppercase">
                        {plan.roleTarget}
                      </span>
                    </div>

                    <div className="text-2xl font-bold font-serif-luxury text-[#1a1a1a]">
                      ₹ {plan.price.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-mono-luxury font-normal text-[#1a1a1a]/60">/{plan.billingCycle}</span>
                    </div>

                    <ul className="text-xs font-mono-luxury text-[#1a1a1a]/80 space-y-1.5 pt-2 border-t border-[#1a1a1a]/10">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-3 border-t border-[#1a1a1a]/10 text-xs font-mono-luxury text-[#1a1a1a]/60">
                      Active Subscribers: <strong>{plan.activeSubscribers}</strong>
                    </div>
                  </div>
                ))}
              </div>

              {/* Invoices List */}
              <div className="border border-[#1a1a1a] bg-white p-5 space-y-3">
                <h5 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                  Recent Payment Invoices & Collections
                </h5>

                <div className="border border-[#1a1a1a]/20 overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono-luxury">
                    <thead className="bg-[#1a1a1a] text-white">
                      <tr>
                        <th className="p-2.5">Invoice #</th>
                        <th className="p-2.5">User</th>
                        <th className="p-2.5">Plan</th>
                        <th className="p-2.5">Amount</th>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1a]/10">
                      {invoices.map((inv) => (
                        <tr key={inv.id}>
                          <td className="p-2.5 font-bold">{inv.id}</td>
                          <td className="p-2.5">{inv.userName}</td>
                          <td className="p-2.5">{inv.planName}</td>
                          <td className="p-2.5 font-bold">₹ {inv.amount}</td>
                          <td className="p-2.5 text-[#1a1a1a]/60">{inv.date}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DOMAIN & WEBSITE FORWARDING */}
          {activeTab === 'domain' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header Card */}
              <div className="border border-[#1a1a1a] bg-white p-5 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#1a1a1a]/15">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#1a1a1a] text-[#c4a47c] flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif-luxury font-bold text-base text-[#1a1a1a]">
                        Purchased Website & Custom Domain Forwarding
                      </h4>
                      <p className="text-xs font-mono-luxury text-[#1a1a1a]/60">
                        Connect your purchased domain (GoDaddy, Hostinger, Namecheap, etc.) to your live NS Properties portal
                      </p>
                    </div>
                  </div>

                  {savedPurchasedDomain ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold font-mono-luxury flex items-center gap-1.5 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Configured: {savedPurchasedDomain}</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-bold font-mono-luxury flex items-center gap-1.5 border border-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Domain Not Linked Yet</span>
                    </span>
                  )}
                </div>

                {/* TARGET DESTINATION URL (CRITICAL INFORMATION) */}
                <div className="bg-[#fdfcf9] border-2 border-[#c4a47c] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold font-mono-luxury uppercase tracking-wider text-[#1a1a1a] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#c4a47c]" />
                      <span>Your Live Website Target URL (Copy This)</span>
                    </span>
                    <span className="text-[10px] bg-[#1a1a1a] text-[#c4a47c] px-2 py-0.5 font-bold uppercase">
                      Destination Address
                    </span>
                  </div>

                  <p className="text-xs text-[#1a1a1a]/70 font-mono-luxury">
                    This is the live, public address of your NS Properties portal. In your domain provider (GoDaddy, Hostinger, etc.), point or forward your domain to this exact URL:
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 bg-white border border-[#1a1a1a] px-3 py-2 font-mono-luxury text-xs text-[#1a1a1a] font-bold truncate select-all">
                      {PUBLIC_SHARED_APP_URL}
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyTargetUrl}
                      className="px-4 py-2 bg-[#1a1a1a] hover:bg-black text-[#c4a47c] border border-[#c4a47c] font-bold text-xs uppercase font-mono-luxury flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                    >
                      {copiedTargetUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedTargetUrl ? 'Copied!' : 'Copy Target URL'}</span>
                    </button>

                    <a
                      href={PUBLIC_SHARED_APP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#fdfcf9] hover:bg-white text-[#1a1a1a] border border-[#1a1a1a] cursor-pointer shrink-0"
                      title="Open Live Destination URL in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* STEP 1: CONFIGURE PURCHASED DOMAIN INPUT */}
                <form onSubmit={handleSavePurchasedDomain} className="bg-white border border-[#1a1a1a]/20 p-4 space-y-3">
                  <h5 className="font-serif-luxury font-bold text-sm text-[#1a1a1a] flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[#c4a47c]" />
                    <span>Step 1: Enter Your Purchased Domain Name</span>
                  </h5>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={purchasedDomainInput}
                      onChange={(e) => setPurchasedDomainInput(e.target.value)}
                      placeholder="e.g., nsproperties.in, nspropertiesluxury.com, www.nsproperties.in"
                      className="flex-1 px-3 py-2 border border-[#1a1a1a] text-xs font-mono-luxury outline-none bg-[#fdfcf9]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#c4a47c] hover:bg-[#b09066] text-black font-bold text-xs uppercase font-mono-luxury cursor-pointer transition-colors whitespace-nowrap"
                    >
                      Save Domain Settings
                    </button>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono-luxury block">
                    Saved in browser settings so your portal links, PWA manifests, and share badges recognize your custom domain.
                  </span>
                </form>
              </div>

              {/* STEP 2: FORWARDING GUIDES (BY REGISTRAR) */}
              <div className="border border-[#1a1a1a] bg-white p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#1a1a1a]/15">
                  <h5 className="font-serif-luxury font-bold text-base text-[#1a1a1a]">
                    Step 2: Select Your Domain Registrar (Click-by-Click Instructions)
                  </h5>
                  <span className="text-[10px] text-gray-500 font-mono-luxury">
                    Select where you purchased your domain:
                  </span>
                </div>

                {/* Registrar Selector Tabs */}
                <div className="flex flex-wrap gap-1.5 border-b border-[#1a1a1a]/20 pb-2">
                  {[
                    { id: 'godaddy', label: 'GoDaddy' },
                    { id: 'hostinger', label: 'Hostinger' },
                    { id: 'namecheap', label: 'Namecheap' },
                    { id: 'bigrock', label: 'BigRock' },
                    { id: 'cloudflare', label: 'Cloudflare (Free Custom SSL)' }
                  ].map((reg) => (
                    <button
                      key={reg.id}
                      type="button"
                      onClick={() => setActiveRegistrarGuide(reg.id as any)}
                      className={`px-3 py-1.5 text-xs font-mono-luxury font-bold uppercase transition-colors cursor-pointer border ${
                        activeRegistrarGuide === reg.id
                          ? 'bg-[#1a1a1a] text-[#c4a47c] border-[#1a1a1a]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                      }`}
                    >
                      {reg.label}
                    </button>
                  ))}
                </div>

                {/* GODADDY GUIDE */}
                {activeRegistrarGuide === 'godaddy' && (
                  <div className="p-4 bg-[#fdfcf9] border border-[#1a1a1a]/20 space-y-3 font-mono-luxury text-xs text-[#1a1a1a]">
                    <div className="flex items-center gap-2 text-sm font-bold font-serif-luxury text-[#1a1a1a]">
                      <span className="w-6 h-6 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-xs">1</span>
                      <span>How to Forward Your Purchased Domain on GoDaddy</span>
                    </div>

                    <ol className="list-decimal list-inside space-y-2 text-[#1a1a1a]/80 pl-1 leading-relaxed">
                      <li>Log in to your <strong>GoDaddy Account</strong>.</li>
                      <li>Go to <strong>My Products</strong> and click on your purchased domain (e.g., <em>{savedPurchasedDomain || 'nsproperties.in'}</em>).</li>
                      <li>Scroll down to the <strong>Additional Settings</strong> section and click <strong>Manage DNS</strong>.</li>
                      <li>Scroll down to the <strong>Forwarding</strong> section and click <strong>Add Forwarding</strong> next to <em>Domain</em>.</li>
                      <li>
                        In the <strong>Forward To</strong> dropdown, select <span className="font-bold text-blue-700">https://</span> and paste your Target URL:
                        <div className="bg-white p-2 border border-[#1a1a1a]/30 my-1 font-bold select-all text-[11px] text-[#1a1a1a]">
                          {PUBLIC_SHARED_APP_URL.replace('https://', '')}
                        </div>
                      </li>
                      <li><strong>Forward Type:</strong> Select <strong>Permanent (301)</strong>.</li>
                      <li><strong>Forwarding Settings:</strong> Choose <strong>Forward with Masking</strong> (if you want your purchased domain to stay in the address bar) or <strong>Forward Only</strong>.</li>
                      <li>Click <strong>Save</strong>. GoDaddy DNS propagation takes approximately 10 to 30 minutes!</li>
                    </ol>
                  </div>
                )}

                {/* HOSTINGER GUIDE */}
                {activeRegistrarGuide === 'hostinger' && (
                  <div className="p-4 bg-[#fdfcf9] border border-[#1a1a1a]/20 space-y-3 font-mono-luxury text-xs text-[#1a1a1a]">
                    <div className="flex items-center gap-2 text-sm font-bold font-serif-luxury text-[#1a1a1a]">
                      <span className="w-6 h-6 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-xs">1</span>
                      <span>How to Forward Your Purchased Domain on Hostinger</span>
                    </div>

                    <ol className="list-decimal list-inside space-y-2 text-[#1a1a1a]/80 pl-1 leading-relaxed">
                      <li>Log in to <strong>Hostinger hPanel</strong>.</li>
                      <li>Navigate to <strong>Domains</strong> and click <strong>Manage</strong> next to your domain.</li>
                      <li>In the left menu, click <strong>Redirects</strong>.</li>
                      <li>Under <strong>Create a Redirect</strong>:
                        <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                          <li><strong>Redirect from:</strong> Select your domain.</li>
                          <li><strong>Redirect to:</strong> Enter <span className="font-bold text-blue-700">{PUBLIC_SHARED_APP_URL}</span>.</li>
                          <li><strong>Type:</strong> Select <strong>Permanent (301)</strong>.</li>
                        </ul>
                      </li>
                      <li>Click the <strong>Create</strong> button. Hostinger will activate the redirect within 5–15 minutes!</li>
                    </ol>
                  </div>
                )}

                {/* NAMECHEAP GUIDE */}
                {activeRegistrarGuide === 'namecheap' && (
                  <div className="p-4 bg-[#fdfcf9] border border-[#1a1a1a]/20 space-y-3 font-mono-luxury text-xs text-[#1a1a1a]">
                    <div className="flex items-center gap-2 text-sm font-bold font-serif-luxury text-[#1a1a1a]">
                      <span className="w-6 h-6 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-xs">1</span>
                      <span>How to Forward Your Purchased Domain on Namecheap</span>
                    </div>

                    <ol className="list-decimal list-inside space-y-2 text-[#1a1a1a]/80 pl-1 leading-relaxed">
                      <li>Log in to your <strong>Namecheap Dashboard</strong>.</li>
                      <li>Go to <strong>Domain List</strong> and click <strong>Manage</strong> next to your purchased domain.</li>
                      <li>On the <strong>Domain</strong> tab, scroll down to the <strong>Redirect Domain</strong> section.</li>
                      <li>Click <strong>Add Redirect</strong>.</li>
                      <li><strong>Source URL:</strong> Enter your domain (e.g., <em>http://{savedPurchasedDomain || 'nsproperties.in'}</em>).</li>
                      <li><strong>Destination URL:</strong> Enter <span className="font-bold text-blue-700">{PUBLIC_SHARED_APP_URL}</span>.</li>
                      <li>Click the green checkmark <strong>Save changes</strong>.</li>
                    </ol>
                  </div>
                )}

                {/* BIGROCK GUIDE */}
                {activeRegistrarGuide === 'bigrock' && (
                  <div className="p-4 bg-[#fdfcf9] border border-[#1a1a1a]/20 space-y-3 font-mono-luxury text-xs text-[#1a1a1a]">
                    <div className="flex items-center gap-2 text-sm font-bold font-serif-luxury text-[#1a1a1a]">
                      <span className="w-6 h-6 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-xs">1</span>
                      <span>How to Forward Your Purchased Domain on BigRock</span>
                    </div>

                    <ol className="list-decimal list-inside space-y-2 text-[#1a1a1a]/80 pl-1 leading-relaxed">
                      <li>Log in to your <strong>BigRock Control Panel</strong>.</li>
                      <li>Go to <strong>Manage Orders &rarr; List/Search Orders</strong> and select your domain name.</li>
                      <li>Click on <strong>Domain Forwarding</strong> on the right-hand side.</li>
                      <li>Click <strong>Manage Domain Forwarding</strong>.</li>
                      <li>Enter Destination URL: <span className="font-bold text-blue-700">{PUBLIC_SHARED_APP_URL}</span>.</li>
                      <li>Enable <strong>URL Masking / Stealth Redirection</strong> if you want your domain to stay in the browser URL bar.</li>
                      <li>Click <strong>Save</strong>.</li>
                    </ol>
                  </div>
                )}

                {/* CLOUDFLARE GUIDE */}
                {activeRegistrarGuide === 'cloudflare' && (
                  <div className="p-4 bg-[#fdfcf9] border border-[#1a1a1a]/20 space-y-3 font-mono-luxury text-xs text-[#1a1a1a]">
                    <div className="flex items-center gap-2 text-sm font-bold font-serif-luxury text-[#1a1a1a]">
                      <span className="w-6 h-6 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-xs">1</span>
                      <span>How to Set Up a True Custom Domain via Cloudflare (Free SSL & Retain URL)</span>
                    </div>

                    <p className="text-gray-600">
                      Cloudflare lets you show your purchased domain (e.g., <em>www.nsproperties.in</em>) in your visitors' browser address bar with free SSL encryption and global DDoS protection.
                    </p>

                    <ol className="list-decimal list-inside space-y-2 text-[#1a1a1a]/80 pl-1 leading-relaxed">
                      <li>Create a free account on <strong>Cloudflare.com</strong> and add your purchased domain.</li>
                      <li>Point your domain registrar's nameservers to Cloudflare (as shown on Cloudflare screen).</li>
                      <li>
                        Go to <strong>DNS &rarr; Records</strong> and add:
                        <div className="bg-white p-2.5 border border-[#1a1a1a]/30 my-1 font-mono-luxury text-[11px] space-y-1">
                          <div><strong>Type:</strong> CNAME</div>
                          <div><strong>Name:</strong> www</div>
                          <div><strong>Target:</strong> ais-pre-iwndiyzigsglaztxgszw2g-775754830492.asia-southeast1.run.app</div>
                          <div><strong>Proxy Status:</strong> Proxied (Orange cloud on)</div>
                        </div>
                      </li>
                      <li>Go to <strong>Rules &rarr; Redirect Rules</strong> and create a rule to forward root domain (<em>{savedPurchasedDomain || 'nsproperties.in'}</em>) to <em>www.{savedPurchasedDomain || 'nsproperties.in'}</em>.</li>
                      <li>Under <strong>SSL/TLS</strong>, ensure encryption mode is set to <strong>Full</strong>.</li>
                    </ol>
                  </div>
                )}
              </div>

              {/* STEP 3: LIVE FORWARDING TESTER */}
              <div className="border border-[#1a1a1a] bg-white p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#1a1a1a]/15">
                  <h5 className="font-serif-luxury font-bold text-base text-[#1a1a1a]">
                    Step 3: Test & Verify Your Forwarding Live
                  </h5>
                  <span className="text-[10px] text-gray-500 font-mono-luxury">
                    Real-time verification
                  </span>
                </div>

                <div className="p-4 bg-[#fdfcf9] border border-[#1a1a1a]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h6 className="font-serif-luxury font-bold text-sm text-[#1a1a1a]">
                      Ready to check your purchased domain?
                    </h6>
                    <p className="text-xs text-[#1a1a1a]/70 font-mono-luxury mt-0.5">
                      {savedPurchasedDomain
                        ? `Click to test if https://${savedPurchasedDomain} forwards properly to your live website.`
                        : 'Save your purchased domain above to run a live test.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestDomainForwarding}
                    disabled={isTestingDomain || !savedPurchasedDomain}
                    className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-black text-[#c4a47c] border border-[#c4a47c] font-bold text-xs uppercase font-mono-luxury flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{isTestingDomain ? 'Testing...' : 'Test Purchased Domain →'}</span>
                  </button>
                </div>

                {testDomainResult && (
                  <div className="p-3 bg-blue-50 border border-blue-300 text-blue-900 text-xs font-mono-luxury">
                    {testDomainResult}
                  </div>
                )}

                {/* FAQ / TROUBLESHOOTING BOX */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="border border-[#1a1a1a]/15 p-3 bg-white space-y-1 text-xs font-mono-luxury">
                    <span className="font-bold text-[#1a1a1a] block">⏱️ How long does it take?</span>
                    <p className="text-[#1a1a1a]/70 text-[11px] leading-relaxed">
                      DNS propagation typically takes 5 to 30 minutes, though some providers can take up to 24 hours.
                    </p>
                  </div>

                  <div className="border border-[#1a1a1a]/15 p-3 bg-white space-y-1 text-xs font-mono-luxury">
                    <span className="font-bold text-[#1a1a1a] block">🔒 Is SSL included?</span>
                    <p className="text-[#1a1a1a]/70 text-[11px] leading-relaxed">
                      Yes! Your live destination URL automatically has Google Cloud SSL. Most registrars provide automatic HTTPS forwarding.
                    </p>
                  </div>

                  <div className="border border-[#1a1a1a]/15 p-3 bg-white space-y-1 text-xs font-mono-luxury">
                    <span className="font-bold text-[#1a1a1a] block">📱 Does Android PWA work?</span>
                    <p className="text-[#1a1a1a]/70 text-[11px] leading-relaxed">
                      Yes! When visitors open your purchased domain, the app prompts them to install NSProperties on their phone home screen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: SETTINGS & NOTIFICATIONS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="border border-[#1a1a1a] bg-white p-5 space-y-4">
                <h5 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                  Platform Notification Gateways
                </h5>

                <div className="space-y-3 text-xs font-mono-luxury">
                  <label className="flex items-center justify-between p-3 border border-[#1a1a1a]/20 bg-[#fdfcf9] cursor-pointer">
                    <div>
                      <span className="font-bold text-[#1a1a1a] block">Instant WhatsApp Alert for Owner on New Leads</span>
                      <span className="text-[#1a1a1a]/60 text-[10px]">Sends real-time message when a buyer clicks phone unlock.</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#1a1a1a]" />
                  </label>

                  <label className="flex items-center justify-between p-3 border border-[#1a1a1a]/20 bg-[#fdfcf9] cursor-pointer">
                    <div>
                      <span className="font-bold text-[#1a1a1a] block">RERA Verification Auto-Audit Check</span>
                      <span className="text-[#1a1a1a]/60 text-[10px]">Verifies state RERA ID format before listing activation.</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#1a1a1a]" />
                  </label>

                  <label className="flex items-center justify-between p-3 border border-[#1a1a1a]/20 bg-[#fdfcf9] cursor-pointer">
                    <div>
                      <span className="font-bold text-[#1a1a1a] block">Shield Private Owner Leads from Regular Visitors</span>
                      <span className="text-[#1a1a1a]/60 text-[10px]">Public visitors browsing cannot view the owner lead sheet.</span>
                    </div>
                    <input type="checkbox" defaultChecked disabled className="w-4 h-4 accent-emerald-600" />
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Console Footer */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] px-6 py-3 border-t border-[#1a1a1a] flex flex-wrap items-center justify-between gap-3 text-xs font-mono-luxury">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>App Owner Console Live • Secure Session</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#c4a47c] text-black font-bold uppercase hover:bg-[#b09066] transition-colors cursor-pointer"
            >
              Exit Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
