import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, updateUserRole, deleteUser, resetUsers } from '../features/users/userSlice';
import { 
  Users as UsersIcon, 
  Search, 
  ShieldCheck, 
  UserPlus, 
  MoreHorizontal, 
  Trash2, 
  Shield, 
  User, 
  Mail, 
  Calendar,
  Lock,
  ChevronDown,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import UserModal from '../components/UserModal';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  
  const { users, isLoading, isError, message } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleRoleChange = (id, newRole) => {
    dispatch(updateUserRole({ id, role: newRole })).then((res) => {
      if (!res.error) toast.success('User role updated');
      else toast.error(res.payload);
    });
  };

  const handleDeleteUser = (id) => {
    dispatch(deleteUser(id)).then((res) => {
      if (!res.error) {
        toast.success('User removed from system');
        setDeleteConfirmId(null);
      } else {
        toast.error(res.payload);
      }
    });
  };

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleStyle = (role) => {
    switch (role) {
      case 'superadmin': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'admin': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'agent': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-[10px] uppercase">
            <ShieldCheck className="w-3.5 h-3.5" /> Access Management
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white leading-tight uppercase">User Directory</h1>
          <p className="text-muted-foreground font-medium text-sm">Manage organizational roles and system permissions.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/30 transition-all flex items-center gap-3 group active:scale-[0.98] border border-white/20 hover:border-white/40"
        >
           <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-12 transition-transform">
              <UserPlus className="w-4 h-4 text-white" />
           </div>
           <span>Invite Member</span>
        </button>
      </div>

      <div className="bg-[#0d0d0d] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, email or role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#141414] border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
             <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                {users.length} Total Users
             </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#141414] text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 border-b border-white/5">
                <th className="px-8 py-6">Member Identity</th>
                <th className="px-8 py-6">Role / Level</th>
                <th className="px-8 py-6">Join Date</th>
                <th className="px-8 py-6 text-right pr-12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading && users.length === 0 ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-8"><div className="h-12 w-48 bg-white/5 rounded-2xl"></div></td>
                    <td className="px-8 py-8"><div className="h-8 w-24 bg-white/5 rounded-xl"></div></td>
                    <td className="px-8 py-8"><div className="h-8 w-32 bg-white/5 rounded-xl"></div></td>
                    <td className="px-8 py-8"><div className="h-10 w-10 bg-white/5 rounded-xl ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                   <td colSpan="4" className="px-8 py-24 text-center">
                     <div className="flex flex-col items-center gap-4 opacity-30">
                        <UsersIcon className="w-16 h-16" />
                        <p className="text-sm font-black uppercase tracking-widest">No users found matching query</p>
                     </div>
                   </td>
                </tr>
              ) : filteredUsers.map((u) => (
                <tr key={u._id} className={cn(
                  "group transition-all hover:bg-white/[0.015]",
                  currentUser?._id === u._id && "bg-primary/[0.03]"
                )}>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-tr from-[#1a1a1a] to-[#222] border border-white/10 flex items-center justify-center text-lg font-black text-white relative shadow-xl group-hover:scale-110 transition-transform duration-500 uppercase">
                        {u.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        {currentUser?._id === u._id && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-[#0d0d0d] flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-base font-black tracking-tight text-white flex items-center gap-2">
                           {u.name}
                           {u.role === 'superadmin' && <Shield className="w-3.5 h-3.5 text-purple-500 fill-purple-500/10" />}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium leading-none">
                           <Mail className="w-3.5 h-3.5 text-primary/60" /> {u.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                     {currentUser?._id === u._id || u.role === 'superadmin' ? (
                        <span className={cn(
                          "px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-xl flex items-center gap-2 w-fit",
                          getRoleStyle(u.role)
                        )}>
                          <Lock className="w-3 h-3" /> {u.role}
                        </span>
                     ) : (
                        <div className="relative inline-block w-40">
                           <select 
                             value={u.role}
                             onChange={(e) => handleRoleChange(u._id, e.target.value)}
                             className={cn(
                               "w-full px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all appearance-none cursor-pointer outline-none bg-transparent hover:bg-white/5",
                               getRoleStyle(u.role)
                             )}
                           >
                             <option value="admin" className="bg-[#1a1a1a] text-white">Admin</option>
                             <option value="agent" className="bg-[#1a1a1a] text-white">Agent</option>
                           </select>
                           <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50 pointer-events-none" />
                        </div>
                     )}
                  </td>
                  <td className="px-8 py-8 text-xs font-bold text-muted-foreground flex items-center gap-2.5 mt-2">
                     <Calendar className="w-4 h-4 text-white/10" />
                     {new Date(u.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-8 text-right pr-12">
                     {currentUser?._id !== u._id && u.role !== 'superadmin' && (
                        <button 
                          onClick={() => setDeleteConfirmId(u._id)}
                          className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all group-hover:scale-110 border border-transparent hover:border-destructive/20 active:scale-95"
                        >
                           <Trash2 className="w-5 h-5" />
                        </button>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animation-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setDeleteConfirmId(null)} />
           <div className="relative bg-[#0d0d0d] border border-white/10 p-10 rounded-[2.5rem] max-w-md w-full shadow-2xl space-y-8 text-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-destructive animate-pulse"></div>
              <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto border border-destructive/20 relative">
                 <AlertTriangle className="w-10 h-10 text-destructive" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-black text-white uppercase tracking-tight">System Purge</h3>
                 <p className="text-sm text-muted-foreground leading-relaxed px-4 font-medium">
                   Are you sure you want to remove <span className="text-white font-bold">{users.find(u => u._id === deleteConfirmId)?.name}</span> from the repository? This action is irrevocable.
                 </p>
              </div>
              <div className="flex gap-4">
                 <button 
                   onClick={() => setDeleteConfirmId(null)}
                   className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded-2xl border border-white/10 transition-all active:scale-[0.98]"
                 >
                   Abort
                 </button>
                 <button 
                   onClick={() => handleDeleteUser(deleteConfirmId)}
                   className="flex-1 bg-destructive hover:bg-rose-600 text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded-2xl shadow-xl shadow-destructive/30 transition-all duration-300 active:scale-[0.98]"
                 >
                   Confirm Delete
                 </button>
              </div>
           </div>
        </div>
      )}
      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Users;
