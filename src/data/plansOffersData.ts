import { Offer, SubscriptionPlan, OfferEnquiry, OfferActivityLog } from '../types.ts';

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'off-diwali-2026',
    title: 'Diwali Royal Luxury Concession',
    description: 'Exclusive festive celebration offer: Flat 8% direct price concession on luxury high-rise penthouses + 100% zero stamp duty waiver on bookings before the deadline.',
    bannerImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    discountType: 'percentage',
    discountValue: 8,
    startDate: '2026-09-15',
    endDate: '2026-11-20',
    status: 'active',
    category: 'festival',
    featured: true,
    applicablePropertyIds: ['prop-1', 'prop-3', 'prop-6'],
    applicableProjectNames: ['Prestige Kingfisher Towers', 'DLF Magnolias Sky Villas', 'Total Environment Learning to Fly'],
    minBookingAmount: 500000,
    termsAndConditions: [
      'Offer valid only on confirmed booking token received before 20 Nov 2026.',
      'Discount applicable on basic selling price (BSP) excluding statutory tax.',
      'Stamp duty reimbursement credited at time of registered sale agreement.',
      'Cannot be clubbed with other pre-launch broker schemes.',
      'Subject to maximum of 25 allotments across metro branches.'
    ],
    usageLimit: 25,
    usageCount: 11,
    viewsCount: 1840,
    enquiriesCount: 52,
    createdAt: '2026-09-15T10:00:00.000Z',
    updatedAt: '2026-09-24T14:30:00.000Z',
    createdBy: 'Nithesh (Owner)'
  },
  {
    id: 'off-kingfisher-cash',
    title: 'Ultra-Luxury Cash Rebate: ₹25 Lakhs Off',
    description: 'Direct builder developer concession on 4 BHK & 5 BHK Sky Mansions. Includes complimentary German Poggenpohl modular kitchen & imported Italian marble upgrade.',
    bannerImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    discountType: 'fixed',
    discountValue: 2500000,
    startDate: '2026-09-01',
    endDate: '2026-10-31',
    status: 'active',
    category: 'limited_time',
    featured: true,
    applicablePropertyIds: ['prop-1', 'prop-4'],
    applicableProjectNames: ['Prestige Kingfisher Towers', 'Phoenix Kessaku High Rise'],
    minBookingAmount: 1000000,
    termsAndConditions: [
      'Applicable on outright purchase agreement executed within 30 days of booking.',
      'Includes complimentary modular kitchen fitout worth ₹18 Lakhs.',
      'Valid for first 15 verified high-net-worth buyers only.',
      'Non-transferable to secondary resale transactions.'
    ],
    usageLimit: 15,
    usageCount: 7,
    viewsCount: 1420,
    enquiriesCount: 39,
    createdAt: '2026-09-01T09:00:00.000Z',
    updatedAt: '2026-09-22T11:15:00.000Z',
    createdBy: 'Nithesh (Owner)'
  },
  {
    id: 'off-zero-stamp-plots',
    title: 'Zero Stamp Duty & Registration Waiver (Save 6%)',
    description: 'Purchase BDA / BMRDA approved freehold villa plots in Sarjapur Road and Devanahalli with full developer absorption of government registration charges.',
    bannerImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    discountType: 'percentage',
    discountValue: 6,
    startDate: '2026-08-20',
    endDate: '2026-10-15',
    status: 'active',
    category: 'property_discount',
    featured: false,
    applicablePropertyIds: ['prop-2', 'prop-5'],
    applicableProjectNames: ['Prestige Golfshire Estate', 'Sobha Lifestyle Plots'],
    minBookingAmount: 200000,
    termsAndConditions: [
      'Registration waiver up to 6% of sub-registrar guidance value.',
      'Sale deed must be completed within 45 days of allotment.',
      'Applies to corner and park-facing premium plots.'
    ],
    usageLimit: 30,
    usageCount: 18,
    viewsCount: 960,
    enquiriesCount: 28,
    createdAt: '2026-08-20T12:00:00.000Z',
    updatedAt: '2026-09-20T16:00:00.000Z',
    createdBy: 'Nithesh (Owner)'
  },
  {
    id: 'off-comm-yield-guarantee',
    title: 'Grade-A Commercial: 11.5% Guaranteed Rental Yield',
    description: 'Pre-leased corporate tech office spaces with Grade-A multinational tenants. Enjoy 36 months rental guarantee paid monthly with zero lock-in penalty.',
    bannerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    discountType: 'percentage',
    discountValue: 5,
    startDate: '2026-09-10',
    endDate: '2026-12-31',
    status: 'active',
    category: 'special_project',
    featured: true,
    applicablePropertyIds: ['prop-7', 'prop-9'],
    applicableProjectNames: ['World Trade Centre Kharadi', 'Hitec City IT Corridor Suites'],
    minBookingAmount: 1500000,
    termsAndConditions: [
      'Triple net lease structure backed by corporate bank guarantee.',
      'Annual 5% rental escalation built into lease deed.',
      'Institutional and NRI investor eligible with repatriable capital structure.'
    ],
    usageLimit: 10,
    usageCount: 4,
    viewsCount: 1120,
    enquiriesCount: 34,
    createdAt: '2026-09-10T11:00:00.000Z',
    updatedAt: '2026-09-25T15:00:00.000Z',
    createdBy: 'Nithesh (Owner)'
  },
  {
    id: 'off-monsoon-parking-pack',
    title: 'Free Double Covered EV Parking Pack (Value ₹8 Lakhs)',
    description: 'Book any 3 BHK residence and receive 2 covered basement EV car parking slots plus 1 full year society maintenance advance fully paid.',
    bannerImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    discountType: 'fixed',
    discountValue: 800000,
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    status: 'active',
    category: 'booking_benefit',
    featured: false,
    applicablePropertyIds: ['prop-8', 'prop-10'],
    applicableProjectNames: ['Godrej Platinum High Rise', 'Lodha Altamount Towers'],
    minBookingAmount: 300000,
    termsAndConditions: [
      'EV charger wiring and dual basement parking slot allotment included.',
      'Maintenance fee advance covered up to ₹1,50,000 for 12 months.',
      'Limited to select higher floor inventory.'
    ],
    usageLimit: 20,
    usageCount: 19,
    viewsCount: 780,
    enquiriesCount: 22,
    createdAt: '2026-07-01T08:00:00.000Z',
    updatedAt: '2026-09-24T18:00:00.000Z',
    createdBy: 'Nithesh (Owner)'
  }
];

