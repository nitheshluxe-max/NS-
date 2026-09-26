// Developer & Owner Configuration Utility for NS Properties

export const DEV_STORAGE_KEYS = {
  EMAIL: 'NS_DEV_CONFIG_EMAIL',
  PIN: 'NS_DEV_CONFIG_PIN',
  IS_ACTIVE: 'NS_DEV_MODE_ACTIVE',
  AUTH_TOKEN: 'NS_DEV_AUTH_TOKEN'
};

export const DEFAULT_DEVELOPER_EMAIL = 'nitheshluxe@gmail.com';
export const DEFAULT_DEVELOPER_PIN = '1234';

export const getDeveloperEmail = (): string => {
  try {
    return localStorage.getItem(DEV_STORAGE_KEYS.EMAIL) || DEFAULT_DEVELOPER_EMAIL;
  } catch {
    return DEFAULT_DEVELOPER_EMAIL;
  }
};

export const setDeveloperEmail = (email: string): void => {
  try {
    localStorage.setItem(DEV_STORAGE_KEYS.EMAIL, email.trim());
  } catch (err) {
    console.error('Failed to save developer email:', err);
  }
};

export const getDeveloperPin = (): string => {
  try {
    return localStorage.getItem(DEV_STORAGE_KEYS.PIN) || DEFAULT_DEVELOPER_PIN;
  } catch {
    return DEFAULT_DEVELOPER_PIN;
  }
};

export const setDeveloperPin = (pin: string): void => {
  try {
    localStorage.setItem(DEV_STORAGE_KEYS.PIN, pin.trim());
  } catch (err) {
    console.error('Failed to save developer PIN:', err);
  }
};

export const checkIsDeveloperUrl = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return (
      params.get('dev') === 'true' ||
      params.get('dev') === '1' ||
      params.get('developer') === 'true' ||
      params.get('admin') === 'true'
    );
  } catch {
    return false;
  }
};

export const isDeveloperModeActive = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    if (checkIsDeveloperUrl()) return true;
    return (
      sessionStorage.getItem(DEV_STORAGE_KEYS.IS_ACTIVE) === 'true' ||
      localStorage.getItem(DEV_STORAGE_KEYS.IS_ACTIVE) === 'true'
    );
  } catch {
    return false;
  }
};

export const setDeveloperModeActive = (active: boolean): void => {
  try {
    if (active) {
      sessionStorage.setItem(DEV_STORAGE_KEYS.IS_ACTIVE, 'true');
      localStorage.setItem(DEV_STORAGE_KEYS.IS_ACTIVE, 'true');
    } else {
      sessionStorage.removeItem(DEV_STORAGE_KEYS.IS_ACTIVE);
      localStorage.removeItem(DEV_STORAGE_KEYS.IS_ACTIVE);
    }
  } catch (err) {
    console.error('Failed to update developer mode status:', err);
  }
};
