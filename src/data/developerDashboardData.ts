import { 
  DevSystemVitals, 
  AppVersionRecord, 
  TechnicalLogEntry, 
  CrashReport, 
  DbTableMetadata, 
  PushNotificationTemplate, 
  PushDispatchLog, 
  MaintenanceConfig, 
  DevConfigSettings,
  ApiHealthEndpoint
} from '../types';

export const MASTER_DEV_KEY = 'dev_sec_99482_ns';
export const MASTER_DEV_PIN = '2409';
export const DEVELOPER_PROFILE = {
  name: 'Siddharth Dev',
  email: 'dev.lead@nsproperties.in',
  role: 'developer' as const,
  department: 'Core Engineering & Cloud Infrastructure',
  leadId: 'DEV-ENG-0881',
  securityLevel: 'LEVEL_3_TECHNICAL_SANDBOX'
};

export const DEFAULT_DEV_VITALS: DevSystemVitals = {
  environment: 'production',
  nodeVersion: 'v22.14.0',
  viteVersion: '6.1.1',
  uptimeSeconds: 184520,
  memoryRssMb: 84,
  memoryHeapMb: 42,
  cpuLoadPercent: 14.8,
  activeConnections: 146,
  cacheHitRatio: 96.4,
  isMaintenanceMode: false,
  activeVersion: 'v2.4.2',
  dbPoolConnections: 12,
  lastDeploymentTime: '24 Sep 2026, 17:40 IST'
};

export const INITIAL_APP_VERSIONS: AppVersionRecord[] = [
  {
    id: 'ver-242',
    version: 'v2.4.2',
    buildNumber: 142,
    releaseChannel: 'stable',
    releaseDate: '24 Sep 2026',
    title: 'Owner Superadmin & Developer Tech Isolation Release',
    notes: [
      'Isolated App Owner Master Console from Developer Technical Dashboard',
      'Implemented secure role boundary shielding customer PII and financials',
      'Added Floor plan vector cache and multi-point map coordinate pins',
      'Enhanced PWA Service Worker caching strategy for offline property search'
    ],
    deployedBy: 'Siddharth Dev (Lead Eng)',
    commitHash: '8b4d1c9',
    minClientVersion: 'v2.4.0',
    forceClientUpdate: false,
    status: 'active'
  },
  {
    id: 'ver-241',
    version: 'v2.4.1',
    buildNumber: 139,
    releaseChannel: 'stable',
    releaseDate: '22 Sep 2026',
    title: 'Floor Plan High-Def Zoom & Phone Unlock Pipeline',
    notes: [
      'SVG vector blueprint rendering with pinch-to-zoom controls',
      'Secure owner phone shield on floor plan detail view',
      'Debounced price filter queries with URL sync'
    ],
    deployedBy: 'Siddharth Dev (Lead Eng)',
    commitHash: '3a7e91f',
    minClientVersion: 'v2.3.8',
    forceClientUpdate: false,
    status: 'archived'
  },
  {
    id: 'ver-250-rc',
    version: 'v2.5.0-rc1',
    buildNumber: 148,
    releaseChannel: 'beta',
    releaseDate: '25 Sep 2026 (Staging)',
    title: 'Candidate 2.5: Real-time Socket Heartbeat & Instant Web Push',
    notes: [
      'WebSocket server heartbeat for live agent availability',
      'Web push notification gateway integration for price drop alerts',
      'Database read-replica benchmark indexing engine'
    ],
    deployedBy: 'Core DevOps Automation',
    commitHash: '9f2a40c',
    minClientVersion: 'v2.4.2',
    forceClientUpdate: true,
    status: 'active'
  }
];

