import React, { useState } from 'react';
import { Save, Building, Clock, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useAppContext();
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      updateSettings(formData);
      setIsSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dealership Settings</h1>
        <p className="text-zinc-400">Update your contact information, address, and working hours.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Building className="w-6 h-6 text-emerald-500" /> Dealership Info
          </h3>
        </div>

        <div className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">WhatsApp Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-1">Physical Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-4 w-5 h-5 text-zinc-500" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-emerald-500" /> Working Hours
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Working Days</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    name="workingDays"
                    value={formData.workingDays}
                    onChange={handleChange}
                    placeholder="e.g., Monday - Saturday"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Timings</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    name="workingHours"
                    value={formData.workingHours}
                    onChange={handleChange}
                    placeholder="e.g., 10:00 AM - 8:00 PM"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-400 mb-1">Holidays</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    name="holidays"
                    value={formData.holidays}
                    onChange={handleChange}
                    placeholder="e.g., Closed on Sundays and National Holidays"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-950/50 flex items-center justify-between">
          {success ? (
            <span className="text-emerald-500 font-medium flex items-center gap-2">
              <Save className="w-5 h-5" /> Settings saved successfully!
            </span>
          ) : <span />}
          
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isSaving ? 'Saving...' : (
              <>
                <Save className="w-5 h-5" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
