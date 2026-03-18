import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LogIn } from 'lucide-react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export const AdminRoute: React.FC = () => {
  const { user, isAdmin } = useAppContext();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
          <p className="text-zinc-400 mb-8">Please sign in to access the admin dashboard.</p>
          <button 
            onClick={handleLogin}
            className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-zinc-400 mb-8">You do not have permission to access this area.</p>
          <button 
            onClick={() => auth.signOut()}
            className="w-full py-3 bg-zinc-800 text-white rounded-xl font-bold hover:bg-zinc-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
