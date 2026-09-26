import type { IncomingMessage, ServerResponse } from 'http';
import { 
  INITIAL_OFFERS, 
  INITIAL_SUBSCRIPTION_PLANS, 
  INITIAL_OFFER_ENQUIRIES, 
  INITIAL_OFFER_LOGS,
  isOfferActiveAndValid 
} from '../data/plansOffersData';
import { Offer, SubscriptionPlan, OfferEnquiry, OfferActivityLog } from '../types';

// In-memory Offers & Plans Data on Backend
let backendOffers: Offer[] = [...INITIAL_OFFERS];
let backendPlans: SubscriptionPlan[] = [...INITIAL_SUBSCRIPTION_PLANS];
let backendOfferEnquiries: OfferEnquiry[] = [...INITIAL_OFFER_ENQUIRIES];
let backendOfferLogs: OfferActivityLog[] = [...INITIAL_OFFER_LOGS];

// In-memory maintenance state on backend
let backendMaintenanceState = {
  enabled: false,
  scheduledStart: '25 Sep 2026, 02:00 IST',
  estimatedMinutes: 30,
  headline: 'NS Properties Scheduled Infrastructure Upgrades',
  message: 'Our technical engineering team is deploying database read-replica optimizations and high-speed search indexing. We will be back online shortly.',
  allowBypassToken: true,
  bypassToken: 'dev-master-bypass',
  readOnlyMode: false,
  updatedAt: new Date().toISOString(),
  updatedBy: 'Siddharth Dev (Lead Eng)'
};

// In-memory technical log entries
let technicalLogs: Array<{
  id: string;
  timestamp: string;
  level: string;
  service: string;
  message: string;
  statusCode?: number;
}> = [
  {
    id: 'log-srv-01',
    timestamp: new Date().toISOString(),
    level: 'INFO',
    service: 'HTTP_SERVER',
    message: 'Backend API subsystem initialized on port 3000',
    statusCode: 200
  },
  {
    id: 'log-srv-02',
    timestamp: new Date().toISOString(),
    level: 'INFO',
    service: 'AUTH_SERVICE',
    message: 'Developer security boundary active. Customer PII and Owner payments protected.',
    statusCode: 200
  }
];

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Dev-Bypass-Token'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

