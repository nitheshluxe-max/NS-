import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Scale, 
  Share2, 
  Calendar, 
  Phone, 
  Mail, 
  Calculator, 
  Building, 
  Compass, 
  Check, 
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Camera,
  Image as ImageIcon,
  Lock,
  Layers,
  Unlock,
  Download,
  FileText
} from 'lucide-react';
import { Property } from '../types';
import { calculateEMI, formatIndianCurrency } from '../utils/formatters';
import { getWhatsAppUrl, openWhatsAppChat } from '../utils/whatsapp';
import { getPublicShareUrl } from '../utils/shareUrl';
import { UnlockOwnerModal } from './UnlockOwnerModal';
import { PropertyFloorPlanView } from './PropertyFloorPlanView';
import { generateProjectBrochurePdf } from '../utils/brochurePdfGenerator';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  isSaved: boolean;
  isCompared: boolean;
  onToggleSave: (property: Property) => void;
  onToggleCompare: (property: Property) => void;
  onScheduleVisit: (property: Property) => void;
  onCaptureLead?: (lead: { name: string; phone: string; email: string; propertyTitle: string; propertyId: string; purpose: 'Buy' | 'Rent'; source?: any }) => void;
  dailyViewsUsed?: number;
  dailyLimit?: number;
  onRecordOwnerContactView?: (propertyId: string, client: { name: string; phone: string; email: string }) => boolean;
  isOwnerUnlocked?: boolean;
  onOpenBrochure?: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onScheduleVisit,
  onCaptureLead,
  dailyViewsUsed = 0,
  dailyLimit = 10,
  onRecordOwnerContactView,
  isOwnerUnlocked = false,
  onOpenBrochure
}) => {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [isFullscreenGalleryOpen, setIsFullscreenGalleryOpen] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [localUnlocked, setLocalUnlocked] = useState(isOwnerUnlocked);
  const [mediaViewMode, setMediaViewMode] = useState<'photos' | 'plans'>('photos');
  const [activePlanType, setActivePlanType] = useState<'floorplan' | 'masterplan'>('floorplan');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState(`Hi, I am interested in ${property.title}. Please provide more details.`);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // EMI quick calculator state
  const loanPercentage = 80;
  const initialLoanAmount = Math.round((property.price * loanPercentage) / 100);
  const [loanAmount, setLoanAmount] = useState(initialLoanAmount);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  const emiData = calculateEMI(loanAmount, interestRate, tenureYears);

  // Stamp duty calculation estimate
  const stampDutyEstimate = Math.round(property.price * 0.05); // ~5% in India
  const registrationEstimate = Math.round(property.price * 0.01); // ~1%
  const totalAllInclusive = property.price + stampDutyEstimate + registrationEstimate;

  const handleFloorPlanUnlock = (customerData: { name: string; phone: string; email: string }) => {
    setLocalUnlocked(true);
    setContactName(customerData.name);
    setContactPhone(customerData.phone);
    if (customerData.email && !customerData.email.includes('@lead.nsproperties.in')) {
      setContactEmail(customerData.email);
    }

    if (onRecordOwnerContactView) {
      onRecordOwnerContactView(property.id, customerData);
    }

    if (onCaptureLead) {
      onCaptureLead({
        name: customerData.name,
        phone: customerData.phone,
        email: customerData.email,
        propertyTitle: property.title,
        propertyId: property.id,
        purpose: property.purpose === 'buy' ? 'Buy' : 'Rent',
        source: 'Floor Plan Phone Unlock'
      });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) return;

    if (onCaptureLead) {
      onCaptureLead({
        name: contactName.trim(),
        phone: contactPhone.trim(),
        email: contactEmail.trim() || `${contactPhone.replace(/\D/g, '')}@lead.nsproperties.in`,
        propertyTitle: property.title,
        propertyId: property.id,
        purpose: property.purpose === 'buy' ? 'Buy' : 'Rent'
      });
    }

    setIsSubmitted(true);
  };

  const handleShare = () => {
    const publicUrl = getPublicShareUrl();
    if (navigator.share) {
      navigator.share({
        title: `${property.title} | NS Properties`,
        text: `Check out ${property.title} in ${property.city} (${formatIndianCurrency(property.price)}):`,
        url: publicUrl,
      }).catch(() => {
        navigator.clipboard.writeText(publicUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    } else {
      navigator.clipboard.writeText(publicUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-[#fdfcf9] border-[1.5px] border-[#1a1a1a] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 bg-[#fdfcf9] border-b-[1.5px] border-[#1a1a1a] px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="editorial-badge bg-[#1a1a1a] text-[#fdfcf9] border-[#1a1a1a] text-[10px] sm:text-xs">
              {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
            </span>
            <span className="editorial-label text-[#1a1a1a]/60 text-[9px] sm:text-[10px] truncate">
              ID: {property.id}
            </span>
            {property.isVerified && (
              <span className="hidden sm:inline-flex editorial-badge bg-[#e2f4ea] text-[#1e4620] border-0 text-[10px]">
                Verified Listing
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Shortlist button */}
            <button
              onClick={() => onToggleSave(property)}
              className={`p-1.5 sm:p-2 border border-[#1a1a1a] transition-colors cursor-pointer ${
                isSaved ? 'bg-red-50 text-red-600' : 'bg-[#fdfcf9] hover:bg-[#1a1a1a]/5 text-[#1a1a1a]'
              }`}
              title={isSaved ? 'Shortlisted' : 'Shortlist'}
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSaved ? 'fill-red-600 text-red-600' : ''}`} />
            </button>

            {/* Compare */}
            <button
              onClick={() => onToggleCompare(property)}
              className={`p-1.5 sm:p-2 border border-[#1a1a1a] transition-colors cursor-pointer ${
                isCompared ? 'bg-[#1a1a1a] text-[#fdfcf9]' : 'bg-[#fdfcf9] hover:bg-[#1a1a1a]/5 text-[#1a1a1a]'
              }`}
              title="Compare"
            >
              <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Download Official Project Brochure */}
            <button
              onClick={() => onOpenBrochure ? onOpenBrochure(property) : generateProjectBrochurePdf(property)}
              className="px-2 sm:px-3 py-1.5 bg-[#c4a47c] hover:bg-[#b09066] text-black font-mono-luxury font-bold text-[10px] sm:text-xs uppercase flex items-center gap-1 sm:gap-1.5 cursor-pointer border border-black shadow-xs"
              title="Download Official Project Brochure (PDF)"
            >
              <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black" />
              <span className="hidden xs:inline">Brochure</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-1.5 sm:p-2 border border-[#1a1a1a] bg-[#fdfcf9] hover:bg-[#1a1a1a]/5 text-[#1a1a1a] transition-colors cursor-pointer relative"
              title="Copy Link"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {copiedLink && (
                <span className="absolute -bottom-7 right-0 font-mono-luxury text-[10px] bg-[#1a1a1a] text-[#fdfcf9] px-2 py-0.5 whitespace-nowrap">
                  Link Copied!
                </span>
              )}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 border border-[#1a1a1a] hover:bg-[#1a1a1a] text-[#1a1a1a] hover:text-[#fdfcf9] transition-colors cursor-pointer ml-0.5 sm:ml-1"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Media Header: Distinct Tabs for Photos vs Floor Plan vs Master Plan */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1a1a1a]/20 pb-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMediaViewMode('photos')}
                  className={`px-3 py-2 text-xs font-mono-luxury uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
                    mediaViewMode === 'photos'
                      ? 'bg-[#1a1a1a] text-[#fdfcf9] border-[#1a1a1a] font-bold shadow-xs'
                      : 'bg-[#fdfcf9] hover:bg-[#1a1a1a]/5 text-[#1a1a1a] border-[#1a1a1a]/30'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-[#c4a47c]" />
                  <span>Property Photos ({property.images.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMediaViewMode('plans');
                    setActivePlanType('floorplan');
                  }}
                  className={`px-3 py-2 text-xs font-mono-luxury uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
                    mediaViewMode === 'plans' && activePlanType === 'floorplan'
                      ? 'bg-[#1a1a1a] text-[#fdfcf9] border-[#1a1a1a] font-bold shadow-xs'
                      : 'bg-[#fdfcf9] hover:bg-[#1a1a1a]/5 text-[#1a1a1a] border-[#1a1a1a]/30'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-[#c4a47c]" />
                  <span>Floor Plan & Layout</span>
                  {localUnlocked ? (
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9px] px-1 py-0.2 font-bold uppercase">
                      Unlocked
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] px-1 py-0.2 font-bold uppercase flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5 text-amber-700" /> Locked
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMediaViewMode('plans');
                    setActivePlanType('masterplan');
                  }}
                  className={`px-3 py-2 text-xs font-mono-luxury uppercase tracking-wider hidden sm:flex items-center gap-1.5 transition-all cursor-pointer border ${
                    mediaViewMode === 'plans' && activePlanType === 'masterplan'
                      ? 'bg-[#1a1a1a] text-[#fdfcf9] border-[#1a1a1a] font-bold shadow-xs'
                      : 'bg-[#fdfcf9] hover:bg-[#1a1a1a]/5 text-[#1a1a1a] border-[#1a1a1a]/30'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-[#c4a47c]" />
                  <span>Master Site Plan</span>
                  {localUnlocked ? (
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9px] px-1 py-0.2 font-bold uppercase">
                      Unlocked
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] px-1 py-0.2 font-bold uppercase flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5 text-amber-700" /> Locked
                    </span>
                  )}
                </button>
              </div>

              {mediaViewMode === 'photos' && !localUnlocked && (
                <button
                  type="button"
                  onClick={() => {
                    setMediaViewMode('plans');
                    setActivePlanType('floorplan');
                  }}
                  className="text-xs font-mono-luxury text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer bg-amber-50 border border-amber-200 px-2.5 py-1"
                >
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span>Unlock Architectural Floor Plan & Phone</span>
                </button>
              )}
            </div>

            {/* Media Body: Either Photos or Floor Plan */}
            {mediaViewMode === 'photos' ? (
              <div className="space-y-2">
                <div className="relative h-72 sm:h-96 w-full border border-[#1a1a1a] overflow-hidden bg-[#1a1a1a] group">
                  <img
                    src={property.images[selectedPhotoIdx]}
                    alt={property.title}
                    className="w-full h-full object-cover cursor-pointer group-hover:scale-101 transition-transform duration-300"
                    onClick={() => setIsFullscreenGalleryOpen(true)}
                  />

                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPhotoIdx(
                            (prev) => (prev - 1 + property.images.length) % property.images.length
                          );
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#1a1a1a]/70 hover:bg-[#1a1a1a] text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPhotoIdx((prev) => (prev + 1) % property.images.length);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#1a1a1a]/70 hover:bg-[#1a1a1a] text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Fullscreen Photo Button */}
                  <button
                    onClick={() => setIsFullscreenGalleryOpen(true)}
                    className="absolute top-3 right-3 bg-[#1a1a1a]/85 text-[#fdfcf9] font-mono-luxury text-xs px-3 py-1.5 flex items-center gap-1.5 transition-all cursor-pointer border border-[#1a1a1a]"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#c4a47c]" />
                    <span>Fullscreen ({property.images.length} Photos)</span>
                  </button>

                  <div className="absolute bottom-3 right-3 bg-[#1a1a1a]/85 text-[#fdfcf9] font-mono-luxury text-xs px-3 py-1">
                    Photo {selectedPhotoIdx + 1} of {property.images.length}
                  </div>
                </div>

                {/* Thumbnail Strip */}
                {property.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 items-center">
                    {property.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPhotoIdx(idx)}
                        className={`relative w-20 h-14 overflow-hidden shrink-0 border transition-all cursor-pointer ${
                          selectedPhotoIdx === idx ? 'border-2 border-[#1a1a1a]' : 'border-[#1a1a1a]/30 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <PropertyFloorPlanView
                property={property}
                isUnlocked={localUnlocked}
                onUnlockSuccess={handleFloorPlanUnlock}
                activePlanType={activePlanType}
                onChangePlanType={(type) => setActivePlanType(type)}
              />
            )}
          </div>

          {/* Title & Price Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1a1a1a] pb-5">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono-luxury text-3xl font-bold text-[#1a1a1a]">
                  {property.priceDisplay}
                </span>
                {property.pricePerSqFt > 0 && (
                  <span className="editorial-label text-[#1a1a1a]/60">
                    @ ₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft
                  </span>
                )}
              </div>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1a1a1a] mt-1">
                {property.title}
              </h1>
              <p className="editorial-label text-[#1a1a1a]/70 flex items-center gap-1.5 mt-1 normal-case text-xs">
                <MapPin className="w-4 h-4 text-[#c4a47c] shrink-0" />
                <span>{property.address}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMediaViewMode('plans');
                  setActivePlanType('floorplan');
                }}
                className="px-3.5 py-2.5 bg-white hover:bg-slate-100 text-[#1a1a1a] font-mono-luxury uppercase text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-[#1a1a1a]"
              >
                <Layers className="w-4 h-4 text-[#c4a47c]" />
                <span>{localUnlocked ? 'View Floor Plan' : 'Unlock Floor Plan'}</span>
                {!localUnlocked && <Lock className="w-3 h-3 text-amber-600" />}
              </button>

              <button
                onClick={() => onScheduleVisit(property)}
                className="px-4 py-2.5 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-mono-luxury uppercase text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer border border-[#1a1a1a]"
              >
                <Calendar className="w-4 h-4 text-[#c4a47c]" />
                Schedule Site Visit
              </button>
            </div>
          </div>

          {/* Two-Column Grid: Left specs & details, Right Contact & EMI */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Key Highlights Grid */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Property Highlights & Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Configuration</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {property.bhk > 0 ? `${property.bhk} BHK` : property.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Super Built-up Area</span>
                    <span className="font-bold text-slate-800 text-sm">{property.areaSqFt} sq.ft</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Carpet Area</span>
                    <span className="font-bold text-slate-800 text-sm">{property.carpetAreaSqFt} sq.ft</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Bathrooms</span>
                    <span className="font-bold text-slate-800 text-sm">{property.bathrooms} Baths</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Facing Direction</span>
                    <span className="font-bold text-slate-800 text-sm">{property.facing || 'East'}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Possession Status</span>
                    <span className="font-bold text-slate-800 text-sm truncate block">{property.possession}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Floor Number</span>
                    <span className="font-bold text-slate-800 text-sm">{property.floor || 'Middle Floor'}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Furnishing</span>
                    <span className="font-bold text-slate-800 text-sm">{property.furnishing}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Property Age</span>
                    <span className="font-bold text-slate-800 text-sm">{property.ageOfProperty || 'New Construction'}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">About the Property</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3">Amenities & Facilities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {property.amenities.map((amenity, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RERA Details */}
              {property.reraId && (
                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-3">
                  <div className="p-2 bg-[#005CA8] text-white rounded-lg">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">RERA Registered Project</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      RERA Registration No: <span className="font-mono font-bold text-[#005CA8]">{property.reraId}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      This property is verified against State Real Estate Regulatory Authority records.
                    </p>
                  </div>
                </div>
              )}

              {/* Locality & Landmarks */}
              {property.landmarks && property.landmarks.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Nearby Landmarks & Connectivity</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {property.landmarks.map((lm, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                        <span className="font-medium text-slate-800">{lm.name}</span>
                        <span className="bg-blue-100 text-[#005CA8] px-2 py-0.5 rounded font-bold">
                          {lm.distance}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* In-Page Interactive EMI Calculator */}
              {property.purpose === 'buy' && (
                <div className="bg-slate-900 text-white rounded-xl p-5 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-amber-400" />
                      <h3 className="text-sm font-bold tracking-tight">Interactive EMI Calculator</h3>
                    </div>
                    <span className="text-xs bg-slate-800 text-amber-300 font-bold px-2 py-0.5 rounded">
                      80% Loan Assumed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Loan Amount</span>
                        <span className="font-bold text-white">{formatIndianCurrency(loanAmount)}</span>
                      </div>
                      <input
                        type="range"
                        min={1000000}
                        max={property.price}
                        step={100000}
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full accent-[#005CA8]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Interest Rate</span>
                        <span className="font-bold text-white">{interestRate}%</span>
                      </div>
                      <input
                        type="range"
                        min={6.5}
                        max={14.0}
                        step={0.1}
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full accent-[#005CA8]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Tenure (Years)</span>
                        <span className="font-bold text-white">{tenureYears} Years</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={30}
                        step={1}
                        value={tenureYears}
                        onChange={(e) => setTenureYears(Number(e.target.value))}
                        className="w-full accent-[#005CA8]"
                      />
                    </div>
                  </div>

                  {/* Calculated Box */}
                  <div className="bg-slate-800/80 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Monthly Loan EMI</span>
                      <span className="text-xl font-black text-amber-400">
                        {formatIndianCurrency(emiData.monthlyEMI)} / mo
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Total Interest Payable</span>
                      <span className="font-bold text-slate-200">
                        {formatIndianCurrency(emiData.totalInterest)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Total Repayment</span>
                      <span className="font-bold text-slate-200">
                        {formatIndianCurrency(emiData.totalPayment)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Seller Profile & Direct Lead Form */}
            <div className="lg:col-span-4 space-y-4">
              {/* Official Project Brochure Card */}
              <div className="bg-[#1a1a1a] text-[#fdfcf9] border-2 border-[#c4a47c] p-4 shadow-md font-mono-luxury">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#c4a47c]" />
                    <h4 className="font-serif-luxury font-bold text-xs uppercase tracking-wider text-white">
                      Official Project Brochure
                    </h4>
                  </div>
                  <span className="bg-[#c4a47c] text-black text-[9px] font-black px-1.5 py-0.2 uppercase">
                    PDF DOSSIER
                  </span>
                </div>
                <p className="text-[11px] text-white/70 mb-3 leading-relaxed">
                  Download complete architectural blueprints, RERA certification, floor plan dimensions, and payment schedules.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenBrochure ? onOpenBrochure(property) : generateProjectBrochurePdf(property)}
                  className="w-full py-2.5 bg-[#c4a47c] hover:bg-[#b09066] text-black font-black uppercase text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4 text-black" />
                  <span>Download Project Brochure (PDF)</span>
                </button>
              </div>

              {/* Seller Profile Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-[#005CA8] text-white flex items-center justify-center font-bold text-lg">
                    {property.seller.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{property.seller.name}</h4>
                    <span className="text-xs text-slate-500 block">
                      {property.seller.company || property.postedBy}
                    </span>
                    <span className="inline-block text-[10px] text-emerald-700 bg-emerald-50 font-bold px-1.5 py-0.2 rounded mt-0.5">
                      Response: {property.seller.responseTime || 'Immediate'}
                    </span>
                  </div>
                </div>

                {/* Direct Phone / Contact info with 10/day Limit Protection */}
                <div className="mt-3 space-y-2">
                  {localUnlocked ? (
                    <div className="space-y-1.5">
                      <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl">
                        <div className="flex items-center justify-between text-[11px] text-emerald-800 font-bold mb-1">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Direct Owner Contact (Unlocked)
                          </span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            {dailyViewsUsed}/{dailyLimit} today
                          </span>
                        </div>
                        <a
                          href={`tel:${property.seller.phone}`}
                          className="w-full py-2 bg-white hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Phone className="w-4 h-4" />
                          <span>{property.seller.phone}</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsUnlockModalOpen(true)}
                      className="w-full py-2.5 bg-gradient-to-r from-[#005CA8] to-[#004780] hover:from-[#004780] hover:to-[#003B73] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-300" />
                      <span>View Owner Number ({Math.max(0, dailyLimit - dailyViewsUsed)} Left Today)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (!localUnlocked) {
                        setIsUnlockModalOpen(true);
                      } else {
                        const msg = `Hello ${property.seller.name}, I found your property listing "${property.title}" (${property.priceDisplay}, ${property.locality}, ${property.city} - ID: ${property.id}) on NS Properties. I am interested to discuss directly.`;
                        openWhatsAppChat(property.seller.phone, msg);
                      }
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-100" />
                    <span>{localUnlocked ? 'Chat on WhatsApp' : 'Unlock WhatsApp with Owner'}</span>
                  </button>
                </div>
              </div>

              {/* Send Quick Enquiry Form */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Send Enquiry to Seller
                </h4>

                {isSubmitted ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                    <Check className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                    <h5 className="text-xs font-bold text-emerald-800">Enquiry Sent Successfully!</h5>
                    <p className="text-[11px] text-emerald-700 mt-1">
                      The seller has been notified via SMS & Email. They will contact you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-2.5">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Your Full Name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-3 py-2 bg-white text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#005CA8]"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit Mobile Number"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-white text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#005CA8]"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email Address (Optional)"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#005CA8]"
                      />
                    </div>
                    <div>
                      <textarea
                        rows={2}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="w-full px-3 py-2 bg-white text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#005CA8]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#005CA8] hover:bg-[#004780] text-white font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      Send Direct Enquiry
                    </button>
                    <p className="text-[10px] text-slate-400 text-center">
                      By submitting you agree to receive seller updates via call/SMS
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {isFullscreenGalleryOpen && (
        <div 
          className="fixed inset-0 z-60 bg-black/95 flex flex-col justify-between p-4 backdrop-blur-md"
          onClick={() => setIsFullscreenGalleryOpen(false)}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-sm sm:text-base text-white truncate max-w-md">
                {property.title}
              </span>
              <span className="text-xs bg-white/20 text-white px-2.5 py-1 rounded-full font-semibold">
                Photo {selectedPhotoIdx + 1} of {property.images.length}
              </span>
            </div>
            <button
              onClick={() => setIsFullscreenGalleryOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close Fullscreen"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Fullscreen Image with Nav */}
          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6" onClick={(e) => e.stopPropagation()}>
            <img
              src={property.images[selectedPhotoIdx]}
              alt={`Full view ${selectedPhotoIdx + 1}`}
              className="max-h-[76vh] max-w-full object-contain rounded-lg shadow-2xl transition-all select-none"
            />

            {property.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedPhotoIdx(
                      (prev) => (prev - 1 + property.images.length) % property.images.length
                    )
                  }
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20 shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    setSelectedPhotoIdx((prev) => (prev + 1) % property.images.length)
                  }
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20 shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="flex gap-2 overflow-x-auto justify-center py-2 z-10" onClick={(e) => e.stopPropagation()}>
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPhotoIdx(idx)}
                className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  selectedPhotoIdx === idx ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Unlock Owner Modal */}
      <UnlockOwnerModal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        property={property}
        dailyViewsUsed={dailyViewsUsed}
        dailyLimit={dailyLimit}
        onSuccessUnlock={(clientInfo) => {
          setLocalUnlocked(true);
          setContactName(clientInfo.name);
          setContactPhone(clientInfo.phone);
          if (clientInfo.email && !clientInfo.email.includes('@lead.nsproperties.in')) {
            setContactEmail(clientInfo.email);
          }
          setIsUnlockModalOpen(false);

          // Record lead in admin database
          if (onCaptureLead) {
            onCaptureLead({
              name: clientInfo.name,
              phone: clientInfo.phone,
              email: clientInfo.email,
              propertyTitle: property.title,
              propertyId: property.id,
              purpose: property.purpose === 'buy' ? 'Buy' : 'Rent',
              source: 'Owner Contact Unlock'
            });
          }

          if (onRecordOwnerContactView) {
            onRecordOwnerContactView(property.id, clientInfo);
          }
        }}
      />
    </div>
  );
};
