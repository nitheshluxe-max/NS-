import { Property } from '../types';

/**
 * Generates and downloads a luxury multi-page PDF brochure for a project or property.
 */
export async function generateProjectBrochurePdf(
  property: Property,
  userName?: string
): Promise<boolean> {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    // Helper: Draw gold luxury border
    const drawPageBorder = () => {
      doc.setDrawColor(196, 164, 124); // #c4a47c (gold)
      doc.setLineWidth(0.8);
      doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
      doc.setLineWidth(0.2);
      doc.rect(9.5, 9.5, pageWidth - 19, pageHeight - 19);
    };

    // ==========================================
    // PAGE 1: COVER & EXECUTIVE SUMMARY
    // ==========================================
    drawPageBorder();

    // Top Dark Luxury Header
    doc.setFillColor(26, 26, 26); // #1a1a1a
    doc.rect(10, 10, pageWidth - 20, 38, 'F');

    // Brand Logo Mark
    doc.setFillColor(196, 164, 124); // Gold
    doc.rect(15, 15, 14, 14, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(26, 26, 26);
    doc.text('NS', 19, 24);

    // Brand Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(253, 252, 249);
    doc.text('NS PROPERTIES', 34, 21);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(196, 164, 124);
    doc.text('CURATED LUXURY RESIDENCES & BUILDER PROJECTS', 34, 27);
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(7.5);
    doc.text('OFFICIAL VERIFIED PROJECT BROCHURE • RERA APPROVED', 34, 32);

    // Cover Title & Location
    let y = 60;
    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(26, 26, 26);
    const splitTitle = doc.splitTextToSize(property.title, contentWidth);
    doc.text(splitTitle, margin, y);
    y += splitTitle.length * 9;

    // Sub-title / Tagline
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 92, 168); // #005CA8
    doc.text(`${property.locality.toUpperCase()}, ${property.city.toUpperCase()}`, margin, y);
    y += 7;

    // Price Banner Box
    doc.setFillColor(244, 241, 234); // #f4f1ea
    doc.setDrawColor(196, 164, 124);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, contentWidth, 18, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 80);
    doc.text('OFFER PRICE / VALUATION', margin + 5, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(196, 164, 124);
    doc.text(property.priceDisplay, margin + 5, y + 13.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text(`Configuration: ${property.bhk > 0 ? `${property.bhk} BHK` : property.type}  |  Super Built-up Area: ${property.areaSqFt} Sq.Ft`, margin + 70, y + 10);
    doc.text(`Possession: ${property.possession}  |  Purpose: ${property.purpose === 'buy' ? 'Outright Sale' : 'Luxury Lease'}`, margin + 70, y + 14);

    y += 26;

    // Key Highlights Table
    doc.setFillColor(26, 26, 26);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(253, 252, 249);
    doc.text('PROJECT OVERVIEW & KEY SPECIFICATIONS', margin + 4, y + 5);

    y += 7;
    const specs = [
      ['Project / Property ID', property.id || 'NSP-PR-1092'],
      ['Property Category', property.type.toUpperCase()],
      ['Configurations Available', property.bhk > 0 ? `${property.bhk} BHK Luxury Suites` : 'Customised Layouts'],
      ['Super Built-Up Area', `${property.areaSqFt} Sq.Ft (${Math.round(property.areaSqFt * 0.0929)} m²)`],
      ['Carpet Area (RERA)', `${Math.round(property.areaSqFt * 0.72)} Sq.Ft (Approx 72% efficiency)`],
      ['Furnishing Status', property.furnishing || 'Semi-Furnished'],
      ['Vastu Compliance & Facing', property.facing ? `${property.facing} Facing (100% Vastu Compliant)` : 'East Facing (Vastu Compliant)'],
      ['RERA Registration Number', property.reraId || 'PRM/KA/RERA/1251/310/PR/171015/000450'],
      ['Listed / Marketed By', `${property.seller.name} (${property.postedBy || 'Authorized Channel Partner'})`],
      ['Verification Status', property.isVerified ? '100% Verified on Site by NS Inspection Team' : 'Pre-Screened Official Listing']
    ];

    specs.forEach(([label, value], idx) => {
      const rowY = y + idx * 6.5;
      if (idx % 2 === 0) {
        doc.setFillColor(250, 249, 246);
        doc.rect(margin, rowY, contentWidth, 6.5, 'F');
      }
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.1);
      doc.line(margin, rowY + 6.5, margin + contentWidth, rowY + 6.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(70, 70, 70);
      doc.text(label, margin + 4, rowY + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(26, 26, 26);
      doc.text(value, margin + 65, rowY + 4.5);
    });

    y += specs.length * 6.5 + 8;

    // Overview Description paragraph
    doc.setFillColor(26, 26, 26);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(253, 252, 249);
    doc.text('ARCHITECTURAL VISION & PROPERTY NARRATIVE', margin + 4, y + 5);

    y += 10;
    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    const descText = property.description || 
      `${property.title} represents refined modern architecture in the heart of ${property.locality}, ${property.city}. Designed for high-net-worth individuals, the project provides expansive cross-ventilated living spaces, panoramic sky deck balconies, high-speed automated elevators, and low-density privacy. Built with seismic Zone II structural engineering and premium sustainable construction materials.`;
    const splitDesc = doc.splitTextToSize(descText, contentWidth - 4);
    doc.text(splitDesc, margin + 2, y);

    // Page 1 Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(140, 140, 140);
    doc.text(`Prepared for: ${userName || 'Valued Buyer'} | Generated via NS Properties Concierge Portal`, margin, pageHeight - 12);
    doc.text('Page 1 of 2', pageWidth - margin - 15, pageHeight - 12);

    // ==========================================
    // PAGE 2: AMENITIES, CONNECTIVITY & CONTACT
    // ==========================================
    doc.addPage();
    drawPageBorder();

    // Top Header Bar
    doc.setFillColor(26, 26, 26);
    doc.rect(10, 10, pageWidth - 20, 22, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(253, 252, 249);
    doc.text(`${property.title.toUpperCase()} — MASTER AMENITIES & CONNECTIVITY`, 15, 21);
    doc.setFontSize(7.5);
    doc.setTextColor(196, 164, 124);
    doc.text(`OFFICIAL SPECIFICATION DOSSIER • CITY: ${property.city.toUpperCase()}`, 15, 27);

    let p2Y = 40;

    // Amenities Grid Section
    doc.setFillColor(26, 26, 26);
    doc.rect(margin, p2Y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(253, 252, 249);
    doc.text('CURATED WORLD-CLASS AMENITIES & CLUBHOUSE PRIVILEGES', margin + 4, p2Y + 5);

    p2Y += 10;
    const allAmenities = property.amenities && property.amenities.length > 0 
      ? property.amenities 
      : ['Temperature Controlled Swimming Pool', '50,000 Sq.Ft Grand Clubhouse', 'State-of-the-art Gymnasium', 'Landscaped Zen Podium Gardens', 'Children’s Activity & Play Arena', '24/7 Multi-Tier Digital Security', 'EV Vehicle Charging Stations', 'Badminton & Squash Courts', 'Jogging & Cycling Track', 'Sky Lounge & Banquet Hall', 'High-Speed Elevators', '100% Full Power Back-up'];

    // 2-column amenities list
    const colWidth = (contentWidth - 6) / 2;
    allAmenities.forEach((amenity, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const amX = margin + col * (colWidth + 6);
      const amY = p2Y + row * 6;

      doc.setFillColor(248, 246, 240);
      doc.roundedRect(amX, amY, colWidth, 5, 0.8, 0.8, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(196, 164, 124);
      doc.text('✦', amX + 2.5, amY + 3.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 30, 30);
      doc.text(amenity, amX + 7, amY + 3.5);
    });

    p2Y += Math.ceil(allAmenities.length / 2) * 6 + 8;

    // Strategic Connectivity Matrix
    doc.setFillColor(26, 26, 26);
    doc.rect(margin, p2Y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(253, 252, 249);
    doc.text('LOCATION HIGHLIGHTS & STRATEGIC CONNECTIVITY', margin + 4, p2Y + 5);

    p2Y += 9;
    const distances = [
      ['Rapid Metro Station', 'Approx. 5 to 7 mins drive (Dedicated feeder corridor)'],
      ['Primary IT / Business Tech Park', 'Approx. 10 to 15 mins (Direct signal-free connectivity)'],
      ['International Airport', 'Approx. 35 to 45 mins via expressway bypass'],
      ['Super-Speciality Hospitals', 'Columbia Asia / Apollo / Manipal within 3.5 km radius'],
      ['Top International Schools', 'DPS, Inventure, Greenwood High within 15 mins commute'],
      ['Luxury Retail & Fine Dining Hubs', 'Premium shopping malls and entertainment within 2 km']
    ];

    distances.forEach(([landmark, time], idx) => {
      const rowY = p2Y + idx * 5.8;
      if (idx % 2 === 0) {
        doc.setFillColor(252, 251, 248);
        doc.rect(margin, rowY, contentWidth, 5.8, 'F');
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(0, 92, 168);
      doc.text(`• ${landmark}`, margin + 3, rowY + 4);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(50, 50, 50);
      doc.text(time, margin + 65, rowY + 4);
    });

    p2Y += distances.length * 5.8 + 8;

    // Payment Milestone & Bank Approvals
    doc.setFillColor(26, 26, 26);
    doc.rect(margin, p2Y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(253, 252, 249);
    doc.text('BANK HOME LOAN APPROVALS & PAYMENT MILESTONES', margin + 4, p2Y + 5);

    p2Y += 9;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(40, 40, 40);
    doc.text('• Approved by India\'s leading financial institutions: State Bank of India (SBI), HDFC Bank, ICICI Bank, Axis Bank, and Kotak.', margin + 3, p2Y);
    p2Y += 4.5;
    doc.text('• Customized Construction Linked Plans (CLP), 10:90 Developer Subsidy Schemes, and Instant Loan Pre-Approvals available.', margin + 3, p2Y);
    p2Y += 4.5;
    doc.text('• Standard Payment Schedule: 10% on Booking | 10% on Sale Agreement | Milestones per Slab Completion | 5% on Handover.', margin + 3, p2Y);

    p2Y += 8;

    // Direct Verification & Advisory Desk Box
    doc.setFillColor(244, 241, 234);
    doc.setDrawColor(196, 164, 124);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, p2Y, contentWidth, 28, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(26, 26, 26);
    doc.text('NS PROPERTIES VERIFIED CONCIERGE & DIRECT SELLER DESK', margin + 5, p2Y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text(`Direct Seller Contact: ${property.seller.name}  |  Official Mobile: ${property.seller.phone}`, margin + 5, p2Y + 12);
    doc.text('Toll-Free Customer Service: 1800-208-3344  |  WhatsApp Concierge: +91 98450 12345', margin + 5, p2Y + 17);
    doc.text('Portal Web Link: https://nsprops.luxury  |  Email Support: concierge@nsproperties.in', margin + 5, p2Y + 22);

    // Disclaimer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.5);
    doc.setTextColor(120, 120, 120);
    doc.text(
      'Disclaimer: This electronic brochure is an official informational summary generated by NS Properties based on verified seller listings and RERA filings. All measurements and dates are approximate and subject to terms in the definitive agreement to sell.',
      margin,
      pageHeight - 16,
      { maxWidth: contentWidth }
    );

    // Page 2 Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(140, 140, 140);
    doc.text('NS Properties • India\'s Premier Direct-to-Owner Luxury Real Estate Network', margin, pageHeight - 10);
    doc.text('Page 2 of 2', pageWidth - margin - 15, pageHeight - 10);

    // Trigger save
    const sanitizedTitle = property.title.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').slice(0, 40);
    const fileName = `${sanitizedTitle}-Official-Brochure.pdf`;
    doc.save(fileName);

    // Record in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('NS_DOWNLOADED_BROCHURES') || '[]');
      const newEntry = {
        propertyId: property.id,
        propertyTitle: property.title,
        locality: property.locality,
        city: property.city,
        priceDisplay: property.priceDisplay,
        downloadedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        fileName
      };
      const filtered = existing.filter((b: any) => b.propertyId !== property.id);
      localStorage.setItem('NS_DOWNLOADED_BROCHURES', JSON.stringify([newEntry, ...filtered].slice(0, 30)));
    } catch (e) {
      console.error(e);
    }

    return true;
  } catch (error) {
    console.error('Error generating brochure PDF:', error);
    return false;
  }
}
