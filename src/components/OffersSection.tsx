import React, { useState } from 'react';
import {
  Tag,
  Percent,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  Phone,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Offer, Property } from '../types';
import { calculateOfferPrice, isOfferActiveAndValid } from '../data/plansOffersData';
import { formatIndianCurrency } from '../utils/formatters';
import { DEFAULT_CONTACT_PHONE, openWhatsAppChat } from '../utils/whatsapp';

export interface OffersSectionProps {
  offers: Offer[];
  properties: Property[];
  onOpenOfferDetails: (offer: Offer) => void;
  onSelectProperty: (property: Property) => void;
  onOpenPlansModal?: () => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({
  offers,
  properties,
  onOpenOfferDetails,
  onSelectProperty,
  onOpenPlansModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter only active & valid offers per Requirement 2 & 8: "Only active and valid offers should be displayed."
  const validOffers = offers.filter(isOfferActiveAndValid);

  if (validOffers.length === 0) return null;

  const filteredOffers = validOffers.filter((o) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'featured') return o.featured;
    return o.category === selectedCategory;
  });

  const categories = [
    { id: 'all', label: 'All Deals', count: validOffers.length },
    { id: 'featured', label: '★ Featured Offers', count: validOffers.filter(o => o.featured).length },
    { id: 'festival', label: 'Diwali & Fest Concessions', count: validOffers.filter(o => o.category === 'festival').length },
    { id: 'limited_time', label: 'Limited-Time Deals', count: validOffers.filter(o => o.category === 'limited_time').length },
    { id: 'property_discount', label: 'Property Price Cuts', count: validOffers.filter(o => o.category === 'property_discount').length },
    { id: 'special_project', label: 'Special Project Schemes', count: validOffers.filter(o => o.category === 'special_project').length },
    { id: 'booking_benefit', label: 'Booking Benefits', count: validOffers.filter(o => o.category === 'booking_benefit').length }
  ].filter(c => c.count > 0 || c.id === 'all');

