import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Zap, Award } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { CarCard } from '../components/CarCard';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
  const { cars } = useAppContext();

  const featuredCars = cars.filter(car => car.status === 'Featured').slice(0, 3);
  const hotDeals = cars.filter(car => car.status === 'Hot Deal').slice(0, 3);
  const newArrivals = cars.filter(car => car.isNew).slice(0, 3);
  
  const brands = useMemo(() => Array.from(new Set(cars.map(c => c.brand))).sort(), [cars]);

  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2000&auto=format&fit=crop" 
            alt="Luxury Car Hero" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6"
          >
            Drive Your <span className="text-emerald-500">Dream</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-zinc-300 mb-10 max-w-3xl mx-auto font-light"
          >
            Discover a curated collection of premium pre-owned luxury vehicles. Certified quality, unmatched service.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              to="/inventory" 
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] flex items-center justify-center gap-2"
            >
              Explore Inventory <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-zinc-900 border-y border-zinc-800">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">150+ Point Check</h3>
              <p className="text-zinc-400">Every vehicle undergoes a rigorous inspection process to ensure premium quality.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Financing</h3>
              <p className="text-zinc-400">Get pre-approved for a loan in minutes with our partnered financial institutions.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Extended Warranty</h3>
              <p className="text-zinc-400">Drive with peace of mind with our comprehensive extended warranty options.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      {featuredCars.length > 0 && (
        <section className="py-20 w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Collection</h2>
              <p className="text-zinc-400">Handpicked luxury vehicles for the discerning buyer.</p>
            </div>
            <Link to="/inventory" className="flex items-center text-sm md:text-base text-emerald-500 hover:text-emerald-400 font-medium transition-colors">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </section>
      )}

      {/* Hot Deals */}
      {hotDeals.length > 0 && (
        <section className="py-20 bg-zinc-900 border-y border-zinc-800">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  Hot Deals <span className="text-2xl">🔥</span>
                </h2>
                <p className="text-zinc-400">Unbeatable prices on premium vehicles. Limited time only.</p>
              </div>
              <Link to="/inventory" className="flex items-center text-sm md:text-base text-emerald-500 hover:text-emerald-400 font-medium transition-colors">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {hotDeals.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brands Section */}
      <section className="py-16 bg-zinc-950">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Browse by Brand</h2>
              <p className="text-zinc-400">Explore our extensive collection of premium brands.</p>
            </div>
            <Link to="/inventory" className="flex items-center text-sm md:text-base text-emerald-500 hover:text-emerald-400 font-medium transition-colors">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {brands.map(brand => (
              <Link 
                key={brand} 
                to={`/inventory?brand=${encodeURIComponent(brand)}`}
                className="bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 group"
              >
                <img 
                  src={`https://logo.clearbit.com/${brand.toLowerCase().replace(/\s+/g, '')}.com`} 
                  alt={brand}
                  onError={(e) => {
                    // Fallback to text if logo fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                    const span = (e.target as HTMLImageElement).nextElementSibling as HTMLSpanElement;
                    if (span) span.style.display = 'block';
                  }}
                  className="w-16 h-16 object-contain mb-2 filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <span className="text-sm font-bold text-zinc-300 group-hover:text-white hidden">{brand}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
