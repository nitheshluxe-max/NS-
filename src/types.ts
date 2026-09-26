export type PropertyPurpose = 'buy' | 'rent';
export type PropertyCategory = 'residential' | 'commercial' | 'plots';
export type PropertyType = 
  | 'apartment' 
  | 'independent-house' 
  | 'villa' 
  | 'penthouse' 
  | 'builder-floor' 
  | 'plot' 
  | 'commercial-office' 
  | 'commercial-shop';

export type PostedBy = 'Owner' | 'Builder' | 'Certified Agent';
export type FurnishingStatus = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
export type PossessionStatus = 'Ready to Move' | 'Within 3 Months' | 'Under Construction (2026)' | 'Under Construction (2027)';

export interface Landmark {
  name: string;
  distance: string;
  type: 'metro' | 'school' | 'hospital' | 'mall' | 'itpark' | 'airport';
}

export interface Property {
  id: string;
  title: string;
  projectName?: string;
  builderName?: string;
  purpose: PropertyPurpose;
  category: PropertyCategory;
  type: PropertyType;
  bhk: number; // 0 for plots or commercial
  bathrooms: number;
  balconies?: number;
  price: number; // in Rupees
  priceDisplay: string; // e.g., "₹ 1.65 Cr" or "₹ 45,000 / mo"
  pricePerSqFt: number;
  areaSqFt: number; // Super built-up
  carpetAreaSqFt: number;
  city: string;
  locality: string;
  address: string;
  floor?: string; // e.g., "12th of 24 floors"
  facing?: string; // e.g., "East", "North-East"
  furnishing: FurnishingStatus;
  possession: PossessionStatus;
  ageOfProperty?: string;
  reraId?: string;
  isVerified: boolean;
  isExclusive: boolean;
  isFeatured?: boolean;
  isDisabled?: boolean;
  videoUrl?: string;
  virtualTourUrl?: string;
  latitude?: number;
  longitude?: number;
  discountPercentage?: number;
  postedBy: PostedBy;
  postedDate: string;
  images: string[];
  amenities: string[];
  description: string;
  landmarks: Landmark[];
  seller: {
    name: string;
    phone: string;
    email: string;
    company?: string;
    rating?: number;
    verifiedAgent?: boolean;
    responseTime?: string;
  };
}

export interface FilterState {
  purpose: PropertyPurpose;
  category?: PropertyCategory;
  city: string;
  searchQuery: string;
  propertyTypes: PropertyType[];
  bhk: number[];
  budgetMin: number;
  budgetMax: number;
  postedBy: PostedBy[];
  furnishing: FurnishingStatus[];
  possession: PossessionStatus[];
  verifiedOnly: boolean;
  withPhotosOnly?: boolean;
  selectedAmenities: string[];
  sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'area_desc' | 'recent';
}

export interface LocalityTrend {
  city: string;
  locality: string;
  avgPricePerSqFt: number;
  yoyGrowth: number; // e.g. 14.2%
  rentYield: string; // e.g. "3.8%"
  topFeatures: string[];
  popularProjects: string[];
}

export interface SiteVisitRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'Confirmed' | 'Pending';
  createdAt: string;
}

export interface VisitorLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  purpose: 'Buy' | 'Rent' | 'Invest' | 'General Inquiry' | 'Site Visit' | 'Brochure';
  preferredCity?: string;
  budget?: string;
  propertyTitle?: string;
  propertyId?: string;
  timestamp: string;
  source: 
    | 'Auto-Trigger Popup' 
    | 'Brochure Download' 
    | 'Property Detail Enquiry' 
    | 'Schedule Visit' 
    | 'Header Callback' 
    | 'Owner Contact Unlock'
    | 'Floor Plan Phone Unlock'
    | 'Floor Plan Unlock'
    | string;
  status: 'New' | 'Contacted' | 'Visit Scheduled' | 'Converted';
  notes?: string;
  assignedToAgentId?: string;
  assignedToAgentName?: string;
}

// User & Role-Based Access Control (RBAC)
export type UserRole = 'owner' | 'manager' | 'agent' | 'seller' | 'buyer' | 'developer';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'disabled' | 'pending';
  joinedDate: string;
  company?: string;
  assignedLeadsCount?: number;
  propertiesCount?: number;
  notes?: string;
  permissions?: string[];
}

