import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { 
  Home, 
  Users, 
  Building2, 
  Clock, 
  History, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Bell, 
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SidebarLink = ({ to, icon: Icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
      isActive 
        ? "bg-primary text-white shadow-lg shadow-primary/20" 
        : "text-muted-foreground hover:bg-white/5 hover:text-white"
    )}
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    <span className="flex-grow">{children}</span>
    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
  </NavLink>
);

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const navLinks = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/leads', icon: Users, label: 'Leads' },
    { to: '/properties', icon: Building2, label: 'Properties' },
    { to: '/activities', icon: Clock, label: 'Activities' },
    { to: '/audit-logs', icon: History, label: 'Audit Logs', roles: ['admin', 'superadmin'] },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-[#0d0d0d] border-r border-white/5 flex flex-col z-50 transition-transform duration-300 lg:static lg:translate-x-0",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Home className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">RealEstate CRM</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-4 mb-3 mt-4">Main Menu</p>
          {navLinks.map((link) => (
            (!link.roles || link.roles.includes(user?.role)) && (
              <SidebarLink key={link.to} to={link.to} icon={link.icon} onClick={() => setSidebarOpen(false)}>
                {link.label}
              </SidebarLink>
            )
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-[#141414] rounded-2xl p-4 border border-white/5 flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center border border-white/10 overflow-hidden">
               <UserIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate capitalize">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-[#0a0a0a]/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 lg:px-10 z-30">
          <button 
            className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex items-center flex-1 max-w-md ml-4">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="w-full bg-[#141414] border border-white/10 rounded-xl py-2 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2.5 hover:bg-white/5 rounded-xl transition-colors relative border border-white/5">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-[#0a0a0a]"></span>
            </button>
            <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
            <div className="flex items-center gap-2 px-2 hover:bg-white/5 rounded-xl py-1.5 transition-colors cursor-pointer border border-transparent">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-[10px] font-bold">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
