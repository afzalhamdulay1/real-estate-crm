import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getActivities } from '../features/activities/activitySlice';
import ActivityModal from '../components/ActivityModal';
import { 
  Phone, 
  Mail, 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  Plus, 
  Activity as ActivityIcon,
  Search,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Building2,
  ChevronRight,
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

const ActivityTimelineItem = ({ activity }) => {
  const typeIcons = {
    Call: <Phone className="w-4 h-4" />,
    Email: <Mail className="w-4 h-4" />,
    Meeting: <Users className="w-4 h-4" />,
    'Site Visit': <MapPin className="w-4 h-4" />,
    Other: <ActivityIcon className="w-4 h-4" />,
  };

  const statusColors = {
    Completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Follow-up': 'bg-primary/10 text-primary border-primary/20',
  };

  return (
    <div className="relative pl-10 pb-10 group">
      {/* Timeline connector line */}
      <div className="absolute left-[19px] top-1 bottom-0 w-[2px] bg-white/5 group-last:bg-transparent" />
      
      {/* Icon node */}
      <div className={cn(
        "absolute left-0 top-1 w-10 h-10 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-center z-10 text-muted-foreground group-hover:border-primary/50 group-hover:text-primary transition-all duration-300",
        activity.status === 'Completed' && "border-emerald-500/20 text-emerald-500"
      )}>
        {typeIcons[activity.type] || <ActivityIcon className="w-4 h-4" />}
      </div>

      <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-300 shadow-lg shadow-black/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                {activity.type} for {activity.lead?.name || 'Unknown Lead'}
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-50" />
              </h3>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5 ml-0.5">
                Logged by {activity.agent?.name} • {formatDate(activity.date)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
              statusColors[activity.status] || statusColors.Other
            )}>
              {activity.status}
            </span>
            <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <p className="text-sm text-gray-400 leading-relaxed font-medium capitalize">
            {activity.notes}
          </p>
        </div>

        {activity.lead?.property && (
          <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/10 rounded-lg w-fit">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold text-primary tracking-wide">
              Property Ref: {activity.lead.property.title || 'Linked Property'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const Activities = () => {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { activities, isLoading, isError, message } = useSelector((state) => state.activities);

  React.useEffect(() => {
    dispatch(getActivities());
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-[10px] uppercase">
            <Clock className="w-3.5 h-3.5" /> CRUM Activities
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white leading-tight">
            Activity Timeline
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
             Track every interaction across your sales pipeline.
          </p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] text-[10px] px-8 py-4 rounded-2xl shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5 bg-white/20 p-1 rounded-lg" />
          Log Activity
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
         <div className="relative flex-1 group">
            <Search className="absolute left-3.5 top-2.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Filter activities by lead name or type..." 
              className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all transition-all font-medium"
            />
         </div>
         <select className="bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-muted-foreground">
           <option>All Types</option>
           <option>Calls</option>
           <option>Emails</option>
           <option>Meetings</option>
         </select>
      </div>

      {/* Timeline */}
      <div className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : isError ? (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-10 text-center space-y-3">
             <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
             <p className="text-destructive font-bold text-sm tracking-tight">{message}</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-20 text-center space-y-5">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-white/5">
               <Clock className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">No activities yet</p>
              <p className="text-muted-foreground text-sm mt-1">Start tracking interactions by logging your first activity.</p>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            {activities.map((activity) => (
              <ActivityTimelineItem key={activity._id} activity={activity} />
            ))}
          </div>
        )}
      </div>

      <ActivityModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Activities;
