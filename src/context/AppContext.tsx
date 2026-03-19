import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Car, DealershipSettings, Booking, Customer } from '../types';
import { getApiUrl } from '../utils/api';

interface AppContextType {
  cars: Car[];
  settings: DealershipSettings;
  bookings: Booking[];
  customers: Customer[];
  savedCars: string[];
  user: any | null;
  isAdmin: boolean;
  isAuthReady: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  addCar: (car: Car) => Promise<void>;
  updateCar: (car: Car) => Promise<void>;
  deleteCar: (id: string) => Promise<void>;
  updateSettings: (settings: DealershipSettings) => Promise<void>;
  addBooking: (booking: Booking) => Promise<void>;
  updateBooking: (booking: Booking) => Promise<void>;
  toggleSavedCar: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const emptySettings: DealershipSettings = {
  address: '',
  workingHours: '',
  holidays: '',
  workingDays: '',
  phone: '',
  email: '',
  whatsapp: ''
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [settings, setSettings] = useState<DealershipSettings>(emptySettings);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [savedCars, setSavedCars] = useState<string[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession === 'true') {
      setIsAdmin(true);
    }
    setIsAuthReady(true);
  }, []);

  const fetchData = async () => {
    try {
      const carsRes = await fetch(getApiUrl('getCars'));
      if (carsRes.ok) setCars(await carsRes.json());
      
      const settingsRes = await fetch(getApiUrl('getSettings'));
      if (settingsRes.ok) setSettings(await settingsRes.json());

      if (isAdmin) {
        const bookingsRes = await fetch(getApiUrl('getBookings'));
        if (bookingsRes.ok) setBookings(await bookingsRes.json());

        const customersRes = await fetch(getApiUrl('getCustomers'));
        if (customersRes.ok) setCustomers(await customersRes.json());
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  useEffect(() => {
    if (!isAuthReady) return;

    fetchData();

    const saved = localStorage.getItem('savedCars');
    if (saved) {
      setSavedCars(JSON.parse(saved));
    }
  }, [isAuthReady, isAdmin]);

  const addCar = async (car: Car) => {
    try {
      const res = await fetch(getApiUrl('addCar'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(car)
      });
      if (res.ok) {
        setCars(prev => [...prev, car]);
        if (customers.length > 0) {
          const customerEmails = customers.map(c => c.email);
          fetch(getApiUrl('notify-new-car'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              emails: customerEmails,
              carName: `${car.brand} ${car.name}`,
              carDetails: `Price: ${car.price}, Year: ${car.year}, Mileage: ${car.mileage}`,
              carImage: car.mainImage
            })
          }).catch(e => console.error("Failed to send new car notification:", e));
        }
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error("Error adding car:", error);
    }
  };
  
  const updateCar = async (updatedCar: Car) => {
    try {
      const res = await fetch(getApiUrl('updateCar'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCar)
      });
      if (res.ok) {
        setCars(prev => prev.map(c => c.id === updatedCar.id ? updatedCar : c));
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
       console.error("Error updating car:", error);
    }
  };

  const deleteCar = async (id: string) => {
    try {
      const res = await fetch(getApiUrl('deleteCar'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setCars(prev => prev.filter(c => c.id !== id));
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const updateSettings = async (newSettings: DealershipSettings) => {
    try {
      const res = await fetch(getApiUrl('updateSettings'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        setSettings(newSettings);
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const addBooking = async (booking: Booking) => {
    try {
      const res = await fetch(getApiUrl('addBooking'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
      if (res.ok) {
        setBookings(prev => [...prev, booking]);
        const customerId = `c_${booking.email.replace(/[^a-zA-Z0-9]/g, '')}`;
        if (!customers.find(c => c.id === customerId)) {
           setCustomers(prev => [...prev, {
             id: customerId,
             name: booking.name,
             email: booking.email,
             phone: booking.mobile,
             registeredAt: new Date().toISOString()
           }]);
        }

        fetch(getApiUrl('notify-booking'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ownerEmail: settings.email || 'premsai58008@gmail.com',
            bookingDetails: booking
          })
        }).catch(e => console.error("Failed to send booking notification:", e));
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error("Error adding booking:", error);
    }
  };

  const updateBooking = async (updatedBooking: Booking) => {
    try {
      const res = await fetch(getApiUrl('updateBooking'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBooking)
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const toggleSavedCar = (id: string) => {
    setSavedCars(prev => {
      const newSaved = prev.includes(id) ? prev.filter(carId => carId !== id) : [...prev, id];
      localStorage.setItem('savedCars', JSON.stringify(newSaved));
      return newSaved;
    });
  };

  const login = (password: string) => {
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin'; 
    if (password === correctPassword) {
      setIsAdmin(true);
      localStorage.setItem('adminSession', 'true');
      fetchData(); // Fetch admin data upon login
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('adminSession');
  };

  return (
    <AppContext.Provider value={{
      cars, settings, bookings, customers, savedCars, user, isAdmin, isAuthReady,
      login, logout,
      addCar, updateCar, deleteCar, updateSettings, addBooking, updateBooking, toggleSavedCar
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
