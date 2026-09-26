import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Send, 
  Mail, 
  QrCode, 
  Smartphone, 
  ExternalLink,
  Users,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { 
  openWhatsAppShare, 
  openWhatsAppChat, 
  cleanPhoneNumber, 
  DEFAULT_CONTACT_PHONE, 
  DISPLAY_CONTACT_PHONE 
} from '../utils/whatsapp';
import { getPublicShareUrl } from '../utils/shareUrl';

interface ShareAppModalProps {
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ onClose }) => {
  // Always use the publicly accessible preview URL so recipients do not get Google 403 Access Denied
  const publicShareUrl = getPublicShareUrl();

  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  // Custom friend phone direct chat state
  const [friendPhone, setFriendPhone] = useState('');
  const [friendPhoneError, setFriendPhoneError] = useState('');

  const shareTitle = 'NS Properties - Real Estate & Property Search in India';
  const whatsappShareMessage = `Hey! Check out NS Properties - verified flats, luxury villas, plots, and commercial spaces across India:\n${publicShareUrl}\n\nSearch, compare prices, and schedule free site visits!`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(publicShareUrl);
      } else {
        const el = document.createElement('textarea');
        el.value = publicShareUrl;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  // 1. Share via contact/group picker
  const handleWhatsAppShareWithFriends = () => {
    openWhatsAppShare(whatsappShareMessage);
  };

  // 2. Direct chat to a specific friend's number
  const handleDirectChatToFriend = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = cleanPhoneNumber(friendPhone);
    const digitsOnly = friendPhone.replace(/\D/g, '');
    
    if (!digitsOnly || digitsOnly.length < 10) {
      setFriendPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setFriendPhoneError('');
    openWhatsAppChat(cleaned, whatsappShareMessage);
  };

  // 3. Direct chat with NS Properties Support Desk
  const handleWhatsAppChatDirect = () => {
    const msg = `Hello NS Properties team, I am checking out the portal (${publicShareUrl}) and would like assistance with verified properties.`;
    openWhatsAppChat(DEFAULT_CONTACT_PHONE, msg);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: 'Check out NS Properties for verified real estate listings across India!',
          url: publicShareUrl
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  // Precomputed URLs for direct <a> links as safe fallbacks
  const directWaMeShareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappShareMessage)}`;
  const directApiWhatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappShareMessage)}`;

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(publicShareUrl)}&text=${encodeURIComponent(
    'Check out NS Properties - Verified Homes, Flats & Plots in India'
  )}`;

  const emailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(
    `Hi,\n\nI wanted to share this property portal with you. You can browse verified homes, compare prices, and schedule free site visits:\n\n${publicShareUrl}\n\nEnjoy!`
  )}`;

  // Google Chart API generated QR code for the share URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(publicShareUrl)}`;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#fdfcf9] border-[1.5px] border-[#1a1a1a] max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] p-5 flex items-center justify-between shrink-0 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[#c4a47c] flex items-center justify-center text-[#c4a47c]">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-white">Share NS Properties</h3>
              <p className="editorial-label text-[#fdfcf9]/70 text-xs normal-case">Direct WhatsApp invitation & link for friends & clients</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-white/20 hover:border-white text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 bg-[#fdfcf9]">
          {/* Quick 1-Click Copy Link Box */}
          <div>
            <label className="editorial-label text-[#1a1a1a] block mb-1.5 font-bold">
              Direct Application Link:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={publicShareUrl}
                className="w-full px-3 py-2.5 bg-white border border-[#1a1a1a] text-xs font-mono-luxury text-[#1a1a1a] select-all focus:outline-hidden"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2.5 font-mono-luxury uppercase text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border border-[#1a1a1a] ${
                  copied 
                    ? 'bg-[#c4a47c] text-[#1a1a1a]' 
                    : 'bg-[#1a1a1a] hover:bg-black text-[#fdfcf9]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-emerald-800 font-mono-luxury bg-emerald-50/80 border border-emerald-200 px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
              <span>Public Link: Anyone can access this link directly without Google login or 403 errors.</span>
            </div>
          </div>

          {/* Dedicated WhatsApp Direct Chat to Friend's Number */}
          <div className="bg-white border border-[#1a1a1a] p-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 border border-[#1a1a1a] bg-[#1a1a1a] text-[#c4a47c] flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif-luxury text-base font-bold text-[#1a1a1a]">
                  Direct WhatsApp Invitation
                </h4>
                <p className="editorial-label text-[#1a1a1a]/70 text-[11px] normal-case">
                  Transmit an encrypted direct link to a client or acquaintance's WhatsApp:
                </p>
              </div>
            </div>

            <form onSubmit={handleDirectChatToFriend} className="flex flex-col sm:flex-row gap-2 font-mono-luxury">
              <div className="flex-1">
                <div className="flex border border-[#1a1a1a] bg-white overflow-hidden">
                  <span className="bg-[#fdfcf9] text-[#1a1a1a] px-3 py-2 text-xs font-bold border-r border-[#1a1a1a]">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={friendPhone}
                    onChange={(e) => {
                      setFriendPhone(e.target.value);
                      if (friendPhoneError) setFriendPhoneError('');
                    }}
                    maxLength={13}
                    className="w-full px-3 py-2 text-xs text-[#1a1a1a] placeholder-[#1a1a1a]/40 focus:outline-hidden"
                  />
                </div>
                {friendPhoneError && (
                  <p className="text-[10px] text-red-600 font-bold mt-1">{friendPhoneError}</p>
                )}
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] text-xs font-bold uppercase flex items-center justify-center gap-1.5 border border-[#1a1a1a] transition-all cursor-pointer shrink-0"
              >
                <span>Send WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#c4a47c]" />
              </button>
            </form>
          </div>

          {/* Social Share Buttons Grid */}
          <div className="space-y-2">
            <span className="editorial-label text-[#1a1a1a] font-bold block">
              Or Dispatch via Platform:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono-luxury">
              {/* WhatsApp Share with Friends (Opens WhatsApp Contact & Group Picker) */}
              <button
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  await openWhatsAppShare(whatsappShareMessage, publicShareUrl);
                }}
                className="flex flex-col items-center justify-center p-3 border border-[#1a1a1a] bg-white hover:bg-[#1a1a1a]/5 text-[#1a1a1a] transition-colors group cursor-pointer text-center"
                title="Share link with friends or groups on WhatsApp"
              >
                <div className="w-8 h-8 border border-[#1a1a1a] bg-emerald-800 text-white flex items-center justify-center mb-1.5">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">WhatsApp</span>
                <span className="editorial-label text-[#1a1a1a]/60 text-[9px]">Broadcast</span>
              </button>

              {/* Telegram */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 border border-[#1a1a1a] bg-white hover:bg-[#1a1a1a]/5 text-[#1a1a1a] transition-colors group cursor-pointer"
              >
                <div className="w-8 h-8 border border-[#1a1a1a] bg-[#1a1a1a] text-[#c4a47c] flex items-center justify-center mb-1.5">
                  <Send className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">Telegram</span>
                <span className="editorial-label text-[#1a1a1a]/60 text-[9px]">Channel / Chat</span>
              </a>

              {/* Email */}
              <a
                href={emailUrl}
                className="flex flex-col items-center justify-center p-3 border border-[#1a1a1a] bg-white hover:bg-[#1a1a1a]/5 text-[#1a1a1a] transition-colors group cursor-pointer"
              >
                <div className="w-8 h-8 border border-[#1a1a1a] bg-[#1a1a1a] text-white flex items-center justify-center mb-1.5">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">Email</span>
                <span className="editorial-label text-[#1a1a1a]/60 text-[9px]">Portfolio Memo</span>
              </a>

              {/* QR Code Toggle */}
              <button
                type="button"
                onClick={() => setShowQR(!showQR)}
                className={`flex flex-col items-center justify-center p-3 border border-[#1a1a1a] transition-colors group cursor-pointer ${
                  showQR 
                    ? 'bg-[#1a1a1a] text-[#fdfcf9]' 
                    : 'bg-white hover:bg-[#1a1a1a]/5 text-[#1a1a1a]'
                }`}
              >
                <div className={`w-8 h-8 border flex items-center justify-center mb-1.5 ${
                  showQR ? 'border-[#c4a47c] bg-[#1a1a1a] text-[#c4a47c]' : 'border-[#1a1a1a] bg-[#c4a47c] text-[#1a1a1a]'
                }`}>
                  <QrCode className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">QR Code</span>
                <span className="editorial-label text-[9px]">{showQR ? 'Hide' : 'Scan'}</span>
              </button>
            </div>

            {/* Direct Support Chat Option in Modal */}
            <div className="pt-1.5">
              <button
                type="button"
                onClick={handleWhatsAppChatDirect}
                className="w-full py-2.5 px-3 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-mono-luxury uppercase text-xs font-bold flex items-center justify-center gap-2 border border-[#1a1a1a] transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#c4a47c]" />
                <span>Chat Directly with NS Properties Support ({DISPLAY_CONTACT_PHONE})</span>
              </button>
            </div>
          </div>

          {/* QR Code Viewer (collapsible) */}
          {showQR && (
            <div className="bg-white border border-[#1a1a1a] p-4 text-center animate-in zoom-in-95 duration-150">
              <span className="font-serif-luxury text-base font-bold text-[#1a1a1a] block mb-1">
                Scan with Phone Camera to Open App:
              </span>
              <p className="editorial-label text-[#1a1a1a]/70 text-[11px] normal-case mb-3">
                Your friend can point their camera at this QR code to launch NS Properties instantly.
              </p>
              <div className="inline-block p-2.5 bg-white border border-[#1a1a1a]">
                <img 
                  src={qrCodeUrl} 
                  alt="QR code to open NS Properties" 
                  className="w-40 h-40 mx-auto"
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {/* Native Phone Share Button (if supported or mobile) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 px-4 bg-transparent hover:bg-[#1a1a1a]/5 text-[#1a1a1a] font-mono-luxury uppercase font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#1a1a1a]"
            >
              <Share2 className="w-4 h-4 text-[#c4a47c]" />
              <span>More Sharing Options (AirDrop, Bluetooth, Apps)</span>
            </button>
          )}

          {/* Explanation info note */}
          <div className="bg-white border border-[#1a1a1a] p-3.5 flex items-start gap-2.5 text-xs text-[#1a1a1a]">
            <Smartphone className="w-4 h-4 text-[#c4a47c] shrink-0 mt-0.5" />
            <div>
              <span className="font-serif-luxury font-bold block text-sm">Universal Device Compatibility</span>
              <span className="editorial-label text-[#1a1a1a]/70 text-[11px] normal-case leading-relaxed">
                When your contacts open this link on iPhone or Android, they can browse immediately and tap <strong>"Add to Home Screen"</strong> for a native app experience.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#fdfcf9] px-5 py-3 border-t border-[#1a1a1a] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] font-mono-luxury uppercase text-xs font-bold border border-[#1a1a1a] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