export const INITIAL_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-free-agent',
    name: 'Free Agent Partner',
    roleTarget: 'Agent',
    price: 0,
    billingCycle: 'Monthly',
    billingPeriod: 'Monthly',
    listingLimit: 5,
    propertyListingLimit: 5,
    featuredLimit: 1,
    leadsAccess: 'Standard',
    leadAccessLimit: 'Unlimited Free Site Visits & 10 Enquiries / mo',
    featuredListingBenefits: '100% Free Property Inspections & Client Visit Passes',
    advertisementBenefits: 'Free Access to Builder Festive Offers, Price Cuts & Schemes',
    durationDays: 365,
    renewalOption: 'auto_renewal',
    planStatus: 'active',
    activeSubscribers: 248,
    tagline: '100% Free Site Visits & Builder Deal Access for Certified Real Estate Agents',
    popular: true,
    features: [
      '100% FREE Property Site Visits for Agents & Escorted Clients (₹0 Fee)',
      'FREE Unlimited Access to Builder Offer Deals, Concessions & Festive Schemes',
      'Zero Site Visit Charges & Free Concierge Booking Assistance',
      'Up to 5 Active Property Listings with photos & vector floor plans',
      'Direct WhatsApp buyer lead notifications & client verification',
      'Instant Download & Sharing of Project Brochure PDFs'
    ]
  },
  {
    id: 'plan-free-developer',
    name: 'Free Developer Deal Showcase',
    roleTarget: 'Developer',
    price: 0,
    billingCycle: 'Monthly',
    billingPeriod: 'Monthly',
    listingLimit: 15,
    propertyListingLimit: 15,
    featuredLimit: 3,
    leadsAccess: 'Unlimited',
    leadAccessLimit: 'Unlimited Free Site Visits & Direct Inquiries',
    featuredListingBenefits: 'Free On-Site Visitor Coordination & Gate Pass Management',
    advertisementBenefits: 'Free Publication of Festive Concessions & Limited-Time Deals',
    durationDays: 365,
    renewalOption: 'auto_renewal',
    planStatus: 'active',
    activeSubscribers: 94,
    tagline: '100% Free Site Visit Reception & Deal Showcase for Project Developers',
    popular: true,
    features: [
      '100% FREE Site Visit Hosting for Buyers, Channel Partners & Brokers',
      'Publish Unlimited Builder Offers, Festive Deals & Price Reductions for FREE',
      'Zero Brokerage / Zero Platform Commission on Direct Customer Inquiries',
      'Real-time Buyer Lead Dispatch via WhatsApp & SMS',
      'Interactive Floor Plan Vector View & Project Specs Showcase',
      'Dedicated Developer Project Page & Official Brochure PDF Downloads'
    ]
  },
  {
    id: 'plan-free-builder',
    name: 'Free Builder Launchpad',
    roleTarget: 'Builder',
    price: 0,
    billingCycle: 'Monthly',
    billingPeriod: 'Monthly',
    listingLimit: 10,
    propertyListingLimit: 10,
    featuredLimit: 2,
    leadsAccess: 'Unlimited',
    leadAccessLimit: 'Unlimited Free Site Visits & Booking Inquiries',
    featuredListingBenefits: 'Free Site Inspection Escort & Client Scheduling',
    advertisementBenefits: 'Free Showcase of Pre-Launch & Under-Construction Deals',
    durationDays: 365,
    renewalOption: 'auto_renewal',
    planStatus: 'active',
    activeSubscribers: 112,
    tagline: '100% Free Site Visits & Pre-Launch Deal Hosting for Builders',
    popular: false,
    features: [
      '100% FREE Site Visits for Prospective Buyers & Channel Partners',
      'Showcase Builder Festival Offers, Stamp Duty Waivers & Token Deals for FREE',
      'List Up to 10 Residential Towers, Villa Projects or Land Parcels',
      'Verified RERA Compliance Badge & Direct Builder Connection',
      'Instant Client Site Visit Calendar Sync & Gate Appointment Pass'
    ]
  },
  {
    id: 'plan-silver',
    name: 'Silver Partner',
    roleTarget: 'Agent',
    price: 4999,
    billingCycle: 'Quarterly',
    billingPeriod: 'Quarterly',
    listingLimit: 25,
    propertyListingLimit: 25,
    featuredLimit: 5,
    leadsAccess: 'Priority',
    leadAccessLimit: 'Unlimited Free Site Visits + 45 Verified Buyer Leads / mo',
    featuredListingBenefits: '5 Featured Badges with top placement + Free VIP Escort',
    advertisementBenefits: 'Locality spotlight card & WhatsApp lead notification',
    durationDays: 90,
    renewalOption: 'manual',
    planStatus: 'active',
    activeSubscribers: 68,
    tagline: 'High-growth choice for certified real-estate agents',
    popular: false,
    features: [
      '100% FREE Site Visits for Clients & Agents (Guaranteed ₹0 Fee)',
      'Free Priority Access to Builder Festival Offer Deals & Token Discounts',
      'Up to 25 active property listings with HD photos',
      '5 Featured badges with top-of-feed placement',
      '45 direct verified phone & WhatsApp buyer leads',
      'Relationship Manager support & instant visit slot confirmation'
    ]
  },
  {
    id: 'plan-gold',
    name: 'Gold Broker Pro',
    roleTarget: 'Agent',
    price: 12999,
    billingCycle: 'Quarterly',
    billingPeriod: 'Quarterly',
    listingLimit: 60,
    propertyListingLimit: 60,
    featuredLimit: 12,
    leadsAccess: 'Unlimited',
    leadAccessLimit: 'Unlimited Free Site Visits + 150 HNW Buyer Leads / mo',
    featuredListingBenefits: '12 Signature Featured listings + Locality spotlight banner',
    advertisementBenefits: 'Email newsletter blast & banner campaign',
    durationDays: 90,
    renewalOption: 'manual',
    planStatus: 'active',
    activeSubscribers: 29,
    tagline: 'Comprehensive marketing engine for agencies',
    popular: false,
    features: [
      '100% FREE Site Visits for All Clients & Sub-brokers (Zero Fee)',
      'VIP Early-Bird Access to Pre-launch Builder Deals & Exclusive Pricing',
      'Up to 60 active property listings with 3D floor plans',
      '12 Signature Featured badges + Locality Spotlight',
      '150 high-net-worth investor and buyer leads',
      'Dedicated staff RM & CRM lead integration'
    ]
  },
  {
    id: 'plan-premium',
    name: 'Premium Builder & Developer Enterprise',
    roleTarget: 'Builder',
    price: 29999,
    billingCycle: 'Yearly',
    billingPeriod: 'Yearly',
    listingLimit: 250,
    propertyListingLimit: 250,
    featuredLimit: 50,
    leadsAccess: 'Unlimited',
    leadAccessLimit: 'Unlimited Free Site Visits & Direct Enquiries',
    featuredListingBenefits: 'Unlimited Project Carousel Badges & Verified Shield',
    advertisementBenefits: 'Homepage Hero Banner & Curated Investor Dossier',
    durationDays: 365,
    renewalOption: 'auto_renewal',
    planStatus: 'active',
    activeSubscribers: 18,
    tagline: 'Exclusive brand spotlight for top tier property developers & builders',
    popular: false,
    features: [
      '100% FREE On-site Inspection Coordination & Concierge Desk for All Buyers',
      'Unlimited Publication of Builder Schemes, Concessions & Offer Deals',
      'Up to 250 project towers, villas & penthouses across metros',
      'Homepage Hero Banner spotlight & digital brochure downloads',
      'Custom landing page URL with developer branding',
      '24/7 dedicated enterprise account director'
    ]
  }
];

