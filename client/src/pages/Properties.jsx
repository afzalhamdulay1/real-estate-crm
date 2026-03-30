import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProperties } from '../features/properties/propertySlice';
import {
  Building2,
  Search,
  Plus,
  MapPin,
  Bed,
  Bath,
  Square,
  ArrowRight,
  Filter,
  DollarSign,
  ArrowUp,
  Loader2,
  AlertCircle
} from 'lucide-react';
import PropertyModal from '../components/PropertyModal';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'react-hot-toast';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const PropertyCard = ({ property }) => {
  const { title, price, location, beds, baths, area, status, type } = property;

  return (
    <div className="glass-card group overflow-hidden hover:scale-[1.01] transition-all duration-500 flex flex-col h-full cursor-pointer relative border-white/5 hover:border-primary/20">
      {/* Property Image Placeholder */}
      <div className="h-56 bg-gradient-to-tr from-white/5 to-[#111] flex items-center justify-center relative overflow-hidden group">
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-2xl font-black text-xs border border-white/10 text-white shadow-2xl flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-primary" /> {price?.toLocaleString()}
        </div>
        <div className={cn(
          "absolute top-4 left-4 px-3 py-1.5 rounded-xl border font-black text-[9px] uppercase tracking-widest shadow-lg",
          status === 'Available' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
        )}>
          {status}
        </div>
        <div className="flex flex-col items-center gap-3 opacity-20 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700">
          <Building2 className="w-16 h-16 text-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">{type}</p>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 space-y-4">
        <div className="space-y-1.5 flex-1">
          <h3 className="font-black text-lg leading-tight group-hover:text-primary transition-colors tracking-tight text-white uppercase">{title}</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium leading-relaxed">
            <MapPin className="w-3.5 h-3.5 text-primary" /> {location.address}, {location.city}
          </p>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-white/5">
          <div className="flex gap-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            <span className="flex items-center gap-2 group-hover:text-white transition-colors">
              <Bed className="w-4 h-4 text-primary" /> {beds} Bed
            </span>
            <span className="flex items-center gap-2 group-hover:text-white transition-colors">
              <Bath className="w-4 h-4 text-primary" /> {baths} Bath
            </span>
            <span className="flex items-center gap-2 group-hover:text-white transition-colors">
              <Square className="w-4 h-4 text-primary" /> {area}
            </span>
          </div>
        </div>

        <button
          onClick={() => toast('Feature coming soon!', { icon: '🚀' })}
          className="w-full bg-white/5 group-hover:bg-primary text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl transition-all border border-white/5 flex items-center justify-center gap-3 mt-4 shadow-xl active:scale-[0.98]"
        >
          View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const Properties = () => {
  const [searchParams] = useSearchParams();
  const querySearch = searchParams.get('search') || '';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [isDebouncing, setIsDebouncing] = useState(false); // NEW: Track the search gap
  const dispatch = useDispatch();
  const { properties, isLoading, isError, message } = useSelector((state) => state.properties);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (querySearch) {
      setSearchTerm(querySearch);
    }
  }, [querySearch]);

  useEffect(() => {
    setIsDebouncing(true); // Start "loading" state immediately when typing
    const timer = setTimeout(() => {
      dispatch(getProperties(searchTerm)).then(() => setIsDebouncing(false));
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch, searchTerm]);

  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');
  const showSkeleton = isLoading || isDebouncing;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-[10px] uppercase">
            <Building2 className="w-3.5 h-3.5" /> High-Value Inventory
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white leading-tight uppercase">Real Estate Portfolio</h1>
          <p className="text-muted-foreground font-medium text-sm">Browse, manage, and curate high-performing asset listings.</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/30 transition-all flex items-center gap-3 group active:scale-[0.98] border border-white/20 hover:border-white/40"
          >
            <div className="bg-white/20 p-1.5 rounded-xl group-hover:rotate-90 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span>Post New Listing</span>
          </button>
        )}
      </div>

      <div className="flex flex-col xl:flex-row items-center gap-4">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by title, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0d0d0d] border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner font-medium"
          />
        </div>
        <div className="flex items-center gap-3 w-full xl:w-auto">
          <button
            onClick={() => toast('Feature coming soon!', { icon: '🚀' })}
            className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-3.5 hover:bg-white/5 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <Filter className="w-4 h-4 text-primary" /> Filters
          </button>
          <button
            onClick={() => toast('Feature coming soon!', { icon: '🚀' })}
            className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest transition-all text-white shadow-lg shadow-indigo-600/20"
          >
            <ArrowUp className="w-4 h-4 rotate-45" /> Map View
          </button>
        </div>
      </div>

      {showSkeleton ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6 opacity-80">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse"></p>
        </div>
      ) : isError ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-3xl p-16 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <p className="text-destructive font-bold">{message}</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-[#0d0d0d] border border-white/5 rounded-[2rem] p-24 text-center space-y-6">
          <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto border border-white/5">
            <Building2 className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <div>
            <p className="text-2xl font-black text-white uppercase tracking-tight">Portfolio Empty</p>
            <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto font-medium">No properties are currently listed. Use the action button above to list a new property.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {properties.map((prop) => (
            <PropertyCard key={prop._id} property={prop} />
          ))}
        </div>
      )}

      <PropertyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Properties;
