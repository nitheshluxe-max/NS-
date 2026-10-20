import React, { useState } from 'react';
import { X, Calculator, IndianRupee, PieChart, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { calculateEMI, formatIndianCurrency } from '../utils/formatters';

interface EmiCalculatorModalProps {
  onClose: () => void;
}

export const EmiCalculatorModal: React.FC<EmiCalculatorModalProps> = ({ onClose }) => {
  const [loanAmount, setLoanAmount] = useState<number>(7500000); // 75 Lakhs
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState<number>(20); // 20 years

  const { monthlyEMI, totalInterest, totalPayment } = calculateEMI(loanAmount, interestRate, tenureYears);

  const principalPercent = totalPayment > 0 ? Math.round((loanAmount / totalPayment) * 100) : 50;
  const interestPercent = 100 - principalPercent;

  const bankRates = [
    { bank: 'State Bank of India (SBI)', rate: '8.40% - 9.15%', maxTenure: '30 Yrs', processing: '0.35%' },
    { bank: 'HDFC Bank', rate: '8.50% - 9.40%', maxTenure: '30 Yrs', processing: '0.50%' },
    { bank: 'ICICI Bank', rate: '8.60% - 9.50%', maxTenure: '30 Yrs', processing: '0.50%' },
    { bank: 'Axis Bank', rate: '8.75% - 9.60%', maxTenure: '30 Yrs', processing: '0.40%' }
  ];

  const [submittedLoanLead, setSubmittedLoanLead] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#fdfcf9] border-[1.5px] border-[#1a1a1a] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-[#1a1a1a] gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 border border-[#c4a47c] flex items-center justify-center text-[#c4a47c] shrink-0">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-serif-luxury text-lg sm:text-xl font-bold truncate">Mortgage & EMI Estimator</h2>
              <p className="editorial-label text-[#fdfcf9]/70 text-[10px] sm:text-xs normal-case truncate">Private financial modeling & verified banking partners</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-white/20 hover:border-white text-white cursor-pointer transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 bg-[#fdfcf9]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Sliders Column */}
            <div className="md:col-span-7 space-y-5">
              {/* Loan Amount */}
              <div className="bg-white p-4 border border-[#1a1a1a]">
                <div className="flex justify-between items-center mb-2">
                  <span className="editorial-label text-[#1a1a1a] font-bold">Estimated Principal</span>
                  <span className="font-mono-luxury text-xs font-bold text-[#1a1a1a] bg-[#fdfcf9] px-2.5 py-1 border border-[#1a1a1a]">
                    {formatIndianCurrency(loanAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={50000000}
                  step={100000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-[#1a1a1a] cursor-pointer"
                />
                <div className="flex justify-between font-mono-luxury text-[10px] text-[#1a1a1a]/50 mt-1">
                  <span>₹ 5 Lakh</span>
                  <span>₹ 5 Crore</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="bg-white p-4 border border-[#1a1a1a]">
                <div className="flex justify-between items-center mb-2">
                  <span className="editorial-label text-[#1a1a1a] font-bold">Annual Interest Rate</span>
                  <span className="font-mono-luxury text-xs font-bold text-[#1a1a1a] bg-[#fdfcf9] px-2.5 py-1 border border-[#1a1a1a]">
                    {interestRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min={6.5}
                  max={15.0}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-[#1a1a1a] cursor-pointer"
                />
                <div className="flex justify-between font-mono-luxury text-[10px] text-[#1a1a1a]/50 mt-1">
                  <span>6.5%</span>
                  <span>15%</span>
                </div>
              </div>

              {/* Tenure */}
              <div className="bg-white p-4 border border-[#1a1a1a]">
                <div className="flex justify-between items-center mb-2">
                  <span className="editorial-label text-[#1a1a1a] font-bold">Loan Duration</span>
                  <span className="font-mono-luxury text-xs font-bold text-[#1a1a1a] bg-[#fdfcf9] px-2.5 py-1 border border-[#1a1a1a]">
                    {tenureYears} Years ({tenureYears * 12} Months)
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-[#1a1a1a] cursor-pointer"
                />
                <div className="flex justify-between font-mono-luxury text-[10px] text-[#1a1a1a]/50 mt-1">
                  <span>1 Year</span>
                  <span>30 Years</span>
                </div>
              </div>
            </div>

            {/* Results Column */}
            <div className="md:col-span-5 flex flex-col justify-between bg-white p-5 border border-[#1a1a1a]">
              <div>
                <span className="editorial-label text-[#1a1a1a]/70 block font-bold">
                  Estimated Monthly Outflow
                </span>
                <div className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1a1a1a] mt-1">
                  {formatIndianCurrency(monthlyEMI)}
                  <span className="font-mono-luxury text-xs text-[#1a1a1a]/60 font-normal"> / mo</span>
                </div>

                <div className="mt-6 space-y-2.5 font-mono-luxury text-xs">
                  <div className="flex justify-between pb-2 border-b border-[#1a1a1a]/10">
                    <span className="text-[#1a1a1a]/70">Principal</span>
                    <span className="font-bold text-[#1a1a1a]">{formatIndianCurrency(loanAmount)}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-[#1a1a1a]/10">
                    <span className="text-[#1a1a1a]/70">Total Interest</span>
                    <span className="font-bold text-[#c4a47c]">{formatIndianCurrency(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-[#1a1a1a]/10">
                    <span className="text-[#1a1a1a] font-bold">Total Payment</span>
                    <span className="font-bold text-[#1a1a1a]">{formatIndianCurrency(totalPayment)}</span>
                  </div>
                </div>

                {/* Progress Visualizer */}
                <div className="mt-5">
                  <div className="flex justify-between font-mono-luxury text-[10px] text-[#1a1a1a]/70 mb-1">
                    <span>Principal ({principalPercent}%)</span>
                    <span>Interest ({interestPercent}%)</span>
                  </div>
                  <div className="w-full h-3 bg-[#c4a47c] border border-[#1a1a1a] overflow-hidden flex">
                    <div 
                      className="bg-[#1a1a1a] h-full transition-all duration-300"
                      style={{ width: `${principalPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-[#1a1a1a]/10">
                {submittedLoanLead ? (
                  <div className="p-3 bg-[#e2f4ea] text-[#1e4620] border border-[#1e4620] text-center font-mono-luxury text-xs">
                    Inquiry submitted. Our concierge will share customized offers.
                  </div>
                ) : (
                  <button
                    onClick={() => setSubmittedLoanLead(true)}
                    className="w-full py-3 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-mono-luxury uppercase text-xs font-bold transition-colors cursor-pointer border border-[#1a1a1a]"
                  >
                    Request Pre-Approved Offers
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Top Indian Partner Banks */}
          <div>
            <h3 className="editorial-label text-[#1a1a1a] font-bold mb-3">
              Institutional Mortgage Benchmarks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-luxury">
              {bankRates.map((b, i) => (
                <div key={i} className="p-3 bg-white border border-[#1a1a1a] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1a1a1a] block">{b.bank}</span>
                    <span className="text-[10px] text-[#1a1a1a]/60">Processing: {b.processing}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-800 block">{b.rate}</span>
                    <span className="text-[10px] text-[#1a1a1a]/50">Max: {b.maxTenure}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