export const INITIAL_API_ENDPOINTS: ApiHealthEndpoint[] = [
  {
    id: 'api-search',
    name: 'Property Query & Filter Engine',
    endpoint: '/api/v1/properties/search',
    method: 'GET',
    status: 'healthy',
    latencyMs: 34,
    lastChecked: 'Just now'
  },
  {
    id: 'api-lead-ingest',
    name: 'Visitor Lead Capture Ingestion',
    endpoint: '/api/v1/leads/capture',
    method: 'POST',
    status: 'healthy',
    latencyMs: 41,
    lastChecked: '30s ago'
  },
  {
    id: 'api-maps-geo',
    name: 'Google Maps Geocoding & Landmarks Matrix',
    endpoint: '/api/v1/maps/distance-matrix',
    method: 'GET',
    status: 'healthy',
    latencyMs: 78,
    lastChecked: '1m ago'
  },
  {
    id: 'api-auth-dev',
    name: 'Developer Backend Authorization Gateway',
    endpoint: '/api/dev/auth/verify',
    method: 'POST',
    status: 'healthy',
    latencyMs: 22,
    lastChecked: 'Just now'
  },
  {
    id: 'api-push-gw',
    name: 'Web Push & PWA Dispatch Service',
    endpoint: '/api/v1/notifications/push-send',
    method: 'POST',
    status: 'healthy',
    latencyMs: 58,
    lastChecked: '2m ago'
  },
  {
    id: 'api-db-replica',
    name: 'Database Primary / Read Pool Heartbeat',
    endpoint: '/api/v1/system/db-health',
    method: 'GET',
    status: 'healthy',
    latencyMs: 19,
    lastChecked: 'Just now'
  },
  {
    id: 'api-pwa-sw',
    name: 'PWA ServiceWorker Manifest & Assets',
    endpoint: '/manifest.webmanifest',
    method: 'GET',
    status: 'healthy',
    latencyMs: 14,
    lastChecked: 'Just now'
  },
  {
    id: 'api-offers-catalog',
    name: 'Plans & Offers Validation & Catalog API',
    endpoint: '/api/v1/offers',
    method: 'GET',
    status: 'healthy',
    latencyMs: 29,
    lastChecked: 'Just now'
  },
  {
    id: 'api-subscription-plans',
    name: 'Agent & Builder Subscription Plans Gateway',
    endpoint: '/api/v1/subscription-plans',
    method: 'GET',
    status: 'healthy',
    latencyMs: 33,
    lastChecked: 'Just now'
  }
];

export const INITIAL_TECHNICAL_LOGS: TechnicalLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '24 Sep 2026, 18:44:12',
    level: 'INFO',
    service: 'HTTP_SERVER',
    message: 'GET /api/v1/properties/search?city=Bengaluru&purpose=buy 200 OK',
    metadata: { latencyMs: 32, matches: 38 },
    ipAddress: '192.168.1.104',
    statusCode: 200
  },
  {
    id: 'log-002',
    timestamp: '24 Sep 2026, 18:43:55',
    level: 'INFO',
    service: 'AUTH_SERVICE',
    message: 'Developer session token authenticated via Bearer token: [dev_sec_***]',
    metadata: { role: 'developer', scopes: ['tech:read', 'tech:write'] },
    ipAddress: '127.0.0.1',
    statusCode: 200
  },
  {
    id: 'log-003',
    timestamp: '24 Sep 2026, 18:42:30',
    level: 'WARN',
    service: 'CACHE_ENGINE',
    message: 'Property thumbnail image cache reached 88% capacity. Running LRU eviction.',
    metadata: { evictedEntries: 12, memoryFreedKb: 4096 }
  },
  {
    id: 'log-004',
    timestamp: '24 Sep 2026, 18:41:09',
    level: 'INFO',
    service: 'DB_QUERY',
    message: 'EXPLAIN ANALYZE SELECT * FROM properties WHERE isVerified = true executed in 18ms',
    metadata: { rowsExamined: 42, indexUsed: 'idx_properties_verified' }
  },
  {
    id: 'log-005',
    timestamp: '24 Sep 2026, 18:39:44',
    level: 'INFO',
    service: 'PWA_WORKER',
    message: 'Service Worker cache sync finished. 28 luxury property vectors precached.',
    metadata: { cacheVersion: 'ns-properties-v2.4.2' }
  },
  {
    id: 'log-006',
    timestamp: '24 Sep 2026, 18:37:18',
    level: 'ERROR',
    service: 'ROUTER',
    message: '404 Not Found: GET /favicon-old.ico requested by crawler bot',
    metadata: { userAgent: 'Googlebot/2.1' },
    statusCode: 404
  },
  {
    id: 'log-007',
    timestamp: '24 Sep 2026, 18:35:02',
    level: 'DEBUG',
    service: 'NOTIFICATION_WORKER',
    message: 'Push dispatcher tick: 0 pending messages in outbound queue.',
    metadata: { activeSubscribers: 284 }
  },
  {
    id: 'log-008',
    timestamp: '24 Sep 2026, 18:30:19',
    level: 'CRITICAL',
    service: 'AUTH_SERVICE',
    message: 'Blocked unauthorized access attempt to /api/owner/financials by non-owner role. Error 403 Forbidden.',
    metadata: { attemptedRole: 'developer', policy: 'OWNER_FINANCIALS_SHIELD' },
    ipAddress: '10.0.4.82',
    statusCode: 403
  }
];

