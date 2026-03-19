import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Fuel, Settings, Calendar, Gauge } from 'lucide-react';
import { Car } from '../types';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const { savedCars, toggleSavedCar } = useAppContext();
  const isSaved = savedCars.includes(car.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-zinc-900 rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-800 shadow-lg group relative flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <Link to={`/cars/${car.slug}`}>
          <img 
            src={car.mainImage} 
            alt={`${car.brand} ${car.model}`} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 sm:gap-2">
          {car.status === 'Featured' && (
            <span className="bg-amber-500 text-black text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider shadow-md">
              Featured ⭐
            </span>
          )}
          {car.status === 'Hot Deal' && (
            <span className="bg-rose-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider shadow-md">
              Hot Deal 🔥
            </span>
          )}
          {car.status === 'Sold' && (
            <span className="bg-zinc-800 text-zinc-300 text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider shadow-md border border-zinc-700">
              Sold ❌
            </span>
          )}
          {car.isNew && car.status !== 'Sold' && (
            <span className="bg-emerald-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider shadow-md">
              New Arrival
            </span>
          )}
        </div>

        {/* Save Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleSavedCar(car.id);
          }}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors z-10"
        >
          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1 sm:mb-2">
          <Link to={`/cars/${car.slug}`} className="hover:text-emerald-400 transition-colors">
            <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
              {car.brand} {car.name}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 sm:mt-1">{car.model}</p>
          </Link>
        </div>

        {/* Price */}
        <div className="mt-1 sm:mt-2 mb-3 sm:mb-4">
          {car.priceDiscount ? (
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-emerald-400">{formatPrice(car.priceDiscount)}</span>
              <span className="text-xs sm:text-sm text-zinc-500 line-through">{formatPrice(car.price)}</span>
            </div>
          ) : (
            <span className="text-xl sm:text-2xl font-bold text-emerald-400">{formatPrice(car.price)}</span>
          )}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-y-2 sm:gap-y-3 gap-x-3 sm:gap-x-4 text-xs sm:text-sm text-zinc-300 mb-4 sm:mb-6 mt-auto">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
            <span>{car.distanceTravelled.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Fuel className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
            <span>{car.transmission}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link 
          to={`/cars/${car.slug}`}
          className="w-full py-2 sm:py-3 px-4 bg-zinc-800 hover:bg-emerald-600 text-white text-sm sm:text-base text-center rounded-lg sm:rounded-xl font-medium transition-colors duration-300"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};
