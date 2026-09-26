import React, { useState } from 'react';
import {
  X,
  Tag,
  Percent,
  Calendar,
  Clock,
  ShieldCheck,
  Building,
  MapPin,
  CheckCircle2,
  Phone,
  MessageSquare,
  Share2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { Offer, Property, VisitorLead } from '../types';
import { calculateOfferPrice } from '../data/plansOffersData';
import { formatIndianCurrency } from '../utils/formatters';
import { DEFAULT_CONTACT_PHONE, openWhatsAppChat } from '../utils/whatsapp';

export interface OfferDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer | null;
  properties: Property[];
  onSelectProperty?: (property: Property) => void;
  onSubmitEnquiry: (lead: VisitorLead) => void;
}

export const OfferDetailModal: React.FC<OfferDetailModalProps> = ({
  isOpen,
  onClose,
  offer,
  properties,
  onSelectProperty,
  onSubmitEnquiry
}) => {
  if (!isOpen || !offer) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (10:00 AM - 1:00 PM)');
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    offer.applicablePropertyIds[0] || ''
  );
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Applicable properties list
  const applicableProperties = properties.filter((p) => {
    if (offer.applicablePropertyIds.includes('ALL')) return true;
    return offer.applicablePropertyIds.includes(p.id);
  });

  // Calculate days remaining
  const now = new Date();
  const endDate = new Date(offer.endDate);
  endDate.setHours(23, 59, 59, 999);
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone) return;

    const matchedProp = properties.find((p) => p.id === selectedPropertyId);

    const lead: VisitorLead = {
      id: `lead-off-${Date.now()}`,
      name: customerName || 'Interested Customer',
      phone: customerPhone,
      email: customerEmail || 'lead@nsproperties.in',
      purpose: 'Buy',
      preferredCity: matchedProp?.city || 'Bangalore',
      propertyTitle: matchedProp ? `${offer.title} - ${matchedProp.title}` : offer.title,
      propertyId: matchedProp?.id,
      timestamp: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      source: `Offer Enquiry: ${offer.title}`,
      status: 'New',
      notes: `Offer discount: ${offer.discountValue}${offer.discountType === 'percentage' ? '%' : ' INR'}. Preferred time: ${preferredTime}. Note: ${customerNotes}`
    };

    onSubmitEnquiry(lead);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 4000);
  };

  const handleShare = () => {
    const text = `Check out this exclusive property deal on NS Properties: "${offer.title}" - Save ${offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹ ${(offer.discountValue / 100000).toFixed(0)} Lakhs`}! Valid till ${offer.endDate}.`;
    if (navigator.share) {
      navigator.share({
        title: offer.title,
        text,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} \nLink: ${window.location.href}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    const matchedProp = properties.find((p) => p.id === selectedPropertyId);
    const msg = `Hello NS Properties, I am interested in the exclusive offer "${offer.title}" (${offer.discountType === 'percentage' ? `${offer.discountValue}% Concession` : `₹ ${(offer.discountValue / 100000).toFixed(0)} Lakhs Rebate`}) for ${matchedProp ? matchedProp.title : 'applicable luxury residences'}. Please share the concession price sheet & booking terms.`;
    openWhatsAppChat(DEFAULT_CONTACT_PHONE, msg);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#fdfcf9] border-2 border-[#1a1a1a] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col font-mono-luxury"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] px-6 py-4 flex items-center justify-between border-b-2 border-[#c4a47c]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#c4a47c] text-black font-black flex items-center justify-center text-xs">
              {offer.discountType === 'percentage' ? <Percent className="w-5 h-5 text-black" /> : <Tag className="w-5 h-5 text-black" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-lg sm:text-xl font-bold tracking-tight text-white line-clamp-1">
                  {offer.title}
                </h3>
                <span className="bg-[#c4a47c] text-black text-[9px] font-black px-2 py-0.5 uppercase tracking-wider shrink-0">
                  {offer.category.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-[#c4a47c] flex items-center gap-2 mt-0.5">
                <Clock className="w-3 h-3 text-[#c4a47c]" />
                <span>Valid till {offer.endDate}</span>
                <span>•</span>
                <span className="text-white/80">{diffDays > 0 ? `${diffDays} days remaining` : 'Expiring today'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 border border-white/20 hover:border-white text-white/80 hover:text-white transition-colors cursor-pointer relative"
              title="Share Offer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Offer Details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#fdfcf9] space-y-6">
          {/* Banner with Highlight Badge */}
          <div className="relative aspect-21/9 sm:aspect-16/6 overflow-hidden border-2 border-[#1a1a1a] shadow-md bg-slate-900">
            <img
              src={offer.bannerImage}
              alt={offer.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="bg-[#c4a47c] text-black text-[10px] font-black px-2.5 py-0.5 uppercase tracking-wider mb-2 inline-block">
                    {offer.discountType === 'percentage'
                      ? `FLAT ${offer.discountValue}% CONCESSION`
                      : `DIRECT ₹ ${(offer.discountValue / 100000).toFixed(0)} LAKHS SAVINGS`}
                  </span>
                  <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white leading-tight">
                    {offer.title}
                  </h2>
                  <p className="text-xs text-white/80 max-w-2xl mt-1 leading-relaxed hidden sm:block">
                    {offer.description}
                  </p>
                </div>

                {offer.minBookingAmount && (
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2.5 text-right shrink-0">
                    <span className="text-[10px] text-white/70 uppercase block">Min Booking Token</span>
                    <strong className="text-[#c4a47c] font-black text-sm">
                      {formatIndianCurrency(offer.minBookingAmount)}
                    </strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 100% Free Site Visit & Deal Inspection Guarantee */}
          <div className="bg-emerald-50 border-2 border-emerald-600/70 p-3.5 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <strong className="text-emerald-900 font-bold uppercase text-[11px] block">
                  100% Free Site Visit Included (₹0 Fee)
                </strong>
                <p className="text-[11px] text-emerald-800 font-sans mt-0.5">
                  Plan is <strong>100% FREE</strong> for site visits by Agents, Developers, Builders, and Buyers. Zero booking charges or platform fees to inspect this property and lock in this deal.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-white border border-emerald-600 text-emerald-800 text-[10px] font-bold uppercase tracking-wider shrink-0">
              Free Deal & Visit Pass
            </span>
          </div>

          {/* Grid Layout: Terms & Applicable Inventory + Lead Form */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left 7 Columns: Terms & Applicable Inventory */}
            <div className="md:col-span-7 space-y-5">
              
              {/* Offer Terms & Conditions */}
              <div className="bg-white border border-[#1a1a1a]/20 p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1a1a1a]/15">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-serif-luxury font-bold text-sm uppercase tracking-wider text-[#1a1a1a]">
                      Offer Terms & Conditions
                    </h4>
                  </div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold">
                    Official Guarantee
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-gray-700 font-sans">
                  {offer.termsAndConditions.map((term, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#c4a47c] font-bold shrink-0 mt-0.5 font-mono-luxury">✦</span>
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>

                {/* Usage limit bar */}
                {offer.usageLimit && (
                  <div className="mt-4 pt-3 border-t border-gray-100 font-mono-luxury">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-gray-500">Allotment Redemption Progress:</span>
                      <strong className="text-black">
                        {offer.usageCount} of {offer.usageLimit} Claimed ({Math.max(0, offer.usageLimit - offer.usageCount)} left)
                      </strong>
                    </div>
                    <div className="w-full bg-gray-200 h-2 overflow-hidden">
                      <div
                        className="bg-[#c4a47c] h-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (offer.usageCount / offer.usageLimit) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Applicable Properties & Projects */}
              <div className="bg-white border border-[#1a1a1a]/20 p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1a1a1a]/15">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#005CA8]" />
                    <h4 className="font-serif-luxury font-bold text-sm uppercase tracking-wider text-[#1a1a1a]">
                      Applicable Properties & Projects
                    </h4>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 font-bold uppercase border border-emerald-200">
                    {applicableProperties.length} Properties Eligible
                  </span>
                </div>

                <div className="space-y-3">
                  {applicableProperties.map((prop) => {
                    const priceCalc = calculateOfferPrice(prop.price, offer);
                    const isSelected = selectedPropertyId === prop.id;

                    return (
                      <div
                        key={prop.id}
                        onClick={() => setSelectedPropertyId(prop.id)}
                        className={`p-3 border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-[#1a1a1a] bg-[#f4f1ea] shadow-xs'
                            : 'border-gray-200 bg-[#fdfcf9] hover:border-black'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.images[0]}
                            alt={prop.title}
                            className="w-16 h-12 object-cover border border-[#1a1a1a]/20 shrink-0"
                          />
                          <div>
                            <h5 className="font-serif-luxury font-bold text-xs sm:text-sm text-black line-clamp-1">
                              {prop.title}
                            </h5>
                            <p className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                              <MapPin className="w-3 h-3 text-[#c4a47c]" />
                              <span>{prop.locality}, {prop.city}</span>
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 pt-2 sm:pt-0">
                          <div>
                            <span className="text-[10px] text-gray-400 line-through mr-1.5">
                              {prop.priceDisplay}
                            </span>
                            <span className="font-bold text-xs sm:text-sm text-emerald-800">
                              {formatIndianCurrency(priceCalc.discountedPrice)}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-[#c4a47c] bg-[#1a1a1a] px-1.5 py-0.5 mt-0.5">
                            Save {priceCalc.savingsDisplay}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Claim Offer & Direct Lead Submission */}
            <div className="md:col-span-5 space-y-4">
              
              {/* Form Card */}
              <div className="bg-white border-2 border-[#1a1a1a] p-4 sm:p-5 shadow-md">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#1a1a1a]/15">
                  <Sparkles className="w-4 h-4 text-[#c4a47c]" />
                  <h4 className="font-serif-luxury font-bold text-sm uppercase tracking-wider text-[#1a1a1a]">
                    Claim Offer & Lock Concession
                  </h4>
                </div>

                <p className="text-[11px] text-gray-600 mb-4 leading-relaxed font-sans">
                  Register your interest to lock in the special promotional discount before the allocation quota or validity date ends.
                </p>

                {isSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-300 p-4 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h5 className="font-serif-luxury font-bold text-sm text-emerald-900">
                      Offer Request Registered!
                    </h5>
                    <p className="text-xs text-emerald-700 font-sans">
                      Your concession token has been locked. A dedicated Relationship Manager will contact you with the discounted payment schedule.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block uppercase font-bold text-gray-700 mb-1 text-[10px]">
                        Select Applicable Property
                      </label>
                      <select
                        value={selectedPropertyId}
                        onChange={(e) => setSelectedPropertyId(e.target.value)}
                        className="w-full px-2.5 py-2 border border-[#1a1a1a] bg-[#fdfcf9] text-xs outline-none cursor-pointer"
                      >
                        {applicableProperties.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title} ({p.priceDisplay})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block uppercase font-bold text-gray-700 mb-1 text-[10px]">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikram Singhania"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-2.5 py-2 border border-gray-300 bg-white text-xs outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block uppercase font-bold text-gray-700 mb-1 text-[10px]">
                        Mobile Number * (for WhatsApp confirmation)
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98450 00000"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-2.5 py-2 border border-gray-300 bg-white text-xs outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block uppercase font-bold text-gray-700 mb-1 text-[10px]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-2.5 py-2 border border-gray-300 bg-white text-xs outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block uppercase font-bold text-gray-700 mb-1 text-[10px]">
                        Preferred Call Back Time
                      </label>
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full px-2.5 py-2 border border-gray-300 bg-white text-xs outline-none cursor-pointer"
                      >
                        <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                        <option value="Afternoon (1:00 PM - 5:00 PM)">Afternoon (1:00 PM - 5:00 PM)</option>
                        <option value="Evening (5:00 PM - 8:00 PM)">Evening (5:00 PM - 8:00 PM)</option>
                        <option value="Weekend Anytime">Weekend Anytime</option>
                      </select>
                    </div>

                    <div>
                      <label className="block uppercase font-bold text-gray-700 mb-1 text-[10px]">
                        Specific Questions or Requests
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Can you arrange a site visit this Saturday?"
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs outline-none focus:border-black resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#1a1a1a] hover:bg-black text-[#c4a47c] font-black uppercase text-xs transition-colors cursor-pointer border border-black shadow-xs flex items-center justify-center gap-2"
                    >
                      <span>Lock Concession & Enquire Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}

                {/* Direct Concierge Call & WhatsApp Buttons */}
                <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-2 gap-2">
                  <a
                    href="tel:18002083344"
                    className="py-2 px-3 border border-[#1a1a1a] hover:bg-black hover:text-white text-black font-bold uppercase text-[10px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                  >
                    <Phone className="w-3 h-3 text-[#c4a47c]" />
                    <span>Call Concierge</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-[10px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="bg-[#f4f1ea] px-6 py-2.5 border-t border-[#1a1a1a]/20 flex items-center justify-between text-xs text-gray-600">
          <span>NS Properties Verified Exclusive Promotional Offer</span>
          <span className="text-[#1a1a1a] font-bold">Toll Free: 1800-208-3344</span>
        </div>
      </div>
    </div>
  );
};
