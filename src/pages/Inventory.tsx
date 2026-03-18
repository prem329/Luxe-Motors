import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Filter, X, Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { CarCard } from '../components/CarCard';
import { FuelType, Transmission, OwnerType } from '../types';

export const Inventory: React.FC = () => {
  const { cars, savedCars } = useAppContext();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const showSavedOnly = queryParams.get('saved') === 'true';
  const initialBrand = queryParams.get('brand');

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filters state
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [selectedFuels, setSelectedFuels] = useState<FuelType[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<Transmission[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [yearRange, setYearRange] = useState<[number, number]>([2010, new Date().getFullYear()]);
  const [maxKm, setMaxKm] = useState<number>(200000);
  const [selectedOwners, setSelectedOwners] = useState<OwnerType[]>([]);

  // Update selectedBrands if URL changes
  useEffect(() => {
    const brandFromUrl = new URLSearchParams(location.search).get('brand');
    if (brandFromUrl) {
      setSelectedBrands(prev => prev.includes(brandFromUrl) ? prev : [...prev, brandFromUrl]);
    }
  }, [location.search]);

  // Derived data for filter options
  const brands = useMemo(() => Array.from(new Set(cars.map(c => c.brand))).sort(), [cars]);
  const fuelTypes: FuelType[] = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
  const transmissions: Transmission[] = ['Automatic', 'Manual'];
  const ownerTypes: OwnerType[] = ['1st Owner', '2nd Owner', '3rd Owner', '4th+ Owner'];

  // Filter logic
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      // Saved filter
      if (showSavedOnly && !savedCars.includes(car.id)) return false;

      // Search
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const carString = `${car.brand} ${car.model} ${car.name}`.toLowerCase();
        if (!carString.includes(term)) {
          return false;
        }
      }

      // Price
      const actualPrice = car.priceDiscount || car.price;
      if (actualPrice < priceRange[0] || actualPrice > priceRange[1]) return false;

      // Fuel
      if (selectedFuels.length > 0 && !selectedFuels.includes(car.fuelType)) return false;

      // Transmission
      if (selectedTransmissions.length > 0 && !selectedTransmissions.includes(car.transmission)) return false;

      // Brand
      if (selectedBrands.length > 0 && !selectedBrands.includes(car.brand)) return false;

      // Year
      if (car.year < yearRange[0] || car.year > yearRange[1]) return false;

      // KM
      if (car.distanceTravelled > maxKm) return false;

      // Owner
      if (selectedOwners.length > 0 && !selectedOwners.includes(car.ownerType)) return false;

      return true;
    });
  }, [cars, showSavedOnly, savedCars, searchTerm, priceRange, selectedFuels, selectedTransmissions, selectedBrands, yearRange, maxKm, selectedOwners]);

  const toggleArrayItem = <T,>(arr: T[], item: T, setArr: React.Dispatch<React.SetStateAction<T[]>>) => {
    if (arr.includes(item)) {
      setArr(arr.filter(i => i !== item));
    } else {
      setArr([...arr, item]);
    }
  };

  const toggleBrand = (brand: string) => {
    toggleArrayItem(selectedBrands, brand, setSelectedBrands);
  };

  const toggleOwner = (owner: OwnerType) => {
    toggleArrayItem(selectedOwners, owner, setSelectedOwners);
  };

  const clearFilters = () => {
    setPriceRange([0, 50000000]);
    setSelectedFuels([]);
    setSelectedTransmissions([]);
    setSelectedBrands([]);
    setYearRange([2010, new Date().getFullYear()]);
    setMaxKm(200000);
    setSelectedOwners([]);
    setSearchTerm('');
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-white pt-8 pb-20">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {showSavedOnly ? 'Saved Vehicles' : 'Inventory'}
            </h1>
            <p className="text-zinc-400 mt-1">Showing {filteredCars.length} vehicles</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className={`
            fixed inset-0 z-40 bg-zinc-950 p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out
            md:relative md:translate-x-0 md:w-80 md:bg-transparent md:p-0 md:z-0 md:block
            ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="flex justify-between items-center md:hidden mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 text-zinc-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl space-y-8 sticky top-28">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5 text-emerald-500" /> Filters
                </h3>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Brands */}
              <div>
                <h4 className="font-medium text-zinc-300 mb-3">Brands</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleBrand(brand); }}>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedBrands.includes(brand) ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-700 group-hover:border-emerald-500'}`}>
                        {selectedBrands.includes(brand) && <div className="w-2 h-2 bg-white rounded-sm" />}
                      </div>
                      <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-medium text-zinc-300 mb-3">Max Price: ₹{(priceRange[1] / 100000).toFixed(1)} Lakhs</h4>
                <input 
                  type="range" 
                  min={0} 
                  max={50000000} 
                  step={100000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Fuel Type */}
              <div>
                <h4 className="font-medium text-zinc-300 mb-3">Fuel Type</h4>
                <div className="flex flex-wrap gap-2">
                  {fuelTypes.map(fuel => (
                    <button
                      key={fuel}
                      onClick={() => toggleArrayItem(selectedFuels, fuel, setSelectedFuels)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedFuels.includes(fuel) 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
                      }`}
                    >
                      {fuel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transmission */}
              <div>
                <h4 className="font-medium text-zinc-300 mb-3">Transmission</h4>
                <div className="flex flex-wrap gap-2">
                  {transmissions.map(trans => (
                    <button
                      key={trans}
                      onClick={() => toggleArrayItem(selectedTransmissions, trans, setSelectedTransmissions)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedTransmissions.includes(trans) 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
                      }`}
                    >
                      {trans}
                    </button>
                  ))}
                </div>
              </div>

              {/* KM Driven */}
              <div>
                <h4 className="font-medium text-zinc-300 mb-3">Max KM Driven: {maxKm.toLocaleString()} km</h4>
                <input 
                  type="range" 
                  min={0} 
                  max={200000} 
                  step={5000}
                  value={maxKm}
                  onChange={(e) => setMaxKm(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Owner Type */}
              <div>
                <h4 className="font-medium text-zinc-300 mb-3">Owner</h4>
                <div className="space-y-2">
                  {ownerTypes.map(owner => (
                    <label key={owner} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleOwner(owner); }}>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedOwners.includes(owner) ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-700 group-hover:border-emerald-500'}`}>
                        {selectedOwners.includes(owner) && <div className="w-2 h-2 bg-white rounded-sm" />}
                      </div>
                      <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">{owner}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Apply Button */}
              <div className="md:hidden pt-4 border-t border-zinc-800">
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors"
                >
                  Apply Filters
                </button>
              </div>

            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {filteredCars.length === 0 ? (
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-12 text-center flex flex-col items-center justify-center h-96">
                <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-10 h-10 text-zinc-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No vehicles found</h3>
                <p className="text-zinc-400 mb-6 max-w-md">We couldn't find any cars matching your current filters. Try adjusting your search criteria.</p>
                <button 
                  onClick={clearFilters}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCars.map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
