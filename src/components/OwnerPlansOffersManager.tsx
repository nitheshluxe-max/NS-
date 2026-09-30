import React, { useState, useMemo } from 'react';
import {
  Tag,
  Percent,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Check,
  X,
  AlertCircle,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  MessageSquare,
  ShieldCheck,
  Users,
  Building,
  DollarSign,
  BarChart3,
  Search,
  Filter,
  Lock,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Flame,
  Crown,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { Offer, SubscriptionPlan, OfferEnquiry, Property, OfferCategory } from '../types';
import { formatIndianCurrency } from '../utils/formatters';
import { logOfferActivity, isOfferActiveAndValid } from '../data/plansOffersData';
import { DEFAULT_CONTACT_PHONE, openWhatsAppChat } from '../utils/whatsapp';

export interface OwnerPlansOffersManagerProps {
  offers: Offer[];
  onUpdateOffers: (offers: Offer[]) => void;
  subscriptionPlans: SubscriptionPlan[];
  onUpdateSubscriptionPlans: (plans: SubscriptionPlan[]) => void;
  enquiries: OfferEnquiry[];
  onUpdateEnquiries: (enquiries: OfferEnquiry[]) => void;
  properties: Property[];
}

export const OwnerPlansOffersManager: React.FC<OwnerPlansOffersManagerProps> = ({
  offers,
  onUpdateOffers,
  subscriptionPlans,
  onUpdateSubscriptionPlans,
  enquiries,
  onUpdateEnquiries,
  properties
}) => {
  const [subTab, setSubTab] = useState<'offers' | 'create_offer' | 'subscriptions' | 'enquiries' | 'analytics'>('offers');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [notification, setNotification] = useState('');

  // Form State for Create / Edit Offer
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formBannerImage, setFormBannerImage] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');
  const [formDiscountType, setFormDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [formDiscountValue, setFormDiscountValue] = useState<number>(8);
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formEndDate, setFormEndDate] = useState(
    new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [formCategory, setFormCategory] = useState<OfferCategory>('property_discount');
  const [formFeatured, setFormFeatured] = useState(true);
  const [formApplicableProps, setFormApplicableProps] = useState<string[]>(['ALL']);
  const [formProjectNames, setFormProjectNames] = useState('Prestige Kingfisher Towers, DLF Magnolias');
  const [formMinBooking, setFormMinBooking] = useState<number>(500000);
  const [formUsageLimit, setFormUsageLimit] = useState<number>(25);
  const [formTerms, setFormTerms] = useState<string[]>([
    'Offer valid on confirmed booking token received before expiry.',
    'Applicable on basic sale price excluding statutory taxes.',
    'Cannot be clubbed with other direct broker schemes.'
  ]);
  const [newTermInput, setNewTermInput] = useState('');

  // Subscription Plan Edit state
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [planFormName, setPlanFormName] = useState('');
  const [planFormPrice, setPlanFormPrice] = useState(0);
  const [planFormListingLimit, setPlanFormListingLimit] = useState(10);
  const [planFormLeadLimit, setPlanFormLeadLimit] = useState('30 Leads / mo');
  const [planFormFeaturedLimit, setPlanFormFeaturedLimit] = useState(2);
  const [planFormDuration, setPlanFormDuration] = useState(90);
  const [planFormStatus, setPlanFormStatus] = useState<'active' | 'inactive'>('active');

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  // Filtered Offers
  const filteredOffers = useMemo(() => {
    return offers.filter((o) => {
      if (categoryFilter !== 'all' && o.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          o.title.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q) ||
          (o.applicableProjectNames && o.applicableProjectNames.some(p => p.toLowerCase().includes(q)))
        );
      }
      return true;
    });
  }, [offers, categoryFilter, statusFilter, searchQuery]);

  // Open Create Form
  const handleOpenCreateForm = () => {
    setEditingOffer(null);
    setFormTitle('');
    setFormDescription('');
    setFormBannerImage('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');
    setFormDiscountType('percentage');
    setFormDiscountValue(8);
    setFormStartDate(new Date().toISOString().split('T')[0]);
    setFormEndDate(new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setFormStatus('active');
    setFormCategory('festival');
    setFormFeatured(true);
    setFormApplicableProps(['ALL']);
    setFormProjectNames('Prestige Kingfisher Towers, Sobha Lifestyle');
    setFormMinBooking(500000);
    setFormUsageLimit(20);
    setFormTerms([
      'Offer valid on confirmed booking token received before expiry.',
      'Discount applicable on basic selling price (BSP).',
      'Cannot be clubbed with secondary resale schemes.'
    ]);
    setSubTab('create_offer');
  };

  // Open Edit Form
  const handleOpenEditForm = (offer: Offer) => {
    setEditingOffer(offer);
    setFormTitle(offer.title);
    setFormDescription(offer.description);
    setFormBannerImage(offer.bannerImage);
    setFormDiscountType(offer.discountType);
    setFormDiscountValue(offer.discountValue);
    setFormStartDate(offer.startDate);
    setFormEndDate(offer.endDate);
    setFormStatus(offer.status === 'expired' ? 'inactive' : offer.status);
    setFormCategory(offer.category);
    setFormFeatured(offer.featured);
    setFormApplicableProps(offer.applicablePropertyIds || ['ALL']);
    setFormProjectNames((offer.applicableProjectNames || []).join(', '));
    setFormMinBooking(offer.minBookingAmount || 500000);
    setFormUsageLimit(offer.usageLimit || 25);
    setFormTerms(offer.termsAndConditions || []);
    setSubTab('create_offer');
  };

  // Save Offer (Create or Update)
  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      alert('Please enter an offer title.');
      return;
    }

    if (new Date(formStartDate) > new Date(formEndDate)) {
      alert('Offer start date cannot be later than expiry date.');
      return;
    }

    if (formDiscountValue <= 0) {
      alert('Discount value must be greater than zero.');
      return;
    }

    const projectsList = formProjectNames
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingOffer) {
      // Update existing offer
      const updatedOffer: Offer = {
        ...editingOffer,
        title: formTitle.trim(),
        description: formDescription.trim(),
        bannerImage: formBannerImage,
        discountType: formDiscountType,
        discountValue: Number(formDiscountValue),
        startDate: formStartDate,
        endDate: formEndDate,
        status: formStatus,
        category: formCategory,
        featured: formFeatured,
        applicablePropertyIds: formApplicableProps.length > 0 ? formApplicableProps : ['ALL'],
        applicableProjectNames: projectsList,
        minBookingAmount: formMinBooking ? Number(formMinBooking) : undefined,
        termsAndConditions: formTerms,
        usageLimit: formUsageLimit ? Number(formUsageLimit) : undefined,
        updatedAt: new Date().toISOString()
      };

      const nextOffers = offers.map(o => (o.id === editingOffer.id ? updatedOffer : o));
      onUpdateOffers(nextOffers);

      logOfferActivity({
        action: 'UPDATE',
        entityType: 'offer',
        entityId: updatedOffer.id,
        title: updatedOffer.title,
        performedBy: 'App Owner',
        userRole: 'owner',
        details: `Updated offer terms, discount: ${updatedOffer.discountValue}${updatedOffer.discountType === 'percentage' ? '%' : ' INR'}`
      });

      showToast(`Updated offer: "${updatedOffer.title}"`);
    } else {
      // Create new offer
      const newOffer: Offer = {
        id: `off-${Date.now()}`,
        title: formTitle.trim(),
        description: formDescription.trim(),
        bannerImage: formBannerImage,
        discountType: formDiscountType,
        discountValue: Number(formDiscountValue),
        startDate: formStartDate,
        endDate: formEndDate,
        status: formStatus,
        category: formCategory,
        featured: formFeatured,
        applicablePropertyIds: formApplicableProps.length > 0 ? formApplicableProps : ['ALL'],
        applicableProjectNames: projectsList,
        minBookingAmount: formMinBooking ? Number(formMinBooking) : undefined,
        termsAndConditions: formTerms,
        usageLimit: formUsageLimit ? Number(formUsageLimit) : undefined,
        usageCount: 0,
        viewsCount: 0,
        enquiriesCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'App Owner'
      };

      onUpdateOffers([newOffer, ...offers]);

      logOfferActivity({
        action: 'CREATE',
        entityType: 'offer',
        entityId: newOffer.id,
        title: newOffer.title,
        performedBy: 'App Owner',
        userRole: 'owner',
        details: `Created new promotion: "${newOffer.title}" with discount: ${newOffer.discountValue}${newOffer.discountType === 'percentage' ? '%' : ' INR'}`
      });

      showToast(`New offer "${newOffer.title}" created successfully!`);
    }

    setSubTab('offers');
  };

  // Toggle Offer Active / Inactive
  const handleToggleOfferStatus = (offerId: string) => {
    const target = offers.find(o => o.id === offerId);
    if (!target) return;

    const nextStatus: 'active' | 'inactive' = target.status === 'active' ? 'inactive' : 'active';
    const updated = offers.map(o => (o.id === offerId ? { ...o, status: nextStatus, updatedAt: new Date().toISOString() } : o));
    onUpdateOffers(updated);

    logOfferActivity({
      action: nextStatus === 'active' ? 'ACTIVATE' : 'DEACTIVATE',
      entityType: 'offer',
      entityId: offerId,
      title: target.title,
      performedBy: 'App Owner',
      userRole: 'owner',
      details: `Offer status toggled to: ${nextStatus.toUpperCase()}`
    });

    showToast(`Offer "${target.title}" is now ${nextStatus.toUpperCase()}.`);
  };

  // Delete Offer
  const handleDeleteOffer = (offerId: string) => {
    const target = offers.find(o => o.id === offerId);
    if (!target) return;

    if (confirm(`Are you sure you want to permanently delete the offer "${target.title}"?`)) {
      const updated = offers.filter(o => o.id !== offerId);
      onUpdateOffers(updated);

      logOfferActivity({
        action: 'DELETE',
        entityType: 'offer',
        entityId: offerId,
        title: target.title,
        performedBy: 'App Owner',
        userRole: 'owner',
        details: `Deleted offer campaign: ${target.title}`
      });

      showToast(`Offer "${target.title}" deleted.`);
    }
  };

  // Add Term to List
  const handleAddTerm = () => {
    if (!newTermInput.trim()) return;
    setFormTerms([...formTerms, newTermInput.trim()]);
    setNewTermInput('');
  };

  const handleRemoveTerm = (index: number) => {
    setFormTerms(formTerms.filter((_, i) => i !== index));
  };

  // Toggle Applicable Property in Form
  const handleTogglePropSelection = (propId: string) => {
    if (propId === 'ALL') {
      setFormApplicableProps(['ALL']);
      return;
    }
    const current = formApplicableProps.filter(id => id !== 'ALL');
    if (current.includes(propId)) {
      const next = current.filter(id => id !== propId);
      setFormApplicableProps(next.length === 0 ? ['ALL'] : next);
    } else {
      setFormApplicableProps([...current, propId]);
    }
  };

  // Toggle Subscription Plan Status
  const handleTogglePlanStatus = (planId: string) => {
    const updated = subscriptionPlans.map(p => {
      if (p.id === planId) {
        const nextStatus = p.planStatus === 'active' ? 'inactive' : 'active';
        return { ...p, planStatus: nextStatus as 'active' | 'inactive' };
      }
      return p;
    });
    onUpdateSubscriptionPlans(updated);
    showToast('Subscription plan status updated.');
  };

  // Update Enquiry Status
  const handleUpdateEnquiryStatus = (enquiryId: string, newStatus: OfferEnquiry['status']) => {
    const updated = enquiries.map(e => (e.id === enquiryId ? { ...e, status: newStatus } : e));
    onUpdateEnquiries(updated);
    showToast(`Enquiry marked as "${newStatus}".`);
  };

  return (
    <div className="space-y-6 font-mono-luxury">
      
      {/* Toast Alert */}
      {notification && (
        <div className="p-3 bg-emerald-600 text-white font-bold text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification('')} className="text-white hover:underline text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Sub-navigation Menu within Plans & Offers */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-[#1a1a1a]">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setSubTab('offers')}
            className={`px-3 py-2 text-xs font-bold uppercase cursor-pointer border flex items-center gap-1.5 transition-all ${
              subTab === 'offers'
                ? 'bg-[#1a1a1a] text-[#c4a47c] border-[#1a1a1a]'
                : 'bg-white text-gray-700 border-gray-300 hover:border-black'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span>Active Offers ({offers.length})</span>
          </button>

          <button
            onClick={() => setSubTab('subscriptions')}
            className={`px-3 py-2 text-xs font-bold uppercase cursor-pointer border flex items-center gap-1.5 transition-all ${
              subTab === 'subscriptions'
                ? 'bg-[#1a1a1a] text-[#c4a47c] border-[#1a1a1a]'
                : 'bg-white text-gray-700 border-gray-300 hover:border-black'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span>Subscription Plans ({subscriptionPlans.length})</span>
          </button>

          <button
            onClick={() => setSubTab('enquiries')}
            className={`px-3 py-2 text-xs font-bold uppercase cursor-pointer border flex items-center gap-1.5 transition-all ${
              subTab === 'enquiries'
                ? 'bg-[#1a1a1a] text-[#c4a47c] border-[#1a1a1a]'
                : 'bg-white text-gray-700 border-gray-300 hover:border-black'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>Customer Enquiries ({enquiries.length})</span>
          </button>

          <button
            onClick={() => setSubTab('analytics')}
            className={`px-3 py-2 text-xs font-bold uppercase cursor-pointer border flex items-center gap-1.5 transition-all ${
              subTab === 'analytics'
                ? 'bg-[#1a1a1a] text-[#c4a47c] border-[#1a1a1a]'
                : 'bg-white text-gray-700 border-gray-300 hover:border-black'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Conversions & Analytics</span>
          </button>
        </div>

        {subTab === 'offers' && (
          <button
            type="button"
            onClick={handleOpenCreateForm}
            className="px-4 py-2 bg-[#c4a47c] hover:bg-[#b09066] text-black font-black uppercase text-xs flex items-center gap-1.5 cursor-pointer shadow-xs border border-black"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Create New Offer</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. OFFERS CATALOG (LIST, EDIT, DELETE, TOGGLE) */}
      {/* ========================================================================= */}
      {subTab === 'offers' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="p-3 bg-white border border-[#1a1a1a]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search offers by title, project, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-gray-300 bg-white text-xs outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="festival">Festival Concession</option>
                <option value="limited_time">Limited Time</option>
                <option value="property_discount">Property Discount</option>
                <option value="special_project">Special Project</option>
                <option value="booking_benefit">Booking Benefit</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-2.5 py-1.5 border border-gray-300 bg-white text-xs outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Offers Table / Cards */}
          {filteredOffers.length === 0 ? (
            <div className="p-8 text-center bg-white border border-gray-200 text-gray-500">
              <Tag className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="font-bold">No offers found matching your filters.</p>
              <button
                type="button"
                onClick={handleOpenCreateForm}
                className="mt-3 px-3 py-1.5 bg-[#1a1a1a] text-[#c4a47c] text-xs font-bold uppercase cursor-pointer"
              >
                Create First Offer
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOffers.map((offer) => {
                const isActive = offer.status === 'active';
                const isValidNow = isOfferActiveAndValid(offer);

                return (
                  <div
                    key={offer.id}
                    className="p-4 bg-white border-2 border-[#1a1a1a]/20 hover:border-[#1a1a1a] transition-all shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={offer.bannerImage}
                        alt={offer.title}
                        className="w-24 h-16 object-cover border border-gray-300 shrink-0"
                      />

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-serif-luxury font-bold text-base text-[#1a1a1a]">
                            {offer.title}
                          </h4>

                          <span className="bg-[#c4a47c] text-black font-black text-[9px] px-2 py-0.5 uppercase">
                            {offer.discountType === 'percentage'
                              ? `${offer.discountValue}% OFF`
                              : `₹ ${(offer.discountValue / 100000).toFixed(0)} LAKHS SAVINGS`}
                          </span>

                          {offer.featured && (
                            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-bold px-1.5 py-0.2 uppercase">
                              Featured
                            </span>
                          )}

                          <span className={`text-[9px] font-bold px-1.5 py-0.2 uppercase border ${
                            isActive
                              ? isValidNow
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-gray-100 text-gray-600 border-gray-300'
                          }`}>
                            {isActive ? (isValidNow ? 'LIVE ACTIVE' : 'EXPIRED') : 'INACTIVE'}
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-1 max-w-2xl font-sans">
                          {offer.description}
                        </p>

                        <div className="flex items-center gap-4 text-[11px] text-gray-500 pt-1 flex-wrap">
                          <span>Validity: <strong>{offer.startDate}</strong> to <strong>{offer.endDate}</strong></span>
                          <span>Min Booking: <strong>{offer.minBookingAmount ? formatIndianCurrency(offer.minBookingAmount) : 'Standard'}</strong></span>
                          <span>Usage: <strong>{offer.usageCount} / {offer.usageLimit || '∞'}</strong></span>
                          <span>Views: <strong>{offer.viewsCount}</strong></span>
                          <span className="text-blue-700 font-bold">Enquiries: {offer.enquiriesCount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-2 lg:pt-0">
                      {/* Activate/Deactivate Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleOfferStatus(offer.id)}
                        className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer border ${
                          isActive
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        {isActive ? 'Deactivate' : 'Activate'}
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditForm(offer)}
                        className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="p-1.5 border border-red-300 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Offer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CREATE / EDIT OFFER FORM (FULL SPECIFICATION REQUIREMENT 1) */}
      {/* ========================================================================= */}
      {subTab === 'create_offer' && (
        <form onSubmit={handleSaveOffer} className="bg-white border-2 border-[#1a1a1a] p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]/20">
            <div>
              <h3 className="font-serif-luxury font-bold text-lg text-[#1a1a1a]">
                {editingOffer ? `Edit Offer: ${editingOffer.title}` : 'Create New Promotional Offer'}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Set discount values, validity dates, terms & conditions, and assign applicable properties.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSubTab('offers')}
              className="text-xs text-gray-500 hover:text-black uppercase font-bold"
            >
              Cancel & Back
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Offer Title */}
            <div className="md:col-span-2">
              <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                Offer Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Diwali Royal High-Rise Concession"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                Offer Description & Marketing Copy *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Detailed customer benefits, concession terms, and free inclusions..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none"
              />
            </div>

            {/* Discount Type & Value */}
            <div>
              <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                Discount Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormDiscountType('percentage')}
                  className={`py-2 text-xs font-bold uppercase border cursor-pointer ${
                    formDiscountType === 'percentage'
                      ? 'bg-[#1a1a1a] text-[#c4a47c] border-[#1a1a1a]'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => setFormDiscountType('fixed')}
                  className={`py-2 text-xs font-bold uppercase border cursor-pointer ${
                    formDiscountType === 'fixed'
                      ? 'bg-[#1a1a1a] text-[#c4a47c] border-[#1a1a1a]'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  Fixed Cash Amount (₹)
                </button>
              </div>
            </div>

            <div>
              <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                {formDiscountType === 'percentage' ? 'Discount Percentage (%) *' : 'Fixed Discount Amount (₹ in Rupees) *'}
              </label>
              <input
                type="number"
                required
                min={1}
                placeholder={formDiscountType === 'percentage' ? 'e.g. 8' : 'e.g. 2500000'}
                value={formDiscountValue}
                onChange={(e) => setFormDiscountValue(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">
                {formDiscountType === 'percentage'
                  ? `Applies ${formDiscountValue}% off basic price`
                  : `Flat ${formatIndianCurrency(formDiscountValue)} price deduction`}
              </span>
            </div>

            {/* Start & End Dates */}
            <div>
              <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                Expiry Date *
              </label>
              <input
                type="date"
                required
                value={formEndDate}
                onChange={(e) => setFormEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none"
              />
            </div>

            {/* Category & Status */}
            <div>
              <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                Offer Category *
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as OfferCategory)}
                className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none cursor-pointer"
              >
                <option value="festival">Diwali & Festive Celebration</option>
                <option value="limited_time">Limited-Time Deal</option>
                <option value="property_discount">Property Direct Discount</option>
                <option value="special_project">Special Project Launch</option>
                <option value="booking_benefit">Booking Benefit / Stamp Duty Waiver</option>
              </select>
            </div>

            <div>
              <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                Offer Status & Hot Deal
              </label>
              <div className="flex items-center gap-4 py-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formStatus === 'active'}
                    onChange={(e) => setFormStatus(e.target.checked ? 'active' : 'inactive')}
                    className="accent-black"
                  />
                  <span>Active & Visible to Public</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="accent-black"
                  />
                  <span>Mark as Featured Deal</span>
                </label>
              </div>
            </div>

            {/* Banner Image URL */}
            <div className="md:col-span-2">
              <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                Banner Image URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://..."
                value={formBannerImage}
                onChange={(e) => setFormBannerImage(e.target.value)}
                className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none"
              />
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-gray-500">Presets:</span>
                {[
                  { label: 'Luxury Penthouse', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
                  { label: 'Modern Villa', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' },
                  { label: 'Gated Plots', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80' },
                  { label: 'Commercial Office', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormBannerImage(preset.url)}
                    className="text-[10px] text-blue-700 hover:underline cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Min Booking & Usage Limits */}
            <div>
              <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                Minimum Booking Amount (₹)
              </label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 500000"
                value={formMinBooking}
                onChange={(e) => setFormMinBooking(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                Usage Quota / Allotment Limit
              </label>
              <input
                type="number"
                min={1}
                placeholder="e.g. 25 bookings max"
                value={formUsageLimit}
                onChange={(e) => setFormUsageLimit(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none"
              />
            </div>

            {/* Applicable Projects (Names) */}
            <div className="md:col-span-2">
              <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                Applicable Project Names (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Prestige Kingfisher Towers, DLF Magnolias, Sobha Lifestyle"
                value={formProjectNames}
                onChange={(e) => setFormProjectNames(e.target.value)}
                className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs outline-none"
              />
            </div>

            {/* Applicable Property Inventory Multi-Select */}
            <div className="md:col-span-2">
              <label className="block uppercase font-bold text-gray-700 mb-1 text-[11px]">
                Select Applicable Inventory Listings
              </label>
              <div className="p-3 border border-gray-300 max-h-48 overflow-y-auto space-y-2 bg-gray-50">
                <label className="flex items-center gap-2 p-1.5 bg-white border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formApplicableProps.includes('ALL')}
                    onChange={() => handleTogglePropSelection('ALL')}
                    className="accent-black"
                  />
                  <strong className="text-xs text-black">Apply to ALL Current & Future Properties</strong>
                </label>

                {properties.map((p) => {
                  const isChecked = formApplicableProps.includes(p.id) && !formApplicableProps.includes('ALL');
                  return (
                    <label key={p.id} className="flex items-center gap-2 p-1.5 bg-white border border-gray-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleTogglePropSelection(p.id)}
                        className="accent-black"
                      />
                      <span className="text-xs text-gray-800">
                        <strong>{p.title}</strong> — {p.priceDisplay} ({p.locality}, {p.city})
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Terms and Conditions Editor */}
            <div className="md:col-span-2 space-y-2">
              <label className="block uppercase font-bold text-gray-700 text-[11px]">
                Terms & Conditions (Bullet Points)
              </label>

              <div className="space-y-1.5">
                {formTerms.map((term, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200">
                    <span className="text-xs text-gray-800 font-sans">• {term}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTerm(idx)}
                      className="text-red-500 hover:text-red-700 font-bold p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add another offer term or condition..."
                  value={newTermInput}
                  onChange={(e) => setNewTermInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-gray-300 bg-white text-xs outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTerm();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTerm}
                  className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-black font-bold uppercase text-xs cursor-pointer"
                >
                  Add Term
                </button>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#1a1a1a]/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setSubTab('offers')}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold uppercase text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1a1a1a] hover:bg-black text-[#c4a47c] font-black uppercase text-xs cursor-pointer shadow-xs border border-black flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-[#c4a47c]" />
              <span>{editingOffer ? 'Save Offer Changes' : 'Publish Offer'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 3. SUBSCRIPTION PLANS (REQUIREMENT 3) */}
      {/* ========================================================================= */}
      {subTab === 'subscriptions' && (
        <div className="space-y-5">
          {/* 100% Free Site Visits Policy Banner */}
          <div className="p-4 bg-emerald-50 border-2 border-emerald-600/70 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif-luxury font-bold text-sm text-emerald-950 uppercase tracking-wide">
                  100% Free Site Visits Policy (Agent, Developer & Builder Guarantee)
                </h4>
                <span className="bg-emerald-700 text-white text-[9px] font-black px-1.5 py-0.2 uppercase">
                  ZERO VISIT CHARGES
                </span>
              </div>
              <p className="text-xs text-emerald-900 mt-1 font-sans leading-relaxed">
                By platform charter, property inspections and site visits are <strong>100% FREE</strong> for certified Agents, Project Developers, Builders, and Prospective Buyers. All tiers guarantee unlimited free site visit scheduling, on-site reception, and full access to builder festive offer deals and price concessions.
              </p>
            </div>
          </div>

          {/* Payment Gateway Status Banner */}
          <div className="p-4 bg-amber-50 border-2 border-amber-300 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif-luxury font-bold text-sm text-amber-950">
                  Payment Gateway Policy: Strict Merchant Protection Mode
                </h4>
                <span className="bg-amber-200 text-amber-900 text-[9px] font-black px-1.5 py-0.2 uppercase">
                  Zero Live Liability
                </span>
              </div>
              <p className="text-xs text-amber-900 mt-1 font-sans leading-relaxed">
                As per platform business policy, paid subscription plans (Silver, Gold, Premium) are locked in Sandbox mode until you connect verified Razorpay or Stripe Merchant API credentials. No unverified customer card charges will be initiated.
              </p>
            </div>
          </div>

          {/* Plans Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subscriptionPlans.map((plan) => {
              const isActive = plan.planStatus === 'active';
              return (
                <div key={plan.id} className="p-4 bg-white border-2 border-[#1a1a1a] flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-gray-500 uppercase font-bold">{plan.roleTarget} Tier</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 uppercase border ${
                        isActive ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-gray-100 text-gray-600 border-gray-300'
                      }`}>
                        {isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>

                    <h4 className="font-serif-luxury font-bold text-base text-[#1a1a1a]">
                      {plan.name}
                    </h4>

                    <div className="my-2 pt-2 border-t border-gray-100">
                      <span className="text-xl font-bold font-serif-luxury text-[#1a1a1a]">
                        {plan.price === 0 ? 'FREE' : formatIndianCurrency(plan.price)}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">/ {plan.billingPeriod || plan.billingCycle}</span>
                    </div>

                    <div className="space-y-1.5 py-2 border-t border-gray-100 text-xs">
                      <div className="flex justify-between text-gray-600">
                        <span>Listing Limit:</span>
                        <strong>{plan.propertyListingLimit || plan.listingLimit}</strong>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Lead Limit:</span>
                        <strong>{plan.leadAccessLimit || `${plan.leadsAccess} Leads`}</strong>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Featured:</span>
                        <strong>{plan.featuredLimit} Badges</strong>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Subscribers:</span>
                        <strong>{plan.activeSubscribers} Active</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleTogglePlanStatus(plan.id)}
                      className="px-2.5 py-1 text-[11px] font-bold uppercase border border-gray-300 hover:border-black cursor-pointer"
                    >
                      {isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <span className="text-[10px] text-gray-400">
                      {plan.renewalOption === 'auto_renewal' ? 'Auto Renew' : 'Manual'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CUSTOMER ENQUIRIES TRACKER */}
      {/* ========================================================================= */}
      {subTab === 'enquiries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <div>
              <h4 className="font-serif-luxury font-bold text-sm text-[#1a1a1a]">
                Customer Offer Enquiries & Concession Requests
              </h4>
              <p className="text-xs text-gray-500">
                Track customers who claimed specific deals and manage follow-ups.
              </p>
            </div>
            <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 font-bold uppercase border border-blue-200">
              {enquiries.length} Enquiries Registered
            </span>
          </div>

          <div className="bg-white border border-[#1a1a1a]/20 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1a1a1a] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Offer Title</th>
                  <th className="p-3">Property Requested</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <strong className="text-black block">{enq.customerName}</strong>
                      <span className="text-[10px] text-gray-400">{new Date(enq.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="p-3">
                      <span className="block text-black">{enq.customerPhone}</span>
                      <span className="text-[10px] text-gray-400">{enq.customerEmail || 'No email provided'}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-[#c4a47c] block">{enq.offerTitle}</span>
                      <span className="text-[10px] text-gray-500 italic">{enq.preferredTime}</span>
                    </td>
                    <td className="p-3 text-gray-700">
                      {enq.propertyTitle || 'General Concession'}
                    </td>
                    <td className="p-3">
                      <select
                        value={enq.status}
                        onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value as any)}
                        className="px-2 py-1 bg-white border border-gray-300 text-xs font-bold outline-none cursor-pointer"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Visit Scheduled">Visit Scheduled</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
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
                            const msg = `Hello ${enq.customerName}, following up regarding your enquiry on "${enq.offerTitle}" on NS Properties. Would you like to schedule a site visit?`;
                            openWhatsAppChat(enq.customerPhone, msg);
                          }}
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                          title="WhatsApp Lead"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. OFFER ANALYTICS & PERFORMANCE (REQUIREMENT 1) */}
      {/* ========================================================================= */}
      {subTab === 'analytics' && (
        <div className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-gray-200">
              <span className="text-[10px] text-gray-500 uppercase block font-bold">Active Campaigns</span>
              <strong className="text-2xl font-black text-black">
                {offers.filter(o => o.status === 'active').length}
              </strong>
            </div>

            <div className="p-4 bg-white border border-gray-200">
              <span className="text-[10px] text-gray-500 uppercase block font-bold">Total Offer Views</span>
              <strong className="text-2xl font-black text-[#005CA8]">
                {offers.reduce((acc, o) => acc + (o.viewsCount || 0), 0)}
              </strong>
            </div>

            <div className="p-4 bg-white border border-gray-200">
              <span className="text-[10px] text-gray-500 uppercase block font-bold">Enquiries Captured</span>
              <strong className="text-2xl font-black text-emerald-700">
                {offers.reduce((acc, o) => acc + (o.enquiriesCount || 0), 0)}
              </strong>
            </div>

            <div className="p-4 bg-white border border-gray-200">
              <span className="text-[10px] text-gray-500 uppercase block font-bold">Average Conversion Rate</span>
              <strong className="text-2xl font-black text-[#c4a47c]">
                {offers.length > 0
                  ? `${(
                      (offers.reduce((acc, o) => acc + (o.usageCount || 0), 0) /
                        Math.max(1, offers.reduce((acc, o) => acc + (o.enquiriesCount || 0), 0))) *
                      100
                    ).toFixed(1)}%`
                  : '0%'}
              </strong>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white border border-[#1a1a1a]/20 p-5 shadow-xs">
            <h4 className="font-serif-luxury font-bold text-base text-[#1a1a1a] mb-4">
              Top Performing Promotional Campaigns
            </h4>

            <div className="space-y-3 text-xs">
              {offers.map((offer) => {
                const convRate = offer.viewsCount > 0 
                  ? ((offer.enquiriesCount / offer.viewsCount) * 100).toFixed(1)
                  : '0';

                return (
                  <div key={offer.id} className="p-3 bg-gray-50 border border-gray-200 flex items-center justify-between gap-4">
                    <div>
                      <strong className="text-black font-serif-luxury block text-sm">{offer.title}</strong>
                      <span className="text-[10px] text-gray-500">
                        {offer.discountType === 'percentage' ? `${offer.discountValue}% Off` : `₹ ${(offer.discountValue / 100000).toFixed(0)} Lakhs`} • Valid till {offer.endDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-right font-mono-luxury">
                      <div>
                        <span className="text-gray-400 text-[10px] block">Views</span>
                        <strong className="text-black">{offer.viewsCount}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">Enquiries</span>
                        <strong className="text-blue-700">{offer.enquiriesCount}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">Redeemed</span>
                        <strong className="text-emerald-700">{offer.usageCount}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">Inquiry Rate</span>
                        <strong className="text-[#c4a47c]">{convRate}%</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