export const INITIAL_OFFER_ENQUIRIES: OfferEnquiry[] = [
  {
    id: 'enq-off-101',
    offerId: 'off-diwali-2026',
    offerTitle: 'Diwali Royal Luxury Concession',
    propertyId: 'prop-1',
    propertyTitle: 'Prestige Kingfisher Towers Sky Mansion',
    customerName: 'Aarav Singhania',
    customerPhone: '+91 98450 44321',
    customerEmail: 'aarav.singhania@apexventure.com',
    preferredTime: 'Evening (5:00 PM - 7:00 PM)',
    message: 'Interested in the 8% Diwali concession for the 4 BHK penthouse. Please share final payment milestone sheet.',
    status: 'New',
    assignedStaffId: 'staff-01',
    assignedStaffName: 'Vikram Aditya',
    createdAt: '2026-09-25T11:20:00.000Z',
    notes: 'High net worth buyer. Sent brochure via WhatsApp.'
  },
  {
    id: 'enq-off-102',
    offerId: 'off-kingfisher-cash',
    offerTitle: 'Ultra-Luxury Cash Rebate: ₹25 Lakhs Off',
    propertyId: 'prop-1',
    propertyTitle: 'Prestige Kingfisher Towers Sky Mansion',
    customerName: 'Dr. Radhika Kulkarni',
    customerPhone: '+91 98230 77123',
    customerEmail: 'radhika.k@apollohealth.org',
    preferredTime: 'Weekend Morning',
    message: 'Want to confirm if the ₹25 Lakhs rebate includes the modular kitchen interior package.',
    status: 'Contacted',
    assignedStaffId: 'staff-01',
    assignedStaffName: 'Vikram Aditya',
    createdAt: '2026-09-24T16:45:00.000Z',
    notes: 'Spoke on phone. Site visit planned for Saturday.'
  },
  {
    id: 'enq-off-103',
    offerId: 'off-comm-yield-guarantee',
    offerTitle: 'Grade-A Commercial: 11.5% Guaranteed Rental Yield',
    propertyId: 'prop-7',
    propertyTitle: 'World Trade Centre Grade-A Tech Suite',
    customerName: 'Sanjay Chawla',
    customerPhone: '+91 99100 88234',
    customerEmail: 'sanjay@chawlainvestments.in',
    preferredTime: 'Anytime',
    message: 'Looking to invest ₹4 Crores in pre-leased commercial units. Need 3-year rent guarantee agreement copy.',
    status: 'Visit Scheduled',
    assignedStaffId: 'staff-01',
    assignedStaffName: 'Vikram Aditya',
    createdAt: '2026-09-23T14:10:00.000Z',
    notes: 'Investor packet dispatched.'
  }
];

