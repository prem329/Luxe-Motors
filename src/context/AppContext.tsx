import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Car, DealershipSettings, Booking, Customer } from '../types';
import { mockCars, initialSettings, mockBookings, mockCustomers } from '../data/mockData';
import { db, auth } from '../firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, getDoc, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

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
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [settings, setSettings] = useState<DealershipSettings>(initialSettings);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [savedCars, setSavedCars] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'premsai58008@gmail.com';
      setIsAdmin(currentUser?.email === adminEmail);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    // Load Cars
    const carsUnsubscribe = onSnapshot(collection(db, 'cars'), (snapshot) => {
      if (!snapshot.empty) {
        setCars(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car)));
      }
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
        if (!snapshot.empty) {
          setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));
        }
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'bookings'));

      customersUnsubscribe = onSnapshot(collection(db, 'customers'), (snapshot) => {
        if (!snapshot.empty) {
          setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer)));
        }
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
      
      // Try to add customer, might fail if already exists and no update permission, which is fine
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
        // Ignore error if customer already exists
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

  return (
    <AppContext.Provider value={{
      cars, settings, bookings, customers, savedCars, user, isAdmin,
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
