import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, MapPin, Video, UserCheck, MessageSquare } from 'lucide-react';
import { Property, SiteVisitRequest } from '../types';
import { openWhatsAppChat } from '../utils/whatsapp';

interface SiteVisitModalProps {
  property: Property;
  onClose: () => void;
  onConfirmVisit: (visit: SiteVisitRequest) => void;
}

export const SiteVisitModal: React.FC<SiteVisitModalProps> = ({
  property,
  onClose,
  onConfirmVisit
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 01:00 PM');
  const [visitType, setVisitType] = useState<'in-person' | 'video'>('in-person');
  const [attendeeRole, setAttendeeRole] = useState<'Buyer' | 'Agent' | 'Developer' | 'Builder'>('Buyer');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const slots = [
    '10:00 AM - 12:00 PM',
    '12:00 PM - 02:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
    '06:00 PM - 07:30 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date) return;

    const request: SiteVisitRequest = {
      id: `visit-${Date.now()}`,
      propertyId: property.id,
      propertyTitle: property.title,
      name,
      phone,
      email: email.trim() || undefined,
      date,
      timeSlot,
      notes: `[${attendeeRole} Visit - 100% Free Pass] ${visitType === 'video' ? `[Video Tour] ${notes}` : notes}`,
      status: 'Confirmed',
      createdAt: new Date().toLocaleDateString('en-IN')
    };

    onConfirmVisit(request);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-[#fdfcf9] border-[1.5px] border-[#1a1a1a] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-[#1a1a1a] gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 border border-[#c4a47c] flex items-center justify-center text-[#c4a47c] shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-serif-luxury text-lg sm:text-xl font-bold truncate">Schedule Property Inspection</h2>
              <p className="editorial-label text-[#fdfcf9]/70 text-[10px] sm:text-xs normal-case truncate">Private on-site tour escorted by verified portfolio concierge</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-white/20 hover:border-white text-white cursor-pointer transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form or Confirmation */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-[#fdfcf9]">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-white border border-[#1a1a1a] text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-2xl font-bold text-[#1a1a1a]">Inspection Confirmed</h3>
                <p className="editorial-label text-[#1a1a1a]/70 text-xs mt-1 max-w-xs mx-auto normal-case">
                  Your visit for <span className="font-bold text-[#1a1a1a]">{property.title}</span> is reserved for{' '}
                  <span className="font-mono-luxury font-bold text-[#1a1a1a]">{date}</span> ({timeSlot}).
                </p>
              </div>

              <div className="p-3.5 bg-white border border-[#1a1a1a] text-xs font-mono-luxury text-[#1a1a1a] text-left space-y-1">
                <p>• A senior concierge will await your arrival with property deeds & specs.</p>
                <p>• Gate pass & appointment token sent to {phone}.</p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center font-mono-luxury">
                <button
                  type="button"
                  onClick={() => {
                    const msg = `Hello ${property.seller.name}, I have scheduled a site visit for "${property.title}" on ${date} (${timeSlot}). My name is ${name}. Please confirm the appointment and location pin.`;
                    openWhatsAppChat(property.seller.phone, msg);
                  }}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase cursor-pointer flex items-center justify-center gap-1.5 border border-emerald-900 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Notify Seller on WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] text-xs font-bold uppercase cursor-pointer transition-colors border border-[#1a1a1a]"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Property mini recap */}
              <div className="p-3 bg-white border border-[#1a1a1a] flex items-center gap-3">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-14 h-14 object-cover border border-[#1a1a1a]"
                />
                <div>
                  <h4 className="font-serif-luxury font-bold text-sm text-[#1a1a1a] line-clamp-1">{property.title}</h4>
                  <span className="font-mono-luxury text-xs font-bold text-[#1a1a1a]">{property.priceDisplay}</span>
                  <p className="editorial-label text-[#1a1a1a]/60 text-[10px] normal-case">{property.locality}, {property.city}</p>
                </div>
              </div>

              {/* 100% Free Site Visit & Builder Deals Assurance */}
              <div className="p-3 bg-emerald-50 border-2 border-emerald-600/70 text-xs text-emerald-950 flex items-start gap-2.5 font-mono-luxury">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-emerald-900 font-bold uppercase text-[11px]">
                      100% Free Site Visit Guarantee (₹0 Fee)
                    </strong>
                    <span className="bg-emerald-700 text-white text-[9px] font-black px-1.5 py-0.2 uppercase">
                      FREE PASS
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 mt-0.5 font-sans leading-relaxed">
                    Site visits are <strong>100% FREE</strong> for Buyers, Real Estate Agents, Project Developers, and Builders. Includes applicable builder festival discounts, stamp duty concessions, and verified price vouchers.
                  </p>
                </div>
              </div>

              {/* Attendee Persona */}
              <div>
                <label className="editorial-label text-[#1a1a1a] block mb-1 font-bold">Visiting As</label>
                <div className="grid grid-cols-4 gap-1.5 font-mono-luxury text-xs">
                  {(['Buyer', 'Agent', 'Developer', 'Builder'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setAttendeeRole(r)}
                      className={`py-1.5 px-2 border text-[11px] font-bold text-center transition-all cursor-pointer ${
                        attendeeRole === r
                          ? 'bg-[#1a1a1a] text-[#fdfcf9] border-[#1a1a1a] shadow-xs'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Selection */}
              <div>
                <label className="editorial-label text-[#1a1a1a] block mb-1.5 font-bold">Visit Mode</label>
                <div className="grid grid-cols-2 gap-2 font-mono-luxury uppercase text-xs">
                  <button
                    type="button"
                    onClick={() => setVisitType('in-person')}
                    className={`p-2.5 border font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      visitType === 'in-person'
                        ? 'bg-[#1a1a1a] text-[#fdfcf9] border-[#1a1a1a]'
                        : 'bg-white border-[#1a1a1a] text-[#1a1a1a]'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#c4a47c]" />
                    In-Person Visit
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisitType('video')}
                    className={`p-2.5 border font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      visitType === 'video'
                        ? 'bg-[#1a1a1a] text-[#fdfcf9] border-[#1a1a1a]'
                        : 'bg-white border-[#1a1a1a] text-[#1a1a1a]'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5 text-[#c4a47c]" />
                    Live Video Tour
                  </button>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono-luxury">
                <div>
                  <label className="editorial-label text-[#1a1a1a] block mb-1 font-bold">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#1a1a1a] text-[#1a1a1a] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="editorial-label text-[#1a1a1a] block mb-1 font-bold">Time Window</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#1a1a1a] bg-white text-[#1a1a1a] font-mono-luxury focus:outline-hidden"
                  >
                    {slots.map((s, i) => (
                      <option key={i} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* User details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono-luxury">
                <div>
                  <label className="editorial-label text-[#1a1a1a] block mb-1 font-bold">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#1a1a1a] text-[#1a1a1a] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="editorial-label text-[#1a1a1a] block mb-1 font-bold">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#1a1a1a] text-[#1a1a1a] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="editorial-label text-[#1a1a1a] block mb-1 font-bold">Email (Gate Pass Confirmation)</label>
                <input
                  type="email"
                  placeholder="ananya@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#1a1a1a] font-mono-luxury text-[#1a1a1a] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="editorial-label text-[#1a1a1a] block mb-1 font-bold">Special Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g., Request floor plan copy / arrange parking / focus on orientation"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#1a1a1a] font-mono-luxury text-[#1a1a1a] focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-mono-luxury uppercase font-bold text-xs border border-[#1a1a1a] transition-all cursor-pointer shadow-sm"
                >
                  Confirm Inspection Appointment
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
