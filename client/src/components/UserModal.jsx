import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, resetUsers } from '../features/users/userSlice';
import { toast } from 'react-hot-toast';
import { X, Loader2, User, Mail, Shield, Lock, UserPlus, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'agent']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const UserModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'agent',
    }
  });

  const selectedRole = watch('role');
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.users);

  React.useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && isOpen) {
      toast.success('New team member added!');
      reset();
      onClose();
    }
    dispatch(resetUsers());
  }, [isSuccess, isError, message, dispatch, onClose, reset, isOpen]);

  const onSubmit = (data) => {
    const { confirmPassword, ...userData } = data;
    dispatch(createUser(userData));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 animation-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-2xl" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#0d0d0d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden glass-card">
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-primary/20 rounded-[1.25rem] flex items-center justify-center border border-primary/20 group hover:rotate-6 transition-transform">
                <UserPlus className="text-primary w-6 h-6" />
             </div>
             <div>
                <h2 className="text-xl font-black tracking-tight text-white uppercase">Add Team Member</h2>
                <p className="text-[10px] text-muted-foreground font-black tracking-widest uppercase mt-0.5">Provision System Credentials</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-white/5 rounded-xl transition-all hover:rotate-90">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-muted-foreground ml-1 uppercase tracking-widest flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-primary" /> Full Identity
            </label>
            <input
              {...register('name')}
              placeholder="Ex. Michael Scott"
              className={cn(
                "w-full bg-white/5 border rounded-2xl py-3.5 px-5 text-sm focus:outline-none transition-all font-medium",
                errors.name ? "border-destructive/50 ring-2 ring-destructive/10" : "border-white/10 focus:ring-2 focus:ring-primary/40 focus:border-primary"
              )}
            />
            {errors.name && <p className="text-[10px] uppercase font-black text-destructive ml-2 tracking-widest">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-muted-foreground ml-1 uppercase tracking-widest flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-primary" /> System Email
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="michael@dundermifflin.com"
              className={cn(
                "w-full bg-white/5 border rounded-2xl py-3.5 px-5 text-sm focus:outline-none transition-all font-medium",
                errors.email ? "border-destructive/50 ring-2 ring-destructive/10" : "border-white/10 focus:ring-2 focus:ring-primary/40 focus:border-primary"
              )}
            />
            {errors.email && <p className="text-[10px] uppercase font-black text-destructive ml-2 tracking-widest">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground ml-1 uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-primary" /> Password
              </label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className={cn(
                  "w-full bg-white/5 border rounded-2xl py-3.5 px-5 text-sm focus:outline-none transition-all font-medium",
                  errors.password ? "border-destructive/50 ring-2 ring-destructive/10" : "border-white/10 focus:ring-2 focus:ring-primary/40 focus:border-primary"
                )}
              />
              {errors.password && <p className="text-[10px] uppercase font-black text-destructive ml-2 tracking-widest">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground ml-1 uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-primary" /> Confirm
              </label>
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                className={cn(
                  "w-full bg-white/5 border rounded-2xl py-3.5 px-5 text-sm focus:outline-none transition-all font-medium",
                  errors.confirmPassword ? "border-destructive/50 ring-2 ring-destructive/10" : "border-white/10 focus:ring-2 focus:ring-primary/40 focus:border-primary"
                )}
              />
              {errors.confirmPassword && <p className="text-[10px] uppercase font-black text-destructive ml-2 tracking-widest">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="space-y-3">
             <label className="text-xs font-black text-muted-foreground ml-1 uppercase tracking-widest flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-primary" /> Permission Level
            </label>
            <div className="flex gap-2">
              {[
                { val: 'agent', label: 'Agent', desc: 'Can manage data' },
                { val: 'admin', label: 'Admin', desc: 'Can manage users' }
              ].map((r) => (
                <label key={r.val} className="flex-1 cursor-pointer group">
                  <input type="radio" {...register('role')} value={r.val} className="sr-only" />
                  <div className={cn(
                    "w-full p-4 rounded-[1.25rem] border text-left transition-all duration-300 relative overflow-hidden",
                    selectedRole === r.val 
                      ? "bg-white/10 border-white text-white shadow-xl shadow-white/5 ring-1 ring-white/20" 
                      : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                  )}>
                    <div className="relative z-10 flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest">{r.label}</span>
                      <span className="text-[8px] font-bold opacity-50 uppercase tracking-widest">{r.desc}</span>
                    </div>
                    {selectedRole === r.val && (
                      <div className="absolute -right-2 -bottom-2 opacity-5">
                         <ShieldAlert className="w-16 h-16" />
                      </div>
                    )}
                  </div>
                </label>
              ))}
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
              className="flex-[2] bg-gradient-to-tr from-primary to-purple-600 hover:scale-[1.02] active:scale-[0.98] text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded-3xl shadow-2xl shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale font-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <div className="bg-white/20 p-1.5 rounded-xl">
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
              )}
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
