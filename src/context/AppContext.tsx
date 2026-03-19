import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Car, DealershipSettings, Booking, Customer } from '../types';
import { mockCars, initialSettings, mockBookings, mockCustomers } from '../data/mockData';
import { db, auth } from '../firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, getDoc, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getApiUrl } from '../utils/api';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AppContextType {
  cars: Car[];
  settings: DealershipSettings;
  bookings: Booking[];
  customers: Customer[];
  savedCars: string[];
  user: User | null;
  isAdmin: boolean;
  isAuthReady: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  addCar: (car: Car) => void;
  updateCar: (car: Car) => void;
  deleteCar: (id: string) => void;
  updateSettings: (settings: DealershipSettings) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  toggleSavedCar: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [settings, setSettings] = useState<DealershipSettings>(initialSettings);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [savedCars, setSavedCars] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Simple session persistence
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession === 'true') {
      setIsAdmin(true);
    }
    setIsAuthReady(true);
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    // Load Cars
    const carsUnsubscribe = onSnapshot(collection(db, 'cars'), (snapshot) => {
      const carsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car));
      // If Firestore is empty, we can optionally bootstrap with mock data
      // but for now, let's just show what's in Firestore
      setCars(carsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'cars');
    });

    // Load Settings
    const settingsUnsubscribe = onSnapshot(doc(db, 'settings', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as DealershipSettings);
      } else if (isAdmin) {
        // Initialize settings if they don't exist, only if admin
        setDoc(doc(db, 'settings', 'main'), initialSettings).catch((error) => {
          handleFirestoreError(error, OperationType.CREATE, 'settings/main');
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/main');
    });

    let bookingsUnsubscribe = () => {};
    let customersUnsubscribe = () => {};

    // Load Bookings & Customers only for Admin
    if (isAdmin) {
      bookingsUnsubscribe = onSnapshot(collection(db, 'bookings'), (snapshot) => {
        const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
        setBookings(bookingsData);
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'bookings'));

      customersUnsubscribe = onSnapshot(collection(db, 'customers'), (snapshot) => {
        const customersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
        setCustomers(customersData);
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'customers'));
    }

    // Load saved cars from local storage
    const saved = localStorage.getItem('savedCars');
    if (saved) {
      setSavedCars(JSON.parse(saved));
    }

    return () => {
      carsUnsubscribe();
      settingsUnsubscribe();
      bookingsUnsubscribe();
      customersUnsubscribe();
    };
  }, [isAuthReady, isAdmin]);

  const addCar = async (car: Car) => {
    try {
      await setDoc(doc(db, 'cars', car.id), car);
      
      // Notify all customers about the new car
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
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `cars/${car.id}`);
    }
  };
  
  const updateCar = async (updatedCar: Car) => {
    try {
      await updateDoc(doc(db, 'cars', updatedCar.id), updatedCar as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `cars/${updatedCar.id}`);
    }
  };

  const deleteCar = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'cars', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `cars/${id}`);
    }
  };

  const updateSettings = async (newSettings: DealershipSettings) => {
    try {
      await updateDoc(doc(db, 'settings', 'main'), newSettings as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/main');
    }
  };

  const addBooking = async (booking: Booking) => {
    try {
      await setDoc(doc(db, 'bookings', booking.id), booking);
      
      // Notify owner about the new booking
      fetch(getApiUrl('notify-booking'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerEmail: settings.email || 'premsai58008@gmail.com',
          bookingDetails: booking
        })
      }).catch(e => console.error("Failed to send booking notification:", e));

      // Try to add customer
      const customerId = `c_${booking.email.replace(/[^a-zA-Z0-9]/g, '')}`;
      try {
        await setDoc(doc(db, 'customers', customerId), {
          id: customerId,
          name: booking.name,
          email: booking.email,
          phone: booking.mobile,
          registeredAt: new Date().toISOString()
        });
      } catch (e) {
        console.log("Customer already exists or permission denied to update");
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `bookings/${booking.id}`);
    }
  };

  const updateBooking = async (updatedBooking: Booking) => {
    try {
      await updateDoc(doc(db, 'bookings', updatedBooking.id), updatedBooking as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${updatedBooking.id}`);
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
    // Simple password check - in a real app this would be more secure
    // Using 'admin123' as a default password
    const correctPassword = 'admin'; 
    if (password === correctPassword) {
      setIsAdmin(true);
      localStorage.setItem('adminSession', 'true');
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
