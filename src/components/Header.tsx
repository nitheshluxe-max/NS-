import React, { useState } from 'react';
import { 
  Building2, 
  Heart, 
  Scale, 
  Calculator, 
  TrendingUp, 
  PlusCircle, 
  MapPin, 
  ChevronDown,
  CalendarCheck,
  Download,
  Share2,
  MessageSquare,
  Users,
  Sparkles,
  Lock,
  Settings,
  Crown,
  Terminal,
  ShieldAlert,
  User,
  LogOut,
  Phone,
  Briefcase,
  TreePine,
  Layers,
  Headphones,
  Star,
  Clock,
  KeyRound,
  Bell,
  Tag
} from 'lucide-react';
import { TOP_CITIES } from '../data/properties';
import { openWhatsAppChat, DEFAULT_CONTACT_PHONE, DISPLAY_CONTACT_PHONE } from '../utils/whatsapp';
import { AppUserSession } from '../utils/appAuthService';

interface HeaderProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  savedCount: number;
  compareCount: number;
  onOpenSaved: () => void;
  onOpenCompare: () => void;
  onOpenPostProperty: () => void;
  onOpenEmiCalc: () => void;
  onOpenMarketTrends: () => void;
  onOpenVisits: () => void;
  scheduledVisitsCount: number;
  onOpenDownloadModal: () => void;
  onOpenShareModal: () => void;
  onOpenContactModal: () => void;
  onOpenAuthModal: (tab?: 'public' | 'private') => void;
  activeSession: AppUserSession | null;
  onLogout: () => void;
  onOpenOwnerConsole?: () => void;
  onOpenDeveloperConsole?: () => void;
  onOpenStaffConsole?: () => void;
  onOpenUserHub?: (tab?: 'activity' | 'profile' | 'service' | 'feedback' | 'security' | 'communication', subTab?: 'contacted' | 'shortlisted' | 'viewed') => void;
  activeCategory?: string;
  onSelectCategory?: (cat: 'apartments' | 'plots' | 'commercial' | 'projects') => void;
  onOpenPlansModal?: () => void;
  onOpenOffers?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCity,
  onSelectCity,
  savedCount,
  compareCount,
  onOpenSaved,
  onOpenCompare,
  onOpenPostProperty,
  onOpenEmiCalc,
  onOpenMarketTrends,
  onOpenVisits,
  scheduledVisitsCount,
  onOpenDownloadModal,
  onOpenShareModal,
  onOpenContactModal,
  onOpenAuthModal,
  activeSession,
  onLogout,
  onOpenOwnerConsole,
  onOpenDeveloperConsole,
  onOpenStaffConsole,
  onOpenUserHub,
  activeCategory = 'apartments',
  onSelectCategory,
  onOpenPlansModal,
  onOpenOffers
}) => {
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isOwner = activeSession?.role === 'owner';
  const isDeveloper = activeSession?.role === 'developer';
  const isStaff = activeSession?.role === 'staff';

  return (
    <header className="sticky top-0 z-40 bg-[#fdfcf9] border-b-[1.5px] border-[#1a1a1a]">
      {/* Top micro bar with Architectural Luxury styling */}
      <div className="bg-[#1a1a1a] text-[#fdfcf9] py-2 px-4 sm:px-8 text-xs font-mono-luxury border-b border-black">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-[11px] tracking-wider uppercase">
            <span className="text-white/60">India's Trusted Property Network</span>
            <span className="hidden sm:inline-block text-white/30">•</span>
            <span className="text-[#c4a47c] font-bold">100% RERA Verified Listings</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 text-[11px]">
            <button 
              onClick={onOpenMarketTrends}
              className="text-white/80 hover:text-white transition-colors cursor-pointer uppercase tracking-wider flex items-center gap-1"
            >
              <TrendingUp className="w-3 h-3 text-[#c4a47c]" />
              <span className="hidden sm:inline">Price</span> Trends
            </button>

            <button 
              onClick={onOpenEmiCalc}
              className="text-white/80 hover:text-white transition-colors cursor-pointer uppercase tracking-wider flex items-center gap-1"
            >
              <Calculator className="w-3 h-3 text-[#c4a47c]" />
              EMI Calc
            </button>

            <button
              onClick={onOpenVisits}
              className="text-white/80 hover:text-white transition-colors cursor-pointer uppercase tracking-wider flex items-center gap-1"
            >
              <CalendarCheck className="w-3 h-3 text-[#c4a47c]" />
              Visits {scheduledVisitsCount > 0 && `(${scheduledVisitsCount})`}
            </button>

            <button
              onClick={() => {
                const msg = `Hello NS Properties Support, I am browsing your listings and would like to speak to an advisor.`;
                openWhatsAppChat(DEFAULT_CONTACT_PHONE, msg);
              }}
              className="text-emerald-400 hover:text-emerald-300 transition-colors uppercase font-bold tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3 h-3" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={onOpenContactModal}
              className="text-white/80 hover:text-white transition-colors cursor-pointer uppercase tracking-wider hidden sm:flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-[#c4a47c]" />
              <span>{DISPLAY_CONTACT_PHONE}</span>
            </button>

            <button
              onClick={onOpenShareModal}
              className="text-white/80 hover:text-white transition-colors cursor-pointer uppercase tracking-wider hidden md:flex items-center gap-1"
              title="Share app with friends"
            >
              <Share2 className="w-3 h-3 text-[#c4a47c]" />
              <span>Share</span>
            </button>

            {/* Direct Gateway to Private Dashboards for Owner, Developer & Staff */}
            {!activeSession && (
              <button
                onClick={() => onOpenAuthModal('private')}
                className="text-[#c4a47c] hover:text-white transition-colors cursor-pointer uppercase font-bold tracking-wider flex items-center gap-1 px-2.5 py-0.5 border border-[#c4a47c]/70 hover:border-[#c4a47c] bg-[#1a1a1a] shadow-xs text-[10px]"
                title="Authorized Private Dashboards: Owner, Developer & Staff"
              >
                <Lock className="w-2.5 h-2.5 text-[#c4a47c]" />
                <span>Private Dashboards 🔒</span>
              </button>
            )}

            {/* ONLY AUTHORIZED ROLES SEE INTERNAL MENUS (Owner / Developer / Staff) */}
            {isOwner && onOpenOwnerConsole && (
              <button
                onClick={onOpenOwnerConsole}
                className="bg-[#c4a47c] text-black hover:bg-[#b09066] transition-colors cursor-pointer uppercase font-black tracking-wider flex items-center gap-1 px-2.5 py-0.5 border border-black shadow-xs"
                title="App Owner Master Console"
              >
                <Crown className="w-3 h-3 text-black" />
                <span>Owner Console</span>
              </button>
            )}

            {isDeveloper && onOpenDeveloperConsole && (
              <button
                onClick={onOpenDeveloperConsole}
                className="text-cyan-300 hover:text-white transition-colors cursor-pointer uppercase font-bold tracking-wider flex items-center gap-1 bg-cyan-950/80 px-2 py-0.5 border border-cyan-500/50 hover:border-cyan-400"
                title="Developer Technical Console"
              >
                <Terminal className="w-2.5 h-2.5 text-cyan-400" />
                <span>Dev Tech</span>
              </button>
            )}

            {isStaff && onOpenStaffConsole && (
              <button
                onClick={onOpenStaffConsole}
                className="text-emerald-300 hover:text-white transition-colors cursor-pointer uppercase font-bold tracking-wider flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 border border-emerald-500/50 hover:border-emerald-400"
                title="Staff & Relationship Manager Dashboard"
              >
                <Users className="w-2.5 h-2.5 text-emerald-400" />
                <span>Staff CRM</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand & City Selector */}
        <div className="flex items-center gap-4">
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="font-mono-luxury bg-[#1a1a1a] text-[#fdfcf9] px-2.5 py-1.5 font-black text-sm tracking-widest uppercase border border-[#1a1a1a]">
              NS
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-luxury text-2xl font-bold tracking-tight text-[#1a1a1a]">
                  NS Properties
                </span>
                <span className="font-mono-luxury text-[10px] text-[#c4a47c] font-bold tracking-widest uppercase border border-[#c4a47c]/50 px-1 py-0.2">
                  PRO
                </span>
              </div>
              <p className="font-mono-luxury text-[9px] text-[#1a1a1a]/60 uppercase tracking-widest">
                Search • Buy • Rent
              </p>
            </div>
          </div>

          {/* City Selector */}
          <div className="relative">
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-luxury text-[#1a1a1a] bg-[#fdfcf9] hover:bg-white border border-[#1a1a1a] cursor-pointer transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#c4a47c]" />
              <span className="font-bold">{selectedCity}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#1a1a1a]/60" />
            </button>

            {cityDropdownOpen && (
              <div 
                className="absolute left-0 top-full mt-1.5 w-48 bg-[#fdfcf9] border border-[#1a1a1a] shadow-xl py-1 z-50 animate-in fade-in"
                onMouseLeave={() => setCityDropdownOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] font-mono-luxury uppercase text-[#1a1a1a]/50 tracking-wider">
                  Select Metro City
                </div>
                {TOP_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      onSelectCity(city);
                      setCityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-mono-luxury transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCity === city
                        ? 'bg-[#1a1a1a] text-[#fdfcf9] font-bold'
                        : 'text-[#1a1a1a] hover:bg-[#1a1a1a]/10'
                    }`}
                  >
                    {city}
                    {selectedCity === city && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c4a47c]"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Category Navigation Tabs */}
          {onSelectCategory && (
            <nav className="hidden xl:flex items-center gap-1 border-l border-[#1a1a1a]/20 pl-4 font-mono-luxury text-xs">
              <button
                onClick={() => onSelectCategory('apartments')}
                className={`px-2.5 py-1 uppercase font-bold transition-colors cursor-pointer ${
                  activeCategory === 'apartments'
                    ? 'text-black border-b-2 border-black'
                    : 'text-[#1a1a1a]/60 hover:text-black'
                }`}
              >
                Apartments
              </button>
              <button
                onClick={() => onSelectCategory('plots')}
                className={`px-2.5 py-1 uppercase font-bold transition-colors cursor-pointer ${
                  activeCategory === 'plots'
                    ? 'text-black border-b-2 border-black'
                    : 'text-[#1a1a1a]/60 hover:text-black'
                }`}
              >
                Plots & Land
              </button>
              <button
                onClick={() => onSelectCategory('commercial')}
                className={`px-2.5 py-1 uppercase font-bold transition-colors cursor-pointer ${
                  activeCategory === 'commercial'
                    ? 'text-black border-b-2 border-black'
                    : 'text-[#1a1a1a]/60 hover:text-black'
                }`}
              >
                Commercial
              </button>
              <button
                onClick={() => onSelectCategory('projects')}
                className={`px-2.5 py-1 uppercase font-bold transition-colors cursor-pointer ${
                  activeCategory === 'projects'
                    ? 'text-black border-b-2 border-black'
                    : 'text-[#1a1a1a]/60 hover:text-black'
                }`}
              >
                Projects
              </button>
            </nav>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Special Offers & Deals */}
          {onOpenOffers && (
            <button
              onClick={onOpenOffers}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-luxury uppercase text-[#1a1a1a] hover:bg-[#c4a47c]/15 border border-[#c4a47c]/70 hover:border-[#c4a47c] transition-all cursor-pointer font-bold"
              title="Exclusive Property Offers & Deals"
            >
              <Tag className="w-3.5 h-3.5 text-[#c4a47c]" />
              <span className="hidden sm:inline">Offers</span>
              <span className="bg-[#c4a47c] text-black text-[9px] px-1 py-0.2 font-black">DEALS</span>
            </button>
          )}

          {/* Subscription Plans */}
          {onOpenPlansModal && (
            <button
              onClick={onOpenPlansModal}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono-luxury uppercase text-[#1a1a1a] hover:bg-gray-100 border border-[#1a1a1a]/30 transition-all cursor-pointer"
              title="Agent & Builder Subscription Plans"
            >
              <Crown className="w-3.5 h-3.5 text-[#c4a47c]" />
              <span>Plans</span>
            </button>
          )}

          {/* Post Free Property Button */}
          <button
            onClick={onOpenPostProperty}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-luxury uppercase text-[#1a1a1a] hover:bg-[#1a1a1a]/5 border border-[#1a1a1a] transition-all cursor-pointer"
            title="Post Free Property Ad"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span>Post Ad</span>
          </button>

          {/* Compare Button */}
          <button
            onClick={onOpenCompare}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono-luxury uppercase text-[#1a1a1a] hover:bg-[#1a1a1a]/5 border border-transparent hover:border-[#1a1a1a]/20 transition-all cursor-pointer"
            title="Compare Properties"
          >
            <Scale className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Compare</span>
            {compareCount > 0 && (
              <span className="bg-[#1a1a1a] text-[#fdfcf9] text-[9px] font-bold px-1.5 py-0.2">
                {compareCount}
              </span>
            )}
          </button>

          {/* Saved Properties (Shortlist) */}
          <button
            onClick={onOpenSaved}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono-luxury uppercase text-[#1a1a1a] hover:bg-[#1a1a1a]/5 border border-transparent hover:border-[#1a1a1a]/20 transition-all cursor-pointer"
            title="Saved Properties"
          >
            <Heart className={`w-3.5 h-3.5 ${savedCount > 0 ? 'text-red-600 fill-red-600' : ''}`} />
            <span className="hidden md:inline">Saved</span>
            {savedCount > 0 && (
              <span className="bg-[#1a1a1a] text-[#fdfcf9] text-[9px] font-bold px-1.5 py-0.2">
                {savedCount}
              </span>
            )}
          </button>

          {/* Contact NS Properties */}
          <button
            onClick={onOpenContactModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-luxury uppercase text-[#1a1a1a] hover:bg-[#1a1a1a]/5 border border-[#1a1a1a]/30 hover:border-[#1a1a1a] transition-all cursor-pointer"
            title="Contact NS Properties"
          >
            <Phone className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span className="hidden sm:inline">Contact NS</span>
          </button>

          {/* ========================================================================= */}
          {/* USER AUTHENTICATION & PRIVATE DASHBOARDS */}
          {/* Normal users see Login / Register. Authorized roles see their dashboard. */}
          {/* ========================================================================= */}
          {activeSession ? (
            <div className="relative">
              {/* Authorized Owner Button */}
              {isOwner && onOpenOwnerConsole && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onOpenOwnerConsole}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-luxury uppercase bg-[#1a1a1a] hover:bg-black text-[#c4a47c] border border-[#c4a47c] transition-all cursor-pointer font-bold shadow-xs"
                    title="Open App Owner Master Control Console"
                  >
                    <Crown className="w-3.5 h-3.5 text-[#c4a47c]" />
                    <span>Owner Dashboard</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="p-1.5 text-gray-500 hover:text-red-600 border border-transparent hover:border-gray-300 transition-colors cursor-pointer"
                    title="Logout Owner Session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Authorized Developer Button */}
              {isDeveloper && onOpenDeveloperConsole && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onOpenDeveloperConsole}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-luxury uppercase bg-[#020617] hover:bg-[#0a0f1d] text-cyan-300 border border-cyan-500 transition-all cursor-pointer font-bold shadow-xs"
                    title="Open Developer Technical Dashboard (9 Subsystems)"
                  >
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Dev Dashboard</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="p-1.5 text-gray-500 hover:text-red-600 border border-transparent hover:border-gray-300 transition-colors cursor-pointer"
                    title="Logout Developer Session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Authorized Staff Button */}
              {isStaff && onOpenStaffConsole && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onOpenStaffConsole}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-luxury uppercase bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500 transition-all cursor-pointer font-bold shadow-xs"
                    title="Open Staff & Relationship Manager Dashboard"
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Staff Dashboard</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="p-1.5 text-gray-500 hover:text-red-600 border border-transparent hover:border-gray-300 transition-colors cursor-pointer"
                    title="Logout Staff Session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Normal Logged-in Buyer / Seller */}
              {!isOwner && !isDeveloper && !isStaff && (
                <div className="flex items-center gap-1.5">
                  {/* Direct 1-Click My Account / Activity Hub button */}
                  <button
                    onClick={() => onOpenUserHub?.('activity')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-luxury bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] border border-[#1a1a1a] transition-all cursor-pointer font-bold shadow-xs tracking-wider"
                    title="Open My Activity & Profile Hub"
                  >
                    <User className="w-3.5 h-3.5 text-[#c4a47c]" />
                    <span className="truncate max-w-[120px]">{activeSession.name.split(' ')[0]} (My Account)</span>
                  </button>

                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="p-1.5 bg-white border border-[#1a1a1a] hover:bg-black/5 cursor-pointer font-bold"
                    title="User Account Options"
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-gray-700" />
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 top-full mt-1.5 w-64 bg-[#fdfcf9] border border-[#1a1a1a] shadow-xl py-2 z-50 font-mono-luxury text-xs divide-y divide-gray-100"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-3 py-1.5 mb-1 bg-gray-50 border-b border-[#1a1a1a]/15">
                        <span className="font-bold text-[#1a1a1a] block truncate">{activeSession.name}</span>
                        <span className="text-[10px] text-[#c4a47c] font-black uppercase tracking-wider">{activeSession.role} • VERIFIED ACCOUNT</span>
                      </div>

                      {/* ACTIVITY GROUP */}
                      <div className="py-1">
                        <div className="px-3 py-0.5 text-[9px] uppercase font-bold text-gray-400">
                          My Activity
                        </div>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenUserHub?.('activity', 'contacted');
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-[#c4a47c]" />
                            <span>Contacted Properties</span>
                          </span>
                          <span className="text-[10px] text-gray-400">Inquiries</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenUserHub?.('activity', 'shortlisted');
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                            <span>Shortlisted Properties ({savedCount})</span>
                          </span>
                          <span className="text-[10px] text-gray-400">Saved</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenUserHub?.('activity', 'viewed');
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            <span>Viewed History</span>
                          </span>
                          <span className="text-[10px] text-gray-400">Recently Browsed</span>
                        </button>
                      </div>

                      {/* ACCOUNT MANAGEMENT & SERVICES */}
                      <div className="py-1">
                        <div className="px-3 py-0.5 text-[9px] uppercase font-bold text-gray-400">
                          Account & Services
                        </div>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenUserHub?.('profile');
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center gap-2 cursor-pointer font-bold text-[#1a1a1a]"
                        >
                          <User className="w-3.5 h-3.5 text-[#005CA8]" />
                          <span>Manage Profile</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenUserHub?.('service');
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center gap-2 cursor-pointer"
                        >
                          <Headphones className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Customer Service (24/7 Desk)</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenUserHub?.('feedback');
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center gap-2 cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 text-amber-500" />
                          <span>Give Feedback</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenUserHub?.('security');
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center gap-2 cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                          <span>Change Password</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenUserHub?.('communication');
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center gap-2 cursor-pointer"
                        >
                          <Bell className="w-3.5 h-3.5 text-rose-600" />
                          <span>Communication Settings</span>
                        </button>
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer font-bold"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* PUBLIC USER WHEN LOGGED OUT: Normal Login / Register Button only */
            <button
              onClick={() => onOpenAuthModal('public')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono-luxury uppercase bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] border border-[#1a1a1a] transition-all cursor-pointer font-bold shadow-xs tracking-wider"
              title="Sign In or Register for NS Properties"
            >
              <User className="w-3.5 h-3.5 text-[#c4a47c]" />
              <span>Login / Register</span>
            </button>
          )}

          {/* Download App CTA */}
          <button
            onClick={onOpenDownloadModal}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-luxury uppercase bg-[#c4a47c] text-black hover:bg-[#b09066] border border-[#1a1a1a] font-black transition-colors cursor-pointer"
            title="Install NS Properties App on Mobile/Desktop"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span className="hidden xl:inline">Install App</span>
          </button>
        </div>
      </div>
    </header>
  );
};
