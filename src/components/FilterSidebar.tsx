import React from 'react';
import { 
  RotateCcw, 
  Filter, 
  X, 
  Check
} from 'lucide-react';
import { FilterState, PostedBy, FurnishingStatus, PossessionStatus } from '../types';

interface FilterSidebarProps {
  filters: FilterState;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  totalMatches: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  isOpenMobile,
  onCloseMobile,
  totalMatches
}) => {
  const postedByOptions: PostedBy[] = ['Owner', 'Builder', 'Certified Agent'];
  const furnishingOptions: FurnishingStatus[] = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
  const possessionOptions: PossessionStatus[] = [
    'Ready to Move',
    'Within 3 Months',
    'Under Construction (2026)',
    'Under Construction (2027)'
  ];

  const popularAmenities = [
    'Swimming Pool',
    'Clubhouse',
    '24/7 Security & CCTV',
    '100% Power Backup',
    'Equipped Gym',
    'EV Charging Stations',
    'Kids Play Arena',
    'Covered Car Parking'
  ];

  const toggleArrayItem = <T,>(arr: T[], item: T): T[] => {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
  };

  const activeFiltersCount = 
    (filters.verifiedOnly ? 1 : 0) +
    filters.postedBy.length +
    filters.possession.length +
    filters.furnishing.length +
    filters.selectedAmenities.length +
    filters.bhk.length;

  const content = (
    <div className="space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#1a1a1a]" />
          <span className="editorial-label text-[#1a1a1a] font-bold">
            Filters Applied ({activeFiltersCount})
          </span>
        </div>
        <button
          onClick={onResetFilters}
          className="editorial-label text-[10px] text-[#1a1a1a]/60 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Verified Status Box */}
      <div 
        onClick={() => onUpdateFilters({ verifiedOnly: !filters.verifiedOnly })}
        className={`p-3 border transition-all cursor-pointer select-none ${
          filters.verifiedOnly 
            ? 'bg-[#1a1a1a] text-[#fdfcf9] border-[#1a1a1a]' 
            : 'bg-[#1a1a1a]/5 text-[#1a1a1a] border-transparent hover:border-[#1a1a1a]/20'
        }`}
      >
        <span className="editorial-label text-[10px] block opacity-70 mb-1">
          Verified Status
        </span>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-mono-luxury">RERA Approved Only</span>
          <div className={`w-4 h-4 border flex items-center justify-center ${
            filters.verifiedOnly ? 'bg-[#c4a47c] border-[#c4a47c] text-[#1a1a1a]' : 'border-[#1a1a1a]/40'
          }`}>
            {filters.verifiedOnly && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        </div>
      </div>

      {/* Posted By */}
      <div className="space-y-2">
        <span className="editorial-label text-[#1a1a1a]/70 block">
          Posted By
        </span>
        <div className="flex flex-col gap-2 text-xs">
          {postedByOptions.map((type) => {
            const isChecked = filters.postedBy.includes(type);
            return (
              <label 
                key={type}
                className="flex items-center gap-2 cursor-pointer select-none hover:text-[#c4a47c] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => 
                    onUpdateFilters({ postedBy: toggleArrayItem(filters.postedBy, type) })
                  }
                  className="w-3.5 h-3.5 accent-[#1a1a1a] cursor-pointer"
                />
                <span className="font-medium text-slate-800">
                  {type === 'Owner' ? 'Owner (No Brokerage)' : type}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Possession */}
      <div className="space-y-2 pt-3 border-t border-[#1a1a1a]/10">
        <span className="editorial-label text-[#1a1a1a]/70 block">
          Possession
        </span>
        <div className="flex flex-col gap-2 text-xs">
          {possessionOptions.map((pos) => {
            const isChecked = filters.possession.includes(pos);
            return (
              <label 
                key={pos}
                className="flex items-center gap-2 cursor-pointer select-none hover:text-[#c4a47c] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => 
                    onUpdateFilters({ possession: toggleArrayItem(filters.possession, pos) })
                  }
                  className="w-3.5 h-3.5 accent-[#1a1a1a] cursor-pointer"
                />
                <span className="font-medium text-slate-800">{pos}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Furnishing */}
      <div className="space-y-2 pt-3 border-t border-[#1a1a1a]/10">
        <span className="editorial-label text-[#1a1a1a]/70 block">
          Furnishing
        </span>
        <div className="flex flex-col gap-2 text-xs">
          {furnishingOptions.map((furn) => {
            const isChecked = filters.furnishing.includes(furn);
            return (
              <label 
                key={furn}
                className="flex items-center gap-2 cursor-pointer select-none hover:text-[#c4a47c] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => 
                    onUpdateFilters({ furnishing: toggleArrayItem(filters.furnishing, furn) })
                  }
                  className="w-3.5 h-3.5 accent-[#1a1a1a] cursor-pointer"
                />
                <span className="font-medium text-slate-800">{furn}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Popular Amenities */}
      <div className="space-y-2 pt-3 border-t border-[#1a1a1a]/10">
        <span className="editorial-label text-[#1a1a1a]/70 block">
          Popular Amenities
        </span>
        <div className="grid gap-2 text-xs">
          {popularAmenities.map((amenity) => {
            const isChecked = filters.selectedAmenities.includes(amenity);
            return (
              <label 
                key={amenity}
                className="flex items-center gap-2 cursor-pointer select-none hover:text-[#c4a47c] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => 
                    onUpdateFilters({ 
                      selectedAmenities: toggleArrayItem(filters.selectedAmenities, amenity) 
                    })
                  }
                  className="w-3.5 h-3.5 accent-[#1a1a1a] cursor-pointer"
                />
                <span className="font-medium text-slate-800">{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Aside Sidebar (matches variation aside style) */}
      <aside className="hidden lg:block w-72 shrink-0 border-r-[1.5px] border-[#1a1a1a] pr-6 py-2 sticky top-28 h-[calc(100vh-8rem)] overflow-y-auto">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
            onClick={onCloseMobile} 
          />
          <div className="relative ml-auto w-full max-w-xs bg-[#fdfcf9] border-l-[1.5px] border-[#1a1a1a] h-full p-5 overflow-y-auto flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1a1a1a]">
                <span className="editorial-label font-bold text-[#1a1a1a]">Filters</span>
                <button
                  onClick={onCloseMobile}
                  className="p-1 border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-4 mt-6 border-t border-[#1a1a1a]">
              <button
                onClick={onCloseMobile}
                className="w-full py-3 bg-[#1a1a1a] text-[#fdfcf9] font-mono-luxury uppercase text-xs font-bold tracking-wider cursor-pointer"
              >
                View {totalMatches} Properties
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
