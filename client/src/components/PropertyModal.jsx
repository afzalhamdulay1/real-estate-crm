import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { createProperty, resetProperties } from '../features/properties/propertySlice';
import { toast } from 'react-hot-toast';
import { X, Loader2, Home, MapPin, DollarSign, Square, Tag, FileText, CheckCircle2, Bed, Bath, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const propertySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  type: z.enum(['Residential', 'Commercial']),
  price: z.preprocess((val) => Number(val), z.number().min(0, 'Price must be positive')),
  area: z.string().min(1, 'Area is required (e.g. 1200 sq.ft)'),
  beds: z.preprocess((val) => Number(val), z.number().min(0)),
  baths: z.preprocess((val) => Number(val), z.number().min(0)),
  location: z.object({
    city: z.string().min(1, 'City is required'),
    address: z.string().min(1, 'Address is required'),
  }),
  status: z.enum(['Available', 'Sold', 'Rented']),
});

const PropertyModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      type: 'Residential',
      status: 'Available',
    }
  });

  const selectedType = watch('type');
  const selectedStatus = watch('status');
  const dispatch = useDispatch();
  const { isLoading, isCreateSuccess, isError, message } = useSelector((state) => state.properties);
  const { user } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isCreateSuccess) {
      toast.success('Property listed successfully!');
      reset();
      onClose();
    }
    dispatch(resetProperties());
  }, [isCreateSuccess, isError, message, dispatch, onClose, reset]);

  const onSubmit = (data) => {
    const propertyData = {
      ...data,
      assignedAgent: user._id,
    };
    dispatch(createProperty(propertyData));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 animation-in fade-in duration-200 overflow-y-auto">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden glass-card my-8">
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/20 group hover:rotate-6 transition-transform">
                <Home className="text-primary w-6 h-6" />
             </div>
             <div>
                <h2 className="text-xl font-black tracking-tight text-white uppercase">List New Property</h2>
                <p className="text-[10px] text-muted-foreground font-black tracking-widest uppercase mt-0.5">Commercial & Residential Portfolio</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-white/5 rounded-xl transition-all hover:rotate-90">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="space-y-2 col-span-2">
              <label className="text-xs font-black text-muted-foreground ml-1 uppercase tracking-[0.15em] flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-primary" /> Property Title
              </label>
              <input
                {...register('title')}
                placeholder="e.g. Luxury Penthouse at Skyline Towers"
                className={cn(
                  "w-full bg-white/5 border rounded-2xl py-3.5 px-5 text-sm focus:outline-none transition-all font-medium",
                  errors.title ? "border-destructive/50 ring-2 ring-destructive/10" : "border-white/10 focus:ring-2 focus:ring-primary/40 focus:border-primary"
                )}
              />
              {errors.title && <p className="text-[10px] uppercase font-black text-destructive ml-2 tracking-wider">{errors.title.message}</p>}
            </div>

            {/* Type & Status Selectors */}
            <div className="space-y-2">
               <label className="text-xs font-black text-muted-foreground ml-1 uppercase tracking-[0.15em] flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-primary" /> Category
              </label>
              <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                {['Residential', 'Commercial'].map((t) => (
                  <label key={t} className="flex-1 cursor-pointer">
                    <input type="radio" {...register('type')} value={t} className="sr-only" />
                    <div className={cn(
                      "w-full text-center py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                      selectedType === t 
                        ? "bg-white/10 border-white text-white shadow-lg z-10" 
                        : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                    )}>
                      {t}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-black text-muted-foreground ml-1 uppercase tracking-[0.15em] flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Market Status
              </label>
              <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                {['Available', 'Sold', 'Rented'].map((s) => (
                  <label key={s} className="flex-1 cursor-pointer">
                    <input type="radio" {...register('status')} value={s} className="sr-only" />
                    <div className={cn(
                      "w-full text-center py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                      selectedStatus === s 
                        ? "bg-white/10 border-white text-white shadow-lg z-10" 
                        : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                    )}>
                      {s}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Price & Area */}
            <div className="space-y-2">
               <label className="text-xs font-black text-muted-foreground ml-1 uppercase tracking-[0.15em] flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-primary" /> Asking Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">$</span>
                <input
                  type="number"
                  {...register('price')}
                  placeholder="0.00"
                  className={cn(
                    "w-full bg-white/5 border rounded-2xl py-3.5 pl-10 pr-5 text-sm focus:outline-none transition-all font-medium",
                    errors.price ? "border-destructive/50 ring-2 ring-destructive/10" : "border-white/10 focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  )}
                />
              </div>
              {errors.price && <p className="text-[10px] uppercase font-black text-destructive ml-2 tracking-wider">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
               <label className="text-xs font-black text-muted-foreground ml-1 uppercase tracking-[0.15em] flex items-center gap-2">
                <Square className="w-3.5 h-3.5 text-primary" /> Size / Area
              </label>
              <input
                {...register('area')}
                placeholder="e.g. 1500 sq.ft"
                className={cn(
                  "w-full bg-white/5 border rounded-2xl py-3.5 px-5 text-sm focus:outline-none transition-all font-medium",
                  errors.area ? "border-destructive/50 ring-2 ring-destructive/10" : "border-white/10 focus:ring-2 focus:ring-primary/40 focus:border-primary"
                )}
              />
              {errors.area && <p className="text-[10px] uppercase font-black text-destructive ml-2 tracking-wider">{errors.area.message}</p>}
            </div>

            {/* Beds & Baths */}
            <div className="space-y-2">
               <label className="text-xs font-black text-muted-foreground ml-1 uppercase tracking-[0.15em] flex items-center gap-2">
                <Bed className="w-3.5 h-3.5 text-primary" /> Bedrooms
              </label>
              <input
                type="number"
                {...register('beds')}
                defaultValue={0}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-black text-muted-foreground ml-1 uppercase tracking-[0.15em] flex items-center gap-2">
                <Bath className="w-3.5 h-3.5 text-primary" /> Bathrooms
              </label>
              <input
                type="number"
                {...register('baths')}
                defaultValue={0}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-medium"
              />
            </div>

            {/* Location (City & Address) */}
            <div className="space-y-2">
               <label className="text-xs font-black text-muted-foreground ml-1 uppercase tracking-[0.15em] flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary" /> City
              </label>
              <input
                {...register('location.city')}
                placeholder="New York"
                className={cn(
                  "w-full bg-white/5 border rounded-2xl py-3.5 px-5 text-sm focus:outline-none transition-all font-medium",
                  errors.location?.city ? "border-destructive/50 ring-2 ring-destructive/10" : "border-white/10 focus:ring-2 focus:ring-primary/40 focus:border-primary"
                )}
              />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-black text-muted-foreground ml-1 uppercase tracking-[0.15em] flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary" /> Full Address
              </label>
              <input
                {...register('location.address')}
                placeholder="123 Avenue, Suite 405"
                className={cn(
                  "w-full bg-white/5 border rounded-2xl py-3.5 px-5 text-sm focus:outline-none transition-all font-medium",
                  errors.location?.address? "border-destructive/50 ring-2 ring-destructive/10" : "border-white/10 focus:ring-2 focus:ring-primary/40 focus:border-primary"
                )}
              />
            </div>

            {/* Description */}
            <div className="space-y-2 col-span-2">
              <label className="text-xs font-black text-muted-foreground ml-1 uppercase tracking-[0.15em] flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-primary" /> Detailed Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Marketing description and key selling points..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-medium resize-none"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded-2xl border border-white/10 transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] bg-gradient-to-tr from-primary to-purple-600 hover:scale-[1.02] active:scale-[0.98] text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded-3xl shadow-2xl shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <div className="bg-white/20 p-1.5 rounded-xl">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              )}
              Publish Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyModal;
