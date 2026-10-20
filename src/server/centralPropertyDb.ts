import fs from 'fs';
import path from 'path';
import { Property, PropertyPublishStatus } from '../types.ts';
import { INITIAL_PROPERTIES } from '../data/properties.ts';
import { formatIndianCurrency } from '../utils/formatters.ts';

// Directory and path for the permanent central database store
const DB_DIR = path.resolve(process.cwd(), 'src/server/data');
const DB_FILE = path.join(DB_DIR, 'properties_central_db.json');
const AUDIT_LOG_FILE = path.join(DB_DIR, 'properties_audit_log.json');

export interface PropertyAuditLog {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'PRICE_ADJUST' | 'MEDIA_ADD';
  propertyId: string;
  propertyTitle: string;
  performedBy: string;
  role: string;
  timestamp: string;
  details: string;
}

let propertiesCache: Property[] = [];
let auditLogsCache: PropertyAuditLog[] = [];
let isInitialized = false;

// Ensure database directory exists
function ensureDbDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

// Persist database cache to disk atomically
function saveDbToDisk() {
  try {
    ensureDbDir();
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(propertiesCache, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Failed to save properties to disk:', err);
  }
}

// Persist audit logs to disk
function saveAuditLogsToDisk() {
  try {
    ensureDbDir();
    const tempFile = `${AUDIT_LOG_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(auditLogsCache.slice(0, 100), null, 2), 'utf-8');
    fs.renameSync(tempFile, AUDIT_LOG_FILE);
  } catch (err) {
    console.error('Failed to save audit logs to disk:', err);
  }
}

// Initialize database from file or initial seed
export function initCentralDb(): void {
  if (isInitialized) return;
  ensureDbDir();

  if (fs.existsSync(DB_FILE)) {
    try {
      const fileData = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Normalize properties to ensure valid status and timestamp
        propertiesCache = parsed.map((p: any) => ({
          ...p,
          status: (p.status as PropertyPublishStatus) || (p.isDisabled ? 'inactive' : 'published'),
          createdAt: p.createdAt || new Date('2026-09-01T00:00:00.000Z').toISOString(),
          updatedAt: p.updatedAt || new Date().toISOString()
        }));
        isInitialized = true;
        console.log(`[CentralDB] Loaded ${propertiesCache.length} properties from permanent store.`);
        return;
      }
    } catch (e) {
      console.error('[CentralDB] Error reading existing database file, falling back to seed:', e);
    }
  }

  // Seed with INITIAL_PROPERTIES, stamping valid statuses and timestamps
  const now = new Date().toISOString();
  propertiesCache = INITIAL_PROPERTIES.map((p, index) => ({
    ...p,
    status: (p.status as PropertyPublishStatus) || (p.isDisabled ? 'inactive' : 'published'),
    createdAt: p.createdAt || new Date(Date.now() - (index * 86400000 * 3)).toISOString(),
    updatedAt: p.updatedAt || now
  }));

  saveDbToDisk();
  isInitialized = true;
  console.log(`[CentralDB] Initialized database with ${propertiesCache.length} seeded properties.`);
}

function logAction(
  action: PropertyAuditLog['action'],
  prop: { id: string; title: string },
  role: string,
  details: string
) {
  const log: PropertyAuditLog = {
    id: `log-prop-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    action,
    propertyId: prop.id,
    propertyTitle: prop.title,
    performedBy: role === 'owner' ? 'App Owner' : role === 'admin' ? 'Administrator' : 'Agent/User',
    role,
    timestamp: new Date().toISOString(),
    details
  };
  auditLogsCache.unshift(log);
  saveAuditLogsToDisk();
}

/**
 * Get all properties in the central database (for Admin / Owner console)
 */
export function getAllProperties(): Property[] {
  initCentralDb();
  return [...propertiesCache];
}

/**
 * Get published properties visible to normal public users.
 * Strictly filters out drafts, inactive, deleted, or disabled properties.
 */
export function getPublishedProperties(): Property[] {
  initCentralDb();
  return propertiesCache.filter((p) => {
    // Only published status allowed
    const isPublished = p.status === 'published' || (!p.status && !p.isDisabled);
    const notDisabled = !p.isDisabled;
    const notDeleted = p.status !== 'deleted';
    return isPublished && notDisabled && notDeleted;
  });
}

/**
 * Find a specific property by ID
 */
export function getPropertyById(id: string): Property | undefined {
  initCentralDb();
  return propertiesCache.find((p) => p.id === id);
}

/**
 * Permanently create a new property in the central database
 */
export function createProperty(data: Partial<Property>, role: string = 'user'): Property {
  initCentralDb();

  const priceNum = Number(data.price) || 10000000;
  const areaNum = Number(data.areaSqFt) || 1200;
  const pricePerSqFt = areaNum > 0 ? Math.round(priceNum / areaNum) : 0;
  const purpose = data.purpose || 'buy';

  const priceDisplay =
    purpose === 'rent'
      ? `${formatIndianCurrency(priceNum)} / mo`
      : formatIndianCurrency(priceNum);

  const newId = data.id && data.id.startsWith('prop-') ? data.id : `prop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  // Status defaults to 'published' when created unless explicitly specified as 'draft'
  const status: PropertyPublishStatus = data.status || 'published';

  const newProperty: Property = {
    id: newId,
    title: data.title?.trim() || 'Luxury Property by NS Properties',
    projectName: data.projectName?.trim() || data.title?.trim() || 'NS Luxury Residency',
    builderName: data.builderName || (role === 'owner' ? 'NS Properties Direct' : 'Verified Developer'),
    purpose,
    category: data.category || 'residential',
    type: data.type || 'apartment',
    bhk: Number(data.bhk) || (data.category === 'residential' ? 3 : 0),
    bathrooms: Number(data.bathrooms) || 2,
    balconies: Number(data.balconies) || 1,
    price: priceNum,
    priceDisplay: data.priceDisplay || priceDisplay,
    pricePerSqFt,
    areaSqFt: areaNum,
    carpetAreaSqFt: Number(data.carpetAreaSqFt) || Math.round(areaNum * 0.8),
    city: data.city?.trim() || 'Bengaluru',
    locality: data.locality?.trim() || 'Central',
    address: data.address?.trim() || `${data.locality || 'Prime Locality'}, ${data.city || 'Bengaluru'}`,
    floor: data.floor || '4th of 18 floors',
    facing: data.facing || 'East',
    furnishing: data.furnishing || 'Semi-Furnished',
    possession: data.possession || 'Ready to Move',
    status,
    createdAt: now,
    updatedAt: now,
    ageOfProperty: data.ageOfProperty || 'Brand New',
    reraId: data.reraId || `PRM/KA/RERA/${Math.floor(1000 + Math.random() * 9000)}/2026`,
    isVerified: data.isVerified !== undefined ? data.isVerified : true,
    isExclusive: data.isExclusive !== undefined ? data.isExclusive : (role === 'owner'),
    isFeatured: data.isFeatured !== undefined ? data.isFeatured : true,
    isDisabled: data.isDisabled !== undefined ? data.isDisabled : (status === 'inactive'),
    videoUrl: data.videoUrl || '',
    virtualTourUrl: data.virtualTourUrl || '',
    discountPercentage: data.discountPercentage,
    postedBy: data.postedBy || (role === 'owner' ? 'Owner' : 'Certified Agent'),
    postedDate: 'Just now',
    images: Array.isArray(data.images) && data.images.length > 0
      ? data.images
      : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'],
    amenities: Array.isArray(data.amenities) && data.amenities.length > 0
      ? data.amenities
      : ['24/7 Security & CCTV', '100% Power Backup', 'Covered Car Parking', 'Equipped Gym', 'Swimming Pool'],
    description: data.description?.trim() || `Verified luxury property in ${data.locality || 'prime area'}, ${data.city || 'Bengaluru'}. Superb architecture, premium fixtures, and outstanding connectivity.`,
    landmarks: Array.isArray(data.landmarks) && data.landmarks.length > 0
      ? data.landmarks
      : [
          { name: 'Metro Station', distance: '1.2 km', type: 'metro' },
          { name: 'Multi-Specialty Hospital', distance: '2.5 km', type: 'hospital' },
          { name: 'Shopping Mall', distance: '1.8 km', type: 'mall' }
        ],
    seller: {
      name: data.seller?.name || (role === 'owner' ? 'Nithesh (App Owner)' : 'NS Properties Advisor'),
      phone: data.seller?.phone || '+91 80732 66325',
      email: data.seller?.email || (role === 'owner' ? 'nitheshluxe@gmail.com' : 'contact@nsproperties.in'),
      company: data.seller?.company || 'NS Properties Management',
      verifiedAgent: true,
      responseTime: 'Within 10 mins'
    }
  };

  // Add at top of catalog
  propertiesCache.unshift(newProperty);
  saveDbToDisk();

  logAction('CREATE', newProperty, role, `Created new property listing with ID ${newProperty.id} and status ${newProperty.status}`);

  return newProperty;
}

/**
 * Permanently update an existing property in the central database
 */
export function updateProperty(id: string, updates: Partial<Property>, role: string = 'admin'): Property {
  initCentralDb();

  const idx = propertiesCache.findIndex((p) => p.id === id);
  if (idx === -1) {
    throw new Error(`Property with ID "${id}" was not found in the central database.`);
  }

  const existing = propertiesCache[idx];
  const now = new Date().toISOString();

  let priceNum = updates.price !== undefined ? Number(updates.price) : existing.price;
  let areaNum = updates.areaSqFt !== undefined ? Number(updates.areaSqFt) : existing.areaSqFt;
  let pricePerSqFt = areaNum > 0 ? Math.round(priceNum / areaNum) : existing.pricePerSqFt;

  let priceDisplay = updates.priceDisplay;
  if (!priceDisplay && updates.price !== undefined) {
    priceDisplay = existing.purpose === 'rent'
      ? `${formatIndianCurrency(priceNum)} / mo`
      : formatIndianCurrency(priceNum);
  }

  const updatedProperty: Property = {
    ...existing,
    ...updates,
    id: existing.id, // ID must remain strictly immutable
    price: priceNum,
    areaSqFt: areaNum,
    pricePerSqFt,
    priceDisplay: priceDisplay || existing.priceDisplay,
    updatedAt: now
  };

  // Synchronize isDisabled and status if status is provided
  if (updates.status) {
    if (updates.status === 'inactive') {
      updatedProperty.isDisabled = true;
    } else if (updates.status === 'published') {
      updatedProperty.isDisabled = false;
    }
  }

  propertiesCache[idx] = updatedProperty;
  saveDbToDisk();

  logAction('UPDATE', updatedProperty, role, `Updated property details (Price: ${updatedProperty.priceDisplay}, Status: ${updatedProperty.status})`);

  return updatedProperty;
}

/**
 * Permanently delete or mark deleted in the central database
 */
export function deleteProperty(id: string, hardDelete: boolean = true, role: string = 'admin'): boolean {
  initCentralDb();

  const idx = propertiesCache.findIndex((p) => p.id === id);
  if (idx === -1) {
    throw new Error(`Property with ID "${id}" was not found in the central database.`);
  }

  const target = propertiesCache[idx];

  if (hardDelete) {
    propertiesCache = propertiesCache.filter((p) => p.id !== id);
  } else {
    propertiesCache[idx] = {
      ...target,
      status: 'deleted',
      isDisabled: true,
      updatedAt: new Date().toISOString()
    };
  }

  saveDbToDisk();
  logAction('DELETE', target, role, `Deleted property ${target.title} (${target.id}) permanently from central database.`);

  return true;
}

/**
 * Update the publish status of a property ('published' | 'draft' | 'inactive' | 'deleted')
 */
export function updatePropertyStatus(
  id: string, 
  status: PropertyPublishStatus, 
  role: string = 'admin'
): Property {
  initCentralDb();

  const idx = propertiesCache.findIndex((p) => p.id === id);
  if (idx === -1) {
    throw new Error(`Property with ID "${id}" was not found in the central database.`);
  }

  const existing = propertiesCache[idx];
  const updatedProperty: Property = {
    ...existing,
    status,
    isDisabled: status === 'inactive' || status === 'deleted',
    updatedAt: new Date().toISOString()
  };

  propertiesCache[idx] = updatedProperty;
  saveDbToDisk();

  logAction('STATUS_CHANGE', updatedProperty, role, `Changed status from ${existing.status || 'published'} to ${status}`);

  return updatedProperty;
}

/**
 * Apply discounts or bulk price hikes/reductions permanently
 */
export function bulkPriceAdjustment(
  options: {
    propId?: string;
    percent: number;
    increase?: boolean;
    discountTag?: string;
  },
  role: string = 'owner'
): Property[] {
  initCentralDb();
  const { propId, percent, increase = false, discountTag } = options;
  const now = new Date().toISOString();

  if (propId) {
    // Single property discount / adjustment
    const idx = propertiesCache.findIndex((p) => p.id === propId);
    if (idx === -1) {
      throw new Error(`Property with ID "${propId}" was not found.`);
    }

    const p = propertiesCache[idx];
    const discountedPrice = Math.round(p.price * (1 - percent / 100));
    const crValue = (discountedPrice / 10000000).toFixed(2);

    propertiesCache[idx] = {
      ...p,
      price: discountedPrice,
      priceDisplay: p.purpose === 'rent' ? `${formatIndianCurrency(discountedPrice)} / mo` : `₹ ${crValue} Cr`,
      pricePerSqFt: Math.round(discountedPrice / p.areaSqFt),
      discountPercentage: percent,
      description: discountTag ? `[SPECIAL OFFER: ${discountTag}] ${p.description.replace(/^\[SPECIAL OFFER:.*?\]\s*/, '')}` : p.description,
      updatedAt: now
    };

    saveDbToDisk();
    logAction('PRICE_ADJUST', propertiesCache[idx], role, `Applied ${percent}% discount with tag "${discountTag || 'Special Concession'}"`);
    return [propertiesCache[idx]];
  }

  // Bulk across all properties
  const factor = increase ? 1 + percent / 100 : 1 - percent / 100;
  propertiesCache = propertiesCache.map((p) => {
    const newPrice = Math.round(p.price * factor);
    const crValue = (newPrice / 10000000).toFixed(2);
    return {
      ...p,
      price: newPrice,
      priceDisplay: p.purpose === 'rent' ? `${formatIndianCurrency(newPrice)} / mo` : `₹ ${crValue} Cr`,
      pricePerSqFt: Math.round(newPrice / p.areaSqFt),
      updatedAt: now
    };
  });

  saveDbToDisk();
  logAction(
    'PRICE_ADJUST',
    { id: 'BULK_ALL', title: 'Platform-wide bulk adjustment' },
    role,
    `Bulk adjusted all listing prices by ${increase ? '+' : '-'}${percent}%`
  );

  return propertiesCache;
}

/**
 * Add media (photos, video, 3D tour) to a property permanently
 */
export function addMedia(
  propId: string,
  media: { imageUrl?: string; videoUrl?: string; virtualTourUrl?: string },
  role: string = 'owner'
): Property {
  initCentralDb();

  const idx = propertiesCache.findIndex((p) => p.id === propId);
  if (idx === -1) {
    throw new Error(`Property with ID "${propId}" was not found.`);
  }

  const p = propertiesCache[idx];
  const newImages = media.imageUrl?.trim() ? [...p.images, media.imageUrl.trim()] : p.images;

  propertiesCache[idx] = {
    ...p,
    images: newImages,
    videoUrl: media.videoUrl?.trim() || p.videoUrl,
    virtualTourUrl: media.virtualTourUrl?.trim() || p.virtualTourUrl,
    updatedAt: new Date().toISOString()
  };

  saveDbToDisk();
  logAction('MEDIA_ADD', propertiesCache[idx], role, `Updated media assets (Total Photos: ${newImages.length})`);

  return propertiesCache[idx];
}

/**
 * Reseed database back to default initial properties
 */
export function reseedDatabase(): Property[] {
  const now = new Date().toISOString();
  propertiesCache = INITIAL_PROPERTIES.map((p, index) => ({
    ...p,
    status: 'published' as PropertyPublishStatus,
    createdAt: new Date(Date.now() - (index * 86400000 * 3)).toISOString(),
    updatedAt: now
  }));
  saveDbToDisk();
  return propertiesCache;
}
