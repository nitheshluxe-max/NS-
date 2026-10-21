import React from 'react';
import { Search, Building, IndianRupee } from 'lucide-react';
import { PropertyPurpose, PropertyCategory, PropertyType } from '../types';

interface HeroSearchProps {
  purpose: PropertyPurpose;
  onSelectPurpose: (purpose: PropertyPurpose) => void;
  category: PropertyCategory;
  onSelectCategory: (category: PropertyCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedBhk: number[];
  onToggleBhk: (bhk: number) => void;
  budgetMax: number;
  onSelectBudgetMax: (val: number) => void;
  propertyType: PropertyType | 'all';
  onSelectPropertyType: (type: PropertyType | 'all') => void;
  onSearchSubmit: () => void;
  totalResultsCount: number;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  purpose,
  onSelectPurpose,
  category,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedBhk,
  onToggleBhk,
  budgetMax,
  onSelectBudgetMax,
  propertyType,
  onSelectPropertyType,
  onSearchSubmit,
  totalResultsCount
}) => {
  const popularTags = [
    { label: 'Ready to Move', action: () => onSearchChange('Ready to Move') },
    { label: 'Owner (No Brokerage)', action: () => onSearchChange('Owner') },
    { label: 'Godrej Splendour Whitefield', action: () => onSearchChange('Whitefield') },
    { label: 'Sea View Mumbai', action: () => onSearchChange('Worli') },
    { label: 'Golf Course Gurgaon', action: () => onSearchChange('Golf Course') },
    { label: 'Gated Plots', action: () => { onSelectCategory('plots'); onSearchChange(''); } }
  ];

  const budgetOptionsBuy = [
    { label: 'Any Budget', value: 0 },
    { label: 'Up to ₹ 50 Lakhs', value: 5000000 },
    { label: 'Up to ₹ 1.0 Crore', value: 10000000 },
    { label: 'Up to ₹ 2.0 Crores', value: 20000000 },
    { label: 'Up to ₹ 5.0 Crores', value: 50000000 },
    { label: 'Up to ₹ 15+ Crores', value: 200000000 }
  ];

  const budgetOptionsRent = [
    { label: 'Any Rent', value: 0 },
    { label: 'Up to ₹ 25,000 / mo', value: 25000 },
    { label: 'Up to ₹ 50,000 / mo', value: 50000 },
    { label: 'Up to ₹ 1.0 Lakh / mo', value: 100000 },
    { label: 'Up to ₹ 2.0 Lakhs+ / mo', value: 300000 }
  ];

  const currentBudgetOptions = purpose === 'rent' ? budgetOptionsRent : budgetOptionsBuy;

  return (
    <section className="bg-[#fdfcf9] border-b-[1.5px] border-[#1a1a1a] px-3 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
        {/* Left Column: Editorial Headline */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <span className="editorial-label text-slate-500 mb-2 font-semibold tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c4a47c]"></span>
            <span>The Curated Collection</span>
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1a1a1a] font-normal leading-[1.08] tracking-tight mb-3 sm:mb-4">
            Find Your Dream Home <br />
            <span className="text-[#0047E0] font-normal">on NS Properties</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-normal max-w-xl leading-relaxed mb-4 sm:mb-6">
            Browse verified flats, luxury villas, gated plots, and commercial spaces with direct owner &amp; builder contacts across India.
          </p>

          {/* Purpose & Category selector */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 pt-2 border-t border-[#1a1a1a]/10">
            <button
              onClick={() => {
                onSelectPurpose('buy');
                onSelectCategory('residential');
              }}
              className={`px-3.5 py-2 sm:py-2 text-xs font-semibold rounded-xs transition-all cursor-pointer flex items-center justify-center ${
                purpose === 'buy' && category === 'residential'
                  ? 'bg-[#1a1a1a] text-[#fdfcf9] shadow-xs'
                  : 'bg-white text-slate-700 hover:text-black border border-slate-300 hover:border-black'
              }`}
            >
              Buy Homes
            </button>
            <button
              onClick={() => {
                onSelectPurpose('rent');
                onSelectCategory('residential');
              }}
              className={`px-3.5 py-2 sm:py-2 text-xs font-semibold rounded-xs transition-all cursor-pointer flex items-center justify-center ${
                purpose === 'rent' && category === 'residential'
                  ? 'bg-[#1a1a1a] text-[#fdfcf9] shadow-xs'
                  : 'bg-white text-slate-700 hover:text-black border border-slate-300 hover:border-black'
              }`}
            >
              Rent Homes
            </button>
            <button
              onClick={() => onSelectCategory('commercial')}
              className={`px-3.5 py-2 sm:py-2 text-xs font-semibold rounded-xs transition-all cursor-pointer flex items-center justify-center ${
                category === 'commercial'
                  ? 'bg-[#1a1a1a] text-[#fdfcf9] shadow-xs'
                  : 'bg-white text-slate-700 hover:text-black border border-slate-300 hover:border-black'
              }`}
            >
              Commercial
            </button>
            <button
              onClick={() => {
                onSelectCategory('plots');
                onSelectPurpose('buy');
              }}
              className={`px-3.5 py-2 sm:py-2 text-xs font-semibold rounded-xs transition-all cursor-pointer flex items-center justify-center ${
                category === 'plots'
                  ? 'bg-[#1a1a1a] text-[#fdfcf9] shadow-xs'
                  : 'bg-white text-slate-700 hover:text-black border border-slate-300 hover:border-black'
              }`}
            >
              Plots / Land
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-1.5">
            <span className="editorial-label text-[#1a1a1a]/50 text-[10px]">Curated:</span>
            {popularTags.map((tag, idx) => (
              <button
                key={idx}
                onClick={tag.action}
                className="text-[11px] text-[#1a1a1a]/80 hover:text-[#1a1a1a] underline underline-offset-2 decoration-[#1a1a1a]/20 hover:decoration-[#1a1a1a] mr-2 cursor-pointer transition-colors"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Sleek Luxury Search Box */}
        <div className="lg:col-span-5 bg-white border border-slate-300 p-5 sm:p-6 shadow-xs rounded-xs w-full">
          <div className="space-y-4">
            {/* Search query */}
            <div className="border-b border-slate-200 pb-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Search Locality or Project
              </span>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Locality, Project or Landmark..."
                  className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden font-normal"
                />
              </div>
            </div>

            {/* Type & Budget grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="border-b border-slate-200 pb-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Property Type
                </span>
                <select
                  value={propertyType}
                  onChange={(e) => onSelectPropertyType(e.target.value as any)}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 focus:outline-hidden cursor-pointer font-normal"
                >
                  <option value="all">All Property Types</option>
                  <option value="apartment">Apartments / Flats</option>
                  <option value="villa">Independent Villa</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="plot">Residential Plot</option>
                  <option value="commercial-office">Office Space</option>
                </select>
              </div>

              <div className="border-b border-slate-200 pb-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Budget
                </span>
                <select
                  value={budgetMax}
                  onChange={(e) => onSelectBudgetMax(Number(e.target.value))}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 focus:outline-hidden cursor-pointer font-normal"
                >
                  {currentBudgetOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* BHK Badges Selector */}
            {category === 'residential' && (
              <div className="pt-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Select Bedrooms (BHK)
                </span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((bhk) => {
                    const isSelected = selectedBhk.includes(bhk);
                    return (
                      <button
                        key={bhk}
                        type="button"
                        onClick={() => onToggleBhk(bhk)}
                        className={`cursor-pointer transition-all flex-1 min-w-[50px] sm:flex-initial py-2 px-2.5 sm:px-3 text-center flex items-center justify-center font-semibold text-xs rounded-xs border ${
                          isSelected
                            ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-black'
                        }`}
                      >
                        {bhk === 5 ? '5+ BHK' : `${bhk} BHK`}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Search Submit Button */}
            <button
              onClick={onSearchSubmit}
              className="w-full mt-2 py-3 px-4 min-h-[44px] bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-semibold text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border border-[#1a1a1a] shadow-xs rounded-xs"
            >
              <Search className="w-3.5 h-3.5 text-[#c4a47c]" />
              <span>Search Properties</span>
              <span className="text-[#c4a47c] font-bold">({totalResultsCount})</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
