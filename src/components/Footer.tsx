import React from 'react';
import { MapPin, Clock, Phone, Mail, Calendar } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { settings } = useAppContext();

  return (
    <footer className="bg-zinc-950 text-zinc-400 py-12 border-t border-zinc-800">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div>
            <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-emerald-500">LUXE</span>MOTORS
            </h3>
            <p className="text-sm mb-4">
              Premium pre-owned luxury cars. We offer the best deals with certified quality and unmatched service.
            </p>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>{settings.email}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-4">Working Hours</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>{settings.workingDays}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>{settings.workingHours}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 flex items-center justify-center text-emerald-500 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </span>
                <span>{settings.holidays}</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} LuxeMotors. All rights reserved.</p>
          <a href="/admin" className="text-zinc-500 hover:text-emerald-500 transition-colors">Admin Login</a>
        </div>
      </div>
    </footer>
  );
};
