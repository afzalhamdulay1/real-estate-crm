import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getLead, updateLead, resetLeads } from '../features/leads/leadSlice';
import { getUsers } from '../features/users/userSlice';
import { getProperties } from '../features/properties/propertySlice';
import {
  ChevronRight,
  Mail,
  Phone,
  Building2,
  User,
  Calendar,
  Clock,
  Phone as PhoneIcon,
  Users,
  MapPin,
  Activity as ActivityIcon,
  Edit2,
  Save,
  ShieldCheck,
  Loader2,
  ArrowLeft,
  LayoutGrid,
  Trophy,
  CheckCircle,
  Gem,
  DollarSign,
  AlertTriangle,
  Home
} from 'lucide-react';
import SearchableSelect from '../components/SearchableSelect';
import { toast } from 'react-hot-toast';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import confetti from 'canvas-confetti';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const EditableField = ({ label, value, onSave, icon: Icon, type = "text" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleSave = (e) => {
    if (e) e.stopPropagation();
    if (currentValue !== value) {
      onSave(currentValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentValue(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave(e);
    else if (e.key === 'Escape') handleCancel();
  };

  return (
    <div className="space-y-1.5 group/field">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-primary/60" /> {label}
      </label>
      {isEditing ? (
        <div className="relative flex items-center gap-2">
          <input
            autoFocus
            type={type}
            value={currentValue || ''}
            onChange={(e) => setCurrentValue(e.target.value)}
            onBlur={(e) => {
              if (!e.relatedTarget?.classList.contains('save-btn')) handleCancel();
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-white/10 border border-primary/50 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium pr-10"
          />
          <button
            type="button"
            onMouseDown={handleSave}
            className="save-btn absolute right-2 p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg text-emerald-500 transition-all cursor-pointer hover:scale-110 active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="w-full bg-white/5 border border-transparent rounded-xl px-4 py-2 text-sm text-white flex items-center justify-between group transition-all">
          <span className="truncate font-medium">{value || 'Not provided'}</span>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/20 group-hover:text-primary transition-all cursor-pointer opacity-0 group-hover:opacity-100"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

const LeadProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentLead: lead, isLoading, isError, message } = useSelector((state) => state.leads);
  const { users } = useSelector((state) => state.users);
  const { properties } = useSelector((state) => state.properties);

  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  useEffect(() => {
    dispatch(getLead(id));
    if (users.length === 0) dispatch(getUsers());
    if (properties.length === 0) dispatch(getProperties());

    return () => dispatch(resetLeads());
  }, [id, dispatch]);

  const handleUpdate = (field, value) => {
    // 🛡️ FINANCIAL VALIDATION: Block closure if price is missing
    if (field === 'status' && value === 'Closed') {
      if (!lead.dealValue || lead.dealValue <= 0) {
        toast.error('Financial Block: Please enter an "Agreed Closing Price" before finalizing this deal.', {
          icon: '💰',
          duration: 4000
        });
        return;
      }
      
      setPendingStatus(value);
      setIsCloseModalOpen(true);
      return;
    }

    dispatch(updateLead({ id, leadData: { [field]: value } }))
      .then((res) => {
        if (!res.error) toast.success('Update successful');
        else toast.error('Update failed');
      });
  };

  const confirmClose = () => {
    dispatch(updateLead({ id, leadData: { status: pendingStatus } }))
      .then((res) => {
        if (!res.error) {
          toast.success('Lead Closed & Property Sold! 🎉');
          // 🎊 LAUNCH CELEBRATION
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#3b82f6', '#8b5cf6']
          });
        }
        else toast.error('Failed to close lead');
      });
    setIsCloseModalOpen(false);
    setPendingStatus(null);
  };

  const agentOptions = [
    { value: '', label: 'Unassigned' },
    ...users
      .filter(u => ['admin', 'superadmin', 'agent'].includes(u.role))
      .map(u => ({ value: u._id, label: `${u.name} (${u.role.toUpperCase()})` }))
  ];

  const propertyOptions = [
    { value: '', label: 'No Interest' },
    ...properties.map(p => ({ value: p._id, label: p.title }))
  ];

  const typeIcons = {
    Call: <PhoneIcon className="w-3.5 h-3.5" />,
    Email: <Mail className="w-3.5 h-3.5" />,
    Meeting: <Users className="w-3.5 h-3.5" />,
    'Site Visit': <MapPin className="w-3.5 h-3.5" />,
    Other: <ActivityIcon className="w-3.5 h-3.5" />,
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

  if (isLoading && !lead) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-[#0a0a0a]">
        <h2 className="text-2xl font-bold text-white mb-2">Lead Retrieval Failed</h2>
        <p className="text-muted-foreground mb-8 max-w-md">{message}</p>
        <button onClick={() => navigate('/leads')} className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-bold transition-all border border-white/5">
          Return to Directory
        </button>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden p-6 md:p-10 space-y-8 max-w-[1500px] mx-auto bg-[#0a0a0a]">

      {/* Descriptive Breadcrumbs */}
      <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground bg-white/[0.02] w-fit px-5 py-2.5 rounded-xl border border-white/5">
        <Link to="/" className="hover:text-emerald-400 transition-colors flex items-center gap-2 group">
           <Home className="w-3.5 h-3.5 group-hover:text-emerald-400 transition-colors" /> Home
        </Link>
        <ChevronRight className="w-3 h-3 opacity-20" />
        <Link to="/leads" className="hover:text-emerald-400 transition-colors flex items-center gap-2 group">
           <Users className="w-3.5 h-3.5 group-hover:text-emerald-400 transition-colors" /> All Leads
        </Link>
        <ChevronRight className="w-3 h-3 opacity-20" />
        <span className="text-white">Profile Details</span>
        <ChevronRight className="w-3 h-3 opacity-20" />
        <span className="text-primary truncate font-black tracking-widest">{lead.name}</span>
      </nav>

      {/* Victory Banner for Closed Leads */}
      {lead.status === 'Closed' && (
        <div className="bg-gradient-to-r from-emerald-500/20 to-primary/20 border border-emerald-500/30 rounded-2xl p-6 flex items-center justify-between shadow-2xl animation-in zoom-in duration-500">
           <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                 <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-1">
                 <h2 className="text-2xl font-black text-white tracking-tight">Acquisition Successful!</h2>
                 <p className="text-sm text-emerald-400/80 font-bold uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Deal Finalized & Account Secured
                 </p>
              </div>
           </div>
           <div className="hidden md:flex items-center gap-3">
              <div className="px-5 py-3 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">
                 Inventory Updated
              </div>
           </div>
        </div>
      )}

      {/* Header Info */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight text-white">{lead.name}</h1>
          <p className="text-xs text-muted-foreground font-black uppercase tracking-widest flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-primary/60" /> {lead.source} Acquisition
          </p>
        </div>

        {/* Dynamic Property Badge in Header */}
        <div className="w-full md:w-auto md:max-w-xs">
          {lead.property && (
            <Link
              to={`/properties?search=${lead.property.title}`}
              className="flex items-center gap-4 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-xl p-4 transition-all relative group/asset overflow-hidden"
            >
              {lead.status === 'Closed' && (
                <div className="absolute top-0 right-0 bg-emerald-500 px-3 py-1 rounded-bl-xl text-[8px] font-black text-white tracking-widest uppercase shadow-lg">
                  Sold Asset
                </div>
              )}
              <div className={cn(
                "w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border transition-transform group-hover/asset:scale-110",
                lead.status === 'Closed' ? "bg-emerald-500/20 border-emerald-500/20 text-emerald-500" : "bg-primary/20 border-primary/20 text-primary"
              )}>
                {lead.status === 'Closed' ? <Gem className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-white truncate">{lead.property.title}</p>
                <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {lead.property.location?.city}
                </p>
              </div>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* LEFT: Activity Timeline ONLY */}
          <div className="lg:col-span-7 space-y-8 bg-[#ffffff14] p-8 rounded-[10px] border border-white/5">
            <h2 className="text-[10px] font-black tracking-[0.3em] text-white uppercase border-b border-white/5 pb-6 flex items-center gap-3">
              <Clock className="w-4 h-4 text-primary" /> Activity Feed
            </h2>

            {(!lead.notes || lead.notes.length === 0) ? (
              <div className="text-center py-20 bg-white/[0.02] border border-white/5 border-dashed rounded-[2rem]">
                <ActivityIcon className="w-10 h-10 text-white/5 mx-auto mb-4" />
                <p className="text-sm font-bold text-white uppercase tracking-widest">No Interactions Logged</p>
              </div>
            ) : (
              <div className="space-y-4">
                {[...lead.notes].reverse().map((activity, index) => (
                  <div key={activity._id || index} className="relative pl-10 pb-8 group last:pb-0">
                    <div className="absolute left-[17px] top-4 bottom-0 w-[2px] bg-white/[0.03] group-last:bg-transparent" />
                    <div className="absolute left-0 top-1 w-9 h-9 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-center z-10 text-muted-foreground shadow-xl transition-all">
                      {typeIcons[activity.type] || <ActivityIcon className="w-3.5 h-3.5" />}
                    </div>

                    <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 hover:translate-x-1 transition-all">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                          <p className="text-base font-bold text-white tracking-tight">{activity.type}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                            {new Date(activity.date).toLocaleDateString()} • {activity.agent?.name || 'Automated'}
                          </p>
                        </div>
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                          activity.status === 'Completed' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                            activity.status === 'Follow-up' ? "bg-primary/10 text-primary border-primary/20" :
                              "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        )}>
                          {activity.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium bg-black/20 p-4 rounded-xl border border-white/5">
                        {activity.notes}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: All Editable Details */}
          <div className="lg:col-span-5 space-y-10">

            {/* Status Lifecycle Section (Explicitly editable) */}
            <section className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 space-y-6">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Lifecycle Update
              </label>
              <div className="flex flex-wrap gap-2">
                {['New', 'Contacted', 'Interested', 'Closed', 'Lost'].map(s => (
                  <button
                    key={s}
                    onClick={() => handleUpdate('status', s)}
                    className={cn(
                      "px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                      lead.status === s
                        ? getStatusColor(s) + " border-white/20 shadow-lg scale-105"
                        : "bg-white/5 border-transparent text-muted-foreground hover:bg-white/10"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </section>

            {/* Profile Information */}
            <section className="bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-8 space-y-8">
              <h3 className="text-[10px] font-black tracking-[0.2em] text-white uppercase flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-primary/60" /> Core Attributes
              </h3>

              <div className="space-y-6">
                <EditableField label="Full Name" value={lead.name} onSave={(val) => handleUpdate('name', val)} icon={User} />
                <EditableField label="Email Address" value={lead.email} onSave={(val) => handleUpdate('email', val)} icon={Mail} type="email" />
                <EditableField label="Phone Number" value={lead.phone} onSave={(val) => handleUpdate('phone', val)} icon={Phone} type="tel" />

                <div className="pt-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary/60" /> Responsible Agent
                  </label>
                  <SearchableSelect
                    options={agentOptions}
                    value={lead.assignedTo?._id || lead.assignedTo || ''}
                    onChange={(val) => handleUpdate('assignedTo', val)}
                    placeholder="Assign Agent"
                    searchPlaceholder="Search agents..."
                    icon={<ShieldCheck className="w-4 h-4 text-primary/60" />}
                  />
                </div>
              </div>
            </section>

            {/* Linked Inventory */}
            <section className="bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-8 space-y-6">
              <h3 className="text-[10px] font-black tracking-[0.2em] text-white uppercase flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-primary/60" /> Asset & Financials
              </h3>

              <div className="space-y-6">
                {lead.property && (
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground">
                         <DollarSign className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Listed Portfolio Price</span>
                        <span className="text-sm font-black text-amber-400 tracking-tight">${Number(lead.property.price).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1.5 text-left">
                  <EditableField
                    label="Agreed Closing Price"
                    value={lead.dealValue ? `$${Number(lead.dealValue).toLocaleString()}` : ''}
                    onSave={(val) => handleUpdate('dealValue', val.replace(/[^0-9.]/g, ''))}
                    icon={DollarSign}
                    type="number"
                  />
                  {lead.property && lead.dealValue > 0 && (
                    <div className="px-3 py-1.5 bg-black/20 rounded-lg border border-white/5 flex items-center justify-between">
                      <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Pricing Strategy</span>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest",
                        lead.dealValue >= lead.property.price ? "text-emerald-500" : "text-rose-500"
                      )}>
                        {lead.dealValue >= lead.property.price ? 'Above Ask' : 'Under Ask'} ({Math.abs(((lead.dealValue - lead.property.price) / lead.property.price) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 flex items-center gap-2 mb-2">
                    <Building2 className="w-3.5 h-3.5 text-primary/60" /> Targeted Property
                  </label>
                  <SearchableSelect
                    options={propertyOptions}
                    value={lead.property?._id || lead.property || ''}
                    onChange={(val) => handleUpdate('property', val)}
                    placeholder="Link Property"
                    searchPlaceholder="Search properties..."
                    icon={<Building2 className="w-4 h-4 text-primary/60" />}
                  />
                </div>
              </div>

              {lead.property && (
                <Link
                  to={`/properties?search=${lead.property.title}`}
                  className="flex items-center gap-4 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-xl p-4 transition-all relative group/asset overflow-hidden"
                >
                  {lead.status === 'Closed' && (
                    <div className="absolute top-0 right-0 bg-emerald-500 px-3 py-1 rounded-bl-xl text-[8px] font-black text-white tracking-widest uppercase shadow-lg">
                      Sold Asset
                    </div>
                  )}
                  <div className={cn(
                    "w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border transition-transform group-hover/asset:scale-110",
                    lead.status === 'Closed' ? "bg-emerald-500/20 border-emerald-500/20 text-emerald-500" : "bg-primary/20 border-primary/20 text-primary"
                  )}>
                    {lead.status === 'Closed' ? <Gem className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-bold text-white truncate">{lead.property.title}</p>
                    <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {lead.property.location?.city}
                    </p>
                  </div>
                </Link>
              )}
            </section>

          </div>
        </div>
      </main>

      {/* Modern Closure Confirmation Dialog */}
      {isCloseModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animation-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsCloseModalOpen(false)} />
           <div className="relative bg-[#0d0d0d] border border-white/10 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
              <div className="p-8 space-y-6">
                <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 shadow-xl shadow-amber-500/5">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white tracking-tight leading-none uppercase">Confirm Deal Closure?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-semibold">
                    Marking this lead as <span className="text-emerald-500 uppercase tracking-widest font-black">Closed</span> will automatically update its linked property status to <span className="text-white">"Sold"</span>. This cannot be undone easily.
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button 
                    onClick={confirmClose}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    Confirm & Mark as Sold
                  </button>
                  <button 
                    onClick={() => {
                      setIsCloseModalOpen(false);
                      setPendingStatus(null);
                    }}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-white/40 transition-all active:scale-95 border border-white/5"
                  >
                    Cancel Action
                  </button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LeadProfile;
