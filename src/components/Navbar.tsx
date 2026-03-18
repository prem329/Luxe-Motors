import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Menu, X, Heart, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { savedCars, isAdmin } = useAppContext();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Inventory', path: '/inventory' },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-zinc-950 text-white sticky top-0 z-50 border-b border-zinc-800">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-emerald-500" />
              <span className="font-bold text-xl tracking-tight">LUXE<span className="text-emerald-500">MOTORS</span></span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/inventory?saved=true" className="relative p-2 text-zinc-300 hover:text-white transition-colors">
                <Heart className="h-5 w-5" />
                {savedCars.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-emerald-500 rounded-full">
                    {savedCars.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/inventory?saved=true"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <Heart className="h-5 w-5" /> Saved Cars ({savedCars.length})
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
