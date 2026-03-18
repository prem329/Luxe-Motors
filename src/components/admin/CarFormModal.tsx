import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Car, FuelType, Transmission, OwnerType, CarStatus } from '../../types';

interface CarFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (car: Car) => void;
  initialData?: Car | null;
}

export const CarFormModal: React.FC<CarFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Car>>({
    name: '',
    model: '',
    brand: '',
    price: 0,
    priceDiscount: 0,
    fuelType: 'Petrol',
    distanceTravelled: 0,
    transmission: 'Automatic',
    seats: 5,
    numberPlate: '',
    ownerType: '1st Owner',
    year: new Date().getFullYear(),
    odometer: 0,
    mainImage: '',
    images: [],
    engineCapacity: 0,
    mileage: 0,
    insuranceStatus: '',
    registrationState: '',
    color: '',
    serviceHistory: '',
    accidentHistory: false,
    loanAvailability: false,
    isNew: false,
    isOffer: false,
    status: 'Available',
    views: 0,
    slug: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        model: '',
        brand: '',
        price: 0,
        priceDiscount: 0,
        fuelType: 'Petrol',
        distanceTravelled: 0,
        transmission: 'Automatic',
        seats: 5,
        numberPlate: '',
        ownerType: '1st Owner',
        year: new Date().getFullYear(),
        odometer: 0,
        mainImage: '',
        images: [],
        engineCapacity: 0,
        mileage: 0,
        insuranceStatus: '',
        registrationState: '',
        color: '',
        serviceHistory: '',
        accidentHistory: false,
        loanAvailability: false,
        isNew: false,
        isOffer: false,
        status: 'Available',
        views: 0,
        slug: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate slug if not present
    let finalData = { ...formData };
    if (!finalData.slug) {
      finalData.slug = `${finalData.brand}-${finalData.name}-${finalData.year}`.toLowerCase().replace(/\s+/g, '-');
    }
    
    // Generate ID if not present
    if (!finalData.id) {
      finalData.id = Date.now().toString();
    }

    onSave(finalData as Car);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center shrink-0">
          <h2 className="text-2xl font-bold text-white">
            {initialData ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="car-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4 border-b border-zinc-800 pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Brand</label>
                  <input required type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. BMW" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. X5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Model / Variant</label>
                  <input required type="text" name="model" value={formData.model} onChange={handleChange} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. xDrive40i" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Year</label>
                  <input required type="number" name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Price (₹)</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Discounted Price (₹)</label>
                  <input type="number" name="priceDiscount" value={formData.priceDiscount} onChange={handleChange} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Leave 0 if no discount" />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4 border-b border-zinc-800 pb-2">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Fuel Type</label>
                  <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Transmission</label>
                  <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Owner Type</label>
                  <select name="ownerType" value={formData.ownerType} onChange={handleChange} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option value="1st Owner">1st Owner</option>
                    <option value="2nd Owner">2nd Owner</option>
                    <option value="3rd Owner">3rd Owner</option>
                    <option value="4th+ Owner">4th+ Owner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Distance Travelled (km)</label>
                  <input required type="number" name="distanceTravelled" value={formData.distanceTravelled} onChange={handleChange} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Engine Capacity (cc)</label>
                  <input required type="number" name="engineCapacity" value={formData.engineCapacity} onChange={handleChange} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Mileage (km/l)</label>
                  <input required type="number" name="mileage" value={formData.mileage} onChange={handleChange} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Seats</label>
                  <input required type="number" name="seats" value={formData.seats} onChange={handleChange} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Color</label>
                  <input required type="text" name="color" value={formData.color} onChange={handleChange} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Registration State</label>
                  <input required type="text" name="registrationState" value={formData.registrationState} onChange={handleChange} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. MH, DL, KA" />
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4 border-b border-zinc-800 pb-2">Images</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Main Image</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData(prev => ({ ...prev, mainImage: reader.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }} 
                    className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20" 
                  />
                  {formData.mainImage && (
                    <img src={formData.mainImage} alt="Main preview" className="mt-2 h-24 w-32 object-cover rounded-lg border border-zinc-800" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Additional Images</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []) as File[];
                      files.forEach(file => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData(prev => ({ 
                            ...prev, 
                            images: [...(prev.images || []), reader.result as string] 
                          }));
                        };
                        reader.readAsDataURL(file);
                      });
                    }} 
                    className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20" 
                  />
                  {formData.images && formData.images.length > 0 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative shrink-0">
                          <img src={img} alt={`Preview ${idx}`} className="h-20 w-28 object-cover rounded-lg border border-zinc-800" />
                          <button 
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== idx) }))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Admin Flags */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4 border-b border-zinc-800 pb-2">Admin Flags & Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} className="w-5 h-5 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 bg-zinc-900" />
                    <span className="text-white font-medium">Mark as New Arrival</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="isOffer" checked={formData.isOffer} onChange={handleChange} className="w-5 h-5 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 bg-zinc-900" />
                    <span className="text-white font-medium">Mark as Special Offer</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="loanAvailability" checked={formData.loanAvailability} onChange={handleChange} className="w-5 h-5 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 bg-zinc-900" />
                    <span className="text-white font-medium">Loan Available</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Featured">Featured</option>
                    <option value="Hot Deal">Hot Deal</option>
                  </select>
                </div>
              </div>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-zinc-800 flex justify-end gap-4 shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 text-zinc-400 hover:text-white font-medium transition-colors">
            Cancel
          </button>
          <button type="submit" form="car-form" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors shadow-lg">
            {initialData ? 'Save Changes' : 'Add Vehicle'}
          </button>
        </div>
      </div>
    </div>
  );
};
