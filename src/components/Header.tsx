import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Heart, 
  Scale, 
  Calculator, 
  TrendingUp, 
  PlusCircle, 
  MapPin, 
  ChevronDown, 
  ChevronRight,
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
  Tag,
  Menu,
  X,
  FileText,
  CheckCircle2,
  Eye,
  ArrowRight,
  Laptop,
  Globe,
  FileCode2
} from 'lucide-react';
import { TOP_CITIES } from '../data/properties';
import { openWhatsAppChat, DEFAULT_CONTACT_PHONE, DISPLAY_CONTACT_PHONE } from '../utils/whatsapp';
import { AppUserSession } from '../utils/appAuthService';
import { AppProfileLogo } from './AppProfileLogo';

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
  onOpenUserHub?: (tab?: 'activity' | 'profile' | 'service' | 'feedback' | 'security' | 'communication', subTab?: 'contacted' | 'shortlisted' | 'viewed' | 'brochures' | 'offers') => void;
  activeCategory?: string;
  onSelectCategory?: (cat: 'apartments' | 'plots' | 'commercial' | 'projects') => void;
  onOpenPlansModal?: () => void;
  onOpenOffers?: () => void;
  onOpenSettings?: () => void;
  onOpenPlayStorePublish?: () => void;
  onOpenDomainModal?: () => void;
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
  onOpenOffers,
  onOpenSettings,
  onOpenPlayStorePublish,
  onOpenDomainModal
}) => {
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserMenuOpen(false);
        setCityDropdownOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userMenuOpen]);

  const isOwner = activeSession?.role === 'owner';
  const isDeveloper = activeSession?.role === 'developer';
  const isStaff = activeSession?.role === 'staff';

  return (
    <header className="sticky top-0 z-40 bg-[#fdfcf9] border-b-[1.5px] border-[#1a1a1a]">
      {/* Top micro bar with Architectural Luxury styling */}
      <div className="bg-[#1a1a1a] text-[#fdfcf9] py-1.5 sm:py-2 px-3 sm:px-6 lg:px-8 text-xs font-mono-luxury border-b border-black w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] tracking-wider uppercase truncate">
            <span className="text-white/60 truncate">India's Trusted Property Network</span>
            <span className="hidden sm:inline-block text-white/30">•</span>
            <span className="text-[#c4a47c] font-bold hidden xs:inline-block">100% RERA Verified</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-[11px] flex-wrap justify-end">
            <button 
              onClick={onOpenMarketTrends}
              className="text-white/80 hover:text-white transition-colors cursor-pointer uppercase tracking-wider hidden md:flex items-center gap-1"
            >
              <TrendingUp className="w-3 h-3 text-[#c4a47c]" />
              <span>Trends</span>
            </button>

            <button 
              onClick={onOpenEmiCalc}
              className="text-white/80 hover:text-white transition-colors cursor-pointer uppercase tracking-wider hidden sm:flex items-center gap-1"
            >
              <Calculator className="w-3 h-3 text-[#c4a47c]" />
              <span>EMI</span>
            </button>

            <button
              onClick={onOpenVisits}
              className="text-white/80 hover:text-white transition-colors cursor-pointer uppercase tracking-wider flex items-center gap-1"
            >
              <CalendarCheck className="w-3 h-3 text-[#c4a47c]" />
              <span>Visits {scheduledVisitsCount > 0 && `(${scheduledVisitsCount})`}</span>
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
              className="text-white/80 hover:text-white transition-colors cursor-pointer uppercase tracking-wider hidden lg:flex items-center gap-1"
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

            {/* Google Play Store Publishing & App Bundle Button */}
            {onOpenPlayStorePublish && (
              <button
                onClick={onOpenPlayStorePublish}
                className="bg-emerald-900/90 text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer uppercase font-bold tracking-wider flex items-center gap-1 px-2 py-0.5 border border-emerald-500/60 shadow-xs text-[10px]"
                title="Google Play Store Publishing Console & .AAB Package Builder"
              >
                <Laptop className="w-2.5 h-2.5 text-emerald-400" />
                <span className="hidden xs:inline">Play Store</span>
                <span className="xs:hidden">App</span>
              </button>
            )}

            {/* Direct Gateway to Private Dashboards for Owner, Developer & Staff */}
            {!activeSession && (
              <button
                onClick={() => onOpenAuthModal('private')}
                className="text-[#c4a47c] hover:text-white transition-colors cursor-pointer uppercase font-bold tracking-wider flex items-center gap-1 px-2 py-0.5 border border-[#c4a47c]/70 hover:border-[#c4a47c] bg-[#1a1a1a] shadow-xs text-[10px]"
                title="Authorized Private Dashboards: Owner, Developer & Staff"
              >
                <Lock className="w-2.5 h-2.5 text-[#c4a47c]" />
                <span className="hidden sm:inline">Private Dashboards</span>
                <span className="sm:hidden">Portals</span>
              </button>
            )}

            {/* ONLY AUTHORIZED ROLES SEE INTERNAL MENUS (Owner / Developer / Staff) */}
            {isOwner && onOpenOwnerConsole && (
              <button
                onClick={onOpenOwnerConsole}
                className="bg-[#c4a47c] text-black hover:bg-[#b09066] transition-colors cursor-pointer uppercase font-black tracking-wider flex items-center gap-1 px-2 py-0.5 border border-black shadow-xs text-[10px]"
                title="App Owner Master Console"
              >
                <Crown className="w-3 h-3 text-black" />
                <span className="hidden xs:inline">Owner</span> Console
              </button>
            )}

            {isDeveloper && onOpenDeveloperConsole && (
              <button
                onClick={onOpenDeveloperConsole}
                className="text-cyan-300 hover:text-white transition-colors cursor-pointer uppercase font-bold tracking-wider flex items-center gap-1 bg-cyan-950/80 px-2 py-0.5 border border-cyan-500/50 hover:border-cyan-400 text-[10px]"
                title="Developer Technical Console"
              >
                <Terminal className="w-2.5 h-2.5 text-cyan-400" />
                <span>Dev</span>
              </button>
            )}

            {isStaff && onOpenStaffConsole && (
              <button
                onClick={onOpenStaffConsole}
                className="text-emerald-300 hover:text-white transition-colors cursor-pointer uppercase font-bold tracking-wider flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 border border-emerald-500/50 hover:border-emerald-400 text-[10px]"
                title="Staff & Relationship Manager Dashboard"
              >
                <Users className="w-2.5 h-2.5 text-emerald-400" />
                <span>Staff</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 w-full">
        {/* Brand & City Selector */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none shrink-0 group"
          >
            {/* 3D Architectural 4 App Profile Logo */}
            <AppProfileLogo size="md" showGlow={true} className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-105" />

            <div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-serif-luxury text-lg sm:text-2xl font-bold tracking-tight text-[#1a1a1a] whitespace-nowrap">
                  NS Properties
                </span>
                <span className="font-mono-luxury text-[9px] sm:text-[10px] text-[#c4a47c] font-bold tracking-widest uppercase border border-[#c4a47c]/50 px-1 py-0.2 shrink-0">
                  4 BHK & LUXE
                </span>
              </div>
              <p className="font-mono-luxury text-[8px] sm:text-[9px] text-[#1a1a1a]/60 uppercase tracking-widest hidden xs:block">
                Search • Buy • Rent
              </p>
            </div>
          </div>

          {/* City Selector */}
          <div className="relative shrink-0">
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-mono-luxury text-[#1a1a1a] bg-[#fdfcf9] hover:bg-white border border-[#1a1a1a] cursor-pointer transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#c4a47c] shrink-0" />
              <span className="font-bold truncate max-w-[80px] sm:max-w-none">{selectedCity}</span>
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1a1a1a]/60 shrink-0" />
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
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
          {/* Special Offers & Deals */}
          {onOpenOffers && (
            <button
              onClick={onOpenOffers}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono-luxury uppercase text-[#1a1a1a] hover:bg-[#c4a47c]/15 border border-[#c4a47c]/70 hover:border-[#c4a47c] transition-all cursor-pointer font-bold"
              title="Exclusive Property Offers & Deals"
            >
              <Tag className="w-3.5 h-3.5 text-[#c4a47c]" />
              <span className="hidden md:inline">Offers</span>
              <span className="bg-[#c4a47c] text-black text-[9px] px-1 py-0.2 font-black">DEALS</span>
            </button>
          )}

          {/* Subscription Plans */}
          {onOpenPlansModal && (
            <button
              onClick={onOpenPlansModal}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono-luxury uppercase text-[#1a1a1a] hover:bg-gray-100 border border-[#1a1a1a]/30 transition-all cursor-pointer font-bold"
              title="Agent & Builder Plans: Free Site Visits & Deals"
            >
              <Crown className="w-3.5 h-3.5 text-[#c4a47c]" />
              <span>Free Visit Plans</span>
            </button>
          )}

          {/* Google Play Store Console Trigger */}
          {onOpenPlayStorePublish && (
            <button
              onClick={onOpenPlayStorePublish}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono-luxury uppercase text-[#1a1a1a] hover:bg-emerald-50 border border-emerald-700/60 hover:border-emerald-700 transition-all cursor-pointer font-bold"
              title="Google Play Store Publishing Console & .AAB Package Builder"
            >
              <Laptop className="w-3.5 h-3.5 text-emerald-700" />
              <span>Google Play</span>
            </button>
          )}

          {/* Post Free Property Button */}
          <button
            onClick={onOpenPostProperty}
            className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-mono-luxury uppercase text-[#1a1a1a] hover:bg-[#1a1a1a]/5 border border-[#1a1a1a] transition-all cursor-pointer"
            title="Post Free Property Ad"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span className="hidden md:inline">Post Ad</span>
            <span className="md:hidden">Post</span>
          </button>

          {/* Compare Button */}
          <button
            onClick={onOpenCompare}
            className="hidden sm:flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-mono-luxury uppercase text-[#1a1a1a] hover:bg-[#1a1a1a]/5 border border-transparent hover:border-[#1a1a1a]/20 transition-all cursor-pointer"
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
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-mono-luxury uppercase text-[#1a1a1a] hover:bg-[#1a1a1a]/5 border border-transparent hover:border-[#1a1a1a]/20 transition-all cursor-pointer"
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
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-luxury uppercase text-[#1a1a1a] hover:bg-[#1a1a1a]/5 border border-[#1a1a1a]/30 hover:border-[#1a1a1a] transition-all cursor-pointer"
            title="Contact NS Properties"
          >
            <Phone className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span>Contact NS</span>
          </button>

          {/* ========================================================================= */}
          {/* USER AUTHENTICATION & COMPREHENSIVE USER MENU */}
          {/* Provides seamless user navigation for logged-in users and guests. */}
          {/* ========================================================================= */}
          <div className="relative" ref={userMenuRef}>
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Direct Console Shortcut for Authorized Roles */}
              {isOwner && onOpenOwnerConsole && (
                <button
                  onClick={onOpenOwnerConsole}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono-luxury uppercase bg-[#1a1a1a] hover:bg-black text-[#c4a47c] border border-[#c4a47c] transition-all cursor-pointer font-bold shadow-xs"
                  title="App Owner Master Console"
                >
                  <Crown className="w-3.5 h-3.5 text-[#c4a47c]" />
                  <span>Owner Console</span>
                </button>
              )}

              {isDeveloper && onOpenDeveloperConsole && (
                <button
                  onClick={onOpenDeveloperConsole}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono-luxury uppercase bg-[#020617] hover:bg-[#0a0f1d] text-cyan-300 border border-cyan-500 transition-all cursor-pointer font-bold shadow-xs"
                  title="Developer Technical Console"
                >
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dev Tech</span>
                </button>
              )}

              {isStaff && onOpenStaffConsole && (
                <button
                  onClick={onOpenStaffConsole}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono-luxury uppercase bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500 transition-all cursor-pointer font-bold shadow-xs"
                  title="Staff CRM Console"
                >
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Staff CRM</span>
                </button>
              )}

              {/* USER MENU TRIGGER BUTTON */}
              {activeSession ? (
                /* Logged In User Button */
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 text-xs font-mono-luxury bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] border border-[#1a1a1a] transition-all cursor-pointer font-bold shadow-xs tracking-wider"
                  title="Open User Navigation Menu"
                  aria-expanded={userMenuOpen}
                >
                  <Menu className="w-3.5 h-3.5 text-[#c4a47c]" />
                  <div className="w-5 h-5 rounded-full bg-[#c4a47c] text-black font-black text-[10px] flex items-center justify-center shrink-0">
                    {activeSession.name ? activeSession.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline font-bold">User Menu</span>
                  <span className="truncate max-w-[70px] sm:max-w-[90px] text-gray-300">({activeSession.name.split(' ')[0]})</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-300 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                /* Guest / Logged Out User Menu Button */
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <button
                    onClick={() => onOpenAuthModal('public')}
                    className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-mono-luxury uppercase bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] border border-[#1a1a1a] transition-all cursor-pointer font-bold shadow-xs tracking-wider"
                    title="Sign In or Register"
                  >
                    <User className="w-3.5 h-3.5 text-[#c4a47c]" />
                    <span>Sign In</span>
                  </button>

                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-mono-luxury uppercase bg-white hover:bg-gray-100 text-[#1a1a1a] border border-[#1a1a1a] transition-all cursor-pointer font-bold shadow-xs"
                    title="Open User Navigation Menu"
                    aria-expanded={userMenuOpen}
                  >
                    <Menu className="w-3.5 h-3.5 text-[#1a1a1a]" />
                    <span className="font-bold text-xs hidden xs:inline">Menu</span>
                    <ChevronDown className={`w-3 h-3 text-gray-600 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}
            </div>

            {/* =================================================================== */}
            {/* EXPANDABLE LUXURY USER MENU DROPDOWN PANEL */}
            {/* =================================================================== */}
            {userMenuOpen && (
              <div 
                className="absolute right-0 top-full mt-2 w-84 sm:w-96 max-w-[calc(100vw-20px)] bg-[#fdfcf9] border-2 border-[#1a1a1a] shadow-2xl z-50 font-mono-luxury text-xs max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-gray-200"
              >
                {/* 1. USER IDENTITY / WELCOME HEADER */}
                <div className="p-3.5 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] text-[#fdfcf9]">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="editorial-label text-[#c4a47c] text-[10px] font-bold uppercase tracking-wider">
                      User Navigation Menu
                    </span>
                    <button
                      onClick={() => setUserMenuOpen(false)}
                      className="text-gray-400 hover:text-white p-1 cursor-pointer transition-colors"
                      title="Close User Menu"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {activeSession ? (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#c4a47c] text-black font-black text-sm flex items-center justify-center shrink-0 border border-white">
                          {activeSession.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-serif-luxury font-bold text-sm text-white truncate">
                            {activeSession.name}
                          </h4>
                          <p className="text-[11px] text-gray-300 truncate">
                            {activeSession.email}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="bg-[#c4a47c] text-black text-[9px] font-black uppercase px-1.5 py-0.2">
                              {activeSession.role}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Verified Member</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenUserHub?.('activity');
                        }}
                        className="w-full py-1.5 px-3 bg-white/10 hover:bg-white/20 border border-white/20 text-[#c4a47c] font-bold text-xs uppercase flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span>Open My Account Hub</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-[#c4a47c] text-black flex items-center justify-center font-black text-xs">
                          NS
                        </div>
                        <div>
                          <h4 className="font-serif-luxury font-bold text-sm text-white">
                            Welcome to NS Properties
                          </h4>
                          <p className="text-[10px] text-gray-300">
                            Search, shortlist & claim verified luxury deals
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onOpenAuthModal('public');
                          }}
                          className="py-1.5 px-2 bg-[#c4a47c] hover:bg-[#b09066] text-black font-black uppercase text-xs text-center cursor-pointer transition-colors shadow-xs"
                        >
                          Sign In / Register
                        </button>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onOpenAuthModal('private');
                          }}
                          className="py-1.5 px-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold uppercase text-[10px] text-center cursor-pointer transition-colors"
                        >
                          Private Portals
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. ACTIVITY & SHORTLIST QUICK STATS */}
                <div className="grid grid-cols-3 divide-x divide-gray-200 bg-amber-50/60 text-center py-2 text-xs">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenSaved();
                    }}
                    className="px-2 py-1 hover:bg-amber-100/50 cursor-pointer transition-colors"
                    title="View Saved Properties"
                  >
                    <span className="text-[10px] text-gray-500 uppercase block font-bold">Saved</span>
                    <strong className="text-sm font-black text-black">{savedCount}</strong>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenVisits();
                    }}
                    className="px-2 py-1 hover:bg-amber-100/50 cursor-pointer transition-colors"
                    title="View Scheduled Visits"
                  >
                    <span className="text-[10px] text-emerald-800 uppercase block font-bold">Visits (Free)</span>
                    <strong className="text-sm font-black text-emerald-800">{scheduledVisitsCount}</strong>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenCompare();
                    }}
                    className="px-2 py-1 hover:bg-amber-100/50 cursor-pointer transition-colors"
                    title="Compare Properties"
                  >
                    <span className="text-[10px] text-gray-500 uppercase block font-bold">Compare</span>
                    <strong className="text-sm font-black text-black">{compareCount}/3</strong>
                  </button>
                </div>

                {/* 3. SECTION: MY ACTIVITY & PERSONAL HUB */}
                <div className="p-2 space-y-0.5">
                  <div className="px-2.5 py-1 text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                    My Activity & History
                  </div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenUserHub?.('activity', 'contacted');
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#c4a47c]" />
                      <span>Contacted Properties</span>
                    </span>
                    <span className="text-[10px] text-gray-400">Inquiries</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenSaved();
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Heart className={`w-3.5 h-3.5 ${savedCount > 0 ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                      <span>Shortlisted Properties</span>
                    </span>
                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.2 font-bold">{savedCount}</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenVisits();
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Scheduled Site Visits</span>
                    </span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2">
                      100% FREE
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenUserHub?.('activity', 'viewed');
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>Recently Viewed Properties</span>
                    </span>
                    <span className="text-[10px] text-gray-400">History</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenUserHub?.('activity', 'offers');
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-[#c4a47c]" />
                      <span>My Claimed Deals & Offers</span>
                    </span>
                    <span className="text-[9px] bg-[#c4a47c]/20 text-[#c4a47c] font-black px-1.5 py-0.2">DEALS</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenUserHub?.('activity', 'brochures');
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      <span>Downloaded Project Brochures</span>
                    </span>
                    <span className="text-[10px] text-gray-400">PDFs</span>
                  </button>
                </div>

                {/* 4. SECTION: LISTINGS, OFFERS & PLANS */}
                <div className="p-2 space-y-0.5">
                  <div className="px-2.5 py-1 text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                    Listings & Partner Plans
                  </div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenPostProperty();
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer transition-colors font-bold text-[#1a1a1a]"
                  >
                    <span className="flex items-center gap-2">
                      <PlusCircle className="w-3.5 h-3.5 text-[#c4a47c]" />
                      <span>Post Free Property Ad</span>
                    </span>
                    <span className="text-[9px] bg-black text-[#c4a47c] px-1.5 py-0.2 font-black">₹0 FREE</span>
                  </button>

                  {onOpenOffers && (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenOffers();
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-[#c4a47c]" />
                        <span>Special Offers & Festive Deals</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold">Discounts</span>
                    </button>
                  )}

                  {onOpenPlansModal && (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenPlansModal();
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Crown className="w-3.5 h-3.5 text-[#c4a47c]" />
                        <span>Agent & Builder Plans</span>
                      </span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2">Free Visits</span>
                    </button>
                  )}
                </div>

                {/* 5. SECTION: CALCULATORS & TOOLS */}
                <div className="p-2 space-y-0.5">
                  <div className="px-2.5 py-1 text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                    Calculators & Research
                  </div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenEmiCalc();
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Calculator className="w-3.5 h-3.5 text-[#c4a47c]" />
                      <span>Home Loan EMI Calculator</span>
                    </span>
                    <span className="text-[10px] text-gray-400">Finance</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenMarketTrends();
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-[#c4a47c]" />
                      <span>City Price Trends & Heatmaps</span>
                    </span>
                    <span className="text-[10px] text-gray-400">Trends</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenCompare();
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Scale className="w-3.5 h-3.5 text-[#c4a47c]" />
                      <span>Compare Properties</span>
                    </span>
                    <span className="text-[10px] text-gray-400">{compareCount}/3</span>
                  </button>
                </div>

                {/* 6. SECTION: CUSTOMER SUPPORT & APP SETTINGS */}
                <div className="p-2 space-y-0.5">
                  <div className="px-2.5 py-1 text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                    Support & Preferences
                  </div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenUserHub?.('service');
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Headphones className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Customer Service Desk (24/7)</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">Online</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      const msg = `Hello NS Properties Concierge, I would like assistance with luxury property search.`;
                      openWhatsAppChat(DEFAULT_CONTACT_PHONE, msg);
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Concierge Chat</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">Instant</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenContactModal();
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#c4a47c]" />
                      <span>Contact NS Properties</span>
                    </span>
                    <span className="text-[10px] text-gray-400">{DISPLAY_CONTACT_PHONE}</span>
                  </button>

                  {onOpenSettings && (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenSettings();
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Settings className="w-3.5 h-3.5 text-gray-600" />
                        <span>Preferences & Settings</span>
                      </span>
                    </button>
                  )}

                  {activeSession && (
                    <>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenUserHub?.('profile');
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-[#005CA8]" />
                        <span>Manage Profile Details</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenUserHub?.('security');
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                        <span>Change Password & Security</span>
                      </button>
                    </>
                  )}

                  {onOpenPlayStorePublish && (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenPlayStorePublish();
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-emerald-50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Laptop className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="font-bold text-emerald-950">Google Play Store Console (.AAB)</span>
                      </span>
                      <span className="text-[9px] bg-emerald-700 text-white px-1.5 py-0.2 font-bold">ANDROID</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenDownloadModal();
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-3.5 h-3.5 text-black" />
                      <span>Install App on Device (PWA)</span>
                    </span>
                    <span className="text-[9px] bg-black text-white px-1.5 py-0.2 font-bold">APP</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenDownloadModal();
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FileCode2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Download App Code (.ZIP)</span>
                    </span>
                    <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 font-bold">CODE</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenShareModal();
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[#1a1a1a]/5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Share2 className="w-3.5 h-3.5 text-[#c4a47c]" />
                      <span>Share NS Properties</span>
                    </span>
                  </button>
                </div>

                {/* 7. SECTION: AUTHORIZED CONSOLES (ROLE-BASED) */}
                {(isOwner || isDeveloper || isStaff) && (
                  <div className="p-2 bg-gray-50/80 space-y-1">
                    <div className="px-2.5 py-1 text-[9px] uppercase font-bold text-gray-500 tracking-wider">
                      Authorized Administration
                    </div>

                    {isOwner && onOpenOwnerConsole && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenOwnerConsole();
                        }}
                        className="w-full text-left px-2.5 py-1.5 bg-[#c4a47c]/20 hover:bg-[#c4a47c]/30 text-black border border-[#c4a47c] flex items-center justify-between cursor-pointer transition-colors font-bold"
                      >
                        <span className="flex items-center gap-2">
                          <Crown className="w-3.5 h-3.5 text-amber-700" />
                          <span>App Owner Master Console</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {isDeveloper && onOpenDeveloperConsole && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenDeveloperConsole();
                        }}
                        className="w-full text-left px-2.5 py-1.5 bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-500 flex items-center justify-between cursor-pointer transition-colors font-bold"
                      >
                        <span className="flex items-center gap-2">
                          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Developer Technical Console (9 Tools)</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {isStaff && onOpenStaffConsole && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenStaffConsole();
                        }}
                        className="w-full text-left px-2.5 py-1.5 bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-500 flex items-center justify-between cursor-pointer transition-colors font-bold"
                      >
                        <span className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Staff & Relationship Manager CRM</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                {/* 8. FOOTER SESSION ACTION */}
                <div className="p-3 bg-gray-50 flex items-center justify-between gap-2">
                  {activeSession ? (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout ({activeSession.name.split(' ')[0]})</span>
                    </button>
                  ) : (
                    <div className="w-full text-center text-[10px] text-gray-500 font-mono-luxury">
                      <span className="text-[#1a1a1a] font-bold">NS Properties</span> • 100% Free Visits & RERA Compliant
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

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
