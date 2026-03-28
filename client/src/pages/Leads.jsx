import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLeads, deleteLead, resetLeads } from '../features/leads/leadSlice';
import { Users, Search, Filter, Download, Plus, MoreHorizontal, User, Mail, Phone, Calendar, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import LeadModal from '../components/LeadModal';
import { toast } from 'react-hot-toast';

const Leads = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  
  const dispatch = useDispatch();
  const { leads, isLoading, isError, isDeleteSuccess, message } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getLeads());
  }, [dispatch]);

  useEffect(() => {
    if (isDeleteSuccess) {
      toast.success('Lead deleted successfully');
      setDeleteConfirmId(null);
      dispatch(resetLeads());
    }
    if (isError && message) {
      toast.error(message);
      dispatch(resetLeads());
    }
  }, [isDeleteSuccess, isError, message, dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteLead(id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Contacted': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Interested': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Closed': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Lost': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Leads Management</h1>
          <p className="text-muted-foreground font-medium">Manage and track your potential property buyers efficiently.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform bg-white/20 p-1 rounded-lg" />
          <span>Create Lead</span>
        </button>
      </div>

      <div className="glass-card overflow-hidden border-white/5">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/[0.01]">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, email..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 hover:bg-white/5 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest transition-all">
                <Filter className="w-4 h-4 text-primary" /> Filter
             </button>
             <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 hover:bg-white/5 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest transition-all">
                <Download className="w-4 h-4 text-primary" /> Export
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#141414] text-muted-foreground uppercase text-[10px] font-black tracking-[0.2em] border-b border-white/5">
              <tr>
                <th className="px-6 py-6">Lead Name</th>
                <th className="px-6 py-6">Contact Details</th>
                <th className="px-6 py-6 text-center">Status</th>
                <th className="px-6 py-6">Created At</th>
                <th className="px-6 py-6 text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading && leads.length === 0 ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-5"><div className="h-10 w-40 bg-white/5 rounded-lg"></div></td>
                    <td className="px-6 py-5"><div className="h-10 w-48 bg-white/5 rounded-lg"></div></td>
                    <td className="px-6 py-5"><div className="h-6 w-20 bg-white/5 rounded-full mx-auto"></div></td>
                    <td className="px-6 py-5"><div className="h-6 w-32 bg-white/5 rounded-lg"></div></td>
                    <td className="px-6 py-5 text-right"><div className="h-8 w-8 bg-white/5 rounded-lg ml-auto"></div></td>
                  </tr>
                ))
              ) : leads.length === 0 ? (
                <tr>
                   <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-5">
                      <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/5">
                         <Users className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-white leading-tight">No leads found</p>
                        <p className="text-muted-foreground text-sm mt-1">Start by creating your first sales lead.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary/80 to-purple-600 flex items-center justify-center text-[11px] font-black shadow-lg shadow-primary/30 border border-white/10 group-hover:scale-110 transition-transform">
                        {lead.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-base tracking-tight leading-tight">{lead.name}</span>
                        <span className="text-[10px] text-muted-foreground font-black tracking-[0.1em] uppercase mt-0.5">{lead.source}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                        <Mail className="w-3.5 h-3.5 text-primary" /> {lead.email || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                        <Phone className="w-3.5 h-3.5 text-primary" /> {lead.phone || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${getStatusColor(lead.status)} shadow-sm`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-muted-foreground">
                      <Calendar className="w-4 h-4 text-white/20" />
                      {new Date(lead.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right pr-8">
                    <div className="flex items-center justify-end gap-2">
                      {isAdmin && (
                        <button 
                          onClick={() => setDeleteConfirmId(lead._id)}
                          className="p-2.5 hover:bg-destructive/10 rounded-xl transition-all text-muted-foreground hover:text-destructive border border-transparent hover:border-destructive/20 group/btn"
                        >
                          <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        </button>
                      )}
                      <button className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-muted-foreground hover:text-white border border-transparent hover:border-white/10">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Modern Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animation-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
           <div className="relative bg-[#0d0d0d] border border-white/10 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-destructive/10 rounded-2xl flex items-center justify-center border border-destructive/20 shrink-0">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">Delete Lead?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This action will permanently remove this lead and all associated activity records from the database. This cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 bg-white/[0.02] border-t border-white/5">
                <button 
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-white hover:bg-white/5 rounded-2xl border border-transparent hover:border-white/10 transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDelete(deleteConfirmId)}
                  disabled={isLoading}
                  className="bg-gradient-to-tr from-destructive to-rose-600 hover:scale-[1.03] active:scale-[0.97] text-white font-black uppercase tracking-[0.2em] text-[10px] px-8 py-3.5 rounded-2xl shadow-2xl shadow-destructive/40 transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:grayscale"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  Confirm Delete
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
