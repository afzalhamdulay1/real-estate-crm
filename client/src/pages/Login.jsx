import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { login, reset } from '../features/auth/authSlice';
import { Mail, Lock, Loader2, Home } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate('/');
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (data) => {
    dispatch(login(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden selection:bg-primary/30 selection:text-primary-foreground">
      {/* Immersive Background Orchestration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[140px] opacity-40 animate-pulse transition-all duration-[5000ms]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[140px] opacity-30 animate-pulse delay-1000 transition-all duration-[5000ms]" />
        <div className="absolute inset-0 grain opacity-[0.03] mix-blend-overlay pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        {/* Main Authentication Card */}
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 md:p-12 shadow-2xl shadow-black/50 relative overflow-hidden group">
          {/* Subtle Inner Glow */}
          <div className="absolute -inset-px bg-gradient-to-br from-white/10 to-transparent rounded-[2.5rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative z-10">
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-primary/40 group-hover:scale-110 transition-transform duration-500">
                <Home className="text-white w-10 h-10" />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter leading-none mb-3 italic">
                RealEstate <span className="text-primary not-italic">CRM</span>
              </h1>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.25em]">Authorized Access Only</p>
            </div>

            {/* Demo Credentials Module */}
            <div className="mb-10 p-5 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-3 animate-in fade-in slide-in-from-top-4 duration-1000 delay-300">
              <div className="flex items-center gap-3 px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 text-center text-red-500">Use Admin username and password to login</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center bg-white/[0.02] p-3 rounded-xl border border-white/5 hover:border-primary/20 transition-colors">
                  <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Login ID</span>
                  <span className="text-[10px] font-black text-primary tracking-wider">admin1@gmail.com</span>
                </div>
                <div className="flex justify-between items-center bg-white/[0.02] p-3 rounded-xl border border-white/5 hover:border-primary/20 transition-colors">
                  <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Password</span>
                  <span className="text-[10px] font-black text-white tracking-widest">123456</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Logic Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within/input:text-primary transition-colors" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="agent@metropolis.crm"
                    className={`w-full bg-white/[0.02] border ${errors.email ? 'border-destructive/50' : 'border-white/5'} rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 focus:bg-white/[0.04] transition-all duration-300 font-medium`}
                  />
                </div>
                {errors.email && <p className="text-[10px] font-bold text-destructive/80 mt-1 ml-1 uppercase tracking-wider">{errors.email.message}</p>}
              </div>

              {/* Password Logic Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</label>
                </div>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within/input:text-primary transition-colors" />
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••••••"
                    className={`w-full bg-white/[0.02] border ${errors.password ? 'border-destructive/50' : 'border-white/5'} rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 focus:bg-white/[0.04] transition-all duration-300 font-medium`}
                  />
                </div>
                {errors.password && <p className="text-[10px] font-bold text-destructive/80 mt-1 ml-1 uppercase tracking-wider">{errors.password.message}</p>}
              </div>

              {/* Prime Action Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group/btn"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-30 group-hover/btn:opacity-60 transition duration-1000 group-hover/btn:duration-200" />
                  <div className="relative flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-[0.3em] py-5 rounded-2xl shadow-xl transition-all duration-300 group-hover/btn:scale-[1.02] active:scale-[0.98] disabled:opacity-50 border border-white/10 overflow-hidden">
                    {/* Radial Shine Highlight */}
                    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:left-[100%] transition-all duration-1000" />

                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>Sign In</>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Login;
