import React from 'react';
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
  ArrowUp
} from 'lucide-react';

const PropertyCard = ({ id, price, location, description, beds, baths, area }) => (
  <div className="glass-card group overflow-hidden hover:scale-[1.01] transition-all duration-300 flex flex-col h-full cursor-pointer relative group">
    {/* Property Image Placeholder */}
    <div className="h-60 bg-gradient-to-tr from-white/5 to-white/10 flex items-center justify-center relative overflow-hidden group">
       <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl font-bold text-sm border border-white/10 text-white shadow-xl flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> {price}
       </div>
       <div className="absolute bottom-4 left-4 bg-primary/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-primary/20 font-bold text-[10px] text-primary uppercase tracking-widest translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
          Newly Listed
       </div>
       <div className="flex flex-col items-center gap-2 opacity-20 group-hover:opacity-40 transition-opacity">
          <Building2 className="w-16 h-16" />
          <p className="text-[10px] font-bold uppercase tracking-widest">Premium Listing #{id}</p>
       </div>
    </div>
    
    <div className="p-6 flex flex-col flex-1 space-y-4">
      <div className="space-y-1.5 flex-1">
        <h3 className="font-extrabold text-xl leading-tight group-hover:text-primary transition-colors tracking-tight">Luxury Minimalist Residence {id}</h3>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium leading-relaxed">
           <MapPin className="w-3 h-3 text-rose-500" /> {location}
        </p>
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-white/5">
         <div className="flex gap-6 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <span className="flex items-center gap-1.5 group-hover:text-white transition-colors">
               <Bed className="w-4 h-4 text-primary/60" /> {beds} Bed
            </span>
            <span className="flex items-center gap-1.5 group-hover:text-white transition-colors">
               <Bath className="w-4 h-4 text-primary/60" /> {baths} Bath
            </span>
            <span className="flex items-center gap-1.5 group-hover:text-white transition-colors">
               <Square className="w-4 h-4 text-primary/60" /> {area} <span className="text-[8px] font-normal lowercase tracking-normal">sqft</span>
            </span>
         </div>
      </div>
      
      <button className="w-full bg-white/5 group-hover:bg-primary/95 text-white font-bold py-3.5 rounded-xl transition-all border border-white/5 flex items-center justify-center gap-2 text-sm mt-4 shadow-xl active:scale-x-[0.98]">
         View Full Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);

const Properties = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold tracking-tight">Real Estate Inventory</h1>
          <p className="text-muted-foreground font-medium">Browse, manage, and curate high-performing asset listings.</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-black shadow-2xl shadow-primary/30 transition-all flex items-center gap-2 group active:scale-[0.98]">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span>Post New Listing</span>
        </button>
      </div>

      <div className="flex flex-col xl:flex-row items-center gap-4">
        <div className="relative flex-1 group w-full">
           <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
           <input 
             type="text" 
             placeholder="Search by area, property type, or ID..." 
             className="w-full bg-[#111111] border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner"
           />
        </div>
        <div className="flex items-center gap-3 w-full xl:w-auto">
           <button className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-3.5 hover:bg-white/10 rounded-2xl border border-white/5 text-sm font-bold transition-all shadow-lg">
              <Filter className="w-4 h-4" /> Filters
           </button>
           <button className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 rounded-2xl border border-white/5 text-sm font-bold transition-all shadow-lg text-white">
              <ArrowUp className="w-4 h-4 rotate-45" /> Map View
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {[
          { id: 1, price: '450,000', location: '123 Luxury Ave, Beverly Hills, CA', beds: 3, baths: 2, area: 1200 },
          { id: 2, price: '890,000', location: '56 Ocean Drive, Miami Beach, FL', beds: 4, baths: 3, area: 2450 },
          { id: 3, price: '1.25M', location: '78 Skyline Blvd, Manhattan, NY', beds: 2, baths: 2, area: 1650 },
          { id: 4, price: '320,000', location: '15 Maple Street, Portland, OR', beds: 2, baths: 1, area: 950 },
          { id: 5, price: '2.10M', location: '99 Canyon Road, Aspen, CO', beds: 5, baths: 4, area: 4200 },
          { id: 6, price: '540,000', location: '42 Sunset Strip, Austin, TX', beds: 3, baths: 2, area: 1800 },
        ].map((prop) => (
          <PropertyCard key={prop.id} {...prop} />
        ))}
      </div>
    </div>
  );
};

export default Properties;
