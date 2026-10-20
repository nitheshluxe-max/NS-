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
          <span className="editorial-label text-[#1a1a1a]/60 mb-2">
            The Curated Collection
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1a1a1a] font-normal leading-[1.05] sm:leading-[0.95] tracking-tight mb-3 sm:mb-4">
            Find Your Dream Home <br />
            <span className="italic font-light">on NS Properties</span>
          </h1>
          <p className="text-xs sm:text-base text-[#1a1a1a]/70 font-light max-w-xl leading-relaxed mb-4 sm:mb-6">
            Browse verified flats, luxury villas, gated plots, and commercial spaces with direct owner & builder contacts across India.
          </p>

          {/* Purpose & Category selector */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 pt-2 border-t border-[#1a1a1a]/10">
            <button
              onClick={() => {
                onSelectPurpose('buy');
                onSelectCategory('residential');
              }}
              className={`editorial-label px-3 sm:px-3.5 py-2 sm:py-1.5 text-center transition-all cursor-pointer flex items-center justify-center ${
                purpose === 'buy' && category === 'residential'
                  ? 'bg-[#1a1a1a] text-[#fdfcf9] font-bold'
                  : 'bg-transparent text-[#1a1a1a] hover:bg-[#1a1a1a]/5 border border-[#1a1a1a]/20'
              }`}
            >
              Buy Homes
            </button>
            <button
              onClick={() => {
                onSelectPurpose('rent');
                onSelectCategory('residential');
              }}
              className={`editorial-label px-3 sm:px-3.5 py-2 sm:py-1.5 text-center transition-all cursor-pointer flex items-center justify-center ${
                purpose === 'rent' && category === 'residential'
                  ? 'bg-[#1a1a1a] text-[#fdfcf9] font-bold'
                  : 'bg-transparent text-[#1a1a1a] hover:bg-[#1a1a1a]/5 border border-[#1a1a1a]/20'
              }`}
            >
              Rent Homes
            </button>
            <button
              onClick={() => onSelectCategory('commercial')}
              className={`editorial-label px-3 sm:px-3.5 py-2 sm:py-1.5 text-center transition-all cursor-pointer flex items-center justify-center ${
                category === 'commercial'
                  ? 'bg-[#1a1a1a] text-[#fdfcf9] font-bold'
                  : 'bg-transparent text-[#1a1a1a] hover:bg-[#1a1a1a]/5 border border-[#1a1a1a]/20'
              }`}
            >
              Commercial
            </button>
            <button
              onClick={() => {
                onSelectCategory('plots');
                onSelectPurpose('buy');
              }}
              className={`editorial-label px-3 sm:px-3.5 py-2 sm:py-1.5 text-center transition-all cursor-pointer flex items-center justify-center ${
                category === 'plots'
                  ? 'bg-[#1a1a1a] text-[#fdfcf9] font-bold'
                  : 'bg-transparent text-[#1a1a1a] hover:bg-[#1a1a1a]/5 border border-[#1a1a1a]/20'
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

        {/* Right Column: Variation 2 Styled Search Box */}
        <div className="lg:col-span-5 bg-[#fdfcf9] border-[1.5px] border-[#1a1a1a] p-4 sm:p-6 shadow-xs w-full">
          <div className="space-y-4">
            {/* Search query */}
            <div className="border-b border-[#1a1a1a]/20 pb-2">
              <span className="editorial-label text-[#1a1a1a]/60 block mb-1">
                Search Locality or Project
              </span>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#1a1a1a]/40 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Locality, Project or Landmark..."
                  className="w-full bg-transparent text-sm text-[#1a1a1a] placeholder-[#1a1a1a]/40 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Type & Budget grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="border-b border-[#1a1a1a]/20 pb-2">
                <span className="editorial-label text-[#1a1a1a]/60 block mb-1">
                  Type
                </span>
                <select
                  value={propertyType}
                  onChange={(e) => onSelectPropertyType(e.target.value as any)}
                  className="w-full bg-transparent text-xs sm:text-sm text-[#1a1a1a] focus:outline-hidden cursor-pointer"
                >
                  <option value="all">All Property Types</option>
                  <option value="apartment">Apartments / Flats</option>
                  <option value="villa">Independent Villa</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="plot">Residential Plot</option>
                  <option value="commercial-office">Office Space</option>
                </select>
              </div>

              <div className="border-b border-[#1a1a1a]/20 pb-2">
                <span className="editorial-label text-[#1a1a1a]/60 block mb-1">
                  Budget
                </span>
                <select
                  value={budgetMax}
                  onChange={(e) => onSelectBudgetMax(Number(e.target.value))}
                  className="w-full bg-transparent text-xs sm:text-sm text-[#1a1a1a] focus:outline-hidden cursor-pointer"
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
                <span className="editorial-label text-[#1a1a1a]/60 block mb-2">
                  Select BHK
                </span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((bhk) => {
                    const isSelected = selectedBhk.includes(bhk);
                    return (
                      <button
                        key={bhk}
                        type="button"
                        onClick={() => onToggleBhk(bhk)}
                        className={`editorial-badge cursor-pointer transition-all flex-1 min-w-[50px] sm:flex-initial py-2 px-2.5 sm:px-3 text-center flex items-center justify-center font-bold text-xs ${
                          isSelected
                            ? 'bg-[#1a1a1a] text-[#fdfcf9] font-bold border-[#1a1a1a]'
                            : 'bg-transparent text-[#1a1a1a] border-[#1a1a1a]/30 hover:border-[#1a1a1a]'
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
              className="w-full mt-2 py-3 px-4 min-h-[44px] bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-mono-luxury uppercase text-xs font-bold tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 border border-[#1a1a1a] shadow-sm"
            >
              <span>Search Properties</span>
              <span className="text-[#c4a47c] font-mono">({totalResultsCount})</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
