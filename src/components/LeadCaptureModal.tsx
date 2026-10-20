import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  Phone, 
  Mail, 
  User, 
  CheckCircle2, 
  MessageSquare,
  FileSpreadsheet,
  Clock
} from 'lucide-react';
import { VisitorLead } from '../types';
import { openWhatsAppChat, DEFAULT_CONTACT_PHONE } from '../utils/whatsapp';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLead: (lead: VisitorLead) => void;
  selectedCity?: string;
  defaultPropertyTitle?: string;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  isOpen,
  onClose,
  onSubmitLead,
  selectedCity = 'Bangalore',
  defaultPropertyTitle
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState<'Buy' | 'Rent' | 'Invest' | 'Brochure'>('Buy');
  const [budget, setBudget] = useState('₹ 80 L - ₹ 1.5 Cr');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    const newLead: VisitorLead = {
      id: `lead-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      purpose: purpose,
      preferredCity: selectedCity,
      budget: budget,
      propertyTitle: defaultPropertyTitle || `Verified Properties in ${selectedCity}`,
      timestamp: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      source: 'Auto-Trigger Popup',
      status: 'New'
    };

    onSubmitLead(newLead);
    setIsSubmitted(true);
  };

  const handleNotifyOwnerWhatsApp = () => {
    const msg = `*NEW CLIENT INQUIRY - NS Properties Portal*\n\n` +
      `*Client Name:* ${name}\n` +
      `*Mobile No:* ${phone}\n` +
      `*Email ID:* ${email}\n` +
      `*Looking To:* ${purpose}\n` +
      `*Target City:* ${selectedCity}\n` +
      `*Budget Range:* ${budget}\n` +
      (defaultPropertyTitle ? `*Interested In:* ${defaultPropertyTitle}\n` : '') +
      `*Time:* ${new Date().toLocaleTimeString('en-IN')}\n\n` +
      `_Please connect with me on WhatsApp / Call with available properties._`;

    openWhatsAppChat(DEFAULT_CONTACT_PHONE, msg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#fdfcf9] border-[1.5px] border-[#1a1a1a] shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Banner */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] px-4 sm:px-6 py-4 sm:py-5 relative border-b border-[#1a1a1a]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 border border-white/20 hover:border-white text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="editorial-badge bg-[#c4a47c] text-[#1a1a1a] border-0 mb-2">
            Private Consultation
          </span>

          <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-tight">
            Curated Homes in {selectedCity}
          </h3>
          <p className="editorial-label text-[#fdfcf9]/70 text-[11px] sm:text-xs normal-case mt-1 max-w-sm">
            Receive personalized price lists, verified brochures & direct owner deals directly to your WhatsApp and Email.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-6 sm:p-8 text-center bg-[#fdfcf9]">
            <div className="w-14 h-14 bg-[#e2f4ea] text-[#1e4620] flex items-center justify-center mx-auto mb-4 border border-[#1e4620]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h4 className="font-serif-luxury text-2xl font-bold text-[#1a1a1a]">
              Inquiry Received Successfully
            </h4>
            <p className="editorial-label text-[#1a1a1a]/70 text-xs normal-case mt-2 max-w-md mx-auto">
              Thank you, <span className="font-bold text-[#1a1a1a]">{name}</span>. Our senior real estate advisor for {selectedCity} has received your inquiry (<span className="font-bold font-mono-luxury text-[#1a1a1a]">{phone}</span>).
            </p>

            <div className="mt-5 p-3.5 bg-white border border-[#1a1a1a] text-xs text-[#1a1a1a] text-left flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="editorial-label font-bold block text-[#1a1a1a]">100% Privacy Protected</span>
                <span className="editorial-label text-[#1a1a1a]/70 normal-case text-[11px]">
                  We never share your information with spammers. You will only receive verified listings matching your requirements.
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                type="button"
                onClick={handleNotifyOwnerWhatsApp}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-mono-luxury uppercase text-xs font-bold border border-[#1a1a1a] transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#c4a47c]" />
                <span>Connect on WhatsApp Now</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 bg-transparent hover:bg-[#1a1a1a]/5 text-[#1a1a1a] font-mono-luxury uppercase text-xs font-bold border border-[#1a1a1a] transition-colors cursor-pointer"
              >
                Browse Listings
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 bg-[#fdfcf9]">
            {errorMessage && (
              <div className="p-2.5 font-mono-luxury text-xs text-red-700 bg-red-50 border border-red-200">
                {errorMessage}
              </div>
            )}

            {/* Purpose tabs */}
            <div>
              <label className="editorial-label text-[#1a1a1a] block mb-1.5 font-bold">
                I am looking to:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Buy', 'Rent', 'Invest'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPurpose(item)}
                    className={`py-2 text-xs font-mono-luxury font-bold border transition-all cursor-pointer ${
                      purpose === item
                        ? 'bg-[#1a1a1a] border-[#1a1a1a] text-[#fdfcf9]'
                        : 'bg-white border-[#1a1a1a]/30 text-[#1a1a1a] hover:bg-[#1a1a1a]/5'
                    }`}
                  >
                    {item} Property
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
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
                  placeholder="e.g. Nithesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#1a1a1a] focus:outline-hidden focus:ring-1 focus:ring-[#1a1a1a] transition-all font-mono-luxury text-[#1a1a1a]"
                />
              </div>
            </div>

            {/* Phone & Email Inputs in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="editorial-label text-[#1a1a1a] block mb-1 font-bold">
                  Mobile Number <span className="text-red-500">*</span>
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
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#1a1a1a] focus:outline-hidden focus:ring-1 focus:ring-[#1a1a1a] transition-all font-mono-luxury text-[#1a1a1a]"
                  />
                </div>
              </div>

              <div>
                <label className="editorial-label text-[#1a1a1a] block mb-1 font-bold">
                  Email Address <span className="text-red-500">*</span>
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
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#1a1a1a] focus:outline-hidden focus:ring-1 focus:ring-[#1a1a1a] transition-all font-mono-luxury text-[#1a1a1a]"
                  />
                </div>
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="editorial-label text-[#1a1a1a] block mb-1 font-bold">
                Approximate Budget
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-white border border-[#1a1a1a] focus:outline-hidden focus:ring-1 focus:ring-[#1a1a1a] font-mono-luxury text-[#1a1a1a]"
              >
                <option value="Under ₹ 50 Lakhs">Under ₹ 50 Lakhs</option>
                <option value="₹ 50 L - ₹ 80 Lakhs">₹ 50 L - ₹ 80 Lakhs</option>
                <option value="₹ 80 L - ₹ 1.5 Crore">₹ 80 L - ₹ 1.5 Crore</option>
                <option value="₹ 1.5 Cr - ₹ 3.0 Crore">₹ 1.5 Cr - ₹ 3.0 Crore</option>
                <option value="₹ 3.0 Cr - ₹ 6.0 Crore">₹ 3.0 Cr - ₹ 6.0 Crore</option>
                <option value="₹ 6.0 Crore+ Luxury">₹ 6.0 Crore+ (Ultra Luxury)</option>
              </select>
            </div>

            {/* Perks list */}
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono-luxury text-[11px] text-[#1a1a1a]/70">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant brochure on WhatsApp</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero brokerage on builder units</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-mono-luxury uppercase font-bold text-xs border border-[#1a1a1a] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4 text-[#c4a47c]" />
                <span>Get Instant Price & Brochure Call</span>
              </button>
            </div>

            <p className="editorial-label text-[#1a1a1a]/50 text-center flex items-center justify-center gap-1 normal-case text-[10px]">
              <Clock className="w-3 h-3 text-[#c4a47c]" />
              Verified advisors will contact you within 15 minutes.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
