import React, { useState } from 'react';
import { 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Camera,
  MessageSquare,
  Calendar,
  Download,
  FileText
} from 'lucide-react';
import { Property } from '../types';
import { openWhatsAppChat } from '../utils/whatsapp';

interface PropertyCardProps {
  property: Property;
  isSaved: boolean;
  isCompared: boolean;
  onToggleSave: (property: Property) => void;
  onToggleCompare: (property: Property) => void;
  onSelectProperty: (property: Property) => void;
  onScheduleVisit: (property: Property) => void;
  onOpenBrochure?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onSelectProperty,
  onScheduleVisit,
  onOpenBrochure
}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <article 
      className="bg-[#fdfcf9] border border-[#1a1a1a]/15 hover:border-[#1a1a1a] transition-all duration-200 p-4 sm:p-5 flex flex-col md:flex-row gap-5 group"
    >
      {/* Image Gallery Column - 450px ratio in variation */}
      <div className="relative md:w-[380px] lg:w-[420px] aspect-4/3 shrink-0 bg-[#1a1a1a] overflow-hidden select-none">
        <img
          src={property.images[currentImgIndex]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 cursor-pointer"
          onClick={() => onSelectProperty(property)}
          loading="lazy"
        />

        {/* Image navigation arrows */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1a1a1a]/70 hover:bg-[#1a1a1a] text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1a1a1a]/70 hover:bg-[#1a1a1a] text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Photo count / view badge */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectProperty(property);
          }}
          className="absolute bottom-2.5 right-2.5 bg-[#1a1a1a]/85 text-white font-mono-luxury text-[10px] px-2 py-1 flex items-center gap-1 cursor-pointer z-10"
        >
          <Camera className="w-3 h-3 text-[#c4a47c]" />
          <span>{currentImgIndex + 1}/{property.images.length}</span>
        </button>

        {/* Badges List */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {property.isVerified && (
            <span className="editorial-badge bg-[#e2f4ea] text-[#1e4620] border-0 font-bold">
              Verified on Site
            </span>
          )}
          {property.reraId && (
            <span className="editorial-badge bg-[#1a1a1a] text-[#fdfcf9] border-[#1a1a1a]">
              RERA Approved
            </span>
          )}
          {property.isExclusive && (
            <span className="editorial-badge bg-[#c4a47c] text-[#1a1a1a] border-[#1a1a1a] font-bold">
              Exclusive
            </span>
          )}
        </div>

        {/* Shortlist icon button */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(property);
            }}
            className={`w-8 h-8 bg-[#fdfcf9] border border-[#1a1a1a] flex items-center justify-center transition-transform active:scale-95 cursor-pointer ${
              isSaved ? 'text-red-600' : 'text-[#1a1a1a]'
            }`}
            title={isSaved ? 'Remove from Shortlist' : 'Add to Shortlist'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Property Details Column */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Price header & Price per sq.ft */}
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-mono-luxury text-2xl sm:text-3xl font-bold text-[#1a1a1a]">
              {property.priceDisplay}
            </span>
            <div className="flex items-center gap-3">
              {property.pricePerSqFt > 0 && (
                <span className="editorial-label text-[#1a1a1a]/60">
                  ₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft
                </span>
              )}
              {/* Compare toggle */}
              <label 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 editorial-label text-[#1a1a1a]/70 hover:text-[#1a1a1a] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isCompared}
                  onChange={() => onToggleCompare(property)}
                  className="w-3.5 h-3.5 rounded-none border border-[#1a1a1a] cursor-pointer"
                />
                <span>Compare</span>
              </label>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectProperty(property)}
            className="font-serif-luxury text-xl sm:text-2xl text-[#1a1a1a] font-bold hover:text-[#c4a47c] cursor-pointer transition-colors mt-1.5 line-clamp-1"
          >
            {property.title}
          </h3>

          {/* Subtitle / Locality */}
          <p className="editorial-label text-[#1a1a1a]/60 mt-1 mb-3">
            {property.locality} • {property.city} {property.builderName ? `• ${property.builderName}` : ''}
          </p>

          {/* Area & Possession Grid */}
          <div className="grid grid-cols-2 gap-3 py-2.5 border-t border-b border-[#1a1a1a]/10 my-2 text-xs">
            <div className="editorial-label text-[#1a1a1a]/80">
              Area: <span className="font-bold text-[#1a1a1a]">{property.areaSqFt} sq.ft</span>
            </div>
            <div className="editorial-label text-[#1a1a1a]/80">
              Possession: <span className="font-bold text-[#1a1a1a]">{property.possession}</span>
            </div>
            <div className="editorial-label text-[#1a1a1a]/80">
              BHK: <span className="font-bold text-[#1a1a1a]">{property.bhk > 0 ? `${property.bhk} BHK` : property.type}</span>
            </div>
            <div className="editorial-label text-[#1a1a1a]/80">
              Furnishing: <span className="font-bold text-[#1a1a1a]">{property.furnishing}</span>
            </div>
          </div>

          {/* Pill Amenities */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            {property.amenities.slice(0, 4).map((amenity, idx) => (
              <span key={idx} className="editorial-pill">
                {amenity}
              </span>
            ))}
            {property.amenities.length > 4 && (
              <span className="editorial-label text-[#1a1a1a]/50 text-[10px] pl-1">
                +{property.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Actions Button Bar */}
        <div className="mt-5 pt-3 border-t border-[#1a1a1a]/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#1a1a1a] text-[#fdfcf9] font-mono-luxury font-bold text-xs flex items-center justify-center">
              {property.seller.name.charAt(0)}
            </div>
            <div className="text-xs">
              <span className="font-mono-luxury text-[11px] font-bold text-[#1a1a1a] block">
                {property.seller.name}
              </span>
              <span className="editorial-label text-[#1a1a1a]/50 text-[9px]">
                {property.postedBy}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Brochure Download */}
            <button
              type="button"
              onClick={() => onOpenBrochure ? onOpenBrochure(property) : onSelectProperty(property)}
              className="editorial-label px-3 py-2 text-[#1a1a1a] border border-[#c4a47c] hover:bg-[#c4a47c]/10 bg-transparent cursor-pointer flex items-center gap-1.5 font-bold"
              title="Download Official Project Brochure PDF"
            >
              <Download className="w-3.5 h-3.5 text-[#c4a47c]" />
              <span>Brochure</span>
            </button>

            {/* Site visit */}
            <button
              type="button"
              onClick={() => onScheduleVisit(property)}
              className="editorial-label px-3 py-2 text-[#1a1a1a] border border-[#1a1a1a]/30 hover:border-[#1a1a1a] bg-transparent cursor-pointer flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Visit</span>
            </button>

            {/* WhatsApp Seller */}
            <button
              type="button"
              onClick={() => {
                const msg = `Hello ${property.seller.name}, I am inquiring about "${property.title}" (${property.priceDisplay}, ${property.locality}, ${property.city} - ID: ${property.id}).`;
                openWhatsAppChat(property.seller.phone, msg);
              }}
              className="editorial-label px-3.5 py-2 bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* View Details */}
            <button
              type="button"
              onClick={() => onSelectProperty(property)}
              className="editorial-label px-4 py-2 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-bold cursor-pointer transition-all border border-[#1a1a1a]"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
