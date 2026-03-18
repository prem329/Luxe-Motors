import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail } from 'lucide-react';
import { Car } from '../types';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingModalProps {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ car, isOpen, onClose }) => {
  const { addBooking } = useAppContext();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    name: '',
    mobile: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      addBooking({
        id: `b${Date.now()}`,
        carId: car.id,
        carName: `${car.brand} ${car.name}`,
        ...formData,
        status: 'Pending'
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({ date: '', time: '', name: '', mobile: '', email: '' });
      }, 2000);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-800 flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-zinc-800 shrink-0">
              <h2 className="text-xl font-bold text-white">Book a Visit</h2>
              <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar">
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Booking Confirmed!</h3>
                  <p className="text-zinc-400">We will contact you shortly to confirm your visit.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                  <div className="bg-zinc-800/50 p-3 md:p-4 rounded-xl mb-4 md:mb-6">
                    <p className="text-xs md:text-sm text-zinc-400">Selected Vehicle</p>
                    <p className="font-bold text-white text-sm md:text-base">{car.brand} {car.name} ({car.year})</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1">Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-zinc-500" />
                        <input
                          type="date"
                          name="date"
                          required
                          value={formData.date}
                          onChange={handleChange}
                          className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm md:text-base appearance-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1">Time</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-zinc-500" />
                        <input
                          type="time"
                          name="time"
                          required
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm md:text-base appearance-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-zinc-500" />
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm md:text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-zinc-500" />
                      <input
                        type="tel"
                        name="mobile"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm md:text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-zinc-500" />
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm md:text-base"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 md:py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-base md:text-lg transition-colors mt-4 md:mt-6 disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
