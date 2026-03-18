export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';
export type Transmission = 'Manual' | 'Automatic';
export type OwnerType = '1st Owner' | '2nd Owner' | '3rd Owner' | '4th+ Owner';
export type CarStatus = 'Available' | 'Sold' | 'Featured' | 'Hot Deal';

export interface Car {
  id: string;
  name: string;
  model: string;
  brand: string;
  price: number;
  priceDiscount?: number; // Discounted price if applicable
  fuelType: FuelType;
  distanceTravelled: number; // KM driven
  transmission: Transmission;
  seats: number;
  numberPlate: string;
  ownerType: OwnerType;
  year: number;
  odometer: number;
  mainImage: string;
  images: string[];
  
  // Additional Details
  engineCapacity: number; // cc
  mileage: number; // km/l
  insuranceStatus: string; // e.g., 'Valid till 2025', 'Expired'
  registrationState: string;
  color: string;
  serviceHistory: string; // e.g., 'Full Authorized Dealer', 'Partial'
  accidentHistory: boolean;
  loanAvailability: boolean;

  // Admin Flags
  isNew: boolean;
  isOffer: boolean;
  status: CarStatus;
  views: number;
  slug: string; // Unique URL e.g., hyundai-i20-2021
}

export interface DealershipSettings {
  address: string;
  workingHours: string;
  holidays: string;
  workingDays: string;
  phone: string;
  email: string;
  whatsapp: string;
}

export interface Booking {
  id: string;
  carId: string;
  carName: string;
  date: string;
  time: string;
  name: string;
  mobile: string;
  email: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Sold';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
}