export const INITIAL_OFFER_LOGS: OfferActivityLog[] = [
  {
    id: 'log-off-01',
    action: 'CREATE',
    entityType: 'offer',
    entityId: 'off-diwali-2026',
    title: 'Diwali Royal Luxury Concession',
    performedBy: 'Nithesh (Owner)',
    userRole: 'owner',
    timestamp: '15 Sep 2026, 10:00 AM',
    details: 'Created offer with 8% discount and 25 unit allocation limit.'
  },
  {
    id: 'log-off-02',
    action: 'ACTIVATE',
    entityType: 'offer',
    entityId: 'off-kingfisher-cash',
    title: 'Ultra-Luxury Cash Rebate: ₹25 Lakhs Off',
    performedBy: 'Nithesh (Owner)',
    userRole: 'owner',
    timestamp: '18 Sep 2026, 02:15 PM',
    details: 'Activated fixed discount offer on Prestige Kingfisher Towers.'
  },
  {
    id: 'log-off-03',
    action: 'ENQUIRY_RECEIVED',
    entityType: 'offer',
    entityId: 'off-diwali-2026',
    title: 'Diwali Royal Luxury Concession',
    performedBy: 'Aarav Singhania',
    userRole: 'customer',
    timestamp: '25 Sep 2026, 11:20 AM',
    details: 'New offer enquiry registered for Prestige Kingfisher Towers Sky Mansion.'
  }
];

