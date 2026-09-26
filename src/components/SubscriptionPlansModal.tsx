import React, { useState } from 'react';
import {
  X,
  Check,
  ShieldCheck,
  Sparkles,
  Building,
  Users,
  AlertTriangle,
  Lock,
  ArrowRight,
  Phone,
  MessageSquare,
  Zap,
  Star,
  CheckCircle2,
  Layers,
  Crown
} from 'lucide-react';
import { SubscriptionPlan, UserAccount } from '../types';
import { formatIndianCurrency } from '../utils/formatters';
import { DEFAULT_CONTACT_PHONE, openWhatsAppChat } from '../utils/whatsapp';

export interface SubscriptionPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: SubscriptionPlan[];
  currentUser?: UserAccount | null;
  onSelectFreePlan?: (plan: SubscriptionPlan) => void;
}

export const SubscriptionPlansModal: React.FC<SubscriptionPlansModalProps> = ({
  isOpen,
  onClose,
  plans,
  currentUser,
  onSelectFreePlan
}) => {
  if (!isOpen) return null;

  const [selectedRole, setSelectedRole] = useState<'All' | 'Agent' | 'Developer' | 'Builder'>('All');
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<SubscriptionPlan | null>(null);
  const [gatewayAlertVisible, setGatewayAlertVisible] = useState(false);
  const [leadCallbackRequested, setLeadCallbackRequested] = useState(false);

  const filteredPlans = plans.filter((p) => {
    if (p.planStatus === 'inactive') return false;
    if (selectedRole === 'All') return true;
    if (selectedRole === 'Developer') {
      return p.roleTarget === 'Developer' || p.roleTarget === 'Builder';
    }
    if (selectedRole === 'Builder') {
      return p.roleTarget === 'Builder' || p.roleTarget === 'Developer';
    }
    return p.roleTarget === selectedRole;
  });

  const handleChoosePlan = (plan: SubscriptionPlan) => {
    if (plan.price === 0) {
      if (onSelectFreePlan) {
        onSelectFreePlan(plan);
      }
      onClose();
      return;
    }

    // Paid Plan - Enforce requirement: "Do not activate paid subscriptions or collect payments without a properly configured payment gateway."
    setSelectedPlanForPayment(plan);
    setGatewayAlertVisible(true);
  };

  const handleWhatsAppInquiry = (planName: string) => {
    const msg = `Hello NS Properties, I am interested in subscribing to the "${planName}" partner membership on NS Properties. Please provide payment and onboarding assistance.`;
    openWhatsAppChat(DEFAULT_CONTACT_PHONE, msg);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-[#fdfcf9] border-2 border-[#1a1a1a] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col font-mono-luxury"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] px-6 py-4 flex items-center justify-between border-b-2 border-[#c4a47c]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#c4a47c] text-black font-black flex items-center justify-center text-xs">
              <Crown className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-lg sm:text-xl font-bold tracking-tight text-white">
                  NS Partner Membership & Subscription Plans
                </h3>
                <span className="bg-[#c4a47c] text-black text-[9px] font-black px-2 py-0.5 uppercase tracking-wider shrink-0">
                  AGENT, DEVELOPER & BUILDER NETWORK
                </span>
              </div>
              <p className="text-[11px] text-[#c4a47c] mt-0.5">
                100% Free Site Visits, instant builder offer deal publication, and verified client leads.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Plans Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Navigation */}
        <div className="bg-[#f4f1ea] px-6 py-3 border-b border-[#1a1a1a]/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600 font-bold">Select Target Persona:</span>
            <div className="flex items-center gap-1">
              {(['All', 'Agent', 'Developer', 'Builder'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-3 py-1 text-xs uppercase font-bold transition-all cursor-pointer border ${
                    selectedRole === role
                      ? 'bg-[#1a1a1a] text-[#c4a47c] border-[#1a1a1a] shadow-xs'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                  }`}
                >
                  {role === 'All' ? 'All Plans' : `${role} Plans`}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-gray-700 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-emerald-800">100% Free Site Visits Guaranteed</span>
          </div>
        </div>

        {/* Scrollable Plans Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#fdfcf9] space-y-6">
          
          {/* FREE SITE VISITS & BUILDER OFFER DEALS PROMISE BANNER */}
          <div className="bg-emerald-50 border-2 border-emerald-600/70 p-4 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif-luxury font-bold text-sm text-emerald-950 uppercase tracking-wide">
                    100% Free Site Visits & Builder Offer Deals Access
                  </h4>
                  <span className="bg-emerald-700 text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-wider">
                    ₹0 Visit Fee
                  </span>
                </div>
                <p className="text-emerald-900 mt-1 text-xs leading-relaxed font-sans">
                  Property inspections and site visits are <strong>100% FREE</strong> on NS Properties for Real Estate Agents, Project Developers, Builders, and Prospective Buyers. Browse, publish, and claim verified builder festival discounts, stamp duty waivers, and token rebate deals with zero platform visit fees.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono-luxury">
              <span className="px-3 py-1.5 bg-white border border-emerald-700 font-bold text-emerald-900">
                ✓ Free Agent Visits
              </span>
              <span className="px-3 py-1.5 bg-white border border-emerald-700 font-bold text-emerald-900">
                ✓ Free Developer & Builder Deals
              </span>
            </div>
          </div>
          
          {/* Payment Gateway Sandbox Warning Alert Modal/Card */}
          {gatewayAlertVisible && selectedPlanForPayment && (
            <div className="bg-amber-50 border-2 border-amber-400 p-4 sm:p-5 shadow-sm space-y-3 animate-in fade-in">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 border border-amber-300 rounded-xs shrink-0">
                  <Lock className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif-luxury font-bold text-sm sm:text-base text-amber-950">
                      Payment Gateway Integration Status: Protected Sandbox
                    </h4>
                    <span className="bg-amber-200 text-amber-900 text-[9px] font-black px-1.5 py-0.2 uppercase">
                      Security Policy Enforced
                    </span>
                  </div>
                  <p className="text-xs text-amber-900 mt-1 font-sans leading-relaxed">
                    In compliance with our strict financial security protocol, <strong>paid subscriptions and live merchant collections are disabled</strong> until the App Owner activates a verified production Payment Gateway (Razorpay/Stripe).
                  </p>
                  <p className="text-xs text-amber-800 mt-1.5 font-sans">
                    You have requested the <strong>{selectedPlanForPayment.name}</strong> ({formatIndianCurrency(selectedPlanForPayment.price)} / {selectedPlanForPayment.billingPeriod || selectedPlanForPayment.billingCycle}). Would you like our relationship desk to connect with you for corporate invoicing or offline bank transfer?
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-amber-200">
                <button
                  type="button"
                  onClick={() => setGatewayAlertVisible(false)}
                  className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-bold uppercase hover:bg-gray-50 cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => handleWhatsAppInquiry(selectedPlanForPayment.name)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Connect via WhatsApp Concierge</span>
                </button>
              </div>
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredPlans.map((plan) => {
              const isFree = plan.price === 0;
              const isPopular = plan.popular;

              return (
                <div
                  key={plan.id}
                  className={`bg-white border-2 flex flex-col justify-between transition-all hover:shadow-lg relative ${
                    isPopular
                      ? 'border-[#c4a47c] shadow-md ring-1 ring-[#c4a47c]'
                      : 'border-[#1a1a1a]/20 hover:border-[#1a1a1a]'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c4a47c] text-black font-black text-[9px] uppercase px-3 py-0.5 tracking-wider shadow-xs">
                      ★ MOST POPULAR
                    </div>
                  )}

                  <div className="p-5">
                    {/* Role & Name */}
                    {isFree && (
                      <div className="mb-2 bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider flex items-center justify-between">
                        <span>100% Free Visits & Deals</span>
                        <span className="font-bold">₹0 Forever</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                        {plan.roleTarget} Plan
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {plan.durationDays || 30} Days Validity
                      </span>
                    </div>

                    <h4 className="font-serif-luxury font-bold text-lg text-[#1a1a1a]">
                      {plan.name}
                    </h4>

                    <p className="text-[11px] text-gray-500 mt-1 min-h-[32px] line-clamp-2">
                      {plan.tagline || 'Essential real-estate marketing tools.'}
                    </p>

                    {/* Price Block */}
                    <div className="my-4 pt-3 border-t border-gray-100">
                      <div className="flex items-baseline gap-1">
                        <span className="font-serif-luxury text-2xl font-black text-[#1a1a1a]">
                          {isFree ? 'FREE' : formatIndianCurrency(plan.price)}
                        </span>
                        <span className="text-xs text-gray-500">
                          / {plan.billingPeriod || plan.billingCycle}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        {isFree ? 'No credit card required' : '+ 18% GST Applicable'}
                      </span>
                    </div>

                    {/* Core Limits Summary */}
                    <div className="space-y-2 py-3 border-y border-gray-100 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Property Listings:</span>
                        <strong className="text-black">{plan.propertyListingLimit || plan.listingLimit} Listings</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Lead Unlocks:</span>
                        <strong className="text-black">{plan.leadAccessLimit || `${plan.leadsAccess} Leads`}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Featured Badges:</span>
                        <strong className="text-[#c4a47c] font-black">{plan.featuredLimit} Badges</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Renewal Mode:</span>
                        <strong className="text-gray-700 uppercase text-[10px]">
                          {plan.renewalOption === 'auto_renewal' ? 'Auto-Renewal' : 'Manual'}
                        </strong>
                      </div>
                    </div>

                    {/* Benefits Checklist */}
                    <div className="mt-4 space-y-2 text-xs">
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">
                        Included Privileges:
                      </span>
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-[11px] leading-tight font-sans">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Choose Plan CTA */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleChoosePlan(plan)}
                      className={`w-full py-2.5 uppercase font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                        isFree
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-900'
                          : isPopular
                          ? 'bg-[#c4a47c] hover:bg-[#b09066] text-black border border-black'
                          : 'bg-[#1a1a1a] hover:bg-black text-[#fdfcf9]'
                      }`}
                    >
                      <span>{isFree ? 'Activate Free Plan (₹0)' : 'Select Plan'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Partner Support Desk Footer Card */}
          <div className="bg-[#1a1a1a] text-[#fdfcf9] p-5 border-2 border-[#c4a47c] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c4a47c]" />
                <h4 className="font-serif-luxury font-bold text-base text-white">
                  Need a Custom Enterprise Plan for a Developer Project?
                </h4>
              </div>
              <p className="text-xs text-white/70 mt-1 max-w-xl font-sans">
                Our institutional advisory team handles custom API integrations, developer landing pages, and dedicated tele-sales desk support for projects with 200+ inventory units.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="tel:18002083344"
                className="px-4 py-2 border border-[#c4a47c] text-[#c4a47c] hover:bg-[#c4a47c] hover:text-black font-bold uppercase text-xs transition-colors cursor-pointer"
              >
                1800-208-3344
              </a>
              <button
                type="button"
                onClick={() => handleWhatsAppInquiry('Enterprise Developer Custom')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Desk</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
