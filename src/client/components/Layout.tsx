import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Search, PlusCircle, LayoutDashboard, LogOut, Bell } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">
      <header className="glass sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-primary-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-display font-bold text-gray-900 tracking-tight">RentFinder</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {profile?.role === "tenant" && (
                <>
                  <NavLink to="/search" icon={<Search className="w-4 h-4" />} label="Find Homes" />
                  <NavLink to="/recommendations" label="For You" />
                </>
              )}
              {profile?.role === "owner" && (
                <>
                  <NavLink to="/owner/listings" icon={<LayoutDashboard className="w-4 h-4" />} label="My Dashboard" />
                  <NavLink to="/owner/request" icon={<PlusCircle className="w-4 h-4" />} label="Assistance" />
                </>
              )}
              {profile?.role === "admin" && (
                <NavLink to="/admin" icon={<LayoutDashboard className="w-4 h-4" />} label="Admin Console" />
              )}
            </nav>

            <div className="flex items-center gap-5">
              {profile ? (
                <>
                  <button className="p-2.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-white"></span>
                  </button>
                  <div className="flex items-center gap-4 pl-5 border-l border-gray-200">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold text-gray-900 leading-none mb-1">{profile.displayName}</p>
                      <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">{profile.role}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-600 transition-all duration-300 shadow-lg shadow-gray-200"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 opacity-50 grayscale">
              <Home className="w-5 h-5" />
              <span className="text-lg font-display font-bold">RentFinder</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Contact Support</a>
            </div>
            <p className="text-sm text-gray-400">
              &copy; 2026 RentFinder. Crafted for modern living.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const NavLink: React.FC<{ to: string; label: string; icon?: React.ReactNode }> = ({ to, label, icon }) => (
  <Link 
    to={to} 
    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors relative group py-2"
  >
    {icon}
    {label}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
  </Link>
);