// Location and Google Maps Configuration
export interface LocationMapConfig {
  id: string;
  city: string;
  locality: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  avgPricePerSqFt: number;
  isActive: boolean;
  landmarksCount?: number;
}

// Subscriptions & Payment
export interface SubscriptionPlan {
  id: string;
  name: string;
  roleTarget: 'Agent' | 'Builder' | 'Developer' | 'Owner';
  price: number;
  billingCycle: 'Monthly' | 'Quarterly' | 'Yearly';
  billingPeriod?: 'Monthly' | 'Quarterly' | 'Yearly';
  listingLimit: number;
  propertyListingLimit?: number;
  featuredLimit: number;
  leadsAccess: 'Standard' | 'Priority' | 'Unlimited';
  leadAccessLimit?: string;
  featuredListingBenefits?: string;
  advertisementBenefits?: string;
  durationDays?: number;
  renewalOption?: 'manual' | 'auto_renewal' | 'none';
  planStatus?: 'active' | 'inactive';
  activeSubscribers: number;
  features: string[];
  tagline?: string;
  popular?: boolean;
}

export type OfferCategory = 
  | 'festival' 
  | 'limited_time' 
  | 'property_discount' 
  | 'special_project' 
  | 'booking_benefit';

export interface Offer {
  id: string;
  title: string;
  description: string;
  bannerImage: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // percentage (e.g. 8) or fixed amount in Rupees (e.g. 2500000)
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: 'active' | 'inactive' | 'expired';
  category: OfferCategory;
  featured: boolean;
  applicablePropertyIds: string[]; // Property IDs or ['ALL']
  applicableProjectNames?: string[];
  minBookingAmount?: number;
  termsAndConditions: string[];
  usageLimit?: number;
  usageCount: number;
  viewsCount: number;
  enquiriesCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface OfferPropertyLink {
  id: string;
  offerId: string;
  propertyId: string;
  originalPrice: number;
  discountedPrice: number;
  savingsAmount: number;
}

export interface CustomerSubscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  planId: string;
  planName: string;
  pricePaid: number;
  status: 'pending_payment_gateway' | 'active' | 'expired' | 'cancelled';
  gatewayStatus: string;
  startDate: string;
  expiryDate: string;
  propertiesListed: number;
  leadsAccessed: number;
}

export interface OfferEnquiry {
  id: string;
  offerId: string;
  offerTitle: string;
  propertyId?: string;
  propertyTitle?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  preferredTime?: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Visit Scheduled' | 'Converted' | 'Closed';
  assignedStaffId?: string;
  assignedStaffName?: string;
  createdAt: string;
  notes?: string;
}

export interface OfferUsage {
  id: string;
  offerId: string;
  propertyId: string;
  customerName: string;
  customerPhone: string;
  bookingAmount: number;
  discountApplied: number;
  usedAt: string;
  status: 'Applied' | 'Verified' | 'Cancelled';
}

export interface OfferActivityLog {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'ACTIVATE' | 'DEACTIVATE' | 'DELETE' | 'ENQUIRY_RECEIVED' | 'OFFER_REDEEMED' | 'PLAN_CREATED' | 'PLAN_UPDATED';
  entityType: 'offer' | 'subscription_plan';
  entityId: string;
  title: string;
  performedBy: string;
  userRole: 'owner' | 'staff' | 'customer' | 'developer' | 'system';
  timestamp: string;
  details: string;
}

export interface InvoiceRecord {
  id: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  planName: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  paymentMethod: string;
}

// Developer Technical Maintenance
export interface BugTicket {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved';
  reportedBy: string;
  timestamp: string;
  description: string;
  component: string;
  fixedInVersion?: string;
}

export interface ApiHealthEndpoint {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST';
  status: 'healthy' | 'degraded' | 'offline';
  latencyMs: number;
  lastChecked: string;
}

export interface AppUpdateLog {
  version: string;
  releaseDate: string;
  title: string;
  notes: string[];
  deployedBy: string;
  type: 'major' | 'minor' | 'hotfix';
}

