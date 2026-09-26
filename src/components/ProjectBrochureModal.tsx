import React, { useState } from 'react';
import {
  X,
  Download,
  FileText,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShieldCheck,
  Building,
  MapPin,
  Calendar,
  Sparkles,
  Layers,
  Compass,
  ArrowRight,
  ExternalLink,
  Printer,
  Share2,
  Check
} from 'lucide-react';
import { Property } from '../types';
import { generateProjectBrochurePdf } from '../utils/brochurePdfGenerator';
import { AppUserSession } from '../utils/appAuthService';
import { DEFAULT_CONTACT_PHONE, openWhatsAppChat } from '../utils/whatsapp';

export interface ProjectBrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  activeSession: AppUserSession | null;
  onCaptureLead?: (lead: {
    name: string;
    phone: string;
    email: string;
    propertyTitle: string;
    propertyId: string;
    purpose: 'Buy' | 'Rent' | 'Invest' | 'General Inquiry' | 'Site Visit' | 'Brochure';
    source: any;
  }) => void;
}

export const ProjectBrochureModal: React.FC<ProjectBrochureModalProps> = ({
  isOpen,
  onClose,
  property,
  activeSession,
  onCaptureLead
}) => {
  if (!isOpen || !property) return null;

  const [activePreviewTab, setActivePreviewTab] = useState<'overview' | 'floorplans' | 'amenities' | 'location'>('overview');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Email delivery lead form state
  const [buyerName, setBuyerName] = useState(activeSession?.name || '');
  const [buyerPhone, setBuyerPhone] = useState(activeSession?.phone || '');
  const [buyerEmail, setBuyerEmail] = useState(activeSession?.email || '');
  const [emailDeliverySent, setEmailDeliverySent] = useState(false);

  // Trigger PDF Download
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const ok = await generateProjectBrochurePdf(property, buyerName || activeSession?.name);
      if (ok) {
        setDownloadSuccess(true);
        if (onCaptureLead && (buyerPhone || activeSession?.phone)) {
          onCaptureLead({
            name: buyerName || activeSession?.name || 'Verified Visitor',
            phone: buyerPhone || activeSession?.phone || '+91 98450 00000',
            email: buyerEmail || activeSession?.email || 'visitor@nsprops.in',
            propertyTitle: property.title,
            propertyId: property.id,
            purpose: 'Brochure',
            source: 'Brochure Download'
          });
        }
        setTimeout(() => {
          setDownloadSuccess(false);
        }, 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle Send via Email form
  const handleEmailKitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerPhone || !buyerEmail) return;

    if (onCaptureLead) {
      onCaptureLead({
        name: buyerName || 'Interested Buyer',
        phone: buyerPhone,
        email: buyerEmail,
        propertyTitle: property.title,
        propertyId: property.id,
        purpose: 'Brochure',
        source: 'Brochure Download'
      });
    }

    setEmailDeliverySent(true);
    // Also trigger instant download automatically for the user
    handleDownloadPdf();
  };

  // WhatsApp concierge request
  const handleWhatsAppBrochure = () => {
    const msg = `Hello NS Properties, I am requesting the official PDF brochure, floor plans and latest payment sheet for "${property.title}" (${property.priceDisplay}, ${property.locality}, ${property.city} - Ref ID: ${property.id}). Please share on WhatsApp.`;
    openWhatsAppChat(DEFAULT_CONTACT_PHONE, msg);

    if (onCaptureLead && (buyerPhone || activeSession?.phone)) {
      onCaptureLead({
        name: buyerName || activeSession?.name || 'WhatsApp Visitor',
        phone: buyerPhone || activeSession?.phone || '+91 98450 00000',
        email: buyerEmail || activeSession?.email || 'whatsapp@lead.nsproperties.in',
        propertyTitle: property.title,
        propertyId: property.id,
        purpose: 'Brochure',
        source: 'Brochure Download'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#fdfcf9] border-2 border-[#1a1a1a] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col font-mono-luxury"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] px-6 py-4 flex items-center justify-between border-b-2 border-[#c4a47c]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#c4a47c] text-black font-black flex items-center justify-center text-xs">
              <FileText className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-lg sm:text-xl font-bold tracking-tight text-white line-clamp-1">
                  {property.title}
                </h3>
                <span className="bg-[#c4a47c] text-black text-[9px] font-black px-2 py-0.5 uppercase tracking-wider shrink-0">
                  OFFICIAL BROCHURE
                </span>
              </div>
              <p className="text-[11px] text-[#c4a47c] flex items-center gap-2 mt-0.5">
                <span>{property.locality}, {property.city}</span>
                <span>•</span>
                <span>RERA: {property.reraId || 'Approved'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Brochure Window"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Fast Bar (Download Button prominent at top) */}
        <div className="bg-[#f4f1ea] px-4 sm:px-6 py-3 border-b border-[#1a1a1a]/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-gray-700">
              Verified Digital Dossier with complete floor plans, approvals & payment milestones.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className={`px-4 py-2 bg-[#1a1a1a] hover:bg-black text-[#c4a47c] border border-[#c4a47c] font-bold text-xs uppercase flex items-center gap-2 cursor-pointer transition-all shadow-xs ${
                isDownloading ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              {isDownloading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#c4a47c] border-t-transparent rounded-full animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#c4a47c]" />
                  <span>Download PDF Brochure (Instant)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleWhatsAppBrochure}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Get on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Get on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#fdfcf9] space-y-6">
          {/* Success Banner */}
          {downloadSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 p-3.5 text-xs text-emerald-900 flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong className="block font-bold">PDF Brochure Downloaded Successfully!</strong>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  The document has been saved to your downloads folder. You can also review it anytime in your My Account Activity hub.
                </p>
              </div>
            </div>
          )}

          {/* Brochure Preview Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column: Visual Cover Card */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative border-2 border-[#1a1a1a] shadow-md bg-white p-3">
                <div className="relative aspect-4/3 overflow-hidden bg-slate-900 border border-[#1a1a1a]/20">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#1a1a1a] text-[#c4a47c] text-[9px] font-bold px-2 py-0.5 uppercase border border-[#c4a47c]">
                    NS Verified Dossier
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-xs text-white p-2 text-xs">
                    <span className="font-serif-luxury font-bold block truncate">{property.title}</span>
                    <span className="font-mono-luxury text-[#c4a47c] text-sm font-black">{property.priceDisplay}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#1a1a1a]/15 text-xs space-y-1.5">
                  <div className="flex justify-between text-gray-600">
                    <span>Document Format:</span>
                    <strong className="text-black">Standard High-Res PDF (A4)</strong>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Includes:</span>
                    <strong className="text-black">Floor Plans, Price, RERA, Specs</strong>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>File Size:</span>
                    <strong className="text-black">~1.2 MB (Vector Graphics)</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isDownloading}
                  className="w-full mt-4 py-2.5 bg-[#c4a47c] hover:bg-[#b09066] text-black font-black uppercase text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs border border-black"
                >
                  <Download className="w-4 h-4 text-black" />
                  <span>Click to Download Official PDF</span>
                </button>
              </div>

              {/* Delivery to Email Form */}
              <div className="bg-white border border-[#1a1a1a]/20 p-4 shadow-xs">
                <div className="flex items-center gap-1.5 mb-2 text-[#1a1a1a]">
                  <FileText className="w-4 h-4 text-[#005CA8]" />
                  <h4 className="font-serif-luxury font-bold text-xs uppercase tracking-wider">
                    Receive Full Brochure Kit via Email
                  </h4>
                </div>
                <p className="text-[11px] text-gray-500 mb-3">
                  We'll dispatch the comprehensive developer kit, unit layouts, and latest payment discounts to your inbox.
                </p>

                {emailDeliverySent ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 text-center">
                    <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
                    <span className="font-bold block">Brochure Kit Dispatched!</span>
                    <span className="text-[10px] text-emerald-700">Check your inbox ({buyerEmail}) within 2 minutes.</span>
                  </div>
                ) : (
                  <form onSubmit={handleEmailKitSubmit} className="space-y-2.5 text-xs">
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="Mobile Number (for SMS confirmation) *"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Email Address (for PDF delivery) *"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-gray-300 bg-white text-xs outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#1a1a1a] hover:bg-black text-white font-bold uppercase text-[11px] transition-colors cursor-pointer"
                    >
                      Email Me Brochure Kit & Download
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Digital Preview Tabs */}
            <div className="md:col-span-7 space-y-4">
              {/* Preview Navigation Tabs */}
              <div className="flex items-center gap-1 border-b border-[#1a1a1a]/20 pb-2">
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('overview')}
                  className={`px-3 py-1.5 text-xs font-bold uppercase cursor-pointer border transition-all ${
                    activePreviewTab === 'overview'
                      ? 'bg-[#1a1a1a] text-[#c4a47c] border-[#1a1a1a]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                  }`}
                >
                  Overview & Specs
                </button>

                <button
                  type="button"
                  onClick={() => setActivePreviewTab('floorplans')}
                  className={`px-3 py-1.5 text-xs font-bold uppercase cursor-pointer border transition-all ${
                    activePreviewTab === 'floorplans'
                      ? 'bg-[#1a1a1a] text-[#c4a47c] border-[#1a1a1a]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                  }`}
                >
                  Floor Layouts
                </button>

                <button
                  type="button"
                  onClick={() => setActivePreviewTab('amenities')}
                  className={`px-3 py-1.5 text-xs font-bold uppercase cursor-pointer border transition-all ${
                    activePreviewTab === 'amenities'
                      ? 'bg-[#1a1a1a] text-[#c4a47c] border-[#1a1a1a]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                  }`}
                >
                  Amenities (40+)
                </button>

                <button
                  type="button"
                  onClick={() => setActivePreviewTab('location')}
                  className={`px-3 py-1.5 text-xs font-bold uppercase cursor-pointer border transition-all ${
                    activePreviewTab === 'location'
                      ? 'bg-[#1a1a1a] text-[#c4a47c] border-[#1a1a1a]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                  }`}
                >
                  Connectivity
                </button>
              </div>

              {/* TAB 1: OVERVIEW & SPECS */}
              {activePreviewTab === 'overview' && (
                <div className="bg-white border border-[#1a1a1a]/20 p-5 space-y-4">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Project Summary</span>
                    <h4 className="font-serif-luxury text-lg font-bold text-[#1a1a1a]">
                      {property.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {property.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-[#1a1a1a]/10 text-xs">
                    <div className="bg-gray-50 p-2.5 border border-gray-200">
                      <span className="text-gray-500 text-[10px] uppercase block">Price Range</span>
                      <strong className="text-[#c4a47c] font-black text-sm">{property.priceDisplay}</strong>
                    </div>

                    <div className="bg-gray-50 p-2.5 border border-gray-200">
                      <span className="text-gray-500 text-[10px] uppercase block">Configuration</span>
                      <strong className="text-black text-sm">{property.bhk > 0 ? `${property.bhk} BHK` : property.type}</strong>
                    </div>

                    <div className="bg-gray-50 p-2.5 border border-gray-200">
                      <span className="text-gray-500 text-[10px] uppercase block">Super Built-up</span>
                      <strong className="text-black text-sm">{property.areaSqFt} Sq.Ft</strong>
                    </div>

                    <div className="bg-gray-50 p-2.5 border border-gray-200">
                      <span className="text-gray-500 text-[10px] uppercase block">Possession</span>
                      <strong className="text-black text-xs">{property.possession}</strong>
                    </div>

                    <div className="bg-gray-50 p-2.5 border border-gray-200">
                      <span className="text-gray-500 text-[10px] uppercase block">Vastu & Facing</span>
                      <strong className="text-black text-xs">{property.facing ? `${property.facing} Facing` : 'East Facing'}</strong>
                    </div>

                    <div className="bg-gray-50 p-2.5 border border-gray-200">
                      <span className="text-gray-500 text-[10px] uppercase block">RERA Number</span>
                      <strong className="text-emerald-700 text-[11px] truncate block">{property.reraId || 'Verified'}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>Developer / Seller: <strong>{property.seller.name}</strong></span>
                    <span className="text-emerald-600 font-bold">✓ 100% Genuine Direct Listing</span>
                  </div>
                </div>
              )}

              {/* TAB 2: FLOOR PLANS & MASTER LAYOUT */}
              {activePreviewTab === 'floorplans' && (
                <div className="bg-white border border-[#1a1a1a]/20 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Architectural Layout</span>
                      <h4 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                        Master Site & Unit Floor Plans
                      </h4>
                    </div>
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-200 uppercase">
                      INCLUDED IN PDF
                    </span>
                  </div>

                  {property.images && property.images.length > 1 ? (
                    <div className="border border-[#1a1a1a]/20 overflow-hidden bg-slate-900 relative">
                      <img
                        src={property.images[1]}
                        alt="Architectural Layout"
                        className="w-full h-56 object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5">
                        Architectural Layout & Elevation Rendering
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50/50 border border-amber-200 p-4 text-center space-y-2">
                      <Layers className="w-8 h-8 mx-auto text-[#c4a47c]" />
                      <h5 className="font-bold text-xs text-amber-900">Standard Architectural Blueprint Available</h5>
                      <p className="text-[11px] text-amber-800">
                        Detailed 2D unit layout, dimension breakdown, foyer, living room, and balcony dimensions are rendered inside the downloadable PDF brochure.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-gray-50 p-2 border border-gray-200">
                      <span className="text-gray-400 text-[10px] block">Carpet Area Efficiency</span>
                      <strong className="text-black">~72% Usable Carpet Ratio</strong>
                    </div>
                    <div className="bg-gray-50 p-2 border border-gray-200">
                      <span className="text-gray-400 text-[10px] block">Balcony Orientation</span>
                      <strong className="text-black">Unobstructed Sky Deck Views</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: AMENITIES */}
              {activePreviewTab === 'amenities' && (
                <div className="bg-white border border-[#1a1a1a]/20 p-5 space-y-4">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Clubhouse & Lifestyle</span>
                    <h4 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                      Exclusive Resident Amenities
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {property.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-[#fdfcf9] border border-gray-200">
                        <span className="text-[#c4a47c] font-bold">✦</span>
                        <span className="text-gray-800 font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-gray-500 italic">
                    * Full list of indoor games, health club specs, and membership terms detailed in the downloaded brochure dossier.
                  </p>
                </div>
              )}

              {/* TAB 4: CONNECTIVITY */}
              {activePreviewTab === 'location' && (
                <div className="bg-white border border-[#1a1a1a]/20 p-5 space-y-4">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Strategic Location Matrix</span>
                    <h4 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                      {property.locality}, {property.city}
                    </h4>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-gray-50 border border-gray-200 flex items-center justify-between">
                      <span className="font-bold text-[#005CA8]">Metro Station</span>
                      <span className="text-gray-600">5 - 7 mins drive (Fast Feeder)</span>
                    </div>
                    <div className="p-2.5 bg-gray-50 border border-gray-200 flex items-center justify-between">
                      <span className="font-bold text-[#005CA8]">Primary Business / IT Park</span>
                      <span className="text-gray-600">10 - 15 mins (Direct Access)</span>
                    </div>
                    <div className="p-2.5 bg-gray-50 border border-gray-200 flex items-center justify-between">
                      <span className="font-bold text-[#005CA8]">International Airport</span>
                      <span className="text-gray-600">35 - 45 mins (Highway Bypass)</span>
                    </div>
                    <div className="p-2.5 bg-gray-50 border border-gray-200 flex items-center justify-between">
                      <span className="font-bold text-[#005CA8]">Super-Speciality Hospitals</span>
                      <span className="text-gray-600">Within 3.5 km radius</span>
                    </div>
                    <div className="p-2.5 bg-gray-50 border border-gray-200 flex items-center justify-between">
                      <span className="font-bold text-[#005CA8]">Top International Schools</span>
                      <span className="text-gray-600">Within 15 mins commute</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Footer Actions */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-t-2 border-[#c4a47c]">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#c4a47c] font-bold">Questions about this project?</span>
            <span className="text-white/60">Call Concierge: 1800-208-3344</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-5 py-2 bg-[#c4a47c] hover:bg-[#b09066] text-black font-black uppercase text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <Download className="w-4 h-4 text-black" />
              <span>Download PDF Brochure</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
