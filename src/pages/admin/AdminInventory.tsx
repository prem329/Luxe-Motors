import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, MoreVertical, Eye } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Car } from '../../types';
import { CarFormModal } from '../../components/admin/CarFormModal';

export const AdminInventory: React.FC = () => {
  const { cars, deleteCar, updateCar, addCar } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const filteredCars = cars.filter(car => 
    `${car.brand} ${car.model} ${car.name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Inventory Management</h1>
          <p className="text-zinc-400">Manage your vehicles, update prices, and change status.</p>
        </div>
        <button 
          onClick={() => { setEditingCar(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" /> Add New Vehicle
        </button>
      </div>

      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 text-zinc-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Vehicle</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Views</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-zinc-800">
              {filteredCars.map((car) => (
                <tr key={car.id} className="hover:bg-zinc-800/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <img src={car.mainImage} alt={car.name} className="w-16 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <div className="font-bold text-white">{car.brand} {car.name}</div>
                        <div className="text-zinc-500 text-xs">{car.year} • {car.fuelType} • {car.transmission}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-emerald-400">{formatPrice(car.priceDiscount || car.price)}</div>
                    {car.priceDiscount && <div className="text-xs text-zinc-500 line-through">{formatPrice(car.price)}</div>}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 items-start">
                      <select
                        value={car.status}
                        onChange={(e) => updateCar({ ...car, status: e.target.value as any })}
                        className={`appearance-none outline-none cursor-pointer inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          car.status === 'Available' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                          car.status === 'Sold' ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' :
                          car.status === 'Featured' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                          'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        }`}
                      >
                        <option value="Available" className="bg-zinc-900 text-white">Available</option>
                        <option value="Sold" className="bg-zinc-900 text-white">Sold</option>
                        <option value="Featured" className="bg-zinc-900 text-white">Featured</option>
                        <option value="Hot Deal" className="bg-zinc-900 text-white">Hot Deal</option>
                      </select>
                      {car.isNew && <span className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold">New Arrival</span>}
                    </div>
                  </td>
                  <td className="p-4 text-zinc-300">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-zinc-500" /> {car.views.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingCar(car); setIsModalOpen(true); }}
                        className="p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors" title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if(window.confirm('Are you sure you want to delete this car?')) {
                            deleteCar(car.id);
                          }
                        }}
                        className="p-2 text-rose-500 hover:text-white bg-rose-500/10 hover:bg-rose-500 rounded-lg transition-colors" title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCars.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500">
                    No vehicles found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-zinc-800 text-sm text-zinc-500 flex justify-between items-center">
          <span>Showing {filteredCars.length} of {cars.length} vehicles</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-zinc-700 rounded hover:bg-zinc-800 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-zinc-700 rounded hover:bg-zinc-800 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
      
      <CarFormModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingCar(null); }} 
        onSave={(car) => {
          if (editingCar) {
            updateCar(car);
          } else {
            addCar(car);
          }
        }}
        initialData={editingCar}
      />
    </div>
  );
};