export const INITIAL_CRASH_REPORTS: CrashReport[] = [
  {
    id: 'CRASH-401',
    title: 'TypeError: Cannot read properties of undefined (reading "lat")',
    message: 'Uncaught TypeError when switching city from Bengaluru to custom plot without coordinate mapping.',
    stackTrace: `TypeError: Cannot read properties of undefined (reading 'lat')
  at LocationMapEngine.renderPins (src/components/LocationMapEngine.tsx:142:19)
  at commitHookEffectListMount (react-dom.development.js:23150:26)
  at commitPassiveMountEffects (react-dom.development.js:23230:11)`,
    component: 'LocationMapEngine.tsx',
    browser: 'Chrome 124.0.0.0',
    os: 'Windows 11',
    severity: 'high',
    status: 'investigating',
    occurrences: 6,
    firstSeen: '24 Sep 2026, 11:20 AM',
    lastSeen: '24 Sep 2026, 04:15 PM'
  },
  {
    id: 'CRASH-402',
    title: 'DOMException: Failed to execute "requestFullscreen" on Element',
    message: 'User gesture requirement not satisfied when tapping floor plan fullscreen vector icon on iOS Safari.',
    stackTrace: `DOMException: Failed to execute 'requestFullscreen' on 'Element': API can only be initiated by a user gesture.
  at handleToggleFullscreen (src/components/PropertyFloorPlanView.tsx:88:14)
  at HTMLButtonElement.dispatch (react-dom.development.js:8492:12)`,
    component: 'PropertyFloorPlanView.tsx',
    browser: 'Mobile Safari 17.4',
    os: 'iOS 17.4.1',
    severity: 'medium',
    status: 'open',
    occurrences: 14,
    firstSeen: '23 Sep 2026, 09:30 AM',
    lastSeen: '24 Sep 2026, 05:40 PM'
  },
  {
    id: 'CRASH-403',
    title: 'RangeError: Maximum call stack size exceeded in price filter debounce',
    message: 'Recursive state trigger loop when slider min/max both set to zero simultaneously.',
    stackTrace: `RangeError: Maximum call stack size exceeded
  at applyPriceRange (src/components/FilterSidebar.tsx:312:9)
  at FilterSidebar.onChange (src/components/FilterSidebar.tsx:318:11)`,
    component: 'FilterSidebar.tsx',
    browser: 'Firefox 126.0',
    os: 'macOS Sonoma',
    severity: 'low',
    status: 'resolved',
    occurrences: 3,
    firstSeen: '22 Sep 2026, 02:15 PM',
    lastSeen: '22 Sep 2026, 03:00 PM',
    resolutionNote: 'Fixed in v2.4.2 by applying math clamped thresholds to debounce values.'
  }
];