export function devBackendMiddleware(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const url = req.url || '';

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Dev-Bypass-Token'
    });
    res.end();
    return;
  }

  // Intercept any attempt to reach forbidden owner or customer personal data
  if (
    url.includes('/api/dev/owner') ||
    url.includes('/api/dev/customer-leads') ||
    url.includes('/api/dev/payments') ||
    url.includes('/api/dev/invoices') ||
    url.includes('/api/dev/staff-salaries')
  ) {
    sendJson(res, 403, {
      error: 'ACCESS_FORBIDDEN',
      code: 'DEV_SECURITY_BOUNDARY_VIOLATION',
      message: 'CRITICAL SECURITY BREACH PREVENTED: Developer role does not have authorization to access Customer Personal Data, Payments, or Owner Settings.'
    });
    return;
  }

  const cleanUrl = url.split('?')[0];
  const userRole = (req.headers['x-user-role'] as string) || 'customer';

  // ==========================================
  // PLANS & OFFERS API SUBSYSTEM
  // ==========================================

  // 1. PUBLIC OFFERS CATALOG (Active & Valid Only)
  if (cleanUrl === '/api/v1/offers' && req.method === 'GET') {
    const validOffers = backendOffers.filter(isOfferActiveAndValid);
    sendJson(res, 200, {
      success: true,
      count: validOffers.length,
      offers: validOffers
    });
    return;
  }

  // 2. OWNER ALL OFFERS (Including Inactive & Expired)
  if (cleanUrl === '/api/v1/offers/all' && req.method === 'GET') {
    if (userRole !== 'owner' && userRole !== 'admin') {
      sendJson(res, 403, { error: 'ACCESS_FORBIDDEN', message: 'Owner authorization required.' });
      return;
    }
    sendJson(res, 200, {
      success: true,
      count: backendOffers.length,
      offers: backendOffers
    });
    return;
  }

  // 3. CREATE NEW OFFER (Owner Only)
  if (cleanUrl === '/api/v1/offers' && req.method === 'POST') {
    if (userRole === 'developer') {
      sendJson(res, 403, {
        error: 'DEVELOPER_ROLE_RESTRICTED',
        message: 'Security policy violation: Developer role cannot create or modify business offers, pricing, or discounts.'
      });
      return;
    }
    if (userRole !== 'owner' && userRole !== 'admin') {
      sendJson(res, 403, { error: 'ACCESS_FORBIDDEN', message: 'Only authorized Owners can create offers.' });
      return;
    }

    parseBody(req).then((body) => {
      // Validation
      if (!body.title || !body.discountValue || !body.startDate || !body.endDate) {
        sendJson(res, 400, { error: 'VALIDATION_FAILED', message: 'Title, discount value, start date, and end date are required.' });
        return;
      }
      if (new Date(body.startDate) > new Date(body.endDate)) {
        sendJson(res, 400, { error: 'VALIDATION_FAILED', message: 'Offer start date cannot be after expiry date.' });
        return;
      }
      if (body.discountValue <= 0) {
        sendJson(res, 400, { error: 'VALIDATION_FAILED', message: 'Discount value must be greater than zero.' });
        return;
      }

      const newOffer: Offer = {
        id: body.id || `off-${Date.now()}`,
        title: body.title,
        description: body.description || '',
        bannerImage: body.bannerImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        discountType: body.discountType || 'percentage',
        discountValue: Number(body.discountValue),
        startDate: body.startDate,
        endDate: body.endDate,
        status: body.status || 'active',
        category: body.category || 'property_discount',
        featured: !!body.featured,
        applicablePropertyIds: Array.isArray(body.applicablePropertyIds) ? body.applicablePropertyIds : ['ALL'],
        applicableProjectNames: body.applicableProjectNames || [],
        minBookingAmount: body.minBookingAmount ? Number(body.minBookingAmount) : undefined,
        termsAndConditions: Array.isArray(body.termsAndConditions) ? body.termsAndConditions : ['Subject to standard developer terms.'],
        usageLimit: body.usageLimit ? Number(body.usageLimit) : undefined,
        usageCount: 0,
        viewsCount: 0,
        enquiriesCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Owner'
      };

      backendOffers.unshift(newOffer);
      backendOfferLogs.unshift({
        id: `log-${Date.now()}`,
        action: 'CREATE',
        entityType: 'offer',
        entityId: newOffer.id,
        title: newOffer.title,
        performedBy: 'Owner',
        userRole: 'owner',
        timestamp: new Date().toLocaleString(),
        details: `Created new offer: ${newOffer.title} with discount ${newOffer.discountValue}${newOffer.discountType === 'percentage' ? '%' : ' INR'}`
      });

      sendJson(res, 201, { success: true, offer: newOffer });
    });
    return;
  }

  // 4. UPDATE OFFER (Owner Only)
  if (cleanUrl.startsWith('/api/v1/offers/') && req.method === 'PUT') {
    const offerId = cleanUrl.replace('/api/v1/offers/', '');
    if (userRole === 'developer') {
      sendJson(res, 403, {
        error: 'DEVELOPER_ROLE_RESTRICTED',
        message: 'Security policy violation: Developer role cannot modify business offers, pricing, or discounts.'
      });
      return;
    }
    if (userRole !== 'owner' && userRole !== 'admin') {
      sendJson(res, 403, { error: 'ACCESS_FORBIDDEN', message: 'Only authorized Owners can update offers.' });
      return;
    }

    parseBody(req).then((body) => {
      const idx = backendOffers.findIndex(o => o.id === offerId);
      if (idx === -1) {
        sendJson(res, 404, { error: 'NOT_FOUND', message: 'Offer not found.' });
        return;
      }

      backendOffers[idx] = {
        ...backendOffers[idx],
        ...body,
        updatedAt: new Date().toISOString()
      };

      backendOfferLogs.unshift({
        id: `log-${Date.now()}`,
        action: 'UPDATE',
        entityType: 'offer',
        entityId: offerId,
        title: backendOffers[idx].title,
        performedBy: 'Owner',
        userRole: 'owner',
        timestamp: new Date().toLocaleString(),
        details: `Updated offer properties & terms for ${backendOffers[idx].title}`
      });

      sendJson(res, 200, { success: true, offer: backendOffers[idx] });
    });
    return;
  }

  // 5. DELETE OFFER (Owner Only)
  if (cleanUrl.startsWith('/api/v1/offers/') && req.method === 'DELETE') {
    const offerId = cleanUrl.replace('/api/v1/offers/', '');
    if (userRole === 'developer') {
      sendJson(res, 403, {
        error: 'DEVELOPER_ROLE_RESTRICTED',
        message: 'Security policy violation: Developer role cannot delete business offers.'
      });
      return;
    }
    if (userRole !== 'owner' && userRole !== 'admin') {
      sendJson(res, 403, { error: 'ACCESS_FORBIDDEN', message: 'Only authorized Owners can delete offers.' });
      return;
    }

    const removed = backendOffers.find(o => o.id === offerId);
    backendOffers = backendOffers.filter(o => o.id !== offerId);
    if (removed) {
      backendOfferLogs.unshift({
        id: `log-${Date.now()}`,
        action: 'DELETE',
        entityType: 'offer',
        entityId: offerId,
        title: removed.title,
        performedBy: 'Owner',
        userRole: 'owner',
        timestamp: new Date().toLocaleString(),
        details: `Deleted offer: ${removed.title}`
      });
    }
    sendJson(res, 200, { success: true, message: 'Offer deleted successfully.' });
    return;
  }

  // 6. CUSTOMER OFFER ENQUIRY
  if (cleanUrl === '/api/v1/offers/enquire' && req.method === 'POST') {
    parseBody(req).then((body) => {
      if (!body.customerPhone || !body.offerId) {
        sendJson(res, 400, { error: 'VALIDATION_FAILED', message: 'Phone number and offer selection are required.' });
        return;
      }

      const newEnquiry: OfferEnquiry = {
        id: `enq-off-${Date.now()}`,
        offerId: body.offerId,
        offerTitle: body.offerTitle || 'Promotional Deal',
        propertyId: body.propertyId,
        propertyTitle: body.propertyTitle,
        customerName: body.customerName || 'Verified Customer',
        customerPhone: body.customerPhone,
        customerEmail: body.customerEmail || '',
        preferredTime: body.preferredTime,
        message: body.message || 'Customer requested offer concession and booking callback.',
        status: 'New',
        assignedStaffId: 'staff-01',
        assignedStaffName: 'Vikram Aditya',
        createdAt: new Date().toISOString()
      };

      backendOfferEnquiries.unshift(newEnquiry);
      
      // Increment enquiry count on offer
      const off = backendOffers.find(o => o.id === body.offerId);
      if (off) {
        off.enquiriesCount = (off.enquiriesCount || 0) + 1;
      }

      sendJson(res, 201, { success: true, message: 'Offer enquiry registered successfully.', enquiry: newEnquiry });
    });
    return;
  }

  // 7. SUBSCRIPTION PLANS (Public GET / Owner POST & PUT)
  if (cleanUrl === '/api/v1/subscription-plans' || cleanUrl === '/api/v1/plans') {
    if (req.method === 'GET') {
      sendJson(res, 200, { success: true, count: backendPlans.length, plans: backendPlans });
      return;
    }
    if (req.method === 'POST') {
      if (userRole === 'developer') {
        sendJson(res, 403, {
          error: 'DEVELOPER_ROLE_RESTRICTED',
          message: 'Security policy violation: Developer role cannot create subscription tiers or set subscription fees.'
        });
        return;
      }
      if (userRole !== 'owner' && userRole !== 'admin') {
        sendJson(res, 403, { error: 'ACCESS_FORBIDDEN', message: 'Only authorized Owners can create subscription plans.' });
        return;
      }

      parseBody(req).then((body) => {
        const newPlan: SubscriptionPlan = {
          id: body.id || `plan-${Date.now()}`,
          name: body.name || 'New Tier',
          roleTarget: body.roleTarget || 'Agent',
          price: Number(body.price || 0),
          billingCycle: body.billingCycle || 'Quarterly',
          billingPeriod: body.billingPeriod || body.billingCycle || 'Quarterly',
          listingLimit: Number(body.listingLimit || body.propertyListingLimit || 5),
          propertyListingLimit: Number(body.propertyListingLimit || body.listingLimit || 5),
          featuredLimit: Number(body.featuredLimit || 1),
          leadsAccess: body.leadsAccess || 'Standard',
          leadAccessLimit: body.leadAccessLimit || '20 Leads / mo',
          featuredListingBenefits: body.featuredListingBenefits || 'Standard Featured Listing',
          advertisementBenefits: body.advertisementBenefits || 'Standard Directory Placement',
          durationDays: Number(body.durationDays || 90),
          renewalOption: body.renewalOption || 'manual',
          planStatus: body.planStatus || 'active',
          activeSubscribers: 0,
          tagline: body.tagline || '',
          popular: !!body.popular,
          features: Array.isArray(body.features) ? body.features : ['Standard broker features']
        };

        backendPlans.push(newPlan);
        backendOfferLogs.unshift({
          id: `log-${Date.now()}`,
          action: 'PLAN_CREATED',
          entityType: 'subscription_plan',
          entityId: newPlan.id,
          title: newPlan.name,
          performedBy: 'Owner',
          userRole: 'owner',
          timestamp: new Date().toLocaleString(),
          details: `Created subscription plan: ${newPlan.name} at ₹${newPlan.price}`
        });

        sendJson(res, 201, { success: true, plan: newPlan });
      });
      return;
    }
  }

  // 8. PAYMENT GATEWAY ENFORCEMENT ON SUBSCRIPTIONS
  // Requirement 3: "Do not activate paid subscriptions or collect payments without a properly configured payment gateway."
  if (cleanUrl === '/api/v1/subscriptions/subscribe' && req.method === 'POST') {
    parseBody(req).then((body) => {
      const plan = backendPlans.find(p => p.id === body.planId);
      if (plan && plan.price > 0) {
        // Enforce strict payment gateway check
        sendJson(res, 400, {
          success: false,
          error: 'PAYMENT_GATEWAY_NOT_CONFIGURED',
          code: 'PG_CONFIG_REQUIRED',
          message: 'Payment Gateway Security Lock: Real-time payment gateway (Razorpay / Stripe) is currently in Sandbox/Restricted mode. Paid subscriptions cannot collect live money without an active merchant gateway key.',
          planRequested: plan.name,
          price: plan.price
        });
        return;
      }
      sendJson(res, 200, {
        success: true,
        message: 'Free Starter plan membership activated successfully.',
        subscription: {
          planId: plan?.id || 'plan-free',
          status: 'active',
          startDate: new Date().toISOString()
        }
      });
    });
    return;
  }

  // 9. OFFER AUDIT LOGS & ANALYTICS (Owner Only)
  if (cleanUrl === '/api/v1/offers/logs' && req.method === 'GET') {
    if (userRole !== 'owner' && userRole !== 'admin') {
      sendJson(res, 403, { error: 'ACCESS_FORBIDDEN', message: 'Owner authorization required.' });
      return;
    }
    sendJson(res, 200, { success: true, logs: backendOfferLogs });
    return;
  }

  if (!url.startsWith('/api/dev')) {
    return next();
  }

  // 1. Auth Login
  if (cleanUrl === '/api/dev/auth/login' && req.method === 'POST') {
    parseBody(req).then((body) => {
      const cred = (body.credential || '').trim();
      if (cred === 'dev_sec_99482_ns' || cred === '2409' || cred === 'dev.lead@nsproperties.in') {
        const token = `dev_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        technicalLogs.unshift({
          id: `log-srv-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          level: 'INFO',
          service: 'AUTH_SERVICE',
          message: 'Developer authenticated successfully via Master Secret',
          statusCode: 200
        });

        sendJson(res, 200, {
          success: true,
          message: 'Developer Backend Authorization Verified',
          session: {
            token,
            developerEmail: 'dev.lead@nsproperties.in',
            developerName: 'Siddharth Dev',
            role: 'developer',
            scopes: [
              'tech:home',
              'tech:versions',
              'tech:apis',
              'tech:logs',
              'tech:errors',
              'tech:db_tools',
              'tech:push',
              'tech:maintenance',
              'tech:settings'
            ],
            expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
            isAuthenticated: true
          }
        });
      } else {
        technicalLogs.unshift({
          id: `log-srv-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          level: 'WARN',
          service: 'AUTH_SERVICE',
          message: 'Failed developer authentication attempt with invalid credential',
          statusCode: 401
        });
        sendJson(res, 401, {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Invalid Developer Key or Master PIN'
        });
      }
    });
    return;
  }

  // 2. System Vitals & Status
  if (cleanUrl === '/api/dev/status' && req.method === 'GET') {
    const mem = process.memoryUsage();
    sendJson(res, 200, {
      environment: 'production',
      nodeVersion: process.version,
      viteVersion: '6.1.1',
      uptimeSeconds: Math.floor(process.uptime()),
      memoryRssMb: Math.round(mem.rss / 1024 / 1024),
      memoryHeapMb: Math.round(mem.heapUsed / 1024 / 1024),
      cpuLoadPercent: 12.4,
      activeConnections: 148,
      cacheHitRatio: 96.2,
      isMaintenanceMode: backendMaintenanceState.enabled,
      activeVersion: 'v2.4.2',
      dbPoolConnections: 12,
      lastDeploymentTime: '24 Sep 2026, 17:40 IST'
    });
    return;
  }

  // 3. Maintenance Mode Get & Set
  if (cleanUrl === '/api/dev/maintenance') {
    if (req.method === 'GET') {
      sendJson(res, 200, backendMaintenanceState);
      return;
    }
    if (req.method === 'POST') {
      parseBody(req).then((body) => {
        backendMaintenanceState = {
          ...backendMaintenanceState,
          ...body,
          updatedAt: new Date().toISOString()
        };
        technicalLogs.unshift({
          id: `log-srv-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          level: backendMaintenanceState.enabled ? 'WARN' : 'INFO',
          service: 'HTTP_SERVER',
          message: `Maintenance Mode updated to: ${backendMaintenanceState.enabled ? 'ACTIVE' : 'INACTIVE'}`,
          statusCode: 200
        });
        sendJson(res, 200, {
          success: true,
          maintenance: backendMaintenanceState
        });
      });
      return;
    }
  }

  // 4. API Endpoints Ping
  if (cleanUrl === '/api/dev/ping' && req.method === 'POST') {
    sendJson(res, 200, {
      success: true,
      timestamp: new Date().toISOString(),
      endpointsPinging: 7,
      allOperational: true,
      averageLatencyMs: 38
    });
    return;
  }

  // 5. Technical Logs
  if (cleanUrl === '/api/dev/logs') {
    if (req.method === 'GET') {
      sendJson(res, 200, technicalLogs);
      return;
    }
    if (req.method === 'POST') {
      parseBody(req).then((body) => {
        if (body.clear) {
          technicalLogs = [];
        } else if (body.log) {
          technicalLogs.unshift(body.log);
        }
        sendJson(res, 200, { success: true, count: technicalLogs.length });
      });
      return;
    }
  }

  // 6. Database Diagnostics / Safe Benchmark
  if (cleanUrl === '/api/dev/db/benchmark' && req.method === 'POST') {
    parseBody(req).then((body) => {
      const q = (body.query || '').toLowerCase();
      // Block query on restricted customer or payment tables
      if (q.includes('customer_leads') || q.includes('invoice') || q.includes('payment') || q.includes('phone') || q.includes('email')) {
        sendJson(res, 403, {
          status: 'restricted',
          error: 'ACCESS_RESTRICTED',
          message: 'Execution aborted: Developer queries on customer personal tables or payment records are forbidden by App Owner security policy.'
        });
        return;
      }

      sendJson(res, 200, {
        status: 'success',
        query: body.query,
        executionTimeMs: Math.floor(Math.random() * 25) + 8,
        rowsAffected: 42,
        plan: 'Index Scan using idx_properties_verified on properties (cost=0.15..12.42 rows=42 width=384)'
      });
    });
    return;
  }

  // 7. Push Dispatch Simulation
  if (cleanUrl === '/api/dev/push/dispatch' && req.method === 'POST') {
    parseBody(req).then((body) => {
      technicalLogs.unshift({
        id: `log-srv-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'INFO',
        service: 'NOTIFICATION_WORKER',
        message: `Web Push dispatch triggered: "${body.title || 'Untitled Notification'}" to topic [${body.topic || 'all_users'}]`,
        statusCode: 200
      });

      sendJson(res, 200, {
        success: true,
        sentCount: 284,
        deliveredCount: 281,
        failedCount: 3,
        status: 'sent'
      });
    });
    return;
  }

  // Default fallback for any other dev endpoint
  sendJson(res, 200, { status: 'ok', route: cleanUrl });
}
