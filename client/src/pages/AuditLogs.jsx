import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAuditLogs } from '../features/audit/auditSlice';
import { 
  History, 
  Search, 
  Filter, 
  User, 
  Database, 
  Type, 
  Clock, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const AuditLogs = () => {
  const dispatch = useDispatch();
  const { logs, isLoading, isError, message } = useSelector((state) => state.audit);

  React.useEffect(() => {
    dispatch(getAuditLogs());
  }, [dispatch]);

  const actionColors = {
    CREATE: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    UPDATE: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    DELETE: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  };

  const moduleIcons = {
    LEAD: <User className="w-3.5 h-3.5" />,
    PROPERTY: <Database className="w-3.5 h-3.5" />,
    ACTIVITY: <Clock className="w-3.5 h-3.5" />,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
         <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-[10px] uppercase">
            <ShieldCheck className="w-3.5 h-3.5" /> System Integrity
         </div>
         <h1 className="text-4xl font-black tracking-tight text-white">Audit Logs</h1>
         <p className="text-muted-foreground text-sm font-medium">Complete immutable history of every data change in the system.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2 bg-[#0d0d0d] border border-white/5 rounded-2xl">
         <div className="md:col-span-2 relative group">
            <Search className="absolute left-3.5 top-2.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search by User or ID..." 
              className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-medium"
            />
         </div>
         <select className="bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-muted-foreground">
           <option>All Modules</option>
           <option>LEAD</option>
           <option>PROPERTY</option>
           <option>ACTIVITY</option>
         </select>
         <select className="bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-muted-foreground">
           <option>All Actions</option>
           <option>CREATE</option>
           <option>UPDATE</option>
           <option>DELETE</option>
         </select>
      </div>

      <div className="glass-card overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 bg-white/[0.02]">
                <th className="px-6 py-5 text-left">Timestamp</th>
                <th className="px-6 py-5 text-left">User</th>
                <th className="px-6 py-5 text-left">Action</th>
                <th className="px-6 py-5 text-left">Module</th>
                <th className="px-6 py-5 text-left">Changes / ID</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                   <td colSpan="5" className="py-20 text-center">
                      <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                   </td>
                </tr>
              ) : isError ? (
                <tr>
                   <td colSpan="5" className="py-20 text-center text-destructive font-bold text-sm">
                      {message}
                   </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                   <td colSpan="5" className="py-20 text-center text-muted-foreground text-sm font-medium">
                      No audit logs found.
                   </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium text-gray-300">{formatDate(log.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                             {log.user?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white leading-none">{log.user?.name}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{log.user?.role}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className={cn(
                         "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                         actionColors[log.action]
                       )}>
                         {log.action}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                          {moduleIcons[log.module]}
                          {log.module}
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-3">
                          <code className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded border border-white/5 text-muted-foreground">
                            {log.documentId.substring(0, 10)}...
                          </code>
                          <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
