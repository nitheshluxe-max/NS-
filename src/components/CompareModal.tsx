import React from 'react';
import { X, Check, Minus, Trash2, ArrowRight } from 'lucide-react';
import { Property } from '../types';

interface CompareModalProps {
  properties: Property[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  properties,
  onClose,
  onRemove,
  onSelectProperty
}) => {
  if (properties.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
        <div className="bg-[#fdfcf9] border-[1.5px] border-[#1a1a1a] p-6 max-w-md w-full text-center">
          <h3 className="font-serif-luxury text-xl font-bold text-[#1a1a1a]">No Properties Selected</h3>
          <p className="editorial-label text-[#1a1a1a]/60 text-xs normal-case mt-2 mb-5">
            Select "Compare" on any property card to view side-by-side analysis.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-mono-luxury text-xs font-bold uppercase cursor-pointer border border-[#1a1a1a]"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  const comparisonAttributes = [
    { label: 'Price', key: 'priceDisplay' },
    { label: 'Price / Sq.Ft', render: (p: Property) => `₹ ${p.pricePerSqFt.toLocaleString('en-IN')}` },
    { label: 'Configuration', render: (p: Property) => (p.bhk > 0 ? `${p.bhk} BHK` : p.type.toUpperCase()) },
    { label: 'Super Area', render: (p: Property) => `${p.areaSqFt} sq.ft` },
    { label: 'Carpet Area', render: (p: Property) => `${p.carpetAreaSqFt} sq.ft` },
    { label: 'City & Locality', render: (p: Property) => `${p.locality}, ${p.city}` },
    { label: 'Possession', key: 'possession' },
    { label: 'Furnishing', key: 'furnishing' },
    { label: 'Facing', key: 'facing' },
    { label: 'RERA Status', render: (p: Property) => (p.reraId ? 'RERA Approved' : 'Verified') },
    { label: 'Posted By', key: 'postedBy' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-[#fdfcf9] border-[1.5px] border-[#1a1a1a] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] px-6 py-4 flex items-center justify-between border-b border-[#1a1a1a]">
          <div>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold">Side-by-Side Property Comparison</h2>
            <p className="font-mono-luxury text-xs text-[#c4a47c]">Comparing {properties.length} selected properties</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-[#fdfcf9]/30 hover:border-white text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto p-4 sm:p-6">
          <div className="min-w-[650px]">
            {/* Top Cards Row */}
            <div className="grid grid-cols-4 gap-4 pb-4 border-b border-[#1a1a1a]">
              <div className="editorial-label font-bold text-xs text-[#1a1a1a]/60 uppercase tracking-wider flex items-end">
                Property Specifications
              </div>
              {properties.map((p) => (
                <div key={p.id} className="relative bg-[#fdfcf9] border border-[#1a1a1a] p-3 flex flex-col">
                  <button
                    onClick={() => onRemove(p.id)}
                    className="absolute top-2 right-2 p-1 text-[#1a1a1a] hover:text-red-600 bg-[#fdfcf9] border border-[#1a1a1a] cursor-pointer"
                    title="Remove from comparison"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-full h-24 object-cover mb-2 border border-[#1a1a1a]/30 cursor-pointer"
                    onClick={() => onSelectProperty(p)}
                  />
                  <h4 
                    onClick={() => onSelectProperty(p)}
                    className="font-serif-luxury text-sm font-bold text-[#1a1a1a] hover:text-[#c4a47c] cursor-pointer line-clamp-1"
                  >
                    {p.title}
                  </h4>
                  <span className="font-mono-luxury text-xs font-bold text-[#1a1a1a] mt-1">{p.priceDisplay}</span>
                  <button
                    onClick={() => onSelectProperty(p)}
                    className="mt-2 w-full py-1.5 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] border border-[#1a1a1a] text-[10px] font-mono-luxury font-bold uppercase transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {/* Spec rows */}
            <div className="divide-y divide-[#1a1a1a]/10 text-xs">
              {comparisonAttributes.map((attr, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-4 py-3 items-center">
                  <div className="editorial-label text-[#1a1a1a]/70 font-semibold">{attr.label}</div>
                  {properties.map((p) => (
                    <div key={p.id} className="font-mono-luxury text-xs font-bold text-[#1a1a1a]">
                      {attr.render ? attr.render(p) : ((p as any)[attr.key!] || '-')}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