// LocalStorage Keys
const STORAGE_OFFERS_KEY = 'NS_PLANS_OFFERS_CATALOG';
const STORAGE_PLANS_KEY = 'NS_SUBSCRIPTION_PLANS_CATALOG';
const STORAGE_OFFER_ENQUIRIES_KEY = 'NS_OFFER_ENQUIRIES_LIST';
const STORAGE_OFFER_LOGS_KEY = 'NS_OFFER_AUDIT_LOGS';

export function getStoredOffers(): Offer[] {
  try {
    const raw = localStorage.getItem(STORAGE_OFFERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to read offers from localStorage', e);
  }
  return INITIAL_OFFERS;
}

export function saveStoredOffers(offers: Offer[]): void {
  try {
    localStorage.setItem(STORAGE_OFFERS_KEY, JSON.stringify(offers));
  } catch (e) {
    console.error('Failed to save offers to localStorage', e);
  }
}

export function getStoredSubscriptionPlans(): SubscriptionPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_PLANS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to read plans from localStorage', e);
  }
  return INITIAL_SUBSCRIPTION_PLANS;
}

export function saveStoredSubscriptionPlans(plans: SubscriptionPlan[]): void {
  try {
    localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify(plans));
  } catch (e) {
    console.error('Failed to save plans to localStorage', e);
  }
}

export function getStoredOfferEnquiries(): OfferEnquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_OFFER_ENQUIRIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to read offer enquiries', e);
  }
  return INITIAL_OFFER_ENQUIRIES;
}

export function saveStoredOfferEnquiries(enquiries: OfferEnquiry[]): void {
  try {
    localStorage.setItem(STORAGE_OFFER_ENQUIRIES_KEY, JSON.stringify(enquiries));
  } catch (e) {
    console.error('Failed to save offer enquiries', e);
  }
}

export function getStoredOfferLogs(): OfferActivityLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_OFFER_LOGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to read offer logs', e);
  }
  return INITIAL_OFFER_LOGS;
}

export function logOfferActivity(log: Omit<OfferActivityLog, 'id' | 'timestamp'>): void {
  try {
    const logs = getStoredOfferLogs();
    const newEntry: OfferActivityLog = {
      ...log,
      id: `log-off-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    const updated = [newEntry, ...logs].slice(0, 100);
    localStorage.setItem(STORAGE_OFFER_LOGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to write offer log', e);
  }
}

/**
 * Validates whether an offer is active and within valid dates.
 * Enforces requirement: "Only active and valid offers should be displayed."
 */
export function isOfferActiveAndValid(offer: Offer): boolean {
  if (offer.status !== 'active') return false;
  const now = new Date();
  const start = new Date(offer.startDate);
  const end = new Date(offer.endDate);
  
  // Set end of day for expiry
  end.setHours(23, 59, 59, 999);
  
  if (now < start || now > end) return false;
  if (offer.usageLimit && offer.usageCount >= offer.usageLimit) return false;
  return true;
}

/**
 * Calculate discounted price for a property under an offer.
 */
export function calculateOfferPrice(originalPrice: number, offer: Offer): {
  originalPrice: number;
  discountedPrice: number;
  savingsAmount: number;
  savingsDisplay: string;
} {
  let savings = 0;
  if (offer.discountType === 'percentage') {
    savings = Math.round((originalPrice * offer.discountValue) / 100);
  } else {
    savings = Math.min(originalPrice - 100000, offer.discountValue);
  }
  const discounted = Math.max(100000, originalPrice - savings);

  const formatLakhsCrores = (val: number) => {
    if (val >= 10000000) {
      return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹ ${(val / 100000).toFixed(2)} Lakhs`;
  };

  return {
    originalPrice,
    discountedPrice: discounted,
    savingsAmount: savings,
    savingsDisplay: formatLakhsCrores(savings)
  };
}
