/**
 * WhatsApp Helper utility to format international phone numbers
 * and build 100% reliable WhatsApp URLs across Desktop, Mobile, WhatsApp Web,
 * native WhatsApp apps, and iframe environments.
 */

export const DEFAULT_CONTACT_PHONE = '918073266325';
export const DISPLAY_CONTACT_PHONE = '+91 80732 66325';

export function cleanPhoneNumber(rawPhone?: string | null): string {
  if (!rawPhone) return DEFAULT_CONTACT_PHONE;
  
  // Strip all non-digit characters (+, spaces, hyphens, parentheses)
  let digits = rawPhone.replace(/\D/g, '');

  // If 10 digits (standard Indian mobile number without country code), prepend '91'
  if (digits.length === 10) {
    digits = '91' + digits;
  }
  // If 11 digits starting with 0 (e.g. 08073266325), replace leading 0 with 91
  else if (digits.length === 11 && digits.startsWith('0')) {
    digits = '91' + digits.slice(1);
  }

  // Fallback if somehow still empty or too short
  if (digits.length < 10) {
    return DEFAULT_CONTACT_PHONE;
  }

  return digits;
}

/**
 * Builds direct chat URL with a recipient phone number.
 */
export function getWhatsAppChatUrl(phone: string, message: string): string {
  const cleanPhone = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
}

export function getWhatsAppApiSendUrl(phone: string, message: string): string {
  return getWhatsAppChatUrl(phone, message);
}

/**
 * Builds universal WhatsApp share URLs.
 * `https://api.whatsapp.com/send?text=...` is the official cross-platform URL
 * that works on both mobile browsers (redirecting to WhatsApp app) and desktop (redirecting to WhatsApp Web/Desktop).
 */
export function getWhatsAppShareUrl(message: string): string {
  const encodedText = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

/**
 * Builds wa.me share URL
 */
export function getWaMeShareUrl(message: string): string {
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/?text=${encodedText}`;
}

// Backward compatibility alias
export function getWhatsAppUrl(phone: string, message: string): string {
  return getWhatsAppChatUrl(phone, message);
}

/**
 * Reliably opens WhatsApp direct chat with a phone number in new tab or native app.
 */
export function openWhatsAppChat(phone: string, message: string): void {
  const cleanPhone = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(message);
  const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  triggerWhatsAppNavigation(url);
}

/**
 * Reliably triggers WhatsApp share dialog to friends / contacts / groups.
 * If Web Share API is available (iOS Safari, Android Chrome, Edge), it uses navigator.share
 * so users can pick WhatsApp, WhatsApp Business, contacts, or chats natively.
 * Otherwise, falls back to direct WhatsApp URLs.
 */
export async function openWhatsAppShare(message: string, urlToShare?: string): Promise<void> {
  const encodedText = encodeURIComponent(message);

  // 1. Check if Web Share API is available (Native mobile selector for WhatsApp)
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: 'NS Properties',
        text: message,
        url: urlToShare || undefined
      });
      return;
    } catch (err: any) {
      // If user cancelled, don't force a fallback popup
      if (err?.name === 'AbortError') {
        return;
      }
      // Otherwise proceed to direct WhatsApp scheme/url
    }
  }

  // 2. Direct WhatsApp API URL (works on all devices: launches WhatsApp app on mobile, WhatsApp Web on desktop)
  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
  if (isMobile) {
    // Try native app scheme first
    const schemeUrl = `whatsapp://send?text=${encodedText}`;
    try {
      window.location.assign(schemeUrl);
      setTimeout(() => {
        triggerWhatsAppNavigation(`https://api.whatsapp.com/send?text=${encodedText}`);
      }, 1000);
      return;
    } catch {
      // Fall through
    }
  }

  // Desktop or fallback: open WhatsApp Web / App
  const targetUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  triggerWhatsAppNavigation(targetUrl);
}

/**
 * Navigates to a WhatsApp URL safely handling popup blockers, new windows, and iframe restrictions.
 */
export function triggerWhatsAppNavigation(url: string): void {
  if (typeof window === 'undefined') return;

  try {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow && !newWindow.closed) {
      newWindow.focus();
      return;
    }
  } catch (e) {
    // window.open blocked
  }

  try {
    // Explicit anchor click fallback
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 400);
  } catch (e) {
    window.location.href = url;
  }
}
