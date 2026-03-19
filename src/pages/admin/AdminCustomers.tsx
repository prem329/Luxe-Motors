import React from 'react';
import { Users, Mail, Phone, Calendar, Download } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const AdminCustomers: React.FC = () => {
  const { customers } = useAppContext();

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Registered At'];
    const rows = customers.map(c => [
      c.name,
      c.email,
      c.phone,
      c.registeredAt
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'customers.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Customer Database</h1>
          <p className="text-zinc-400">Manage your customer relationships and contact lists.</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 text-zinc-400 text-sm">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Contact Info</th>
                <th className="p-4 font-medium">Registered At</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-zinc-800">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="font-medium text-white">{customer.name}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Mail className="w-3 h-3 text-zinc-500" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Phone className="w-3 h-3 text-zinc-500" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(customer.registeredAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-emerald-500 hover:text-emerald-400 font-medium">View History</button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-500">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
