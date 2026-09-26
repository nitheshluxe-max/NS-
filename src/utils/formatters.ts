export function formatIndianCurrency(amount: number): string {
  if (!amount && amount !== 0) return '₹ 0';
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2);
    return `₹ ${cr.replace(/\.00$/, '')} Cr`;
  } else if (amount >= 100000) {
    const l = (amount / 100000).toFixed(2);
    return `₹ ${l.replace(/\.00$/, '')} L`;
  } else {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }
}

export function calculateEMI(principal: number, annualRate: number, tenureYears: number): {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
} {
  if (principal <= 0 || annualRate <= 0 || tenureYears <= 0) {
    return { monthlyEMI: 0, totalInterest: 0, totalPayment: 0 };
  }

  const monthlyRate = annualRate / (12 * 100);
  const totalMonths = tenureYears * 12;

  const emi = 
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - principal;

  return {
    monthlyEMI: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment)
  };
}

export const STORAGE_KEYS = {
  SAVED_PROPERTIES: '99acres_saved_properties',
  COMPARE_PROPERTIES: '99acres_compare_ids',
  USER_PROPERTIES: '99acres_user_properties',
  SITE_VISITS: '99acres_site_visits',
  VISITOR_LEADS: 'ns_visitor_leads',
  LEAD_POPUP_DISMISSED: 'ns_lead_popup_dismissed',
  OWNER_CONTACT_VIEWS: 'ns_owner_contact_views',
  CLIENT_CREDENTIALS: 'ns_client_credentials'
};
