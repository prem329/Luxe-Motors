import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Car, MessageSquare, Settings, LogOut, Users } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAppContext();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Inventory', path: '/admin/inventory', icon: Car },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Broadcast', path: '/admin/broadcast', icon: MessageSquare },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row pb-16 md:pb-0">
      {/* Sidebar (Desktop) / Bottom Nav (Mobile) */}
      <aside className="fixed bottom-0 left-0 right-0 z-50 md:relative md:w-64 bg-zinc-900 border-t md:border-t-0 md:border-r border-zinc-800 flex flex-row md:flex-col">
        <div className="hidden md:block p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-emerald-500">ADMIN</span>PANEL
          </h2>
        </div>
        
        <nav className="flex-1 flex flex-row md:flex-col p-2 md:p-4 justify-around md:justify-start md:space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-xl font-medium transition-colors ${
                  isActive 
                    ? 'text-emerald-500 md:bg-emerald-500/10' 
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <Icon className="w-6 h-6 md:w-5 md:h-5" />
                <span className="text-[10px] md:text-base hidden md:block">{item.name}</span>
              </Link>
            );
          })}
          
          <button
            onClick={handleLogout}
            className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-xl font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors md:hidden"
          >
            <LogOut className="w-6 h-6 md:w-5 md:h-5" />
          </button>
        </nav>

        <div className="hidden md:block p-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-400 hover:bg-rose-500/10 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors w-full mt-2"
          >
            <Car className="w-5 h-5" />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-zinc-950 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};
