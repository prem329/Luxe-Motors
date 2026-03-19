import React from 'react';
import { Users, Car, Eye, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const { cars, bookings, customers, updateBooking } = useAppContext();

  const totalCars = cars.length;
  const soldCars = cars.filter(c => c.status === 'Sold').length;
  const availableCars = totalCars - soldCars;
  const totalViews = cars.reduce((acc, car) => acc + car.views, 0);
  const totalBookings = bookings.length;
  
  // Calculate conversion rate (Bookings / Views)
  const conversionRate = totalViews > 0 ? ((totalBookings / totalViews) * 100).toFixed(2) : '0.00';

  // Popular Brands
  const brandCounts = cars.reduce((acc, car) => {
    acc[car.brand] = (acc[car.brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const popularBrands = Object.entries(brandCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 4);

  // Recent Bookings - Sort by date and time descending
  const recentBookings = [...bookings]
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-zinc-400">Welcome back. Here's what's happening with your dealership today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-1">Total Bookings</p>
              <h3 className="text-3xl font-bold text-white">{totalBookings}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-emerald-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% from last month
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-1">Total Views</p>
              <h3 className="text-3xl font-bold text-white">{totalViews.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <Eye className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-blue-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +5% from last month
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-1">Conversion Rate</p>
              <h3 className="text-3xl font-bold text-white">{conversionRate}%</h3>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-zinc-500">Bookings per view</p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-1">Available Cars</p>
              <h3 className="text-3xl font-bold text-white">{availableCars}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
              <Car className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-zinc-500">{soldCars} cars sold total</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Recent Bookings</h3>
            <button className="text-sm text-emerald-500 hover:text-emerald-400 font-medium">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950/50 text-zinc-400 text-sm">
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Vehicle</th>
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-zinc-800">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white">{booking.name}</div>
                      <div className="text-zinc-500 text-xs">{booking.mobile}</div>
                    </td>
                    <td className="p-4 text-zinc-300">{booking.carName}</td>
                    <td className="p-4 text-zinc-300">
                      {booking.date} <span className="text-zinc-500">at</span> {booking.time}
                    </td>
                    <td className="p-4">
                      <select
                        value={booking.status}
                        onChange={(e) => updateBooking({ ...booking, status: e.target.value as any })}
                        className={`appearance-none outline-none cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                          booking.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                          booking.status === 'Sold' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                          'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        }`}
                      >
                        <option value="Pending" className="bg-zinc-900 text-white">Pending</option>
                        <option value="Confirmed" className="bg-zinc-900 text-white">Confirmed</option>
                        <option value="Sold" className="bg-zinc-900 text-white">Sold</option>
                        <option value="Cancelled" className="bg-zinc-900 text-white">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-zinc-500">No recent bookings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Brands & Most Viewed */}
        <div className="space-y-8">
          
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-lg p-6">
            <h3 className="text-lg font-bold text-white mb-6">Popular Brands</h3>
            <div className="space-y-4">
              {popularBrands.map(([brand, count], index) => (
                <div key={brand} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                      {index + 1}
                    </div>
                    <span className="text-zinc-300 font-medium">{brand}</span>
                  </div>
                  <span className="text-white font-bold">{count} <span className="text-zinc-500 text-xs font-normal">cars</span></span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-lg p-6">
            <h3 className="text-lg font-bold text-white mb-6">Most Viewed Cars</h3>
            <div className="space-y-4">
              {[...cars].sort((a, b) => b.views - a.views).slice(0, 3).map((car) => (
                <div key={car.id} className="flex items-center gap-4">
                  <img src={car.mainImage} alt={car.name} className="w-16 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{car.brand} {car.name}</p>
                    <p className="text-xs text-zinc-500">{car.views.toLocaleString()} views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
