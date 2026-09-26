import React from 'react';
import { X, TrendingUp, ArrowUpRight, Building, CheckCircle2 } from 'lucide-react';
import { LOCALITY_TRENDS } from '../data/properties';

interface MarketTrendsModalProps {
  onClose: () => void;
}

export const MarketTrendsModal: React.FC<MarketTrendsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#fdfcf9] border-[1.5px] border-[#1a1a1a] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] px-6 py-4 flex items-center justify-between border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[#c4a47c] flex items-center justify-center text-[#c4a47c]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-xl font-bold">Market Intelligence & Capital Appreciation</h2>
              <p className="editorial-label text-[#fdfcf9]/70 text-xs normal-case">Micro-market capital yield, rental index & infrastructure benchmarks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-white/20 hover:border-white text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-4 bg-[#fdfcf9]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LOCALITY_TRENDS.map((trend, idx) => (
              <div 
                key={idx}
                className="p-4 bg-white border border-[#1a1a1a] transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="editorial-badge bg-transparent border-[#1a1a1a]/20 text-[#1a1a1a]/60">
                      {trend.city}
                    </span>
                    <h3 className="font-serif-luxury text-lg font-bold text-[#1a1a1a] mt-1">{trend.locality}</h3>
                  </div>
                  <div className="flex items-center gap-1 bg-[#1a1a1a] text-[#c4a47c] px-2.5 py-1 text-xs font-mono-luxury font-bold border border-[#1a1a1a]">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    +{trend.yoyGrowth}% YoY
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 bg-[#fdfcf9] p-2.5 border border-[#1a1a1a] text-xs font-mono-luxury">
                  <div>
                    <span className="editorial-label text-[#1a1a1a]/60 block text-[10px]">Avg Price / Sq.Ft</span>
                    <span className="font-bold text-[#1a1a1a]">
                      ₹ {trend.avgPricePerSqFt.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="editorial-label text-[#1a1a1a]/60 block text-[10px]">Rental Yield</span>
                    <span className="font-bold text-[#1a1a1a]">{trend.rentYield}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="editorial-label text-[#1a1a1a] block mb-1 font-bold">
                    Appreciation Drivers:
                  </span>
                  <div className="flex flex-wrap gap-1 font-mono-luxury">
                    {trend.topFeatures.map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className="text-[10px] bg-white border border-[#1a1a1a]/30 text-[#1a1a1a] px-2 py-0.5"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#1a1a1a]/15 flex items-center justify-between text-[11px] font-mono-luxury text-[#1a1a1a]/70">
                  <span className="editorial-label normal-case text-[10px]">Landmark Assets:</span>
                  <span className="font-bold text-[#1a1a1a] truncate max-w-[200px]">
                    {trend.popularProjects.join(', ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