export const INITIAL_DATABASE_METADATA: DbTableMetadata[] = [
  {
    name: 'properties',
    rowCount: 42,
    sizeKb: 684,
    indexesCount: 5,
    isRestrictedCustomerPii: false,
    description: 'Public property listings catalog, specs, BHK, amenities, prices, and media URLs.',
    columns: [
      { name: 'id', type: 'UUID', isPii: false, isPrimaryKey: true, indexed: true },
      { name: 'title', type: 'VARCHAR(255)', isPii: false, indexed: true },
      { name: 'price', type: 'BIGINT', isPii: false, indexed: true },
      { name: 'city', type: 'VARCHAR(100)', isPii: false, indexed: true },
      { name: 'locality', type: 'VARCHAR(150)', isPii: false, indexed: true },
      { name: 'bhk', type: 'INT', isPii: false, indexed: true },
      { name: 'area_sqft', type: 'INT', isPii: false },
      { name: 'is_verified', type: 'BOOLEAN', isPii: false, indexed: true },
      { name: 'video_url', type: 'TEXT', isPii: false },
      { name: 'latitude', type: 'DOUBLE', isPii: false },
      { name: 'longitude', type: 'DOUBLE', isPii: false },
      { name: 'created_at', type: 'TIMESTAMP', isPii: false }
    ]
  },
  {
    name: 'locations',
    rowCount: 6,
    sizeKb: 32,
    indexesCount: 2,
    isRestrictedCustomerPii: false,
    description: 'City and locality coordinate mappings, average sq ft prices, and landmarks.',
    columns: [
      { name: 'id', type: 'VARCHAR(50)', isPii: false, isPrimaryKey: true },
      { name: 'city', type: 'VARCHAR(100)', isPii: false, indexed: true },
      { name: 'locality', type: 'VARCHAR(150)', isPii: false, indexed: true },
      { name: 'lat', type: 'DOUBLE', isPii: false },
      { name: 'lng', type: 'DOUBLE', isPii: false },
      { name: 'avg_price_sqft', type: 'INT', isPii: false }
    ]
  },
  {
    name: 'system_logs',
    rowCount: 1420,
    sizeKb: 1240,
    indexesCount: 3,
    isRestrictedCustomerPii: false,
    description: 'System runtime events, HTTP response times, and application error traces.',
    columns: [
      { name: 'id', type: 'VARCHAR(50)', isPii: false, isPrimaryKey: true },
      { name: 'level', type: 'VARCHAR(10)', isPii: false, indexed: true },
      { name: 'service', type: 'VARCHAR(50)', isPii: false, indexed: true },
      { name: 'message', type: 'TEXT', isPii: false },
      { name: 'timestamp', type: 'TIMESTAMP', isPii: false, indexed: true }
    ]
  },
  {
    name: 'push_subscriptions',
    rowCount: 284,
    sizeKb: 112,
    indexesCount: 2,
    isRestrictedCustomerPii: false,
    description: 'Anonymous Web Push registration tokens, VAPID endpoints, and client topics.',
    columns: [
      { name: 'id', type: 'UUID', isPii: false, isPrimaryKey: true },
      { name: 'endpoint', type: 'TEXT', isPii: false },
      { name: 'p256dh', type: 'VARCHAR(255)', isPii: false },
      { name: 'auth', type: 'VARCHAR(100)', isPii: false },
      { name: 'topic', type: 'VARCHAR(50)', isPii: false, indexed: true },
      { name: 'created_at', type: 'TIMESTAMP', isPii: false }
    ]
  },
  {
    name: 'customer_leads',
    rowCount: 68,
    sizeKb: 240,
    indexesCount: 4,
    isRestrictedCustomerPii: true,
    description: 'RESTRICTED TABLE: Buyer phone numbers, private emails, budget inquiries, and site visit bookings.',
    columns: [
      { name: 'id', type: 'VARCHAR(50)', isPii: false, isPrimaryKey: true },
      { name: 'name', type: 'VARCHAR(150)', isPii: true },
      { name: 'phone', type: 'VARCHAR(20) [ENCRYPTED]', isPii: true },
      { name: 'email', type: 'VARCHAR(255) [ENCRYPTED]', isPii: true },
      { name: 'budget_range', type: 'VARCHAR(100)', isPii: true },
      { name: 'status', type: 'VARCHAR(50)', isPii: false },
      { name: 'assigned_agent', type: 'VARCHAR(100)', isPii: false }
    ]
  },
  {
    name: 'invoices_and_payments',
    rowCount: 45,
    sizeKb: 190,
    indexesCount: 3,
    isRestrictedCustomerPii: true,
    description: 'RESTRICTED TABLE: Subscription revenue, agent plan billing, bank payouts, and payment gateway receipts.',
    columns: [
      { name: 'invoice_id', type: 'VARCHAR(50)', isPii: false, isPrimaryKey: true },
      { name: 'user_name', type: 'VARCHAR(150)', isPii: true },
      { name: 'amount_inr', type: 'DECIMAL(12,2) [ENCRYPTED]', isPii: true },
      { name: 'payment_method', type: 'VARCHAR(100) [ENCRYPTED]', isPii: true },
      { name: 'status', type: 'VARCHAR(20)', isPii: false },
      { name: 'settled_at', type: 'TIMESTAMP', isPii: false }
    ]
  },
  {
    name: 'offers',
    rowCount: 5,
    sizeKb: 64,
    indexesCount: 4,
    isRestrictedCustomerPii: false,
    description: 'Promotional campaigns, festival concessions, builder rebates, and discount validity limits.',
    columns: [
      { name: 'id', type: 'VARCHAR(50)', isPii: false, isPrimaryKey: true, indexed: true },
      { name: 'title', type: 'VARCHAR(255)', isPii: false, indexed: true },
      { name: 'discount_type', type: 'ENUM(percentage, fixed)', isPii: false },
      { name: 'discount_value', type: 'DECIMAL(12,2)', isPii: false },
      { name: 'start_date', type: 'DATE', isPii: false, indexed: true },
      { name: 'end_date', type: 'DATE', isPii: false, indexed: true },
      { name: 'status', type: 'ENUM(active, inactive, expired)', isPii: false, indexed: true },
      { name: 'category', type: 'VARCHAR(50)', isPii: false },
      { name: 'min_booking_amount', type: 'BIGINT', isPii: false },
      { name: 'usage_limit', type: 'INT', isPii: false },
      { name: 'usage_count', type: 'INT', isPii: false }
    ]
  },
  {
    name: 'offer_properties',
    rowCount: 12,
    sizeKb: 28,
    indexesCount: 3,
    isRestrictedCustomerPii: false,
    description: 'Junction mapping linking offers to specific luxury properties, project towers, and discounted prices.',
    columns: [
      { name: 'id', type: 'UUID', isPii: false, isPrimaryKey: true },
      { name: 'offer_id', type: 'VARCHAR(50)', isPii: false, indexed: true },
      { name: 'property_id', type: 'VARCHAR(50)', isPii: false, indexed: true },
      { name: 'original_price', type: 'BIGINT', isPii: false },
      { name: 'discounted_price', type: 'BIGINT', isPii: false },
      { name: 'savings_amount', type: 'BIGINT', isPii: false }
    ]
  },
  {
    name: 'subscription_plans',
    rowCount: 4,
    sizeKb: 36,
    indexesCount: 2,
    isRestrictedCustomerPii: false,
    description: 'B2B broker and builder subscription plans (Free, Silver, Gold, Premium) and tier limits.',
    columns: [
      { name: 'id', type: 'VARCHAR(50)', isPii: false, isPrimaryKey: true },
      { name: 'name', type: 'VARCHAR(100)', isPii: false, indexed: true },
      { name: 'price', type: 'DECIMAL(10,2)', isPii: false },
      { name: 'billing_period', type: 'VARCHAR(20)', isPii: false },
      { name: 'listing_limit', type: 'INT', isPii: false },
      { name: 'lead_access_limit', type: 'VARCHAR(100)', isPii: false },
      { name: 'featured_benefits', type: 'TEXT', isPii: false },
      { name: 'duration_days', type: 'INT', isPii: false },
      { name: 'status', type: 'VARCHAR(20)', isPii: false, indexed: true }
    ]
  },
  {
    name: 'customer_subscriptions',
    rowCount: 225,
    sizeKb: 310,
    indexesCount: 4,
    isRestrictedCustomerPii: true,
    description: 'RESTRICTED TABLE: Active agent and builder memberships, payment gateway status, and quotas.',
    columns: [
      { name: 'id', type: 'VARCHAR(50)', isPii: false, isPrimaryKey: true },
      { name: 'user_id', type: 'VARCHAR(50)', isPii: true, indexed: true },
      { name: 'plan_id', type: 'VARCHAR(50)', isPii: false, indexed: true },
      { name: 'price_paid', type: 'DECIMAL(10,2)', isPii: true },
      { name: 'gateway_status', type: 'VARCHAR(50)', isPii: false },
      { name: 'expiry_date', type: 'DATE', isPii: false, indexed: true },
      { name: 'status', type: 'VARCHAR(20)', isPii: false }
    ]
  },
  {
    name: 'offer_enquiries',
    rowCount: 147,
    sizeKb: 185,
    indexesCount: 4,
    isRestrictedCustomerPii: true,
    description: 'RESTRICTED TABLE: Inquiries submitted specifically for promotional deals, assigned RM, and contact status.',
    columns: [
      { name: 'id', type: 'VARCHAR(50)', isPii: false, isPrimaryKey: true },
      { name: 'offer_id', type: 'VARCHAR(50)', isPii: false, indexed: true },
      { name: 'customer_name', type: 'VARCHAR(150)', isPii: true },
      { name: 'customer_phone', type: 'VARCHAR(20) [ENCRYPTED]', isPii: true },
      { name: 'customer_email', type: 'VARCHAR(255) [ENCRYPTED]', isPii: true },
      { name: 'status', type: 'VARCHAR(30)', isPii: false, indexed: true },
      { name: 'assigned_staff_id', type: 'VARCHAR(50)', isPii: false, indexed: true },
      { name: 'created_at', type: 'TIMESTAMP', isPii: false }
    ]
  },
  {
    name: 'offer_usage',
    rowCount: 59,
    sizeKb: 92,
    indexesCount: 3,
    isRestrictedCustomerPii: true,
    description: 'RESTRICTED TABLE: Redemptions and discount applications verified on booking token transactions.',
    columns: [
      { name: 'id', type: 'VARCHAR(50)', isPii: false, isPrimaryKey: true },
      { name: 'offer_id', type: 'VARCHAR(50)', isPii: false, indexed: true },
      { name: 'property_id', type: 'VARCHAR(50)', isPii: false, indexed: true },
      { name: 'booking_amount', type: 'BIGINT', isPii: true },
      { name: 'discount_applied', type: 'BIGINT', isPii: false },
      { name: 'status', type: 'VARCHAR(30)', isPii: false },
      { name: 'used_at', type: 'TIMESTAMP', isPii: false }
    ]
  },
  {
    name: 'offer_activity_logs',
    rowCount: 320,
    sizeKb: 240,
    indexesCount: 3,
    isRestrictedCustomerPii: false,
    description: 'Audit trail for offer creations, price modifications, activation toggles, and plan revisions.',
    columns: [
      { name: 'id', type: 'VARCHAR(50)', isPii: false, isPrimaryKey: true },
      { name: 'action', type: 'VARCHAR(50)', isPii: false, indexed: true },
      { name: 'entity_type', type: 'VARCHAR(30)', isPii: false },
      { name: 'entity_id', type: 'VARCHAR(50)', isPii: false, indexed: true },
      { name: 'performed_by', type: 'VARCHAR(150)', isPii: false },
      { name: 'user_role', type: 'VARCHAR(30)', isPii: false },
      { name: 'timestamp', type: 'TIMESTAMP', isPii: false, indexed: true },
      { name: 'details', type: 'TEXT', isPii: false }
    ]
  }
];

