import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  MessageSquare, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  Send 
} from 'lucide-react';
import { openWhatsAppChat, DEFAULT_CONTACT_PHONE, DISPLAY_CONTACT_PHONE } from '../utils/whatsapp';
import { VisitorLead } from '../types';

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitInquiry?: (lead: VisitorLead) => void;
  selectedCity?: string;
}

export const ContactUsModal: React.FC<ContactUsModalProps> = ({
  isOpen,
  onClose,
  onSubmitInquiry,
  selectedCity = 'Bangalore'
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [propertyInterest, setPropertyInterest] = useState<'Apartment' | 'Plot' | 'Commercial' | 'Project'>('Apartment');
  const [message, setMessage] = useState('');
  const [preferredTime, setPreferredTime] = useState('Immediate / As soon as possible');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    if (onSubmitInquiry) {
      const newLead: VisitorLead = {
        id: `lead-contact-${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || `${phone.replace(/\D/g, '')}@contact.nsproperties.in`,
        purpose: 'General Inquiry',
        preferredCity: selectedCity,
        propertyTitle: `Contact Us: ${propertyInterest} Requirement (${preferredTime})`,
        timestamp: new Date().toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        source: 'Contact NS Properties Form',
        status: 'New',
        notes: message.trim() ? `User Query: ${message.trim()}` : undefined
      };
      onSubmitInquiry(newLead);
    }

    setSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const text = `Hello NS Properties team, I am contacting you from the app regarding ${propertyInterest} listings in ${selectedCity}. Please connect me with a luxury property advisor.`;
    openWhatsAppChat(DEFAULT_CONTACT_PHONE, text);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#fdfcf9] border-2 border-[#1a1a1a] shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b-2 border-[#c4a47c] gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#c4a47c] text-black font-mono-luxury font-black flex items-center justify-center text-xs shrink-0">
              NS
            </div>
            <div>
              <h2 className="font-serif-luxury text-lg sm:text-xl font-bold tracking-tight text-white">
                Contact NS Properties
              </h2>
              <p className="font-mono-luxury text-[10px] sm:text-[11px] text-[#c4a47c] uppercase tracking-wider">
                Direct Line • Real Estate Advisors • Office Network
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4 font-mono-luxury">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#1a1a1a]">
              Thank You, {name}!
            </h3>
            <p className="text-xs text-[#1a1a1a]/70 max-w-md mx-auto leading-relaxed">
              Your inquiry has been routed to our senior property consultant. We will call you back at <strong>{phone}</strong> ({preferredTime}).
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={handleWhatsAppDirect}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Now on WhatsApp</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-[#1a1a1a] text-xs font-bold uppercase hover:bg-black/5 cursor-pointer"
              >
                Back to Listings
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Quick Contact Buttons Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono-luxury text-xs">
              <button
                onClick={handleWhatsAppDirect}
                className="p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-between transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-5 h-5 text-white" />
                  <div className="text-left">
                    <span className="block font-bold uppercase text-[11px]">Instant WhatsApp Chat</span>
                    <span className="text-[10px] text-white/80">Typical reply: &lt; 2 minutes</span>
                  </div>
                </div>
                <span className="text-white/80 group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <a
                href={`tel:${DEFAULT_CONTACT_PHONE}`}
                className="p-3.5 bg-[#1a1a1a] hover:bg-black text-white flex items-center justify-between transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-5 h-5 text-[#c4a47c]" />
                  <div className="text-left">
                    <span className="block font-bold uppercase text-[11px]">Call NS Helpline</span>
                    <span className="text-[10px] text-[#c4a47c]">{DISPLAY_CONTACT_PHONE}</span>
                  </div>
                </div>
                <span className="text-white/80 group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            {/* Direct Callback Request Form */}
            <div className="bg-white border border-[#1a1a1a]/20 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4 border-b border-[#1a1a1a]/15 pb-2">
                <div>
                  <h3 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                    Request an Advisor Callback
                  </h3>
                  <p className="font-mono-luxury text-[10px] text-[#1a1a1a]/60 uppercase">
                    Zero spam • Direct verified consultants only
                  </p>
                </div>
                <span className="text-[10px] font-mono-luxury bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold">
                  Free Consultation
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 font-mono-luxury text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#1a1a1a] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 border border-[#1a1a1a] bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#1a1a1a] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98450 12345"
                      className="w-full px-3 py-2 border border-[#1a1a1a] bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#1a1a1a] mb-1">
                      Looking For
                    </label>
                    <select
                      value={propertyInterest}
                      onChange={(e) => setPropertyInterest(e.target.value as any)}
                      className="w-full px-3 py-2 border border-[#1a1a1a] bg-white font-bold cursor-pointer"
                    >
                      <option value="Apartment">Apartment (1, 2, 3, 4+ BHK)</option>
                      <option value="Plot">Plots & Residential Land</option>
                      <option value="Commercial">Commercial Office / Showroom</option>
                      <option value="Project">Upcoming Builder Projects</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#1a1a1a] mb-1">
                      Preferred Call Time
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-3 py-2 border border-[#1a1a1a] bg-white cursor-pointer"
                    >
                      <option value="Immediate / As soon as possible">Immediate (Within 15 mins)</option>
                      <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                      <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                      <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#1a1a1a] mb-1">
                    Specific Locality or Budget Query (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Interested in 3 BHK in Whitefield or Sarjapur under ₹1.5 Crore..."
                    className="w-full px-3 py-2 border border-[#1a1a1a] bg-white focus:outline-hidden text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1a1a1a] hover:bg-black text-white font-mono-luxury text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 text-[#c4a47c]" />
                  <span>Request Callback Now</span>
                </button>
              </form>
            </div>

            {/* Office Address & Working Hours */}
            <div className="bg-[#fdfcf9] border border-[#1a1a1a]/15 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono-luxury text-xs text-[#1a1a1a]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#c4a47c] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1a1a1a] text-[11px] uppercase">Corporate Headquarters</strong>
                  <p className="text-[11px] text-[#1a1a1a]/70 leading-relaxed">
                    NS Properties Luxury Tower, 100 Ft Road, Indiranagar, Bengaluru, KA 560038
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#c4a47c] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1a1a1a] text-[11px] uppercase">Operating Hours</strong>
                  <p className="text-[11px] text-[#1a1a1a]/70 leading-relaxed">
                    Monday to Sunday: 9:00 AM – 8:30 PM IST (Site visits conducted 7 days a week)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-[#1a1a1a] text-white/60 px-6 py-2.5 border-t border-[#1a1a1a] text-[10px] font-mono-luxury flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#c4a47c]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% RERA Verified Network • Direct Real Estate Consultancy</span>
          </div>
          <button onClick={onClose} className="hover:text-white uppercase font-bold cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