export interface RolePermission {
  role: UserRole;
  label: string;
  description: string;
  canManageProperties: boolean;
  canManageUsers: boolean;
  canAssignLeads: boolean;
  canChangePrices: boolean;
  canManageLocations: boolean;
  canUploadMedia: boolean;
  canViewFinancialReports: boolean;
  canManageStaffAndDev: boolean;
  canManageSubscriptions: boolean;
  canAccessTechnicalMaintenance: boolean;
}

// ==========================================
// DEVELOPER DASHBOARD TECHNICAL SCHEMAS
// ==========================================

export interface DevSystemVitals {
  environment: 'production' | 'staging' | 'development';
  nodeVersion: string;
  viteVersion: string;
  uptimeSeconds: number;
  memoryRssMb: number;
  memoryHeapMb: number;
  cpuLoadPercent: number;
  activeConnections: number;
  cacheHitRatio: number;
  isMaintenanceMode: boolean;
  activeVersion: string;
  dbPoolConnections: number;
  lastDeploymentTime: string;
}

export interface AppVersionRecord {
  id: string;
  version: string;
  buildNumber: number;
  releaseChannel: 'stable' | 'beta' | 'canary';
  releaseDate: string;
  title: string;
  notes: string[];
  deployedBy: string;
  commitHash: string;
  minClientVersion: string;
  forceClientUpdate: boolean;
  status: 'active' | 'archived' | 'rolled_back';
  downloadUrl?: string;
}

export type LogLevel = 'ALL' | 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'CRITICAL';
export type LogService = 
  | 'ALL'
  | 'HTTP_SERVER' 
  | 'ROUTER' 
  | 'AUTH_SERVICE' 
  | 'DB_QUERY' 
  | 'NOTIFICATION_WORKER' 
  | 'CACHE_ENGINE' 
  | 'PWA_WORKER';

export interface TechnicalLogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'CRITICAL';
  service: 'HTTP_SERVER' | 'ROUTER' | 'AUTH_SERVICE' | 'DB_QUERY' | 'NOTIFICATION_WORKER' | 'CACHE_ENGINE' | 'PWA_WORKER';
  message: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  statusCode?: number;
}

export interface CrashReport {
  id: string;
  title: string;
  message: string;
  stackTrace: string;
  component: string;
  browser: string;
  os: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved';
  occurrences: number;
  firstSeen: string;
  lastSeen: string;
  resolutionNote?: string;
}

export interface DbTableColumn {
  name: string;
  type: string;
  isPii: boolean;
  isPrimaryKey?: boolean;
  indexed?: boolean;
}

export interface DbTableMetadata {
  name: string;
  rowCount: number;
  sizeKb: number;
  indexesCount: number;
  isRestrictedCustomerPii: boolean;
  description: string;
  columns: DbTableColumn[];
}

export interface DbQueryBenchmarkResult {
  query: string;
  executionTimeMs: number;
  rowsAffected: number;
  plan: string;
  status: 'success' | 'restricted' | 'error';
  explanation?: string;
}

export interface PushNotificationTemplate {
  id: string;
  title: string;
  body: string;
  icon?: string;
  url: string;
  topic: 'all_users' | 'registered_agents' | 'buyers' | 'dev_cohort';
  badge?: string;
  createdAt: string;
}

export interface PushDispatchLog {
  id: string;
  timestamp: string;
  title: string;
  topic: string;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  status: 'sent' | 'queued' | 'failed';
}

export interface MaintenanceConfig {
  enabled: boolean;
  scheduledStart?: string;
  estimatedMinutes: number;
  headline: string;
  message: string;
  allowBypassToken: boolean;
  bypassToken: string;
  readOnlyMode: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface DevAuthSession {
  token: string;
  developerEmail: string;
  developerName: string;
  role: 'developer';
  scopes: string[];
  expiresAt: string;
  isAuthenticated: boolean;
}

export interface DevConfigSettings {
  environment: 'production' | 'staging' | 'development';
  rateLimitPerMin: number;
  cacheTtlSeconds: number;
  featureFlags: {
    enableVirtualTours: boolean;
    strictRateLimit: boolean;
    pwaBackgroundSync: boolean;
    highFidelityTelemetry: boolean;
    mockErrorSimulation: boolean;
    geoLocationAutocomplete: boolean;
  };
  webhookAlertUrl: string;
  logRetentionDays: number;
  jwtSecretMasked: string;
}