export const INITIAL_PUSH_TEMPLATES: PushNotificationTemplate[] = [
  {
    id: 'push-01',
    title: '⚡ Price Drop Alert: 3 BHK in Sobha Dream Acres',
    body: 'Exclusive ₹ 15 Lakh price revision just announced. Tap to view updated floor plan & photos.',
    icon: '/icon.svg',
    url: '/?filter=recent',
    topic: 'all_users',
    badge: 'LUXURY_DROP',
    createdAt: '24 Sep 2026'
  },
  {
    id: 'push-02',
    title: '🏢 New Developer Launch: Godrej Splendour Phase 2',
    body: 'Early bird inventory unlocked for certified agents and VIP buyers. Direct booking open.',
    icon: '/icon.svg',
    url: '/?city=Bengaluru',
    topic: 'registered_agents',
    badge: 'NEW_LAUNCH',
    createdAt: '23 Sep 2026'
  },
  {
    id: 'push-03',
    title: '🛠️ Scheduled System Update in 15 Minutes',
    body: 'Dev testing notification: Server maintenance window starting at 02:00 AM IST.',
    icon: '/icon.svg',
    url: '/',
    topic: 'dev_cohort',
    badge: 'DEV_ALERT',
    createdAt: '24 Sep 2026'
  }
];

