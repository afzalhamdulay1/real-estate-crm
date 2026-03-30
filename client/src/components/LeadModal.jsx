import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { createLead, resetLeads } from '../features/leads/leadSlice';
import { getUsers } from '../features/users/userSlice';
import { getProperties } from '../features/properties/propertySlice';
import { toast } from 'react-hot-toast';
import { X, Loader2, User, Mail, Phone, Tag, Building2, LayoutGrid, ShieldCheck } from 'lucide-react';
import SearchableSelect from './SearchableSelect';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const leadSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
  phone: z.string().min(10, { message: 'Phone must be at least 10 characters' }).optional().or(z.literal('')),
  source: z.enum(['Website', 'Referral', 'Walk-in', 'Other']),
  status: z.enum(['New', 'Contacted', 'Interested', 'Closed', 'Lost']),
  assignedTo: z.string().optional(),
  property: z.string().optional(),
});

const LeadModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      source: 'Website',
      status: 'New',
    }
  });

  const selectedStatus = watch('status');
  const dispatch = useDispatch();
  const { isLoading, isCreateSuccess, isError, message } = useSelector((state) => state.leads);
  const { users } = useSelector((state) => state.users);
  const { properties } = useSelector((state) => state.properties);

  const assignedToValue = watch('assignedTo');
  const propertyInterestValue = watch('property');
  
  const agentOptions = [
    { value: '', label: 'Unassigned' },
    ...users
      .filter(u => ['admin', 'superadmin', 'agent'].includes(u.role))
      .map(u => ({ value: u._id, label: `${u.name} (${u.role.toUpperCase()})` }))
  ];

  const propertyOptions = [
    { value: '', label: 'No Specific Property' },
    ...properties.map(p => ({ value: p._id, label: `${p.title} (${p.location?.city})` }))
  ];

  React.useEffect(() => {
    if (isOpen) {
      if (users.length === 0) dispatch(getUsers());
      if (properties.length === 0) dispatch(getProperties());
    }
  }, [isOpen, dispatch, users.length, properties.length]);

  React.useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isCreateSuccess) {
      toast.success('Lead created successfully!');
      reset();
      onClose();
    }
    dispatch(resetLeads());
  }, [isCreateSuccess, isError, message, dispatch, onClose, reset]);

  const onSubmit = (data) => {
    const filteredData = { ...data };
    if (!filteredData.email) delete filteredData.email;
    if (!filteredData.phone) delete filteredData.phone;
    if (!filteredData.assignedTo) delete filteredData.assignedTo;
    if (!filteredData.property) delete filteredData.property;
    
    dispatch(createLead(filteredData));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 animation-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-2xl" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-card">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <LayoutGrid className="text-primary w-5 h-5" />
             </div>
             <h2 className="text-xl font-bold tracking-tight">Create New Lead</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Full Name
              </label>
              <input
                {...register('name')}
                placeholder="Ex. Sarah Jessica"
                className={`w-full bg-white/5 border ${errors.name ? 'border-destructive' : 'border-white/10'} rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all`}
              />
              {errors.name && <p className="text-xs text-destructive ml-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="sarah@example.com"
                className={`w-full bg-white/5 border ${errors.email ? 'border-destructive' : 'border-white/10'} rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all`}
              />
              {errors.email && <p className="text-xs text-destructive ml-1">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Phone Number
              </label>
              <input
                {...register('phone')}
                placeholder="+1 (555) 001-2345"
                className={`w-full bg-white/5 border ${errors.phone ? 'border-destructive' : 'border-white/10'} rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all`}
              />
              {errors.phone && <p className="text-xs text-destructive ml-1">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Lead Source
              </label>
              <select
                {...register('source')}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none outline-none"
              >
                <option value="Website" className="bg-[#1a1a1a] text-white">Website</option>
                <option value="Referral" className="bg-[#1a1a1a] text-white">Referral</option>
                <option value="Walk-in" className="bg-[#1a1a1a] text-white">Walk-in</option>
                <option value="Other" className="bg-[#1a1a1a] text-white">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-50">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-1.5">
                Responsible Agent
              </label>
              <SearchableSelect
                options={agentOptions}
                value={assignedToValue || ''}
                onChange={(val) => setValue('assignedTo', val)}
                placeholder="Unassigned"
                searchPlaceholder="Search agents..."
                icon={<ShieldCheck className="w-3.5 h-3.5 text-primary/60" />}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-1.5">
                 Property Interest
              </label>
              <SearchableSelect
                options={propertyOptions}
                value={propertyInterestValue || ''}
                onChange={(val) => setValue('property', val)}
                placeholder="None"
                searchPlaceholder="Search listings..."
                icon={<Building2 className="w-3.5 h-3.5 text-primary/60" />}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {['New', 'Contacted', 'Interested', 'Closed', 'Lost'].map((s) => (
                <label key={s} className="relative group cursor-pointer block">
                  <input
                    type="radio"
                    {...register('status')}
                    value={s}
                    className="sr-only"
                  />
                  <div className={cn(
                    "w-full text-center py-3 px-1 text-[10px] font-black uppercase tracking-widest border rounded-xl transition-all duration-300",
                    selectedStatus === s 
                      ? "bg-white/10 border-2 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105 z-10" 
                      : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                  )}>
                    {s}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 rounded-xl transition-all border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] bg-gradient-to-tr from-primary to-purple-600 hover:scale-[1.02] active:scale-[0.98] text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded-2xl shadow-2xl shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <div className="bg-white/20 p-1 rounded-lg">
                  <LayoutGrid className="w-3 h-3 text-white" />
                </div>
              )}
              Create Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