  return (
    <section id="offers-deals-section" className="py-10 bg-[#fdfcf9] border-b-2 border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c4a47c] animate-pulse" />
              <span className="font-mono-luxury text-xs text-[#c4a47c] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#c4a47c]" />
                Exclusive Concessions & Builder Promotions
              </span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1a1a1a] mt-1">
              Curated Luxury Plans & Special Offers
            </h2>
            <p className="font-mono-luxury text-xs text-[#1a1a1a]/70 mt-1 max-w-2xl">
              Direct-from-builder festival discounts, stamp duty waivers, and time-sensitive cash rebates on verified signature properties.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-luxury">
            {onOpenPlansModal && (
              <button
                type="button"
                onClick={onOpenPlansModal}
                className="px-3.5 py-1.5 bg-white border border-[#1a1a1a] hover:bg-black hover:text-white text-[#1a1a1a] font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span>Agent & Builder Plans</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none font-mono-luxury">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs uppercase font-bold transition-all cursor-pointer border whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1a1a1a] text-[#c4a47c] border-[#1a1a1a] shadow-xs'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded-xs ${
                  isSelected ? 'bg-[#c4a47c] text-black font-black' : 'bg-gray-100 text-gray-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Offers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono-luxury">
          {filteredOffers.map((offer) => {
            // Find first matched property or default representative property
            const matchedProp = properties.find((p) => {
              if (offer.applicablePropertyIds.includes('ALL')) return true;
              return offer.applicablePropertyIds.includes(p.id);
            }) || properties[0];

            const priceCalc = calculateOfferPrice(matchedProp?.price || 15000000, offer);

            // Calculate days remaining
            const now = new Date();
            const end = new Date(offer.endDate);
            end.setHours(23, 59, 59, 999);
            const daysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

            return (
              <div
                key={offer.id}
                className="bg-white border-2 border-[#1a1a1a] flex flex-col justify-between hover:shadow-xl transition-all duration-300 group overflow-hidden"
              >
                <div>
                  {/* Banner Image Container */}
                  <div 
                    className="relative h-52 w-full overflow-hidden bg-slate-900 cursor-pointer select-none"
                    onClick={() => onOpenOfferDetails(offer)}
                  >
                    <img
                      src={offer.bannerImage}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                      <span className="bg-[#c4a47c] text-black font-black text-[10px] uppercase px-2.5 py-0.5 tracking-wider shadow-xs border border-black">
                        {offer.discountType === 'percentage'
                          ? `FLAT ${offer.discountValue}% OFF`
                          : `SAVE ₹ ${(offer.discountValue / 100000).toFixed(0)} LAKHS`}
                      </span>
                      {offer.featured && (
                        <span className="bg-[#1a1a1a] text-[#c4a47c] text-[9px] font-bold px-2 py-0.5 uppercase border border-[#c4a47c]/40">
                          ★ HOT DEAL
                        </span>
                      )}
                      <span className="bg-emerald-800 text-white text-[9px] font-bold px-2 py-0.5 uppercase border border-emerald-950 shadow-xs">
                        100% FREE VISIT & DEAL
                      </span>
                    </div>

                    {/* Expiry countdown badge */}
                    <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 border border-white/20 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#c4a47c]" />
                      <span>{daysLeft > 0 ? `${daysLeft}d left` : 'Expiring Today'}</span>
                    </div>

                    {/* Bottom Property summary on banner */}
                    <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                      <span className="text-[10px] text-white/70 block uppercase">
                        {offer.applicableProjectNames && offer.applicableProjectNames.length > 0 
                          ? offer.applicableProjectNames[0] 
                          : matchedProp?.title}
                      </span>
                      <div className="flex items-center justify-between text-xs mt-0.5">
                        <span className="text-gray-300 line-through text-[11px]">
                          {matchedProp ? matchedProp.priceDisplay : '₹ 2.50 Cr'}
                        </span>
                        <span className="font-serif-luxury font-bold text-[#c4a47c] text-sm">
                          Offer: {formatIndianCurrency(priceCalc.discountedPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5">
                    <h3
                      onClick={() => onOpenOfferDetails(offer)}
                      className="font-serif-luxury font-bold text-base sm:text-lg text-[#1a1a1a] hover:text-[#005CA8] cursor-pointer line-clamp-1 leading-snug"
                    >
                      {offer.title}
                    </h3>

                    <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed font-sans">
                      {offer.description}
                    </p>

                    {/* Key Metrics Strip */}
                    <div className="mt-3.5 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 p-2 border border-gray-200">
                        <span className="text-gray-400 text-[9px] uppercase block">Total Net Savings</span>
                        <strong className="text-emerald-700 font-bold text-xs">{priceCalc.savingsDisplay}</strong>
                      </div>

                      <div className="bg-gray-50 p-2 border border-gray-200">
                        <span className="text-gray-400 text-[9px] uppercase block">Valid Until</span>
                        <strong className="text-black font-bold text-xs">{offer.endDate}</strong>
                      </div>
                    </div>

                    {/* Free Visit & Terms summary bullet */}
                    <div className="mt-3 text-[11px] text-emerald-800 flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">
                        100% Free Site Visits for Buyers, Agents, Developers & Builders
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons (Requirement 2) */}
                <div className="p-3.5 bg-[#fdfcf9] border-t-2 border-[#1a1a1a]/15 space-y-2">
                  <div className="flex items-center gap-2">
                    {/* View Property */}
                    <button
                      type="button"
                      onClick={() => {
                        if (matchedProp) onSelectProperty(matchedProp);
                        else onOpenOfferDetails(offer);
                      }}
                      className="flex-1 py-1.5 bg-white border border-[#1a1a1a] hover:bg-gray-50 text-black text-xs font-bold uppercase transition-colors cursor-pointer text-center"
                      title="View Property Details"
                    >
                      View Property
                    </button>

                    {/* Enquire Now */}
                    <button
                      type="button"
                      onClick={() => onOpenOfferDetails(offer)}
                      className="flex-1 py-1.5 bg-[#1a1a1a] hover:bg-black text-[#c4a47c] text-xs font-bold uppercase transition-colors cursor-pointer text-center border border-[#1a1a1a]"
                      title="Claim Offer & Enquire"
                    >
                      Enquire Now
                    </button>
                  </div>

                  {/* Call and WhatsApp row */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <a
                      href="tel:18002083344"
                      className="py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold uppercase flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3 h-3 text-[#c4a47c]" />
                      <span>Call Concierge</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        const msg = `Hi NS Properties, I saw the special deal "${offer.title}" (${offer.discountType === 'percentage' ? `${offer.discountValue}% Off` : `₹ ${(offer.discountValue / 100000).toFixed(0)} Lakhs Savings`}). Please share full pricing sheet.`;
                        openWhatsAppChat(DEFAULT_CONTACT_PHONE, msg);
                      }}
                      className="py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase flex items-center justify-center gap-1 transition-colors cursor-pointer"
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
    </section>
  );
};
