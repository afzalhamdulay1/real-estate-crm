import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { createActivity, resetActivities } from '../features/activities/activitySlice';
import { getLeads } from '../features/leads/leadSlice';
import { toast } from 'react-hot-toast';
import { X, Loader2, User, Tag, FileText, Calendar, CheckCircle2 } from 'lucide-react';
import SearchableSelect from './SearchableSelect';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const activitySchema = z.object({
  lead: z.string().min(1, { message: 'Please select a lead' }),
  type: z.enum(['Call', 'Email', 'Meeting', 'Site Visit', 'Other']),
  status: z.enum(['Pending', 'Completed', 'Follow-up']),
  notes: z.string().min(5, { message: 'Notes must be at least 5 characters' }),
  date: z.string().optional(),
});

const ActivityModal = ({ isOpen, onClose, selectedLeadId = '' }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      lead: selectedLeadId,
      type: 'Call',
      status: 'Completed',
    }
  });

  const selectedType = watch('type');
  const selectedStatus = watch('status');
  const currentLeadId = watch('lead');
  const dispatch = useDispatch();
  
  const { leads } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isCreateSuccess, isError, message } = useSelector((state) => state.activities);

  React.useEffect(() => {
    if (isOpen && !selectedLeadId) {
      dispatch(getLeads());
    }
  }, [isOpen, selectedLeadId, dispatch]);

  const leadOptions = [
    { value: '', label: '-- Choose a lead --' },
    ...leads.map(l => ({ value: l._id, label: `${l.name} (${l.property?.title || 'No Property'})` }))
  ];

  React.useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isCreateSuccess) {
      toast.success('Activity logged successfully!');
      reset();
      onClose();
    }
    dispatch(resetActivities());
  }, [isCreateSuccess, isError, message, dispatch, onClose, reset]);

  const onSubmit = (data) => {
    const activityData = {
      ...data,
      agent: user._id,
      date: data.date || new Date().toISOString(),
    };
    dispatch(createActivity(activityData));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 animation-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-card">
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Calendar className="text-primary w-5 h-5" />
             </div>
             <h2 className="text-xl font-bold tracking-tight">Log New Activity</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Lead Selection */}
          <div className="space-y-2 relative z-50">
            <label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-1.5">
               Select Lead
            </label>
            <SearchableSelect
              options={leadOptions}
              value={currentLeadId || ''}
              onChange={(val) => setValue('lead', val)}
              placeholder="-- Choose a lead --"
              icon={<User className="w-3.5 h-3.5 text-primary/60" />}
            />
            {errors.lead && <p className="text-xs text-destructive ml-1">{errors.lead.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Type */}
            <div className="space-y-2 col-span-2">
               <label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Activity Type
              </label>
              <div className="flex flex-wrap gap-2">
                {['Call', 'Email', 'Meeting', 'Site Visit', 'Other'].map((t) => (
                  <label key={t} className="cursor-pointer">
                    <input type="radio" {...register('type')} value={t} className="sr-only" />
                    <div className={cn(
                      "px-4 py-2.5 rounded-xl text-xs font-bold transition-all border",
                      selectedType === t 
                        ? "bg-primary/20 border-primary text-primary shadow-lg shadow-primary/20 ring-1 ring-primary" 
                        : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
                    )}>
                      {t}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2 col-span-2">
               <label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Activity Status
              </label>
              <div className="flex gap-2">
                {['Pending', 'Completed', 'Follow-up'].map((s) => {
                  const isSelected = selectedStatus === s;
                  
                  // Dynamic styles based on specific status to give instant visual cues
                  let activeClass = "";
                  let hoverClass = "";
                  if (s === 'Pending') {
                    activeClass = "bg-amber-500/20 border-amber-500 text-amber-500 shadow-amber-500/20 ring-1 ring-amber-500";
                    hoverClass = "hover:bg-amber-500/10 hover:text-amber-500";
                  } else if (s === 'Completed') {
                    activeClass = "bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-emerald-500/20 ring-1 ring-emerald-500";
                    hoverClass = "hover:bg-emerald-500/10 hover:text-emerald-500";
                  } else {
                    activeClass = "bg-primary/20 border-primary text-primary shadow-primary/20 ring-1 ring-primary";
                    hoverClass = "hover:bg-primary/10 hover:text-primary";
                  }

                  return (
                    <label key={s} className="flex-1 cursor-pointer">
                      <input type="radio" {...register('status')} value={s} className="sr-only" />
                      <div className={cn(
                        "w-full text-center py-2.5 rounded-xl text-xs font-bold transition-all border",
                        isSelected 
                          ? activeClass 
                          : `bg-white/5 border-white/5 text-muted-foreground ${hoverClass}`
                      )}>
                        {s}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Notes / Details
            </label>
            <textarea
              {...register('notes')}
              rows={4}
              placeholder="Provide a detailed summary of the activity..."
              className={cn(
                "w-full bg-white/5 border rounded-xl py-2.5 px-4 text-sm focus:outline-none transition-all resize-none",
                errors.notes ? "border-destructive" : "border-white/10 focus:ring-2 focus:ring-primary/50 focus:border-primary"
              )}
            />
            {errors.notes && <p className="text-xs text-destructive ml-1">{errors.notes.message}</p>}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/[0.03] hover:bg-white/[0.08] text-white/70 hover:text-white font-bold py-4 text-xs rounded-2xl transition-all border border-white/5 hover:border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl shadow-xl shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-white/20 hover:border-white/40 group"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />}
              Save Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityModal;
