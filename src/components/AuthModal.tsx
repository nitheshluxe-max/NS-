import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Crown, 
  Terminal, 
  Users, 
  User,
  UserCheck, 
  ShieldCheck, 
  Key, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { 
  loginOwner, 
  loginDeveloper, 
  loginStaff, 
  loginUser, 
  AppUserSession,
  OWNER_CREDENTIALS,
  DEVELOPER_CREDENTIALS,
  STAFF_CREDENTIALS
} from '../utils/appAuthService';
import { UserAccount } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (session: AppUserSession, openDashboardType?: 'owner' | 'developer' | 'staff') => void;
  usersList?: UserAccount[];
  initialTab?: 'public' | 'private';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  usersList = [],
  initialTab = 'public'
}) => {
  const [mainTab, setMainTab] = useState<'public' | 'private'>(initialTab);
  
  // Public user auth state
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [userName, setUserName] = useState('');
  const [userIdentifier, setUserIdentifier] = useState('');
  const [userRole, setUserRole] = useState<'buyer' | 'seller'>('buyer');
  const [userPassword, setUserPassword] = useState('');

  // Private Dashboard login state
  const [privateRole, setPrivateRole] = useState<'owner' | 'developer' | 'staff'>('owner');
  const [privateCredential, setPrivateCredential] = useState('');
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Handle Public User Sign In / Register
  const handlePublicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      // Smart Authorization detection for Owner, Developer, Staff
      const trimmedInput = userIdentifier.trim();
      if (trimmedInput === '1984' || trimmedInput.toLowerCase() === 'nitheshluxe@gmail.com' || trimmedInput === '9845012345') {
        const res = await loginOwner('1984');
        if (res.success && res.session) {
          setSuccessMessage('Owner credentials authorized. Opening Owner Master Console...');
          setTimeout(() => {
            onAuthSuccess(res.session!, 'owner');
            onClose();
          }, 500);
          return;
        }
      }
      if (trimmedInput === '2409' || trimmedInput.toLowerCase() === 'dev@nsprops.internal' || trimmedInput === '9886024090') {
        const res = await loginDeveloper('2409');
        if (res.success && res.session) {
          setSuccessMessage('Developer credentials authorized. Opening Developer Dashboard...');
          setTimeout(() => {
            onAuthSuccess(res.session!, 'developer');
            onClose();
          }, 500);
          return;
        }
      }
      if (trimmedInput === '5566' || trimmedInput.toLowerCase() === 'vikram.staff@nsprops.internal' || trimmedInput === '9876543210') {
        const res = await loginStaff('5566', usersList);
        if (res.success && res.session) {
          setSuccessMessage('Staff credentials authorized. Opening Staff Dashboard...');
          setTimeout(() => {
            onAuthSuccess(res.session!, 'staff');
            onClose();
          }, 500);
          return;
        }
      }

      const res = await loginUser(userIdentifier, isRegisterMode ? userName : undefined, userRole);
      if (res.success && res.session) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          onAuthSuccess(res.session!);
          onClose();
        }, 600);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('Failed to sign in. Please verify your details.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Buyer Login
  const handleQuickDemoBuyer = async () => {
    setIsLoading(true);
    setErrorMessage('');
    const res = await loginUser('amitabh.s@fintechcorp.com', 'Amitabh Sengupta (Tech Executive)', 'buyer');
    setIsLoading(false);
    if (res.success && res.session) {
      setSuccessMessage('Logged in as verified buyer (Amitabh Sengupta)');
      setTimeout(() => {
        onAuthSuccess(res.session!);
        onClose();
      }, 500);
    }
  };

  // Handle Private Dashboards Authorization (Owner, Developer, Staff)
  const handlePrivateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (privateRole === 'owner') {
        const res = await loginOwner(privateCredential);
        if (res.success && res.session) {
          setSuccessMessage(res.message);
          setTimeout(() => {
            onAuthSuccess(res.session!, 'owner');
            onClose();
          }, 600);
          return;
        } else {
          setErrorMessage(res.message);
        }
      } else if (privateRole === 'developer') {
        const res = await loginDeveloper(privateCredential);
        if (res.success && res.session) {
          setSuccessMessage(res.message);
          setTimeout(() => {
            onAuthSuccess(res.session!, 'developer');
            onClose();
          }, 600);
          return;
        } else {
          setErrorMessage(res.message);
        }
      } else if (privateRole === 'staff') {
        const res = await loginStaff(privateCredential, usersList);
        if (res.success && res.session) {
          setSuccessMessage(res.message);
          setTimeout(() => {
            onAuthSuccess(res.session!, 'staff');
            onClose();
          }, 600);
          return;
        } else {
          setErrorMessage(res.message);
        }
      }
    } catch {
      setErrorMessage('Authentication request failed. Please check network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-[#fdfcf9] border-2 border-[#1a1a1a] shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] px-6 py-4 flex items-center justify-between border-b-2 border-[#c4a47c]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#c4a47c] text-black font-mono-luxury font-black flex items-center justify-center text-xs">
              NS
            </div>
            <div>
              <h2 className="font-serif-luxury text-xl font-bold tracking-tight text-white">
                {mainTab === 'private' ? 'Authorized Management Portal' : 'NS Properties'}
              </h2>
              <p className="font-mono-luxury text-[11px] text-[#c4a47c] uppercase tracking-wider">
                {mainTab === 'private' ? 'Executive & Technical Management' : isRegisterMode ? 'Create Free Account' : 'Sign In with Mobile / Email'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Tab Switcher */}
        <div className="grid grid-cols-2 bg-[#f4f1ea] border-b border-[#1a1a1a] font-mono-luxury text-xs font-bold">
          <button
            onClick={() => {
              setMainTab('public');
              setErrorMessage('');
            }}
            className={`py-3 px-3 text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              mainTab === 'public'
                ? 'bg-white text-black border-b-2 border-black'
                : 'text-[#1a1a1a]/60 hover:text-black'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Buyer / User Login</span>
          </button>

          <button
            onClick={() => {
              setMainTab('private');
              setErrorMessage('');
            }}
            className={`py-3 px-3 text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              mainTab === 'private'
                ? 'bg-[#1a1a1a] text-[#c4a47c] border-b-2 border-[#c4a47c]'
                : 'text-[#1a1a1a]/80 hover:text-black bg-[#c4a47c]/15 font-black'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-[#c4a47c]" />
            <span>Private Dashboards</span>
          </button>
        </div>

        {/* Alert Notifications */}
        {errorMessage && (
          <div className="bg-red-50 border-b border-red-200 text-red-700 px-6 py-2.5 text-xs font-mono-luxury flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 px-6 py-2.5 text-xs font-mono-luxury flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB 1: PUBLIC CUSTOMER / USER LOGIN & REGISTER */}
        {mainTab === 'public' && (
          <div className="p-6 space-y-5 font-mono-luxury text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]/15">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#1a1a1a]">
                  {isRegisterMode ? 'Create Free Buyer / Seller Account' : 'Welcome Back, Sign In'}
                </h3>
                <p className="text-[11px] text-[#1a1a1a]/60 mt-0.5">
                  Save shortlist properties, schedule site visits, and direct contact owners.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setErrorMessage('');
                }}
                className="text-[11px] text-[#005CA8] hover:underline font-bold cursor-pointer"
              >
                {isRegisterMode ? 'Already registered? Sign In' : 'New here? Register free'}
              </button>
            </div>

            <form onSubmit={handlePublicSubmit} className="space-y-3.5">
              {isRegisterMode && (
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#1a1a1a] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs focus:outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#1a1a1a] mb-1">
                  Mobile Number or Email Address *
                </label>
                <input
                  type="text"
                  required
                  value={userIdentifier}
                  onChange={(e) => setUserIdentifier(e.target.value)}
                  placeholder="e.g. 9845012345 or user@gmail.com"
                  className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs focus:outline-hidden"
                />
              </div>

              {isRegisterMode && (
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#1a1a1a] mb-1">
                    I am a *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setUserRole('buyer')}
                      className={`py-2 px-3 text-center border font-bold text-xs cursor-pointer transition-colors ${
                        userRole === 'buyer'
                          ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                      }`}
                    >
                      Home Buyer / Tenant
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserRole('seller')}
                      className={`py-2 px-3 text-center border font-bold text-xs cursor-pointer transition-colors ${
                        userRole === 'seller'
                          ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                      }`}
                    >
                      Property Owner / Seller
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#1a1a1a] mb-1">
                  Password or OTP PIN
                </label>
                <input
                  type="password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  placeholder="Enter your password / PIN"
                  className="w-full px-3 py-2 border border-[#1a1a1a] bg-white text-xs focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#1a1a1a] hover:bg-black text-white font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-sm mt-2"
              >
                {isLoading ? 'Verifying...' : isRegisterMode ? 'Create Account & Continue' : 'Sign In to NS Properties'}
              </button>
            </form>

            {/* Quick Demo Buyer Shortcut */}
            <div className="pt-3 border-t border-[#1a1a1a]/15">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block text-center mb-2">
                Fast Testing Shortcut
              </span>
              <button
                type="button"
                onClick={handleQuickDemoBuyer}
                disabled={isLoading}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold uppercase text-[11px] flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Instant 1-Click Buyer Login (Demo)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMainTab('private');
                  setErrorMessage('');
                }}
                className="w-full py-2 bg-[#1a1a1a] hover:bg-black text-[#c4a47c] border border-[#c4a47c]/60 font-bold uppercase text-[11px] flex items-center justify-center gap-2 cursor-pointer transition-colors tracking-wider mt-2"
              >
                <Lock className="w-3.5 h-3.5 text-[#c4a47c]" />
                <span>Authorized Owner, Developer & Staff Login →</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: PRIVATE DASHBOARDS (OWNER, DEVELOPER, STAFF) */}
        {mainTab === 'private' && (
          <div className="p-6 space-y-5 font-mono-luxury text-xs bg-[#fdfcf9]">
            {/* Warning Shield Banner */}
            <div className="bg-[#1a1a1a] text-[#fdfcf9] p-3 border-l-4 border-[#c4a47c] flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-[#c4a47c] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase text-[11px] text-[#c4a47c] block">
                  Restricted Administrative & Engineering Gateway
                </span>
                <p className="text-[10px] text-white/70 mt-0.5 leading-relaxed">
                  Only authorized personnel with verified cryptographic credentials can access private dashboards. Normal public app users have zero visibility to internal systems.
                </p>
              </div>
            </div>

            {/* Role Selector Tabs (Owner, Developer, Staff) */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setPrivateRole('owner');
                  setPrivateCredential('');
                  setErrorMessage('');
                }}
                className={`p-3 text-center border-2 cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
                  privateRole === 'owner'
                    ? 'border-[#c4a47c] bg-[#1a1a1a] text-[#c4a47c]'
                    : 'border-[#1a1a1a]/20 bg-white text-[#1a1a1a]/80 hover:border-black'
                }`}
              >
                <Crown className={`w-5 h-5 ${privateRole === 'owner' ? 'text-[#c4a47c]' : 'text-[#1a1a1a]'}`} />
                <span className="font-bold uppercase text-[10px]">Owner Login</span>
                <span className="text-[9px] opacity-75">Master Superadmin</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPrivateRole('developer');
                  setPrivateCredential('');
                  setErrorMessage('');
                }}
                className={`p-3 text-center border-2 cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
                  privateRole === 'developer'
                    ? 'border-cyan-500 bg-[#020617] text-cyan-300'
                    : 'border-[#1a1a1a]/20 bg-white text-[#1a1a1a]/80 hover:border-black'
                }`}
              >
                <Terminal className={`w-5 h-5 ${privateRole === 'developer' ? 'text-cyan-400' : 'text-[#1a1a1a]'}`} />
                <span className="font-bold uppercase text-[10px]">Developer Login</span>
                <span className="text-[9px] opacity-75">Technical 9 Tools</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPrivateRole('staff');
                  setPrivateCredential('');
                  setErrorMessage('');
                }}
                className={`p-3 text-center border-2 cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
                  privateRole === 'staff'
                    ? 'border-emerald-500 bg-emerald-950 text-emerald-300'
                    : 'border-[#1a1a1a]/20 bg-white text-[#1a1a1a]/80 hover:border-black'
                }`}
              >
                <Users className={`w-5 h-5 ${privateRole === 'staff' ? 'text-emerald-400' : 'text-[#1a1a1a]'}`} />
                <span className="font-bold uppercase text-[10px]">Staff Login</span>
                <span className="text-[9px] opacity-75">Field Agent & CRM</span>
              </button>
            </div>

            {/* Target Dashboard Details Card */}
            <div className="bg-white border border-[#1a1a1a]/20 p-4">
              {privateRole === 'owner' && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="w-4 h-4 text-[#c4a47c]" />
                    <h4 className="font-serif-luxury font-bold text-base text-[#1a1a1a]">
                      App Owner Master Control Console
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#1a1a1a]/70 leading-relaxed">
                    Full unconditional authority: Add/Edit/Delete Properties, Pricing & Discounts, Media, Assign Leads, Sales Reports, Subscriptions, Staff & Developer Governance.
                  </p>
                </div>
              )}

              {privateRole === 'developer' && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Terminal className="w-4 h-4 text-cyan-600" />
                    <h4 className="font-serif-luxury font-bold text-base text-[#1a1a1a]">
                      Developer Technical Console (9 Subsystems)
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#1a1a1a]/70 leading-relaxed">
                    Developer Home, App Version Management, Server/API Status, Technical Logs, Error/Crash Reports, Database Tools, Push Notifications, Maintenance Mode, Developer Settings.
                  </p>
                </div>
              )}

              {privateRole === 'staff' && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-serif-luxury font-bold text-base text-[#1a1a1a]">
                      Staff & Relationship Manager Dashboard
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#1a1a1a]/70 leading-relaxed">
                    Assigned Customer Leads, Scheduled Property Site Visits, Inventory Inspector, and Walk-in Client Registration.
                  </p>
                </div>
              )}
            </div>

            {/* Login Form */}
            <form onSubmit={handlePrivateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#1a1a1a] mb-1">
                  {privateRole === 'owner'
                    ? 'Owner Master PIN or Owner Email *'
                    : privateRole === 'developer'
                    ? 'Developer Master PIN or Dev Key *'
                    : 'Staff PIN or Staff Email *'}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={privateCredential}
                    onChange={(e) => setPrivateCredential(e.target.value)}
                    placeholder={
                      privateRole === 'owner'
                        ? 'Enter Owner Master PIN (e.g. 1984)'
                        : privateRole === 'developer'
                        ? 'Enter Developer PIN (e.g. 2409)'
                        : 'Enter Staff PIN (e.g. 5566)'
                    }
                    className="w-full px-3 py-2.5 border-2 border-[#1a1a1a] bg-white text-xs font-mono-luxury focus:outline-hidden pr-10"
                    autoFocus
                  />
                  <Key className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                </div>
              </div>

              {/* Quick Fill Demo Helper Chips */}
              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                <span>Quick-Fill Helper:</span>
                {privateRole === 'owner' && (
                  <button
                    type="button"
                    onClick={() => setPrivateCredential(OWNER_CREDENTIALS.PIN)}
                    className="text-[#c4a47c] font-bold hover:underline cursor-pointer bg-[#1a1a1a] px-2 py-0.5"
                  >
                    Use Owner PIN: {OWNER_CREDENTIALS.PIN}
                  </button>
                )}
                {privateRole === 'developer' && (
                  <button
                    type="button"
                    onClick={() => setPrivateCredential(DEVELOPER_CREDENTIALS.PIN)}
                    className="text-cyan-400 font-bold hover:underline cursor-pointer bg-slate-900 px-2 py-0.5"
                  >
                    Use Dev PIN: {DEVELOPER_CREDENTIALS.PIN}
                  </button>
                )}
                {privateRole === 'staff' && (
                  <button
                    type="button"
                    onClick={() => setPrivateCredential(STAFF_CREDENTIALS.PIN)}
                    className="text-emerald-400 font-bold hover:underline cursor-pointer bg-emerald-950 px-2 py-0.5"
                  >
                    Use Staff PIN: {STAFF_CREDENTIALS.PIN}
                  </button>
                )}
              </div>

              {/* 1-Click Instant Login for Nithesh / Developer / Staff */}
              <div className="pt-2">
                {privateRole === 'owner' && (
                  <button
                    type="button"
                    onClick={async () => {
                      setIsLoading(true);
                      const res = await loginOwner(OWNER_CREDENTIALS.PIN);
                      setIsLoading(false);
                      if (res.success && res.session) {
                        setSuccessMessage('Owner access authorized! Opening Owner Master Console...');
                        setTimeout(() => {
                          onAuthSuccess(res.session!, 'owner');
                          onClose();
                        }, 500);
                      }
                    }}
                    className="w-full py-2.5 bg-[#c4a47c] hover:bg-[#b09066] text-black font-bold uppercase text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm border border-black mb-2 font-mono-luxury"
                  >
                    <Crown className="w-4 h-4 text-black" />
                    <span>1-Click Instant Owner Login (nitheshluxe@gmail.com)</span>
                  </button>
                )}

                {privateRole === 'developer' && (
                  <button
                    type="button"
                    onClick={async () => {
                      setIsLoading(true);
                      const res = await loginDeveloper(DEVELOPER_CREDENTIALS.PIN);
                      setIsLoading(false);
                      if (res.success && res.session) {
                        setSuccessMessage('Developer access authorized! Opening Developer Dashboard...');
                        setTimeout(() => {
                          onAuthSuccess(res.session!, 'developer');
                          onClose();
                        }, 500);
                      }
                    }}
                    className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-bold uppercase text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm mb-2 font-mono-luxury"
                  >
                    <Terminal className="w-4 h-4 text-black" />
                    <span>1-Click Instant Developer Login</span>
                  </button>
                )}

                {privateRole === 'staff' && (
                  <button
                    type="button"
                    onClick={async () => {
                      setIsLoading(true);
                      const res = await loginStaff(STAFF_CREDENTIALS.PIN, usersList);
                      setIsLoading(false);
                      if (res.success && res.session) {
                        setSuccessMessage('Staff access authorized! Opening Staff Dashboard...');
                        setTimeout(() => {
                          onAuthSuccess(res.session!, 'staff');
                          onClose();
                        }, 500);
                      }
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm mb-2 font-mono-luxury"
                  >
                    <Users className="w-4 h-4 text-white" />
                    <span>1-Click Instant Staff Login</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 font-mono-luxury text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm ${
                  privateRole === 'owner'
                    ? 'bg-[#1a1a1a] hover:bg-black text-[#c4a47c] border border-[#c4a47c]'
                    : privateRole === 'developer'
                    ? 'bg-[#020617] hover:bg-[#0a0f1d] text-cyan-300 border border-cyan-500/50'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                }`}
              >
                {isLoading ? (
                  'Verifying Credentials...'
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>
                      Authenticate & Open {privateRole === 'owner' ? 'Owner Dashboard' : privateRole === 'developer' ? 'Developer Dashboard' : 'Staff Dashboard'} →
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="bg-[#1a1a1a] text-white/50 px-6 py-2.5 border-t border-[#1a1a1a] text-[10px] font-mono-luxury flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure 256-bit Encrypted Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              type="button" 
              onClick={() => {
                setMainTab(prev => prev === 'public' ? 'private' : 'public');
                setErrorMessage('');
              }}
              className="text-white/20 hover:text-white/50 cursor-pointer p-0.5"
              title="Portal security gate"
            >
              <Lock className="w-2.5 h-2.5" />
            </button>
            <button onClick={onClose} className="hover:text-white uppercase font-bold cursor-pointer">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
