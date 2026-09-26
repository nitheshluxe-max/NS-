import React from 'react';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Sparkles, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight, 
  Compass, 
  Layers, 
  Briefcase, 
  TreePine, 
  Heart, 
  Scale, 
  CalendarCheck,
  ChevronRight,
  ShieldCheck,
  Download
} from 'lucide-react';
import { Property, PropertyCategory, PropertyType } from '../types';
import { openWhatsAppChat, DEFAULT_CONTACT_PHONE, DISPLAY_CONTACT_PHONE } from '../utils/whatsapp';

// ==========================================
// 1. CATEGORY QUICK NAV STRIP
// (Apartments • Plots & Land • Commercial • Projects)
// ==========================================
interface CategoryNavProps {
  activeCategory: string;
  onSelectCategory: (category: 'apartments' | 'plots' | 'commercial' | 'projects') => void;
  counts: {
    apartments: number;
    plots: number;
    commercial: number;
    projects: number;
  };
}

export const CategoryQuickNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  counts
}) => {
  const categories = [
    {
      id: 'apartments',
      label: 'Apartments',
      sublabel: 'Flats & Penthouses',
      icon: Building2,
      count: counts.apartments
    },
    {
      id: 'plots',
      label: 'Plots & Land',
      sublabel: 'Residential & Villa Sites',
      icon: TreePine,
      count: counts.plots
    },
    {
      id: 'commercial',
      label: 'Commercial Properties',
      sublabel: 'Offices, Shops & Showrooms',
      icon: Briefcase,
      count: counts.commercial
    },
    {
      id: 'projects',
      label: 'Projects',
      sublabel: 'New Launches & Builder Floors',
      icon: Layers,
      count: counts.projects
    }
  ];

  return (
    <div className="bg-[#fdfcf9] border-y border-[#1a1a1a] py-4 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as any)}
                className={`p-3.5 sm:p-4 text-left border-2 transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'border-[#1a1a1a] bg-[#1a1a1a] text-[#fdfcf9] shadow-md'
                    : 'border-[#1a1a1a]/20 bg-white hover:border-[#1a1a1a] text-[#1a1a1a]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'border-[#c4a47c] bg-[#c4a47c]/20 text-[#c4a47c]'
                      : 'border-[#1a1a1a]/20 bg-[#fdfcf9] text-[#1a1a1a]'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-serif-luxury font-bold text-sm sm:text-base leading-tight ${
                      isSelected ? 'text-white' : 'text-[#1a1a1a]'
                    }`}>
                      {cat.label}
                    </h3>
                    <p className={`font-mono-luxury text-[10px] sm:text-[11px] mt-0.5 ${
                      isSelected ? 'text-white/70' : 'text-[#1a1a1a]/60'
                    }`}>
                      {cat.sublabel}
                    </p>
                  </div>
                </div>

                <div className="text-right pl-2">
                  <span className={`inline-block font-mono-luxury text-[10px] sm:text-xs font-bold px-2 py-0.5 ${
                    isSelected
                      ? 'bg-[#c4a47c] text-black'
                      : 'bg-[#1a1a1a]/5 text-[#1a1a1a]'
                  }`}>
                    {cat.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. FEATURED PROPERTIES SHOWCASE
// ==========================================
interface FeaturedPropsSectionProps {
  properties: Property[];
  onSelectProperty: (p: Property) => void;
  onScheduleVisit: (p: Property) => void;
  onToggleSave: (p: Property) => void;
  onOpenBrochure?: (p: Property) => void;
  savedIds: string[];
}

export const FeaturedPropertiesShowcase: React.FC<FeaturedPropsSectionProps> = ({
  properties,
  onSelectProperty,
  onScheduleVisit,
  onToggleSave,
  onOpenBrochure,
  savedIds
}) => {
  const featured = properties.filter((p) => p.isFeatured || p.isExclusive).slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="py-8 bg-white border-b border-[#1a1a1a]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c4a47c]" />
              <span className="font-mono-luxury text-xs text-[#c4a47c] font-bold uppercase tracking-wider">
                NS Verified Signature Collection
              </span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1a1a1a] mt-1">
              Featured Properties
            </h2>
            <p className="font-mono-luxury text-xs text-[#1a1a1a]/60 mt-1">
              Handpicked premium residences, builder project launches, and RERA-certified homes.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-luxury">
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Genuine Direct Listings
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((prop) => {
            const isSaved = savedIds.includes(prop.id);

            return (
              <div
                key={prop.id}
                className="bg-[#fdfcf9] border border-[#1a1a1a] flex flex-col justify-between hover:shadow-lg transition-all group overflow-hidden"
              >
                <div>
                  {/* Image banner */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900 cursor-pointer" onClick={() => onSelectProperty(prop)}>
                    {prop.images && prop.images[0] ? (
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/40">
                        <Building2 className="w-10 h-10" />
                      </div>
                    )}

                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      <span className="bg-[#1a1a1a] text-[#c4a47c] font-mono-luxury text-[10px] font-bold px-2 py-0.5 uppercase border border-[#c4a47c]/40">
                        ★ Featured
                      </span>
                      {prop.isVerified && (
                        <span className="bg-emerald-600 text-white font-mono-luxury text-[9px] font-bold px-1.5 py-0.2 uppercase">
                          ✓ RERA
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(prop);
                      }}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-[#1a1a1a] shadow-md cursor-pointer transition-transform hover:scale-110"
                      title={isSaved ? 'Remove from Saved' : 'Save Property'}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'text-red-600 fill-red-600' : ''}`} />
                    </button>

                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-mono-luxury text-white bg-black/60 backdrop-blur-xs px-2 py-1">
                      <span>{prop.city} • {prop.locality}</span>
                      <span className="font-bold text-[#c4a47c]">{prop.purpose === 'buy' ? 'For Sale' : 'For Rent'}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5">
                    <h3 
                      onClick={() => onSelectProperty(prop)}
                      className="font-serif-luxury font-bold text-base text-[#1a1a1a] hover:text-[#005CA8] cursor-pointer line-clamp-1 leading-snug"
                    >
                      {prop.title}
                    </h3>
                    <p className="font-mono-luxury text-base font-bold text-[#c4a47c] mt-1">
                      {prop.priceDisplay}
                    </p>
                    <div className="flex items-center justify-between font-mono-luxury text-xs text-[#1a1a1a]/70 mt-1.5 pt-1.5 border-t border-[#1a1a1a]/15">
                      <span>{prop.bhk > 0 ? `${prop.bhk} BHK` : prop.type}</span>
                      <span>{prop.areaSqFt} Sq.Ft</span>
                      <span className="truncate max-w-[85px]">{prop.possession}</span>
                    </div>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="p-3 bg-white border-t border-[#1a1a1a]/15 flex items-center gap-1.5">
                  <button
                    onClick={() => onSelectProperty(prop)}
                    className="flex-1 py-1.5 bg-[#1a1a1a] hover:bg-black text-white text-xs font-mono-luxury font-bold uppercase transition-colors cursor-pointer text-center"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onOpenBrochure ? onOpenBrochure(prop) : onSelectProperty(prop)}
                    className="px-2 py-1.5 border border-[#c4a47c] hover:bg-[#c4a47c]/10 text-black text-xs font-mono-luxury font-bold uppercase transition-colors cursor-pointer flex items-center gap-1"
                    title="Download Official Project Brochure PDF"
                  >
                    <Download className="w-3 h-3 text-[#c4a47c]" />
                    <span>Brochure</span>
                  </button>
                  <button
                    onClick={() => onScheduleVisit(prop)}
                    className="px-2 py-1.5 border border-[#1a1a1a] hover:bg-[#1a1a1a]/5 text-[#1a1a1a] text-xs font-mono-luxury font-bold uppercase transition-colors cursor-pointer"
                    title="Schedule free site tour"
                  >
                    Visit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 3. PROPERTIES BY LOCATION
// ==========================================
interface PropertiesByLocationProps {
  onSelectCity: (city: string) => void;
  onSelectLocality: (locality: string, city: string) => void;
  currentCity: string;
}

export const PropertiesByLocation: React.FC<PropertiesByLocationProps> = ({
  onSelectCity,
  onSelectLocality,
  currentCity
}) => {
  const primeLocalities = [
    { city: 'Bengaluru', locality: 'Whitefield', avgPrice: '₹ 8,750 / sq.ft', count: 18, highlight: 'IT Hub & High Rises' },
    { city: 'Bengaluru', locality: 'Indiranagar', avgPrice: '₹ 15,400 / sq.ft', count: 9, highlight: 'High Street & Posh Living' },
    { city: 'Bengaluru', locality: 'Koramangala', avgPrice: '₹ 14,200 / sq.ft', count: 12, highlight: 'Startup Central & Luxury' },
    { city: 'Bengaluru', locality: 'Sarjapur Road', avgPrice: '₹ 7,900 / sq.ft', count: 15, highlight: 'Gated Villa Communities' },
    { city: 'Mumbai', locality: 'Bandra West', avgPrice: '₹ 45,000 / sq.ft', count: 8, highlight: 'Sea View & High Glamour' },
    { city: 'Delhi NCR', locality: 'Golf Course Road', avgPrice: '₹ 22,000 / sq.ft', count: 11, highlight: 'Ultra-Luxury High Rises' },
    { city: 'Hyderabad', locality: 'Hitec City', avgPrice: '₹ 9,500 / sq.ft', count: 14, highlight: 'Financial Tech Corridor' },
    { city: 'Pune', locality: 'Kharadi', avgPrice: '₹ 7,800 / sq.ft', count: 10, highlight: 'World Trade Centre Hub' }
  ];

  return (
    <section className="py-8 bg-[#fdfcf9] border-b border-[#1a1a1a]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#c4a47c]" />
              <span className="font-mono-luxury text-xs text-[#c4a47c] font-bold uppercase tracking-wider">
                Explore Prime Hubs
              </span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1a1a1a] mt-1">
              Properties by Location
            </h2>
            <p className="font-mono-luxury text-xs text-[#1a1a1a]/60 mt-1">
              Browse hand-vetted residences across India's fastest-growing metropolitan growth corridors.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune'].map((c) => (
              <button
                key={c}
                onClick={() => onSelectCity(c)}
                className={`px-3 py-1 font-mono-luxury text-xs uppercase font-bold border transition-colors cursor-pointer ${
                  currentCity === c
                    ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                    : 'bg-white text-[#1a1a1a]/70 border-[#1a1a1a]/20 hover:border-black'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {primeLocalities.map((item) => (
            <div
              key={`${item.city}-${item.locality}`}
              onClick={() => onSelectLocality(item.locality, item.city)}
              className="bg-white border border-[#1a1a1a]/20 hover:border-[#1a1a1a] p-4 transition-all cursor-pointer group shadow-xs hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono-luxury uppercase text-[#c4a47c] font-bold block">
                    {item.city}
                  </span>
                  <h3 className="font-serif-luxury text-base font-bold text-[#1a1a1a] group-hover:text-[#005CA8] transition-colors">
                    {item.locality}
                  </h3>
                </div>
                <span className="text-[10px] font-mono-luxury font-bold bg-[#1a1a1a]/5 text-[#1a1a1a] px-2 py-0.5">
                  {item.count} Listings
                </span>
              </div>

              <p className="font-mono-luxury text-xs text-[#1a1a1a]/60 mt-2">
                {item.highlight}
              </p>

              <div className="mt-3 pt-2 border-t border-[#1a1a1a]/15 flex items-center justify-between text-xs font-mono-luxury">
                <span className="text-[#1a1a1a]/80 font-bold">{item.avgPrice}</span>
                <span className="text-[#c4a47c] group-hover:translate-x-1 transition-transform flex items-center gap-0.5 font-bold">
                  Explore <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 4. PROPERTIES BY BUDGET
// ==========================================
interface PropertiesByBudgetProps {
  onSelectBudget: (min: number, max: number, label: string) => void;
  activeBudgetLabel?: string;
}

export const PropertiesByBudget: React.FC<PropertiesByBudgetProps> = ({
  onSelectBudget,
  activeBudgetLabel
}) => {
  const budgetTiers = [
    {
      id: 'under_50l',
      label: 'Under ₹ 50 Lakhs',
      subtitle: 'Starter Homes & Compact Apartments',
      rangeDisplay: '₹ 15 L - ₹ 50 Lakhs',
      min: 0,
      max: 5000000,
      badge: 'Affordable Living'
    },
    {
      id: '50l_to_1cr',
      label: '₹ 50 L – ₹ 1.0 Crore',
      subtitle: 'Family 2 & 3 BHK City Homes',
      rangeDisplay: '₹ 50 L - ₹ 1.0 Crore',
      min: 5000000,
      max: 10000000,
      badge: 'Most Popular'
    },
    {
      id: '1cr_to_2_5cr',
      label: '₹ 1.0 Cr – ₹ 2.5 Crore',
      subtitle: 'Premium High-Rise & Townhouses',
      rangeDisplay: '₹ 1.0 Cr - ₹ 2.5 Crore',
      min: 10000000,
      max: 25000000,
      badge: 'Luxury Living'
    },
    {
      id: 'luxury_2_5cr_plus',
      label: '₹ 2.50 Crore & Above',
      subtitle: 'Ultra-Luxury Penthouses, Villas & Commercial',
      rangeDisplay: '₹ 2.50 Cr - ₹ 15+ Crore',
      min: 25000000,
      max: 0, // no max limit
      badge: 'Ultra Luxury'
    }
  ];

  return (
    <section className="py-8 bg-white border-b border-[#1a1a1a]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-[#c4a47c]" />
            <span className="font-mono-luxury text-xs text-[#c4a47c] font-bold uppercase tracking-wider">
              Tailored Financial Brackets
            </span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1a1a1a] mt-1">
            Properties by Budget
          </h2>
          <p className="font-mono-luxury text-xs text-[#1a1a1a]/60 mt-1">
            Instant filtering tailored to your investment bracket with verified EMI-friendly properties.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {budgetTiers.map((tier) => {
            const isSelected = activeBudgetLabel === tier.label;

            return (
              <div
                key={tier.id}
                onClick={() => onSelectBudget(tier.min, tier.max, tier.label)}
                className={`p-4 border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white shadow-lg'
                    : 'border-[#1a1a1a]/20 bg-[#fdfcf9] hover:border-[#1a1a1a] text-[#1a1a1a]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-mono-luxury font-bold uppercase px-2 py-0.5 border ${
                      isSelected
                        ? 'bg-[#c4a47c] text-black border-[#c4a47c]'
                        : 'bg-white text-[#1a1a1a]/70 border-[#1a1a1a]/20'
                    }`}>
                      {tier.badge}
                    </span>
                    <IndianRupee className={`w-4 h-4 ${isSelected ? 'text-[#c4a47c]' : 'text-gray-400'}`} />
                  </div>

                  <h3 className={`font-serif-luxury text-lg font-bold ${
                    isSelected ? 'text-white' : 'text-[#1a1a1a]'
                  }`}>
                    {tier.label}
                  </h3>

                  <p className={`font-mono-luxury text-xs mt-1 leading-relaxed ${
                    isSelected ? 'text-white/80' : 'text-[#1a1a1a]/60'
                  }`}>
                    {tier.subtitle}
                  </p>
                </div>

                <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-mono-luxury ${
                  isSelected ? 'border-white/20' : 'border-[#1a1a1a]/15'
                }`}>
                  <span className={isSelected ? 'text-[#c4a47c] font-bold' : 'text-[#1a1a1a]/70'}>
                    Filter Bracket
                  </span>
                  <span className="font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Listings →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 5. CONTACT NS PROPERTIES BANNER
// ==========================================
interface ContactBannerProps {
  onOpenContactModal: () => void;
}

export const ContactNSPropertiesBanner: React.FC<ContactBannerProps> = ({
  onOpenContactModal
}) => {
  const handleDirectWhatsApp = () => {
    const text = `Hello NS Properties Team, I am browsing your property listings and would like to speak to an expert advisor.`;
    openWhatsAppChat(DEFAULT_CONTACT_PHONE, text);
  };

  return (
    <section className="bg-[#1a1a1a] text-[#fdfcf9] py-8 sm:py-10 border-y-2 border-[#c4a47c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#c4a47c]/20 border border-[#c4a47c]/40 px-2.5 py-0.5 font-mono-luxury text-xs text-[#c4a47c] font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Contact NS Properties</span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Looking for Your Dream Property or Planning to Sell?
            </h2>
            <p className="font-mono-luxury text-xs text-white/70 max-w-2xl leading-relaxed">
              Connect directly with verified NS Properties advisors. Get honest valuation reports, zero brokerage on select builder launches, and 100% legal title assistance.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 font-mono-luxury text-xs">
            <button
              onClick={onOpenContactModal}
              className="px-5 py-3 bg-[#c4a47c] hover:bg-[#b09066] text-black font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-md"
            >
              <Phone className="w-4 h-4 text-black" />
              <span>Contact NS Properties</span>
            </button>

            <button
              onClick={handleDirectWhatsApp}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-md"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
