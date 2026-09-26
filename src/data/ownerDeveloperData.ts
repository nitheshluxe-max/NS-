import { 
  UserAccount, 
  LocationMapConfig, 
  SubscriptionPlan, 
  InvoiceRecord, 
  BugTicket, 
  ApiHealthEndpoint, 
  AppUpdateLog, 
  RolePermission 
} from '../types';

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-owner',
    name: 'Nithesh (App Owner)',
    email: 'nitheshluxe@gmail.com',
    phone: '+91 80732 66325',
    role: 'owner',
    status: 'active',
    joinedDate: '01 Jan 2026',
    company: 'NS Properties Headquarters',
    assignedLeadsCount: 18,
    propertiesCount: 42,
    notes: 'Primary Super Administrator & App Owner. Full unconditional authority.'
  },
  {
    id: 'user-dev-1',
    name: 'Siddharth Dev',
    email: 'dev.lead@nsproperties.in',
    phone: '+91 99801 22334',
    role: 'developer',
    status: 'active',
    joinedDate: '15 Feb 2026',
    company: 'Core Engineering & Cloud Ops',
    notes: 'Technical access only: App updates, bug fixes, API health, server maintenance.'
  },
  {
    id: 'user-agent-1',
    name: 'Vikram Aditya',
    email: 'vikram.agent@nsproperties.in',
    phone: '+91 98452 77112',
    role: 'agent',
    status: 'active',
    joinedDate: '10 Mar 2026',
    company: 'Aditya Realty Consultants',
    assignedLeadsCount: 14,
    propertiesCount: 8,
    notes: 'Whitefield & East Bengaluru Specialist'
  },
  {
    id: 'user-agent-2',
    name: 'Ananya Deshmukh',
    email: 'ananya.agent@nsproperties.in',
    phone: '+91 97410 44556',
    role: 'agent',
    status: 'active',
    joinedDate: '22 Mar 2026',
    company: 'Luxe Spaces India',
    assignedLeadsCount: 9,
    propertiesCount: 5,
    notes: 'Indiranagar & Koramangala Villa Specialist'
  },
  {
    id: 'user-seller-1',
    name: 'Brigade Group Sales Office',
    email: 'sales@brigadegroup.in',
    phone: '+91 80 4137 9200',
    role: 'seller',
    status: 'active',
    joinedDate: '05 Jan 2026',
    company: 'Brigade Enterprises Ltd',
    propertiesCount: 12,
    notes: 'Builder Verified Partner'
  },
  {
    id: 'user-seller-2',
    name: 'Rajesh G. (Individual Owner)',
    email: 'rajesh.owner@gmail.com',
    phone: '+91 94480 33219',
    role: 'seller',
    status: 'active',
    joinedDate: '18 Apr 2026',
    company: 'Individual Property Owner',
    propertiesCount: 1,
    notes: 'Selling 3 BHK in Sobha Dream Acres'
  },
  {
    id: 'user-buyer-1',
    name: 'Amitabh Sengupta',
    email: 'amitabh.s@fintechcorp.com',
    phone: '+91 98860 12345',
    role: 'buyer',
    status: 'active',
    joinedDate: '12 Sep 2026',
    company: 'Tech Executive Buyer',
    notes: 'Looking for 3-4 BHK Luxury Penthouse budget ₹2.5 Cr - ₹4 Cr'
  },
  {
    id: 'user-buyer-2',
    name: 'Sunita Reddy',
    email: 'sunita.reddy@healthcare.org',
    phone: '+91 91234 56789',
    role: 'buyer',
    status: 'active',
    joinedDate: '19 Sep 2026',
    notes: 'Site visit booked for Godrej Splendour'
  }
];

