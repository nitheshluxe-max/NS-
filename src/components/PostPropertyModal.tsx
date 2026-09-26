import React, { useState, useRef } from 'react';
import { 
  X, 
  Plus, 
  UploadCloud, 
  Check, 
  Sparkles, 
  Building2, 
  IndianRupee, 
  MapPin, 
  Image as ImageIcon,
  Camera,
  Trash2,
  Star,
  Link as LinkIcon,
  ImagePlus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Property, PropertyPurpose, PropertyCategory, PropertyType, FurnishingStatus, PossessionStatus, PostedBy } from '../types';
import { formatIndianCurrency } from '../utils/formatters';

interface PostPropertyModalProps {
  onClose: () => void;
  onPropertyAdded: (newProperty: Property) => void;
}

export const PostPropertyModal: React.FC<PostPropertyModalProps> = ({
  onClose,
  onPropertyAdded
}) => {
  const [purpose, setPurpose] = useState<PropertyPurpose>('buy');
  const [category, setCategory] = useState<PropertyCategory>('residential');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [title, setTitle] = useState('');
  const [projectName, setProjectName] = useState('');
  const [bhk, setBhk] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [areaSqFt, setAreaSqFt] = useState<number>(1450);
  const [carpetAreaSqFt, setCarpetAreaSqFt] = useState<number>(1150);
  const [city, setCity] = useState('Bengaluru');
  const [locality, setLocality] = useState('');
  const [price, setPrice] = useState<number>(12000000);
  const [furnishing, setFurnishing] = useState<FurnishingStatus>('Semi-Furnished');
  const [possession, setPossession] = useState<PossessionStatus>('Ready to Move');
  const [facing, setFacing] = useState('North-East');
  const [postedBy, setPostedBy] = useState<PostedBy>('Owner');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    '24/7 Security & CCTV',
    '100% Power Backup',
    'Covered Car Parking',
    'Equipped Gym',
    'Swimming Pool'
  ]);

  const availableAmenities = [
    'Swimming Pool',
    'Clubhouse',
    '24/7 Security & CCTV',
    '100% Power Backup',
    'Equipped Gym',
    'EV Charging Stations',
    'Tennis & Badminton Courts',
    'Kids Play Arena',
    'Jogging Track',
    'Covered Car Parking',
    'Piped Gas',
    'Private Lawn'
  ];

  const presetPhotos = [
    { label: 'Living Room', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Modern Kitchen', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Master Bedroom', url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Balcony / View', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Building Exterior', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Luxury Bathroom', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80' }
  ];

  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [photoList, setPhotoList] = useState<string[]>([
    presetPhotos[0].url,
    presetPhotos[1].url,
    presetPhotos[2].url
  ]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result && typeof e.target.result === 'string') {
            const dataUrl = e.target.result;
            setPhotoList((prev) => (prev.includes(dataUrl) ? prev : [...prev, dataUrl]));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleRemovePhoto = (index: number) => {
    setPhotoList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    setPhotoList((prev) => {
      const selected = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [selected, ...rest];
    });
  };

  const handleTogglePreset = (url: string) => {
    setPhotoList((prev) => 
      prev.includes(url) ? prev.filter((p) => p !== url) : [...prev, url]
    );
  };

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const handleAddPhoto = () => {
    if (customPhotoUrl.trim() && !photoList.includes(customPhotoUrl.trim())) {
      setPhotoList([...photoList, customPhotoUrl.trim()]);
      setCustomPhotoUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !city || !locality || !price || !sellerName || !sellerPhone) {
      alert('Please fill out all mandatory fields.');
      return;
    }

    const pricePerSqFt = areaSqFt > 0 ? Math.round(price / areaSqFt) : 0;
    const priceDisplay =
      purpose === 'rent'
        ? `${formatIndianCurrency(price)} / mo`
        : formatIndianCurrency(price);

    const newProp: Property = {
      id: `prop-user-${Date.now()}`,
      title,
      projectName: projectName || title,
      purpose,
      category,
      type: propertyType,
      bhk: category === 'residential' ? bhk : 0,
      bathrooms,
      price,
      priceDisplay,
      pricePerSqFt,
      areaSqFt,
      carpetAreaSqFt: carpetAreaSqFt || Math.round(areaSqFt * 0.8),
      city,
      locality,
      address: `${locality}, ${city}`,
      facing,
      furnishing,
      possession,
      isVerified: true,
      isExclusive: false,
      isFeatured: true,
      postedBy,
      postedDate: 'Just now',
      images: photoList.length > 0 ? photoList : presetPhotos.map((p) => p.url),
      amenities: selectedAmenities,
      description: description || `Well maintained property in ${locality}, ${city}. Excellent connectivity and natural light.`,
      landmarks: [
        { name: 'City Center Metro', distance: '1.5 km', type: 'metro' },
        { name: 'Reputed Multi-Specialty Hospital', distance: '2.0 km', type: 'hospital' }
      ],
      seller: {
        name: sellerName,
        phone: sellerPhone,
        email: 'seller@nsproperties.in',
        responseTime: 'Within 10 mins'
      }
    };

    onPropertyAdded(newProp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#fdfcf9] border-[1.5px] border-[#1a1a1a] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#1a1a1a] text-[#fdfcf9] px-6 py-4 flex items-center justify-between border-b border-[#1a1a1a]">
          <div>
            <span className="editorial-badge bg-[#c4a47c] text-[#1a1a1a] border-0 text-[10px] mb-1 inline-block">
              Listing Submission
            </span>
            <h2 className="font-serif-luxury text-2xl font-bold mt-1 text-white">List Asset on NS Properties</h2>
            <p className="editorial-label text-[#fdfcf9]/70 text-xs normal-case">Direct presentation to verified high-net-worth investors and buyers</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-white/20 hover:border-white text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 text-[#1a1a1a] bg-[#fdfcf9]">
          {/* Purpose & Type */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPurpose('buy')}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
                  purpose === 'buy'
                    ? 'bg-blue-50 border-[#005CA8] text-[#005CA8]'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                For Sale (Sell Property)
              </button>
              <button
                type="button"
                onClick={() => setPurpose('rent')}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
                  purpose === 'rent'
                    ? 'bg-blue-50 border-[#005CA8] text-[#005CA8]'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                For Rent (Lease Out)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="plots">Plots / Land</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="apartment">Apartment / Flat</option>
                  <option value="villa">Independent Villa / House</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="plot">Plot / Land</option>
                  <option value="commercial-office">Office Space</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">I am</label>
                <select
                  value={postedBy}
                  onChange={(e) => setPostedBy(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Owner">Owner (Zero Brokerage)</option>
                  <option value="Builder">Builder / Promoter</option>
                  <option value="Certified Agent">Certified Real Estate Agent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location & Title */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              2. Location & Society Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3 BHK Luxury Sunlit Flat in HSR Layout"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Project / Society Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prestige Lake Ridge"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">City *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Locality *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Whitefield, Bandra West, Cyber City"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Area, Dimensions, Price */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              3. Specifications & Pricing
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {category === 'residential' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">BHK</label>
                    <select
                      value={bhk}
                      onChange={(e) => setBhk(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      <option value={1}>1 BHK</option>
                      <option value={2}>2 BHK</option>
                      <option value={3}>3 BHK</option>
                      <option value={4}>4 BHK</option>
                      <option value={5}>5+ BHK</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Baths</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Super Area (sq.ft)</label>
                <input
                  type="number"
                  min={100}
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Carpet Area (sq.ft)</label>
                <input
                  type="number"
                  min={50}
                  value={carpetAreaSqFt}
                  onChange={(e) => setCarpetAreaSqFt(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Expected Price (₹ in Rupees) *
                </label>
                <input
                  type="number"
                  required
                  step={5000}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-bold"
                />
                <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                  Display: {formatIndianCurrency(price)}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Furnishing</label>
                <select
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Possession</label>
                <select
                  value={possession}
                  onChange={(e) => setPossession(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Ready to Move">Ready to Move</option>
                  <option value="Within 3 Months">Within 3 Months</option>
                  <option value="Under Construction (2026)">Under Construction (2026)</option>
                  <option value="Under Construction (2027)">Under Construction (2027)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Photos & Media Upload Section */}
          <div className="space-y-4 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#005CA8]" />
                  4. Property Photos & Media *
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Upload photos from your phone/computer, choose sample room photos, or paste image links.
                </p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                photoList.length > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {photoList.length} {photoList.length === 1 ? 'Photo' : 'Photos'} Added
              </span>
            </div>

            {/* Drag & Drop / Click Upload Box */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                handleFileUpload(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-[#005CA8] bg-blue-50/80 scale-[1.01]'
                  : 'border-slate-300 hover:border-[#005CA8] hover:bg-slate-50/70 bg-white'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileUpload(e.target.files)}
                multiple
                accept="image/*"
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#005CA8] flex items-center justify-center shadow-xs">
                  <UploadCloud className="w-6 h-6 text-[#005CA8]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800">
                    Click to browse or drag & drop property photos here
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Supports JPG, PNG, WEBP • Multiple images supported • Instant live preview
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#005CA8] bg-blue-50 border border-blue-200 px-3 py-1 rounded-md">
                    <ImagePlus className="w-3.5 h-3.5" />
                    Browse Photos / Camera
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Add from Preset Rooms */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block">
                Quick Select Pre-shot Architectural Photos:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {presetPhotos.map((preset, idx) => {
                  const isAdded = photoList.includes(preset.url);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTogglePreset(preset.url)}
                      className={`relative rounded-lg overflow-hidden border-2 text-left transition-all group cursor-pointer ${
                        isAdded ? 'border-[#005CA8] ring-2 ring-blue-300' : 'border-slate-200 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-14 object-cover" />
                      <div className="absolute inset-0 bg-black/40 p-1 flex flex-col justify-between">
                        <span className="text-[9px] font-bold text-white truncate drop-shadow-sm">
                          {preset.label}
                        </span>
                        <span className={`self-end w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                          isAdded ? 'bg-[#005CA8] text-white font-bold' : 'bg-white/80 text-slate-800'
                        }`}>
                          {isAdded ? '✓' : '+'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* URL Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="Or paste an image web link (https://...)"
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPhoto();
                    }
                  }}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                Add Link
              </button>
            </div>

            {/* Selected Photo Thumbnails Grid */}
            {photoList.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Reorder by clicking "Set as Cover" • First image will be displayed on search cards</span>
                  <button
                    type="button"
                    onClick={() => setPhotoList([])}
                    className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                  >
                    Clear All Photos
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {photoList.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-900 group shadow-xs"
                    >
                      <img
                        src={imgUrl}
                        alt={`Property photo ${idx + 1}`}
                        className="w-full h-24 sm:h-28 object-cover"
                      />
                      {/* Top Overlay Badge */}
                      <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                        {idx === 0 ? (
                          <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-white" />
                            COVER PHOTO
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetCover(idx)}
                            className="bg-black/60 hover:bg-[#005CA8] text-white text-[9px] font-bold px-1.5 py-0.5 rounded transition-colors cursor-pointer backdrop-blur-xs"
                            title="Make this the primary cover photo"
                          >
                            Set as Cover
                          </button>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600/85 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>No photos selected yet. Please upload or choose at least 1 photo for your listing.</span>
              </div>
            )}
          </div>

          {/* Amenities checklist */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              5. Amenities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableAmenities.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer border transition-colors ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 text-[#005CA8]'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleAmenity(amenity)}
                      className="w-3.5 h-3.5 rounded text-[#005CA8]"
                    />
                    <span className="truncate">{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              6. Contact & Seller Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sharma"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Short Description</label>
              <textarea
                rows={2}
                placeholder="Highlight unique features like corner flat, garden view, modular kitchen, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-[#1a1a1a]/20 flex items-center justify-end gap-3 font-mono-luxury">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs uppercase font-bold text-[#1a1a1a] hover:bg-[#1a1a1a]/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1a1a1a] hover:bg-black text-[#fdfcf9] text-xs font-bold uppercase transition-colors cursor-pointer border border-[#1a1a1a]"
            >
              Submit Property Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