export const INITIAL_PUSH_LOGS: PushDispatchLog[] = [
  {
    id: 'dispatch-001',
    timestamp: '24 Sep 2026, 17:15',
    title: '⚡ Price Drop Alert: 3 BHK in Sobha Dream Acres',
    topic: 'all_users',
    sentCount: 284,
    deliveredCount: 279,
    failedCount: 5,
    status: 'sent'
  },
  {
    id: 'dispatch-002',
    timestamp: '23 Sep 2026, 10:00',
    title: '🏢 New Developer Launch: Godrej Splendour Phase 2',
    topic: 'registered_agents',
    sentCount: 38,
    deliveredCount: 38,
    failedCount: 0,
    status: 'sent'
  }
];

export const DEFAULT_MAINTENANCE_CONFIG: MaintenanceConfig = {
  enabled: false,
  scheduledStart: '25 Sep 2026, 02:00 IST',
  estimatedMinutes: 30,
  headline: 'NS Properties Scheduled Infrastructure Upgrades',
  message: 'Our technical engineering team is deploying database read-replica optimizations and high-speed search indexing. We will be back online shortly.',
  allowBypassToken: true,
  bypassToken: 'dev-master-bypass',
  readOnlyMode: false,
  updatedAt: '24 Sep 2026, 18:00 IST',
  updatedBy: 'Siddharth Dev (Lead Eng)'
};

export const DEFAULT_DEV_CONFIG_SETTINGS: DevConfigSettings = {
  environment: 'production',
  rateLimitPerMin: 120,
  cacheTtlSeconds: 3600,
  featureFlags: {
    enableVirtualTours: true,
    strictRateLimit: true,
    pwaBackgroundSync: true,
    highFidelityTelemetry: true,
    mockErrorSimulation: false,
    geoLocationAutocomplete: true
  },
  webhookAlertUrl: 'https://api.nsproperties.in/webhooks/ops-alerts',
  logRetentionDays: 30,
  jwtSecretMasked: 'ns_jwt_sec_••••••••••••••••••••••••3821'
};
