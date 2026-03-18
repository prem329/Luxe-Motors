import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, Phone, MessageCircle, Calendar, Gauge, Fuel, Settings, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { EMICalculator } from '../components/EMICalculator';
import { BookingModal } from '../components/BookingModal';
import { motion, AnimatePresence } from 'framer-motion';

export const CarDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { cars, savedCars, toggleSavedCar, settings } = useAppContext();
  
  const car = cars.find(c => c.slug === slug);
  const isSaved = car ? savedCars.includes(car.id) : false;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (car) {
      document.title = `${car.brand} ${car.name} | LuxeMotors`;
      // Increment views logic would go here in a real app
    }
  }, [car]);

  const [isCopied, setIsCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!car) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-3xl font-bold mb-2">Car Not Found</h2>
        <p className="text-zinc-400 mb-6">The vehicle you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate('/inventory')} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-medium transition-colors">
          Back to Inventory
        </button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const nextImage = () => setActiveImageIndex((prev) => (prev + 1) % car.images.length);
  const prevImage = () => setActiveImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);

  return (
    <div className="bg-zinc-950 min-h-screen text-white pb-20">
      {/* Breadcrumbs & Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 pt-8 pb-6">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-zinc-400 mb-4">
            <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button>
            <ChevronRight className="w-4 h-4 mx-2" />
            <button onClick={() => navigate('/inventory')} className="hover:text-white transition-colors">Inventory</button>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-emerald-500">{car.brand}</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold text-white">{car.brand} {car.name}</h1>
                {car.status === 'Featured' && <span className="bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Featured</span>}
                {car.status === 'Hot Deal' && <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Hot Deal</span>}
                {car.status === 'Sold' && <span className="bg-zinc-800 text-zinc-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-zinc-700">Sold</span>}
              </div>
              <p className="text-xl text-zinc-400">{car.model} • {car.year}</p>
            </div>
            
            <div className="flex flex-col items-start md:items-end">
              {car.priceDiscount ? (
                <div className="flex flex-col items-start md:items-end">
                  <span className="text-sm text-zinc-500 line-through mb-1">{formatPrice(car.price)}</span>
                  <span className="text-4xl font-bold text-emerald-400">{formatPrice(car.priceDiscount)}</span>
                </div>
              ) : (
                <span className="text-4xl font-bold text-emerald-400">{formatPrice(car.price)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Images & Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Image Gallery */}
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 shadow-xl">
              <div 
                className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden cursor-crosshair group"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    src={car.images[activeImageIndex]}
                    alt={`${car.brand} ${car.name} - View ${activeImageIndex + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`w-full h-full object-cover transition-transform duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                    style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                {/* Gallery Controls */}
                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/80 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/80 transition-colors">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Action Buttons Overlay */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); toggleSavedCar(car.id); }} className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/80 transition-colors shadow-lg">
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                  <button onClick={handleShare} className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/80 transition-colors shadow-lg relative group">
                    <Share2 className="w-5 h-5" />
                    {isCopied && (
                      <span className="absolute -bottom-10 right-0 bg-zinc-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Link copied!
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-4 mt-4 overflow-x-auto pb-2 custom-scrollbar">
                {car.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${activeImageIndex === idx ? 'border-emerald-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            {/* Key Specifications */}
            <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Settings className="w-6 h-6 text-emerald-500" /> Key Specifications
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-sm mb-1 flex items-center gap-1"><Calendar className="w-4 h-4" /> Year</span>
                  <span className="text-white font-semibold text-lg">{car.year}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-sm mb-1 flex items-center gap-1"><Gauge className="w-4 h-4" /> Driven</span>
                  <span className="text-white font-semibold text-lg">{car.distanceTravelled.toLocaleString()} km</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-sm mb-1 flex items-center gap-1"><Fuel className="w-4 h-4" /> Fuel</span>
                  <span className="text-white font-semibold text-lg">{car.fuelType}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-sm mb-1 flex items-center gap-1"><Settings className="w-4 h-4" /> Transmission</span>
                  <span className="text-white font-semibold text-lg">{car.transmission}</span>
                </div>
              </div>
            </div>

            {/* Detailed Overview */}
            <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6">Vehicle Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex justify-between py-3 border-b border-zinc-800/50">
                  <span className="text-zinc-400">Owner</span>
                  <span className="text-white font-medium">{car.ownerType}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-zinc-800/50">
                  <span className="text-zinc-400">Engine Capacity</span>
                  <span className="text-white font-medium">{car.engineCapacity} cc</span>
                </div>
                <div className="flex justify-between py-3 border-b border-zinc-800/50">
                  <span className="text-zinc-400">Mileage</span>
                  <span className="text-white font-medium">{car.mileage} {car.fuelType === 'Electric' ? 'km/charge' : 'km/l'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-zinc-800/50">
                  <span className="text-zinc-400">Seating Capacity</span>
                  <span className="text-white font-medium">{car.seats} Persons</span>
                </div>
                <div className="flex justify-between py-3 border-b border-zinc-800/50">
                  <span className="text-zinc-400">Color</span>
                  <span className="text-white font-medium">{car.color}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-zinc-800/50">
                  <span className="text-zinc-400">Registration</span>
                  <span className="text-white font-medium">{car.registrationState} ({car.numberPlate.substring(0, 4)})</span>
                </div>
                <div className="flex justify-between py-3 border-b border-zinc-800/50">
                  <span className="text-zinc-400">Insurance</span>
                  <span className="text-white font-medium">{car.insuranceStatus}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-zinc-800/50">
                  <span className="text-zinc-400">Service History</span>
                  <span className="text-white font-medium">{car.serviceHistory}</span>
                </div>
              </div>

              {/* Status Badges */}
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg">
                  {car.accidentHistory ? <AlertCircle className="w-5 h-5 text-amber-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  <span className="text-sm font-medium">{car.accidentHistory ? 'Accident History Reported' : 'No Accident History'}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg">
                  {car.loanAvailability ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-zinc-500" />}
                  <span className="text-sm font-medium">{car.loanAvailability ? 'Loan Available' : 'Loan Not Available'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Actions & EMI */}
          <div className="space-y-8">
            
            {/* Action Card */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl">
              {car.status === 'Sold' ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-zinc-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Vehicle Sold</h3>
                  <p className="text-zinc-400 mb-6">This vehicle is no longer available. Would you like to be notified when similar cars arrive?</p>
                  <button className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors">
                    Notify Me for Similar Cars
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] mb-4"
                  >
                    Book a Visit
                  </button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <a 
                      href={`tel:${settings.phone}`}
                      className="flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
                    >
                      <Phone className="w-5 h-5" /> Call Now
                    </a>
                    <a 
                      href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hi, I'm interested in the ${car.brand} ${car.name} (${car.year}) listed for ${formatPrice(car.priceDiscount || car.price)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 rounded-xl font-medium transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" /> WhatsApp
                    </a>
                  </div>
                  
                  <p className="text-center text-xs text-zinc-500 mt-6">
                    By proceeding, you agree to our Terms of Service & Privacy Policy.
                  </p>
                </>
              )}
            </div>

            {/* EMI Calculator */}
            <EMICalculator carPrice={car.priceDiscount || car.price} />

          </div>
        </div>
      </div>

      <BookingModal 
        car={car} 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </div>
  );
};
