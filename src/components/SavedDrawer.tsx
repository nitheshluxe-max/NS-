import React from 'react';
import { X, Heart, Trash2, CalendarCheck, MapPin, Phone, ArrowRight, MessageSquare } from 'lucide-react';
import { Property, SiteVisitRequest } from '../types';
import { openWhatsAppChat, DEFAULT_CONTACT_PHONE } from '../utils/whatsapp';

interface SavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProperties: Property[];
  onRemoveSaved: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  siteVisits: SiteVisitRequest[];
  onCancelVisit: (id: string) => void;
  activeTab: 'saved' | 'visits';
  onTabChange: (tab: 'saved' | 'visits') => void;
}

export const SavedDrawer: React.FC<SavedDrawerProps> = ({
  isOpen,
  onClose,
  savedProperties,
  onRemoveSaved,
  onSelectProperty,
  siteVisits,
  onCancelVisit,
  activeTab,
  onTabChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-[#fdfcf9] border-l-[1.5px] border-[#1a1a1a] h-full shadow-2xl z-10 flex flex-col">
        {/* Top Header */}
        <div className="p-4 border-b border-[#1a1a1a] flex items-center justify-between bg-[#1a1a1a] text-[#fdfcf9]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTabChange('saved')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-mono-luxury text-xs font-bold uppercase transition-colors cursor-pointer border ${
                activeTab === 'saved'
                  ? 'bg-[#c4a47c] text-[#1a1a1a] border-[#c4a47c]'
                  : 'text-[#fdfcf9]/80 border-transparent hover:border-[#fdfcf9]/30'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              Shortlist ({savedProperties.length})
            </button>
            <button
              onClick={() => onTabChange('visits')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-mono-luxury text-xs font-bold uppercase transition-colors cursor-pointer border ${
                activeTab === 'visits'
                  ? 'bg-[#c4a47c] text-[#1a1a1a] border-[#c4a47c]'
                  : 'text-[#fdfcf9]/80 border-transparent hover:border-[#fdfcf9]/30'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              Visits ({siteVisits.length})
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white border border-white/20 hover:border-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'saved' ? (
            savedProperties.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-12 h-12 text-[#1a1a1a]/20 mx-auto mb-2" />
                <h4 className="font-serif-luxury text-lg font-bold text-[#1a1a1a]">No Shortlisted Properties</h4>
                <p className="editorial-label text-[#1a1a1a]/60 text-xs normal-case mt-1 max-w-xs mx-auto">
                  Click the heart icon on any property to bookmark it and compare later.
                </p>
              </div>
            ) : (
              savedProperties.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-[#1a1a1a] p-3 flex gap-3 shadow-xs"
                >
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-20 h-20 object-cover cursor-pointer shrink-0 border border-[#1a1a1a]/30"
                    onClick={() => {
                      onSelectProperty(p);
                      onClose();
                    }}
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4
                          onClick={() => {
                            onSelectProperty(p);
                            onClose();
                          }}
                          className="font-serif-luxury text-sm font-bold text-[#1a1a1a] hover:text-[#c4a47c] cursor-pointer truncate"
                        >
                          {p.title}
                        </h4>
                        <button
                          onClick={() => onRemoveSaved(p.id)}
                          className="text-[#1a1a1a]/50 hover:text-red-500 p-0.5 cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-mono-luxury text-xs font-bold text-[#1a1a1a] block mt-0.5">
                        {p.priceDisplay}
                      </span>
                      <p className="editorial-label text-[#1a1a1a]/60 text-[10px] normal-case truncate">
                        {p.locality}, {p.city}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a]/10">
                      <span className="font-mono-luxury text-[10px] text-[#1a1a1a]/60">
                        {p.bhk > 0 ? `${p.bhk} BHK • ` : ''}{p.areaSqFt} sq.ft
                      </span>
                      <button
                        onClick={() => {
                          onSelectProperty(p);
                          onClose();
                        }}
                        className="font-mono-luxury text-[10px] text-[#1a1a1a] font-bold uppercase hover:text-[#c4a47c] flex items-center gap-0.5 cursor-pointer"
                      >
                        View <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            siteVisits.length === 0 ? (
              <div className="text-center py-16">
                <CalendarCheck className="w-12 h-12 text-[#1a1a1a]/20 mx-auto mb-2" />
                <h4 className="font-serif-luxury text-lg font-bold text-[#1a1a1a]">No Scheduled Visits</h4>
                <p className="editorial-label text-[#1a1a1a]/60 text-xs normal-case mt-1 max-w-xs mx-auto">
                  You can schedule physical site visits or live virtual video tours for any property.
                </p>
              </div>
            ) : (
              siteVisits.map((v) => (
                <div
                  key={v.id}
                  className="bg-white border border-[#1a1a1a] p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="editorial-badge bg-[#e2f4ea] text-[#1e4620] border-0 text-[10px]">
                      {v.status}
                    </span>
                    <button
                      onClick={() => onCancelVisit(v.id)}
                      className="font-mono-luxury text-xs text-[#1a1a1a]/50 hover:text-red-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div>
                    <h5 className="font-serif-luxury text-sm font-bold text-[#1a1a1a]">{v.propertyTitle}</h5>
                    <p className="font-mono-luxury text-xs text-[#c4a47c] font-semibold mt-1">
                      📅 {v.date} ({v.timeSlot})
                    </p>
                    <p className="editorial-label text-[#1a1a1a]/60 text-[10px] normal-case mt-0.5">
                      Visitor: {v.name} ({v.phone})
                    </p>
                    {v.notes && (
                      <p className="editorial-label text-[#1a1a1a]/80 normal-case bg-[#fdfcf9] p-2 border border-[#1a1a1a]/20 mt-1.5 italic text-xs">
                        "{v.notes}"
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#1a1a1a]/10 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        const msg = `Hi, I am following up on my scheduled visit for "${v.propertyTitle}" booked for ${v.date} (${v.timeSlot}). Name: ${v.name}. Please share the coordinator contact and address.`;
                        openWhatsAppChat(DEFAULT_CONTACT_PHONE, msg);
                      }}
                      className="inline-flex items-center gap-1.5 font-mono-luxury text-[10px] font-bold uppercase text-emerald-800 bg-[#e2f4ea] hover:bg-[#d0eedb] px-3 py-1.5 border border-emerald-300 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                      <span>WhatsApp Coordinator</span>
                    </button>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};
