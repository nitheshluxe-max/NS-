import { Property, PropertyPublishStatus } from '../types';
import { INITIAL_PROPERTIES } from '../data/properties';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  error?: string;
  properties?: T[];
  property?: T;
  timestamp?: string;
}

const API_BASE = '/api/v1/properties';

/**
 * Fetch all published properties from the central backend database.
 * Used by all normal users, buyers, renters, and public visitors.
 * Resilient with offline cache fallback so network hiccups never break the UI.
 */
export async function fetchPublishedProperties(): Promise<Property[]> {
  try {
    const url = `${API_BASE}?_t=${Date.now()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data: ApiResponse<Property> = await response.json();
      if (data.success && Array.isArray(data.properties) && data.properties.length > 0) {
        try {
          localStorage.setItem('NS_CENTRAL_PROPERTIES_CACHE', JSON.stringify(data.properties));
        } catch {}
        return data.properties;
      }
    }
  } catch (err) {
    console.warn('[CentralDB] Network sync temporary fallback:', err);
  }

  // Graceful fallback to cached properties from localStorage
  try {
    const cached = localStorage.getItem('NS_CENTRAL_PROPERTIES_CACHE');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  // Fallback to initial properties
  return INITIAL_PROPERTIES;
}

/**
 * Fetch all properties (including drafts, inactive, deleted) for authorized Owner/Admin.
 */
export async function fetchAllPropertiesForAdmin(role: string = 'owner'): Promise<Property[]> {
  try {
    const url = `${API_BASE}/all?_t=${Date.now()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'x-user-role': role
      }
    });

    if (response.ok) {
      const data: ApiResponse<Property> = await response.json();
      if (data.success && Array.isArray(data.properties) && data.properties.length > 0) {
        try {
          localStorage.setItem('NS_CENTRAL_PROPERTIES_CACHE', JSON.stringify(data.properties));
        } catch {}
        return data.properties;
      }
    }
  } catch (err) {
    console.warn('[CentralDB] Admin sync temporary fallback:', err);
  }

  return fetchPublishedProperties();
}

/**
 * Create and publish a new property to the central database.
 * Throws on failure so UI does not show false positive.
 */
export async function createPropertyInCentralDb(
  propertyData: Partial<Property>,
  role: string = 'owner'
): Promise<Property> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': role
    },
    body: JSON.stringify(propertyData)
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || data.error || 'Failed to publish property to central database.');
  }

  if (!data.property || !data.property.id) {
    throw new Error('Database response did not return a valid saved property record.');
  }

  return data.property;
}

/**
 * Update an existing property in the central database.
 */
export async function updatePropertyInCentralDb(
  id: string,
  updates: Partial<Property>,
  role: string = 'owner'
): Promise<Property> {
  const url = `${API_BASE}/${id}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': role
    },
    body: JSON.stringify(updates)
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || data.error || `Failed to update property ${id} in central database.`);
  }

  return data.property;
}

/**
 * Update the publish status of a property ('published' | 'draft' | 'inactive' | 'deleted')
 */
export async function updatePropertyStatusInCentralDb(
  id: string,
  status: PropertyPublishStatus,
  role: string = 'owner'
): Promise<Property> {
  const url = `${API_BASE}/${id}/status`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': role
    },
    body: JSON.stringify({ status })
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || data.error || `Failed to update status for property ${id}`);
  }

  return data.property;
}

/**
 * Permanently delete a property from the central database.
 */
export async function deletePropertyFromCentralDb(
  id: string,
  role: string = 'owner'
): Promise<boolean> {
  const url = `${API_BASE}/${id}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'x-user-role': role
    }
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || data.error || `Failed to delete property ${id} from central database.`);
  }

  return true;
}

/**
 * Apply bulk or single price adjustment in central database.
 */
export async function bulkPriceAdjustmentInCentralDb(
  options: {
    propId?: string;
    percent: number;
    increase?: boolean;
    discountTag?: string;
  },
  role: string = 'owner'
): Promise<Property[]> {
  const url = `${API_BASE}/bulk-price`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': role
    },
    body: JSON.stringify(options)
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || data.error || 'Failed to adjust prices in central database.');
  }

  return data.updatedProperties || [];
}

/**
 * Add media (photos/videos) to a listing in central database.
 */
export async function addMediaToPropertyInCentralDb(
  propId: string,
  media: { imageUrl?: string; videoUrl?: string; virtualTourUrl?: string },
  role: string = 'owner'
): Promise<Property> {
  const url = `${API_BASE}/add-media`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': role
    },
    body: JSON.stringify({ propId, ...media })
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || data.error || 'Failed to update media in central database.');
  }

  return data.property;
}
