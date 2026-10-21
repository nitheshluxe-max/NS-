import { UserAccount } from '../types';
import { authenticateDeveloper, clearDevSession } from './devAuthService';

export type AppRole = 'owner' | 'developer' | 'staff' | 'buyer' | 'seller';

export interface AppUserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AppRole;
  title?: string;
  company?: string;
  token: string;
  loginTime: string;
  city?: string;
  budget?: string;
  bhkPreference?: string;
}

const APP_SESSION_KEY = 'NS_ACTIVE_APP_SESSION';

export const OWNER_CREDENTIALS = {
  PIN: '1984',
  EMAIL: 'nitheshluxe@gmail.com',
  PHONE: '9845012345',
  NAME: 'Nithesh (App Owner)'
};

export const DEVELOPER_CREDENTIALS = {
  PIN: '2409',
  EMAIL: 'dev.lead@nsproperties.in',
  NAME: 'Siddharth Dev (Engineering Lead)'
};

export const STAFF_CREDENTIALS = {
  PIN: '5566',
  EMAIL: 'vikram.agent@nsproperties.in',
  NAME: 'Vikram Aditya (Senior Relationship Manager)'
};

export function getActiveSession(): AppUserSession | null {
  try {
    const raw = sessionStorage.getItem(APP_SESSION_KEY) || localStorage.getItem(APP_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse active session', e);
    return null;
  }
}

export function saveActiveSession(session: AppUserSession, persist: boolean = false): void {
  try {
    sessionStorage.setItem(APP_SESSION_KEY, JSON.stringify(session));
    if (persist) {
      localStorage.setItem(APP_SESSION_KEY, JSON.stringify(session));
    }
  } catch (e) {
    console.error('Failed to save active session', e);
  }
}

export function clearActiveSession(): void {
  try {
    sessionStorage.removeItem(APP_SESSION_KEY);
    localStorage.removeItem(APP_SESSION_KEY);
    clearDevSession();
  } catch (e) {
    console.error('Failed to clear session', e);
  }
}

export async function loginOwner(credential: string): Promise<{ success: boolean; message: string; session?: AppUserSession }> {
  const trimmed = credential.trim();
  const cleanPhone = trimmed.replace(/\D/g, '');
  if (
    trimmed === OWNER_CREDENTIALS.PIN || 
    trimmed.toLowerCase() === OWNER_CREDENTIALS.EMAIL.toLowerCase() || 
    trimmed.toLowerCase() === 'nitheshluxe@gmail.com' ||
    trimmed === 'admin123' ||
    cleanPhone === '9845012345' ||
    cleanPhone === '8073266325' ||
    cleanPhone === '919845012345' ||
    cleanPhone === '918073266325'
  ) {
    const session: AppUserSession = {
      id: 'user-owner',
      name: OWNER_CREDENTIALS.NAME,
      email: OWNER_CREDENTIALS.EMAIL,
      phone: '+91 80732 66325',
      role: 'owner',
      title: 'Primary App Owner & Superadmin',
      company: 'NS Properties Headquarters',
      token: `ns_owner_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      loginTime: new Date().toISOString()
    };
    saveActiveSession(session);
    return { success: true, message: 'Owner Identity Verified. Full System Authority Granted.', session };
  }
  return { success: false, message: 'Invalid Owner Master PIN or Credentials. Access Denied.' };
}

export async function loginDeveloper(credential: string): Promise<{ success: boolean; message: string; session?: AppUserSession }> {
  const trimmed = credential.trim();
  const devAuth = await authenticateDeveloper(trimmed);
  if (devAuth.success) {
    const session: AppUserSession = {
      id: 'user-dev-1',
      name: DEVELOPER_CREDENTIALS.NAME,
      email: DEVELOPER_CREDENTIALS.EMAIL,
      phone: '+91 99801 22334',
      role: 'developer',
      title: 'Lead Software Architect',
      company: 'NS Properties Core Engineering',
      token: devAuth.session?.token || `ns_dev_token_${Date.now()}`,
      loginTime: new Date().toISOString()
    };
    saveActiveSession(session);
    return { success: true, message: 'Developer Identity Verified. Technical Subsystems Activated.', session };
  }
  return { success: false, message: devAuth.message || 'Invalid Developer PIN or Key. Access Denied.' };
}

export async function loginStaff(credential: string, staffList?: UserAccount[]): Promise<{ success: boolean; message: string; session?: AppUserSession }> {
  const trimmed = credential.trim().toLowerCase();
  
  // Check default staff PIN
  if (trimmed === STAFF_CREDENTIALS.PIN || trimmed === 'agent123' || trimmed === STAFF_CREDENTIALS.EMAIL) {
    const session: AppUserSession = {
      id: 'user-agent-1',
      name: STAFF_CREDENTIALS.NAME,
      email: STAFF_CREDENTIALS.EMAIL,
      phone: '+91 98452 77112',
      role: 'staff',
      title: 'Senior Relationship Manager & Field Agent',
      company: 'Aditya Realty Consultants / NS Properties',
      token: `ns_staff_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      loginTime: new Date().toISOString()
    };
    saveActiveSession(session);
    return { success: true, message: 'Staff Authorization Successful. Welcome, Vikram Aditya.', session };
  }

  // Check matching staff in user list
  if (staffList && staffList.length > 0) {
    const match = staffList.find(u => 
      (u.role === 'agent' || u.role === 'manager') && 
      (u.email.toLowerCase() === trimmed || u.phone.includes(trimmed))
    );
    if (match) {
      const session: AppUserSession = {
        id: match.id,
        name: match.name,
        email: match.email,
        phone: match.phone,
        role: 'staff',
        title: match.notes || 'Relationship Manager',
        company: match.company || 'NS Properties Staff',
        token: `ns_staff_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        loginTime: new Date().toISOString()
      };
      saveActiveSession(session);
      return { success: true, message: `Staff Authorization Successful. Welcome, ${match.name}.`, session };
    }
  }

  return { success: false, message: 'Invalid Staff PIN or Email. Access Denied.' };
}

export async function loginUser(
  identifier: string,
  name?: string,
  role: 'buyer' | 'seller' = 'buyer'
): Promise<{ success: boolean; message: string; session?: AppUserSession }> {
  const session: AppUserSession = {
    id: `usr_${Date.now()}`,
    name: name || (role === 'buyer' ? 'Home Buyer' : 'Property Seller'),
    email: identifier.includes('@') ? identifier : `${identifier.replace(/\D/g, '')}@user.nsproperties.in`,
    phone: identifier.includes('@') ? '+91 98765 43210' : identifier,
    role: role,
    title: role === 'buyer' ? 'Registered Buyer' : 'Property Seller Partner',
    token: `ns_user_jwt_${Date.now()}`,
    loginTime: new Date().toISOString()
  };
  saveActiveSession(session);
  return { success: true, message: `Welcome to NS Properties, ${session.name}!`, session };
}
