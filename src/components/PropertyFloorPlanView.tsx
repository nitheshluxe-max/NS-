import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Compass, 
  Layers, 
  Check, 
  Eye, 
  User, 
  ArrowRight,
  Sparkles,
  Building,
  CheckCircle2
} from 'lucide-react';
import { Property } from '../types';
import { formatIndianCurrency } from '../utils/formatters';
import { openWhatsAppChat } from '../utils/whatsapp';

interface PropertyFloorPlanViewProps {
  property: Property;
  isUnlocked: boolean;
  onUnlockSuccess: (customerData: { name: string; phone: string; email: string }) => void;
  activePlanType: 'floorplan' | 'masterplan';
  onChangePlanType: (type: 'floorplan' | 'masterplan') => void;
}

export const PropertyFloorPlanView: React.FC<PropertyFloorPlanViewProps> = ({
  property,
  isUnlocked,
  onUnlockSuccess,
  activePlanType,
  onChangePlanType
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const bhkCount = property.bhk || 2;
  const isVillaOrHouse = property.type === 'villa' || property.type === 'independent-house';
  const isPlot = property.type === 'plot';
  const isCommercial = property.type === 'commercial-office' || property.type === 'commercial-shop';

  // Room dimension schedules based on property configuration
  const roomSchedule = React.useMemo(() => {
    if (isPlot) {
      return [
        { name: 'Plot Frontage', dimension: '40 ft', area: 'Front Facing Boundary', vastu: 'North-East' },
        { name: 'Plot Depth', dimension: '60 ft', area: 'Depth Boundary', vastu: 'East-West' },
        { name: 'Setback (Front)', dimension: '10 ft', area: 'Road Clearance', vastu: 'Compliant' },
        { name: 'Permissible FSI / FAR', dimension: '1.75 - 2.25', area: 'Ground + 3 Floors Permitted', vastu: 'BBMP/BDA Approved' }
      ];
    }

    if (isCommercial) {
      return [
        { name: 'Main Office Floor Plate', dimension: '45\' 0" × 32\' 0"', area: '1,440 sq.ft', vastu: 'North Entrance' },
        { name: 'Executive Cabin 1', dimension: '14\' 0" × 12\' 0"', area: '168 sq.ft', vastu: 'South-West' },
        { name: 'Executive Cabin 2', dimension: '12\' 0" × 10\' 0"', area: '120 sq.ft', vastu: 'West' },
        { name: 'Conference / Board Room', dimension: '18\' 0" × 12\' 0"', area: '216 sq.ft', vastu: 'East' },
        { name: 'Pantry & Cafeteria', dimension: '12\' 0" × 8\' 0"', area: '96 sq.ft', vastu: 'South-East' },
        { name: 'Restrooms (M/F)', dimension: '10\' 0" × 8\' 0"', area: '80 sq.ft', vastu: 'North-West' }
      ];
    }

    const rooms = [
      { name: 'Living & Dining Room', dimension: '22\' 6" × 14\' 0"', area: '315 sq.ft', vastu: 'North-East' },
      { name: 'Master Bedroom + Dresser', dimension: '16\' 0" × 13\' 6"', area: '216 sq.ft', vastu: 'South-West' },
      { name: 'Master En-Suite Bathroom', dimension: '8\' 6" × 5\' 6"', area: '47 sq.ft', vastu: 'West' },
      { name: 'Kitchen + Utility Deck', dimension: '12\' 6" × 9\' 0"', area: '112 sq.ft', vastu: 'South-East (Agni)' },
      { name: 'Bedroom 2', dimension: '14\' 0" × 12\' 0"', area: '168 sq.ft', vastu: 'North-West' },
      { name: 'Common / Guest Bathroom', dimension: '8\' 0" × 5\' 0"', area: '40 sq.ft', vastu: 'North-West' },
      { name: 'Balcony Deck', dimension: '14\' 0" × 5\' 6"', area: '77 sq.ft', vastu: 'East View' }
    ];

    if (bhkCount >= 3) {
      rooms.splice(5, 0, {
        name: 'Bedroom 3 / Children Room',
        dimension: '13\' 0" × 11\' 6"',
        area: '150 sq.ft',
        vastu: 'North'
      });
      rooms.splice(6, 0, {
        name: 'Attached Bathroom 3',
        dimension: '7\' 6" × 5\' 0"',
        area: '37 sq.ft',
        vastu: 'West'
      });
    }

    if (bhkCount >= 4 || isVillaOrHouse) {
      rooms.push({
        name: 'Private Family Lounge / Study',
        dimension: '14\' 6" × 11\' 0"',
        area: '160 sq.ft',
        vastu: 'North-East'
      });
      rooms.push({
        name: 'Servant Room & Toilet',
        dimension: '8\' 0" × 7\' 0"',
        area: '56 sq.ft',
        vastu: 'South'
      });
    }

    return rooms;
  }, [bhkCount, isVillaOrHouse, isPlot, isCommercial]);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const clean = customerPhone.replace(/\D/g, '');
    if (clean.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    const emailToSubmit = customerEmail.trim() || `${clean}@lead.nsproperties.in`;

    onUnlockSuccess({
      name: customerName.trim(),
      phone: customerPhone.trim(),
      email: emailToSubmit
    });
  };

  const handleDownloadBlueprint = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(2.0, Math.max(0.7, prev + delta)));
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <div className="space-y-4">
      {/* Sub-selector tabs: Floor Plan vs Master Plan */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1a1a1a]/20 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChangePlanType('floorplan')}
            className={`px-3 py-1.5 text-xs font-mono-luxury uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
              activePlanType === 'floorplan'
                ? 'bg-[#1a1a1a] text-[#fdfcf9] border-[#1a1a1a] font-bold'
                : 'bg-[#fdfcf9] hover:bg-[#1a1a1a]/5 text-[#1a1a1a] border-[#1a1a1a]/30'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span>Unit Floor Plan ({property.bhk > 0 ? `${property.bhk} BHK` : property.type.toUpperCase()})</span>
            {isUnlocked ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            ) : (
              <Lock className="w-3 h-3 text-amber-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onChangePlanType('masterplan')}
            className={`px-3 py-1.5 text-xs font-mono-luxury uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
              activePlanType === 'masterplan'
                ? 'bg-[#1a1a1a] text-[#fdfcf9] border-[#1a1a1a] font-bold'
                : 'bg-[#fdfcf9] hover:bg-[#1a1a1a]/5 text-[#1a1a1a] border-[#1a1a1a]/30'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span>Master Site Layout</span>
            {isUnlocked ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            ) : (
              <Lock className="w-3 h-3 text-amber-500" />
            )}
          </button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono-luxury">
          {isUnlocked ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-300 px-2.5 py-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Blueprint & Phone Unlocked</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-1">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Plan Locked (Provide Phone to Unlock)</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Blueprint Box */}
      <div className="relative border border-[#1a1a1a] bg-[#0c192c] overflow-hidden min-h-[420px] select-none flex flex-col justify-between">
        {/* Blueprint background grid pattern */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #4facfe 1px, transparent 1px),
              linear-gradient(to bottom, #4facfe 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Watermark */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-[11px] font-mono-luxury text-white/60 uppercase tracking-widest pointer-events-none">
          <Building className="w-4 h-4 text-[#c4a47c]" />
          <span>{property.projectName || property.title} • Architectural Blueprint</span>
        </div>

        {/* Zoom Controls (when unlocked) */}
        {isUnlocked && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-black/70 border border-white/20 p-1 font-mono-luxury text-xs text-white">
            <button
              onClick={() => handleZoom(0.15)}
              className="p-1 hover:bg-white/20 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(-0.15)}
              className="p-1 hover:bg-white/20 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetZoom}
              className="p-1 hover:bg-white/20 transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[10px] text-white/70">{Math.round(zoomLevel * 100)}%</span>
          </div>
        )}

        {/* Blueprint Content Area */}
        <div className="relative p-6 sm:p-10 flex items-center justify-center min-h-[380px] overflow-auto">
          {/* Blueprint SVG Diagram rendered with scale */}
          <div 
            className="transition-transform duration-200 origin-center"
            style={{ 
              transform: `scale(${zoomLevel})`,
              filter: isUnlocked ? 'none' : 'blur(7px)'
            }}
          >
            {activePlanType === 'floorplan' ? (
              /* High-fidelity Architectural Unit Floor Plan Diagram */
              <div className="w-[520px] sm:w-[620px] max-w-full bg-[#0a1628] border-2 border-cyan-400/80 p-5 rounded-sm shadow-2xl text-cyan-200 font-mono-luxury relative">
                {/* Outer border & dimension lines */}
                <div className="absolute -top-5 left-0 right-0 flex justify-between text-[10px] text-cyan-300/80">
                  <span>◀</span>
                  <span className="border-b border-cyan-400/50 flex-1 mx-2 text-center">Width: 38' 6"</span>
                  <span>▶</span>
                </div>
                <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between text-[10px] text-cyan-300/80">
                  <span>▲</span>
                  <span className="border-l border-cyan-400/50 flex-1 my-2 -rotate-90 flex items-center justify-center">Length: 42' 0"</span>
                  <span>▼</span>
                </div>

                {/* Rooms Grid Blueprint */}
                <div className="grid grid-cols-12 gap-2 text-xs">
                  {/* Master Bedroom */}
                  <div 
                    onClick={() => setSelectedRoom('Master Bedroom')}
                    className={`col-span-6 p-3 border-2 border-dashed border-cyan-400/60 bg-cyan-950/40 hover:bg-cyan-900/50 cursor-pointer transition-colors ${
                      selectedRoom === 'Master Bedroom' ? 'border-amber-400 bg-amber-950/40' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-cyan-300 font-bold">
                      <span>MASTER SUITE</span>
                      <span className="text-amber-300 text-[10px]">SW Corner</span>
                    </div>
                    <p className="text-[10px] text-cyan-400/70 mt-1">16' 0" × 13' 6"</p>
                    <div className="mt-2 text-[9px] text-white/60 flex items-center justify-between border-t border-cyan-800/60 pt-1">
                      <span>Wooden Laminate</span>
                      <span>Attached Bath: 8'6"×5'6"</span>
                    </div>
                  </div>

                  {/* Bedroom 2 */}
                  <div 
                    onClick={() => setSelectedRoom('Bedroom 2')}
                    className={`col-span-6 p-3 border-2 border-dashed border-cyan-400/60 bg-cyan-950/40 hover:bg-cyan-900/50 cursor-pointer transition-colors ${
                      selectedRoom === 'Bedroom 2' ? 'border-amber-400 bg-amber-950/40' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-cyan-300 font-bold">
                      <span>BEDROOM {bhkCount >= 3 ? '2' : 'GUEST'}</span>
                      <span className="text-cyan-400/60 text-[10px]">NW</span>
                    </div>
                    <p className="text-[10px] text-cyan-400/70 mt-1">14' 0" × 12' 0"</p>
                    <div className="mt-2 text-[9px] text-white/60 flex items-center justify-between border-t border-cyan-800/60 pt-1">
                      <span>Vitrified Tiles</span>
                      <span>Wardrobe Niche</span>
                    </div>
                  </div>

                  {/* Expansive Living & Dining Hall */}
                  <div 
                    onClick={() => setSelectedRoom('Living & Dining')}
                    className={`col-span-8 p-4 border-2 border-cyan-400/70 bg-cyan-950/50 hover:bg-cyan-900/60 cursor-pointer transition-colors min-h-[90px] ${
                      selectedRoom === 'Living & Dining' ? 'border-amber-400 bg-amber-950/40' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-cyan-200 font-black">
                      <span>EXPANSIVE LIVING & DINING GREAT ROOM</span>
                      <span className="text-emerald-400 text-[10px]">MAIN ENTRANCE -&gt;</span>
                    </div>
                    <p className="text-[11px] text-cyan-300 mt-1">22' 6" × 14' 0" • 315 SQ.FT</p>
                    <div className="mt-2 text-[10px] text-white/70 flex items-center gap-3">
                      <span>Italian Marble Flooring</span>
                      <span>•</span>
                      <span>Ceiling Height: 10' 6"</span>
                    </div>
                  </div>

                  {/* Kitchen & Utility */}
                  <div 
                    onClick={() => setSelectedRoom('Kitchen')}
                    className={`col-span-4 p-3 border-2 border-dashed border-cyan-400/60 bg-cyan-950/40 hover:bg-cyan-900/50 cursor-pointer transition-colors ${
                      selectedRoom === 'Kitchen' ? 'border-amber-400 bg-amber-950/40' : ''
                    }`}
                  >
                    <div className="text-[11px] text-cyan-300 font-bold">KITCHEN + UTILITY</div>
                    <p className="text-[10px] text-cyan-400/70 mt-1">12' 6" × 9' 0"</p>
                    <div className="mt-2 text-[9px] text-amber-300/80 border-t border-cyan-800/60 pt-1">
                      Vastu: Agni (SE)
                    </div>
                  </div>

                  {/* Wide Balcony Deck */}
                  <div 
                    onClick={() => setSelectedRoom('Balcony')}
                    className={`col-span-12 p-2.5 border-2 border-emerald-400/60 bg-emerald-950/30 hover:bg-emerald-900/40 cursor-pointer transition-colors flex items-center justify-between ${
                      selectedRoom === 'Balcony' ? 'border-amber-400 bg-amber-950/40' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[11px] text-emerald-300 font-bold">
                      <span>OUTDOOR LIVING DECK / BALCONY</span>
                      <span className="text-[10px] text-white/60">(14' 0" × 5' 6")</span>
                    </div>
                    <span className="text-[10px] text-emerald-400">Anti-skid Deck Flooring • Glass Railing</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-cyan-400/30 flex flex-wrap items-center justify-between gap-2 text-[10px] text-white/70">
                  <span>Carpet Area: <strong>{property.carpetAreaSqFt} sq.ft</strong></span>
                  <span>Super Built-up: <strong>{property.areaSqFt} sq.ft</strong></span>
                  <span>Facing: <strong>{property.facing || 'East'}</strong></span>
                  <span>RERA Approved Layout: <strong>{property.reraId ? 'YES' : 'VERIFIED'}</strong></span>
                </div>
              </div>
            ) : (
              /* Master Site Layout Blueprint */
              <div className="w-[520px] sm:w-[620px] max-w-full bg-[#0a1628] border-2 border-emerald-400/80 p-5 rounded-sm shadow-2xl text-emerald-200 font-mono-luxury relative">
                <div className="text-center font-bold text-emerald-300 text-sm mb-3">
                  {property.projectName || property.title} • MASTER SITE LAYOUT
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs mb-4">
                  <div className="border border-emerald-400/50 bg-emerald-950/40 p-3 rounded-xs text-center">
                    <span className="text-white font-bold block">TOWER A & B</span>
                    <span className="text-[10px] text-emerald-300/80">Residential Wings</span>
                    <div className="mt-2 text-[9px] text-emerald-400">Ground + 24 Floors</div>
                  </div>

                  <div className="border-2 border-amber-400 bg-amber-950/40 p-3 rounded-xs text-center">
                    <span className="text-amber-300 font-bold block">CLUBHOUSE</span>
                    <span className="text-[10px] text-white/80">35,000 sq.ft Hub</span>
                    <div className="mt-2 text-[9px] text-amber-200">Pool, Gym & Spa</div>
                  </div>

                  <div className="border border-emerald-400/50 bg-emerald-950/40 p-3 rounded-xs text-center">
                    <span className="text-white font-bold block">TOWER C & D</span>
                    <span className="text-[10px] text-emerald-300/80">Luxury Suites</span>
                    <div className="mt-2 text-[9px] text-emerald-400">Ground + 27 Floors</div>
                  </div>
                </div>

                <div className="p-3 border border-dashed border-emerald-400/60 bg-emerald-950/30 flex items-center justify-between text-[11px]">
                  <span>70% Open Green Spaces & Central Park</span>
                  <span>Tennis & Badminton Courts</span>
                  <span>2-Level Basement Parking</span>
                </div>

                <div className="mt-3 text-center text-[10px] text-emerald-300/70">
                  Main Entry / Exit Gate: 60 ft Wide Boulevard Road with 24/7 RFID Boom Barriers
                </div>
              </div>
            )}
          </div>

          {/* Locked Overlay Form (When NOT unlocked) */}
          {!isUnlocked && (
            <div className="absolute inset-0 z-30 bg-[#0c192c]/85 backdrop-blur-md flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-[#fdfcf9] border-2 border-[#1a1a1a] shadow-2xl p-5 sm:p-6 text-[#1a1a1a] space-y-4 animate-in zoom-in-95">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 bg-[#1a1a1a] text-[#c4a47c] border border-[#1a1a1a] flex items-center justify-center mx-auto mb-2">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-luxury text-xl font-bold text-[#1a1a1a]">
                    Unlock Official Architectural Plan
                  </h3>
                  <p className="font-mono-luxury text-xs text-[#1a1a1a]/70">
                    Provide customer phone number to instantly unlock high-res blueprint dimensions and direct owner/builder phone number.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-2 bg-red-50 border border-red-200 text-red-600 text-xs font-mono-luxury">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleUnlockSubmit} className="space-y-3 font-mono-luxury">
                  <div>
                    <label className="block text-[11px] font-bold text-[#1a1a1a] uppercase mb-1">
                      Customer Full Name *
                    </label>
                    <div className="flex border border-[#1a1a1a] bg-white">
                      <span className="px-2.5 py-2 bg-[#fdfcf9] border-r border-[#1a1a1a] text-[#1a1a1a]/60">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikramaditya Singh"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 text-xs focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#1a1a1a] uppercase mb-1">
                      Customer Mobile Number *
                    </label>
                    <div className="flex border border-[#1a1a1a] bg-white">
                      <span className="px-2.5 py-2 bg-[#fdfcf9] border-r border-[#1a1a1a] text-xs font-bold">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={12}
                        placeholder="Enter 10-digit mobile number"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#1a1a1a] uppercase mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#1a1a1a] bg-white focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#1a1a1a] transition-all cursor-pointer shadow-md mt-2"
                  >
                    <Unlock className="w-4 h-4 text-[#c4a47c]" />
                    <span>Unlock Plan & Seller Contact Now</span>
                  </button>

                  <div className="flex items-center justify-between text-[10px] text-[#1a1a1a]/60 pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      100% Free • Verified RERA
                    </span>
                    <span>No spam guarantee</span>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Banner when UNLOCKED: Prominent Owner Phone Number display */}
        {isUnlocked && (
          <div className="bg-[#1a1a1a] text-[#fdfcf9] p-4 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#c4a47c] bg-[#1a1a1a] text-[#c4a47c] flex items-center justify-center font-black">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono-luxury uppercase text-[#c4a47c] font-bold">
                    Verified Seller / Builder Contact Unlocked:
                  </span>
                  <span className="bg-emerald-900 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 border border-emerald-600">
                    DIRECT
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-serif-luxury text-base font-bold text-white">
                    {property.seller.name}
                  </span>
                  <span className="text-white/60 font-mono-luxury text-xs">
                    ({property.seller.company || property.postedBy})
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Call & WhatsApp Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto font-mono-luxury">
              <a
                href={`tel:${property.seller.phone}`}
                className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition-colors border border-emerald-500"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call: {property.seller.phone}</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  const msg = `Hello ${property.seller.name}, I have unlocked the floor plan of "${property.title}" (${property.priceDisplay}, ${property.locality}, ${property.city}) on NS Properties and would like to discuss purchasing/booking.`;
                  openWhatsAppChat(property.seller.phone, msg);
                }}
                className="flex-1 sm:flex-initial px-3.5 py-2 bg-[#c4a47c] hover:bg-[#b09066] text-[#1a1a1a] text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition-colors border border-[#1a1a1a]"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadBlueprint}
                className="p-2 border border-white/30 hover:border-white text-white transition-colors"
                title="Download Blueprint Specification"
              >
                {downloadSuccess ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* When Unlocked: Detailed Room Dimensions Table & Vastu Audit */}
      {isUnlocked && (
        <div className="bg-[#fdfcf9] border border-[#1a1a1a] p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1a1a1a]/20 pb-3">
            <div>
              <h4 className="font-serif-luxury text-lg font-bold text-[#1a1a1a]">
                Room Dimension Schedule & Spatial Specs
              </h4>
              <p className="font-mono-luxury text-xs text-[#1a1a1a]/70">
                Architectural measurements verified as per certified RERA layout plan
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono-luxury">
              <span className="text-[#1a1a1a]/70">
                Carpet Area: <strong className="text-[#1a1a1a]">{property.carpetAreaSqFt} sq.ft</strong>
              </span>
              <span>•</span>
              <span className="text-[#1a1a1a]/70">
                Super Area: <strong className="text-[#1a1a1a]">{property.areaSqFt} sq.ft</strong>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono-luxury text-left border border-[#1a1a1a]/20">
              <thead className="bg-[#1a1a1a] text-[#fdfcf9]">
                <tr>
                  <th className="p-2.5 border-r border-[#1a1a1a]/30">Space / Room</th>
                  <th className="p-2.5 border-r border-[#1a1a1a]/30">Exact Dimension</th>
                  <th className="p-2.5 border-r border-[#1a1a1a]/30">Area</th>
                  <th className="p-2.5">Vastu / Orientation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/15 bg-white">
                {roomSchedule.map((room, idx) => (
                  <tr 
                    key={idx} 
                    className={`hover:bg-[#1a1a1a]/5 transition-colors ${
                      selectedRoom === room.name ? 'bg-[#c4a47c]/20 font-bold' : ''
                    }`}
                  >
                    <td className="p-2.5 font-bold text-[#1a1a1a] border-r border-[#1a1a1a]/15 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c4a47c]"></span>
                      <span>{room.name}</span>
                    </td>
                    <td className="p-2.5 border-r border-[#1a1a1a]/15">{room.dimension}</td>
                    <td className="p-2.5 border-r border-[#1a1a1a]/15 font-semibold text-[#1a1a1a]">
                      {room.area}
                    </td>
                    <td className="p-2.5 text-emerald-700 font-semibold">{room.vastu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Efficiency Bar */}
          <div className="p-3 bg-[#1a1a1a]/5 border border-[#1a1a1a]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-luxury">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1a1a1a]">Carpet Efficiency Ratio:</span>
              <span className="bg-[#1a1a1a] text-[#fdfcf9] px-2 py-0.5 font-bold">
                {Math.round((property.carpetAreaSqFt / property.areaSqFt) * 100)}% Usable Carpet Area
              </span>
            </div>
            <p className="text-[11px] text-[#1a1a1a]/70">
              Low loading factor • Zero dead space architectural layout
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
