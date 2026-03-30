import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Building2, User, Calendar, Clock, Phone as PhoneIcon, Users, MapPin, Activity as ActivityIcon, Edit2, Check, ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { updateLead } from '../features/leads/leadSlice';
import { getUsers } from '../features/users/userSlice';
import { getProperties } from '../features/properties/propertySlice';
import SearchableSelect from './SearchableSelect';
import { toast } from 'react-hot-toast';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const EditableField = ({ label, value, onSave, icon: Icon, type = "text" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  // Sync state if external value changes (e.g., from server response)
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleSave = (e) => {
    e.stopPropagation();
    if (currentValue !== value) {
      onSave(currentValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentValue(value); // Restore original
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave(e);
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="space-y-1.5 group/field">
      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
        <Icon className="w-3 h-3 text-primary/60" /> {label}
      </label>
      {isEditing ? (
        <div className="relative flex items-center gap-2">
          <input
            autoFocus
            type={type}
            value={currentValue || ''}
            onChange={(e) => setCurrentValue(e.target.value)}
            onBlur={(e) => {
              // Only cancel if we didn't just click the save button
              if (!e.relatedTarget?.classList.contains('save-btn')) {
                handleCancel();
              }
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-white/10 border border-primary/50 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium pr-10"
          />
          <button 
            type="button" 
            onMouseDown={handleSave}
            className="save-btn absolute right-2 p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg text-emerald-500 transition-all cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="w-full bg-white/5 border border-transparent rounded-xl px-4 py-2 text-sm text-white flex items-center justify-between group transition-all">
          <span className="truncate font-medium">{value || 'Not provided'}</span>
          <button 
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/20 group-hover:text-primary transition-all cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

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

const LeadDetailsModal = ({ lead, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const { properties } = useSelector((state) => state.properties);
  const [localLead, setLocalLead] = useState(lead);

  useEffect(() => {
    if (isOpen) {
      setLocalLead(lead);
      if (users.length === 0) dispatch(getUsers());
      if (properties.length === 0) dispatch(getProperties());
    }
  }, [isOpen, lead, dispatch, users.length, properties.length]);

  const handleUpdate = (field, value) => {
    dispatch(updateLead({ id: lead._id, leadData: { [field]: value } }))
      .then((res) => {
        if (!res.error) {
          toast.success('Lead updated');
          setLocalLead({ ...localLead, [field]: value });
        } else {
          toast.error('Failed to update lead');
        }
      });
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

  return (
    <AnimatePresence>
      {isOpen && lead && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-2xl h-full bg-[#0a0a0a] border-l border-white/10 shadow-[-30px_0_60px_-15px_rgba(0,0,0,0.7)] flex flex-col"
          >

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#0f0f0f]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary/80 to-purple-600 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-primary/30 border border-white/10">
                  {lead.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
                    {lead.name}
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                      getStatusColor(lead.status)
                    )}>
                      {lead.status}
                    </span>
                  </h2>
                  <p className="text-xs text-muted-foreground font-medium mt-1">
                    Added on {new Date(lead.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">

              {/* Quick Stats / Status */}
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Lead Lifecycle
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {['New', 'Contacted', 'Interested', 'Closed', 'Lost'].map(s => (
                      <button
                        key={s}
                        onClick={() => handleUpdate('status', s)}
                        className={cn(
                          "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                          localLead?.status === s
                            ? getStatusColor(s) + " scale-105 border-white/20"
                            : "bg-white/5 border-transparent text-muted-foreground hover:bg-white/10"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3" /> Assigned Agent
                  </label>
                  <div className="w-full">
                    <SearchableSelect
                      options={agentOptions}
                      value={localLead?.assignedTo?._id || localLead?.assignedTo || ''}
                      onChange={(val) => handleUpdate('assignedTo', val)}
                      placeholder="Select Agent"
                      searchPlaceholder="Search agents..."
                      icon={<User className="w-3.5 h-3.5 text-primary/60" />}
                    />
                  </div>
                </div>
              </div>

              {/* Core Info Grid */}
              <div className="bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-8 space-y-10 relative overflow-visible text-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full -mr-16 -mt-16" />

                <div className="flex flex-col gap-8 relative z-10">
                  <EditableField
                    label="Full Name"
                    value={localLead?.name}
                    onSave={(val) => handleUpdate('name', val)}
                    icon={User}
                  />
                  <EditableField
                    label="Email Address"
                    value={localLead?.email}
                    onSave={(val) => handleUpdate('email', val)}
                    type="email"
                    icon={Mail}
                  />
                  <EditableField
                    label="Phone Number"
                    value={localLead?.phone}
                    onSave={(val) => handleUpdate('phone', val)}
                    type="tel"
                    icon={Phone}
                  />
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-primary/60" /> Interest Listing
                    </label>
                    <SearchableSelect
                      options={propertyOptions}
                      value={localLead?.property?._id || localLead?.property || ''}
                      onChange={(val) => handleUpdate('property', val)}
                      placeholder="Link Property"
                      searchPlaceholder="Search properties..."
                      icon={<MapPin className="w-3.5 h-3.5 text-primary/60" />}
                    />
                  </div>
                </div>
              </div>

              {/* Linked Property Preview */}
              {localLead?.property && (
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20 group-hover:rotate-6 transition-transform">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5">Focus Property</p>
                      <p className="text-sm font-bold text-white tracking-tight">{localLead.property.title || 'Property Detail Pending'}</p>
                      <p className="text-xs text-muted-foreground font-medium">{localLead.property.location?.city || 'Location N/A'}</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-white/5 opacity-50">
                    Asset View
                  </div>
                </div>
              )}

              {/* Activity Timeline */}
              <div className="space-y-6">
                <h3 className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase flex items-center gap-2 border-b border-white/5 pb-4">
                  <Clock className="w-3.5 h-3.5" /> Activity History
                </h3>

                {(!lead.notes || lead.notes.length === 0) ? (
                  <div className="text-center py-10 bg-white/5 border border-white/5 border-dashed rounded-2xl">
                    <ActivityIcon className="w-8 h-8 text-white/20 mx-auto mb-3" />
                    <p className="text-sm font-bold text-white">No activities yet</p>
                    <p className="text-xs font-medium text-muted-foreground mt-1">Activities logged for this lead will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-0 text-sm">
                    {lead.notes.map((activity, index) => (
                      <div key={activity._id || index} className="relative pl-8 pb-8 group last:pb-0">
                        {/* Line */}
                        <div className="absolute left-[15px] top-1 bottom-0 w-[2px] bg-white/5 group-last:bg-transparent" />

                        {/* Node */}
                        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#141414] border border-white/10 flex items-center justify-center z-10 text-muted-foreground text-[10px] shadow-lg">
                          {typeIcons[activity.type] || <ActivityIcon className="w-3.5 h-3.5" />}
                        </div>

                        {/* Content */}
                        <div className="bg-[#121212] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors">
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <div>
                              <p className="text-xs font-bold text-white">{activity.type}</p>
                              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                                {formatDate(activity.date)} • By {activity.agent?.name || 'Unknown'}
                              </p>
                            </div>
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                              activity.status === 'Completed' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                activity.status === 'Follow-up' ? "bg-primary/10 text-primary border-primary/20" :
                                  "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            )}>
                              {activity.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed font-medium">
                            {activity.notes}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeadDetailsModal;