export const INITIAL_LOCATIONS: LocationMapConfig[] = [
  {
    id: 'loc-1',
    city: 'Bengaluru',
    locality: 'Whitefield',
    state: 'Karnataka',
    pincode: '560066',
    lat: 12.9698,
    lng: 77.7499,
    avgPricePerSqFt: 8750,
    isActive: true,
    landmarksCount: 14
  },
  {
    id: 'loc-2',
    city: 'Bengaluru',
    locality: 'Indiranagar',
    state: 'Karnataka',
    pincode: '560038',
    lat: 12.9784,
    lng: 77.6408,
    avgPricePerSqFt: 15400,
    isActive: true,
    landmarksCount: 22
  },
  {
    id: 'loc-3',
    city: 'Bengaluru',
    locality: 'Koramangala',
    state: 'Karnataka',
    pincode: '560034',
    lat: 12.9352,
    lng: 77.6245,
    avgPricePerSqFt: 13800,
    isActive: true,
    landmarksCount: 19
  },
  {
    id: 'loc-4',
    city: 'Mumbai',
    locality: 'Bandra West',
    state: 'Maharashtra',
    pincode: '400050',
    lat: 19.0596,
    lng: 72.8295,
    avgPricePerSqFt: 46500,
    isActive: true,
    landmarksCount: 31
  },
  {
    id: 'loc-5',
    city: 'Mumbai',
    locality: 'Worli Sea Face',
    state: 'Maharashtra',
    pincode: '400018',
    lat: 19.0176,
    lng: 72.8152,
    avgPricePerSqFt: 52000,
    isActive: true,
    landmarksCount: 18
  },
  {
    id: 'loc-6',
    city: 'Delhi NCR',
    locality: 'Golf Course Road, Gurgaon',
    state: 'Haryana',
    pincode: '122002',
    lat: 28.4595,
    lng: 77.0984,
    avgPricePerSqFt: 21500,
    isActive: true,
    landmarksCount: 26
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

export const INITIAL_INVOICES: InvoiceRecord[] = [
  {
    id: 'INV-2026-0901',
    userName: 'Vikram Aditya',
    userEmail: 'vikram.agent@nsproperties.in',
    userRole: 'agent',
    planName: 'Pro Agent Pass',
    amount: 1999,
    date: '01 Sep 2026',
    status: 'Paid',
    paymentMethod: 'UPI (Razorpay)'
  },
  {
    id: 'INV-2026-0884',
    userName: 'Brigade Group Sales Office',
    userEmail: 'sales@brigadegroup.in',
    userRole: 'seller',
    planName: 'Builder & Developer Platinum',
    amount: 9999,
    date: '15 Sep 2026',
    status: 'Paid',
    paymentMethod: 'NetBanking NEFT'
  },
  {
    id: 'INV-2026-0842',
    userName: 'Ananya Deshmukh',
    userEmail: 'ananya.agent@nsproperties.in',
    userRole: 'agent',
    planName: 'Pro Agent Pass',
    amount: 1999,
    date: '18 Sep 2026',
    status: 'Paid',
    paymentMethod: 'Credit Card (HDFC)'
  }
];

export const INITIAL_BUG_TICKETS: BugTicket[] = [
  {
    id: 'BUG-101',
    title: 'Floor plan zoom modal pinch-to-zoom on iOS Safari',
    severity: 'medium',
    status: 'resolved',
    reportedBy: 'Nithesh (Owner)',
    timestamp: '20 Sep 2026, 09:30 AM',
    description: 'When tapping image zoom on mobile viewport, touch events should not cause screen scrolling.',
    component: 'PropertyFloorPlanView',
    fixedInVersion: 'v2.4.1'
  },
  {
    id: 'BUG-102',
    title: 'Price filter slider debounce sync with query params',
    severity: 'low',
    status: 'resolved',
    reportedBy: 'QA Tester',
    timestamp: '22 Sep 2026, 03:15 PM',
    description: 'Ensure budget range debounce does not trigger extra re-renders.',
    component: 'FilterSidebar',
    fixedInVersion: 'v2.4.2'
  },
  {
    id: 'BUG-103',
    title: 'Google Maps lat/lng bounds recalculation on city switch',
    severity: 'high',
    status: 'open',
    reportedBy: 'Nithesh (Owner)',
    timestamp: '24 Sep 2026, 11:20 AM',
    description: 'Switching from Bengaluru to Mumbai should re-center interactive map pins to target coordinates.',
    component: 'LocationMapEngine'
  }
];

export const INITIAL_API_HEALTH: ApiHealthEndpoint[] = [
  {
    id: 'api-1',
    name: 'Property Query Engine',
    endpoint: '/api/v1/properties/search',
    method: 'GET',
    status: 'healthy',
    latencyMs: 38,
    lastChecked: 'Just now'
  },
  {
    id: 'api-2',
    name: 'Visitor Lead Capture Gateway',
    endpoint: '/api/v1/leads/capture',
    method: 'POST',
    status: 'healthy',
    latencyMs: 42,
    lastChecked: '1 min ago'
  },
  {
    id: 'api-3',
    name: 'Google Maps Geocoding & Distance Matrix',
    endpoint: '/api/v1/maps/distance',
    method: 'GET',
    status: 'healthy',
    latencyMs: 84,
    lastChecked: '2 mins ago'
  },
  {
    id: 'api-4',
    name: 'Owner Contact Security Barrier',
    endpoint: '/api/v1/security/owner-shield',
    method: 'POST',
    status: 'healthy',
    latencyMs: 29,
    lastChecked: 'Just now'
  }
];

export const INITIAL_APP_UPDATES: AppUpdateLog[] = [
  {
    version: 'v2.4.2',
    releaseDate: '24 Sep 2026',
    title: 'Owner Superadmin Console & Developer Tech Portal Separation',
    notes: [
      'Role-based permission architecture separating App Owner full access from Developer technical access',
      'Owner property management (add/edit/delete/price revision/discount percentage)',
      'Agent & lead assignment pipeline with WhatsApp direct call',
      'Google Maps coordinates manager with visual pin preview',
      'Developer technical dashboard for bug fixes, server maintenance, and cache flush'
    ],
    deployedBy: 'Core Dev Team',
    type: 'major'
  },
  {
    version: 'v2.4.1',
    releaseDate: '22 Sep 2026',
    title: 'Floor Plan Phone Unlock & Leads Customer Option',
    notes: [
      'Integrated verified client phone capture on floor plan view',
      'Private shielded customer sheet exclusively for owner/developer',
      'CSV Excel export and 1-click WhatsApp dialer'
    ],
    deployedBy: 'Siddharth Dev',
    type: 'minor'
  }
];

export const ROLE_PERMISSIONS: RolePermission[] = [
  {
    role: 'owner',
    label: 'App Owner (Super Administrator)',
    description: 'Full unconditional authority over properties, users, finances, staff, and system security.',
    canManageProperties: true,
    canManageUsers: true,
    canAssignLeads: true,
    canChangePrices: true,
    canManageLocations: true,
    canUploadMedia: true,
    canViewFinancialReports: true,
    canManageStaffAndDev: true,
    canManageSubscriptions: true,
    canAccessTechnicalMaintenance: true
  },
  {
    role: 'developer',
    label: 'App Developer (Technical Only)',
    description: 'Restricted strictly to code deployment, server API maintenance, bug tracking, and tech settings.',
    canManageProperties: false,
    canManageUsers: false,
    canAssignLeads: false,
    canChangePrices: false,
    canManageLocations: false,
    canUploadMedia: false,
    canViewFinancialReports: false,
    canManageStaffAndDev: false,
    canManageSubscriptions: false,
    canAccessTechnicalMaintenance: true
  },
  {
    role: 'manager',
    label: 'Operations Manager',
    description: 'Can manage listings and leads assignment, but cannot alter subscription billing or revoke owner.',
    canManageProperties: true,
    canManageUsers: true,
    canAssignLeads: true,
    canChangePrices: true,
    canManageLocations: true,
    canUploadMedia: true,
    canViewFinancialReports: true,
    canManageStaffAndDev: false,
    canManageSubscriptions: false,
    canAccessTechnicalMaintenance: false
  },
  {
    role: 'agent',
    label: 'Certified Agent',
    description: 'Can manage own listings and assigned leads; no access to developer or system financials.',
    canManageProperties: true,
    canManageUsers: false,
    canAssignLeads: false,
    canChangePrices: false,
    canManageLocations: false,
    canUploadMedia: true,
    canViewFinancialReports: false,
    canManageStaffAndDev: false,
    canManageSubscriptions: false,
    canAccessTechnicalMaintenance: false
  }
];
