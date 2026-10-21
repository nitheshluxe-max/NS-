import React, { useState } from 'react';
import { 
  Building2, 
  Heart, 
  Calculator, 
  TrendingUp, 
  PlusCircle, 
  MapPin, 
  ChevronDown, 
  MessageSquare, 
  Phone,
  Sparkles
} from 'lucide-react';
import { TOP_CITIES } from '../data/properties';
import { openWhatsAppChat, DEFAULT_CONTACT_PHONE, DISPLAY_CONTACT_PHONE } from '../utils/whatsapp';
import { AppProfileLogo } from './AppProfileLogo';

interface HeaderProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenPostProperty: () => void;
  onOpenEmiCalc: () => void;
  onOpenMarketTrends: () => void;
  onOpenContactModal: () => void;
  activeCategory?: string;
  onSelectCategory?: (cat: 'apartments' | 'plots' | 'commercial' | 'projects') => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCity,
  onSelectCity,
  savedCount,
  onOpenSaved,
  onOpenPostProperty,
  onOpenEmiCalc,
  onOpenMarketTrends,
  onOpenContactModal,
  activeCategory = 'apartments',
  onSelectCategory
}) => {
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#fdfcf9] border-b-[1.5px] border-[#1a1a1a]">
      {/* Top micro bar with luxury architectural styling */}
      <div className="bg-[#1a1a1a] text-[#fdfcf9] py-1.5 px-3 sm:px-6 lg:px-8 text-xs border-b border-black w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-medium tracking-wide">
            <span className="text-white/70">NS Properties 4</span>
            <span className="text-white/30">•</span>
            <span className="text-[#c4a47c] font-semibold">Verified Luxury &amp; Public Property Listings</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 text-[11px]">
            <button 
              onClick={onOpenMarketTrends}
              className="text-white/80 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <TrendingUp className="w-3 h-3 text-[#c4a47c]" />
              <span className="hidden sm:inline">Price Trends</span>
            </button>

            <button 
              onClick={onOpenEmiCalc}
              className="text-white/80 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Calculator className="w-3 h-3 text-[#c4a47c]" />
              <span className="hidden sm:inline">EMI Calculator</span>
            </button>

            <button
              onClick={() => {
                const msg = `Hello NS Properties, I would like to inquire about your property listings.`;
                openWhatsAppChat(DEFAULT_CONTACT_PHONE, msg);
              }}
              className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold flex items-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3 h-3" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={onOpenContactModal}
              className="text-white/80 hover:text-white transition-colors cursor-pointer hidden md:flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-[#c4a47c]" />
              <span>{DISPLAY_CONTACT_PHONE}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 w-full">
        {/* Brand Logo & City Picker */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0 group"
          >
            {/* Official NS Properties 4 Logo */}
            <AppProfileLogo size="md" showGlow={false} className="w-9 h-9 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-105 shrink-0" />

            <div className="shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-tight text-[#1a1a1a] whitespace-nowrap">
                  NS Properties
                </span>
                <span className="text-[10px] text-[#3b6594] font-black tracking-widest uppercase border border-[#3b6594]/40 px-1 py-0.2 shrink-0 rounded-xs">
                  4
                </span>
              </div>
              <p className="text-[9px] text-[#1a1a1a]/60 uppercase tracking-widest hidden xs:block font-medium">
                Verified Real Estate Portal
              </p>
            </div>
          </div>

          {/* Metro City Selector */}
          <div className="relative shrink-0">
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs text-[#1a1a1a] bg-white hover:bg-slate-50 border border-slate-300 cursor-pointer transition-colors rounded-xs shrink-0 font-medium"
            >
              <MapPin className="w-3.5 h-3.5 text-[#3b6594] shrink-0" />
              <span className="font-semibold truncate max-w-[80px] sm:max-w-none">{selectedCity}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </button>

            {cityDropdownOpen && (
              <div 
                className="absolute left-0 top-full mt-1.5 w-48 bg-white border border-slate-300 shadow-xl py-1 z-50 animate-in fade-in rounded-xs"
                onMouseLeave={() => setCityDropdownOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] uppercase text-slate-400 font-semibold tracking-wider">
                  Select Metro City
                </div>
                {TOP_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      onSelectCity(city);
                      setCityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCity === city
                        ? 'bg-[#1a1a1a] text-[#fdfcf9] font-bold'
                        : 'text-[#1a1a1a] hover:bg-slate-100'
                    }`}
                  >
                    {city}
                    {selectedCity === city && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c4a47c]"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Category Links (Desktop) */}
        {onSelectCategory && (
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-600">
            <button
              onClick={() => onSelectCategory('apartments')}
              className={`hover:text-black transition-colors cursor-pointer pb-1 border-b-2 ${
                activeCategory === 'apartments' ? 'border-black text-black' : 'border-transparent'
              }`}
            >
              Apartments
            </button>
            <button
              onClick={() => onSelectCategory('plots')}
              className={`hover:text-black transition-colors cursor-pointer pb-1 border-b-2 ${
                activeCategory === 'plots' ? 'border-black text-black' : 'border-transparent'
              }`}
            >
              Plots &amp; Land
            </button>
            <button
              onClick={() => onSelectCategory('commercial')}
              className={`hover:text-black transition-colors cursor-pointer pb-1 border-b-2 ${
                activeCategory === 'commercial' ? 'border-black text-black' : 'border-transparent'
              }`}
            >
              Commercial
            </button>
            <button
              onClick={onOpenEmiCalc}
              className="hover:text-black transition-colors cursor-pointer pb-1 border-b-2 border-transparent flex items-center gap-1"
            >
              <Calculator className="w-3.5 h-3.5 text-slate-400" />
              <span>EMI Calculator</span>
            </button>
          </nav>
        )}

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Public Upload Property CTA - PRIMARY ACTION */}
          <button
            onClick={onOpenPostProperty}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-semibold bg-[#1a1a1a] hover:bg-black text-white transition-all cursor-pointer shadow-sm rounded-xs whitespace-nowrap"
            title="Upload property details as public (Free)"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span className="hidden sm:inline">Upload Property (Free)</span>
            <span className="sm:hidden">Upload</span>
          </button>

          {/* Saved Properties Shortlist */}
          <button
            onClick={onOpenSaved}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-all cursor-pointer rounded-xs whitespace-nowrap"
            title="View saved properties"
          >
            <Heart className={`w-3.5 h-3.5 ${savedCount > 0 ? 'text-red-600 fill-red-600' : 'text-slate-400'}`} />
            <span className="hidden md:inline">Saved</span>
            {savedCount > 0 && (
              <span className="bg-[#c4a47c] text-black text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
