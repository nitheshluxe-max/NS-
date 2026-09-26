import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Phone, 
  Mail, 
  User, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Building
} from 'lucide-react';
import { Property, VisitorLead } from '../types';

interface UnlockOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  dailyViewsUsed: number;
  dailyLimit: number;
  onSuccessUnlock: (clientInfo: { name: string; phone: string; email: string }) => void;
}

export const UnlockOwnerModal: React.FC<UnlockOwnerModalProps> = ({
  isOpen,
  onClose,
  property,
  dailyViewsUsed,
  dailyLimit,
  onSuccessUnlock
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const isLimitReached = dailyViewsUsed >= dailyLimit;
  const remainingToday = Math.max(0, dailyLimit - dailyViewsUsed);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isLimitReached) {
      setErrorMessage(`Daily limit reached (${dailyLimit}/${dailyLimit}). Please come back tomorrow or connect with NS Properties support.`);
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    onSuccessUnlock({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase()
    });
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-[#fdfcf9] border-[1.5px] border-[#1a1a1a] shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] p-5 relative border-b border-[#1a1a1a]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 border border-white/20 hover:border-white text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="editorial-badge bg-[#c4a47c] text-[#1a1a1a] border-0 mb-2">
            Verified Owner Contact Pass
          </span>

          <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-tight">
            Unlock Seller & Owner Direct Contact
          </h3>
          <p className="editorial-label text-[#fdfcf9]/70 text-xs normal-case mt-1 line-clamp-1">
            {property.title}
          </p>
        </div>

        {/* Daily Quota Tracker Bar */}
        <div className="bg-[#fdfcf9] border-b border-[#1a1a1a] px-5 py-2.5 flex items-center justify-between font-mono-luxury text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#1a1a1a]">
            <Lock className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span>Daily Contact Limit:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 font-bold text-xs ${
              isLimitReached 
                ? 'bg-red-100 text-red-700 border border-red-300' 
                : 'bg-[#e2f4ea] text-[#1e4620] border border-[#1e4620]'
            }`}>
              {dailyViewsUsed} / {dailyLimit} Used
            </span>
            <span className="editorial-label text-[#1a1a1a]/60 text-[10px]">
              ({remainingToday} left today)
            </span>
          </div>
        </div>

        {isLimitReached ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 text-red-600 flex items-center justify-center mx-auto border border-red-300">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-serif-luxury text-xl font-bold text-[#1a1a1a]">
                Daily Limit Reached (10/10 Contacts)
              </h4>
              <p className="editorial-label text-[#1a1a1a]/70 normal-case text-xs mt-1.5 leading-relaxed">
                To safeguard sellers and prevent marketing spam, each visitor can view a maximum of <span className="font-bold text-[#1a1a1a]">10 owner numbers per day</span>.
              </p>
              <p className="editorial-label text-[#1a1a1a]/50 normal-case text-[11px] mt-2">
                Your quota refreshes automatically tomorrow at midnight, or contact our concierge directly.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-transparent hover:bg-[#1a1a1a]/5 text-[#1a1a1a] font-mono-luxury uppercase font-bold text-xs border border-[#1a1a1a] transition-colors cursor-pointer"
              >
                Close & Browse More Properties
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3.5 bg-[#fdfcf9]">
            <div className="p-3 bg-white border border-[#1a1a1a] text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-mono-luxury font-bold text-[#1a1a1a]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Direct Connect Assurance</span>
              </div>
              <p className="editorial-label text-[#1a1a1a]/70 normal-case text-[11px] leading-relaxed">
                Enter your details to unlock <span className="font-bold text-[#1a1a1a]">{property.seller.name}</span>'s direct phone number and WhatsApp. You get <strong>10 free contacts per day</strong>.
              </p>
            </div>

            {errorMessage && (
              <div className="p-2.5 font-mono-luxury text-xs text-red-700 bg-red-50 border border-red-200">
                {errorMessage}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="editorial-label text-[#1a1a1a] block mb-1 font-bold">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1a1a1a]/40">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#1a1a1a] font-mono-luxury text-[#1a1a1a] focus:outline-hidden focus:ring-1 focus:ring-[#1a1a1a]"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="editorial-label text-[#1a1a1a] block mb-1 font-bold">
                Your Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1a1a1a]/40">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#1a1a1a] font-mono-luxury text-[#1a1a1a] focus:outline-hidden focus:ring-1 focus:ring-[#1a1a1a]"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="editorial-label text-[#1a1a1a] block mb-1 font-bold">
                Your Email ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1a1a1a]/40">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#1a1a1a] font-mono-luxury text-[#1a1a1a] focus:outline-hidden focus:ring-1 focus:ring-[#1a1a1a]"
                />
              </div>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-1.5 font-mono-luxury text-[10px] text-[#1a1a1a]/70 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>We connect you directly without intermediary broker charges.</span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-mono-luxury uppercase font-bold text-xs border border-[#1a1a1a] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-[#c4a47c]" />
                <span>Unlock Owner Number ({remainingToday} Remaining Today)</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
